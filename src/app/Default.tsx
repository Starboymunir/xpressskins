import type { Project } from "@/lib/types";
import { Preloader } from "@/components/home/Preloader";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Manifesto } from "@/components/home/Manifesto";
import { HorizontalGallery } from "@/components/home/HorizontalGallery";
import { Builder } from "@/components/home/Builder";
import { Process } from "@/components/home/Process";
import { Film } from "@/components/home/Film";
import { LiveBuilds } from "@/components/home/LiveBuilds";
import { Proof } from "@/components/home/Proof";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home({ projects = [] }: { projects?: Project[] }) {
  return (
    <>
      <Preloader />
      <Hero />
      <Marquee />
      <Manifesto />
      <HorizontalGallery />
      <Builder />
      <Process />
      <Film />
      <LiveBuilds projects={projects} />
      <Proof />
      <Faq />
      <FinalCta />
    </>
  );
}
