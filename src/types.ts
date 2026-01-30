/**
 * Sections of the Tanach
 */
export type Section = 'Torah' | 'Neviim' | 'Kesuvim';

/**
 * Verse data in the original format
 */
export interface Verse {
  seferHe: string;
  seferEn: string;
  passuk: string;
  txt: string;
  pasuknum: number;
  sefer: string;
  perekNum: number;
}

/**
 * Compressed verse format: [verseNum, hebrewText]
 */
export type CompressedVerse = [number, string];

/**
 * Chapter data: map of verse numbers to Hebrew text
 */
export type Chapter = CompressedVerse[];

/**
 * Book metadata
 */
export interface BookMeta {
  he: string;      // Hebrew name (בראשית)
  en: string;      // English name (Genesis)
  heT: string;     // Hebrew transliterated (Bereishit)
}

/**
 * Book structure with metadata and chapters
 */
export interface Book {
  meta: BookMeta;
  chapters: Record<number, Chapter>;
}

/**
 * Complete Tanach data structure
 */
export type TanachData = Record<string, Book>;

/**
 * Query result for a verse
 */
export interface VerseResult {
  book: string;
  bookHebrew: string;
  bookEnglish: string;
  chapter: number;
  verse: number;
  text: string;
  /** Whether this verse is a preferred/traditional choice for a name */
  preferred?: boolean;
}
