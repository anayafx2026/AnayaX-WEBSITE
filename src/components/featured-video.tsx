"use client";
import {useEffect,useRef} from "react";
import {useMotion} from "./site-experience";

// Autoplays only while it is on screen, and stays still with reduced motion or when the user pauses motion.
export function FeaturedVideo({src,poster}:{src:string;poster:string}){
 const video=useRef<HTMLVideoElement>(null),{paused}=useMotion();
 useEffect(()=>{
  const node=video.current;if(!node)return;
  if(paused){node.pause();return;}
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)void node.play().catch(()=>{});else node.pause();}),{threshold:.25});
  io.observe(node);return()=>io.disconnect();
 },[paused]);
 return <video ref={video} className="featured-media-video" src={src} poster={poster} muted loop playsInline preload="metadata" aria-hidden="true"/>;
}
