import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';
import type { Tag } from '../i18n/tags';

export type Post = CollectionEntry<'posts'>;
export type Project = CollectionEntry<'projects'>;

/** "my-post/en" → ["my-post", "en"] */
export function parseId(id: string): [slug: string, locale: Locale] {
  const i = id.lastIndexOf('/');
  return [id.slice(0, i), id.slice(i + 1) as Locale];
}

export const slugOf = (e: { id: string }) => parseId(e.id)[0];
export const localeOf = (e: { id: string }) => parseId(e.id)[1];

/** Posts of a language, newest first; drafts appear only in `pnpm dev`. */
export async function getPosts(locale: Locale): Promise<Post[]> {
  const all = await getCollection(
    'posts',
    (p) => localeOf(p) === locale && (import.meta.env.DEV || !p.data.draft),
  );
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  const all = await getCollection('projects', (p) => localeOf(p) === locale);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Topics that have at least one post in the language. */
export async function getUsedTags(locale: Locale): Promise<Tag[]> {
  const posts = await getPosts(locale);
  return [...new Set(posts.flatMap((p) => p.data.tags))].sort();
}
