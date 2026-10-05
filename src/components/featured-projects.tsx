import Link from "next/link";
import {projects} from "@/content/site";
import Image from "next/image";
import {MediaPlaceholder} from "./media-placeholder";
import {FeaturedVideo} from "./featured-video";

// Real media for the home highlights (public/home). Rows without an entry keep their placeholders.
const media:Record<string,{photo:string;photoAlt:string;video:string;poster:string}>={
  "coachella":{photo:"/home/coachella.webp",photoAlt:"Coachella stage production",video:"/home/coachella.mp4",poster:"/home/coachella-poster.jpg"},
  "eagles-sphere":{photo:"/home/sphere.webp",photoAlt:"The Eagles live at Sphere, Las Vegas",video:"/home/sphere.mp4",poster:"/home/sphere-poster.jpg"},
  "xr-stage-los-angeles":{photo:"/projects/xrstage_01.webp",photoAlt:"Virtual production setup at XR Stage Los Angeles",video:"/home/xr-stage.mp4",poster:"/home/xr-stage-poster.jpg"},
};

export function FeaturedProjects(){
  const labels={coachella:"Coachella","eagles-sphere":"Live at sphere","xr-stage-los-angeles":"XR STAGE"};
  return <div>{["coachella","eagles-sphere","xr-stage-los-angeles"].flatMap(slug=>projects.filter(project=>project.slug===slug)).map((project,index)=>{const label=labels[project.slug as keyof typeof labels]??project.title;const item=media[project.slug];return <article key={project.slug} className={`featured-project feature-${index+1}`}><Link href={`/work/${project.slug}`} className="featured-link" aria-label={`${label}  ·  ${project.client}`}><div className="featured-left">{item?<div className="featured-media"><Image src={item.photo} alt={item.photoAlt} fill sizes="(max-width: 767px) 100vw, 40vw"/></div>:<MediaPlaceholder kind={project.media} label={`${project.client} · detail`}/>}</div><div className="featured-right">{item?<div className="featured-media"><FeaturedVideo src={item.video} poster={item.poster}/></div>:<MediaPlaceholder kind="video" label={`${project.client} · film`}/>}</div><h3 className="featured-title">{label}</h3><div className="featured-caption"><span>{project.category}</span><span>{String(index+1).padStart(2,"0")} / 03</span></div></Link></article>;})}</div>;
}
