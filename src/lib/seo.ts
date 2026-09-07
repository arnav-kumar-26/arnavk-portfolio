export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export function buildMeta({ title, description, canonical, ogImage, noindex }: SEOProps) {
  return {
    title,
    description: description.slice(0, 160),
    canonical,
    ogImage: ogImage ?? '/og-default.png',
    noindex: !!noindex,
  };
}
