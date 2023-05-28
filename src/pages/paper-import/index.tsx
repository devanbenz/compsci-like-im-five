import {type NextPage} from "next";
import {type ChangeEvent, useEffect, useRef, useState} from "react";
import {Button, Loader, TextInput} from "@mantine/core";
import * as pdfjs from 'pdfjs-dist';
import {type TextItem, type TextMarkedContent} from "pdfjs-dist/types/src/display/api";
import {api} from "~/utils/api";
import {PROMPT_STUB} from "~/constants";
import {useForm} from "@mantine/form";
pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.js';


export const PaperImport: NextPage = () => {
    const [draw, setDraw] = useState<boolean>(false);
    const [apiKey, setApiKey] = useState<string>();
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setDraw(true);
    }, [])

    const mutation = api.analyze.analyze.useMutation();

    function handleButtonClick() {
        fileInput.current?.click();
    }

    async function handleFileImport(event: ChangeEvent<HTMLInputElement>) {
        let pdfText = "";
        if (event.target.files) {
            const file = URL.createObjectURL(event.target.files[0] as File);
            const loadingState = pdfjs.getDocument(file);
            const pdf = await loadingState.promise;
            const pageCount = pdf.numPages;
                const page = await pdf.getPage(1);
                const content = await page.getTextContent();
                const strings = content.items.map((value: TextItem | TextMarkedContent) => {
                    const a = value as TextItem;
                    return a.str;
                });
                pdfText += strings.join(' ');
            const prompt = PROMPT_STUB + pdfText;
            mutation.mutate({ text: prompt, key: apiKey ?? "" })
        } else {
            throw new Error("Error with file");
        }
    }

    const form = useForm({
        initialValues: {
            key: ''
        }
    })

    return (
        <main
            className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#577D86] to-[#B9EDDD]">
            <div
                className={`text-center relative transition-opacity mb-10 duration-1000 ${draw ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className={'text-4xl mb-10'}>Import a paper so we can analyze it for you!</h1>
                { apiKey ? (
                    <>
                        <Button className={"bg-gray-700 hover:bg-gray-800 ml-2"} onClick={handleButtonClick}>Import via upload</Button>
                        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                        <input id="importer" className="hidden" type="file" onChange={handleFileImport} ref={fileInput} />
                        <Button className={"bg-gray-700 hover:bg-gray-800 ml-2"}>Import via link</Button>
                    </>
                    ): (
                        <>
                            <form onSubmit={form.onSubmit((values) => setApiKey(values.key))}>
                                <TextInput
                                    placeholder="OpenAI API key"
                                    withAsterisk
                                    {...form.getInputProps('key')}
                                />
                                <Button type="submit" mt="md" className={"bg-gray-700 hover:bg-gray-800 ml-2"}>Submit</Button>
                            </form>
                        </>
                )

                }

            </div>
            <div className="px-28">
            {mutation.isLoading && !mutation.data ? (
                <Loader color="cyan" />
            ) : (
                <>
                    <div className="text-center" >{mutation.data}</div>
                    {mutation.error && <div className="text-red-500">Something went wrong! You most likely provided an incorrect api key.</div>}
                </>
            )}
            </div>
        </main>
    )
}

export default PaperImport;
