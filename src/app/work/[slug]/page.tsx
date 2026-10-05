import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {projects,services} from "@/content/site";
import {ProjectMedia} from "@/components/project-media";
export const dynamicParams=false;
export function generateStaticParams(){return projects.map(project=>({slug:project.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const project=projects.find(item=>item.slug===slug);return {title:project?.title??"Project",description:project?.description,alternates:{canonical:`/work/${slug}`}};}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
const {slug}=await params;const index=projects.findIndex(item=>item.slug===slug);const project=projects[index];if(!project)notFound();const next=projects[(index+1)%projects.length]??project;
return <main id="contenido" tabIndex={-1}><header className="project-intro"><p className="eyebrow">{project.category}</p><h1>{project.title}</h1></header>{project.image&&<div className="project-hero"><ProjectMedia project={project}/></div>}<section className="case-description"><h2>The project</h2><div><p>{project.description}</p><div className="project-tags">{project.services.map(service=>{const match=services.find(item=>item.title===service);return <Link href={match?`/services/${match.slug}`:"/services"} key={service}><span>{service}</span></Link>;})}</div></div></section><Link className="next-project" href={`/work/${next.slug}`}><span>Next project</span><h2>{next.title} ↗</h2></Link></main>;
}
