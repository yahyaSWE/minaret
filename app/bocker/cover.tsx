import Image from 'next/image';
import type { Book } from '@/lib/catalog';

export function Cover({ book }: { book: Book }) {
  return <div className="catalog-cover">
    {book.cover ? <Image src={book.cover.url} alt={book.cover.alt || book.title} width={480} height={640} /> :
      <div className="catalog-placeholder"><span>MINARET FÖRLAG</span><strong>{book.title}</strong><span>{book.author}</span></div>}
  </div>;
}
