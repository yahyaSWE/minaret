import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getCatalog, formatLabel } from '@/lib/catalog';
import { Cover } from './cover';

export const metadata = { title: 'Böcker', description: 'Upptäck Minarets böcker och läs mer om vår utgivning.' };

export default async function Books({ searchParams }: { searchParams: Promise<{ sida?: string }> }) {
  const { sida } = await searchParams;
  const value = Number(sida ?? 1);
  const page = Number.isSafeInteger(value) && value > 0 ? value : 1;
  const catalog = await getCatalog(page);
  return <main id="main">
    <section className="page-hero books-hero hero-bocker">
      <div className="books-hero-art" aria-hidden="true"><span className="book-leaf leaf-back"/><span className="book-leaf leaf-middle"/><span className="book-leaf leaf-front"/><span className="book-spark">✳</span></div>
      <div className="container"><div className="breadcrumb"><Link href="/">Hem</Link><span>/</span><span>Böcker</span></div>
        <span className="eyebrow">MINARET FÖRLAG</span><h1>Plats för fördjupning.</h1>
        <p className="intro">Böcker ger oss tid att stanna upp, förstå sammanhang och upptäcka nya perspektiv. Utforska vår utgivning.</p>
      </div>
    </section>
    <section className="container page-section" aria-label="Bokkatalog">
      {catalog.docs.length ? <div className="catalog-grid">{catalog.docs.map((book) =>
        <Link className="catalog-card" href={`/bocker/${book.id}`} key={book.id}>
          <Cover book={book}/><div className="catalog-card-copy"><span className="eyebrow">{formatLabel[book.formats]}</span>
          <h2>{book.title}</h2><p>{book.author}</p><span className="text-link">Läs om boken <ArrowUpRight size={18}/></span></div>
        </Link>)}</div> : <div className="empty-panel"><h2>{page > 1 ? 'Inga fler böcker.' : 'De första böckerna tar form.'}</h2><p>{page > 1 ? 'Gå tillbaka till föregående sida för att fortsätta utforska utgivningen.' : 'Här presenterar vi vår utgivning när böckerna är redo.'}</p></div>}
      <nav className="catalog-pagination" aria-label="Bläddra i bokkatalogen">
        {page > 1 && <Link className="text-link" href={`/bocker?sida=${page - 1}`}>← Föregående sida</Link>}
        {catalog.hasNextPage && <Link className="text-link" href={`/bocker?sida=${page + 1}`}>Nästa sida →</Link>}
      </nav>
    </section>
  </main>;
}
