import {useEffect, useState} from "react";
import Editor from "react-simple-code-editor";
import {highlight, languages} from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css";
import {Alert, Box, CircularProgress, IconButton, Tooltip, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {
  useExecuteSnippet,
  useUpdateSnippetById
} from "../utils/queries.tsx";
import {useFormatSnippet, useGetSnippetById, useShareSnippet} from "../utils/queries.tsx";
import {Bòx} from "../components/snippet-table/SnippetBox.tsx";
import {BugReport, Delete, Download, PlayArrow, Save, Share, StopRounded} from "@mui/icons-material";
import {ShareSnippetModal} from "../components/snippet-detail/ShareSnippetModal.tsx";
import {TestSnippetModal} from "../components/snippet-test/TestSnippetModal.tsx";
import {Snippet} from "../utils/snippet.ts";
import {SnippetExecution} from "./SnippetExecution.tsx";
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import {queryClient} from "../App.tsx";
import {DeleteConfirmationModal} from "../components/snippet-detail/DeleteConfirmationModal.tsx";

type SnippetDetailProps = {
  id: string;
  handleCloseModal: () => void;
}

const DownloadButton = ({snippet}: { snippet?: Snippet }) => {
  if (!snippet) return null;

  const extension = snippet.extension || "ps";  // Use ps as default extension
  const file = new Blob([snippet.content], {type: 'text/plain'});

  return (
      <Tooltip title={"Download"}>
        <IconButton sx={{ cursor: "pointer" }}>
          <a
              download={`${snippet.name}.${extension}`} // Asegúrate de usar la extensión correcta
              target="_blank"
              rel="noreferrer"
              href={URL.createObjectURL(file)}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: 'flex',
                alignItems: 'center',
              }}
          >
            <Download />
          </a>
        </IconButton>
      </Tooltip>
  );
};

export const SnippetDetail = (props: SnippetDetailProps) => {
  const {id, handleCloseModal} = props;
  const [code, setCode] = useState(
      ""
  );
  const [shareModalOppened, setShareModalOppened] = useState(false)
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false)
  const [testModalOpened, setTestModalOpened] = useState(false);
  const [runSnippet, setRunSnippet] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const {data: snippet, isLoading} = useGetSnippetById(id);
  const {mutate: shareSnippet, isLoading: loadingShare} = useShareSnippet()
  const {mutate: formatSnippet, isLoading: isFormatLoading, data: formatSnippetData} = useFormatSnippet()
  const {mutate: updateSnippet, isLoading: isUpdateSnippetLoading} = useUpdateSnippetById({onSuccess: () => queryClient.invalidateQueries(['snippet', id])})
  const {mutate: executeSnippet, isLoading: isExecutingSnippet } = useExecuteSnippet();

  useEffect(() => {
    if (snippet) {
      setCode(snippet.content);
    }
  }, [snippet]);

  useEffect(() => {
    if (formatSnippetData) {
      setCode(formatSnippetData)
    }
  }, [formatSnippetData]);


  async function handleShareSnippet(userId: string) {
    shareSnippet({snippetId: id, userId})
  }

  const handleExecuteCode = (content: string) => {
    executeSnippet({ content, languageVersion: "1.1" }, {
      onSuccess: (executionResponse) => {
        console.log("Execution successful:", executionResponse);
        setOutput(executionResponse.output);
        setErrors(executionResponse.errors);
      },
      onError: (error: Error) => {
        console.error("Execution error:", error);
        setErrors([error.message || "An error occurred during execution."]);
      }
    });
  };

  return (
      <Box p={4} minWidth={'60vw'}>
        <Box width={'100%'} p={2} display={'flex'} justifyContent={'flex-end'}>
          <CloseIcon style={{ cursor: "pointer" }} onClick={handleCloseModal} />
        </Box>
        {
          isLoading ? (<>
            <Typography fontWeight={"bold"} mb={2} variant="h4">Loading...</Typography>
            <CircularProgress />
          </>) : <>
            <Typography variant="h4" fontWeight={"bold"}>{snippet?.name ?? "Snippet"}</Typography>
            <Box display="flex" flexDirection="row" gap="8px" padding="8px">
              <Tooltip title={"Share"}>
                <IconButton onClick={() => setShareModalOppened(true)}>
                  <Share />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Test"}>
                <IconButton onClick={() => setTestModalOpened(true)}>
                  <BugReport />
                </IconButton>
              </Tooltip>
              <DownloadButton snippet={snippet} />
              <Tooltip title={runSnippet ? "Stop execution" : "Run"}>
                <IconButton
                    onClick={() => {
                      handleExecuteCode(code);
                      setRunSnippet((prev) => !prev);
                    }}
                    disabled={isExecutingSnippet}
                >
                  {runSnippet ? <StopRounded /> : <PlayArrow />}
                </IconButton>
              </Tooltip>
              <Tooltip title={"Format"}>
                <IconButton onClick={() => formatSnippet(code)} disabled={isFormatLoading}>
                  <ReadMoreIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Save changes"}>
                <IconButton color={"primary"} onClick={() => updateSnippet({ id: id, updateSnippet: { content: code } })} disabled={isUpdateSnippetLoading || snippet?.content === code}>
                  <Save />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Delete"}>
                <IconButton onClick={() => setDeleteConfirmationModalOpen(true)}>
                  <Delete color={"error"} />
                </IconButton>
              </Tooltip>
            </Box>
            <Box display={"flex"} gap={2}>
              <Bòx flex={1} height={"fit-content"} overflow={"none"} minHeight={"500px"} bgcolor={'black'} color={'white'} code={code}>
                <Editor
                    value={code}
                    padding={10}
                    onValueChange={(newCode) => setCode(newCode)}
                    highlight={(code) => highlight(code, languages.js, "javascript")}
                    maxLength={1000}
                    style={{
                      minHeight: "500px",
                      fontFamily: "monospace",
                      fontSize: 17,
                    }}
                />
              </Bòx>
            </Box>
            <Box pt={1} flex={1} marginTop={2}>
              <Alert severity="info">Output</Alert>
              <Bòx flex={1} minHeight={"200px"} bgcolor={'black'} color={'white'} padding={2} overflow={'auto'} code={output.join("\n")}>
                {output.length > 0 ? (
                    <pre>{output.join("\n")}</pre>
                ) : (
                    <pre>Output here...</pre>
                )}
                {errors.length > 0 && <Alert severity="error">{errors.join("\n")}</Alert>}
              </Bòx>
              <SnippetExecution
                  code={code}
                  output={output}
                  setOutput={setOutput}
                  errors={errors}
                  setErrors={setErrors}
                  onExecute={handleExecuteCode}
              />
            </Box>
          </>
        }
        <ShareSnippetModal loading={loadingShare || isLoading} open={shareModalOppened}
                           onClose={() => setShareModalOppened(false)}
                           onShare={handleShareSnippet} />
        <TestSnippetModal open={testModalOpened} onClose={() => setTestModalOpened(false)} />
        <DeleteConfirmationModal open={deleteConfirmationModalOpen} onClose={() => setDeleteConfirmationModalOpen(false)} id={snippet?.id ?? ""} setCloseDetails={handleCloseModal} />
      </Box>
  );
};