/**
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
  /** Notes or alternative information */
  notes?: string;
}

/**
 * Default/preferred verses for each letter combination
 * Total: 22 entries (22 with valid references)
 */
export const preferredVerses: PreferredVerse[] = [
  {
    "startLetter": "א",
    "endLetter": "א",
    "book": "Tehillim",
    "chapter": 118,
    "verse": 25
  },
  {
    "startLetter": "א",
    "endLetter": "ב",
    "book": "Tehillim",
    "chapter": 44,
    "verse": 5
  },
  {
    "startLetter": "א",
    "endLetter": "ג",
    "book": "Tehillim",
    "chapter": 42,
    "verse": 5
  },
  {
    "startLetter": "א",
    "endLetter": "ד",
    "book": "Tehillim",
    "chapter": 45,
    "verse": 18
  },
  {
    "startLetter": "א",
    "endLetter": "ה",
    "book": "Tehillim",
    "chapter": 41,
    "verse": 2
  },
  {
    "startLetter": "א",
    "endLetter": "ו",
    "book": "Tehillim",
    "chapter": 146,
    "verse": 5
  },
  {
    "startLetter": "א",
    "endLetter": "ז",
    "book": "Shir Hashirim",
    "chapter": 8,
    "verse": 9
  },
  {
    "startLetter": "א",
    "endLetter": "ח",
    "book": "Tehillim",
    "chapter": 118,
    "verse": 27
  },
  {
    "startLetter": "א",
    "endLetter": "ט",
    "book": "Tehillim",
    "chapter": 62,
    "verse": 7
  },
  {
    "startLetter": "א",
    "endLetter": "י",
    "book": "Tehillim",
    "chapter": 5,
    "verse": 2
  },
  {
    "startLetter": "א",
    "endLetter": "ך",
    "book": "Tehillim",
    "chapter": 16,
    "verse": 2
  },
  {
    "startLetter": "א",
    "endLetter": "ל",
    "book": "Tehillim",
    "chapter": 68,
    "verse": 9
  },
  {
    "startLetter": "א",
    "endLetter": "ם",
    "book": "Nechemiah",
    "chapter": 9,
    "verse": 7
  },
  {
    "startLetter": "א",
    "endLetter": "ן",
    "book": "Tehillim",
    "chapter": 30,
    "verse": 9
  },
  {
    "startLetter": "א",
    "endLetter": "ס",
    "book": "Tehillim",
    "chapter": 27,
    "verse": 12
  },
  {
    "startLetter": "א",
    "endLetter": "ע",
    "book": "Tehillim",
    "chapter": 10,
    "verse": 6
  },
  {
    "startLetter": "א",
    "endLetter": "ף",
    "book": "Tehillim",
    "chapter": 85,
    "verse": 12
  },
  {
    "startLetter": "א",
    "endLetter": "ץ",
    "book": "Tehillim",
    "chapter": 33,
    "verse": 5
  },
  {
    "startLetter": "א",
    "endLetter": "ק",
    "book": "Tehillim",
    "chapter": 105,
    "verse": 9
  },
  {
    "startLetter": "א",
    "endLetter": "ר",
    "book": "Tehillim",
    "chapter": 20,
    "verse": 8
  },
  {
    "startLetter": "א",
    "endLetter": "ש",
    "book": "Tehillim",
    "chapter": 55,
    "verse": 15
  },
  {
    "startLetter": "א",
    "endLetter": "ת",
    "book": "Tehillim",
    "chapter": 106,
    "verse": 3
  }
];

/**
 * Create a lookup key for a letter combination
 */
export function getPreferredVerseKey(startLetter: string, endLetter: string): string {
  return `${startLetter}-${endLetter}`;
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
