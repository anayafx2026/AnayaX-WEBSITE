"use client";
import {createContext,useContext,useEffect,useState} from "react";
import {usePathname} from "next/navigation";
const MotionContext=createContext({paused:false,toggle:()=>{}});
export const useMotion=()=>useContext(MotionContext);
export function SiteExperience({children}:{children:React.ReactNode}){
const [paused,setPaused]=useState(false);const pathname=usePathname();
useEffect(()=>{const query=matchMedia("(prefers-reduced-motion: reduce)");const apply=()=>setPaused(query.matches);apply();query.addEventListener("change",apply);return()=>query.removeEventListener("change",apply);},[]);
useEffect(()=>{const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}},{threshold:.08});document.querySelectorAll("[data-reveal]").forEach(node=>observer.observe(node));return()=>observer.disconnect();},[pathname]);
return <MotionContext.Provider value={{paused,toggle:()=>setPaused(value=>!value)}}><div className={`site-experience ${paused?"motion-paused":""}`}>{children}</div></MotionContext.Provider>;
}
