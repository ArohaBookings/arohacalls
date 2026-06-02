import type { MetadataRoute } from "next";
import { comparePages, blogSeedPosts } from "@/lib/marketing-data";
import { siteConfig } from "@/lib/site-config";
import { INDUSTRIES } from "@/lib/industries";
import { LOCATIONS } from "@/lib/locations";
import { PLANS } from "@/lib/plans";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { queryOrEmpty } from "@/lib/safe-db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cmsBlogPosts = await queryOrEmpty(
    db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt }).from(blogPosts).where(eq(blogPosts.status, "published")),
    "sitemap-blog-posts",
  );
  const staticRoutes = [
    "",
    "/features",
    "/pricing",
    "/demo",
    "/live-demo",
    "/about",
    "/contact",
    "/aroha-ai",
    "/case-studies",
    "/compare",
    "/status",
    "/roadmap",
    "/affiliates",
    "/blog",
    "/for",
    "/locations",
    "/legal/privacy",
    "/legal/terms",
    "/legal/refunds",
  ];
  const compareRoutes = Object.keys(comparePages).map((slug) => `/compare/${slug}`);
  const blogRoutes = [...new Set([
    ...blogSeedPosts.map((post) => `/blog/${post.slug}`),
    ...cmsBlogPosts.map((post) => `/blog/${post.slug}`),
  ])];
  const industryRoutes = INDUSTRIES.map((i) => `/for/${i.slug}`);
  const locationRoutes = LOCATIONS.map((l) => `/locations/${l.slug}`);
  const planRoutes = PLANS.map((p) => `/pricing/${p.slug}`);

  return [
    ...staticRoutes,
    ...compareRoutes,
    ...blogRoutes,
    ...industryRoutes,
    ...locationRoutes,
    ...planRoutes,
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route.startsWith("/pricing/")
          ? 0.95
          : route.startsWith("/for/") || route.startsWith("/locations/")
            ? 0.85
            : 0.7,
  }));
}
