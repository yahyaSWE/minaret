import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getKnowledge, knowledgeLabels } from '@/lib/knowledge';

export default async function KnowledgeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) notFound();
  const item = (await getKnowledge({ id })).docs[0];
  if (!item) notFound();
  const file = item.fileUrl?.startsWith('https://') ? item.fileUrl : null;
  return <main id="main" className="container page-section knowledge-detail">
    <Link className="text-link" href="/kunskapsbank">← Till kunskapsbanken</Link>
    <article><span className="eyebrow">{knowledgeLabels[item.kind]}{item.category ? ` · ${item.category.title}` : ''}</span><h1>{item.title}</h1>
      {item.author && <p>Av {item.author}</p>}<p className="knowledge-intro">{item.summary}</p>
      {item.cover && <img className="knowledge-cover" src={item.cover.url} alt={item.cover.alt}/>}
      <div className="knowledge-text">{item.content?.split(/\n\s*\n/).filter(Boolean).map((text, index) => <p key={index}>{text}</p>)}</div>
      {file && item.kind === 'lecture' && (item.fileMime?.startsWith('audio/') ? <audio controls preload="metadata" src={file}>Din webbläsare stöder inte ljuduppspelning.</audio> : <video controls playsInline preload="metadata" src={file}>Din webbläsare stöder inte videouppspelning.</video>)}
      {file && item.kind !== 'article' && <p><a className="button primary" href={file} target="_blank" rel="noopener noreferrer">{item.kind === 'document' ? 'Öppna PDF' : 'Öppna ljud- eller videofilen'} ↗</a></p>}
    </article>
  </main>;
}
