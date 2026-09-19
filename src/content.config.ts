import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ── Shared fragments ─────────────────────────────────────────────────────── */
const locale = z.enum(['en', 'es']);
const image = z.object({ src: z.string(), alt: z.string() });
const cta = z.object({ label: z.string(), href: z.string() });

/* ── Section types — one per reusable block in the design ─────────────────── */
const hero = z.object({
  type: z.literal('hero'),
  eyebrow: z.string().optional(),
  title: z.string(),
  accent: z.string().optional(),      // script-font word appended to the title
  subtitle: z.string().optional(),
  body: z.string().optional(),
  primaryCta: cta.optional(),
  secondaryCta: cta.optional(),
  image,
  badge: z.string().optional(),       // small pill under the CTAs, e.g. "Nurse-Owned. Heart-Led."
  sticker: z.array(z.string()).optional(), // 2–3 short lines on the round gold sticker
  compact: z.boolean().optional(),    // inner-page hero (shorter)
});

const textImage = z.object({
  type: z.literal('textImage'),
  eyebrow: z.string().optional(),
  title: z.string(),
  accent: z.string().optional(),
  body: z.array(z.string()),          // paragraphs
  bullets: z.array(z.string()).optional(),
  cta: cta.optional(),
  image,
  reverse: z.boolean().optional(),    // image on the left
  quote: z.string().optional(),       // pull-quote card overlapping the image
  quoteBy: z.string().optional(),
  sticker: z.array(z.string()).optional(),
});

const valueStrip = z.object({
  type: z.literal('valueStrip'),
  title: z.string().optional(),
  items: z.array(z.object({ icon: z.string(), title: z.string(), text: z.string().optional() })),
  variant: z.enum(['icons', 'compact']).optional(),
});

const cardGrid = z.object({
  type: z.literal('cardGrid'),
  eyebrow: z.string().optional(),
  title: z.string(),
  accent: z.string().optional(),
  intro: z.string().optional(),
  columns: z.number().int().min(2).max(4).optional(),
  cards: z.array(z.object({
    icon: z.string().optional(),
    image: image.optional(),
    title: z.string(),
    text: z.string(),
    link: cta.optional(),
  })),
});

const ctaBand = z.object({
  type: z.literal('ctaBand'),
  title: z.string(),
  accent: z.string().optional(),
  text: z.string().optional(),
  primaryCta: cta,
  secondaryCta: cta.optional(),
});

const quoteBand = z.object({
  type: z.literal('quoteBand'),
  quote: z.string(),
  attribution: z.string().optional(),
  script: z.boolean().optional(),     // render in the script face instead of serif
});

const imageCollage = z.object({
  type: z.literal('imageCollage'),
  title: z.string().optional(),
  accent: z.string().optional(),
  images: z.array(image).min(2).max(6),
  caption: z.string().optional(),
});

const contactForm = z.object({
  type: z.literal('contactForm'),
  title: z.string(),
  intro: z.string().optional(),
});

const section = z.discriminatedUnion('type', [
  hero, textImage, valueStrip, cardGrid, ctaBand, quoteBand, imageCollage, contactForm,
]);

/* ── Collections ──────────────────────────────────────────────────────────── */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pages' }),
  schema: z.object({
    key: z.enum(['home', 'about', 'services', 'homes', 'families', 'individuals', 'partners', 'contact']),
    locale,
    seo: z.object({ title: z.string(), description: z.string().max(170) }),
    sections: z.array(section).min(1),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    key: z.enum(['privacy', 'terms', 'accessibility']),
    locale,
    title: z.string(),
    description: z.string().max(170),
    updated: z.string(),
  }),
});

export const collections = { pages, legal };
export type Section = z.infer<typeof section>;
