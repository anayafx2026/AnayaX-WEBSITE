import type {Metadata} from "next";
import {WorkMosaic} from "@/components/work-mosaic";
export const metadata:Metadata={title:"Work",description:"A selection of live, spatial and screen-based experiences by Anaya FX.",alternates:{canonical:"/work"}};
export default function WorkPage(){return <main id="contenido" tabIndex={-1} className="work-page"><h1>Our work.</h1><p className="work-description">A selection of live, spatial and screen-based experiences by Anaya FX.</p><WorkMosaic/></main>;}
