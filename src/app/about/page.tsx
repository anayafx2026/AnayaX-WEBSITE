import type {Metadata} from "next";
import Link from "next/link";
import {MediaPlaceholder} from "@/components/media-placeholder";
import {ClientStrip} from "@/components/client-strip";
import {technologies} from "@/content/site";
export const metadata:Metadata={title:"Studio",description:"Anaya FX brings creative direction, technical design and on-site delivery into a single conversation.",alternates:{canonical:"/about"}};
const principles=[
{title:"Begin with the audience",copy:"Every technical decision starts with the feeling the audience should carry away."},
{title:"Make one language",copy:"Image, light, sound, space and timing are designed as parts of the same story."},
{title:"Build for the real world",copy:"Ideas become systems that can be rehearsed, operated and trusted when the moment arrives."}];
const disciplines=[
{title:"Creative",copy:"Concepts, visual worlds and show language that give the work its point of view."},
{title:"Technical",copy:"Systems, workflows and rehearsal-ready infrastructure built around the idea."},
{title:"Live",copy:"Focused execution in the room, where every detail needs to work at once."}];
export default function AboutPage(){return <main id="contenido" tabIndex={-1}>
<header className="page-intro about-intro"><p className="eyebrow">The studio</p><h1>We make the technical<br/>feel invisible.</h1><p className="lead">Anaya FX is a creative technology company for live, spatial and screen-based experiences. We give ambitious ideas the visual language, systems and care to become real.</p></header>
<figure className="studio-figure"><div className="about-media"><MediaPlaceholder kind="foto" label="Anaya FX · estudio y equipo"/></div><figcaption>Every frame begins with a point of view.</figcaption></figure>
<section className="editorial-section"><p className="eyebrow">A connected practice</p><h2>One company.<br/>Many ways to move an audience.</h2><div className="editorial-copy"><p>We bring creative direction, technical design and on-site delivery into a single conversation. That connection is what lets a film, a concert, a stage or an installation feel coherent from the first idea to the final cue.</p><p>Our role is to make complex production feel clear. Behind every visual moment is a shared process that gives teams room to experiment, decide and execute with confidence.</p></div><figure className="editorial-figure"><MediaPlaceholder kind="foto" label="Anaya FX · dirección creativa y entrega técnica"/></figure><div className="principles-grid">{principles.map((item,index)=><article key={item.title}><span>0{index+1}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div></section>
<section className="studio-summary"><div className="studio-stat"><strong>+20<span> years</span></strong><p>turning ambitious visual ideas into precise, repeatable productions.</p></div><div><p className="eyebrow">Our people</p><h2>Artists who engineer.<br/>Engineers who imagine.</h2><p>Led by Simón Anaya, Anaya FX works at the intersection of creative direction, real-time media and complex video systems.</p><p>Our compact senior team stays close to every project—from previs and system design through programming and live operation.</p><div className="technology-list">{technologies.map(name=><span key={name}>{name}</span>)}</div></div></section>
<section className="editorial-section"><p className="eyebrow">The moment matters</p><h2>A seamless experience<br/>is never an accident.</h2><div className="editorial-copy"><p>There is a precise choreography behind the work: creative teams, artists, technicians and operators moving with one purpose. We create the framework that lets every discipline do its best work together.</p></div></section>
<figure className="studio-figure"><div className="about-media"><MediaPlaceholder kind="foto" label="Anaya FX · producción en vivo"/></div><figcaption>Built to hold attention, designed to stay with people.</figcaption></figure>
<section className="editorial-section"><p className="eyebrow">What we bring</p><h2>From the first sketch<br/>to the last cue.</h2><div className="principles-grid">{disciplines.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div><Link href="/services" className="pill-link">Explore our services ↗</Link></section><ClientStrip/>
</main>;}
