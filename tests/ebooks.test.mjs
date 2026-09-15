import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GET } from '../app/api/ebooks/[id]/route.ts';

const context = (id = '7') => ({ params: Promise.resolve({ id }) });

test('invalid IDs never fetch', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', () => { throw Error('Unexpected request'); });
  assert.equal((await GET(new Request('https://web.test'), context('../1'))).status, 400);
  assert.equal(fetch.mock.callCount(), 0);
});
test('unavailable books never fetch a file', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 404 }));
  assert.equal((await GET(new Request('https://web.test'), context())).status, 404);
  assert.equal(fetch.mock.callCount(), 1);
});
test('refuses arbitrary origins from stored URLs', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ url: 'http://127.0.0.1/private', version: 1 }));
  assert.equal((await GET(new Request('https://web.test'), context())).status, 502);
  assert.equal(fetch.mock.callCount(), 1);
});
test('streams permitted EPUB without caching and refuses redirects', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url: String(url), options });
    return calls.length === 1 ? Response.json({ url: 'https://books.b-cdn.net/book.epub', version: 2 }) : new Response('EPUB');
  });
  const result = await GET(new Request('https://web.test'), context());
  assert.equal(result.status, 200);
  assert.equal(await result.text(), 'EPUB');
  assert.equal(result.headers.get('cache-control'), 'no-store');
  assert.equal(result.headers.get('x-ebook-version'), '2');
  assert.equal(calls[0].options.cache, 'no-store');
  assert.equal(calls[1].options.redirect, 'error');
});
test('rejects oversized files', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => ++calls === 1 ? Response.json({ url: 'https://books.b-cdn.net/book.epub', version: 1 }) : new Response('x', { headers: { 'Content-Length': String(41 * 1024 * 1024) } }));
  assert.equal((await GET(new Request('https://web.test'), context())).status, 413);
});
