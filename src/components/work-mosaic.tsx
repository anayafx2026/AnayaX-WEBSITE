"use client";
import Link from "next/link";
import {useState} from "react";
import {projects,workFilters} from "@/content/site";
import {ProjectMedia} from "./project-media";
export function WorkMosaic(){
  const [filter,setFilter]=useState("All");
  const visible=projects.filter(project=>filter==="All"||project.filter===filter);
  return <><div className="filter-bar" aria-label="Filter projects">{["All",...workFilters].map(label=><button type="button" key={label} aria-pressed={filter===label} onClick={()=>setFilter(label)}>{label}</button>)}</div><p className="sr-only" role="status">{visible.length} projects</p><section className={`work-mosaic${filter!=="All"?" is-filtered":""}`} aria-label="Project gallery">{visible.map((project,index)=><Link key={project.slug} href={`/work/${project.slug}`} className={`work-mosaic-card work-mosaic-card-${index+1}`} aria-label={project.title}><ProjectMedia project={project}/><span className="work-mosaic-caption"><span>{String(projects.indexOf(project)+1).padStart(2,"0")}</span><span>{project.title}</span><span>{project.category}</span></span></Link>)}</section></>;
}
