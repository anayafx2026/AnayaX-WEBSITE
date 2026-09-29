"use client";
import Link from "next/link";
import {useRef,useState} from "react";
import {services} from "@/content/site";
import {MediaPlaceholder} from "./media-placeholder";
import {useMotion} from "./site-experience";
function circularOffset(index:number,active:number){const total=services.length;let offset=index-active;if(offset>total/2)offset-=total;if(offset<-total/2)offset+=total;return offset;}
export function ServiceGallery(){
  const [active,setActive]=useState(2);const pointerStart=useRef<number|null>(null);const {paused}=useMotion();
  const change=(direction:number)=>setActive(index=>(index+direction+services.length)%services.length);
  return <section id="services" className="service-gallery" aria-labelledby="services-gallery-title">
    <header className="service-gallery-heading"><p className="eyebrow">Services</p><h2 id="services-gallery-title">Services we offer.</h2><p>Creative and technical direction for every surface, from the first frame to showtime.</p></header>
    <div className="service-gallery-window" role="region" aria-roledescription="carousel" aria-label="Service gallery" tabIndex={0} onKeyDown={event=>{if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();change(event.key==="ArrowLeft"?-1:1);}}} onPointerDown={event=>{pointerStart.current=event.clientX;}} onPointerUp={event=>{if(pointerStart.current!==null&&Math.abs(event.clientX-pointerStart.current)>45)change(event.clientX<pointerStart.current?1:-1);pointerStart.current=null;}} onPointerCancel={()=>{pointerStart.current=null;}}>
      <div className={`service-gallery-deck ${paused?"is-paused":""}`}>{services.map((service,index)=>{const offset=circularOffset(index,active);const depth=Math.abs(offset);return <button key={service.slug} type="button" className={`service-gallery-card service-gallery-offset-${offset} ${index===active?"is-active":""}`} style={{zIndex:20-depth}} onClick={()=>setActive(index)} aria-label={`Show ${service.title}`} aria-pressed={index===active}><span className="gallery-card-top"><span>{String(index+1).padStart(2,"0")}</span><span>{service.line}</span></span><MediaPlaceholder kind="foto" label={`${service.title} · gallery`}/><span className="gallery-card-explore" aria-hidden="true">Explore service <span>↗</span></span><span className="gallery-card-title">{service.title}</span></button>;})}</div>
    </div>
    <div className="service-gallery-controls"><button type="button" className="round-button" onClick={()=>change(-1)} aria-label="Previous service">←</button><button type="button" className="round-button" onClick={()=>change(1)} aria-label="Next service">→</button></div>
    <Link href="/services" className="gallery-all-link">View all services <span aria-hidden="true">↗</span></Link>
  </section>;
}
