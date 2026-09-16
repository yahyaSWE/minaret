import { connection } from 'next/server';
export type KnowledgeItem = {
  id: number; title: string; kind: 'article' | 'lecture' | 'document'; summary: string; author: string;
  cover: { url: string; alt: string } | null; category: { id: number; title: string } | null;
  content?: string; fileUrl?: string | null; fileMime?: string | null;
};
export const knowledgeLabels = { article: 'Artikel', lecture: 'Föreläsning', document: 'Dokument' };
export async function getKnowledge(filters: Record<string, string> = {}) {
  await connection();
  const url = new URL('/api/knowledge/web', process.env.CMS_URL?.trim() || 'https://ljudbok-cms.vercel.app');
  for (const [key, value] of Object.entries(filters)) if (value) url.searchParams.set(key, value);
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('Kunskapsbanken kunde inte hämtas.');
  return await response.json() as { docs: KnowledgeItem[]; page: number; totalPages: number; hasNextPage: boolean };
}
