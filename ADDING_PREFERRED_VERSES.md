# Adding More Preferred Verses

This document explains how to add the complete set of preferred verses to the library.

## Current Status

The library currently has **22 letter combinations** with preferred verses as a proof-of-concept. The system is ready to accept the complete dataset of all Hebrew letter combinations (22 × 22 = 484 possible combinations).

## How to Add the Complete Dataset

### Step 1: Prepare the JSON Data

Edit `scripts/preferred-verses-input.json` with the complete list of preferred verses. The format should be:

```json
{
  "allPesukim": [
    {
      "letter-combo": ["Hebrew verse text", "Book reference"]
    }
  ]
}
```

**Example:**
```json
{
  "allPesukim": [
    {
      "א-א": ["אָנָּא יְהֹוָה הוֹשִׁיעָה נָּא", "תהילים קיח כה"]
    },
    {
      "א-ב": ["אַתָּה הוּא מַלְכִּי אֱלֹהִים", "Psalms 44 5"]
    },
    {
      "ב-ב": ["בִּנְדָבָה אֶזְבְּחָה לָּךְ", "תהילים נד ח"]
    }
  ]
}
```

### Supported Reference Formats

The parser automatically handles multiple formats:

1. **Hebrew Format**: `"תהילים קיח כה"` (Book Chapter Verse in Hebrew)
2. **English Format**: `"Psalms 118 25"` (Book Chapter Verse in English)
3. **No Source**: `"No source"` (when no traditional verse exists)

### Supported Book Names

**Torah:**
- Hebrew: בראשית, שמות, ויקרא, במדבר, דברים
- English: Genesis, Exodus, Leviticus, Numbers, Deuteronomy
- Library: Bereishit, Shemot, Vayikra, Bamidbar, Devarim

**Neviim (Prophets):**
- Hebrew: יהושע, שופטים, שמואל א/ב, מלכים א/ב, ישעיהו, ירמיהו, יחזקאל, הושע, יונה, מיכה, נחום, זכריה, מלאכי
- English: Joshua, Judges, Isaiah, Ezekiel, etc.
- Library: Yehoshua, Shoftim, Shmuel I/II, Melachim I/II, Yeshayahu, Yirmiyahu, Yechezkel, Hoshea, Yonah, Michah, Nachum, Zechariah, Malachi

**Kesuvim (Writings):**
- Hebrew: תהילים, משלי, איוב, שיר השירים, רות, איכה, קהלת, אסתר, דניאל, עזרא, נחמיה, דברי הימים א/ב
- English: Psalms, Proverbs, Job, Song of Songs, Ruth, Lamentations, Ecclesiastes, Esther, Daniel, Ezra, Nehemiah, Chronicles I/II
- Library: Tehillim, Mishlei, Iyov, Shir Hashirim, Rut, Eichah, Kohelet, Esther, Daniel, Ezra, Nechemiah, Divrei Hayamim I/II

### Hebrew Number Support

The parser automatically converts Hebrew numbers (gematria) to Arabic:
- א = 1, ב = 2, ... י = 10, יא = 11, ... כ = 20, ... ק = 100, קיח = 118, etc.

### Step 2: Run the Processing Script

After updating the JSON file:

```bash
node scripts/process-preferred-verses.cjs
```

This will:
1. Parse all verse references
2. Convert Hebrew numbers to Arabic
3. Map Hebrew/English book names to library format
4. Generate `src/preferred-verses.ts` with TypeScript definitions
5. Report how many verses were successfully parsed

### Step 3: Rebuild and Test

```bash
npm run build
npm test
```

### Step 4: Verify the Results

The generated `src/preferred-verses.ts` file will contain:
- TypeScript type definitions
- Array of all preferred verses
- Map for O(1) lookups
- Helper functions for accessing preferred verses

## Usage After Adding Data

Once the complete dataset is added, users can:

```typescript
import { getPreferredPasukForName, findPesukimByName } from '@shafeh/tanach';

// Get the traditional verse for any Hebrew name
const verse = getPreferredPasukForName("מ", "ה"); // For "Moshe"
if (verse) {
  console.log(verse.text);
  console.log(`${verse.book} ${verse.chapter}:${verse.verse}`);
}

// Search for all options with preferred verse marked
const allOptions = findPesukimByName("ד", "ד"); // For "David"
// Preferred verse is automatically first in the array
console.log(allOptions[0].preferred); // true
```

## Data Quality Notes

- Ensure all book names are spelled correctly
- Hebrew numbers must use proper gematria format
- Verses that don't exist in the Tanach will be skipped with a warning
- Missing sources can use "No source" as the reference
- Always test with a small sample first before adding the complete dataset

## Sources for Preferred Verses

Traditional lists can be found in:
- Siddur of R' Hirz (1560)
- Kitzur Shelah
- Various Chabad publications
- Community minhagim books
- Online resources (see PASUK_RESEARCH.md for links)

## Questions or Issues

If you encounter parsing errors:
1. Check the console output when running the processing script
2. Verify book names match the supported formats
3. Ensure Hebrew numbers are in correct gematria format
4. Check that chapter/verse numbers exist in the actual Tanach data

The system is designed to be forgiving - if a verse can't be parsed, it will be noted but won't break the build.
