import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCatalog } from '@/lib/catalog';
import { EbookReader } from './reader';

export const metadata = { title: 'Läs e-bok', robots: { index: false, follow: true } };

export default async function ReadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) notFound();
  const { docs } = await getCatalog(1, Number(id));
  const book = docs[0];
  if (!book) notFound();
  return <main id="main" className="container reader-page">
    <Link className="text-link" href={`/bocker/${book.id}`}>← Tillbaka till boken</Link>
    <h1>{book.title}</h1><p className="catalog-author">Av {book.author}</p>
    {book.canReadFree ? <EbookReader bookId={book.id} title={book.title}/> :
      <div className="empty-panel"><h2>Boken är inte tillgänglig för gratisläsning.</h2><p>Du hittar tillgänglig information på bokens sida.</p></div>}
  </main>;
}
