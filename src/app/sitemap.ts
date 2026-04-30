import type { MetadataRoute } from "next";
import { comparePages, blogSeedPosts } from "@/lib/marketing-data";
import { siteConfig } from "@/lib/site-config";
import { INDUSTRIES } from "@/lib/industries";
import { LOCATIONS } from "@/lib/locations";
import { PLANS } from "@/lib/plans";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/features",
    "/pricing",
    "/demo",
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
  const blogRoutes = blogSeedPosts.map((post) => `/blog/${post.slug}`);
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
