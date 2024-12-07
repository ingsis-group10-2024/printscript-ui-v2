import {withNavbar} from "../components/navbar/withNavbar.tsx";
import {SnippetTable} from "../components/snippet-table/SnippetTable.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {SnippetDetail} from "./SnippetDetail.tsx";
import {Drawer} from "@mui/material";
import {useGetSnippets} from "../utils/queries.tsx";
import {usePaginationContext} from "../contexts/paginationContext.tsx";
import useDebounce from "../hooks/useDebounce.ts";

const HomeScreen = () => {
    const {id: paramsId} = useParams<{ id: string }>();
    const [searchTerm, setSearchTerm] = useState('');
    const [snippetId, setSnippetId] = useState<string | null>(null);
    const {page, page_size, count, handleChangeCount} = usePaginationContext();
    const {data, isLoading, refetch} = useGetSnippets(page, page_size, '');

    const [filteredSnippets, setFilteredSnippets] = useState(data?.snippets || []);

    useEffect(() => {
        if (data?.count && data.count !== count) {
            handleChangeCount(data.count);
        }
        setFilteredSnippets(data?.snippets || []); // Start with all snippets
    }, [count, data?.count, data?.snippets, handleChangeCount]);

    useEffect(() => {
        if (paramsId) {
            setSnippetId(paramsId);
        }
    }, [paramsId]);

    // Refetch data every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 10000);

        return () => clearInterval(interval);
    }, [refetch]);

    // Debounce for search
    useDebounce(() => {
        if (searchTerm) {
            const filtered = (data?.snippets || []).filter(snippet =>
                snippet.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSnippets(filtered);
        } else {
            setFilteredSnippets(data?.snippets || []);
        }
    }, [searchTerm], 800);

    const handleSearchSnippet = (snippetName: string) => {
        setSearchTerm(snippetName);
    };

    const handleCloseModal = () => setSnippetId(null);

    return (
        <>
            <SnippetTable
                loading={isLoading}
                handleClickSnippet={setSnippetId}
                snippets={filteredSnippets} // Show only filtered snippets
                handleSearchSnippet={handleSearchSnippet}
            />
            <Drawer open={!!snippetId} anchor={"right"} onClose={handleCloseModal}>
                {snippetId && <SnippetDetail handleCloseModal={handleCloseModal} id={snippetId} />}
            </Drawer>
        </>
    );
};

export default withNavbar(HomeScreen);
