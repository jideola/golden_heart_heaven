// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// PUBLIC_SITE_URL is injected by CodeBuild (Terraform). Falls back to the preview domain.
const site = process.env.PUBLIC_SITE_URL || 'https://cynthia.jideola.com';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en-US', es: 'es-US' } } })],
});
