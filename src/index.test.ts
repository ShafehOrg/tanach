import { describe, it, expect } from 'vitest';
import { sections, torah, neviim, kesuvim, tanach, getChapter, getBooks, getBookMeta } from './index.js';

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
});
