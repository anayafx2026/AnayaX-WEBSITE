import type {Metadata} from "next";
import {readSiteConfig} from "@/config/site";
import {siteContent} from "@/content/site";
import {SiteHeader} from "@/components/site-header";
import {SiteFooter} from "@/components/site-footer";
import {SiteExperience} from "@/components/site-experience";
import {ThemeSelector} from "@/components/theme-selector";
import "./globals.css";
const site=readSiteConfig(process.env);
export const metadata:Metadata={metadataBase:new URL(site.origin),title:{default:siteContent.name,template:`%s | ${siteContent.name}`},description:siteContent.description,robots:{index:site.indexable,follow:site.indexable}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang={siteContent.language} data-theme="dark"><body><SiteExperience><a className="skip-link" href="#contenido">Skip to content</a><SiteHeader/><ThemeSelector/>{children}<SiteFooter/></SiteExperience></body></html>;}
