"use client";
import Link from "next/link";
import Image from "next/image";
import {useEffect,useRef,useState,type CSSProperties} from "react";
import {projects} from "@/content/site";
import {BrandLogo} from "./brand-logo";
import styles from "./rentals-story.module.css";

// Layout follows RobotShotforWebsite_sequences.psd (group RENTALS), laid out on a 1920x904 page frame. --u (set on the
// story) converts PSD pixels into screen pixels, and positions are measured from the middle of the viewport, so every
// scene keeps its proportions in any window. Everything is a CSS custom property so the stacked fallback (mobile and
// reduced motion) can ignore the absolute layout.
const vars=(l:string,t:string,w?:number,h?:number,fs?:number):CSSProperties=>({"--l":l,"--t":t,...(w!==undefined?{"--w":`calc(${w}*var(--u))`}:{}),...(h!==undefined?{"--h":`calc(${h}*var(--u))`}:{}),...(fs!==undefined?{"--fs":`calc(${fs}*var(--u))`}:{})} as CSSProperties);
const box=(x:number,y:number,w?:number,h?:number,fs?:number)=>vars(`calc(50% + ${x-960}*var(--u))`,`calc(50% + ${y-540}*var(--u))`,w,h,fs);
const rig=(x:number,y:number,w?:number,h?:number,fs?:number)=>vars(`calc(${x}*var(--u))`,`calc(${y}*var(--u))`,w,h,fs);

// Scroll length of the story in viewport heights; the CSS height is derived from it. Timings below are in screens.
const SCREENS=28;
const T={
 s1:{out:[1,2]},
 s2:{enter:[1.4,2],product:[1.7,2.7],text:[2.7,3.9],out:[4.4,5.2]},
 s3:{enter:[4.8,5.6],content:[5,6.1],out:[7,7.8]},
 s4:{enter:[7.4,8.4],out:[10.4,11.2]},
 racks:{enter:[10.8,11.6],image:[11.8,12.8],title:[12,12.8],items:[12.4,14.4],out:[14.6,15.3]},
 s5:{enter:[15.4,16],hint:[16,16.5],reveal:[16.2,18.2],stage:[16.8,18.4],stageOut:[20.4,21.6],move:[18.3,19.1],text:[19.1,19.9],textOut:[20.4,20.65],zoom:[20.4,22.2],out:[22.2,22.22]},
 s6:{enter:[22.2,22.22],label:[23.2,24.4],zoom:[22.7,25.7],visor:[23.8,25.2],phrase:[25.6,26.4]},
} as const;
const ramp=(v:number,[a,b]:readonly [number,number]|readonly number[])=>{const t=Math.min(1,Math.max(0,(v-(a??0))/((b??1)-(a??0))));return t*t*(3-2*t);};

const outputs=[
 {id:"ip",title:"IP OUT",card:[387,199,213,681],lines:["Sends video over a network/IP infrastructure. Used","when the video signal needs to travel through","compatible network-based video systems rather","than a conventional display cable."]},
 {id:"hdmi",title:"HDMI OUT",card:[389,199,211,681],lines:["Outputs digital video over HDMI. Common for","monitors, projectors, LED processors, and","AV equipment."]},
 {id:"sdi",title:"SDI OUT",card:[393,200,207,681],lines:["Outputs professional SDI video through BNC connectors.","Ideal for broadcast workflows, long cable runs, switchers,","cameras, and professional video infrastructure."]},
 {id:"dvi",title:"DVI OUT",card:[393,199,207,680],lines:["Outputs digital video through DVI. Often used with","older LED processors, projectors, and display","systems that still rely on DVI."]},
 {id:"dp",title:"DP OUT",card:[395,202,205,679],lines:["Outputs digital video through DisplayPort. Common","for high-resolution displays and workflows requiring","high bandwidth."]},
] as const;
const CARD_PITCH=233; // distance between cards in the overview
// Inventory highlights shown under the cover copy (taken from the previous Rentals page).
const cover=["disguise GX 3 and GX 3+","VFC output cards","Show-ready racks","Support gear"] as const;
// Racks copy, with the line breaks of the PSD (Racks > INFO).
const rackLines=["Primary and backup servers, Blackmagic","20x20 12G SDI router, Brainstorm","Distripalyzer and 4K monitors"] as const;

