"use client";

import { useEffect, useRef, useState } from 'react';
import type Book from 'epubjs/types/book';
import type Rendition from 'epubjs/types/rendition';
import type { Location } from 'epubjs/types/rendition';
import type { NavItem } from 'epubjs/types/navigation';

function flatten(items: NavItem[], level = 0): { href: string; label: string }[] {
  return items.flatMap((item) => [{ href: item.href, label: `${'– '.repeat(level)}${item.label.trim()}` }, ...flatten(item.subitems ?? [], level + 1)]);
}

export function EbookReader({ bookId, title }: { bookId: number; title: string }) {
  const viewer = useRef<HTMLDivElement>(null);
  const rendition = useRef<Rendition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [toc, setToc] = useState<{ href: string; label: string }[]>([]);
  const [chapter, setChapter] = useState('');
  const [fontSize, setFontSize] = useState(110);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [turning, setTurning] = useState(false);

  useEffect(() => {
    let disposed = false;
    let book: Book | undefined;
    let observer: ResizeObserver | undefined;
    const abort = new AbortController();
    setLoading(true); setError(''); setToc([]); setChapter('');
    const timeout = window.setTimeout(() => {
      abort.abort();
      if (!disposed) { setError('Boken tog för lång tid att öppna. Försök igen.'); setLoading(false); }
    }, 60000);
    async function open() {
      try {
        const response = await fetch(`/api/ebooks/${bookId}`, { cache: 'no-store', signal: abort.signal });
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.message ?? 'Boken kunde inte hämtas.');
        }
        const bytes = await response.arrayBuffer();
        const { default: ePub } = await import('epubjs');
        if (disposed || abort.signal.aborted || !viewer.current) return;
        book = ePub();
        await book.open(bytes, 'binary');
        if (disposed || abort.signal.aborted) return;
        const navigation = await book.loaded.navigation;
        const items = flatten(navigation.toc);
        setToc(items);
        const key = `minaret:reading:${bookId}:${response.headers.get('X-Ebook-Version') ?? '1'}`;
        const view = book.renderTo(viewer.current, {
          width: '100%', height: '100%', spread: 'none', flow: 'paginated',
          allowScriptedContent: false,
        });
        rendition.current = view;
        view.themes.default({ body: { color: '#202b28', background: '#fffdf8', 'line-height': '1.7' } });
        view.themes.fontSize('110%');
        setFontSize(110);
        view.on('relocated', (location: Location) => {
          if (disposed) return;
          setAtStart(location.atStart); setAtEnd(location.atEnd);
          const match = items.find((item) => item.href.split('#')[0] === location.start.href.split('#')[0]);
          setChapter(match?.href ?? '');
          try { localStorage.setItem(key, location.start.cfi); } catch { /* Reading works without browser storage. */ }
        });
        let saved: string | null = null;
        try { saved = localStorage.getItem(key); } catch { /* Storage is optional. */ }
        await view.display(saved || undefined).catch(() => view.display());
        if (disposed || abort.signal.aborted) return;
        observer = new ResizeObserver(() => {
          if (viewer.current) view.resize(viewer.current.clientWidth, viewer.current.clientHeight);
        });
        observer.observe(viewer.current);
        setLoading(false);
      } catch (caught) {
        if (!disposed) {
          setError(caught instanceof Error && !abort.signal.aborted ? caught.message : 'Boken kunde inte öppnas. Försök igen.');
          setLoading(false);
        }
      } finally { window.clearTimeout(timeout); }
    }
    void open();
    return () => {
      disposed = true; abort.abort(); window.clearTimeout(timeout);
      observer?.disconnect(); rendition.current = null;
      book?.destroy();
    };
  }, [bookId, attempt]);

  async function navigate(target: 'previous' | 'next' | { href: string }) {
    const view = rendition.current;
    if (!view || turning) return;
    setTurning(true);
    try {
      if (target === 'previous') await view.prev();
      else if (target === 'next') await view.next();
      else await view.display(target.href);
    } catch { setError('Sidan kunde inte öppnas. Försök ladda om boken.'); }
    finally { setTurning(false); }
  }

  return <section className="ebook-reader" aria-label={`Läs ${title}`}>
    <div className="reader-toolbar">
      <label>Innehåll<select aria-label="Välj kapitel" value={chapter} disabled={loading || !!error} onChange={(e) => { if (e.target.value) void navigate({ href: e.target.value }); }}>
        <option value="">Välj kapitel</option>{toc.map((item, index) => <option key={`${item.href}-${index}`} value={item.href}>{item.label}</option>)}
      </select></label>
      <label>Textstorlek<select value={fontSize} disabled={loading || !!error} onChange={(e) => { const value = Number(e.target.value); setFontSize(value); rendition.current?.themes.fontSize(`${value}%`); }}>
        {[90, 100, 110, 125, 150, 175].map((size) => <option value={size} key={size}>{size}%</option>)}
      </select></label>
    </div>
    {loading && <p className="reader-message" role="status">Öppnar boken …</p>}
    {error && <div className="reader-message" role="alert"><p>{error}</p><button className="button primary" onClick={() => setAttempt((n) => n + 1)}>Försök igen</button></div>}
    <div ref={viewer} className="reader-viewer" style={{ display: error ? 'none' : undefined }} aria-busy={loading}/>
    <div className="reader-controls">
      <button className="button" disabled={loading || !!error || turning || atStart} onClick={() => void navigate('previous')}>← Föregående</button>
      <span aria-live="polite">{atEnd && !loading && !error ? 'Du har nått slutet av boken.' : ''}</span>
      <button className="button" disabled={loading || !!error || turning || atEnd} onClick={() => void navigate('next')}>Nästa →</button>
    </div>
    <p className="reader-note">Din läsposition sparas i den här webbläsaren när webbläsarens lagring är tillgänglig.</p>
  </section>;
}
