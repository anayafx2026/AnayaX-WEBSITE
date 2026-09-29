"use client";
import {createContext,useContext,useEffect,useState} from "react";
import {usePathname} from "next/navigation";
type ThemePreference="light"|"dark"|"system";
type ResolvedTheme="light"|"dark";
const MotionContext=createContext({paused:false,toggle:()=>{}});
const ThemeContext=createContext<{preference:ThemePreference;resolved:ResolvedTheme;setPreference:(preference:ThemePreference)=>void}>({preference:"dark",resolved:"dark",setPreference:()=>{}});
export const useMotion=()=>useContext(MotionContext);
export const useTheme=()=>useContext(ThemeContext);
export function SiteExperience({children}:{children:React.ReactNode}){
const [paused,setPaused]=useState(false);const [preference,setPreference]=useState<ThemePreference>("dark");const [systemTheme,setSystemTheme]=useState<ResolvedTheme>("dark");const pathname=usePathname();
useEffect(()=>{const preference=matchMedia("(prefers-reduced-motion: reduce)");const apply=()=>setPaused(preference.matches);apply();preference.addEventListener("change",apply);return()=>preference.removeEventListener("change",apply);},[]);
useEffect(()=>{const query=matchMedia("(prefers-color-scheme: dark)");const apply=()=>setSystemTheme(query.matches?"dark":"light");const saved=(()=>{try{return localStorage.getItem("anaya-fx-theme");}catch{return null;}})();const initialTheme=query.matches?"dark":"light";const frame=requestAnimationFrame(()=>{setSystemTheme(initialTheme);if(saved==="light"||saved==="dark"||saved==="system")setPreference(saved);});query.addEventListener("change",apply);return()=>{cancelAnimationFrame(frame);query.removeEventListener("change",apply);};},[]);
const resolved=preference==="system"?systemTheme:preference;
useEffect(()=>{document.documentElement.dataset.theme=resolved;document.documentElement.style.colorScheme=resolved;try{localStorage.setItem("anaya-fx-theme",preference);}catch{/* Keeping the selection in memory is an accessible fallback. */}},[preference,resolved]);
useEffect(()=>{const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}},{threshold:.08});document.querySelectorAll("[data-reveal]").forEach(node=>observer.observe(node));return()=>observer.disconnect();},[pathname]);
return <ThemeContext.Provider value={{preference,resolved,setPreference}}><MotionContext.Provider value={{paused,toggle:()=>setPaused(value=>!value)}}><div className={`site-experience ${paused?"motion-paused":""}`}>{children}</div></MotionContext.Provider></ThemeContext.Provider>;
}
