import {OutlinedInput} from "@mui/material";
import {highlight, languages} from "prismjs";
import Editor from "react-simple-code-editor";
import {Bòx} from "../components/snippet-table/SnippetBox.tsx";
import {useState} from "react";
import {ExecutionResponse, useExecuteSnippet} from "../utils/queries.tsx";

interface SnippetExecutionProps {
    code: string;
    onExecute: (content: string) => void;
}

export const SnippetExecution = ({ code }: SnippetExecutionProps) => {
    const [input, setInput] = useState<string>(code);
    const [output, setOutput] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const { mutate: executeSnippet, isLoading } = useExecuteSnippet(); // Usamos el hook

    const handleEnter = (event: { key: string }) => {
        if (event.key === 'Enter') {
            // Ejecutar el snippet en el backend
            executeSnippet({ content: input, languageVersion: "1.1" }, {
                onSuccess: (executionResponse: ExecutionResponse) => {
                    // Actualiza el estado con la respuesta de la ejecución
                    setOutput(executionResponse.output);
                    setErrors(executionResponse.errors);
                },
                onError: (error: Error) => {
                    // Maneja los errores de la ejecución
                    setErrors([error.message || "An error occurred during execution."]);
                }
            });

            setInput(""); // Limpiar el input después de ejecutar
        }
    };

    return (
        <>
            <Bòx flex={1} overflow={"none"} minHeight={200} bgcolor={'black'} color={'white'} code={output.join("\n")}>
                <Editor
                    value={output.join("\n")}
                    padding={10}
                    onValueChange={(input) => setInput(input)}
                    highlight={(input) => highlight(input, languages.js, 'javascript')}
                    maxLength={1000}
                    style={{ fontFamily: "monospace", fontSize: 17 }}
                />
            </Bòx>
            <OutlinedInput
                onKeyDown={handleEnter}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type here"
                fullWidth
            />
            {isLoading && <p>Executing...</p>}  {/* Muestra un mensaje mientras se está ejecutando */}
            {errors.length > 0 && (
                <div style={{ color: 'red' }}>
                    <h4>Errors:</h4>
                    <pre>{errors.join("\n")}</pre>
                </div>
            )}
        </>
    );
};