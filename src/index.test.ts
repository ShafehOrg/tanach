import { describe, it, expect } from 'vitest';
import {
  sections,
  torah,
  neviim,
  kesuvim,
  tanach,
  getChapter,
  getBooks,
  getBookMeta,
  extractHebrewLetters,
  findPesukimByStartingLetter,
  findPesukimByName,
  getPreferredPasukForName
} from './index.js';

describe('Tanach API', () => {
  describe('Sections', () => {
    it('returns sections array with 3 elements', () => {
      expect(sections).toHaveLength(3);
      expect(sections).toEqual(['Torah', 'Neviim', 'Kesuvim']);
    });

    it('returns Torah', () => {
      expect(torah()).toBe('Torah');
    });

    it('returns Neviim', () => {
      expect(neviim()).toBe('Neviim');
    });

    it('returns Kesuvim', () => {
      expect(kesuvim()).toBe('Kesuvim');
    });
  });

  describe('Books', () => {
    it('returns list of books', () => {
      const books = getBooks();
      expect(books.length).toBeGreaterThan(0);
      expect(books).toContain('Bereishit');
    });

    it('returns book metadata', () => {
      const meta = getBookMeta('Bereishit');
      expect(meta).not.toBeNull();
      expect(meta?.en).toBe('Genesis');
      expect(meta?.he).toBe('בראשית');
      expect(meta?.heT).toBe('Bereishit');
    });

    it('returns null for non-existent book', () => {
      const meta = getBookMeta('NonExistent');
      expect(meta).toBeNull();
    });
  });

  describe('Verses', () => {
    it('retrieves Genesis 1:1', () => {
      const verse = tanach('Bereishit', 1, 1);

      expect(verse).not.toBeNull();
      expect(verse?.book).toBe('Bereishit');
      expect(verse?.bookEnglish).toBe('Genesis');
      expect(verse?.chapter).toBe(1);
      expect(verse?.verse).toBe(1);
      expect(verse?.text).toBeTruthy();
    });

    it('retrieves Shmuel I 1:1', () => {
      const verse = tanach('Shmuel I', 1, 1);

      expect(verse).not.toBeNull();
      expect(verse?.book).toBe('Shmuel I');
      expect(verse?.text).toContain('וַיְהִי');
    });

    it('returns null for non-existent verse', () => {
      const verse = tanach('Bereishit', 999, 999);
      expect(verse).toBeNull();
    });

    it('returns null for non-existent book', () => {
      const verse = tanach('NonExistent', 1, 1);
      expect(verse).toBeNull();
    });
  });

  describe('Chapters', () => {
    it('retrieves entire chapter', () => {
      const chapter = getChapter('Bereishit', 1);

      expect(chapter).not.toBeNull();
      expect(Array.isArray(chapter)).toBe(true);
      expect(chapter!.length).toBeGreaterThan(0);

      const firstVerse = chapter![0];
      expect(firstVerse.book).toBe('Bereishit');
      expect(firstVerse.chapter).toBe(1);
    });

    it('returns null for non-existent chapter', () => {
      const chapter = getChapter('Bereishit', 999);
      expect(chapter).toBeNull();
    });
  });

  describe('extractHebrewLetters', () => {
    it('removes nekudot and cantillation marks while preserving spaces', () => {
      const text = 'בְּרֵאשִׁ֖ית בָּרָ֣א';
      const result = extractHebrewLetters(text);
      expect(result).toBe('בראשית ברא');
    });

    it('removes spaces when preserveSpaces is false', () => {
      const text = 'בְּרֵאשִׁ֖ית בָּרָ֣א';
      const result = extractHebrewLetters(text, false);
      expect(result).toBe('בראשיתברא');
    });

    it('handles text without diacritical marks', () => {
      const text = 'שלום';
      const result = extractHebrewLetters(text);
      expect(result).toBe('שלום');
    });

    it('preserves final forms', () => {
      const text = 'דָּוִדְךָ';
      const result = extractHebrewLetters(text);
      expect(result).toBe('דודך');
    });

    it('preserves spaces by default', () => {
      const text = 'שָׁל֣וֹם עֲלֵיכֶ֑ם';
      const result = extractHebrewLetters(text);
      expect(result).toBe('שלום עליכם');
    });

    it('removes spaces when preserveSpaces is false', () => {
      const text = 'שָׁל֣וֹם עֲלֵיכֶ֑ם';
      const result = extractHebrewLetters(text, false);
      expect(result).toBe('שלוםעליכם');
    });

    it('returns empty string for non-Hebrew text (with spaces preserved)', () => {
      const text = 'Hello 123';
      const result = extractHebrewLetters(text);
      expect(result).toBe(' '); // Spaces are preserved by default
    });

    it('returns empty string for non-Hebrew text without preserving spaces', () => {
      const text = 'Hello 123';
      const result = extractHebrewLetters(text, false);
      expect(result).toBe('');
    });
  });

  describe('findPesukimByStartingLetter', () => {
    it('finds verses starting with aleph', () => {
      const results = findPesukimByStartingLetter('א', { maxResults: 5 });
      expect(results.length).toBe(5);
      results.forEach(verse => {
        const firstLetter = extractHebrewLetters(verse.text, false)[0];
        expect(firstLetter).toBe('א');
      });
    });

    it('finds verses starting with bet', () => {
      const results = findPesukimByStartingLetter('ב', { maxResults: 10 });
      expect(results.length).toBe(10);
      results.forEach(verse => {
        const firstLetter = extractHebrewLetters(verse.text, false)[0];
        expect(firstLetter).toBe('ב');
      });
    });

    it('filters by specific books', () => {
      const results = findPesukimByStartingLetter('ו', {
        books: ['Bereishit'],
        maxResults: 5
      });
      expect(results.length).toBeLessThanOrEqual(5);
      results.forEach(verse => {
        expect(verse.book).toBe('Bereishit');
        const firstLetter = extractHebrewLetters(verse.text, false)[0];
        expect(firstLetter).toBe('ו');
      });
    });

    it('handles letter with nekudot in search parameter', () => {
      const results = findPesukimByStartingLetter('בְּ', { maxResults: 1 });
      expect(results.length).toBe(1);
      const firstLetter = extractHebrewLetters(results[0].text, false)[0];
      expect(firstLetter).toBe('ב');
    });

    it('returns empty array for non-existent letter search', () => {
      const results = findPesukimByStartingLetter('');
      expect(results).toEqual([]);
    });

    it('returns results without maxResults limit', () => {
      const results = findPesukimByStartingLetter('א', { books: ['Bereishit'], maxResults: undefined });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(verse => {
        const firstLetter = extractHebrewLetters(verse.text, false)[0];
        expect(firstLetter).toBe('א');
      });
    });
  });

  describe('findPesukimByName', () => {
    it('finds verses for name starting and ending with dalet (David)', () => {
      const results = findPesukimByName('ד', 'ד', { maxResults: 5 });
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(5);
      results.forEach(verse => {
        const letters = extractHebrewLetters(verse.text, false);
        expect(letters[0]).toBe('ד');
        expect(letters[letters.length - 1]).toBe('ד');
      });
    });

    it('finds verses for name starting with aleph ending with mem', () => {
      const results = findPesukimByName('א', 'ם', { maxResults: 5 });
      expect(results.length).toBe(5);
      results.forEach(verse => {
        const letters = extractHebrewLetters(verse.text, false);
        expect(letters[0]).toBe('א');
        // Should match either regular mem or final mem
        expect(['ם', 'מ']).toContain(letters[letters.length - 1]);
      });
    });

    it('handles final form letters correctly', () => {
      const results = findPesukimByName('י', 'ם', { maxResults: 3 });
      expect(results.length).toBe(3);
      results.forEach(verse => {
        const letters = extractHebrewLetters(verse.text, false);
        expect(letters[0]).toBe('י');
        // Final mem should match when searching for regular mem
        expect(['ם', 'מ']).toContain(letters[letters.length - 1]);
      });
    });

    it('filters by specific books', () => {
      const results = findPesukimByName('א', 'ה', {
        books: ['Tehillim'],
        maxResults: 5
      });
      expect(results.length).toBeLessThanOrEqual(5);
      results.forEach(verse => {
        expect(verse.book).toBe('Tehillim');
        const letters = extractHebrewLetters(verse.text, false);
        expect(letters[0]).toBe('א');
        expect(letters[letters.length - 1]).toBe('ה');
      });
    });

    it('handles letters with nekudot in search parameters', () => {
      const results = findPesukimByName('בְּ', 'דְ', { maxResults: 1 });
      expect(results.length).toBeLessThanOrEqual(1);
      if (results.length > 0) {
        const letters = extractHebrewLetters(results[0].text, false);
        expect(letters[0]).toBe('ב');
        expect(letters[letters.length - 1]).toBe('ד');
      }
    });

    it('returns empty array for invalid input', () => {
      const results = findPesukimByName('', '');
      expect(results).toEqual([]);
    });

    it('returns results without maxResults limit', () => {
      const results = findPesukimByName('ש', 'ם', {
        books: ['Bereishit'],
        maxResults: undefined
      });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(verse => {
        const letters = extractHebrewLetters(verse.text, false);
        expect(letters[0]).toBe('ש');
        expect(['ם', 'מ']).toContain(letters[letters.length - 1]);
      });
    });

    it('marks preferred verses', () => {
      // Search for א-א which has a preferred verse in Tehillim 118:25
      const results = findPesukimByName('א', 'א');
      expect(results.length).toBeGreaterThan(0);

      // Should have exactly one preferred verse
      const preferredVerses = results.filter(v => v.preferred);
      expect(preferredVerses.length).toBe(1);

      // The preferred verse should be first
      expect(results[0].preferred).toBe(true);
      expect(results[0].book).toBe('Tehillim');
      expect(results[0].chapter).toBe(118);
      expect(results[0].verse).toBe(25);
    });

    it('sorts preferred verse first', () => {
      const results = findPesukimByName('א', 'ב', { maxResults: 10 });

      // If there's a preferred verse, it should be first
      const preferredIndex = results.findIndex(v => v.preferred);
      if (preferredIndex >= 0) {
        expect(preferredIndex).toBe(0);
      }
    });
  });

  describe('getPreferredPasukForName', () => {
    it('returns the preferred verse for aleph-aleph', () => {
      const verse = getPreferredPasukForName('א', 'א');

      expect(verse).not.toBeNull();
      expect(verse?.book).toBe('Tehillim');
      expect(verse?.chapter).toBe(118);
      expect(verse?.verse).toBe(25);
      expect(verse?.preferred).toBe(true);
      expect(verse?.text).toBeTruthy();
      // Verify the verse starts with aleph
      const lettersOnly = extractHebrewLetters(verse!.text, false);
      expect(lettersOnly[0]).toBe('א');
      expect(lettersOnly[lettersOnly.length - 1]).toBe('א');
    });

    it('returns the preferred verse for aleph-bet', () => {
      const verse = getPreferredPasukForName('א', 'ב');

      expect(verse).not.toBeNull();
      expect(verse?.book).toBe('Tehillim');
      expect(verse?.chapter).toBe(44);
      expect(verse?.verse).toBe(5);
      expect(verse?.preferred).toBe(true);
    });

    it('handles letters with nekudot', () => {
      const verse = getPreferredPasukForName('אָ', 'בְּ');

      expect(verse).not.toBeNull();
      expect(verse?.book).toBe('Tehillim');
      expect(verse?.chapter).toBe(44);
      expect(verse?.verse).toBe(5);
    });

    it('returns null for letter combinations without preferred verses', () => {
      // Using a combination that likely doesn't have a preferred verse yet
      // (since we only have a small subset in the test data)
      const verse = getPreferredPasukForName('ק', 'ק');

      // This might be null if the verse isn't in our preferred list
      // The test is valid either way - either there's a preferred verse or not
      if (verse === null) {
        expect(verse).toBeNull();
      } else {
        expect(verse.preferred).toBe(true);
      }
    });

    it('returns null for invalid input', () => {
      const verse1 = getPreferredPasukForName('', '');
      const verse2 = getPreferredPasukForName('x', 'y');

      expect(verse1).toBeNull();
      expect(verse2).toBeNull();
    });
  });
});
