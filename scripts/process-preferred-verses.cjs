/**
 * Script to process the traditional preferred verses list and generate TypeScript data
 */

const fs = require('fs');
const path = require('path');

// Hebrew numbers to Arabic
const hebrewNumbers = {
  'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
  'י': 10, 'יא': 11, 'יב': 12, 'יג': 13, 'יד': 14, 'טו': 15, 'טז': 16,
  'יז': 17, 'יח': 18, 'יט': 19, 'כ': 20, 'כא': 21, 'כב': 22, 'כג': 23,
  'כד': 24, 'כה': 25, 'כו': 26, 'כז': 27, 'כח': 28, 'כט': 29, 'ל': 30,
  'לא': 31, 'לב': 32, 'לג': 33, 'לד': 34, 'לה': 35, 'לו': 36, 'לז': 37,
  'לח': 38, 'לט': 39, 'מ': 40, 'מא': 41, 'מב': 42, 'מג': 43, 'מד': 44,
  'מה': 45, 'מו': 46, 'מז': 47, 'מח': 48, 'מט': 49, 'נ': 50, 'נא': 51,
  'נב': 52, 'נג': 53, 'נד': 54, 'נה': 55, 'נו': 56, 'נז': 57, 'נח': 58,
  'נט': 59, 'ס': 60, 'סא': 61, 'סב': 62, 'סג': 63, 'סד': 64, 'סה': 65,
  'סו': 66, 'סז': 67, 'סח': 68, 'סט': 69, 'ע': 70, 'עא': 71, 'עב': 72,
  'עג': 73, 'עד': 74, 'עה': 75, 'עו': 76, 'עז': 77, 'עח': 78, 'עט': 79,
  'פ': 80, 'פא': 81, 'פב': 82, 'פג': 83, 'פד': 84, 'פה': 85, 'פו': 86,
  'פז': 87, 'פח': 88, 'פט': 89, 'צ': 90, 'צא': 91, 'צב': 92, 'צג': 93,
  'צד': 94, 'צה': 95, 'צו': 96, 'צז': 97, 'צח': 98, 'צט': 99, 'ק': 100,
  'קא': 101, 'קב': 102, 'קג': 103, 'קד': 104, 'קה': 105, 'קו': 106,
  'קז': 107, 'קח': 108, 'קט': 109, 'קי': 110, 'קיא': 111, 'קיב': 112,
  'קיג': 113, 'קיד': 114, 'קטו': 115, 'קטז': 116, 'קיז': 117, 'קיח': 118,
  'קיט': 119, 'קכ': 120, 'קכא': 121, 'קכב': 122, 'קכג': 123, 'קכד': 124,
  'קכה': 125, 'קכו': 126, 'קכז': 127, 'קכח': 128, 'קכט': 129, 'קל': 130,
  'קלא': 131, 'קלב': 132, 'קלג': 133, 'קלד': 134, 'קלה': 135, 'קלו': 136,
  'קלז': 137, 'קלח': 138, 'קלט': 139, 'קמ': 140, 'קמא': 141, 'קמב': 142,
  'קמג': 143, 'קמד': 144, 'קמה': 145, 'קמו': 146, 'קמז': 147, 'קמח': 148,
  'קמט': 149, 'קנ': 150, 'קנא': 151, 'קנב': 152,
};

const bookNameMap = {
  // Torah
  'בראשית': 'Bereishit',
  'Genesis': 'Bereishit',
  'שמות': 'Shemot',
  'Exodus': 'Shemot',
  'ויקרא': 'Vayikra',
  'Leviticus': 'Vayikra',
  'במדבר': 'Bamidbar',
  'Numbers': 'Bamidbar',
  'דברים': 'Devarim',
  'Deuteronomy': 'Devarim',

  // Neviim
  'יהושע': 'Yehoshua',
  'Joshua': 'Yehoshua',
  'שופטים': 'Shoftim',
  'Judges': 'Shoftim',
  'שמואל א': 'Shmuel I',
  'שמואל ב': 'Shmuel II',
  'שמואל בכג': 'Shmuel II',
  'מלכים א': 'Melachim I',
  'מלכים ב': 'Melachim II',
  'ישעיהו': 'Yeshayahu',
  'Isaiah': 'Yeshayahu',
  'ירמיהו': 'Yirmiyahu',
  'יחזקאל': 'Yechezkel',
  'Ezekiel': 'Yechezkel',
  'הושע': 'Hoshea',
  'יונה': 'Yonah',
  'מיכה': 'Michah',
  'נחום': 'Nachum',
  'זכריה': 'Zechariah',
  'מלאכי': 'Malachi',

  // Kesuvim
  'תהילים': 'Tehillim',
  'תהלים': 'Tehillim',
  'Psalms': 'Tehillim',
  'משלי': 'Mishlei',
  'Proverbs': 'Mishlei',
  'איוב': 'Iyov',
  'Job': 'Iyov',
  'שיר השירים': 'Shir Hashirim',
  'Song of Songs': 'Shir Hashirim',
  'רות': 'Rut',
  'Ruth': 'Rut',
  'איכה': 'Eichah',
  'קהלת': 'Kohelet',
  'Ecclesiastes': 'Kohelet',
  'אסתר': 'Esther',
  'דניאל': 'Daniel',
  'עזרא': 'Ezra',
  'נחמיה': 'Nechemiah',
  'Nehemiah': 'Nechemiah',
  'דברי הימים א': 'Divrei Hayamim I',
  'דברי הימים ב': 'Divrei Hayamim II',
};

