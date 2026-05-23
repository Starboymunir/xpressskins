/**
 * The Puck config: every component the editor knows about, grouped into
 * categories shown in the left-hand palette.
 */
"use client";

import type { Config } from "@puckeditor/core";
import {
  Box,
  Button,
  Columns,
  Container,
  Divider,
  FooterBlock,
  Heading,
  HtmlEmbed,
  Img,
  NavbarBlock,
  RichText,
  Section,
  Spacer,
  Text,
  Video,
} from "./components";
import {
  PageHero,
  HeroVideo,
  Marquee,
  ImageBanner,
  ImageScroller,
  FeatureSplit,
  PaymentMilestones,
  VideoShowcase,
  CTAOverlay,
  StepTimeline,
  PaymentTiers,
  GuaranteeGrid,
  CTABanner,
  ContactInfoGrid,
  SocialLinks,
  ContactForm,
  ContactSection,
  PortfolioGallery,
  VideoGallery,
  PhysicsBalls,
} from "./contentBlocks";

export type BuilderProps = {
  Section: Parameters<(typeof Section)["render"]>[0];
  Container: Parameters<(typeof Container)["render"]>[0];
  Box: Parameters<(typeof Box)["render"]>[0];
  Columns: Parameters<(typeof Columns)["render"]>[0];
  Spacer: Parameters<(typeof Spacer)["render"]>[0];
  Divider: Parameters<(typeof Divider)["render"]>[0];
  Heading: Parameters<(typeof Heading)["render"]>[0];
  Text: Parameters<(typeof Text)["render"]>[0];
  RichText: Parameters<(typeof RichText)["render"]>[0];
  Image: Parameters<(typeof Img)["render"]>[0];
  Button: Parameters<(typeof Button)["render"]>[0];
  Video: Parameters<(typeof Video)["render"]>[0];
  HtmlEmbed: Parameters<(typeof HtmlEmbed)["render"]>[0];
  Navbar: Record<string, never>;
  Footer: Record<string, never>;
};

export const builderConfig: Config = {
  categories: {
    heroes: {
      title: "Heroes",
      components: ["PageHero", "HeroVideo", "ImageBanner", "CTAOverlay"],
    },
    sections: {
      title: "Sections",
      components: [
        "Marquee", "ImageScroller", "FeatureSplit", "PaymentMilestones",
        "PaymentTiers", "GuaranteeGrid", "StepTimeline", "VideoShowcase",
        "VideoGallery", "PortfolioGallery", "CTABanner", "PhysicsBalls",
      ],
    },
    contact: {
      title: "Contact",
      components: ["ContactSection", "ContactInfoGrid", "SocialLinks", "ContactForm"],
    },
    layout: {
      title: "Layout",
      components: ["Section", "Container", "Box", "Columns", "Spacer", "Divider"],
    },
    content: {
      title: "Content",
      components: ["Heading", "Text", "RichText", "Image", "Button", "Video", "HtmlEmbed"],
    },
    site: {
      title: "Site",
      components: ["Navbar", "Footer"],
    },
  },
  components: {
    // Layout primitives
    Section, Container, Box, Columns, Spacer, Divider,
    // Content primitives
    Heading, Text, RichText, Image: Img, Button, Video, HtmlEmbed,
    // Site
    Navbar: NavbarBlock, Footer: FooterBlock,
    // Specialised content blocks
    PageHero, HeroVideo, Marquee, ImageBanner, ImageScroller,
    FeatureSplit, PaymentMilestones, VideoShowcase, CTAOverlay,
    StepTimeline, PaymentTiers, GuaranteeGrid, CTABanner,
    ContactInfoGrid, SocialLinks, ContactForm, ContactSection,
    PortfolioGallery, VideoGallery, PhysicsBalls,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
};

export const emptyData = {
  content: [],
  root: { props: {} },
};
