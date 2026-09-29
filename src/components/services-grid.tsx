import Link from "next/link";
import {services} from "@/content/site";
import {MediaPlaceholder} from "./media-placeholder";

export function ServicesGrid(){
  return <section id="services" className="services-grid-section" aria-labelledby="services-heading">
    <div className="section-heading"><p className="eyebrow">Services</p><h2 id="services-heading">Services we offer.</h2><p>Creative and technical direction for every surface, from the first frame to showtime.</p></div>
    <div className="service-grid">
      {services.map((service,index)=>(
        <Link key={service.slug} href={`/services/${service.slug}`} className="service-tile" aria-label={service.title}>
          <div className="service-tile-visual"><MediaPlaceholder kind="foto" label={`${service.title} · servicio`}/></div>
          <div className="service-tile-head"><span>{String(index+1).padStart(2,"0")}</span><span className="service-tile-arrow" aria-hidden="true">↗</span></div>
          <h3 className="service-tile-title">{service.title}</h3>
          <p className="service-tile-line">{service.line}</p>
        </Link>
      ))}
    </div>
    <Link href="/services" className="pill-link">View all services <span aria-hidden="true">↗</span></Link>
  </section>;
}
