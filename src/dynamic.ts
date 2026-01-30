/**
 * Dynamic entry point for size-constrained environments (Edge Functions, etc.)
 *
 * This module does NOT bundle the Tanach data. Instead, it fetches per-book
 * JSON files at runtime from a configurable base URL. Each book is 5–215 KB,
 * compared to the full dataset at 6+ MB.
 *
 * Setup:
 *   1. Host the per-book JSON files from dist/books/ as static assets
 *      (e.g., copy them to your Next.js public/ directory)
 *   2. Configure the base URL before using any data functions:
 *
 * @example
 * ```ts
 * import { configure, findPesukimByName, tanach } from '@shafeh/tanach/dynamic';
 *
 * configure({ baseUrl: 'https://myapp.com/data/tanach/books' });
 *
 * // All data functions are async
 * const verses = await findPesukimByName("ד", "ד");
 * const verse = await tanach("Bereishit", 1, 1);
 * ```
 */

import { preferredVersesWithText, type PreferredVerseWithText } from './preferred-verses-data.js';
import type { VerseResult, Book, BookMeta, TanachData } from './types.js';

// Re-export types
export type { VerseResult, Book, BookMeta, TanachData } from './types.js';
export type { PreferredVerseWithText } from './preferred-verses-data.js';
export type { PreferredVerse } from './preferred-verses.js';
export type { Section } from './types.js';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

let _baseUrl: string | null = null;

/**
 * Configure the dynamic module with the URL where per-book JSON files are hosted.
 *
 * @param options.baseUrl - Base URL for fetching book JSON files.
 *   The module will fetch `${baseUrl}/${bookName}.json` for each book.
 *   Example: 'https://myapp.com/data/tanach/books'
 */
export const configure = (options: { baseUrl: string }): void => {
  // Remove trailing slash
  _baseUrl = options.baseUrl.replace(/\/$/, '');
};

function getBaseUrl(): string {
  if (!_baseUrl) {
    throw new Error(
      '@shafeh/tanach/dynamic: You must call configure({ baseUrl }) before using data functions. ' +
      'See https://github.com/ShafehOrg/tanach#dynamic-usage for setup instructions.'
    );
  }
  return _baseUrl;
}

// ---------------------------------------------------------------------------
// Book cache & fetching
// ---------------------------------------------------------------------------

const bookCache = new Map<string, Book>();

/**
 * Fetch a single book's data from the configured base URL.
 * Results are cached in memory for the lifetime of the module.
 */
async function loadBook(bookName: string): Promise<Book | null> {
  const cached = bookCache.get(bookName);
  if (cached) return cached;

  const url = `${getBaseUrl()}/${encodeURIComponent(bookName)}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch book "${bookName}": ${response.status} ${response.statusText}`);
  }

  const bookData = (await response.json()) as Book;
  bookCache.set(bookName, bookData);
  return bookData;
}

/**
 * Fetch the book manifest (list of all book names).
 * Cached after first fetch.
 */
let _bookNames: string[] | null = null;

async function loadBookNames(): Promise<string[]> {
  if (_bookNames) return _bookNames;

  const url = `${getBaseUrl()}/_manifest.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch book manifest: ${response.status} ${response.statusText}`);
  }

  _bookNames = (await response.json()) as string[];
  return _bookNames;
}

/**
 * Clear the in-memory book cache.
 * Useful if you need to free memory after a request.
 */
export const clearCache = (): void => {
  bookCache.clear();
  _bookNames = null;
};

// ---------------------------------------------------------------------------
// Hebrew letter utilities (sync - no data needed)
// ---------------------------------------------------------------------------

const finalFormMap: Record<string, string> = {
  'ך': 'כ',
  'ם': 'מ',
  'ן': 'נ',
  'ף': 'פ',
  'ץ': 'צ'
};

const regularToFinalMap: Record<string, string> = {
  'כ': 'ך',
  'מ': 'ם',
  'נ': 'ן',
  'פ': 'ף',
  'צ': 'ץ'
};

/** Normalize a Hebrew letter to its regular (non-final) form */
export const normalizeHebrewLetter = (letter: string): string => {
  return finalFormMap[letter] || letter;
};

