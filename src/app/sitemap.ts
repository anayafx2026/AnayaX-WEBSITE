export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { readSiteConfig } from "@/config/site";
import { projects, services, siteContent } from "@/content/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const site = readSiteConfig(process.env);
  // Only add published canonical pages. Do not fabricate modification dates.
  const paths = [...siteContent.navigation.map(item => item.href), "/faqs", ...projects.map(item => `/work/${item.slug}`), ...services.map(item => `/services/${item.slug}`)];
  return site.indexable ? paths.map(path => ({ url: site.origin + path })) : [];
}