const photos=projects.flatMap(project=>project.image?[{src:project.image,alt:project.imageAlt??project.title}]:[]);
const strip=(offset:number)=>Array.from({length:16},(_,i)=>photos[(i+offset)%photos.length]).filter((photo):photo is {src:string,alt:string}=>!!photo);
const rows=[{y:0,h:265,w:424,gap:100,offset:1,reverse:false},{y:353,h:374,w:600,gap:136,offset:0,reverse:true},{y:815,h:265,w:424,gap:100,offset:2,reverse:false}];

type Registry={current:Record<string,HTMLElement|null>};
const bind=(registry:Registry,key:string)=>(node:HTMLElement|null)=>{registry.current[key]=node;};
const lines=(text:readonly string[])=>text.map((line,i)=><span key={i} className={styles.line}>{line}{" "}</span>);

export function RentalsStory(){
 const section=useRef<HTMLElement>(null);
 const zoomSection=useRef<HTMLDivElement>(null),zoomStage=useRef<HTMLDivElement>(null);
 const els=useRef<Record<string,HTMLElement|null>>({});
 const [selected,setSelected]=useState<number|null>(null);
 const selectedRef=useRef<number|null>(null);
 useEffect(()=>{selectedRef.current=selected;},[selected]);

 useEffect(()=>{
  const target=section.current;if(!target)return;
  const query=matchMedia("(min-width:1200px) and (min-height:600px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)");
  const motion=matchMedia("(prefers-reduced-motion:reduce)");
  let raf=0;
  const put=(key:string,opacity:number,y=0,x=0,scale=1,blur=0)=>{
   const node=els.current[key];if(!node)return;
   node.style.opacity=String(opacity);node.style.visibility=opacity<=.001?"hidden":"visible";
   node.style.transform=x||y||scale!==1?`translate(${x}px,${y}px) scale(${scale})`:"";
   node.style.filter=blur>.05?`blur(${blur}px)`:"";
  };
  const scene=(key:string,enter:readonly number[]|null,out:readonly number[]|null,s:number,mode:"normal"|"fadeIn"|"fadeOut"="normal")=>{
   const inn=enter?ramp(s,enter as [number,number]):1,gone=out?ramp(s,out as [number,number]):0,o=inn*(1-gone);
   const rise=mode==="fadeIn"?0:1-inn,leave=mode==="fadeOut"?0:gone;
   put(key,o,rise*40-leave*40,0,1,(rise+leave)*10);
   const node=els.current[key];if(node){(node as HTMLElement&{inert:boolean}).inert=o<.1;node.setAttribute("aria-hidden",String(o<.1));}
   return o;
  };
  // Keep the PSD coordinates when switching orientation or returning to desktop.
  const clear=()=>{for(const node of Object.values(els.current)){if(!node)continue;for(const property of ["opacity","visibility","transform","filter","clip-path","--r","--open","--grid"])node.style.removeProperty(property);(node as HTMLElement&{inert:boolean}).inert=false;node.removeAttribute("aria-hidden");}};
  const update=()=>{
   raf=0;
   const desktop=query.matches;
   if(!desktop&&(motion.matches||!zoomSection.current||!zoomStage.current))return;
   const width=document.documentElement.clientWidth,height=desktop?innerHeight:zoomStage.current?.clientHeight??innerHeight;
   const u=desktop?Math.min(width/1920,height/904):Math.min(width/960,(height-100)/1080);
   const local=zoomSection.current;
   const progress=local?Math.min(1,Math.max(0,-local.getBoundingClientRect().top/Math.max(1,local.offsetHeight-height))):0;
   const s=desktop?Math.min(SCREENS,Math.max(0,-target.getBoundingClientRect().top/innerHeight)):16.2+progress*(SCREENS-16.2);
   if(!desktop)zoomStage.current?.style.setProperty("--u",`${u}px`);
   if(desktop){
   scene("s1",null,T.s1.out,s);
   scene("s2",T.s2.enter,T.s2.out,s);
   scene("s3",T.s3.enter,T.s3.out,s);
   const vfc=scene("s4",T.s4.enter,T.s4.out,s);
   scene("racks",T.racks.enter,T.racks.out,s);
   // background: plain dark site background on the cover and the disguise info; black grid on the disguise cover and the
   // VFC outputs; plain dark again from the racks to the end.
   const grid=Math.max(0,ramp(s,T.s2.enter)-ramp(s,T.s3.enter)+ramp(s,T.s4.enter)-ramp(s,T.racks.enter));
   els.current.spot?.style.setProperty("--grid",String(Math.min(1,grid)));
   // 2 · disguise cover: the GX3 appears first, then the words slide out from behind it, up and down
   const product=ramp(s,T.s2.product),words=ramp(s,T.s2.text);
   put("gx3",product,(1-product)*30,0,.94+.06*product,(1-product)*8);
   put("disguise",ramp(words,[0,.25]),(1-words)*262*u);
   put("gx3-text",ramp(words,[0,.25]),-(1-words)*260*u);
   // 3 · disguise info
   const info=ramp(s,T.s3.content);
   put("info-text",info,0,-(1-info)*50);put("server",info,0,(1-info)*60);
   // 4 · VFC outputs
   if(vfc<.1&&selectedRef.current!==null)setSelected(null);
   const enter=ramp(s,T.s4.enter);
   ["v","f","c"].forEach((k,i)=>{const p=ramp(enter,[i*.12,.6+i*.12]);put(`l-${k}`,p,0,-(1-p)*60);});
   put("l-out",ramp(enter,[.3,1]),0,(1-ramp(enter,[.3,1]))*60);
   outputs.forEach((_,i)=>{const p=ramp(enter,[i*.1,.7+i*.1]);put(`card-${i}`,p,(1-p)*70,0,1,(1-p)*8);});
   // racks: the list unfolds item by item
   const rackImage=ramp(s,T.racks.image),rackTitle=ramp(s,T.racks.title);
   put("rack-img",rackImage,0,-(1-rackImage)*60,1,(1-rackImage)*8);put("rack-title",rackTitle,(1-rackTitle)*40,0,1,(1-rackTitle)*8);
   const rackText=ramp(s,[T.racks.items[0],T.racks.items[0]+.8]),rackCta=ramp(s,[T.racks.items[0]+.6,T.racks.items[0]+1.4]);
   put("rack-text",rackText,(1-rackText)*50,0,1,(1-rackText)*8);put("rack-cta",rackCta,(1-rackCta)*50,0,1,(1-rackCta)*8);
   }
   // Compact screens pin just these two scenes, keeping the same camera-to-monitor
   // choreography while the earlier rental sections retain their readable layout.
   scene("s5",T.s5.enter,T.s5.out,s,"fadeOut");
   scene("s6",T.s6.enter,null,s,"fadeIn");
   // 5 · camera: the real camera fills the silhouette from the inside out, the silhouette fades away, then the shot
   // zooms into the camera's monitor and, the moment the zoom ends, cuts to the monitor scene (no cross-fade, so nothing doubles).
   const reveal=ramp(s,T.s5.reveal),gear=(desktop?ramp(s,T.s5.text):1)*(1-ramp(s,T.s5.textOut)),camZoom=ramp(s,T.s5.zoom),camMove=ramp(s,T.s5.move);
   put("cam-text",gear);put("cam-body",gear);
   const camRig=els.current["cam-rig"];
   if(camRig)camRig.style.setProperty("--r",`${-70+reveal*(582+70)*u}px`);
   // The realistic camera fills the silhouette, then settles on the right at the size of the PSD (CAMARA copia), and the
   // zoom finally brings the camera's own monitor onto the screen of the monitor scene. One matrix: scale K about the camera
   // monitor's centre O (PSD px), which lands on q; K and q are interpolated through both moves.
   if(camRig){
    // Compact copy sits above the camera. Reserve its actual height (including
    // wrapped text), then ease this offset away as the monitor zoom takes over.
    const copyBottom=(els.current["cam-body"]?.getBoundingClientRect().bottom??0)-(zoomStage.current?.getBoundingClientRect().top??0);
    const clearance=desktop?0:Math.max(0,(copyBottom+24-(height/2-407*u))/u);
    const S=1.506,ox=828,oy=219,startY=oy+clearance,q0x=desktop?1138.7:960,q0y=desktop?248.5:350+clearance,qtx=desktop?726.5:960,qty=desktop?512.5:540,K=1+(S-1)*camMove+(3.752-S)*camZoom;
    const qx=ox+camMove*(q0x-ox)+camZoom*(qtx-q0x),qy=startY+camMove*(q0y-startY)+camZoom*(qty-q0y);
    camRig.style.transform=`matrix(${K},0,0,${K},${(qx-K*ox)*u},${(qy-K*oy)*u})`;
   }
   put("stage",ramp(s,T.s5.stage)*(1-ramp(s,T.s5.stageOut))*.9);
   put("cam-hint",(1-ramp(s,T.s5.hint))*(1-ramp(s,T.s5.textOut)));
   // 6 · monitor: zoom into the screen, a viewer opens in it, a moving gallery of projects and a phrase
   const zoom=ramp(s,T.s6.zoom),visor=ramp(s,T.s6.visor);
   const rigNode=els.current.rig;
   const zoomEnd=desktop?2.2:Math.max(2.2,width/(893*u)*1.08,height/(495*u)*1.08);
   if(!desktop)zoomStage.current?.style.setProperty("--zoom-end",String(zoomEnd));
   if(rigNode)rigNode.style.transform=`translate(${233.5*u*(desktop?zoom:1)}px,${27.5*u*(desktop?zoom:1)}px) scale(${1+(zoomEnd-1)*zoom})`;
   put("monitor-label",1-ramp(s,T.s6.label));
   const visorNode=els.current.visor;
   if(visorNode){const side=(1-visor)*50;visorNode.style.clipPath=`inset(0 ${side}% 0 ${side}%)`;visorNode.style.visibility=visor<=.001?"hidden":"visible";visorNode.dataset.run=String(visor>.02);}
   const edge=els.current.edge;if(edge){edge.style.opacity=String(visor>.01&&visor<.99?1:0);edge.style.setProperty("--open",String(visor));}
   const phrase=ramp(s,T.s6.phrase);
   put("phrase",phrase,(1-phrase)*30,0,1,(1-phrase)*10);
  };
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};
  // Phones: the scenes simply stack, and each one rises into view as it is scrolled to.
  let reveal:IntersectionObserver|null=null;
  const sync=()=>{
   reveal?.disconnect();reveal=null;target.removeAttribute("data-stack");target.removeAttribute("data-zoom");
   zoomStage.current?.style.removeProperty("--u");zoomStage.current?.style.removeProperty("--zoom-end");
   if(query.matches){schedule();return;}
   clear();
   if(motion.matches)return;
   target.setAttribute("data-stack","true");
   target.setAttribute("data-zoom","true");
   reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.setAttribute("data-in","true");reveal?.unobserve(entry.target);}}),{threshold:.12});
   target.querySelectorAll('[data-scene]:not([data-scene="5"]):not([data-scene="6"])').forEach(node=>reveal?.observe(node));
   schedule();
  };
  sync();
  addEventListener("scroll",schedule,{passive:true});addEventListener("resize",schedule);query.addEventListener("change",sync);motion.addEventListener("change",sync);
  return()=>{reveal?.disconnect();cancelAnimationFrame(raf);removeEventListener("scroll",schedule);removeEventListener("resize",schedule);query.removeEventListener("change",sync);motion.removeEventListener("change",sync);};
 },[]);

 useEffect(()=>{
  if(selected===null)return;
  const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setSelected(null);};
  addEventListener("keydown",close);return()=>removeEventListener("keydown",close);
 },[selected]);

 const detail=selected!==null;
 return <section ref={section} className={styles.story} style={{"--screens":SCREENS} as CSSProperties} aria-label="ANAYAFX rentals">
  <div className={styles.stage}>

   <div ref={bind(els,"spot")} className={styles.spot} aria-hidden="true"/>

   <div ref={bind(els,"s1")} className={styles.scene} data-scene="1">
    <Link href="/" className={styles.logo} aria-label="ANAYAFX home"><BrandLogo symbol/></Link>
    <h1 className={`${styles.abs} ${styles.h1}`} style={box(348,248,1220,undefined,119.9)}>Show-ready disguise,<br/>ready to rent.</h1>
    <span className={`${styles.abs} ${styles.rule}`} style={box(710,562,495,3)} aria-hidden="true"/>
    <p className={`${styles.abs} ${styles.lead}`} style={box(248,596,1424,undefined,30)}>ANAYAFX rents disguise media servers and complete show-ready racks from our own inventory, configured and tested by the same team that programs shows at Sphere. Our pricing is very competitive, and we&apos;ll beat any other quote.</p>
    <ul className={`${styles.abs} ${styles.tags}`} style={box(260,744,1400,undefined,19)}>{cover.map(item=><li key={item}>{item}</li>)}</ul>
    <p className={styles.hint} aria-hidden="true">scroll<span>↓</span></p>
   </div>

   <div ref={bind(els,"s2")} className={styles.scene} data-scene="2">
    <p ref={bind(els,"disguise")} className={`${styles.abs} ${styles.big}`} style={box(160,192,1600,undefined,199.9)}>DISGUISE</p>
    <p ref={bind(els,"gx3-text")} className={`${styles.abs} ${styles.big}`} style={box(160,708,1600,undefined,213.2)}>GX<b>3</b>/GX<b>3</b> PRO</p>
    <div ref={bind(els,"gx3")} className={`${styles.abs} ${styles.product}`} style={box(433,344,1054,392)}><Image src="/images/rentals/gx3.webp" alt="disguise GX 3 media server, front panel" width={1342} height={500} unoptimized/></div>
   </div>

   <div ref={bind(els,"s3")} className={styles.scene} data-scene="3">
    <div ref={bind(els,"info-text")} className={`${styles.abs} ${styles.info}`} style={box(87,269,832,undefined,31.4)}>
     <p>The GX 3 is a professional real-time media server designed for live events, broadcast, immersive installations, and large-scale visual productions. Its main functions include 4K media playback, real-time graphics rendering, video capture and processing, generative content, synchronization, high-speed networking, and flexible video output through VFC cards.</p>
     <p>The GX 3+ is a high-performance real-time media server built for demanding visual productions, extended reality, and generative workflows. It supports multi-layer 4K playback, real-time 3D graphics, Unreal Engine, Notch and TouchDesigner workflows, video capture, IP and VFC outputs, synchronization, and large LED, projection, and immersive display systems.</p>
    </div>
    <div ref={bind(els,"server")} className={`${styles.abs} ${styles.server}`} style={box(919,90,877,899)}><Image src="/images/rentals/server.webp" alt="disguise GX 3+ server with a 3D interface monitor" width={1225} height={1254} unoptimized/></div>
   </div>

   <div ref={bind(els,"s4")} className={styles.scene} data-scene="4">
    <div className={styles.vfc} data-detail={detail}>
     <h2 className={styles.outputHeading}>VFC outputs</h2>
     <div className={styles.letters} aria-hidden="true">
      {([["v",259],["f",473],["c",685]] as const).map(([k,y])=><span key={k} ref={bind(els,`l-${k}`)} className={`${styles.abs} ${styles.vfcLetter}`} style={box(137,y-11,200,undefined,186)}>{k.toUpperCase()}</span>)}
      <span ref={bind(els,"l-out")} className={`${styles.abs} ${styles.vfcOut}`} style={box(1593,236,120,undefined,72.9)}>{["o","u","t","p","u","t","´s"].map((c,i)=><i key={i}>{c}</i>)}</span>
     </div>
     {outputs.map((o,i)=>{
      const [dx,dy,dw,dh]=o.card,ox=387+CARD_PITCH*i,on=selected===i;
      const [x,y]=detail&&on?[dx,dy]:[ox,199];
      return <div key={o.id} className={`${styles.abs} ${styles.card} ${detail&&!on?styles.cardOff:""}`} style={box(x,y,dw,dh)}>
       <button ref={bind(els,`card-${i}`)} type="button" className={styles.cardButton} aria-pressed={on} aria-expanded={on} aria-controls={`rental-output-${o.id}`} aria-label={`${o.title}: show details`} onClick={()=>setSelected(on?null:i)}><Image src={`/images/rentals/card-${o.id}.webp`} alt="" width={dw} height={dh} unoptimized/><span className={styles.cardLabel}>{o.title}</span></button>
      </div>;
     })}
     <p className={`${styles.abs} ${styles.choose}`} style={box(660,925,600,undefined,20)}>Select an output ↗</p>
     {outputs.map((o,i)=><div key={o.id} id={`rental-output-${o.id}`} className={`${styles.detail} ${selected===i?styles.detailOn:""}`} aria-hidden={selected!==i}>
      <h3 className={`${styles.abs} ${styles.outTitle}`} style={box(676,243,undefined,undefined,130.3)}>{o.title}</h3>
      <p className={`${styles.abs} ${styles.outText}`} style={box(675,454,920,undefined,36)}>{lines(o.lines)}</p>
      <span className={`${styles.abs} ${styles.rule}`} style={box(710,636,495,3)} aria-hidden="true"/>
      <Link href="/contact?type=Rental" className={`${styles.abs} ${styles.pill}`} style={box(919,723,322,51,21.2)} tabIndex={selected===i?0:-1}>Rental information</Link>
     </div>)}
     <button type="button" className={`${styles.abs} ${styles.back}`} style={box(676,170,undefined,undefined,22)} onClick={()=>setSelected(null)} tabIndex={detail?0:-1}>← All outputs</button>
    </div>
   </div>

   <div ref={bind(els,"racks")} className={styles.scene} data-scene="4b">
    <div ref={bind(els,"rack-img")} className={`${styles.abs} ${styles.rackImage}`} style={box(194,157,766,766)}><Image src="/images/rentals/rack.webp" alt="Professional Blackmagic video router mounted in a rack" width={1254} height={1254} unoptimized/></div>
    <h2 ref={bind(els,"rack-title")} className={`${styles.abs} ${styles.racksTitle}`} style={box(1022,290,820,undefined,94.7)}>Show-ready racks</h2>
    <p ref={bind(els,"rack-text")} className={`${styles.abs} ${styles.racksText}`} style={box(1022,480,860,undefined,40)}>{lines(rackLines)}</p>
    <Link ref={bind(els,"rack-cta")} href="/contact?type=Rental" className={`${styles.abs} ${styles.pill} ${styles.pillGhost}`} style={box(1263,752,322,51,21.2)}>Rental information</Link>
   </div>

   <div ref={zoomSection} className={styles.zoomSection} data-rental-zoom>
   <div ref={zoomStage} className={styles.zoomStage} data-rental-zoom-stage>
   <div ref={bind(els,"s5")} className={styles.scene} data-scene="5">
    <div ref={bind(els,"stage")} className={styles.ledStage} aria-hidden="true"><Image src="/images/rentals/led-stage.webp" alt="" fill sizes="100vw" unoptimized/></div>
    <div ref={bind(els,"cam-rig")} className={styles.rig} style={{transformOrigin:"0 0"}}>
     <div ref={bind(els,"silhouette")} className={`${styles.abs} ${styles.silhouette}`} style={rig(633,133,653,857)}><Image src="/images/rentals/silhouette-orig.webp" alt="" width={653} height={857} unoptimized/></div>
     <div ref={bind(els,"cam")} className={`${styles.abs} ${styles.camera}`} style={rig(633,133,653,857)}><Image src="/images/rentals/camera-fit.webp" alt="Cinema camera on a support rig with monitor and accessories" width={653} height={857} unoptimized/></div>
    </div>
    <h2 ref={bind(els,"cam-text")} className={`${styles.abs} ${styles.gearTitle}`} style={box(70,250,760,undefined,200)}>Support{" "}<br/>gear</h2>
    <p ref={bind(els,"cam-body")} className={`${styles.abs} ${styles.gearBody}`} style={box(70,760,310,undefined,28)}>Camera calibration kit,<br/>KVM, audio<br/>and networking</p>
    <p ref={bind(els,"cam-hint")} className={`${styles.abs} ${styles.scrollHint}`} style={box(1440,517,406,undefined,35.9)} aria-hidden="true">[ Scroll to view ]</p>
   </div>

   <div ref={bind(els,"s6")} className={styles.scene} data-scene="6">
    <div ref={bind(els,"rig")} className={styles.rig}>
     <div className={`${styles.abs} ${styles.monitor}`} style={rig(189,213,1731,776)}><Image src="/images/rentals/monitor.webp" alt="Professional monitor on an articulated arm" width={1700} height={763} unoptimized/></div>
     <div className={`${styles.abs} ${styles.screen}`} style={rig(280,265,893,495)}>
      <p ref={bind(els,"monitor-label")} className={styles.screenLabel} aria-hidden="true">[ Scroll to view ]</p>
      <div ref={bind(els,"visor")} className={styles.visor}>
       <div className={styles.gallery}>
        {rows.map(row=><div key={row.y} className={`${styles.row} ${row.reverse?styles.rowReverse:""}`} style={{"--row-top":`calc(${row.y}*var(--u))`,"--row-h":`calc(${row.h}*var(--u))`,"--card-w":`calc(${row.w}*var(--u))`,"--gap":`calc(${row.gap}*var(--u))`} as CSSProperties} aria-hidden="true">
         {strip(row.offset).map((photo,i)=><div key={i} className={`${styles.photo} ${i>=photos.length?styles.dup:""}`}><Image src={photo.src} alt="" fill sizes="30vw" unoptimized/></div>)}
        </div>)}
        <p ref={bind(els,"phrase")} className={styles.phrase}>Press <Link href="/contact?type=Rental" className={styles.rec}>[REC]</Link>. Make It real</p>
       </div>
      </div>
      <span ref={bind(els,"edge")} className={styles.edge} aria-hidden="true"/>
     </div>
    </div>
   </div>

   </div>
   </div>
  </div>
 </section>;
}
