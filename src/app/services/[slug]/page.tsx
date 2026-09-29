import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {services,projects} from "@/content/site";
import {MediaPlaceholder} from "@/components/media-placeholder";
import {ProjectCard} from "@/components/project-card";
export const dynamicParams=false;
export function generateStaticParams(){return services.map(service=>({slug:service.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const service=services.find(item=>item.slug===slug);return {title:service?.title??"Service",description:service?.description,alternates:{canonical:`/services/${slug}`}};}
export default async function ServicePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const service=services.find(item=>item.slug===slug);if(!service)notFound();return <main id="contenido" tabIndex={-1}><header className="page-intro"><p className="eyebrow">{service.fullTitle}</p><h1>{service.line}</h1><p className="lead">{service.description}</p></header><div className="service-detail-media"><MediaPlaceholder kind="foto" label={service.title}/></div><section className="capabilities"><h2>What we do</h2><ul>{service.subServices.map(item=><li key={item.title}><h3>{item.title}</h3><p>{item.summary}</p></li>)}</ul><Link className="pill-link" href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link></section><section className="work-section"><h2 className="section-title">Related work</h2><div className="project-grid">{projects.filter(project=>project.services.includes(service.title)).slice(0,4).map(project=><ProjectCard key={project.slug} project={project}/>)}</div></section></main>;}
