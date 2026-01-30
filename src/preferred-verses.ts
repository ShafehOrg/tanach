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
  /** Hebrew text of the verse (if available) */
  text?: string;
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
    "verse": 25,
    "text": "אָנָּא יְהֹוָה הוֹשִׁיעָה נָּא אָנָּא יְהֹוָה הַצְלִיחָה נָּא"
  },
  {
    "startLetter": "א",
    "endLetter": "ב",
    "book": "Tehillim",
    "chapter": 44,
    "verse": 5,
    "text": "אַתָּה הוּא מַלְכִּי אֱלֹהִים צַוֵּה יְשׁוּעוֹת יַעֲקֹב"
  },
  {
    "startLetter": "א",
    "endLetter": "ג",
    "book": "Tehillim",
    "chapter": 42,
    "verse": 5,
    "text": "אֵלֶּה אֶזְכְּרָה וְאֶשְׁפְּכָה עָלַי נַפְשִׁי כִּי אֶעֱבֹר בַּסָּךְ אֶדַּדֵּם עַד בֵּית אֱלֹהִים בְּקוֹל רִנָּה וְתוֹדָה הָמוֹן חוֹגֵג"
  },
  {
    "startLetter": "א",
    "endLetter": "ד",
    "book": "Tehillim",
    "chapter": 45,
    "verse": 18,
    "text": "אַזְכִּירָה שִׁמְךָ בְּכָל דֹּר וָדֹר עַל כֵּן עַמִּים יְהוֹדֻךָ לְעֹלָם וָעֶד"
  },
  {
    "startLetter": "א",
    "endLetter": "ה",
    "book": "Tehillim",
    "chapter": 41,
    "verse": 2,
    "text": "אַשְׁרֵי מַשְׂכִּיל אֶל דָּל בְּיוֹם רָעָה יְמַלְּטֵהוּ יְהוָה"
  },
  {
    "startLetter": "א",
    "endLetter": "ו",
    "book": "Tehillim",
    "chapter": 146,
    "verse": 5,
    "text": "אַשְׁרֵי שֶׁאֵל יַעֲקֹב בְּעֶזְרוֹ שִׂבְרוֹ עַל יְהֹוָה אֱלֹהָיו"
  },
  {
    "startLetter": "א",
    "endLetter": "ז",
    "book": "Shir Hashirim",
    "chapter": 8,
    "verse": 9,
    "text": "אִם חוֹמָה הִיא נִבְנֶה עָלֶיהָ טִירַת כָּסֶף וְאִם דֶּלֶת הִיא נָצוּר עָלֶיהָ לוּחַ אָרֶז"
  },
  {
    "startLetter": "א",
    "endLetter": "ח",
    "book": "Tehillim",
    "chapter": 118,
    "verse": 27,
    "text": "אֵל יְהֹוָה וַיָּאֶר לָנוּ אִסְרוּ חַג בַּעֲבֹתִים עַד קַרְנוֹת הַמִּזְבֵּחַ"
  },
  {
    "startLetter": "א",
    "endLetter": "ט",
    "book": "Tehillim",
    "chapter": 62,
    "verse": 7,
    "text": "אַךְ הוּא צוּרִי וִישׁוּעָתִי מִשְׂגַּבִּי לֹא אֶמּוֹט רַבָּה"
  },
  {
    "startLetter": "א",
    "endLetter": "י",
    "book": "Tehillim",
    "chapter": 5,
    "verse": 2,
    "text": "אֲמָרַי הַאֲזִינָה יְהוָה בִּינָה הֲגִיגִי"
  },
  {
    "startLetter": "א",
    "endLetter": "ך",
    "book": "Tehillim",
    "chapter": 16,
    "verse": 2,
    "text": "אָמַרְתְּ לַיהוָה אֲדֹנָי אָתָּה טוֹבָתִי בַּל עָלֶיךָ"
  },
  {
    "startLetter": "א",
    "endLetter": "ל",
    "book": "Tehillim",
    "chapter": 68,
    "verse": 9,
    "text": "אֶרֶץ רָעָשָׁה אַף שָׁמַיִם נָטְפוּ מִפְּנֵי אֱלֹהִים זֶה סִינַי מִפְּנֵי אֱלֹהִים אֱלֹהֵי יִשְׂרָאֵל"
  },
  {
    "startLetter": "א",
    "endLetter": "ם",
    "book": "Nechemiah",
    "chapter": 9,
    "verse": 7,
    "text": "אַתָּה הוּא יְהוָה הָאֱלֹהִים אֲשֶׁר בָּחַרְתָּ בְּאַבְרָם וְהוֹצֵאתוֹ מֵאוּר כַּשְׂדִּים וְשַׂמְתָּ  שְּׁמוֹ אַבְרָהָם"
  },
  {
    "startLetter": "א",
    "endLetter": "ן",
    "book": "Tehillim",
    "chapter": 30,
    "verse": 9,
    "text": "אֵלֶיךָ יְהֹוָה אֶקְרָא וְאֶל אֲדֹנָי אֶתְחַנָּן"
  },
  {
    "startLetter": "א",
    "endLetter": "ס",
    "book": "Tehillim",
    "chapter": 27,
    "verse": 12,
    "text": "אַל תִּתְּנֵנִי בְּנֶפֶשׁ צָרָי כִּי קָמוּ בִי עֵדֵי שֶׁקֶר וִיפֵחַ חָמָס"
  },
  {
    "startLetter": "א",
    "endLetter": "ע",
    "book": "Tehillim",
    "chapter": 10,
    "verse": 6,
    "text": "אָמַר בְּלִבּוֹ בַּל אֶמּוֹט לְדֹר וָדֹר אֲשֶׁר לֹא בְרָע"
  },
  {
    "startLetter": "א",
    "endLetter": "ף",
    "book": "Tehillim",
    "chapter": 85,
    "verse": 12,
    "text": "אֱמֶת מֵאֶרֶץ תִּצְמָח וְצֶדֶק מִשָּׁמַיִם נִשְׁקָף"
  },
  {
    "startLetter": "א",
    "endLetter": "ץ",
    "book": "Tehillim",
    "chapter": 33,
    "verse": 5,
    "text": "אֹהֵב צְדָקָה וּמִשְׁפָּט חֶסֶד יְהֹוָה מָלְאָה הָאָרֶץ"
  },
  {
    "startLetter": "א",
    "endLetter": "ק",
    "book": "Tehillim",
    "chapter": 105,
    "verse": 9,
    "text": "אֲשֶׁר כָּרַת אֶת אַבְרָהָם וּשְׁבוּעָתוֹ לְיִשְׂחָק"
  },
  {
    "startLetter": "א",
    "endLetter": "ר",
    "book": "Tehillim",
    "chapter": 20,
    "verse": 8,
    "text": "אֵלֶּה בָרֶכֶב וְאֵלֶּה בַסּוּסִים וַאֲנַחְנוּ בְּשֵׁם יְהֹוָה אֱלֹהֵינוּ נַזְכִּיר"
  },
  {
    "startLetter": "א",
    "endLetter": "ש",
    "book": "Tehillim",
    "chapter": 55,
    "verse": 15,
    "text": "אֲשֶׁר יַחְדָּו נַמְתִּיק סוֹד בְּבֵית אֱלֹהִים נְהַלֵּךְ בְּרָגֶשׁ"
  },
  {
    "startLetter": "א",
    "endLetter": "ת",
    "book": "Tehillim",
    "chapter": 106,
    "verse": 3,
    "text": "אַשְׁרֵי שֹׁמְרֵי מִשְׁפָּט עֹשֵׂה צְדָקָה בְכָל עֵת"
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

/**
 * Normalize a Hebrew letter by converting final forms to regular forms
 */
export function normalizeHebrewLetter(letter: string): string {
  const finalToRegularMap: Record<string, string> = {
    'ך': 'כ',
    'ם': 'מ',
    'ן': 'נ',
    'ף': 'פ',
    'ץ': 'צ'
  };

  return finalToRegularMap[letter] || letter;
}
