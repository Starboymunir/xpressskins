import type { Metadata } from "next";
import { BuilderOrFallback, builderMetadata } from "@/builder/BuilderOrFallback";
import Default from "./Default";

export const revalidate = 30;

const SLUG = "how-it-works";

export async function generateMetadata(): Promise<Metadata> {
  return (await builderMetadata(SLUG)) ?? {};
}

export default async function Page() {
  return <BuilderOrFallback slug={SLUG} fallback={<Default />} />;
}