/** Get all forms (regular and final) of a Hebrew letter */
export const getAllLetterForms = (letter: string): string[] => {
  const normalized = normalizeHebrewLetter(letter);
  const finalForm = regularToFinalMap[normalized];
  return finalForm ? [normalized, finalForm] : [normalized];
};

/** Extract only Hebrew letters from text, removing nekudot and cantillation marks */
export const extractHebrewLetters = (text: string, preserveSpaces: boolean = true): string => {
  if (preserveSpaces) {
    return text.replace(/[^\u05D0-\u05EA\s]/g, '');
  }
  return text.replace(/[^\u05D0-\u05EA]/g, '');
};

// ---------------------------------------------------------------------------
// Preferred verse lookup (sync - uses embedded data from preferred-verses-data)
// ---------------------------------------------------------------------------

let _preferredMap: Map<string, PreferredVerseWithText> | null = null;

function getPreferredMap(): Map<string, PreferredVerseWithText> {
  if (!_preferredMap) {
    _preferredMap = new Map();
    for (const verse of preferredVersesWithText) {
      const key = `${normalizeHebrewLetter(verse.startLetter)}-${normalizeHebrewLetter(verse.endLetter)}`;
      _preferredMap.set(key, verse);
    }
  }
  return _preferredMap;
}

/**
 * Get the traditional/preferred pasuk for a given name.
 * This is synchronous — the verse text is embedded in the module (no fetch needed).
 */
export const getPreferredPasukForName = (
  startLetter: string,
  endLetter: string
): VerseResult | null => {
  const normalizedStart = normalizeHebrewLetter(extractHebrewLetters(startLetter, false)[0] || '');
  const normalizedEnd = normalizeHebrewLetter(extractHebrewLetters(endLetter, false)[0] || '');

  if (!normalizedStart || !normalizedEnd) {
    return null;
  }

  const key = `${normalizedStart}-${normalizedEnd}`;
  const preferred = getPreferredMap().get(key);

  if (!preferred) {
    return null;
  }

  return {
    book: preferred.book,
    bookHebrew: preferred.bookHebrew,
    bookEnglish: preferred.bookEnglish,
    chapter: preferred.chapter,
    verse: preferred.verse,
    text: preferred.text,
    preferred: true
  };
};

/**
 * Get all preferred verses with their text (sync).
 */
export const getAllPreferredVerses = (): PreferredVerseWithText[] => {
  return preferredVersesWithText;
};

// ---------------------------------------------------------------------------
// Async data functions
// ---------------------------------------------------------------------------

/**
 * Get all available book names.
 * Fetches the manifest on first call.
 */
export const getBooks = async (): Promise<string[]> => {
  return loadBookNames();
};

/**
 * Get a specific verse from the Tanach.
 *
 * @example
 * ```ts
 * const verse = await tanach("Bereishit", 1, 1);
 * console.log(verse?.text); // Hebrew text of Genesis 1:1
 * ```
 */
export const tanach = async (
  book: string,
  chapter: number,
  verse: number
): Promise<VerseResult | null> => {
  const bookData = await loadBook(book);

  if (!bookData) return null;

  const chapterData = bookData.chapters[chapter];
  if (!chapterData) return null;

  const verseData = chapterData.find(([v]) => v === verse);
  if (!verseData) return null;

  return {
    book,
    bookHebrew: bookData.meta.he,
    bookEnglish: bookData.meta.en,
    chapter,
    verse: verseData[0],
    text: verseData[1]
  };
};

/**
 * Get an entire chapter.
 */
export const getChapter = async (
  book: string,
  chapter: number
): Promise<VerseResult[] | null> => {
  const bookData = await loadBook(book);

  if (!bookData) return null;

  const chapterData = bookData.chapters[chapter];
  if (!chapterData) return null;

  return chapterData.map(([verseNum, text]) => ({
    book,
    bookHebrew: bookData.meta.he,
    bookEnglish: bookData.meta.en,
    chapter,
    verse: verseNum,
    text
  }));
};

/**
 * Get book metadata.
 */
export const getBookMeta = async (book: string): Promise<BookMeta | null> => {
  const bookData = await loadBook(book);
  return bookData?.meta ?? null;
};

