/**
 * Site configuration — the single source of truth for business details.
 * Every component reads from here; nothing below is repeated in content files.
 *
 * TODO (client): replace ADDRESS placeholders and confirm hours and social links.
 */
export type Locale = 'en' | 'es';

export const site = {
  name: 'Golden Heart Haven',
  legalName: 'Golden Heart Haven LLC',
  founder: 'Cynthia Emelife',
  founderTitle: { en: 'Founder & Registered Nurse', es: 'Fundadora y Enfermera Titulada' },

  phone: '832-457-5630',
  phoneHref: 'tel:+18324575630',
  email: 'goldenhearthavenllc@gmail.com', // TODO: switch to a mailbox on the client's domain (SES)

  address: {
    street: '[STREET ADDRESS — TODO]', // placeholder until the client provides it
    city: 'Houston',
    region: 'TX',
    postalCode: '[ZIP]',
    country: 'US',
  },

  hours: {
    en: 'Mon–Fri, 9:00 AM – 5:00 PM · 24/7 care in our homes',
    es: 'Lun–Vie, 9:00 AM – 5:00 PM · Atención 24/7 en nuestros hogares',
  },

  social: {
    facebook: 'https://www.facebook.com/',  // TODO: real profile URLs
    instagram: 'https://www.instagram.com/',
    linkedin: 'https://www.linkedin.com/',
  },

  /** Build-time flags injected by CodeBuild (see buildspec.yaml / .env.example). */
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT ?? '',
  noindex: (import.meta.env.PUBLIC_NOINDEX ?? 'true') !== 'false',
  serviceArea: { en: 'Houston, Texas', es: 'Houston, Texas' },
} as const;

/** Page keys → localized slugs. Home is the empty slug. Order = nav order. */
export const pages = {
  home:        { en: '',                  es: 'es' },
  about:       { en: 'about',             es: 'es/sobre-nosotros' },
  services:    { en: 'services',          es: 'es/servicios' },
  homes:       { en: 'our-homes',         es: 'es/nuestros-hogares' },
  families:    { en: 'for-families',      es: 'es/para-familias' },
  individuals: { en: 'for-individuals',   es: 'es/para-individuos' },
  partners:    { en: 'referral-partners', es: 'es/socios-de-referencia' },
  contact:     { en: 'contact',           es: 'es/contacto' },
  privacy:     { en: 'privacy-policy',    es: 'es/politica-de-privacidad' },
  terms:       { en: 'terms',             es: 'es/terminos' },
  accessibility: { en: 'accessibility',   es: 'es/accesibilidad' },
} as const;

export type PageKey = keyof typeof pages;
export const navKeys: PageKey[] = ['home', 'about', 'services', 'homes', 'families', 'individuals', 'partners', 'contact'];
export const legalKeys: PageKey[] = ['privacy', 'terms', 'accessibility'];

/** Absolute-path URL for a page in a locale, always with a trailing slash. */
export function pathFor(key: PageKey, locale: Locale): string {
  const slug = pages[key][locale];
  return slug ? `/${slug}/` : '/';
}

/** Find the page key for a given path (used for hreflang + active nav). */
export function keyForPath(pathname: string): { key: PageKey; locale: Locale } | undefined {
  const clean = pathname.replace(/^\/|\/$/g, '');
  for (const key of Object.keys(pages) as PageKey[]) {
    for (const locale of ['en', 'es'] as Locale[]) {
      if (pages[key][locale] === clean) return { key, locale };
    }
  }
  return undefined;
}
