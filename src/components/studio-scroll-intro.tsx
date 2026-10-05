"use client";

import {useEffect, useRef} from "react";
import styles from "./studio-scroll-intro.module.css";

export function StudioScrollIntro(){
  const section=useRef<HTMLElement>(null);
  const phrase=useRef<HTMLHeadingElement>(null);

  useEffect(()=>{
    const target=section.current;
    const heading=phrase.current;
    if(!target||!heading)return;
    const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame=0;
    const update=()=>{
      frame=0;
      const distance=Math.max(1,target.offsetHeight-window.innerHeight);
      const progress=motion.matches?0:Math.min(1,Math.max(0,-target.getBoundingClientRect().top/distance));
      const fade=Math.min(1,Math.max(0,(progress-.12)/.78));
      const eased=fade*fade*(3-2*fade);
      heading.style.opacity=String(1-eased);
      heading.style.transform=`translateY(${-eased*Math.min(window.innerHeight*.2,180)}px)`;
      heading.style.filter=`blur(${eased*14}px)`;
    };
    const schedule=()=>{if(!frame)frame=window.requestAnimationFrame(update);};
    update();
    window.addEventListener("scroll",schedule,{passive:true});
    window.addEventListener("resize",schedule);
    motion.addEventListener("change",schedule);
    return()=>{
      window.removeEventListener("scroll",schedule);
      window.removeEventListener("resize",schedule);
      motion.removeEventListener("change",schedule);
      window.cancelAnimationFrame(frame);
    };
  },[]);

  return <section ref={section} className={styles.intro} aria-labelledby="studio-opening-phrase">
    <div className={styles.stage}>
      <h2 ref={phrase} id="studio-opening-phrase" className={styles.phrase}>Your next shot<br/>starts here.</h2>
    </div>
  </section>;
}
