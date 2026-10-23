/**
 * getStaticPaths for page pairs: `src/pages/x.astro` (ru, no prefix) and `src/pages/[lang]/x.astro` (en, zh).
 * Both wrappers call the same function with different language lists.
 */
import { locales, defaultLocale, type Locale } from '../i18n/ui';
import { getPosts, getProjects, getUsedTags, slugOf } from './content';

export const prefixed = locales.filter((l) => l !== defaultLocale);
const lang = (l: Locale) => (l === defaultLocale ? {} : { lang: l });

export const localePaths = (ls: readonly Locale[]) => ls.map((l) => ({ params: lang(l), props: { locale: l } }));

export async function postPaths(ls: readonly Locale[]) {
  const out = [];
  for (const l of ls) {
    for (const post of await getPosts(l)) {
      out.push({ params: { ...lang(l), slug: slugOf(post) }, props: { locale: l, post } });
    }
  }
  return out;
}

export async function projectPaths(ls: readonly Locale[]) {
  const out = [];
  for (const l of ls) {
    for (const project of await getProjects(l)) {
      out.push({ params: { ...lang(l), id: slugOf(project) }, props: { locale: l, project } });
    }
  }
  return out;
}

export async function tagPaths(ls: readonly Locale[]) {
  const out = [];
  for (const l of ls) {
    for (const tag of await getUsedTags(l)) {
      out.push({ params: { ...lang(l), tag }, props: { locale: l, tag } });
    }
  }
  return out;
}
