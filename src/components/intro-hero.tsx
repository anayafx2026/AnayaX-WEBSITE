"use client";
import Image from "next/image";
import {useCallback,useEffect,useRef,useState} from "react";
import {useMotion} from "./site-experience";

type Phase = "symbol" | "title" | "fx" | "compact" | "dock" | "done";
const introSessionKey="intro-seen-original-logo-sliding-v3";
const hiddenLeft="translateX(50%)";
const hiddenRight="translateX(-36%)";
const hiddenFx="translateX(-35%)";
export function LegacyIntroHero() {
  const [phase,setPhase]=useState<Phase>("symbol");
  const hero=useRef<HTMLElement>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const curtain=useRef<HTMLDivElement>(null);
  const symbol=useRef<HTMLDivElement>(null);
  const left=useRef<HTMLDivElement>(null);
  const right=useRef<HTMLDivElement>(null);
  const fx=useRef<HTMLDivElement>(null);
  const video=useRef<HTMLVideoElement>(null);
  const activeAnimations=useRef<Animation[]>([]);
  const finishIntro=useRef<()=>void>(()=>{});
  const videoAllowed=useRef(false);
  const {paused}=useMotion();
  const motionPaused=useRef(paused);
  useEffect(()=>{motionPaused.current=paused;},[paused]);
  const playVideo=useCallback(()=>{
    if (!video.current || motionPaused.current || document.hidden) return;
    void video.current.play().catch(()=>{});
  },[]);

  useEffect(()=>{
    let cancelled=false;
    const animations:Animation[]=[];
    activeAnimations.current=animations;
    videoAllowed.current=false;
    video.current?.pause();
    if(video.current) video.current.currentTime=0;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    const overlay=dialog.current;
    const emblem=symbol.current;
    const wingLeft=left.current;
    const wingRight=right.current;
    const suffix=fx.current;
    const backdrop=curtain.current;
    if(!overlay || !emblem || !wingLeft || !wingRight || !suffix || !backdrop) return;
    setPhase("symbol");
    const finish=(startVideo=true)=>{
      cancelled=true;
      try{sessionStorage.setItem(introSessionKey,"1");}catch{/* Session storage can be unavailable. */}
      overlay.close();
      animations.forEach(animation=>animation.cancel());
      videoAllowed.current=startVideo;
      setPhase("done");
      if(startVideo) playVideo();
    };
    finishIntro.current=()=>finish(!reduced.matches);
    const skip=()=>{if(overlay.open)finishIntro.current();};
    window.addEventListener("wheel",skip,{passive:true});
    window.addEventListener("touchmove",skip,{passive:true});
    const preferenceChanged=()=>{if(reduced.matches)finish(false);};
    reduced.addEventListener("change",preferenceChanged);
    if(reduced.matches) finish(false);
    else if((()=>{try{return sessionStorage.getItem(introSessionKey);}catch{return false;}})()) finish();
    else {
      overlay.showModal();
      const animate=(element:Element,frames:Keyframe[],duration:number)=>{
        if(cancelled) return Promise.reject(new Error("Intro cancelled"));
        const animation=element.animate(frames,{duration,easing:"cubic-bezier(.22,1,.36,1)",fill:"forwards"});
        animations.push(animation);
        if(motionPaused.current) animation.pause();
        return animation.finished;
      };
      const sequence=async()=>{
        await Promise.all(Array.from(overlay.querySelectorAll("img")).map(img=>img.decode().catch(()=>{})));
        if(cancelled)return;
        // Symbol rises from below
        await animate(emblem,[{opacity:0,transform:"translateY(65vh) scale(.7)",filter:"blur(10px)"},{opacity:1,transform:"translateY(0) scale(1)",filter:"blur(0px)"}],1200);
        if(cancelled)return;
        // Wordmark wings slide out from behind the symbol
        setPhase("title");
        await Promise.all([
          animate(wingLeft,[{transform:hiddenLeft},{transform:"translateX(0)"}],1050),
          animate(wingRight,[{transform:hiddenRight},{transform:"translateX(0)"}],1050)
        ]);
        if(cancelled)return;
        // FX slides out from behind the YA portion
        setPhase("fx");
        await animate(suffix,[{transform:hiddenFx},{transform:"translateX(0)"}],550);
        // Brief beat so the full wordmark reads before it tucks away.
        await animate(backdrop,[{opacity:1},{opacity:1}],300);
        if(cancelled)return;
        // FX rides with YA, so it tucks behind the A first and then everything slides behind the symbol.
        setPhase("compact");
        await Promise.all([
          animate(wingLeft,[{transform:"translateX(0)"},{transform:hiddenLeft}],750),
          animate(wingRight,[{transform:"translateX(0)"},{transform:hiddenRight}],750),
          animate(suffix,[{transform:"translateX(0)"},{transform:hiddenFx}],550)
        ]);
        if(cancelled)return;
        // Symbol docks to the nav position
        const bounds=emblem.getBoundingClientRect();
        const target=document.querySelector("[data-brand-anchor]")?.getBoundingClientRect();
        if(!target){finish();return;}
        const x=target.left+target.width*.375-bounds.left-bounds.width/2;
        const y=target.top+target.height/2-bounds.top-bounds.height/2;
        setPhase("dock");
        videoAllowed.current=true;
        playVideo();
        await Promise.all([
          animate(emblem,[{transform:"translate(0,0) scale(1)"},{transform:`translate(${x}px,${y}px) scale(${target.width*.16/bounds.width})`}],1300),
          animate(backdrop,[{opacity:1},{opacity:0}],1300)
        ]);
        // The hero becomes visible after the symbol has reached the header.
        if(!cancelled) {
          try{sessionStorage.setItem(introSessionKey,"1");}catch{/* Intro still completes without storage. */}
          finish();
        }
      };
      void sequence().catch(()=>{if(!cancelled)finish();});
    }
    return ()=>{
      cancelled=true;
      animations.forEach(animation=>animation.cancel());
      overlay.close();
      reduced.removeEventListener("change",preferenceChanged);
      window.removeEventListener("wheel",skip);
      window.removeEventListener("touchmove",skip);
    };
  },[playVideo]);

  useEffect(()=>{
    activeAnimations.current.forEach(animation=>{
      if(animation.playState==="finished" || animation.playState==="idle")return;
      if(paused)animation.pause();else animation.play();
    });
    if(paused)video.current?.pause();
    else if(videoAllowed.current)playVideo();
  },[paused,playVideo]);

  useEffect(()=>{
    const visibility=()=>{
      if(document.hidden)video.current?.pause();
      else if(videoAllowed.current)playVideo();
    };
    document.addEventListener("visibilitychange",visibility);
    return ()=>document.removeEventListener("visibilitychange",visibility);
  },[playVideo]);

  useEffect(()=>{
    let frame=0;
    const update=()=>{
      frame=0;
      const progress=Math.min(1,Math.max(0,window.scrollY/Math.max(window.innerHeight*.85,1)));
      hero.current?.style.setProperty("--hero-video-scale",String(1+progress*.14));
      hero.current?.style.setProperty("--hero-video-blur",`${progress*14}px`);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();
    window.addEventListener("scroll",schedule,{passive:true});
    window.addEventListener("resize",schedule);
    return ()=>{window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);cancelAnimationFrame(frame);};
  },[]);

  return <section ref={hero} className="showreel anaya-hero" data-intro-phase={phase} aria-label="ANAYAFX introduction">
    <video ref={video} className="hero-video" muted playsInline loop preload="metadata" poster="/videos/home-banner-poster.jpg" aria-hidden="true"><source src="/videos/home-banner.mp4" type="video/mp4"/></video>
    <div className="hero-shade"/>
    <div className="hero-body"><div><p className="eyebrow">Creative vision. Technical precision.</p><h1>We engineer<br/><span>spectacle.</span></h1></div></div>
    <dialog ref={dialog} className="intro-overlay" aria-label="ANAYAFX logo introduction" onClick={()=>finishIntro.current()} onCancel={event=>{event.preventDefault();finishIntro.current();}}>
      <div ref={curtain} className="intro-curtain"/>
      <div className="logo-stage" aria-hidden="true">
        <div className="logo-wing-window logo-window-left"><div ref={left} className="logo-wing logo-wing-left"><Image src="/brand/original-logo.png" width={1920} height={321} alt="" unoptimized priority/></div></div>
        <div className="logo-wing-window logo-window-right"><div ref={right} className="logo-group"><div className="logo-fx-window"><div ref={fx} className="intro-fx"><Image src="/brand/original-logo.png" width={1920} height={321} alt="" unoptimized priority/></div></div><div className="logo-wing logo-wing-right"><Image src="/brand/original-logo.png" width={1920} height={321} alt="" unoptimized priority/></div></div></div>
        <div ref={symbol} className="intro-symbol"><Image src="/brand/original-logo.png" width={1920} height={321} alt="" unoptimized priority/></div>
      </div>
      <p className="intro-signature">CREATIVE VISION. TECHNICAL PRECISION.</p>    </dialog>
    <noscript><style>{".anaya-hero .hero-body{opacity:1!important}"}</style></noscript>
  </section>;
}

