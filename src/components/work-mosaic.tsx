import Link from "next/link";
import Image from "next/image";
import {projects,workMediaPreviews} from "@/content/site";
import {ProjectMedia} from "./project-media";
export function WorkMosaic(){
  return <section className="work-mosaic" aria-label="Project gallery">{projects.map((project,index)=>{
    const preview=project.mediaCollection?workMediaPreviews[project.mediaCollection]:undefined;
    return <Link key={project.slug} href={`/work/${project.slug}`} className={`work-mosaic-card work-mosaic-card-${index+1}`} aria-label={project.title}>{preview?<Image className="project-image" src={preview} alt={project.imageAlt??`${project.title} project still`} fill sizes="(max-width: 767px) 100vw, 60vw"/>:<ProjectMedia project={project}/>}<span className="work-mosaic-caption"><span>{String(index+1).padStart(2,"0")}</span><span>{project.title}</span><span>{project.category}</span></span></Link>;
  })}</section>;
}
