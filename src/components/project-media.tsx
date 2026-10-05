import Image from "next/image";
import type {Project} from "@/content/site";
import {MediaPlaceholder} from "./media-placeholder";
export function ProjectMedia({project}:{project:Project}){
  return project.image?<Image className="project-image" src={project.image} alt={project.imageAlt??project.title} fill sizes="(max-width: 767px) 100vw, 60vw"/>:<MediaPlaceholder kind={project.media} label={project.client}/>;
}
