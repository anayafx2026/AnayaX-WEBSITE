export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { readSiteConfig } from "@/config/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const site = readSiteConfig(process.env);
  // Only add published canonical pages. Do not fabricate modification dates.
  return site.indexable ? [{ url: site.origin + "/" }] : [];
}
