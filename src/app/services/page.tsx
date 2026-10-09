import type {Metadata} from "next";
import {ServiceList} from "@/components/service-list";
export const metadata:Metadata={title:"Services",description:"Show programming and operation, content design and development, XR/AR virtual production, projection mapping, technical consulting and disguise server rentals.",alternates:{canonical:"/services"}};
export default function ServicesPage(){return <main id="contenido" tabIndex={-1} className="services-page"><h1 className="sr-only">Services</h1><ServiceList/></main>;}
