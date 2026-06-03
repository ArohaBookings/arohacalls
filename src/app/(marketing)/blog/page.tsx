import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { blogSeedPosts } from "@/lib/marketing-data";
import { siteConfig } from "@/lib/site-config";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { queryOrEmpty } from "@/lib/safe-db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides about AI receptionists, missed calls, voicemail, booking automation, and Aroha Calls.",
  alternates: { canonical: "/blog" },
};

const sections = [
  {
    key: "news",
    eyebrow: "News",
    title: "News and updates",
    description: "Launch notes, product updates, system improvements, and company updates from Aroha Group.",
    empty: "No news published yet. Use the admin blog editor to publish launches, company updates, and customer-facing announcements here.",
  },
  {
    key: "product-update",
    eyebrow: "Product updates",
    title: "What changed in Aroha Calls",
    description: "New managed-service features, Aroha AI handoffs, analytics improvements, and front-office workflow updates.",
    empty: "No product updates published yet. Use this section for new features, setup improvements, integrations, and platform updates.",
  },
  {
    key: "guide",
    eyebrow: "Guides",
    title: "AI receptionist guides",
    description: "Practical guides for missed calls, bookings, customer memory, voicemail replacement, and front-office automation.",
    empty: "No guides published yet. Add evergreen SEO articles from the admin blog editor.",
  },
] as const;

export default async function BlogPage() {
  const published = await queryOrEmpty(
    db.select().from(blogPosts).where(eq(blogPosts.status, "published")),
    "published-blog-posts",
  );
  const cmsPosts = published.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? post.seoDescription ?? "Aroha Calls guide.",
    category: post.category ?? "guide",
  }));
  const allPosts = [
    ...cmsPosts,
    ...blogSeedPosts
      .filter((seed) => !cmsPosts.some((post) => post.slug === seed.slug))
      .map((seed) => ({ ...seed, category: "guide" })),
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Aroha Calls Blog",
          url: `${siteConfig.url}/blog`,
        }}
      />
      <PageHero
        title={<>AI receptionist guides for service businesses.</>}
        description="Practical articles that help owners understand AI call answering, booking automation, customer memory, and missed-call recovery."
      />
      <SectionBand>
        <div className="container-tight space-y-12">
          {sections.map((section) => {
            const posts = allPosts.filter((post) => post.category === section.key);
            return (
              <section key={section.key}>
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{section.eyebrow}</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight">{section.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{section.description}</p>
                  </div>
                  {section.key === "news" ? (
                    <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                      Add posts from /admin/blog
                    </span>
                  ) : null}
                </div>
                {posts.length ? (
                  <div className="grid gap-5 md:grid-cols-3">
                    {posts.map((post) => (
                      <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                        <GlassPanel className="h-full transition-colors hover:border-primary/50">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{section.eyebrow}</p>
                          <h3 className="mt-3 text-2xl font-semibold tracking-tight">{post.title}</h3>
                          <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                          <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                            Read article <ArrowRight className="h-4 w-4" />
                          </div>
                        </GlassPanel>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <GlassPanel>
                    <p className="text-sm text-muted-foreground">{section.empty}</p>
                  </GlassPanel>
                )}
              </section>
            );
          })}
        </div>
      </SectionBand>
    </>
  );
}
