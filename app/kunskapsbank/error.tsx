"use client";
export default function Error({ reset }: { reset: () => void }) {
  return <main id="main" className="container page-section"><h1>Kunskapsbanken kunde inte hämtas.</h1><p>Försök igen om en stund.</p><button className="button primary" onClick={reset}>Försök igen</button></main>;
}
