import { describe, it, expect, beforeAll, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  configure,
  clearCache,
  tanach,
  getChapter,
  getBooks,
  getBookMeta,
  findPesukimByName,
  findPesukimByStartingLetter,
  getPreferredPasukForName,
  getAllPreferredVerses,
  normalizeHebrewLetter,
  extractHebrewLetters,
  getAllLetterForms,
} from './dynamic.js';

// Import the sync versions for comparison
import {
  tanach as tanachSync,
  findPesukimByName as findPesukimByNameSync,
  getPreferredPasukForName as getPreferredPasukSync,
} from './index.js';

/**
 * Mock fetch to serve per-book JSON files from dist/books/
 */
const booksDir = resolve(__dirname, '../dist/books');

function mockFetch(url: string | URL | Request): Promise<Response> {
  const urlStr = typeof url === 'string' ? url : url.toString();
  const filename = decodeURIComponent(urlStr.split('/').pop()!);
  const filePath = resolve(booksDir, filename);

  try {
    const content = readFileSync(filePath, 'utf-8');
    return Promise.resolve(new Response(content, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch {
    return Promise.resolve(new Response('Not Found', { status: 404 }));
  }
}

beforeAll(() => {
  vi.stubGlobal('fetch', mockFetch);
  configure({ baseUrl: 'https://mock.test/books' });
});

describe('Dynamic entry point', () => {
  describe('tanach()', () => {
    it('returns Bereishit 1:1', async () => {
      const verse = await tanach('Bereishit', 1, 1);
      expect(verse).not.toBeNull();
      expect(verse!.book).toBe('Bereishit');
      expect(verse!.chapter).toBe(1);
      expect(verse!.verse).toBe(1);
      expect(verse!.text).toBeTruthy();
      expect(extractHebrewLetters(verse!.text, false).startsWith('בראשית')).toBe(true);
      expect(verse!.bookHebrew).toBe('בראשית');
      expect(verse!.bookEnglish).toBe('Genesis');
    });

    it('matches the sync version', async () => {
      const dynamic = await tanach('Tehillim', 23, 1);
      const sync = tanachSync('Tehillim', 23, 1);
      expect(dynamic).toEqual(sync);
    });

    it('returns null for non-existent book', async () => {
      const verse = await tanach('NonExistent', 1, 1);
      expect(verse).toBeNull();
    });

    it('returns null for non-existent chapter', async () => {
      const verse = await tanach('Bereishit', 999, 1);
      expect(verse).toBeNull();
    });

    it('returns null for non-existent verse', async () => {
      const verse = await tanach('Bereishit', 1, 999);
      expect(verse).toBeNull();
    });
  });

  describe('getChapter()', () => {
    it('returns all verses in a chapter', async () => {
      const chapter = await getChapter('Bereishit', 1);
      expect(chapter).not.toBeNull();
      expect(chapter!.length).toBe(31);
      expect(chapter![0].verse).toBe(1);
      expect(chapter![0].book).toBe('Bereishit');
    });

    it('returns null for non-existent chapter', async () => {
      const chapter = await getChapter('Bereishit', 999);
      expect(chapter).toBeNull();
    });
  });

  describe('getBooks()', () => {
    it('returns all book names', async () => {
      const books = await getBooks();
      expect(books.length).toBeGreaterThan(0);
      expect(books).toContain('Bereishit');
      expect(books).toContain('Tehillim');
    });
  });

  describe('getBookMeta()', () => {
    it('returns metadata for a book', async () => {
      const meta = await getBookMeta('Bereishit');
      expect(meta).not.toBeNull();
      expect(meta!.he).toBe('בראשית');
      expect(meta!.en).toBe('Genesis');
    });
  });

  describe('findPesukimByName()', () => {
    it('finds verses matching start and end letters', async () => {
      const verses = await findPesukimByName('ד', 'ד', { maxResults: 5 });
      expect(verses.length).toBeGreaterThan(0);
      expect(verses.length).toBeLessThanOrEqual(5);

      for (const v of verses) {
        const letters = extractHebrewLetters(v.text, false);
        expect(normalizeHebrewLetter(letters[0])).toBe('ד');
        expect(letters[letters.length - 1]).toBe('ד');
      }
    });

    it('returns the same results as the sync version', async () => {
      const dynamic = await findPesukimByName('א', 'ה', { maxResults: 10 });
      const sync = findPesukimByNameSync('א', 'ה', { maxResults: 10 });
      expect(dynamic).toEqual(sync);
    });

    it('marks the preferred verse', async () => {
      const verses = await findPesukimByName('ד', 'ד');
      const preferred = verses.find(v => v.preferred);
      expect(preferred).toBeDefined();
    });

    it('returns all results without maxResults (no cap)', async () => {
      const dynamic = await findPesukimByName('ד', 'ד');
      const sync = findPesukimByNameSync('ד', 'ד');
      // Should match the full library — no artificial limit
      expect(dynamic.length).toBe(sync.length);
    });

    it('returns all results for a common letter combination', async () => {
      // א-ה has many matches across the Tanach
      const dynamic = await findPesukimByName('א', 'ה');
      const sync = findPesukimByNameSync('א', 'ה');
      expect(dynamic.length).toBe(sync.length);
      expect(dynamic.length).toBeGreaterThan(50);
    });
  });

  describe('findPesukimByStartingLetter()', () => {
    it('finds verses starting with a letter', async () => {
      const verses = await findPesukimByStartingLetter('ב', { maxResults: 5 });
      expect(verses.length).toBeGreaterThan(0);

      for (const v of verses) {
        const firstLetter = normalizeHebrewLetter(extractHebrewLetters(v.text, false)[0]);
        expect(firstLetter).toBe('ב');
      }
    });
  });

  describe('getPreferredPasukForName() (sync)', () => {
    it('returns preferred verse without fetching', () => {
      const verse = getPreferredPasukForName('א', 'א');
      expect(verse).not.toBeNull();
      expect(verse!.preferred).toBe(true);
      expect(verse!.text).toBeTruthy();
    });

    it('matches the sync full-library version', () => {
      const dynamic = getPreferredPasukForName('ד', 'ד');
      const sync = getPreferredPasukSync('ד', 'ד');
      expect(dynamic).toEqual(sync);
    });
  });

  describe('getAllPreferredVerses()', () => {
    it('returns 457 entries', () => {
      expect(getAllPreferredVerses()).toHaveLength(457);
    });
  });

  describe('utility functions', () => {
    it('normalizeHebrewLetter works', () => {
      expect(normalizeHebrewLetter('ם')).toBe('מ');
      expect(normalizeHebrewLetter('א')).toBe('א');
    });

    it('extractHebrewLetters works', () => {
      expect(extractHebrewLetters('שלום', false)).toBe('שלום');
    });

    it('getAllLetterForms works', () => {
      expect(getAllLetterForms('מ')).toEqual(['מ', 'ם']);
    });
  });

  describe('clearCache()', () => {
    it('clears the cache and re-fetches work', async () => {
      await tanach('Bereishit', 1, 1);
      clearCache();
      const verse = await tanach('Bereishit', 1, 1);
      expect(verse).not.toBeNull();
    });
  });
});
