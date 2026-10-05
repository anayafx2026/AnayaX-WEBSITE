"use client";
import Image from "next/image";
import {useEffect,useRef,type CSSProperties} from "react";
import styles from "./studio-editorial.module.css";

const source=(n:number)=>`/images/studio-robot-frames/RobotShotforWebsite_unedited_${86400+n}.png`;
// The stills in RobotShotforWebsite_sequences.psd establish the four key poses:
// 86400, 86414, 86429 and 86443. The short intervals between them preserve the
// motion of the original robot sequence without changing the PSD composition.
// Between the opening and scene 2 the robot starts moving as soon as the title begins to fade
// and keeps creeping forward (14 -> 18) while scene 2 is read; the later poses stay on the PSD stills.
// Scroll length of the whole story, in viewport heights (the CSS height is derived from it). Every timing below is
// written in screens so the pacing is easy to tune: the robot gets 1.2-2.6 screens for each move, and the texts
// transition across those same stretches; scenes 1-3 cross-fade (about 60% overlap); scene 4 hands over to the closing words without overlap.
const SCREENS=11;
const at=(screens:number)=>screens/SCREENS;
// The robot never parks: its frame advances all the way from the first scroll to the last pose. The PSD stills
// (14, 29, 43) are passed in the middle of the scene 2, 3 and 4 text, so each composition matches at its centre.
const stops: Array<[number,number]>=[[0,0],[at(1.8),14],[at(3.9),29],[at(5.9),43],[at(9.2),137],[1,137]];
// Line breaks follow the PSD (SECUENCIA 3); on small screens the spans flow as normal text.
const prepareLeft=["Previsualize your concept,","test camera positions and","explore the shot before production","begins. Bring your team and turn","creative questions into a clear plan."];
const prepareRight=["Explore robotic camera movement","with ANAYAFX. Shape the path,","refine the framing and find the","motion that serves your story."];
const lines=(text:string[])=>text.map((line,i)=><span key={i} className={styles.line}>{line}{" "}</span>);
const phonePrepareLeft=["Previsualize your","concept, test","camera","positions and","explore the shot","before production","begins. Bring your","team and turn","creative questions","into a clear plan."];
const phonePrepareRight=["Explore robotic","camera movement","with ANAYAFX.","Shape the path,","refine the framing","and find the","motion that serves","your story."];
const phoneLines=(text:string[])=>text.map((line,i)=><span key={i} className={styles.phoneLine}>{line}{" "}</span>);
// PNG transforms measured against the five poses in CELULAR SECUENCIAS.
// Each entry is [scroll screens, scale, x from artboard centre, y from artboard top].
const phoneFraming=[[0,.5784,-532.7,225.3],[1.8,.5534,-494,270.7],[3.9,.6984,-669.5,147.5],[5.9,.664,-658.5,222],[9.2,.768,-726.5,221],[11,.768,-726.5,221]];
// Each text block fades in over `enter` and out over `leave` (scroll progress). The robot keeps moving in the
// gaps between poses, and those gaps are covered by the out of one block followed by the in of the next, so the
// screen is never left without text. The closing block has no `leave`: it exits with the page footer instead.
const stories:Array<{enter:[number,number],leave?:[number,number],label:string,title:string,body?:string}>=[
 {enter:[at(.5),at(1.4)],leave:[at(2.2),at(3.16)],label:"01 / THE STUDIO",title:"Your next shot starts here.",body:"Our studio in Los Angeles sits inside The Core, a shared creative space, and ANAYAFX is the technical team that runs The Core. It's where we build, test and previsualize shows before they go on the road, and where clients can shoot."},
 {enter:[at(2.44),at(3.4)],leave:[at(4.4),at(5.36)],label:"02 / PREPARE",title:"See it before you shoot it.",body:prepareLeft.join(" ")},
 {enter:[at(4.64),at(5.6)],leave:[at(6.2),at(6.9)],label:"03 / CREATE",title:"Give your vision movement.",body:prepareRight.join(" ")},
 {enter:[at(6.9),at(8.6)],label:"04 / YOUR NEXT PRODUCTION",title:"The next shot could be yours."},
];
// Compact layouts give each paragraph its own reading interval instead of
// cross-fading two full blocks of copy in the same part of a phone screen.
const compactTimings=[
 {enter:[at(.7),at(1.4)],leave:[at(2.1),at(2.5)]},
 {enter:[at(2.6),at(3.2)],leave:[at(4.7),at(5.2)]},
 {enter:[at(5.3),at(5.7)],leave:[at(6.2),at(6.9)]},
 {enter:[at(6.9),at(8.6)]},
];
const ramp=(value:number,from:number,to:number)=>{const t=Math.min(1,Math.max(0,(value-from)/(to-from)));return t*t*(3-2*t);};
export function StudioStory(){
 const section=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null),opening=useRef<HTMLDivElement>(null),openingFront=useRef<HTMLDivElement>(null),robot=useRef<HTMLDivElement>(null),movementFront=useRef<HTMLDivElement>(null),closingFront=useRef<HTMLDivElement>(null);
 const cards=useRef<Array<HTMLElement|null>>([]);
 useEffect(()=>{
  const target=section.current,surface=canvas.current;
  if(!target||!surface)return;
  const ctx=surface.getContext("2d");if(!ctx)return;
  const motion=matchMedia("(prefers-reduced-motion: reduce)"),desktop=matchMedia("(min-width:1200px) and (min-height:600px) and (hover:hover) and (pointer:fine)"),short=matchMedia("(max-height:599px)"),frames=new Map<number,HTMLImageElement>();
  let active=0,raf=0,disposed=false;
  const draw=()=>{
   const image=frames.get(active);
   if(disposed||!image?.complete||!image.naturalWidth)return;
   ctx.clearRect(0,0,1920,1080);ctx.drawImage(image,0,0,1920,1080);
   surface.dataset.ready="true";surface.dataset.frame=String(active);
  };
  const load=(n:number)=>{
   if(n<0||n>137||frames.has(n))return;
   const image=new window.Image();frames.set(n,image);image.decoding="async";
   image.onload=draw;image.onerror=()=>{frames.delete(n);};image.src=source(n);
  };
  const update=()=>{
   raf=0;
   const progress=Math.min(1,Math.max(0,-target.getBoundingClientRect().top/Math.max(1,target.offsetHeight-innerHeight)));
   const staticFlow=motion.matches||short.matches;
   const phoneComposition=!staticFlow&&innerWidth<600;
   // CELULAR SECUENCIAS uses a 597 x 1049 crop of the PSD. Keep the existing
   // animated PNGs, interpolating their framing through all five compositions.
   target.toggleAttribute("data-mobile-composition",phoneComposition);
   target.toggleAttribute("data-mobile-reading",phoneComposition&&progress>=at(1)&&progress<at(5.2));
   if(phoneComposition){
    const width=document.documentElement.clientWidth,u=Math.min(width/597,(innerHeight-110)/1049),top=(innerHeight-1049*u-110)/2;
    let scale=.5784,x=-532.7,y=225.3;
    for(let i=1;i<phoneFraming.length;i++){
     const previous=phoneFraming[i-1],next=phoneFraming[i];
     if(previous&&next&&progress<=at(next[0]??11)){
      const blend=ramp(progress,at(previous[0]??0),at(next[0]??11));
      scale=(previous[1]??scale)+((next[1]??scale)-(previous[1]??scale))*blend;
      x=(previous[2]??x)+((next[2]??x)-(previous[2]??x))*blend;
      y=(previous[3]??y)+((next[3]??y)-(previous[3]??y))*blend;
      break;
     }
    }
    target.style.setProperty("--phone-image-width",`${1920*scale*u}px`);
    target.style.setProperty("--phone-image-height",`${1080*scale*u}px`);
    target.style.setProperty("--phone-u",`${u}px`);
    target.style.setProperty("--phone-top",`${top}px`);
    target.style.setProperty("--phone-image-left",`${width/2+x*u}px`);
    target.style.setProperty("--phone-image-top",`${top+y*u}px`);
   }
   let desired=0;
   for(let i=1;i<stops.length;i++){const previous=stops[i-1],next=stops[i];if(previous&&next&&progress<=next[0]){const [a,x]=previous,[b,y]=next;desired=Math.round(x+(y-x)*(progress-a)/(b-a));break;}}
   active=motion.matches?0:desired;load(active);
   if(!motion.matches)for(let d=1;d<=8;d++){load(active+d);load(active-d);}
   draw();
   const fade=staticFlow?0:Math.min(1,progress/at(1));
   [opening.current,openingFront.current].forEach(layer=>{if(layer){layer.style.opacity=String(1-fade);layer.style.transform=`translateY(${-fade*140}px)`;layer.style.filter=`blur(${fade*14}px)`;}});
   // Past the end of the story the page footer slides in: the closing sequence rises, blurs and then goes dark.
   const overshoot=staticFlow?0:Math.max(0,innerHeight-target.getBoundingClientRect().bottom);
   const exit=Math.min(1,overshoot/(innerHeight*.9));
   const layer=robot.current;
   if(layer){layer.style.filter=exit>0?`blur(${ramp(exit,0,.55)*22}px) brightness(${1-ramp(exit,.3,1)*.85})`:"";layer.style.opacity=String(1-ramp(exit,.45,1));}
   cards.current.forEach((card,i)=>{
    const story=stories[i];
    if(!card||!story)return;
    // In: rises from below while the blur clears. Out: keeps rising while it blurs away.
    const timing=desktop.matches?story:compactTimings[i]??story;
    const inn=ramp(progress,timing.enter[0]??0,timing.enter[1]??1),out=timing.leave?ramp(progress,timing.leave[0]??0,timing.leave[1]??1):0;
    const opacity=staticFlow?1:inn*(1-out),shift=(1-inn)*40-out*40,blur=((1-inn)+out)*10;
    const apply=(node:HTMLElement,lift:number)=>{node.style.opacity=String(opacity);node.style.transform=`translateY(${shift-lift}px)`;node.style.filter=blur>.05?`blur(${blur}px)`:"";node.style.visibility=opacity===0?"hidden":"visible";};
    apply(card,0);
    if(i===2&&movementFront.current)apply(movementFront.current,0);
    card.inert=opacity<.1;card.setAttribute("aria-hidden",String(opacity<.1));
    if(i===3&&closingFront.current){
     // Entrance order: the side words first, the middle "shot" as they start to climb, and "yours." a little before the
     // side words stop climbing. The side words and "shot" come in out of focus and finish clearing just after
     // "yours." has appeared.
     const box=closingFront.current;
     box.style.opacity="1";box.style.filter="";box.style.visibility=!staticFlow&&progress>=at(6.9)?"visible":"hidden";
     box.style.transform=`translateY(${-overshoot*1.1}px)`;
     const words=box.querySelectorAll<HTMLElement>("h2 > span");
     if(words.length===4){
      const [next,shot,could,yours]=words as unknown as [HTMLElement,HTMLElement,HTMLElement,HTMLElement];
      const sideIn=ramp(progress,at(6.9),at(8)),shotIn=ramp(progress,at(7.2),at(8.3)),yoursIn=ramp(progress,at(7.6),at(8.3));
      const sideBlur=(1-ramp(progress,at(6.9),at(8.4)))*16,shotBlur=(1-ramp(progress,at(7.2),at(8.5)))*16;
      // Out (page footer): the side words slide outwards while growing; the middle words grow and blur, on top of the
      // exit already applied to the whole layer.
      const rise=(1-sideIn)*innerHeight*.3,grow=ramp(exit,0,1),slide=grow*innerWidth*.28;
      next.style.opacity=could.style.opacity=String(sideIn);
      next.style.transform=`translate(${-slide}px,${rise}px) scale(${1+grow*1.4})`;
      could.style.transform=`translate(${slide}px,${rise}px) scale(${1+grow*1.4})`;
      next.style.filter=could.style.filter=sideBlur>.05?`blur(${sideBlur}px)`:"";
      shot.style.opacity=String(shotIn);shot.style.transform=`translateY(${(1-shotIn)*40}px) scale(${1+grow*.8})`;
      shot.style.filter=shotBlur+grow*14>.05?`blur(${shotBlur+grow*14}px)`:"";
      yours.style.opacity=String(yoursIn);yours.style.transform=grow>0?`scale(${1+grow*.8})`:"";
      yours.style.filter=(1-yoursIn)*18+grow*14>.05?`blur(${(1-yoursIn)*18+grow*14}px)`:"";
     }
    }
   });
  };
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};update();
  window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);motion.addEventListener("change",schedule);desktop.addEventListener("change",schedule);short.addEventListener("change",schedule);
  return()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);motion.removeEventListener("change",schedule);desktop.removeEventListener("change",schedule);short.removeEventListener("change",schedule);};
 },[]);
 return <section ref={section} className={styles.story} style={{"--screens":SCREENS} as CSSProperties} data-studio-story aria-label="Explore the ANAYAFX studio">
  <div className={styles.background} aria-hidden="true"/>
  <div ref={robot} className={styles.robot} aria-hidden="true">
   <Image className={styles.poster} src={source(0)} alt="" width={1920} height={1080} priority/>
   <canvas ref={canvas} className={styles.canvas} width={1920} height={1080}/>
   <div ref={openingFront} className={styles.openingFront}><p className={`${styles.title} ${styles.frontTitle}`}><span>Your</span> <span className={styles.ghost}>next shot</span><br/><span>starts</span> <span className={styles.ghost}>here.</span></p><p className={styles.hint}>scroll<span>↓</span></p></div>
   <div ref={movementFront} className={`${styles.scene} ${styles.movement} ${styles.movementFront}`}><h2><span className={styles.movementLead}>Give your<br/>vision</span><span className={styles.movementWord}>movement.</span></h2></div>
   <div ref={closingFront} className={`${styles.scene} ${styles.closing} ${styles.closingFront}`}><h2><span className={styles.next}>The next</span><span className={styles.shot}><Image className={styles.wordImage} src="/images/studio-closing/shot.png" alt="" width={376} height={132} unoptimized/><span className={styles.mobileClosingWord}>shot</span></span><span className={styles.could}>could be</span><span className={styles.yours}><Image className={styles.wordImage} src="/images/studio-closing/yours.png" alt="" width={529} height={135} unoptimized/><span className={styles.mobileClosingWord}>yours.</span></span></h2></div>
  </div>
  <div className={styles.stage}>
   <div ref={opening} className={styles.opening} data-studio-opening><h1 className={styles.title} aria-label="Your next shot starts here."><span className={styles.front}>Your</span> next shot<br/><span className={styles.front}>starts</span> here.</h1><p className={`${styles.hint} ${styles.hintBack}`}>scroll<span aria-hidden="true">↓</span></p></div>
   {stories.map((story,i)=><article ref={node=>{cards.current[i]=node;}} key={story.label} className={`${styles.scene} ${[styles.about,styles.prepare,styles.movement,styles.closing][i]}`} data-story={i+1}>
    {i===0&&<><h2 className="sr-only">The Studio</h2><p className={styles.description}>{story.body}</p></>}
    {i===1&&<><h2>See it before you<br/>shoot it.</h2><div className={styles.prepareCopy}><p className={`${styles.description} ${styles.left}`}><span className={styles.standardCopy}>{lines(prepareLeft)}</span><span className={styles.phoneCopy}>{phoneLines(phonePrepareLeft)}</span></p><p className={`${styles.description} ${styles.right}`}><span className={styles.standardCopy}>{lines(prepareRight)}</span><span className={styles.phoneCopy}>{phoneLines(phonePrepareRight)}</span></p><span className={`${styles.rule} ${styles.ruleLeft}`} aria-hidden="true"/><span className={`${styles.rule} ${styles.ruleRight}`} aria-hidden="true"/></div></>}
    {i===2&&<h2><span className={styles.movementLead}>Give your<span className={styles.mobileBreak}><br/></span> vision</span><br/><span className={styles.movementWord}>movement.</span></h2>}
    {i===3&&<h2 className={styles.closingBack} aria-label={story.title}><span className={styles.next}>The next</span><span className={styles.shot}>shot</span><span className={styles.could}>could be</span><span className={styles.yours}>yours.</span></h2>}
   </article>)}
  </div>
 </section>;
}
