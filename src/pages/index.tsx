import {type NextPage} from "next";
import Head from "next/head";
import Link from "next/link";
import {Button} from "@mantine/core";
import {useEffect, useState} from "react";

const Home: NextPage = () => {
    const [draw, setDraw] = useState<boolean>(false);

    useEffect(() => {
        setDraw(true);
    }, [])

    return (
        <>
            <Head>
                <title>CompSci like im five</title>
                <meta name="description" content="Analyze computer science papers"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main
                className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#577D86] to-[#B9EDDD]">
                    <div
                        className={`text-center relative transition-opacity duration-1000 ${draw ? 'opacity-100' : 'opacity-0'}`}>
                        <h1 className="text-5xl font-bold text-white mb-8 mt-16">CompSci Like Im Five</h1>
                        <p className="text-sm text-white mb-12">Explaining computer science papers so well, a five year
                            old could understand.</p>
                        <Link href={"/paper-import"}>
                            <Button className={"bg-gray-700 hover:bg-gray-800"}>
                                <p>Lets get started</p>
                            </Button>
                        </Link>
                    </div>
            </main>
        </>
    );
};

export default Home;
