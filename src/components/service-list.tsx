"use client";
import Link from "next/link";
import {useEffect,useRef} from "react";
import {services} from "@/content/site";
import {MediaPlaceholder} from "./media-placeholder";
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
        el.addEventListener("pointerenter",enter);
        el.addEventListener("pointermove",move);
        teardown=()=>{
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
        teardown=()=>{io.disconnect();el.classList.remove("js-reveal");};
      }
    };
    setup();
    desktop.addEventListener("change",setup);
    return ()=>{desktop.removeEventListener("change",setup);teardown();};
  },[]);
  return <section className="service-list" aria-labelledby="service-list-title"><div className="service-list-heading"><p className="eyebrow">Services we offer / 06</p><h2 id="service-list-title">Every surface.<br/>One language.</h2><p>Choose a discipline to explore its scope, approach and related work.</p></div><ol ref={list}>{services.map(service=><li key={service.slug}><Link href={`/services/${service.slug}`}><span className="service-list-name">{service.title}</span><span className="sr-only">{service.line}</span></Link><div className="service-preview" aria-hidden="true"><MediaPlaceholder kind="foto" label={`${service.title} · vista previa`}/></div><p className="service-side service-side-left" aria-hidden="true">{service.capabilities.map(item=><span key={item}>{item}</span>)}</p><p className="service-side service-side-right" aria-hidden="true">{service.line}</p></li>)}</ol></section>;
}
