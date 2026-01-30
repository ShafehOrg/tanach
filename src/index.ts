import { data } from './data.js';
import type { Section, VerseResult, TanachData } from './types.js';
import { getPreferredVerse } from './preferred-verses.js';

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

/**
 * Map of Hebrew final forms to their regular counterparts
 */
const finalFormMap: Record<string, string> = {
  'ך': 'כ',
  'ם': 'מ',
  'ן': 'נ',
  'ף': 'פ',
  'ץ': 'צ'
};

/**
 * Reverse map from regular forms to final forms
 */
const regularToFinalMap: Record<string, string> = {
  'כ': 'ך',
  'מ': 'ם',
  'נ': 'ן',
  'פ': 'ף',
  'צ': 'ץ'
};

/**
 * Normalize a Hebrew letter to its regular (non-final) form
 *
 * @param letter - Hebrew letter (possibly in final form)
 * @returns Regular form of the letter
 *
 * @example
 * ```ts
 * normalizeHebrewLetter("ם"); // Returns "מ"
 * normalizeHebrewLetter("מ"); // Returns "מ"
 * normalizeHebrewLetter("א"); // Returns "א"
 * ```
 */
export const normalizeHebrewLetter = (letter: string): string => {
  return finalFormMap[letter] || letter;
};

/**
 * Get all forms (regular and final) of a Hebrew letter
 *
 * @param letter - Hebrew letter in any form
 * @returns Array containing all forms of the letter
 *
 * @example
 * ```ts
 * getAllLetterForms("מ"); // Returns ["מ", "ם"]
 * getAllLetterForms("ם"); // Returns ["מ", "ם"]
 * getAllLetterForms("א"); // Returns ["א"]
 * ```
 */
export const getAllLetterForms = (letter: string): string[] => {
  const normalized = normalizeHebrewLetter(letter);
  const finalForm = regularToFinalMap[normalized];
  return finalForm ? [normalized, finalForm] : [normalized];
};

/**
 * Extract only Hebrew letters from text, removing nekudot (vowel points) and cantillation marks
 * Preserves spaces by default
 *
 * @param text - Hebrew text with diacritical marks
 * @param preserveSpaces - Whether to preserve spaces (default: true)
 * @returns Text with only Hebrew letters (including final forms) and optionally spaces
 *
 * @example
 * ```ts
 * extractHebrewLetters("בְּרֵאשִׁ֖ית בָּרָ֣א"); // Returns "בראשית ברא"
 * extractHebrewLetters("בְּרֵאשִׁ֖ית בָּרָ֣א", false); // Returns "בראשיתברא"
 * ```
 */
export const extractHebrewLetters = (text: string, preserveSpaces: boolean = true): string => {
  // Hebrew letter ranges:
  // \u0590-\u05FF: Hebrew block (includes letters and diacritical marks)
  // \u05D0-\u05EA: Hebrew letters only (aleph to tav)
  // This regex keeps only the Hebrew letters (base consonants including final forms)
  if (preserveSpaces) {
    return text.replace(/[^\u05D0-\u05EA\s]/g, '');
  }
  return text.replace(/[^\u05D0-\u05EA]/g, '');
};

/**
 * Find all verses that begin with a specific Hebrew letter
 *
 * @param letter - Hebrew letter to search for (e.g., "א", "ב")
 * @param options - Optional configuration
 * @param options.books - Limit search to specific books (defaults to all books)
 * @param options.maxResults - Maximum number of results to return (defaults to all)
 * @returns Array of matching verses
 *
 * @example
 * ```ts
 * // Find all verses starting with aleph
 * const verses = findPesukimByStartingLetter("א");
 *
 * // Find verses starting with bet in Torah books only
 * const verses = findPesukimByStartingLetter("ב", {
 *   books: ["Bereishit", "Shemot", "Vayikra", "Bamidbar", "Devarim"]
 * });
 *
 * // Find first 50 verses starting with gimmel
 * const verses = findPesukimByStartingLetter("ג", { maxResults: 50 });
 * ```
 */
