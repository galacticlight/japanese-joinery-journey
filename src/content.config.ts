import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    hours: z.number().min(0),
    phase: z.string().optional(),
    photos: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
  }),
});
export const collections = { journal };