const logoLightSessionKey="anayafx-logo-light-intro-v1";

export function IntroHero() {
  const [introVisible,setIntroVisible]=useState(false);
  const hero=useRef<HTMLElement>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const video=useRef<HTMLVideoElement>(null);
  const {paused}=useMotion();
  const playVideo=useCallback(()=>{
    if (!paused && !document.hidden) void video.current?.play().catch(()=>{});
  },[paused]);

  useEffect(()=>{
    const overlay=dialog.current;
    if(!overlay)return;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    let closed=false;
    let showFrame=0;
    let timeout:ReturnType<typeof setTimeout>|undefined;
    const finish=(startVideo=true)=>{
      if(closed)return;
      closed=true;
      clearTimeout(timeout);
      try{sessionStorage.setItem(logoLightSessionKey,"1");}catch{/* Storage is optional. */}
      overlay.close();
      if(showFrame)cancelAnimationFrame(showFrame);
      requestAnimationFrame(()=>setIntroVisible(false));
      if(startVideo)playVideo();
    };
    const skip=()=>finish(!reduced.matches);
    const hasSeen=(()=>{try{return sessionStorage.getItem(logoLightSessionKey)==="1";}catch{return false;}})();
    if(reduced.matches||hasSeen)finish(!reduced.matches);
    else{
      showFrame=requestAnimationFrame(()=>setIntroVisible(true));
      overlay.showModal();
      timeout=setTimeout(()=>finish(),2600);
      window.addEventListener("wheel",skip,{passive:true});
      window.addEventListener("touchmove",skip,{passive:true});
    }
    const preferenceChanged=()=>{if(reduced.matches)finish(false);};
    reduced.addEventListener("change",preferenceChanged);
    return ()=>{
      closed=true;
      if(showFrame)cancelAnimationFrame(showFrame);
      clearTimeout(timeout);
      overlay.close();
      reduced.removeEventListener("change",preferenceChanged);
      window.removeEventListener("wheel",skip);
      window.removeEventListener("touchmove",skip);
    };
  },[playVideo]);

  useEffect(()=>{
    if(paused||document.hidden)video.current?.pause();
    else if(!introVisible)playVideo();
  },[introVisible,paused,playVideo]);

  useEffect(()=>{
    const visibility=()=>{if(document.hidden)video.current?.pause();else if(!introVisible)playVideo();};
    document.addEventListener("visibilitychange",visibility);
    return ()=>document.removeEventListener("visibilitychange",visibility);
  },[introVisible,playVideo]);

  useEffect(()=>{
    let frame=0;
    const update=()=>{
      frame=0;
      const progress=Math.min(1,Math.max(0,window.scrollY/Math.max(window.innerHeight*.85,1)));
      hero.current?.style.setProperty("--hero-video-scale",String(1+progress*.14));
      hero.current?.style.setProperty("--hero-video-blur",`${progress*14}px`);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);
    return ()=>{window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);cancelAnimationFrame(frame);};
  },[]);

  return <section ref={hero} className="showreel anaya-hero" data-intro-visible={introVisible} aria-label="ANAYAFX introduction">
    <video ref={video} className="hero-video" muted playsInline loop preload="metadata" poster="/videos/home-banner-poster.jpg" aria-hidden="true"><source src="/videos/home-banner.mp4" type="video/mp4"/></video>
    <div className="hero-shade"/>
    <div className="hero-body"><div><p className="eyebrow">Creative vision. Technical precision.</p><h1>We engineer<br/><span>spectacle.</span></h1></div></div>
    <dialog ref={dialog} className="intro-overlay logo-light-intro" aria-label="ANAYAFX introduction" onClick={()=>{try{sessionStorage.setItem(logoLightSessionKey,"1");}catch{/* Storage is optional. */}dialog.current?.close();setIntroVisible(false);playVideo();}} onCancel={event=>{event.preventDefault();dialog.current?.close();setIntroVisible(false);playVideo();}}>
      <div className="intro-full-logo" aria-hidden="true"><Image src="/brand/original-logo.png" width={1920} height={321} alt="" priority/><span className="intro-light-beam"/></div>
    </dialog>
    <noscript><style>{".anaya-hero .hero-body{opacity:1!important}"}</style></noscript>
  </section>;
}
