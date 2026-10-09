"use client";
import Link from "next/link";
import {useEffect,useRef} from "react";
import {serviceMenu as services} from "@/content/site";
import {previewVideo} from "@/content/service-videos";
export function ServiceList(){
  const list=useRef<HTMLOListElement>(null);
  useEffect(()=>{
    const el=list.current;
    if(!el) return;
    const desktop=matchMedia("(hover: hover) and (min-width: 1200px)");
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    let teardown=()=>{};
    const setup=()=>{
      teardown();
      if(desktop.matches){
        let x=0,y=0,tx=0,ty=0,frame=0;
        const paint=()=>{el.style.setProperty("--mx",`${x}px`);el.style.setProperty("--my",`${y}px`);};
        const step=()=>{
          frame=0;
          const k=reduced.matches?1:.18;
          x+=(tx-x)*k;y+=(ty-y)*k;paint();
          if(Math.abs(tx-x)>.5||Math.abs(ty-y)>.5) frame=requestAnimationFrame(step);
        };
        const enter=(event:PointerEvent)=>{x=tx=event.clientX;y=ty=event.clientY;paint();};
        const move=(event:PointerEvent)=>{tx=event.clientX;ty=event.clientY;if(!frame) frame=requestAnimationFrame(step);};
        const play=(event:Event)=>{const v=(event.currentTarget as HTMLElement).querySelector("video");void v?.play().catch(()=>{});};
        const stop=(event:Event)=>{(event.currentTarget as HTMLElement).querySelector("video")?.pause();};
        const items=Array.from(el.children);
        items.forEach(item=>{item.addEventListener("pointerenter",play);item.addEventListener("pointerleave",stop);item.addEventListener("focusin",play);item.addEventListener("focusout",stop);});
        el.addEventListener("pointerenter",enter);
        el.addEventListener("pointermove",move);
        teardown=()=>{
          items.forEach(item=>{item.removeEventListener("pointerenter",play);item.removeEventListener("pointerleave",stop);item.removeEventListener("focusin",play);item.removeEventListener("focusout",stop);item.querySelector("video")?.pause();});
          el.removeEventListener("pointerenter",enter);
          el.removeEventListener("pointermove",move);
          cancelAnimationFrame(frame);
          el.style.removeProperty("--mx");
          el.style.removeProperty("--my");
        };
      }else{
        el.classList.add("js-reveal");
        const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
          if(entry.isIntersecting){entry.target.classList.add("is-lit");io.unobserve(entry.target);}
        }),{threshold:.3});
        Array.from(el.children).forEach(item=>io.observe(item));
        const vio=new IntersectionObserver(entries=>entries.forEach(entry=>{const v=entry.target.querySelector("video");if(!v)return;if(entry.isIntersecting&&!reduced.matches)void v.play().catch(()=>{});else v.pause();}),{threshold:.4});
        Array.from(el.children).forEach(item=>vio.observe(item));
        teardown=()=>{io.disconnect();vio.disconnect();el.classList.remove("js-reveal");};
      }
    };
    setup();
    desktop.addEventListener("change",setup);
    return ()=>{desktop.removeEventListener("change",setup);teardown();};
  },[]);
  return <section className="service-list" aria-labelledby="service-list-title"><div className="service-list-heading"><h2 id="service-list-title">Every surface.<br/>One language.</h2><p className="scroll-cue" aria-hidden="true">scroll<span>↓</span></p><p>Choose a discipline to explore its scope, approach and related work.</p></div><ol ref={list}>{services.map(service=><li key={service.slug}><Link href={service.href}><span className="service-list-name">{service.title}</span><span className="sr-only">{service.line}</span></Link><div className="service-preview" aria-hidden="true">{service.previewSlug===null?<div className="service-video-blank"/>:<video disablePictureInPicture src={previewVideo(service.previewSlug)} muted loop playsInline preload="metadata" tabIndex={-1}/>}</div><p className="service-side service-side-left" aria-hidden="true">{service.capabilities.map(item=><span key={item}>{item}</span>)}</p><p className="service-side service-side-right" aria-hidden="true">{service.line}</p></li>)}</ol></section>;
}
