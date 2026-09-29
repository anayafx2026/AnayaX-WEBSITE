"use client";
import {useState} from "react";
import {projects,services} from "@/content/site";
import {ProjectCard} from "./project-card";
export function WorkGrid(){const [filter,setFilter]=useState("All");const filtered=filter==="All"?projects:projects.filter(project=>project.services.includes(filter));return <><div className="filter-bar" role="group" aria-label="Filter projects by service">{["All",...services.map(service=>service.title)].map(title=><button key={title} onClick={()=>setFilter(title)} aria-pressed={filter===title}>{title}</button>)}</div><p className="results-count" role="status">{filtered.length} {filtered.length===1?'project':'projects'}{filter!=="All"?` · ${filter}`:""}</p><div className="project-grid">{filtered.map(project=><ProjectCard key={project.slug} project={project}/>)}</div></>;}
