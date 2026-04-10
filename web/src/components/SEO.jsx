// src/components/SEO.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import api from '@/lib/apiServerClient';
import { LOGO_URL } from '@/config/site';

const ROUTE_MAP = {
  '/':           'home',
  '/servicos':   'servicos',
  '/sobre':      'sobre',
  '/resultados': 'resultados',
  '/blog':       'blog',
  '/contato':    'contato',
  '/faq':        'faq',
  '/politica-de-privacidade': 'politica-de-privacidade',
  '/termos-de-uso': 'termos-de-uso',
};

const DEFAULTS = {
  meta_title:       'Instituto Milhomem | Transplante Capilar em Goiânia',
  meta_description: 'Clínica premium especializada em transplante capilar FUE em Goiânia.',
  keywords:         'transplante capilar, FUE, Goiânia, clínica capilar',
  og_image:         'https://horizons-cdn.hostinger.com/386178fc-68a2-4ae9-99a1-df6a1385b4b9/1e20c7dbf245fee0e2ca926ad4054327.png',
  canonical:        'https://institutomilhomem.com',
  robots:           'index, follow',
  twitter_card:     'summary_large_image',
};

const SEO = ({ title, description, keywords, ogImage, url, type = 'website', publishedTime, modifiedTime, author, section, articleTags = [], serviceData = null }) => {
  const location      = useLocation();
  const [seo, setSeo] = useState(null);
  const { settings }  = useSiteSettings();
  const robotsContent = settings?.robots_noindex === 'true' ? 'noindex, nofollow' : 'index, follow';

  useEffect(() => {
    const page_name = ROUTE_MAP[location.pathname] ?? 'home';

    api.fetch(`/seo-settings/${page_name}`)
      .then(r => r.json())
      .then(data => {
        if (data?.meta_title) setSeo(data);
      })
      .catch(() => {});
  }, [location.pathname]);

  const t   = title       || seo?.meta_title       || DEFAULTS.meta_title;
  const d   = description || seo?.meta_description || DEFAULTS.meta_description;
  const kBase = keywords  || seo?.keywords         || DEFAULTS.keywords;
  const k   = articleTags.length > 0 ? `${articleTags.join(', ')}, ${kBase}` : kBase;
  const img = ogImage     || seo?.og_image         || DEFAULTS.og_image;
  const u   = seo?.canonical_url || url || DEFAULTS.canonical + location.pathname;
  const pageRobots = seo?.robots || robotsContent || DEFAULTS.robots;
  const twitterTitle = seo?.twitter_title || t;
  const twitterDescription = seo?.twitter_description || d;
  const twitterImage = seo?.twitter_image || img;
  const twitterCard = seo?.twitter_card === 'summary' ? 'summary' : DEFAULTS.twitter_card;

  const isArticle = type === 'article';

  const clinicSchema = {
    '@context': 'https://schema.org',
    '@type':    'MedicalClinic',
    name:       'Instituto Milhomem',
    image:      img,
    '@id':      'https://institutomilhomem.com',
    url:        'https://institutomilhomem.com',
    telephone:  '+5562981070937',
    priceRange: '$$',
    sameAs:     ['https://www.instagram.com/institutomilhomem'],
    address: {
      '@type':         'PostalAddress',
      streetAddress:   'Setor Bueno',
      addressLocality: 'Goiânia',
      addressRegion:   'GO',
      postalCode:      '74230-010',
      addressCountry:  'BR',
    },
    geo: {
      '@type':    'GeoCoordinates',
      latitude:   '-16.6982156',
      longitude:  '-49.2703605',
    },
    openingHoursSpecification: {
      '@type':   'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens:     '08:00',
      closes:    '18:00',
    },
    medicalSpecialty: 'Hair Transplant',
    founder: {
      '@type': 'Person',
      name:    'Dr. Pablo Milhomem',
    },
  };

  const articleSchema = isArticle ? {
    '@context':         'https://schema.org',
    '@type':            'BlogPosting',
    headline:           t,
    description:        d,
    image:              img,
    url:                u,
    datePublished:      publishedTime || undefined,
    dateModified:       modifiedTime  || publishedTime || undefined,
    keywords:           articleTags.length > 0 ? articleTags.join(', ') : kBase,
    articleSection:     section || undefined,
    author: {
      '@type': 'Person',
      name:    author || 'Dr. Pablo Milhomem',
      url:     'https://institutomilhomem.com/sobre',
    },
    publisher: {
      '@type': 'Organization',
      name:    'Instituto Milhomem',
      logo: {
        '@type': 'ImageObject',
        url:     LOGO_URL,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   u,
    },
  } : null;

  const isService = type === 'service';
  const serviceSchema = isService && serviceData ? {
    '@context': 'https://schema.org',
    '@type':    'MedicalProcedure',
    name:       serviceData.nome || t,
    description: serviceData.descricao || d,
    image:      serviceData.imagem || img,
    url:        u,
    procedureType: 'https://schema.org/NoninvasiveProcedure',
    bodyLocation: 'Couro Cabeludo',
    followup:   'Acompanhamento pós-operatório completo pelo Instituto Milhomem',
    preparation: 'Avaliação prévia personalizada com equipe especializada',
    ...(serviceData.beneficios?.length > 0 ? {
      howPerformed: serviceData.beneficios.join('; '),
    } : {}),
    provider: {
      '@type': 'MedicalClinic',
      '@id':   'https://institutomilhomem.com',
      name:    'Instituto Milhomem',
      url:     'https://institutomilhomem.com',
      telephone: '+5562981070937',
      address: {
        '@type':         'PostalAddress',
        streetAddress:   'Setor Bueno',
        addressLocality: 'Goiânia',
        addressRegion:   'GO',
        addressCountry:  'BR',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   u,
    },
  } : null;

  const structuredData = isArticle ? articleSchema : isService && serviceSchema ? serviceSchema : clinicSchema;

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description"  content={d} />
      <meta name="keywords"     content={k} />
      <meta name="robots"       content={pageRobots} />
      <meta name="author"       content={author || 'Instituto Milhomem'} />

      {/* Open Graph */}
      <meta property="og:type"        content={isArticle ? 'article' : 'website'} />
      <meta property="og:url"         content={u} />
      <meta property="og:title"       content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:image"       content={img} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale"      content="pt_BR" />
      <meta property="og:site_name"   content="Instituto Milhomem" />

      {/* Article-specific Open Graph */}
      {isArticle && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {isArticle && modifiedTime  && <meta property="article:modified_time"  content={modifiedTime} />}
      {isArticle && author        && <meta property="article:author"         content={author} />}
      {isArticle && section       && <meta property="article:section"        content={section} />}
      {isArticle && articleTags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card"        content={twitterCard} />
      <meta name="twitter:title"       content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image"       content={twitterImage} />
      {isArticle && author && <meta name="twitter:label1"   content="Escrito por" />}
      {isArticle && author && <meta name="twitter:data1"    content={author} />}
      {isArticle && section && <meta name="twitter:label2"  content="Categoria" />}
      {isArticle && section && <meta name="twitter:data2"   content={section} />}

      <link rel="canonical" href={u} />

      {/* Hreflang — same URL for all languages (no URL prefixes) */}
      <link rel="alternate" hrefLang="pt-BR"    href={u} />
      <link rel="alternate" hrefLang="en"       href={u} />
      <link rel="alternate" hrefLang="es"       href={u} />
      <link rel="alternate" hrefLang="x-default" href={u} />

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
