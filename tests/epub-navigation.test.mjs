import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveChapterHref } from '../lib/epub-navigation.ts';

test('repairs missing text folder in Hopp navigation without dropping anchors', () => {
  const spine = ['text/cover.xhtml', 'text/intro.xhtml', 'text/chapter1.xhtml'];
  assert.equal(resolveChapterHref('intro.xhtml', spine), 'text/intro.xhtml');
  assert.equal(resolveChapterHref('chapter1.xhtml#hope', spine), 'text/chapter1.xhtml#hope');
});
test('preserves exact paths even when filenames repeat', () => {
  assert.equal(resolveChapterHref('./a/chapter.xhtml#part', ['a/chapter.xhtml', 'b/chapter.xhtml']), 'a/chapter.xhtml#part');
});
test('does not guess ambiguous or missing chapters', () => {
  assert.equal(resolveChapterHref('chapter.xhtml', ['a/chapter.xhtml', 'b/chapter.xhtml']), null);
  assert.equal(resolveChapterHref('missing.xhtml', ['text/intro.xhtml']), null);
});
test('handles encoded filenames and rejects external links', () => {
  assert.equal(resolveChapterHref('f%C3%B6rord.xhtml', ['text/förord.xhtml']), 'text/förord.xhtml');
  assert.equal(resolveChapterHref('https://other.test/intro.xhtml', ['text/intro.xhtml']), null);
});
