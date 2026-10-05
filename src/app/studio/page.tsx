import type {Metadata} from "next";
import {StudioStory} from "@/components/studio-story";

export const metadata:Metadata={title:"Studio",description:"Our studio in Los Angeles sits inside The Core, a shared creative space, and ANAYAFX is the technical team that runs The Core.",alternates:{canonical:"/studio"}};

export default function StudioPage(){return <main id="contenido" tabIndex={-1} className="studio-page">
  <StudioStory/>
</main>;}
