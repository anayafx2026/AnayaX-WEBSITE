"use client";

import Link from "next/link";
import Image from "next/image";
import {useEffect, useRef} from "react";

const frameCount=138;
const frameStart=86400;

function frameSource(index:number){return `/images/studio-robot-frames/RobotShotforWebsite_unedited_${String(frameStart+index)}.png`;}

export function StudioScrollRobot(){
  const section=useRef<HTMLElement>(null);
  const canvas=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const target=section.current;
    const surface=canvas.current;
    if(!target||!surface)return;

    const context=surface.getContext("2d");
    if(!context)return;

    const frames:Array<HTMLImageElement|undefined>=Array(frameCount);
    let activeFrame=0;
    let animationFrame=0;
    const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw=(index:number)=>{
      const image=frames[index];
      if(!image?.complete||!image.naturalWidth)return;
      context.clearRect(0,0,surface.width,surface.height);
      context.drawImage(image,0,0,surface.width,surface.height);
      surface.dataset.ready="true";
    };

    const load=(index:number)=>{
      if(index<0||index>=frameCount)return;
      const existing=frames[index];
      if(existing)return existing;
      const image=new window.Image();
      image.decoding="async";
      image.onload=()=>{if(index===activeFrame)draw(index);};
      image.src=frameSource(index);
      frames[index]=image;
      return image;
    };

    const preload=(index:number)=>{
      for(let offset=-3;offset<=16;offset+=1)load(index+offset);
    };

    const update=()=>{
      animationFrame=0;
      const distance=Math.max(target.offsetHeight-window.innerHeight,1);
      const progress=Math.min(1,Math.max(0,-target.getBoundingClientRect().top/distance));
      activeFrame=Math.min(frameCount-1,Math.round(progress*(frameCount-1)));
      preload(activeFrame);
      draw(activeFrame);
    };

    preload(0);
    draw(0);
    if(reducedMotion)return;

    const onScroll=()=>{
      if(!animationFrame)animationFrame=window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("resize",onScroll);
    return()=>{
      window.removeEventListener("scroll",onScroll);
      window.removeEventListener("resize",onScroll);
      if(animationFrame)window.cancelAnimationFrame(animationFrame);
    };
  },[]);

  return <section ref={section} className="studio-robot" aria-labelledby="studio-robot-heading">
    <div className="studio-robot-stage">
      <figure className="studio-robot-visual">
        <Image className="studio-robot-poster" src="/images/studio-robot-poster.png" alt="" aria-hidden="true" width={4096} height={2160} priority/>
        <canvas ref={canvas} className="studio-robot-canvas" width="1920" height="1080" role="img" aria-label="Camera robot moving through the ANAYAFX studio"/>
        <figcaption><span>ANAYAFX STUDIO</span><span>Los Angeles, California</span></figcaption>
      </figure>
      <div className="studio-robot-copy">
        <p className="eyebrow">The Core · Camera motion control</p>
        <h2 id="studio-robot-heading">Your next shoot<br/>starts in motion.</h2>
        <p>Inside The Core, ANAYAFX gives productions a dedicated environment for motion control, previsualization and camera testing—ready for creative teams to build the shot before the shoot day.</p>
        <Link href="/contact?type=Studio" className="pill-link">Book the Studio ↗</Link>
      </div>
      <p className="studio-robot-scroll" aria-hidden="true">Scroll to move the camera robot <span>↓</span></p>
    </div>
  </section>;
}
