import { cache } from 'react';
import { connection } from 'next/server';

export type Book = {
  id: number;
  title: string;
  author: string;
  description: string;
  language: string;
  formats: 'audio' | 'ebook' | 'both';
  cover: { url: string; alt: string } | null;
  categories: { name: string; slug: string }[];
};
type Catalog = { docs: Book[]; page: number; totalPages: number; hasNextPage: boolean };

export const getCatalog = cache(async (page = 1, id?: number): Promise<Catalog> => {
  // Bygget ska fungera även när CMS:et är avstängt. Data hämtas vid besök.
  await connection();
  const base = process.env.CMS_URL ?? 'https://ljudbok-cms.vercel.app';
  const url = new URL('/api/catalog/books', base);
  url.searchParams.set('page', String(page));
  if (id !== undefined) url.searchParams.set('id', String(id));
  const response = await fetch(url, { next: { revalidate: 60 }, signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Bokkatalogen svarade med HTTP ${response.status}`);
  const data = await response.json() as Catalog;
  if (!Array.isArray(data.docs)) throw new Error('Ogiltigt svar från bokkatalogen');
  return { ...data, docs: data.docs.map((book) => ({
    ...book,
    cover: book.cover ? { ...book.cover, url: new URL(book.cover.url, base).href } : null,
  })) };
});

export const formatLabel = { audio: 'Ljudbok', ebook: 'E-bok', both: 'Ljudbok och e-bok' };
