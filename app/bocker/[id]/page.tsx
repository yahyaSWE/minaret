import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCatalog, formatLabel } from '@/lib/catalog';
import { Cover } from '../cover';

async function findBook(params: Promise<{ id: string }>) {
  const { id } = await params;
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) notFound();
  const { docs } = await getCatalog(1, Number(id));
  if (!docs[0]) notFound();
  return docs[0];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const book = await findBook(params);
  return { title: book.title, description: book.description.slice(0, 160), openGraph: { title: book.title, description: book.description.slice(0, 160), ...(book.cover ? { images: [book.cover.url] } : {}) } };
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const book = await findBook(params);
  return <main id="main" className="container page-section">
    <nav className="breadcrumb" aria-label="Brödsmulor"><Link href="/">Hem</Link><span>/</span><Link href="/bocker">Böcker</Link><span>/</span><span>{book.title}</span></nav>
    <article className="catalog-detail"><Cover book={book}/><div>
      <span className="eyebrow">MINARET FÖRLAG · {formatLabel[book.formats]}</span><h1>{book.title}</h1><p className="catalog-author">Av {book.author}</p>
      <div className="catalog-description">{book.description.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      {book.categories.length > 0 && <ul className="catalog-tags" aria-label="Kategorier">{book.categories.map((category) => <li key={category.slug}>{category.name}</li>)}</ul>}
      {book.canReadFree && <p><Link className="button primary" href={`/bocker/${book.id}/las`}>Läs gratis</Link></p>}
      <Link className="text-link" href="/bocker">← Tillbaka till böckerna</Link>
    </div></article>
  </main>;
}
