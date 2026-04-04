// src/components/SEO.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ROUTE_MAP = {
  '/':           'home',
  '/servicos':   'servicos',
  '/sobre':      'sobre',
  '/resultados': 'resultados',
  '/blog':       'blog',
  '/contato':    'contato',
};

const DEFAULTS = {
  meta_title:       'Instituto Milhomem | Transplante Capilar em Goiânia',
  meta_description: 'Clínica premium especializada em transplante capilar FUE em Goiânia.',
  keywords:         'transplante capilar, FUE, Goiânia, clínica capilar',
  og_image:         'https://horizons-cdn.hostinger.com/386178fc-68a2-4ae9-99a1-df6a1385b4b9/ee094f05e96779f379167f5302d013cd.png',
  canonical:        'https://institutomilhomem.com',
};

const SEO = ({ title, description, keywords, ogImage, url }) => {
  const location      = useLocation();
  const [seo, setSeo] = useState(null);

  useEffect(() => {
    const page_name = ROUTE_MAP[location.pathname] ?? 'home';

    fetch(`${API_URL}/seo-settings/${page_name}`)
      .then(r => r.json())
      .then(data => {
        if (data?.meta_title) setSeo(data);
      })
      .catch(() => {});
  }, [location.pathname]);

  const t   = title       || seo?.meta_title       || DEFAULTS.meta_title;
  const d   = description || seo?.meta_description || DEFAULTS.meta_description;
  const k   = keywords    || seo?.keywords         || DEFAULTS.keywords;
  const img = ogImage     || seo?.og_image         || DEFAULTS.og_image;
  const u   = url         || DEFAULTS.canonical + location.pathname;

  const structuredData = {
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

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description"  content={d} />
      <meta name="keywords"     content={k} />
      <meta name="robots"       content="index, follow" />
      <meta name="author"       content="Instituto Milhomem" />

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={u} />
      <meta property="og:title"       content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:image"       content={img} />
      <meta property="og:locale"      content="pt_BR" />
      <meta property="og:site_name"   content="Instituto Milhomem" />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image"       content={img} />

      <link rel="canonical" href={u} />

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
