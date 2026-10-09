import type {Metadata} from "next";
import Link from "next/link";
import {siteContent,capabilities,technologies} from "@/content/site";
import {ServiceGallery} from "@/components/service-gallery";
import {ServiceLoop} from "@/components/service-loop";
import {ElasticGallery} from "@/components/elastic-gallery";
import {FeaturedProjects} from "@/components/featured-projects";
import {ClientStrip} from "@/components/client-strip";
import {IntroHero} from "@/components/intro-hero";
export const metadata:Metadata={title:"ANAYAFX  ·  Creative Vision. Technical Precision.",alternates:{canonical:"/"},openGraph:{type:"website",locale:"en_US",title:siteContent.name,description:siteContent.description,url:"/",siteName:siteContent.name}};
export default function HomePage(){return <main id="contenido" tabIndex={-1}>
  <IntroHero/>
  <section id="introduction" className="intro-section" aria-labelledby="intro-heading"><div className="intro-content" data-reveal>
    <p className="eyebrow">Creative vision. Technical precision.</p>
    <h2 id="intro-heading" className="intro-statement">Sculpting with light.<br/>{" "}Shadow.<br/>{" "}Motion.</h2>
    <p className="intro-description">ANAYAFX works at the intersection of creative direction, real-time media and complex video systems. From a single pixel to an arena-scale canvas, we connect creative intent with the systems that make it real.</p>
  </div><a className="down-arrow" href="#home-services" aria-label="Explore services">↓</a></section>
  <div id="home-services">
    <ServiceLoop/>
    <ServiceGallery/>
  </div>
  <section id="selected-work" className="selected-work-editorial" aria-labelledby="selected-work-heading">
    <div className="section-heading"><p className="eyebrow">Selected work</p><h2 id="selected-work-heading">Services of place.</h2></div>
    <FeaturedProjects/>
  </section>
  <section className="practice-section"><div className="section-heading"><p className="eyebrow">Capabilities</p><h2>One team.<br/>Every surface.</h2><p>Creative direction, content and show systems, working together.</p></div>
    <div className="practice-grid">{capabilities.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
  </section>
  <section id="our-work" className="work-showcase" aria-labelledby="work-heading">
    <div className="section-heading"><h2 id="work-heading">Our work.</h2></div>
    <ElasticGallery/>
    <Link href="/work" className="pill-link">View all work</Link>
  </section>
  <ClientStrip/>
  <section className="studio-summary"><div className="studio-stat"><strong>+20<span> years</span></strong><p>turning ambitious visual ideas into precise, repeatable productions.</p></div><div><p className="eyebrow">The studio</p><h2>Artists who engineer.<br/>Engineers who imagine.</h2><p>Led by Simón Anaya, ANAYAFX brings creative direction, real-time media and large-scale video systems together for live shows, corporate events and immersive spaces.</p><p>Our compact senior team stays close to every project · from previs and system design through programming and live operation.</p><div className="technology-list">{technologies.map(name=><span key={name}>{name}</span>)}</div><Link href="/about" className="pill-link">About ANAYAFX ↗</Link><div className="home-business-links"><Link href="/rentals">Rentals ↗</Link><Link href="/studio">The Studio ↗</Link></div></div></section>
</main>;}