/**
 * Find all verses that begin with a specific Hebrew letter.
 * Fetches books on demand (in parallel).
 */
export const findPesukimByStartingLetter = async (
  letter: string,
  options?: { books?: string[]; maxResults?: number }
): Promise<VerseResult[]> => {
  const results: VerseResult[] = [];
  const maxResults = options?.maxResults;

  const extractedLetter = extractHebrewLetters(letter, false)[0];
  if (!extractedLetter) return results;
  const searchLetter = normalizeHebrewLetter(extractedLetter);

  const booksToSearch = options?.books ?? await loadBookNames();

  // Fetch all books in parallel
  const bookEntries = await Promise.all(
    booksToSearch.map(async (bookName) => {
      const bookData = await loadBook(bookName);
      return { bookName, bookData };
    })
  );

  for (const { bookName, bookData } of bookEntries) {
    if (!bookData) continue;

    for (const [chapterNum, verses] of Object.entries(bookData.chapters)) {
      for (const [verseNum, text] of verses) {
        const firstLetter = normalizeHebrewLetter(extractHebrewLetters(text, false)[0]);

        if (firstLetter === searchLetter) {
          results.push({
            book: bookName,
            bookHebrew: bookData.meta.he,
            bookEnglish: bookData.meta.en,
            chapter: Number(chapterNum),
            verse: verseNum,
            text
          });

          if (maxResults && results.length >= maxResults) {
            return results;
          }
        }
      }
    }
  }

  return results;
};

/**
 * Find all verses that begin with one Hebrew letter and end with another.
 * Fetches books on demand (in parallel).
 *
 * @example
 * ```ts
 * // Find all verses for the name "David" (דוד)
 * const verses = await findPesukimByName("ד", "ד");
 * ```
 */
export const findPesukimByName = async (
  startLetter: string,
  endLetter: string,
  options?: { books?: string[]; maxResults?: number }
): Promise<VerseResult[]> => {
  const results: VerseResult[] = [];
  const maxResults = options?.maxResults;

  const extractedStartLetter = extractHebrewLetters(startLetter, false)[0];
  const extractedEndLetter = extractHebrewLetters(endLetter, false)[0];

  if (!extractedStartLetter || !extractedEndLetter) return results;

  const searchStartLetter = normalizeHebrewLetter(extractedStartLetter);
  const endLetterAlternatives = getAllLetterForms(extractedEndLetter);

  // Get preferred verse info (sync, from embedded data)
  const normalizedEnd = normalizeHebrewLetter(extractedEndLetter);
  const preferredKey = `${searchStartLetter}-${normalizedEnd}`;
  const preferredInfo = getPreferredMap().get(preferredKey);

  const booksToSearch = options?.books ?? await loadBookNames();

  // Fetch all books in parallel
  const bookEntries = await Promise.all(
    booksToSearch.map(async (bookName) => {
      const bookData = await loadBook(bookName);
      return { bookName, bookData };
    })
  );

  for (const { bookName, bookData } of bookEntries) {
    if (!bookData) continue;

    for (const [chapterNum, verses] of Object.entries(bookData.chapters)) {
      for (const [verseNum, text] of verses) {
        const lettersOnly = extractHebrewLetters(text, false);
        const firstLetter = normalizeHebrewLetter(lettersOnly[0]);
        const lastLetter = lettersOnly[lettersOnly.length - 1];

        if (firstLetter === searchStartLetter && endLetterAlternatives.includes(lastLetter)) {
          const isPreferred = preferredInfo &&
            preferredInfo.book === bookName &&
            preferredInfo.chapter === Number(chapterNum) &&
            preferredInfo.verse === verseNum;

          results.push({
            book: bookName,
            bookHebrew: bookData.meta.he,
            bookEnglish: bookData.meta.en,
            chapter: Number(chapterNum),
            verse: verseNum,
            text,
            preferred: isPreferred || undefined
          });

          if (maxResults && results.length >= maxResults) {
            return results;
          }
        }
      }
    }
  }

  // Sort so preferred verse comes first
  return results.sort((a, b) => {
    if (a.preferred && !b.preferred) return -1;
    if (!a.preferred && b.preferred) return 1;
    return 0;
  });
};
