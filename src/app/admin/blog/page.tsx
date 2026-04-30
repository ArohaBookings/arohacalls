import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { blogSeedPosts } from "@/lib/marketing-data";
import { queryOrEmpty } from "@/lib/safe-db";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminBlogForm } from "@/components/admin/blog-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlassPanel } from "@/components/marketing/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Blog",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const session = await requireAdmin();
  const posts = await queryOrEmpty(
    db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).limit(100),
    "admin-blog-posts",
  );

  return (
    <AdminShell
      session={session}
      title="Blog"
      description="Create, edit, and publish SEO blog posts with markdown content, slug, title, and meta description fields."
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Create or publish a post</h2>
          <p className="mt-2 text-sm text-muted-foreground">Use markdown for the content body. Published posts become available on the public blog once wired to the CMS list.</p>
          <div className="mt-6">
            <AdminBlogForm />
          </div>
        </GlassPanel>
        <div className="space-y-6">
          <GlassPanel>
            <h2 className="text-xl font-semibold tracking-tight">Posts</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length ? (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>{post.title}</TableCell>
                      <TableCell><Badge variant={post.status === "published" ? "success" : "outline"}>{post.status}</Badge></TableCell>
                      <TableCell>{post.updatedAt.toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={4} className="text-muted-foreground">No CMS posts yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </GlassPanel>
          <GlassPanel>
            <h2 className="text-xl font-semibold tracking-tight">SEO starter topics</h2>
            <div className="mt-4 space-y-3">
              {blogSeedPosts.map((post) => (
                <div key={post.slug} className="rounded-xl border border-border bg-card/40 p-4">
                  <p className="font-medium">{post.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </AdminShell>
  );
}