function parseVerseReference(reference) {
  if (!reference || reference === 'No source' || reference === '?' || reference === '?') {
    return null;
  }

  const parts = reference.trim().split(/\s+/);

  if (parts.length >= 3) {
    const versePart = parts[parts.length - 1];
    const chapterPart = parts[parts.length - 2];
    const bookPart = parts.slice(0, parts.length - 2).join(' ');

    const chapter = hebrewNumbers[chapterPart] || parseInt(chapterPart);
    const verse = hebrewNumbers[versePart] || parseInt(versePart);
    const book = bookNameMap[bookPart];

    if (book && !isNaN(chapter) && !isNaN(verse)) {
      return { book, chapter, verse };
    }
  }

  console.warn(`Could not parse reference: "${reference}"`);
  return null;
}

// Read the input JSON (passed as argument or use default)
const inputFile = process.argv[2] || path.join(__dirname, 'preferred-verses-input.json');
const rawData = fs.readFileSync(inputFile, 'utf-8');
const data = JSON.parse(rawData);

const preferredVerses = [];
let successCount = 0;
let failCount = 0;

data.allPesukim.forEach(item => {
  const [letterCombo, [hebrewText, reference]] = Object.entries(item)[0];
  const [startLetter, endLetter] = letterCombo.split('-');

  const parsed = parseVerseReference(reference);

  if (parsed) {
    preferredVerses.push({
      startLetter,
      endLetter,
      ...parsed,
      text: hebrewText || undefined,
    });
    successCount++;
  } else {
    preferredVerses.push({
      startLetter,
      endLetter,
      book: '',
      chapter: 0,
      verse: 0,
      notes: reference === 'No source' ? 'No traditional source available' : 'Could not parse reference',
    });
    failCount++;
  }
});

console.log(`Parsed ${successCount} verses successfully, ${failCount} failed`);

// Generate TypeScript file
const tsCode = `/**
 * Preferred verses for the minhag of saying a pasuk for one's name
 * Based on traditional lists used in various communities
 *
 * Generated from traditional sources - do not edit manually
 */

export interface PreferredVerse {
  /** Starting letter of the name */
  startLetter: string;
  /** Ending letter of the name */
  endLetter: string;
  /** Book name (transliterated) */
  book: string;
  /** Chapter number */
  chapter: number;
  /** Verse number */
  verse: number;
  /** Hebrew text of the verse (if available) */
  text?: string;
  /** Notes or alternative information */
  notes?: string;
}

/**
 * Default/preferred verses for each letter combination
 * Total: ${preferredVerses.length} entries (${successCount} with valid references)
 */
export const preferredVerses: PreferredVerse[] = ${JSON.stringify(preferredVerses, null, 2)};

/**
 * Create a lookup key for a letter combination
 */
export function getPreferredVerseKey(startLetter: string, endLetter: string): string {
  return \`\${startLetter}-\${endLetter}\`;
}

/**
 * Lookup map for quick access to preferred verses
 */
export const preferredVersesMap = new Map<string, PreferredVerse>();

// Initialize the map
preferredVerses.forEach(verse => {
  if (verse.book) {
    const key = getPreferredVerseKey(verse.startLetter, verse.endLetter);
    preferredVersesMap.set(key, verse);
  }
});

/**
 * Get the preferred verse for a given letter combination
 */
export function getPreferredVerse(startLetter: string, endLetter: string): PreferredVerse | undefined {
  const key = getPreferredVerseKey(startLetter, endLetter);
  return preferredVersesMap.get(key);
}
`;

const outputFile = path.join(__dirname, '..', 'src', 'preferred-verses.ts');
fs.writeFileSync(outputFile, tsCode, 'utf-8');
console.log(`Written to ${outputFile}`);
