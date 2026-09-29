import type {Metadata} from "next";
import {ServiceList} from "@/components/service-list";
export const metadata:Metadata={title:"Services",description:"Content, audio, projection, show direction, XR, immersive experiences and media server systems.",alternates:{canonical:"/services"}};
export default function ServicesPage(){return <main id="contenido" tabIndex={-1} className="services-page"><h1 className="sr-only">Services</h1><ServiceList/></main>;}
