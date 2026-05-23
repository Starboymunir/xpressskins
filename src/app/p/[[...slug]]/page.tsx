import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { Render } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import {
  getActiveTheme,
  getPublishedPageBySlug,
} from "@/builder/server";
import { ThemeStyle } from "@/builder/theme";
import { builderConfig } from "@/builder/config";

export const revalidate = 30;

type Params = Promise<{ slug?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug = [] } = await params;
  const joined = slug.join("/");
  const page = await getPublishedPageBySlug(joined);
  if (!page) return {};
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description,
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.description,
      images: page.seo?.image ? [page.seo.image] : undefined,
    },
  };
}

export default async function BuilderPublicPage({ params }: { params: Params }) {
  const { slug = [] } = await params;
  const joined = slug.join("/");
  const page = await getPublishedPageBySlug(joined);
  if (!page) {
    // For an unknown slug, suggest editor for admins, else 404
    notFound();
  }
  const theme = await getActiveTheme();

  return (
    <>
      <ThemeStyle theme={theme} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Render config={builderConfig as any} data={page!.published_data as any} />
    </>
  );
  // Suppress unused
  void redirect;
}
