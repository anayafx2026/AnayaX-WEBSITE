"use client";
import Link from "next/link";

import {BrandLogo} from "./brand-logo";
import {usePathname} from "next/navigation";
import {useEffect,useRef,useState} from "react";
import {siteContent} from "@/content/site";
export function SiteHeader(){
const pathname=usePathname();const [open,setOpen]=useState(false);const dialog=useRef<HTMLDialogElement>(null);const trigger=useRef<HTMLButtonElement>(null);
const [canReturn,setCanReturn]=useState(false);
function close(){dialog.current?.close();setOpen(false);trigger.current?.focus();}
useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=previous;};},[open]);
useEffect(()=>{
  const cinematicRentals=matchMedia("(min-width:1200px) and (min-height:600px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)");
  let frame=0;
  const update=()=>{
    frame=0;
    // Rentals' opening finishes after two screens; other openings use one.
    const screens=pathname==="/rentals"&&cinematicRentals.matches?2:1;
    const available=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
    setCanReturn(available>0&&window.scrollY>=Math.min(window.innerHeight*screens,available));
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  schedule();
  window.addEventListener("scroll",schedule,{passive:true});
  window.addEventListener("resize",schedule);
  cinematicRentals.addEventListener("change",schedule);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);cinematicRentals.removeEventListener("change",schedule);};
},[pathname]);
function returnToStart(){
  document.getElementById("contenido")?.focus({preventScroll:true});
  window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
}
return <>
  <header className="site-header"><Link href="/" className="wordmark" aria-label="ANAYAFX home" data-brand-anchor><BrandLogo symbol/></Link></header>
  <Link href="/" className="home-shortcut" aria-label="Home" aria-current={pathname==="/"?"page":undefined}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v11h5v-6h4v6h5V9"/></svg></Link>
  <button ref={trigger} type="button" className="menu-toggle" aria-label="Open main menu" aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={()=>{dialog.current?.showModal();setOpen(true);}}><span aria-hidden="true"/><span aria-hidden="true"/></button>
  <button type="button" className="return-to-start" hidden={!canReturn} aria-label="Back to first sequence" title="Back to start" onClick={returnToStart}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20V4m-7 7 7-7 7 7"/></svg></button>
  <dialog id="site-menu" ref={dialog} className="menu-dialog" aria-label="Main navigation" onCancel={()=>setOpen(false)} onClose={()=>setOpen(false)} onClick={event=>{if(event.target===event.currentTarget)close();}}><div className="menu-sheet"><Link href="/" className="menu-wordmark wordmark" aria-label="ANAYAFX home" onClick={close}><BrandLogo/></Link><nav aria-label="Main navigation">{siteContent.navigation.map(item=><Link key={item.href} href={item.href} onClick={close} aria-current={pathname===item.href?"page":undefined}>{item.label}</Link>)}</nav><div className="menu-socials"><a href="mailto:studio@anayafx.com">studio@anayafx.com ↗</a></div><button type="button" className="menu-close" onClick={close}>Close <span aria-hidden="true">×</span></button></div></dialog>
</>;
}
