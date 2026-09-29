"use client";
import {Button} from "@/components/ui/button";
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <main id="contenido" className="container message-page" tabIndex={-1}><h1>Something went off script.</h1><p>Give it another try in a moment.</p><Button onClick={reset}>Try again</Button></main>;}
