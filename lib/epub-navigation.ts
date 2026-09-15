/** Match a TOC link to an actual spine document, preserving any anchor. */
export function resolveChapterHref(href: string, spineHrefs: string[]): string | null {
  if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return null;
  const hashAt = href.indexOf('#');
  const path = hashAt < 0 ? href : href.slice(0, hashAt);
  const anchor = hashAt < 0 ? '' : href.slice(hashAt);
  const normalize = (value: string) => {
    try { return decodeURIComponent(new URL(value, 'https://epub.invalid/').pathname); }
    catch { return value; }
  };
  const target = normalize(path);
  const exact = spineHrefs.find((item) => normalize(item) === target);
  if (exact) return exact + anchor;
  // Some EPUB exports omit the text/ folder in nav.xhtml. Only repair an
  // unambiguous filename; never silently navigate to a different chapter.
  const filename = target.split('/').pop();
  if (!filename) return null;
  const candidates = spineHrefs.filter((item) => normalize(item).split('/').pop() === filename);
  return candidates.length === 1 ? candidates[0] + anchor : null;
}
