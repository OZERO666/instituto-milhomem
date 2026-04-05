function safeWindow() {
  if (typeof window === 'undefined') return null;
  return window;
}

function normalizeSource(referrer, utmSource) {
  if (utmSource) return utmSource;
  if (!referrer) return 'direct';

  try {
    const ref = new URL(referrer);
    const host = ref.hostname.toLowerCase();
    if (host.includes('google.')) return 'google';
    if (host.includes('instagram.')) return 'instagram';
    if (host.includes('facebook.') || host.includes('fb.')) return 'facebook';
    if (host.includes('youtube.')) return 'youtube';
    if (host.includes('tiktok.')) return 'tiktok';
    return host;
  } catch {
    return 'referral';
  }
}

export function getLeadTrackingPayload(ctaOrigem = 'contato_form', campaignSlug = null, ctaVariant = null) {
  const win = safeWindow();
  if (!win) {
    return {
      origem: 'direct',
      cta_origem: ctaOrigem,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
      landing_page: null,
      referrer_url: null,
      campaign_slug: campaignSlug,
      cta_variant: ctaVariant,
    };
  }

  const params = new URLSearchParams(win.location.search);
  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_campaign = params.get('utm_campaign');
  const utm_content = params.get('utm_content');
  const utm_term = params.get('utm_term');
  const campaign_slug = campaignSlug || params.get('campaign_slug');
  const cta_variant_param = ctaVariant || params.get('cta_variant');

  const currentLanding = `${win.location.pathname}${win.location.search || ''}`;
  const storedLanding = win.sessionStorage.getItem('im_first_landing_page');
  if (!storedLanding) {
    win.sessionStorage.setItem('im_first_landing_page', currentLanding);
  }

  const referrerUrl = win.document?.referrer || null;

  return {
    origem: normalizeSource(referrerUrl, utm_source),
    cta_origem: ctaOrigem,
    utm_source: utm_source || null,
    utm_medium: utm_medium || null,
    utm_campaign: utm_campaign || null,
    utm_content: utm_content || null,
    utm_term: utm_term || null,
    landing_page: storedLanding || currentLanding,
    referrer_url: referrerUrl,
    campaign_slug: campaign_slug || null,
    cta_variant: cta_variant_param || null,
  };
}