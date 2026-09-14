'use client';

export default function CatalogError({ reset }: { reset: () => void }) {
  return <main id="main" className="container page-section"><div className="empty-panel" role="alert">
    <h1>Böckerna kunde inte hämtas.</h1><p>Försök igen om en stund.</p><button className="button primary" onClick={reset}>Försök igen</button>
  </div></main>;
}
