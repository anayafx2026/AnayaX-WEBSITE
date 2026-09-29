import Link from "next/link";
import {projects} from "@/content/site";
import {MediaPlaceholder} from "./media-placeholder";

export function FeaturedProjects(){
  return <div>{projects.slice(0,3).map((project,index)=><article key={project.slug} className={`featured-project feature-${index+1}`}><Link href={`/work/${project.slug}`} className="featured-link" aria-label={`${project.title} — ${project.client}`}><div className="featured-left"><MediaPlaceholder kind={project.media} label={`${project.client} · detail`}/></div><div className="featured-right"><MediaPlaceholder kind="video" label={`${project.client} · film`}/></div><h3 className="featured-title">{project.title}</h3><div className="featured-caption"><span>{project.category}</span><span>{String(index+1).padStart(2,"0")} / 03</span></div></Link></article>)}</div>;
}
