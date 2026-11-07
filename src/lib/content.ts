import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";
import { cache } from "react";
import { resume } from "@seed/resume";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";
import { type ImageUrlFor, mapSiteContent, type RawSiteContent } from "@/sanity/map";
import { SITE_CONTENT_QUERY } from "@/sanity/queries";
import type { SiteContent } from "./types";

/** Content is cached until the publish webhook or photo upload invalidates this tag. */
export const CONTENT_CACHE_TAG = "sanity";

async function fetchFromSanity(): Promise<SiteContent> {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: false });
  const builder = createImageUrlBuilder({ projectId, dataset });

  const imageUrl: ImageUrlFor = (source, width, height) => {
    if (!source) return undefined;
    const image = builder.image(source as Parameters<typeof builder.image>[0]).width(width);
    return (height ? image.height(height).fit("crop") : image).auto("format").url();
  };

  const raw = await client.fetch<RawSiteContent>(
    SITE_CONTENT_QUERY,
    {},
    { cache: "force-cache", next: { tags: [CONTENT_CACHE_TAG] } },
  );
  return mapSiteContent(raw, imageUrl);
}

export const getContent = cache(
  async (): Promise<SiteContent> => (isSanityConfigured ? fetchFromSanity() : resume),
);
