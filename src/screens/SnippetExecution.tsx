import { OutlinedInput } from "@mui/material";
import React, { useState } from "react";
import { ExecutionResponse, useExecuteSnippet } from "../utils/queries.tsx";

interface SnippetExecutionProps {
    code: string;
    onExecute: (content: string) => void;
    output: string[]; // Recibe output
    setOutput: React.Dispatch<React.SetStateAction<string[]>>; // Función para actualizar output
    errors: string[]; // Recibe errors
    setErrors: React.Dispatch<React.SetStateAction<string[]>>; // Función para actualizar errors
}

export const SnippetExecution = ({ code, output, setOutput, errors, setErrors }: SnippetExecutionProps) => {
    const [input, setInput] = useState<string>(code);
    const { mutate: executeSnippet, isLoading } = useExecuteSnippet(); // Usamos el hook

    const handleEnter = (event: { key: string }) => {
        const fullCode = code + "\n" + input;
        if (event.key === 'Enter') {
            // Ejecutar el snippet en el backend
            executeSnippet({ content: fullCode, languageVersion: "1.1" }, {
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
            {/*/!* Caja de salida (output) arriba del input *!/*/}
            {/*<Bòx flex={1} overflow={"none"} minHeight={200} bgcolor={"black"} color={"white"} code={output.join("\n")}>*/}
            {/*    /!* Mostramos la salida del código ejecutado en el editor *!/*/}
            {/*    <Editor*/}
            {/*        value={output.join("\n")}*/}
            {/*        padding={10}*/}
            {/*        onValueChange={(input) => setInput(input)} // Actualiza el input cuando cambia el valor*/}
            {/*        highlight={(input) => highlight(input, languages.js, "javascript")}*/}
            {/*        maxLength={1000}*/}
            {/*        style={{ fontFamily: "monospace", fontSize: 17 }}*/}
            {/*    />*/}
            {/*</Bòx>*/}
            {/* Caja de entrada debajo, reemplazando 'Type here...' al ejecutarse */}
            <OutlinedInput
                onKeyDown={handleEnter}
                value={input}
                onChange={(e) => setInput(e.target.value)} // Actualiza el estado de 'input' con el código del usuario
                placeholder={output.length > 0 ? "" : "Type here..."} // Reemplazamos el texto cuando haya salida
                fullWidth
                sx={{ marginTop: 2 }} // Añadimos un margen superior para que no se pegue a la caja de salida
            />
            {isLoading && <p>Executing...</p>} {/* Mensaje mientras se está ejecutando */}
            {errors.length > 0 && (
                <div style={{ color: "red" }}>
                    <h4>Errors:</h4>
                    <pre>{errors.join("\n")}</pre>
                </div>
            )}
        </>
    );
};
