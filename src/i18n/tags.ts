import type { Locale } from './ui';

/**
 * Post topics. The key is Latin, shared by all languages, and is also the URL segment `/tags/<key>/`.
 * Add a topic here with labels in all three languages before using it in a post;
 * the post schema accepts only keys listed here.
 */
export const tags: Record<string, Record<Locale, string>> = {
  'programming-languages': { ru: 'языки программирования', en: 'programming languages', zh: '编程语言' },
  tools: { ru: 'инструменты', en: 'tools', zh: '工具' },
  ai: { ru: 'ии', en: 'ai', zh: '人工智能' },
};

export type Tag = string;
export const isTag = (key: string) => Object.hasOwn(tags, key);
export const tagLabel = (tag: Tag, locale: Locale) => tags[tag]?.[locale] ?? tag;
