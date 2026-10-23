// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nixxlab.ru',
  i18n: {
    locales: ['ru', 'en', 'zh'],
    defaultLocale: 'ru',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'ru',
        locales: { ru: 'ru-RU', en: 'en-US', zh: 'zh-CN' },
      },
    }),
  ],
});
