"use client";
import {useState} from "react";
import Link from "next/link";
import {projects} from "@/content/site";
import {ProjectMedia} from "./project-media";

export function ElasticGallery({limit=projects.length}:{limit?:number}){
  const [active,setActive]=useState(0);
  const galleryProjects=projects.slice(0,limit);
  return <div className="elastic-gallery" onMouseLeave={()=>setActive(0)}>
    {galleryProjects.map((project,index)=>(
      <Link key={project.slug} href={`/work/${project.slug}`}
        className={`elastic-panel${active===index?" is-active":""}`}
        onMouseEnter={()=>{if(window.matchMedia("(hover: hover)").matches)setActive(index);}}
        onFocus={event=>{if(event.currentTarget.matches(":focus-visible"))setActive(index);}}
        onClick={event=>{if(active!==index&&window.matchMedia("(hover: none)").matches){event.preventDefault();setActive(index);}}}
        aria-label={`${project.title}  ·  ${project.client}`}>
        <div className="elastic-media"><ProjectMedia project={project}/></div>
        <div className="elastic-overlay">
          <span className="elastic-chip">{project.category}</span>
          <h3 className="elastic-title">{project.title}</h3>
          <span className="elastic-cta">View project <span aria-hidden="true">↗</span></span>
        </div>
        <span className="elastic-label" aria-hidden="true">{project.title}</span>
      </Link>
    ))}
  </div>;
}
