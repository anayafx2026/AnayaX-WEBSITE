import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {services} from "@/content/site";
import {ServiceFeature} from "@/components/service-feature";
import {serviceVideos} from "@/content/service-videos";
export const dynamicParams=false;
export function generateStaticParams(){return services.map(service=>({slug:service.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const service=services.find(item=>item.slug===slug);return {title:service?.title??"Service",description:service?.description,alternates:{canonical:`/services/${slug}`}};}
export default async function ServicePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const service=services.find(item=>item.slug===slug);if(!service)notFound();return <main id="contenido" tabIndex={-1} className="service-page"><header className="page-intro service-intro"><h1>{service.line}</h1><p className="lead">{service.description}</p><p className="scroll-cue" aria-hidden="true">scroll<span>↓</span></p></header><ServiceFeature topics={service.subServices} video={serviceVideos[service.slug]}/></main>;}
