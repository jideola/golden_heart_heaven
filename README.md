# Golden Heart Haven — website

Static marketing site for **Golden Heart Haven LLC**, a nurse-owned Texas HHS Home and
Community-based Services (HCS) provider in Houston. Built with [Astro](https://astro.build),
English + Spanish, deployed to S3 + CloudFront by CodePipeline (see `buildspec.yaml`).

Preview: https://cynthia.jideola.com (noindex until the client's own domain goes live).

## Run locally

```bash
nvm use            # Node 24 (.nvmrc)
npm ci
npm run dev        # http://localhost:4321
npm run build      # astro check + static build → dist/
npm run preview
```

## Where things live

| Path | What |
|---|---|
| `src/config/site.ts` | **Business details** — name, phone, email, address, hours, social, page slugs. Edit here only. |
| `src/i18n/ui.ts` | UI strings (nav, buttons, footer, form) in `en` and `es`. |
| `src/content/pages/<locale>/<page>.yaml` | Page copy as a list of **sections**. One file per page per language. |
| `src/content/legal/<locale>/*.md` | Privacy, Terms, Accessibility (Markdown). |
| `src/content.config.ts` | Schema for the above — the build fails on a typo or a missing field. |
| `src/styles/tokens.css` | **Design tokens** — colors, type, spacing. Retheme here. |
| `src/components/` | One component per section type + Header/Footer/ContactForm. |
| `src/layouts/BaseLayout.astro` | Head/SEO, hreflang, JSON-LD, skip link, header, footer. |
| `src/pages/[...path].astro` | Single route that renders every page in every locale. |
| `public/images/placeholders/` | Labelled SVG placeholders — replace with licensed photos. |

## Section types

`hero` · `textImage` · `valueStrip` · `cardGrid` · `ctaBand` · `quoteBand` · `imageCollage` · `contactForm`

Add a section to a page by appending to its `sections:` list; add a new section *type* by
creating a component, a schema entry in `content.config.ts`, and a line in `SectionRenderer.astro`.

## Adding a page

1. Add the key + slugs to `pages` in `src/config/site.ts` (and to `navKeys` if it belongs in the nav).
2. Add the key to the `key` enum in `src/content.config.ts`.
3. Create `src/content/pages/en/<key>.yaml` and `src/content/pages/es/<key>.yaml`.
4. Add `nav.<key>` labels to `src/i18n/ui.ts`.

## Environment (build-time)

| Var | Purpose |
|---|---|
| `PUBLIC_SITE_URL` | Canonical URL. Set by CodeBuild. |
| `PUBLIC_NOINDEX` | `"true"` on the preview domain; set `"false"` when live on the client's domain. |
| `PUBLIC_FORM_ENDPOINT` | Contact form Lambda function URL. Empty = `mailto:` fallback. |

## Contact form

Plain HTML form, progressively enhanced. With JavaScript it POSTs JSON to
`PUBLIC_FORM_ENDPOINT`; without it, a normal form POST. Includes a honeypot field (`website`)
and a timestamp; the Lambda handles rate limiting and sends through SES.

## Deployment

`buildspec.yaml` runs `npm ci && npm run build`, syncs `dist/` to the S3 origin (hashed
`_astro/` assets as immutable, everything else short-cached) and invalidates CloudFront.
Infrastructure lives in the `terraform` repo under `accounts/jideola-prod/cynthia_static_frontend`.

## Content still owed by the client

Street address, licensed photos (with consent for any individual pictured), founder bio and
headshot, Spanish copy review by a native speaker, and legal review of the Privacy, Terms and
Accessibility pages. See `TODO.md` in the terraform repo for the full list.
