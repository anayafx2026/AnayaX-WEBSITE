"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import type {CSSProperties} from "react";
import {services} from "@/content/site";
import {ServiceCardVideo} from "./service-card-video";

const COUNT=services.length;
const STEP=360/COUNT;

export function ServiceLoop(){
  const stage=useRef<HTMLDivElement>(null);
  const ring=useRef<HTMLDivElement>(null);
  const [front,setFront]=useState(0);

  useEffect(()=>{
    const el=stage.current,rg=ring.current;
    if(!el||!rg) return;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    let offset=0,angle=NaN,applied=NaN,visible=false,raf=0,shown=-1;
    const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(!visible) angle=NaN;});
    io.observe(el);
    const wheel=(event:WheelEvent)=>{
      // Anywhere over the carousel (cards or the gaps between them) the wheel spins it and the page does not scroll.
      if(Math.abs(event.deltaX)>Math.abs(event.deltaY)) return;
      event.preventDefault();
      const unit=event.deltaMode===1?16:event.deltaMode===2?innerHeight:1;
      offset-=event.deltaY*unit*.25;
    };
    el.addEventListener("wheel",wheel,{passive:false});
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      if(!visible) return;
      const box=el.getBoundingClientRect();
      const progress=Math.min(1,Math.max(0,(innerHeight-box.top)/(innerHeight+box.height)));
      const target=-progress*360+offset;
      angle=Number.isNaN(angle)||reduced.matches||Math.abs(target-angle)<.01?target:angle+(target-angle)*.12;
      if(angle!==applied){
        applied=angle;
        rg.style.transform=`rotateX(-6deg) rotateY(${angle.toFixed(2)}deg)`;
      }
      const index=((Math.round(-angle/STEP)%COUNT)+COUNT)%COUNT;
      if(index!==shown){shown=index;setFront(index);}
    };
    raf=requestAnimationFrame(tick);
    return ()=>{cancelAnimationFrame(raf);io.disconnect();el.removeEventListener("wheel",wheel);};
  },[]);

  return <section id="services-loop" className="service-loop" aria-labelledby="service-loop-title">
    <header className="service-gallery-heading"><p className="eyebrow">Services</p><h2 id="service-loop-title">Services we offer.</h2><p>Creative and technical direction for every surface, from the first frame to showtime.</p></header>
    <div ref={stage} className="service-loop-stage" style={{"--n":COUNT} as CSSProperties} role="region" aria-label="Service carousel">
      <div ref={ring} className="service-loop-ring">
        {services.map((service,index)=>(
          <Link key={service.slug} href={`/services/${service.slug}`} className={`service-loop-card${index===front?" is-front":""}`} style={{"--i":index} as CSSProperties} aria-label={service.title}>
            <ServiceCardVideo slug={service.slug} active={index===front}/>
            <span className="service-loop-top"><span>{String(index+1).padStart(2,"0")}</span><span>{service.capabilities[0]}</span></span>
            <span className="service-loop-title">{service.title}</span>
          </Link>
        ))}
      </div>
    </div>
    <Link href="/services" className="gallery-all-link">View all services <span aria-hidden="true">↗</span></Link>
  </section>;
}
