import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { isTag, tags } from './i18n/tags';

/**
 * Every post and every project is a folder `<slug>/` holding `ru.mdx`, `en.mdx` and `zh.mdx`.
 * An entry id is `<slug>/<lang>`; the language and slug come from the path (see src/lib/content.ts).
 * Translations (en, zh) carry `sourceHash`, the hash of the ru original; `pnpm translations` checks it.
 */
const translation = {
  sourceHash: z.string().optional(),
};

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '*/{ru,en,zh}.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    /** A line under the title, part of the title rather than of the text. */
    subtitle: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z
      .array(z.string().refine(isTag, { message: `unknown tag; add it to src/i18n/tags.ts (known: ${Object.keys(tags).join(', ') || 'none'})` }))
      .default([]),
    project: z.string().optional(),
    /** Link to the Telegram discussion thread of the post's announcement; added once it is published. */
    discussion: z.url().optional(),
    draft: z.boolean().default(false),
    ...translation,
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '*/{ru,en,zh}.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['idea', 'active', 'released', 'paused']),
    order: z.number().default(0),
    links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    ...translation,
  }),
});

export const collections = { posts, projects };
