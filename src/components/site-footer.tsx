import Link from "next/link";
import {BrandLogo} from "./brand-logo";
import {siteContent} from "@/content/site";
export function SiteFooter(){return <footer className="site-footer">
  <p className="eyebrow">Have a project in mind?</p>
  <Link href="/contact" className="footer-invitation">Let’s make the<br/>invisible visible. <span aria-hidden="true">↗</span></Link>
  <Link href="/" className="footer-mark" aria-label="Anaya FX home"><BrandLogo/></Link>
  <p className="footer-motto">LIVE · SPATIAL · VIRTUAL</p>
  <div className="footer-details"><p>Los Angeles, California · Available worldwide</p>
  <nav aria-label="Footer navigation">{siteContent.navigation.map(item=><Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/faq">FAQs</Link></nav>
  <a href="mailto:studio@anayafx.com">studio@anayafx.com ↗</a>
  <p>© 2026 Anaya Visual, Inc.</p></div>
</footer>;}
