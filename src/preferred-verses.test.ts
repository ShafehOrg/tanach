import { describe, it, expect } from 'vitest';
import {
  preferredVerses,
  preferredVersesMap,
  getPreferredVerse,
  getPreferredVerseKey,
} from './preferred-verses.js';
import {
  tanach,
  getBooks,
  extractHebrewLetters,
  findPesukimByName,
  getPreferredPasukForName
} from './index.js';

/** All 22 Hebrew letters (non-final forms) */
const hebrewLetters = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');

/** Final form letters used as endLetter */
const finalFormLetters = ['ך', 'ם', 'ן', 'ף', 'ץ'];

/** All possible endLetter values (regular + final forms) */
const allEndLetters = [...hebrewLetters, ...finalFormLetters];

describe('Preferred Verses', () => {
  describe('Data integrity', () => {
    it('contains 457 entries', () => {
      expect(preferredVerses).toHaveLength(457);
    });

    it('every entry has all required fields', () => {
      for (const entry of preferredVerses) {
        expect(entry.startLetter).toBeTruthy();
        expect(entry.endLetter).toBeTruthy();
        expect(entry.book).toBeTruthy();
        expect(entry.chapter).toBeGreaterThan(0);
        expect(entry.verse).toBeGreaterThan(0);
      }
    });

    it('all startLetters are valid Hebrew letters', () => {
      for (const entry of preferredVerses) {
        expect(hebrewLetters).toContain(entry.startLetter);
      }
    });

    it('all endLetters are valid Hebrew letters (including final forms)', () => {
      for (const entry of preferredVerses) {
        expect(allEndLetters).toContain(entry.endLetter);
      }
    });

    it('has no duplicate letter combinations', () => {
      const keys = preferredVerses.map(
        e => getPreferredVerseKey(e.startLetter, e.endLetter)
      );
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });

    it('all 22 starting letters are represented', () => {
      const startLetters = new Set(preferredVerses.map(e => e.startLetter));
      for (const letter of hebrewLetters) {
        expect(startLetters.has(letter)).toBe(true);
      }
    });

    it('all book names correspond to real books in the data', () => {
      const validBooks = new Set(getBooks());
      const bookNames = new Set(preferredVerses.map(e => e.book));
      for (const book of bookNames) {
        expect(validBooks.has(book), `Book "${book}" not found in tanach data`).toBe(true);
      }
    });
  });

  describe('Verse references resolve correctly', () => {
    it('every entry points to a real verse in the tanach data', () => {
      const failures: string[] = [];
      for (const entry of preferredVerses) {
        const verse = tanach(entry.book, entry.chapter, entry.verse);
        if (!verse) {
          failures.push(
            `${entry.startLetter}-${entry.endLetter}: ${entry.book} ${entry.chapter}:${entry.verse} not found`
          );
        }
      }
      expect(failures, failures.join('\n')).toHaveLength(0);
    });
  });

  describe('preferredVersesMap', () => {
    it('has the same number of entries as the array', () => {
      expect(preferredVersesMap.size).toBe(preferredVerses.length);
    });

    it('every array entry is accessible via the map', () => {
      for (const entry of preferredVerses) {
        const key = getPreferredVerseKey(entry.startLetter, entry.endLetter);
        const found = preferredVersesMap.get(key);
        expect(found).toBeDefined();
        expect(found).toBe(entry);
      }
    });
  });

  describe('getPreferredVerseKey', () => {
    it('returns hyphen-separated key', () => {
      expect(getPreferredVerseKey('א', 'ב')).toBe('א-ב');
    });

    it('handles final form letters', () => {
      expect(getPreferredVerseKey('א', 'ם')).toBe('א-ם');
    });

    it('handles same letter for start and end', () => {
      expect(getPreferredVerseKey('ד', 'ד')).toBe('ד-ד');
    });
  });

  describe('getPreferredVerse', () => {
    it('returns the correct verse for א-א (Tehillim 118:25)', () => {
      const verse = getPreferredVerse('א', 'א');
      expect(verse).toBeDefined();
      expect(verse?.book).toBe('Tehillim');
      expect(verse?.chapter).toBe(118);
      expect(verse?.verse).toBe(25);
    });

    it('returns the correct verse for ב-א (Tehillim 115:10)', () => {
      const verse = getPreferredVerse('ב', 'א');
      expect(verse).toBeDefined();
      expect(verse?.book).toBe('Tehillim');
      expect(verse?.chapter).toBe(115);
      expect(verse?.verse).toBe(10);
    });

    it('returns the correct verse for ב-ג (Divrei Hayamim I 11:22)', () => {
      const verse = getPreferredVerse('ב', 'ג');
      expect(verse).toBeDefined();
      expect(verse?.book).toBe('Divrei Hayamim I');
      expect(verse?.chapter).toBe(11);
      expect(verse?.verse).toBe(22);
    });

    it('returns the correct verse for ד-ד (Tehillim 105:4)', () => {
      const verse = getPreferredVerse('ד', 'ד');
      expect(verse).toBeDefined();
      expect(verse?.book).toBe('Tehillim');
      expect(verse?.chapter).toBe(105);
      expect(verse?.verse).toBe(4);
    });

    it('returns the correct verse for ש-ה (Shir Hashirim 1:1)', () => {
      const verse = getPreferredVerse('ש', 'ה');
      expect(verse).toBeDefined();
      expect(verse?.book).toBe('Shir Hashirim');
      expect(verse?.chapter).toBe(1);
      expect(verse?.verse).toBe(1);
    });

    it('returns the correct verse for ת-ת (Tehillim 71:23)', () => {
      const verse = getPreferredVerse('ת', 'ת');
      expect(verse).toBeDefined();
      expect(verse?.book).toBe('Tehillim');
      expect(verse?.chapter).toBe(71);
      expect(verse?.verse).toBe(23);
    });

    it('returns the correct verse for entries with final-form end letters', () => {
      // א-ם = Nechemiah 9:7
      const alefMem = getPreferredVerse('א', 'ם');
      expect(alefMem).toBeDefined();
      expect(alefMem?.book).toBe('Nechemiah');
      expect(alefMem?.chapter).toBe(9);
      expect(alefMem?.verse).toBe(7);

      // א-ך = Tehillim 16:2
      const alefKaf = getPreferredVerse('א', 'ך');
      expect(alefKaf).toBeDefined();
      expect(alefKaf?.book).toBe('Tehillim');
      expect(alefKaf?.chapter).toBe(16);
      expect(alefKaf?.verse).toBe(2);

      // א-ן = Tehillim 30:9
      const alefNun = getPreferredVerse('א', 'ן');
      expect(alefNun).toBeDefined();
      expect(alefNun?.book).toBe('Tehillim');
      expect(alefNun?.chapter).toBe(30);
      expect(alefNun?.verse).toBe(9);

      // א-ף = Tehillim 85:12
      const alefPe = getPreferredVerse('א', 'ף');
      expect(alefPe).toBeDefined();
      expect(alefPe?.book).toBe('Tehillim');
      expect(alefPe?.chapter).toBe(85);
      expect(alefPe?.verse).toBe(12);

      // א-ץ = Tehillim 33:5
      const alefTsade = getPreferredVerse('א', 'ץ');
      expect(alefTsade).toBeDefined();
      expect(alefTsade?.book).toBe('Tehillim');
      expect(alefTsade?.chapter).toBe(33);
      expect(alefTsade?.verse).toBe(5);
    });

    it('returns undefined for combinations with no traditional source', () => {
      // These are known "No source" entries from the data
      expect(getPreferredVerse('ג', 'ט')).toBeUndefined();
      expect(getPreferredVerse('ד', 'ז')).toBeUndefined();
      expect(getPreferredVerse('ט', 'ג')).toBeUndefined();
      expect(getPreferredVerse('ט', 'ץ')).toBeUndefined();
      expect(getPreferredVerse('ר', 'ס')).toBeUndefined();
      expect(getPreferredVerse('ש', 'ס')).toBeUndefined();
      expect(getPreferredVerse('ת', 'ס')).toBeUndefined();
    });

    it('returns undefined for completely invalid letter combinations', () => {
      expect(getPreferredVerse('x', 'y')).toBeUndefined();
      expect(getPreferredVerse('', '')).toBeUndefined();
    });
  });

  describe('Corrected references', () => {
    it('ט-ך points to Tehillim 119:68 (not 114:68)', () => {
      const verse = getPreferredVerse('ט', 'ך');
      expect(verse).toBeDefined();
      expect(verse?.book).toBe('Tehillim');
      expect(verse?.chapter).toBe(119);
      expect(verse?.verse).toBe(68);
      // Verify this resolves to a real verse
      const resolved = tanach('Tehillim', 119, 68);
      expect(resolved).not.toBeNull();
    });

    it('ז-ר points to Tehillim 105:8 (not 100:8)', () => {
      const verse = getPreferredVerse('ז', 'ר');
      expect(verse).toBeDefined();
      expect(verse?.book).toBe('Tehillim');
      expect(verse?.chapter).toBe(105);
      expect(verse?.verse).toBe(8);
      const resolved = tanach('Tehillim', 105, 8);
      expect(resolved).not.toBeNull();
    });

    it('נ-ק points to Tehillim 110:4 (not 100:4)', () => {
      const verse = getPreferredVerse('נ', 'ק');
      expect(verse).toBeDefined();
      expect(verse?.book).toBe('Tehillim');
      expect(verse?.chapter).toBe(110);
      expect(verse?.verse).toBe(4);
      const resolved = tanach('Tehillim', 110, 4);
      expect(resolved).not.toBeNull();
    });
  });

  describe('Coverage across books', () => {
    it('includes verses from Tehillim', () => {
      const tehillimEntries = preferredVerses.filter(e => e.book === 'Tehillim');
      expect(tehillimEntries.length).toBeGreaterThan(200);
    });

    it('includes verses from Mishlei', () => {
      const mishleiEntries = preferredVerses.filter(e => e.book === 'Mishlei');
      expect(mishleiEntries.length).toBeGreaterThan(30);
    });

    it('includes verses from Torah books', () => {
      const torahBooks = ['Bereishit', 'Shemot', 'Vayikra', 'Bamidbar', 'Devarim'];
      const torahEntries = preferredVerses.filter(e => torahBooks.includes(e.book));
      expect(torahEntries.length).toBeGreaterThan(10);
    });

    it('includes verses from multiple distinct books', () => {
      const uniqueBooks = new Set(preferredVerses.map(e => e.book));
      expect(uniqueBooks.size).toBeGreaterThan(15);
    });
  });

  describe('Spot-check sample entries from each starting letter', () => {
    const spotChecks: [string, string, string, number, number][] = [
      // [startLetter, endLetter, book, chapter, verse]
      ['א', 'ת', 'Tehillim', 106, 3],
      ['ב', 'ב', 'Tehillim', 54, 8],
      ['ג', 'ר', 'Tehillim', 145, 3],
      ['ד', 'ה', 'Mishlei', 12, 25],
      ['ה', 'ו', 'Tehillim', 107, 1],
      ['ו', 'ר', 'Bereishit', 1, 3],
      ['ז', 'ו', 'Tehillim', 118, 20],
      ['ח', 'ד', 'Tehillim', 145, 8],
      ['ט', 'ו', 'Tehillim', 34, 9],
      ['י', 'ל', 'Tehillim', 118, 16],
      ['כ', 'ה', 'Tehillim', 117, 2],
      ['ל', 'ד', 'Tehillim', 27, 1],
      ['מ', 'י', 'Tehillim', 119, 97],
      ['נ', 'א', 'Tehillim', 33, 20],
      ['ס', 'ו', 'Tehillim', 34, 15],
      ['ע', 'ץ', 'Tehillim', 121, 2],
      ['פ', 'ה', 'Tehillim', 118, 19],
      ['צ', 'ו', 'Tehillim', 145, 17],
      ['ק', 'ה', 'Tehillim', 27, 14],
      ['ר', 'ד', 'Tehillim', 103, 8],
      ['ש', 'ל', 'Tehillim', 119, 165],
      ['ת', 'ר', 'Tehillim', 90, 1],
    ];

    for (const [start, end, book, chapter, verse] of spotChecks) {
      it(`${start}-${end} → ${book} ${chapter}:${verse}`, () => {
        const result = getPreferredVerse(start, end);
        expect(result).toBeDefined();
        expect(result?.book).toBe(book);
        expect(result?.chapter).toBe(chapter);
        expect(result?.verse).toBe(verse);
      });
    }
  });

  describe('Full example: ש-ל (Shin-Lamed, e.g. the name sharshiel)', () => {
    it('looks up the preferred verse reference for ש-ל', () => {
      const preferred = getPreferredVerse('ש', 'ל');

      // The preferred verse for shin-lamed is Tehillim 119:165
      expect(preferred).toBeDefined();
      expect(preferred?.startLetter).toBe('ש');
      expect(preferred?.endLetter).toBe('ל');
      expect(preferred?.book).toBe('Tehillim');
      expect(preferred?.chapter).toBe(119);
      expect(preferred?.verse).toBe(165);
    });

    it('resolves the ש-ל preferred verse to actual text from the tanach', () => {
      const preferred = getPreferredVerse('ש', 'ל');
      expect(preferred).toBeDefined();

      // Fetch the full verse text
      const verse = tanach(preferred!.book, preferred!.chapter, preferred!.verse);
      expect(verse).not.toBeNull();
      expect(verse!.book).toBe('Tehillim');
      expect(verse!.bookEnglish).toBe('Psalms');
      expect(verse!.chapter).toBe(119);
      expect(verse!.verse).toBe(165);
      expect(verse!.text).toBeTruthy();

      // The verse text should start with shin and end with lamed
      const letters = extractHebrewLetters(verse!.text, false);
      expect(letters[0]).toBe('ש');
      expect(letters[letters.length - 1]).toBe('ל');
    });

    it('getPreferredPasukForName returns the full verse for ש-ל in one call', () => {
      const verse = getPreferredPasukForName('ש', 'ל');

      expect(verse).not.toBeNull();
      expect(verse!.preferred).toBe(true);
      expect(verse!.book).toBe('Tehillim');
      expect(verse!.chapter).toBe(119);
      expect(verse!.verse).toBe(165);
      expect(verse!.text).toBeTruthy();

      // Verify the verse is "שָׁלוֹם רָב לְאֹהֲבֵי תוֹרָתֶךָ וְאֵין לָמוֹ מִכְשׁוֹל"
      const letters = extractHebrewLetters(verse!.text, false);
      expect(letters[0]).toBe('ש');
      expect(letters[letters.length - 1]).toBe('ל');
    });

    it('findPesukimByName returns ש-ל matches with the preferred verse first', () => {
      // No maxResults — allow full search so the preferred verse is found and sorted first
      const results = findPesukimByName('ש', 'ל');

      expect(results.length).toBeGreaterThan(0);

      // The preferred verse (Tehillim 119:165) should be sorted first
      expect(results[0].preferred).toBe(true);
      expect(results[0].book).toBe('Tehillim');
      expect(results[0].chapter).toBe(119);
      expect(results[0].verse).toBe(165);

      // All results should start with shin and end with lamed
      for (const result of results) {
        const letters = extractHebrewLetters(result.text, false);
        expect(letters[0]).toBe('ש');
        expect(letters[letters.length - 1]).toBe('ל');
      }

      // Only one result should be marked as preferred
      const preferredCount = results.filter(v => v.preferred).length;
      expect(preferredCount).toBe(1);
    });

    it('getPreferredPasukForName handles nekudot in the input letters', () => {
      // Passing letters with vowels should still work
      const verse = getPreferredPasukForName('שְׁ', 'לָ');

      expect(verse).not.toBeNull();
      expect(verse!.book).toBe('Tehillim');
      expect(verse!.chapter).toBe(119);
      expect(verse!.verse).toBe(165);
    });

    it('snapshot: preferred verse reference for ש-ל', () => {
      const preferred = getPreferredVerse('ש', 'ל');
      expect(preferred).toMatchInlineSnapshot(`
        {
          "book": "Tehillim",
          "chapter": 119,
          "endLetter": "ל",
          "startLetter": "ש",
          "verse": 165,
        }
      `);
    });

    it('snapshot: full resolved verse for ש-ל via getPreferredPasukForName', () => {
      const verse = getPreferredPasukForName('ש', 'ל');
      expect(verse).toMatchInlineSnapshot(`
        {
          "book": "Tehillim",
          "bookEnglish": "Psalms",
          "bookHebrew": "תהלים",
          "chapter": 119,
          "preferred": true,
          "text": "שָׁל֣וֹם רָ֖ב לְאֹֽהֲבֵ֣י תֽוֹרָתֶ֑ךָ וְאֵ֖ין לָ֣מוֹ מִכְשֽׁוֹל:",
          "verse": 165,
        }
      `);
    });

    it('snapshot: first 5 search results for ש-ל via findPesukimByName', () => {
      const results = findPesukimByName('ש', 'ל');
      // Take just the first 5 (preferred + 4 more) to keep the snapshot readable
      const first5 = results.map(v => ({
        ref: `${v.book} ${v.chapter}:${v.verse}`,
        bookHebrew: v.bookHebrew,
        preferred: v.preferred || false,
        text: v.text,
      }));
      expect(first5).toMatchInlineSnapshot(`
        [
          {
            "bookHebrew": "תהלים",
            "preferred": true,
            "ref": "Tehillim 119:165",
            "text": "שָׁל֣וֹם רָ֖ב לְאֹֽהֲבֵ֣י תֽוֹרָתֶ֑ךָ וְאֵ֖ין לָ֣מוֹ מִכְשֽׁוֹל:",
          },
          {
            "bookHebrew": "שמות",
            "preferred": false,
            "ref": "Shemot 34:23",
            "text": "שָׁל֥שׁ פְּעָמִ֖ים בַּשָּׁנָ֑ה יֵֽרָאֶה֙ כָּל־זְכ֣וּרְךָ֔ אֶת־פְּנֵ֛י הָֽאָדֹ֥ן | יְהֹוָ֖ה אֱלֹהֵ֥י יִשְׂרָאֵֽל:",
          },
          {
            "bookHebrew": "במדבר",
            "preferred": false,
            "ref": "Bamidbar 26:2",
            "text": "שְׂא֞וּ אֶת־רֹ֣אשׁ | כָּל־עֲדַ֣ת בְּנֵֽי־יִשְׂרָאֵ֗ל מִבֶּ֨ן עֶשְׂרִ֥ים שָׁנָ֛ה וָמַ֖עְלָה לְבֵ֣ית אֲבֹתָ֑ם כָּל־יֹצֵ֥א צָבָ֖א בְּיִשְׂרָאֵֽל:",
          },
          {
            "bookHebrew": "דברים",
            "preferred": false,
            "ref": "Devarim 32:5",
            "text": "שִׁחֵ֥ת ל֛וֹ לֹּ֖א בָּנָ֣יו מוּמָ֑ם דּ֥וֹר עִקֵּ֖שׁ וּפְתַלְתֹּֽל:",
          },
          {
            "bookHebrew": "שופטים",
            "preferred": false,
            "ref": "Shoftim 5:3",
            "text": "שִׁמְע֣וּ מְלָכִ֔ים הַאֲזִ֖ינוּ רֹֽזְנִ֑ים אָֽנֹכִ֗י לַֽיהֹוָה֙ אָנֹכִ֣י אָשִׁ֔ירָה אֲזַמֵּ֕ר לַֽיהֹוָ֖ה אֱלֹהֵ֥י יִשְׂרָאֵֽל:",
          },
          {
            "bookHebrew": "ישעיה",
            "preferred": false,
            "ref": "Yeshayahu 5:29",
            "text": "שְׁאָגָ֥ה ל֖וֹ כַּלָּבִ֑יא יִשְׁאַ֨ג<span class="instructional ksiv"> (כתיב וִשְׁאַ֨ג) </span> כַּכְּפִירִ֚ים וְיִנְהֹם֙ וְיֹאחֵ֣ז טֶ֔רֶף וְיַפְלִ֖יט וְאֵ֥ין מַצִּֽיל:",
          },
          {
            "bookHebrew": "ישעיה",
            "preferred": false,
            "ref": "Yeshayahu 31:6",
            "text": "שׁ֗וּבוּ לַֽאֲשֶׁ֛ר הֶֽעְמִ֥יקוּ סָרָ֖ה בְּנֵ֥י יִשְׂרָאֵֽל:",
          },
          {
            "bookHebrew": "ירמיה",
            "preferred": false,
            "ref": "Yirmiyahu 2:4",
            "text": "שִׁמְע֥וּ דְבַר־יְהֹוָ֖ה בֵּ֣ית יַֽעֲקֹ֑ב וְכָֽל־מִשְׁפְּח֖וֹת בֵּ֥ית יִשְׂרָאֵֽל:",
          },
          {
            "bookHebrew": "ירמיה",
            "preferred": false,
            "ref": "Yirmiyahu 4:6",
            "text": "שְׂאוּ־נֵ֣ס צִיּ֔וֹנָה הָעִ֖יזוּ אַל־תַּֽעֲמֹ֑דוּ כִּ֣י רָעָ֗ה אָֽנֹכִ֛י מֵבִ֥יא מִצָּפ֖וֹן וְשֶׁ֥בֶר גָּדֽוֹל:",
          },
          {
            "bookHebrew": "ירמיה",
            "preferred": false,
            "ref": "Yirmiyahu 10:1",
            "text": "שִׁמְע֣וּ אֶת־הַדָּבָ֗ר אֲשֶׁ֨ר דִּבֶּ֧ר יְהֹוָ֛ה עֲלֵיכֶ֖ם בֵּ֥ית יִשְׂרָאֵֽל:",
          },
          {
            "bookHebrew": "ירמיה",
            "preferred": false,
            "ref": "Yirmiyahu 34:19",
            "text": "שָׂרֵ֨י יְהוּדָ֜ה וְשָׂרֵ֣י יְרֽוּשָׁלִַ֗ם הַסָּֽרִסִים֙ וְהַכֹּֽ֣הֲנִ֔ים וְכֹ֖ל עַ֣ם הָאָ֑רֶץ הָעֹ֣בְרִ֔ים בֵּ֖ין בִּתְרֵ֥י הָעֵֽגֶל:",
          },
          {
            "bookHebrew": "ירמיה",
            "preferred": false,
            "ref": "Yirmiyahu 50:17",
            "text": "שֶׂ֧ה פְזוּרָ֛ה יִשְׂרָאֵ֖ל אֲרָי֣וֹת הִדִּ֑יחוּ הָֽרִאשׁ֚וֹן אֲכָלוֹ֙ מֶ֣לֶךְ אַשּׁ֔וּר וְזֶ֚ה הָֽאַֽחֲרוֹן֙ עִצְּמ֔וֹ נְבֽוּכַדְרֶאצַּ֖ר מֶ֥לֶךְ בָּבֶֽל:",
          },
          {
            "bookHebrew": "יחזקאל",
            "preferred": false,
            "ref": "Yechezkel 38:13",
            "text": "שְׁבָ֡א וּ֠דְדָן וְסֹֽחֲרֵ֨י תַרְשִׁ֚ישׁ וְכָל־כְּפִירֶ֙יהָ֙ יֹֽאמְר֣וּ לְךָ֔ הֲלִשְׁלֹ֚ל שָׁלָל֙ אַתָּ֣ה בָ֔א הֲלָבֹ֥ז בַּ֖ז הִקְהַ֣לְתָּ קְהָלֶ֑ךָ לָשֵׂ֣את | כֶּ֣סֶף וְזָהָ֗ב לָקַ֙חַת֙ מִקְנֶ֣ה וְקִנְיָ֔ן לִשְׁלֹ֖ל שָׁלָ֥ל גָּדֽוֹל:",
          },
          {
            "bookHebrew": "עמוס",
            "preferred": false,
            "ref": "Amos 5:1",
            "text": "שִׁמְע֞וּ אֶת־הַדָּבָ֣ר הַזֶּ֗ה אֲשֶׁ֨ר אָֽנֹכִ֜י נֹשֵׂ֧א עֲלֵיכֶ֛ם קִינָ֖ה בֵּ֥ית יִשְׂרָאֵֽל:",
          },
          {
            "bookHebrew": "תהלים",
            "preferred": false,
            "ref": "Tehillim 78:59",
            "text": "שָׁמַ֣ע אֱ֖לֹהִים וַיִּתְעַבָּ֑ר וַיִּמְאַ֥ס מְ֜אֹ֗ד בְּיִשְׂרָאֵֽל:",
          },
          {
            "bookHebrew": "תהלים",
            "preferred": false,
            "ref": "Tehillim 81:3",
            "text": "שְֽׂאוּ־זִ֖מְרָה וּתְנוּ־תֹ֑ף כִּנּ֖וֹר נָעִ֣ים עִם־נָֽבֶל:",
          },
          {
            "bookHebrew": "תהלים",
            "preferred": false,
            "ref": "Tehillim 124:1",
            "text": "שִׁ֥יר הַֽמַּֽעֲל֗וֹת לְדָ֫וִ֥ד לוּלֵ֣י יְ֖הֹוָה שֶׁהָ֣יָה לָ֑נוּ יֹֽאמַר־נָ֥א יִשְׂרָאֵֽל:",
          },
          {
            "bookHebrew": "תהלים",
            "preferred": false,
            "ref": "Tehillim 129:1",
            "text": "שִׁ֗יר הַֽמַּֽ֫עֲל֥וֹת רַ֖בַּת צְרָר֣וּנִי מִנְּעוּרָ֑י יֹ֥אמַר נָ֗א יִשְׂרָאֵֽל:",
          },
          {
            "bookHebrew": "משלי",
            "preferred": false,
            "ref": "Mishlei 31:30",
            "text": "שֶׁ֣קֶר הַ֖חֵן וְהֶ֣בֶל הַיֹּ֑פִי אִשָּׁ֥ה יִרְאַת־יְ֜הוָ֗ה הִ֣יא תִתְהַלָּֽל:",
          },
          {
            "bookHebrew": "איוב",
            "preferred": false,
            "ref": "Iyov 21:10",
            "text": "שׁוֹר֣וֹ עִ֖בַּר וְלֹ֣א יַגְעִ֑ל תְּפַלֵּ֥ט פָּֽ֜רָת֗וֹ וְלֹ֣א תְשַׁכֵּֽל:",
          },
        ]
      `);
    });
  });
});
