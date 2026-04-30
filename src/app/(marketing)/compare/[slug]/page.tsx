import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { comparePages } from "@/lib/marketing-data";

type Slug = keyof typeof comparePages;

export function generateStaticParams() {
  return Object.keys(comparePages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = comparePages[slug as Slug];
  if (!page) return {};
  return {
    title: page.title,
    description: page.intro,
    alternates: { canonical: `/compare/${slug}` },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = comparePages[slug as Slug];
  if (!page) notFound();

  return (
    <>
      <PageHero
        title={<>{page.title}</>}
        description={page.intro}
        cta={{ href: "/demo", label: "Book a free demo" }}
        secondary={{ href: "/pricing", label: "View pricing" }}
      />
      <SectionBand>
        <div className="container-tight">
          <GlassPanel className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Aroha Calls</TableHead>
                  <TableHead>{page.competitor}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {page.rows.map(([category, aroha, competitor]) => (
                  <TableRow key={category}>
                    <TableCell className="font-medium">{category}</TableCell>
                    <TableCell>
                      <span className="inline-flex gap-2 text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {aroha}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{competitor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassPanel>
        </div>
      </SectionBand>
    </>
  );
}
