/**
 * Lightweight entry point for preferred verse lookups.
 *
 * This module does NOT import the full Tanach data (~6 MB), making it suitable
 * for edge functions and other size-constrained environments.
 *
 * Usage:
 *   import { getPreferredPasukForName } from '@shafeh/tanach/preferred';
 */

import { preferredVersesWithText, type PreferredVerseWithText } from './preferred-verses-data.js';
export type { PreferredVerseWithText } from './preferred-verses-data.js';
export type { VerseResult } from './types.js';

import type { VerseResult } from './types.js';

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
 */
export const normalizeHebrewLetter = (letter: string): string => {
  return finalFormMap[letter] || letter;
};

/**
 * Get all forms (regular and final) of a Hebrew letter
 */
export const getAllLetterForms = (letter: string): string[] => {
  const normalized = normalizeHebrewLetter(letter);
  const finalForm = regularToFinalMap[normalized];
  return finalForm ? [normalized, finalForm] : [normalized];
};

/**
 * Extract only Hebrew letters from text, removing nekudot and cantillation marks
 */
export const extractHebrewLetters = (text: string, preserveSpaces: boolean = true): string => {
  if (preserveSpaces) {
    return text.replace(/[^\u05D0-\u05EA\s]/g, '');
  }
  return text.replace(/[^\u05D0-\u05EA]/g, '');
};

/**
 * Lookup map for quick access to preferred verses (built lazily)
 */
let _map: Map<string, PreferredVerseWithText> | null = null;

function getMap(): Map<string, PreferredVerseWithText> {
  if (!_map) {
    _map = new Map();
    for (const verse of preferredVersesWithText) {
      const key = `${normalizeHebrewLetter(verse.startLetter)}-${normalizeHebrewLetter(verse.endLetter)}`;
      _map.set(key, verse);
    }
  }
  return _map;
}

/**
 * Get the traditional/preferred pasuk for a given name.
 *
 * This is a lightweight version that does NOT require the full Tanach data.
 * The verse text is embedded directly in the preferred verses data.
 *
 * @param startLetter - First letter of the name
 * @param endLetter - Last letter of the name
 * @returns The preferred verse if one exists, otherwise null
 *
 * @example
 * ```ts
 * import { getPreferredPasukForName } from '@shafeh/tanach/preferred';
 *
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
  const normalizedStart = normalizeHebrewLetter(extractHebrewLetters(startLetter, false)[0] || '');
  const normalizedEnd = normalizeHebrewLetter(extractHebrewLetters(endLetter, false)[0] || '');

  if (!normalizedStart || !normalizedEnd) {
    return null;
  }

  const key = `${normalizedStart}-${normalizedEnd}`;
  const preferred = getMap().get(key);

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
 * Get all preferred verses with their text.
 * Returns the complete list of 457 preferred verses.
 */
export const getAllPreferredVerses = (): PreferredVerseWithText[] => {
  return preferredVersesWithText;
};
