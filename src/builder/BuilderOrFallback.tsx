/**
 * Server helper: render a published builder page by slug if it exists,
 * otherwise render the provided fallback (typically the hard-coded design).
 *
 * This lets every existing route become editable: an admin can create a
 * builder page with the matching slug, hit Publish, and the route will
 * start serving the builder version on the next revalidation.
 */
import "server-only";
import { getActiveTheme, getPublishedPageBySlug } from "./server";
import { ThemeStyle } from "./theme";
import PuckClientRender from "./PuckClientRender";

export async function BuilderOrFallback({
  slug,
  fallback,
}: {
  slug: string;
  fallback: React.ReactNode;
}) {
  const page = await getPublishedPageBySlug(slug);
  if (!page) return <>{fallback}</>;
  const theme = await getActiveTheme();
  return (
    <>
      <ThemeStyle theme={theme} />
      <PuckClientRender data={page.published_data} />
    </>
  );
}

/**
 * Helper for generateMetadata — returns a Metadata object if a published
 * builder page exists for the slug, else null (caller should provide its
 * own metadata as fallback).
 */
export async function builderMetadata(slug: string) {
  const page = await getPublishedPageBySlug(slug);
  if (!page) return null;
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
