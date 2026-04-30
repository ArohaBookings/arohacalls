import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { blogSeedPosts } from "@/lib/marketing-data";
import { siteConfig } from "@/lib/site-config";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { queryOrEmpty } from "@/lib/safe-db";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return blogSeedPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogSeedPosts.find((item) => item.slug === slug);
  if (!post) {
    const [cmsPost] = await queryOrEmpty(
      db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1),
      `blog-metadata-${slug}`,
    );
    if (!cmsPost) return {};
    return {
      title: cmsPost.seoTitle ?? cmsPost.title,
      description: cmsPost.seoDescription ?? cmsPost.excerpt ?? undefined,
      alternates: { canonical: `/blog/${cmsPost.slug}` },
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogSeedPosts.find((item) => item.slug === slug);
  if (!post) {
    const [cmsPost] = await queryOrEmpty(
      db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1),
      `blog-post-${slug}`,
    );
    if (!cmsPost || cmsPost.status !== "published") notFound();
    const paragraphs = cmsPost.content
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean);
    return (
      <>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: cmsPost.title,
            description: cmsPost.excerpt ?? cmsPost.seoDescription,
            author: { "@type": "Organization", name: "Aroha Calls" },
            publisher: { "@type": "Organization", name: "Aroha Calls" },
            url: `${siteConfig.url}/blog/${cmsPost.slug}`,
          }}
        />
        <PageHero title={<>{cmsPost.title}</>} description={cmsPost.excerpt ?? "Aroha Calls guide."} cta={{ href: "/demo", label: "Book a demo" }} />
        <SectionBand>
          <div className="container-tight max-w-3xl">
            <GlassPanel className="space-y-5 p-8">
              {paragraphs.map((paragraph) =>
                paragraph.startsWith("#") ? (
                  <h2 key={paragraph} className="text-2xl font-semibold tracking-tight">
                    {paragraph.replace(/^#+\s*/, "")}
                  </h2>
                ) : (
                  <p key={paragraph} className="text-sm leading-7 text-muted-foreground">
                    {paragraph}
                  </p>
                ),
              )}
            </GlassPanel>
          </div>
        </SectionBand>
      </>
    );
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          author: { "@type": "Organization", name: "Aroha Calls" },
          publisher: { "@type": "Organization", name: "Aroha Calls" },
          url: `${siteConfig.url}/blog/${post.slug}`,
        }}
      />
      <PageHero title={<>{post.title}</>} description={post.excerpt} cta={{ href: "/demo", label: "Book a demo" }} />
      <SectionBand>
        <div className="container-tight max-w-3xl">
          <GlassPanel className="prose prose-invert max-w-none p-8">
            {post.content.map((block) =>
              block.type === "heading" ? (
                <h2 key={block.text}>{block.text}</h2>
              ) : (
                <p key={block.text}>{block.text}</p>
              ),
            )}
          </GlassPanel>
        </div>
      </SectionBand>
    </>
  );
}
