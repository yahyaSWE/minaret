// Recheck publication and explicit free access for every file request.
// Fetch only storage providers, never a client-supplied URL.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const headers = { 'Cache-Control': 'no-store' };
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) {
    return Response.json({ message: 'Ogiltig bok.' }, { status: 400, headers });
  }
  try {
    const base = process.env.CMS_URL?.trim() || 'https://ljudbok-cms.vercel.app';
    const metadata = await fetch(new URL(`/api/catalog/ebook?id=${id}`, base), {
      cache: 'no-store', signal: AbortSignal.timeout(15000),
    });
    if (!metadata.ok) return Response.json({ message: 'Boken är inte tillgänglig för gratisläsning just nu.' }, { status: metadata.status === 404 ? 404 : 502, headers });
    const file = await metadata.json() as { url: string; version: number };
    const url = new URL(file.url);
    const allowed = url.hostname.endsWith('.b-cdn.net') || url.hostname === 'edubbcgluouskdotwimq.supabase.co';
    if (url.protocol !== 'https:' || url.port || url.username || url.password || !allowed) {
      return Response.json({ message: 'E-boksfilen behöver ligga i förlagets fillagring.' }, { status: 502, headers });
    }
    const upstream = await fetch(url, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(45000) });
    if (!upstream.ok || !upstream.body) return Response.json({ message: 'E-boksfilen kunde inte hämtas.' }, { status: 502, headers });
    const maxBytes = 40 * 1024 * 1024;
    if (Number(upstream.headers.get('content-length')) > maxBytes) {
      await upstream.body.cancel();
      return Response.json({ message: 'E-boksfilen är för stor för webbläsaren (max 40 MB).' }, { status: 413, headers });
    }
    let bytes = 0;
    const body = upstream.body.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        bytes += chunk.byteLength;
        if (bytes > maxBytes) controller.error(new Error('E-boksfilen är för stor.'));
        else controller.enqueue(chunk);
      },
    }));
    return new Response(body, { headers: { ...headers, 'Content-Type': 'application/epub+zip',
      'X-Content-Type-Options': 'nosniff', 'X-Ebook-Version': String(file.version) } });
  } catch {
    return Response.json({ message: 'E-boksfilen kunde inte hämtas. Försök igen om en stund.' }, { status: 502, headers });
  }
}
