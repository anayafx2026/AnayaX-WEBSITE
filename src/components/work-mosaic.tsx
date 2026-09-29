import Link from "next/link";
import {projects} from "@/content/site";
import {MediaPlaceholder} from "./media-placeholder";

export function WorkMosaic(){
  return <section className="work-mosaic" aria-label="Project gallery">{projects.map((project,index)=><Link key={project.slug} href={`/work/${project.slug}`} className={`work-mosaic-card work-mosaic-card-${index+1}`} aria-label={`${project.title} — ${project.client}`}><MediaPlaceholder kind="foto" label={project.client}/><span className="work-mosaic-caption"><span>{String(index+1).padStart(2,"0")}</span><span>{project.title}</span><span>{project.category}</span></span></Link>)}</section>;
}
