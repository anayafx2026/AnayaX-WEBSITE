"use client";
import {useTheme} from "./site-experience";
const options=["light","dark","system"] as const;
export function ThemeSelector(){
  const {preference,resolved,setPreference}=useTheme();
  return <div className="theme-selector" role="group" aria-label="Color mode">
    {options.map(option=><button key={option} type="button" onClick={()=>setPreference(option)} aria-pressed={preference===option} title={option==="system"?`System preference: ${resolved}`:undefined}><span aria-hidden="true" className="theme-marker">{preference===option?"■":""}</span>{option}</button>)}
  </div>;
}
