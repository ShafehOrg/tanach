import { describe, it, expect } from 'vitest';
import {
  getPreferredPasukForName,
  getAllPreferredVerses,
  normalizeHebrewLetter,
  extractHebrewLetters,
  getAllLetterForms,
} from './preferred.js';
// Import the full version for comparison
import { getPreferredPasukForName as getPreferredPasukFull } from './index.js';

describe('Preferred (lightweight entry point)', () => {
  describe('getPreferredPasukForName', () => {
    it('returns a verse for a known letter combination', () => {
      // א-א combination (first entry in the data)
      const verse = getPreferredPasukForName('א', 'א');
      expect(verse).not.toBeNull();
      expect(verse!.book).toBe('Tehillim');
      expect(verse!.chapter).toBe(118);
      expect(verse!.verse).toBe(25);
      expect(verse!.text).toBeTruthy();
      expect(verse!.bookHebrew).toBeTruthy();
      expect(verse!.bookEnglish).toBeTruthy();
      expect(verse!.preferred).toBe(true);
    });

    it('returns null for an unknown letter combination', () => {
      const verse = getPreferredPasukForName('!', '!');
      expect(verse).toBeNull();
    });

    it('handles final form letters', () => {
      // ם should be normalized to מ
      const verse = getPreferredPasukForName('א', 'ם');
      expect(verse).not.toBeNull();
    });

    it('returns the same results as the full library version', () => {
      const letters = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');
      for (const start of letters) {
        for (const end of letters) {
          const lightweight = getPreferredPasukForName(start, end);
          const full = getPreferredPasukFull(start, end);

          if (full === null) {
            expect(lightweight).toBeNull();
          } else {
            expect(lightweight).not.toBeNull();
            expect(lightweight!.book).toBe(full!.book);
            expect(lightweight!.chapter).toBe(full!.chapter);
            expect(lightweight!.verse).toBe(full!.verse);
            expect(lightweight!.text).toBe(full!.text);
            expect(lightweight!.bookHebrew).toBe(full!.bookHebrew);
            expect(lightweight!.bookEnglish).toBe(full!.bookEnglish);
          }
        }
      }
    });
  });

  describe('getAllPreferredVerses', () => {
    it('returns 457 verses', () => {
      expect(getAllPreferredVerses()).toHaveLength(457);
    });

    it('every verse has text embedded', () => {
      for (const verse of getAllPreferredVerses()) {
        expect(verse.text).toBeTruthy();
        expect(verse.bookHebrew).toBeTruthy();
        expect(verse.bookEnglish).toBeTruthy();
      }
    });
  });

  describe('utility functions match the full library', () => {
    it('normalizeHebrewLetter works', () => {
      expect(normalizeHebrewLetter('ם')).toBe('מ');
      expect(normalizeHebrewLetter('ך')).toBe('כ');
      expect(normalizeHebrewLetter('א')).toBe('א');
    });

    it('extractHebrewLetters works', () => {
      expect(extractHebrewLetters('בְּרֵאשִׁ֖ית בָּרָ֣א')).toBe('בראשית ברא');
      expect(extractHebrewLetters('בְּרֵאשִׁ֖ית', false)).toBe('בראשית');
    });

    it('getAllLetterForms works', () => {
      expect(getAllLetterForms('מ')).toEqual(['מ', 'ם']);
      expect(getAllLetterForms('ם')).toEqual(['מ', 'ם']);
      expect(getAllLetterForms('א')).toEqual(['א']);
    });
  });
});
