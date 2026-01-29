import { data } from './data.js';
import type { Section, VerseResult, TanachData } from './types.js';

/**
 * The three main sections of the Tanach
 */
export const sections: readonly Section[] = ['Torah', 'Neviim', 'Kesuvim'] as const;

/**
 * Get the Torah section name
 */
export const torah = (): Section => sections[0];

/**
 * Get the Neviim section name
 */
export const neviim = (): Section => sections[1];

/**
 * Get the Kesuvim section name
 */
export const kesuvim = (): Section => sections[2];

/**
 * Get all available book names
 */
export const getBooks = (): string[] => Object.keys(data);

/**
 * Get a specific verse from the Tanach
 *
 * @param book - Book name (transliterated Hebrew, e.g., "Bereishit")
 * @param chapter - Chapter number
 * @param verse - Verse number
 * @returns Verse result or null if not found
 *
 * @example
 * ```ts
 * const verse = tanach("Bereishit", 1, 1);
 * console.log(verse?.text); // Hebrew text of Genesis 1:1
 * ```
 */
export const tanach = (
  book: string,
  chapter: number,
  verse: number
): VerseResult | null => {
  const bookData = data[book];

  if (!bookData) {
    return null;
  }

  const chapterData = bookData.chapters[chapter];

  if (!chapterData) {
    return null;
  }

  const verseData = chapterData.find(([v]) => v === verse);

  if (!verseData) {
    return null;
  }

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
 * Get an entire chapter
 *
 * @param book - Book name (transliterated Hebrew)
 * @param chapter - Chapter number
 * @returns Array of verses or null if not found
 */
export const getChapter = (
  book: string,
  chapter: number
): VerseResult[] | null => {
  const bookData = data[book];

  if (!bookData) {
    return null;
  }

  const chapterData = bookData.chapters[chapter];

  if (!chapterData) {
    return null;
  }

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
 * Get book metadata
 *
 * @param book - Book name (transliterated Hebrew)
 * @returns Book metadata or null if not found
 */
export const getBookMeta = (book: string) => {
  return data[book]?.meta ?? null;
};

/**
 * Get the raw data (for advanced use cases)
 */
export const getRawData = (): TanachData => data;

// Export types
export type { Section, VerseResult, TanachData, BookMeta, Book } from './types.js';
