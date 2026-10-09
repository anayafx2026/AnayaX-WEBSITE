"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import type {CSSProperties} from "react";
import {serviceMenu as services} from "@/content/site";
import {ServiceCardVideo} from "./service-card-video";

const COUNT=services.length;
const STEP=360/COUNT;

export function ServiceLoop(){
  const stage=useRef<HTMLDivElement>(null);
  const scrollArea=useRef<HTMLDivElement>(null);
  const ring=useRef<HTMLDivElement>(null);
  const [front,setFront]=useState(0);

  useEffect(()=>{
    const el=stage.current,area=scrollArea.current,rg=ring.current;
    if(!el||!area||!rg) return;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    let offset=0,angle=NaN,applied=NaN,pitch=-6,appliedPitch=NaN,pointerYaw=0,pointerPitch=0,visible=false,raf=0,shown=-1;
    const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(!visible) angle=NaN;});
    io.observe(el);
    const wheel=(event:WheelEvent)=>{
      // Only the central gallery area consumes the wheel. Transformed cards can
      // extend beyond it, so leave both side gutters available for page scrolling.
      const box=area.getBoundingClientRect();
      if(event.ctrlKey||(!event.deltaX&&!event.deltaY)||event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom) return;
      event.preventDefault();
      const unit=event.deltaMode===1?16:event.deltaMode===2?innerHeight:1;
      const delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
      offset-=delta*unit*.25;
    };
    const resetPointer=()=>{pointerYaw=0;pointerPitch=0;};
    const move=(event:PointerEvent)=>{
      const box=area.getBoundingClientRect();
      if(reduced.matches||event.pointerType==="touch"||event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom){resetPointer();return;}
      pointerYaw=((event.clientX-box.left)/box.width-.5)*24;
      pointerPitch=(.5-(event.clientY-box.top)/box.height)*20;
    };
    el.addEventListener("wheel",wheel,{passive:false});
    el.addEventListener("pointermove",move,{passive:true});
    el.addEventListener("pointerleave",resetPointer);
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      if(!visible) return;
      const target=-180+offset+(reduced.matches?0:pointerYaw),targetPitch=-6+(reduced.matches?0:pointerPitch);
      angle=Number.isNaN(angle)||reduced.matches||Math.abs(target-angle)<.01?target:angle+(target-angle)*.12;
      pitch=reduced.matches||Math.abs(targetPitch-pitch)<.01?targetPitch:pitch+(targetPitch-pitch)*.12;
      if(angle!==applied||pitch!==appliedPitch){
        applied=angle;
        appliedPitch=pitch;
        rg.style.transform=`rotateX(${pitch.toFixed(2)}deg) rotateY(${angle.toFixed(2)}deg)`;
      }
      const index=((Math.round(-angle/STEP)%COUNT)+COUNT)%COUNT;
      if(index!==shown){shown=index;setFront(index);}
    };
    raf=requestAnimationFrame(tick);
    return ()=>{cancelAnimationFrame(raf);io.disconnect();el.removeEventListener("wheel",wheel);el.removeEventListener("pointermove",move);el.removeEventListener("pointerleave",resetPointer);};
  },[]);

  return <section id="services-loop" className="service-loop" aria-labelledby="service-loop-title">
    <header className="service-gallery-heading"><div className="service-loop-copy"><p className="eyebrow">Services</p><h2 id="service-loop-title">Services we offer.</h2><p>Creative and technical direction for every surface, from the first frame to showtime.</p></div>
    <nav className="service-loop-menu" aria-label="Browse services"><ol>{services.map((service,index)=><li key={service.slug}><Link href={service.href}><span aria-hidden="true">{String(index+1).padStart(2,"0")}</span>{service.title}</Link></li>)}</ol></nav>
    </header>
    <div className="service-loop-layout">
    <div ref={stage} className="service-loop-stage" style={{"--n":COUNT} as CSSProperties} role="region" aria-label="Service carousel">
      <div ref={scrollArea} className="service-loop-scroll-area" aria-hidden="true"/>
      <div ref={ring} className="service-loop-ring">
        {services.map((service,index)=>(
          <Link key={service.slug} href={service.href} className={`service-loop-card${index===front?" is-front":""}${service.previewSlug===null?" service-loop-card-blank":""}`} style={{"--i":index} as CSSProperties} aria-label={service.title}>
            <ServiceCardVideo slug={service.previewSlug} active={index===front}/>
            <span className="service-loop-top"><span>{String(index+1).padStart(2,"0")}</span><span>{service.capabilities[0]}</span></span>
            <span className="service-loop-title">{service.title}</span>
          </Link>
        ))}
      </div>
    </div>
    </div>
    <Link href="/services" className="gallery-all-link">View all services <span aria-hidden="true">↗</span></Link>
  </section>;
}
