"use client";
import {useEffect,useRef} from "react";
import Link from "next/link";

type Topic={title:string;summary:string};
const ramp=(v:number,a:number,b:number)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t);};

// A pinned stage: the video starts as a framed window and grows until it covers the screen while the page scrolls.
export function ServiceFeature({topics,video="/videos/services-hero.mp4"}:{topics:readonly Topic[];video?:string|readonly string[]}){
 const sources=typeof video==="string"?[video]:video;
 const section=useRef<HTMLElement>(null),frame=useRef<HTMLDivElement>(null),copy=useRef<HTMLDivElement>(null),media=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const target=section.current,box=frame.current,text=copy.current;
  if(!target||!box||!text)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  let raf=0;
  const update=()=>{
   raf=0;
   const travel=Math.max(1,target.offsetHeight-innerHeight);
   const p=reduced.matches?1:Math.min(1,Math.max(0,-target.getBoundingClientRect().top/travel));
   const grow=ramp(p,.02,.26);
   const inset=(1-grow);
   box.style.clipPath=`inset(${inset*6}svh ${inset*8}vw ${inset*6}svh ${inset*8}vw round ${inset*16}px)`;
   const v=media.current;if(v)v.style.transform=`scale(${1.06-.06*grow})`;
   const show=ramp(p,.26,.44);
   text.style.opacity=String(show);text.style.transform=`translateY(${(1-show)*28}px)`;text.style.filter=show<.99?`blur(${(1-show)*10}px)`:"";
   text.style.visibility=show<=.001?"hidden":"visible";
  };
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};
  update();addEventListener("scroll",schedule,{passive:true});addEventListener("resize",schedule);reduced.addEventListener("change",schedule);
  return()=>{cancelAnimationFrame(raf);removeEventListener("scroll",schedule);removeEventListener("resize",schedule);reduced.removeEventListener("change",schedule);};
 },[]);
 return <section ref={section} className="service-feature" aria-labelledby="service-what-we-do">
  <div className="service-feature-stage">
   <div ref={frame} className="service-feature-frame">
    <div ref={media} className={`service-feature-media${sources.length>1?" is-split":""}`}>{sources.map(src=><video disablePictureInPicture key={src} src={src} autoPlay muted loop playsInline preload="metadata" aria-hidden="true"/>)}</div>
    <div className="service-feature-shade" aria-hidden="true"/>
   </div>
   <div ref={copy} className="service-feature-copy">
    <h2 id="service-what-we-do">What we do</h2>
    <ul>{topics.map(topic=><li key={topic.title}><h3>{topic.title}</h3><p>{topic.summary}</p></li>)}</ul>
    <Link className="pill-link" href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link>
   </div>
  </div>
 </section>;
}
