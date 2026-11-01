import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE } from '@/lib/site';
import { safeJson } from './jsonld';

interface SeoProps {
  title?: string; // omit on Home to use the default site title
  description?: string;
  path?: string; // defaults to the current pathname
  image?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  jsonLd?: object | object[];
}

export function Seo({
  title,
  description = SITE.description,
  path,
  image = SITE.ogImage,
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoProps) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} | ${SITE.name}` : SITE.title;
  const canonical = `${SITE.url}${path ?? pathname}`;
  const imageUrl = /^https?:\/\//i.test(image) ? image : `${SITE.url}${image}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd && <script type="application/ld+json">{safeJson(jsonLd)}</script>}
    </Helmet>
  );
}