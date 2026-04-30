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

export default async function BlogPage() {
  const published = await queryOrEmpty(
    db.select().from(blogPosts).where(eq(blogPosts.status, "published")),
    "published-blog-posts",
  );
  const cmsPosts = published.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? post.seoDescription ?? "Aroha Calls guide.",
  }));
  const allPosts = [
    ...cmsPosts,
    ...blogSeedPosts.filter((seed) => !cmsPosts.some((post) => post.slug === seed.slug)),
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
        <div className="container-tight grid gap-5 md:grid-cols-3">
          {allPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <GlassPanel className="h-full transition-colors hover:border-primary/50">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Guide</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">{post.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  Read article <ArrowRight className="h-4 w-4" />
                </div>
              </GlassPanel>
            </Link>
          ))}
        </div>
      </SectionBand>
    </>
  );
}