export const findPesukimByStartingLetter = (
  letter: string,
  options?: { books?: string[]; maxResults?: number }
): VerseResult[] => {
  const results: VerseResult[] = [];
  const booksToSearch = options?.books ?? getBooks();
  const maxResults = options?.maxResults;

  // Extract just the letter without any diacritical marks and normalize to regular form
  // (final forms don't appear at the start of words)
  const extractedLetter = extractHebrewLetters(letter, false)[0];
  if (!extractedLetter) {
    return results;
  }
  const searchLetter = normalizeHebrewLetter(extractedLetter);

  for (const bookName of booksToSearch) {
    const bookData = data[bookName];
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
 * Find all verses that begin with one Hebrew letter and end with another
 * This is commonly used for the minhag of saying a pasuk for one's name in Shemona Esre
 *
 * @param startLetter - Hebrew letter the verse should start with (e.g., "ד" for David)
 * @param endLetter - Hebrew letter the verse should end with (e.g., "ד" for David)
 * @param options - Optional configuration
 * @param options.books - Limit search to specific books (defaults to all books)
 * @param options.maxResults - Maximum number of results to return (defaults to all)
 * @returns Array of matching verses
 *
 * @example
 * ```ts
 * // Find verses for the name "David" (דוד - starts with dalet, ends with dalet)
 * const verses = findPesukimByName("ד", "ד");
 *
 * // Find verses for the name "Avraham" (אברהם - starts with aleph, ends with mem)
 * const verses = findPesukimByName("א", "ם");
 *
 * // Search only in Tehillim (Psalms)
 * const verses = findPesukimByName("י", "ה", { books: ["Tehillim"] });
 * ```
 */
export const findPesukimByName = (
  startLetter: string,
  endLetter: string,
  options?: { books?: string[]; maxResults?: number }
): VerseResult[] => {
  const results: VerseResult[] = [];
  const booksToSearch = options?.books ?? getBooks();
  const maxResults = options?.maxResults;

  // Extract just the letters without any diacritical marks
  const extractedStartLetter = extractHebrewLetters(startLetter, false)[0];
  const extractedEndLetter = extractHebrewLetters(endLetter, false)[0];

  if (!extractedStartLetter || !extractedEndLetter) {
    return results;
  }

  // Normalize start letter (final forms don't appear at the start)
  const searchStartLetter = normalizeHebrewLetter(extractedStartLetter);

  // For end letter, get all forms (regular and final)
  const endLetterAlternatives = getAllLetterForms(extractedEndLetter);

  // Get preferred verse for this letter combination
  const preferred = getPreferredVerse(searchStartLetter, normalizeHebrewLetter(extractedEndLetter));

  for (const bookName of booksToSearch) {
    const bookData = data[bookName];
    if (!bookData) continue;

    for (const [chapterNum, verses] of Object.entries(bookData.chapters)) {
      for (const [verseNum, text] of verses) {
        const lettersOnly = extractHebrewLetters(text, false);
        const firstLetter = normalizeHebrewLetter(lettersOnly[0]);
        const lastLetter = lettersOnly[lettersOnly.length - 1];

        if (firstLetter === searchStartLetter && endLetterAlternatives.includes(lastLetter)) {
          // Check if this is the preferred verse
          const isPreferred = preferred &&
            preferred.book === bookName &&
            preferred.chapter === Number(chapterNum) &&
            preferred.verse === verseNum;

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

  // Sort results so preferred verse comes first
  return results.sort((a, b) => {
    if (a.preferred && !b.preferred) return -1;
    if (!a.preferred && b.preferred) return 1;
    return 0;
  });
};

/**
 * Get the traditional/preferred pasuk for a given name
 * This retrieves the verse that is traditionally used for the minhag of saying a pasuk for one's name
 *
 * @param startLetter - First letter of the name
 * @param endLetter - Last letter of the name
 * @returns The preferred verse if one exists, otherwise null
 *
 * @example
 * ```ts
 * // Get the preferred verse for "David" (דוד)
 * const verse = getPreferredPasukForName("ד", "ד");
 * if (verse) {
 *   console.log(`${verse.book} ${verse.chapter}:${verse.verse}`);
 *   console.log(verse.text);
 * }
 * ```
 */
export const getPreferredPasukForName = (
  startLetter: string,
  endLetter: string
): VerseResult | null => {
  // Normalize the letters
  const normalizedStart = normalizeHebrewLetter(extractHebrewLetters(startLetter, false)[0] || '');
  const normalizedEnd = normalizeHebrewLetter(extractHebrewLetters(endLetter, false)[0] || '');

  if (!normalizedStart || !normalizedEnd) {
    return null;
  }

  // Get the preferred verse info
  const preferred = getPreferredVerse(normalizedStart, normalizedEnd);

  if (!preferred || !preferred.book) {
    return null;
  }

  // Fetch the actual verse from the data
  const verse = tanach(preferred.book, preferred.chapter, preferred.verse);

  if (verse) {
    return {
      ...verse,
      preferred: true
    };
  }

  return null;
};

// Export types
export type { Section, VerseResult, TanachData, BookMeta, Book } from './types.js';
export type { PreferredVerse } from './preferred-verses.js';
