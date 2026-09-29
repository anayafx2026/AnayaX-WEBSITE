import Link from "next/link";
import type {Project} from "@/content/site";
import {MediaPlaceholder} from "./media-placeholder";
export function ProjectCard({project}:{project:Project}){return <Link href={`/work/${project.slug}`} className="project-card" aria-label={`${project.title} — ${project.client}`}><div className="project-visual"><MediaPlaceholder kind={project.media} label={project.client}/><div className="project-overlay"><h3>{project.title}</h3><span className="project-arrow" aria-hidden="true">↗</span></div><span className="project-client">{project.client}</span></div><div className="project-tags">{project.services.map(service=><span key={service}>{service}</span>)}</div></Link>;}
