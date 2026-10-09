"use client";
import {useEffect,useRef} from "react";
import {previewVideo} from "@/content/service-videos";
import {useMotion} from "./site-experience";

// Video face for the service carousels. Only the card in front plays; the others hold their first frame.
export function ServiceCardVideo({slug,active}:{slug:string|null;active:boolean}){
 const video=useRef<HTMLVideoElement>(null),{paused}=useMotion();
 useEffect(()=>{
  const node=video.current;if(!node)return;
  if(active&&!paused)void node.play().catch(()=>{});else node.pause();
 },[active,paused,slug]);
 if(slug===null)return <div className="service-card-video service-video-blank" aria-hidden="true"/>;
 return <video disablePictureInPicture ref={video} className="service-card-video" src={previewVideo(slug)} muted loop playsInline preload="metadata" aria-hidden="true"/>;
}
