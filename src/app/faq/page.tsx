import type {Metadata} from "next";
import {FaqList} from "@/components/faq-list";
export const metadata:Metadata={title:"FAQs",description:"A few useful answers before we start a project.",alternates:{canonical:"/faq"}};
export default function FaqPage(){return <main id="contenido" tabIndex={-1}><header className="page-intro"><h1>A few good questions.</h1><p className="lead">Some useful things to know before we begin.</p></header><section className="faq-section" aria-label="Frequently asked questions"><FaqList/></section></main>;}
