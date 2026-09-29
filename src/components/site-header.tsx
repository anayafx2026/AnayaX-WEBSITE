"use client";
import Link from "next/link";
import {BrandLogo} from "./brand-logo";
import {usePathname} from "next/navigation";
import {useEffect,useRef,useState} from "react";
import {siteContent} from "@/content/site";
export function SiteHeader(){
const pathname=usePathname();const [open,setOpen]=useState(false);const dialog=useRef<HTMLDialogElement>(null);const trigger=useRef<HTMLButtonElement>(null);
function close(){dialog.current?.close();setOpen(false);trigger.current?.focus();}
useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=previous;};},[open]);
return <><header className="site-header"><Link href="/" className="wordmark" aria-label="Anaya FX home" data-brand-anchor><BrandLogo symbol/></Link></header><div className="navigation-dock"><button ref={trigger} type="button" className="menu-trigger" aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={()=>{dialog.current?.showModal();setOpen(true);}}>Menu</button></div><dialog id="site-menu" ref={dialog} className="menu-dialog" aria-label="Main navigation" onCancel={()=>setOpen(false)} onClose={()=>setOpen(false)} onClick={event=>{if(event.target===event.currentTarget)close();}}><div className="menu-sheet"><Link href="/" className="menu-wordmark wordmark" aria-label="Anaya FX home" onClick={close}><BrandLogo/></Link><nav aria-label="Main navigation">{siteContent.navigation.map(item=><Link key={item.href} href={item.href} onClick={close} aria-current={pathname===item.href?"page":undefined} className={item.href==="/"?"home-menu-link":""}>{item.label}</Link>)}</nav><div className="menu-socials"><a href="mailto:studio@anayafx.com">studio@anayafx.com ↗</a><a href="https://wa.me/13102223333" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp +1 310 222 3333 (opens in a new tab)">+1 310 222 3333 ↗</a></div><button type="button" className="menu-close" onClick={close}>Close <span aria-hidden="true">×</span></button></div></dialog></>;
}
