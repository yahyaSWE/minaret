import Link from 'next/link';
import { getKnowledge, knowledgeLabels } from '@/lib/knowledge';
export const metadata = { title: 'Kunskapsbank', description: 'Artiklar, föreläsningar och dokument från Minaret.' };

export default async function KnowledgePage({ searchParams }: { searchParams: Promise<{ typ?: string; kategori?: string; sida?: string }> }) {
  const params = await searchParams;
  const kind = ['article', 'lecture', 'document'].includes(params.typ ?? '') ? params.typ! : '';
  const category = /^\d+$/.test(params.kategori ?? '') && Number(params.kategori) > 0 ? params.kategori! : '';
  const page = Number.isSafeInteger(Number(params.sida)) && Number(params.sida) > 0 ? Number(params.sida) : 1;
  const result = await getKnowledge({ kind, category, page: String(page) });
  const link = (nextPage: number) => `/kunskapsbank?${new URLSearchParams({ typ: kind, kategori: category, sida: String(nextPage) })}`;
  return <main id="main">
    <section className="page-hero books-hero hero-kunskapsbank"><div className="books-hero-art" aria-hidden="true"><span className="book-leaf leaf-back"/><span className="book-leaf leaf-middle"/><span className="book-leaf leaf-front"/><span className="book-spark">✳</span></div>
      <div className="container"><div className="breadcrumb"><Link href="/">Hem</Link><span>/</span><span>Kunskapsbank</span></div><span className="eyebrow">KUNSKAP SOM ÄR TILL FÖR ATT DELAS</span><h1>En öppen dörr till kunskap.</h1><p className="intro">Artiklar, föreläsningar och dokument om islam och muslimers vardag i Sverige. Tillgänglig kunskap för nyfikna människor.</p></div>
    </section>
    <section className="container page-section">
      <nav className="knowledge-filters" aria-label="Typ av material"><Link aria-current={!kind ? 'page' : undefined} href="/kunskapsbank">Allt material</Link>{Object.entries(knowledgeLabels).map(([value, label]) => <Link key={value} href={`/kunskapsbank?typ=${value}`} aria-current={kind === value ? 'page' : undefined}>{label}</Link>)}{category && <Link href={`/kunskapsbank?typ=${kind}`}>Ta bort ämnesfilter ×</Link>}</nav>
      {result.docs.length ? <div className="content-grid knowledge-grid">{result.docs.map((item) => <article className="content-card knowledge-card" key={item.id}>
        {item.cover && <img src={item.cover.url} alt={item.cover.alt} loading="lazy"/>}
        <span className="eyebrow">{knowledgeLabels[item.kind]}</span><h2><Link href={`/kunskapsbank/${item.id}`}>{item.title}</Link></h2><p>{item.summary}</p>
        {item.category && <Link className="knowledge-category" href={`/kunskapsbank?kategori=${item.category.id}`}>{item.category.title}</Link>}
        <Link className="text-link" href={`/kunskapsbank/${item.id}`}>{item.kind === 'article' ? 'Läs artikeln' : item.kind === 'lecture' ? 'Öppna föreläsningen' : 'Öppna dokumentet'} →</Link>
      </article>)}</div> : <div className="empty-panel"><h2>{kind || category ? 'Inget material i detta urval ännu.' : 'Här växer kunskapsbanken fram.'}</h2><p>Nytt material publiceras löpande. Välkommen tillbaka.</p></div>}
      <nav className="catalog-pagination" aria-label="Bläddra i kunskapsbanken">{page > 1 && <Link href={link(page - 1)}>← Föregående</Link>}{result.hasNextPage && <Link href={link(page + 1)}>Nästa →</Link>}</nav>
    </section>
  </main>;
}
