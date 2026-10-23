import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { htmlLang, localePath, t, type Locale } from '../i18n/ui';
import { site } from '../site';
import { getPosts, slugOf } from './content';

export async function feed(locale: Locale, ctx: APIContext) {
  const posts = await getPosts(locale);
  return rss({
    title: site.name,
    description: t(locale, 'site.description'),
    site: new URL(localePath(locale, '/'), ctx.site!).href,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: localePath(locale, `/blog/${slugOf(p)}/`),
    })),
    customData: `<language>${htmlLang[locale]}</language>`,
  });
}
