import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { hasUsableDatabaseUrl } from "@/lib/safe-db";

export const dynamic = "force-dynamic";

const schema = z.object({
  title: z.string().min(3).max(180),
  slug: z.string().max(180).optional(),
  excerpt: z.string().max(400).optional(),
  content: z.string().min(1),
  coverImage: z.string().max(500).optional(),
  seoTitle: z.string().max(180).optional(),
  seoDescription: z.string().max(240).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  await requireAdmin();
  if (!hasUsableDatabaseUrl()) {
    return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const slug = slugify(parsed.data.slug || parsed.data.title);
  const now = new Date();
  const values = {
    title: parsed.data.title,
    slug,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    coverImage: parsed.data.coverImage,
    seoTitle: parsed.data.seoTitle,
    seoDescription: parsed.data.seoDescription,
    status: parsed.data.status,
    publishedAt: parsed.data.status === "published" ? now : null,
    updatedAt: now,
  };

  const [post] = await db
    .insert(blogPosts)
    .values(values)
    .onConflictDoUpdate({
      target: blogPosts.slug,
      set: values,
    })
    .returning();

  return NextResponse.json({ ok: true, post });
}
