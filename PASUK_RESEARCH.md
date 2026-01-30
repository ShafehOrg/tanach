# Research: Pasuk for Names in Shemona Esre

This document contains research and references used to implement the verse search features for finding personal pesukim based on Hebrew name letters.

## The Custom (Minhag)

It is an ancient and established Jewish custom for a person to recite a pasuk (biblical verse) from Tanach which begins with the first letter of their name and ends with the last letter of their name. This verse is recited at the end of the Shemoneh Esrei (Amidah prayer), before the second recitation of "Yihyu Leratzon."

### Key Points

- The verse should **begin** with the **first letter** of the person's name
- The verse should **end** with the **last letter** of the person's name
- It is recited **before the second Yihyu Leratzon** at the conclusion of the Amidah
- People with **multiple names** should say one pasuk for each name

### Historical Origins

The earliest reference to this practice is in **Siddur of R' Hirz** (Tihingen, 1560), a compilation of commentary and instructions for the prayers by Rabbi Naphtali Hirz Treves, chazzan (cantor) of Frankfurt am Main.

The **Kitzur Shelah** specifies the exact point in the prayer when this verse should be said: at the conclusion of the Amidah, before saying "Yehiyu l'ratzon."

In a letter written in **1948**, the Lubavitcher Rebbe, Rabbi Menachem M. Schneersohn, confirmed that this is the **Chabad custom** as well.

### The Reason

The spiritual reason for this custom is profound. According to tradition, when a person passes away, they may forget their name. The regular recitation of this verse helps one remember their name and is said to help save the soul from Gehinnom (purgatory).

As **Rashi** comments on the verse "The voice of the Lord calls out to the city, it is wise to recognize Your name..." (Micha 6:9):

> "From here we learn that whoever recites a verse each day that begins and ends [with the same letters] that one's name begins and ends with will be saved from Gehinnom."

## Technical Implementation Notes

### Hebrew Letter Considerations

1. **Final Forms (Sofit Letters)**
   - Hebrew has 5 letters with final forms: כ/ך, מ/ם, נ/ן, פ/ף, צ/ץ
   - When searching for end letters, both regular and final forms must be checked
   - For example, if searching for מ at the end, both מ and ם should match
   - Final forms **never appear** at the beginning of words

2. **Nekudot (Vowel Points) and Cantillation Marks**
   - Biblical text includes vowel points (nekudot) like ְ (shva), ַ (patach), etc.
   - Cantillation marks (teamim) for Torah reading are also present
   - These diacritical marks must be stripped to find the base Hebrew letters
   - Unicode range for Hebrew letters: U+05D0 to U+05EA

3. **Letter Normalization**
   - When comparing letters, final forms should be normalized to regular forms for consistency
   - This allows users to search using either form and get correct results

### Search Strategies

1. **By Starting Letter Only**
   - Useful for exploring options
   - Can limit by specific books (e.g., only search Tehillim/Psalms)
   - Can limit maximum results for performance

2. **By Starting and Ending Letters**
   - The primary use case for finding verses for names
   - Handles both regular and final forms automatically
   - Example: For "דוד" (David), search for ד...ד
   - Example: For "אברהם" (Avraham), search for א...ם

3. **Book Filtering**
   - **Tehillim (Psalms)**: Often preferred for personal verses due to their devotional nature
   - **Torah**: The five books of Moses may be preferred by some
   - **Full Tanach**: Search all 39 books for maximum options

### Psalm 119 - A Special Case

Psalm 119 is the longest chapter in the Bible and features a unique alphabetic acrostic structure:
- Organized by Hebrew letters (aleph through tav)
- Each letter section has 8 verses
- All 8 verses in each section start with that letter
- This makes Psalm 119 an excellent resource for finding verses

## Future Enhancement Ideas

### 1. Common Names Database
- Pre-compute and cache common Hebrew names with their corresponding verses
- Include traditional/popular choices for each name
- Provide metadata about why certain verses are preferred

### 2. Verse Quality Metrics
- **Length**: Shorter verses may be easier to memorize
- **Familiarity**: Track how well-known a verse is
- **Meaning**: Verses with positive/relevant meanings for prayer
- **Source preference**: Tehillim often preferred over other books

### 3. Multiple Name Handling
- Allow searching for multiple names at once
- Return combined results for people with multiple Hebrew names
- Handle both Ashkenazi and Sephardi name traditions

### 4. Transliteration Support
- Accept transliterated Hebrew (e.g., "David" → דוד)
- Automatic conversion to Hebrew characters
- Handle common spelling variations

### 5. Verse Recommendations
- Suggest verses based on meaning and appropriateness
- Flag verses that are traditionally used for specific names
- Provide context about why certain verses are chosen

### 6. Audio/Pronunciation
- Add audio recordings of verse pronunciation
- Help users learn their personal verse
- Include cantillation (trope) for verses

### 7. Print-Friendly Format
- Generate pocket cards with personal verses
- Create downloadable prayer cards
- Support multiple languages (Hebrew, English, transliteration)

### 8. Advanced Search Options
- Search by middle letters as well
- Find verses with specific words or themes
- Filter by verse length (min/max words)
- Search within specific books or ranges

### 9. Historical/Traditional Lists
- Include traditional lists used by different communities
- Document which verses are commonly used for which names
- Preserve minhagim (customs) from different traditions

### 10. Performance Optimizations
- Index verses by starting letter for faster lookups
- Cache frequently requested name combinations
- Implement lazy loading for large result sets
- Add search result pagination

## Research Sources

### Primary Sources
- [What is the source for saying a Pasuk at the end of Shemoneh Esrei? - Shulchanaruchharav.com](https://shulchanaruchharav.com/halacha/what-is-the-source-for-saying-a-pasuk-at-the-end-of-shemoneh-esrei/)
- [Minhag to say a Passuk that corresponds with one's name at the conclusion of Shemone Esrei - AskTheRav](https://asktherav.com/6283-minhag-to-say-a-passuk-that-corresponds-with-ones-name-at-the-conclusion-of-shemone-esrei/)
- [Verses For People's Names - Chabad.org](https://www.chabad.org/library/article_cdo/aid/5307596/jewish/Verses-For-Peoples-Names.htm)
- [A Verse for Your Name - Dalet Amot of Halacha - OU Torah](https://outorah.org/p/64670/)

### Additional References
- [Names, Verses, and Flaming Hot Rods - Chabad.org](https://www.chabad.org/library/article_cdo/aid/2451435/jewish/Names-Verses-and-Flaming-Hot-Rods.htm)
- [Saying two Pesukim at the end of Shemoneh Esrei if one has two names - Shulchanaruchharav.com](https://shulchanaruchharav.com/halacha/saying-two-pesukim-at-the-end-of-shemoneh-esrei-if-one-has-two-names/)
- [Pasuk for name - The Yeshiva World](https://www.theyeshivaworld.com/coffeeroom/topic/pasuk-for-name)

### Hebrew Alphabet Resources
- [Hebrew Alphabet (Aleph-Bet) - Jewish Virtual Library](https://www.jewishvirtuallibrary.org/the-hebrew-alphabet-aleph-bet)
- [Hebrew Alphabet - Wikipedia](https://en.wikipedia.org/wiki/Hebrew_alphabet)
- [Hebrew Alphabet - Biblical Hebrew](https://biblicalhebrew.org/aleph-bet)
- [Psalm 119 - ALEPH (Hebrew Alphabet) - God's Growing Garden](https://www.godsgrowinggarden.com/2019/06/psalm-119-aleph-hebrew-alphabet.html)

### Special Letter Information
- [Bet (Vet) - The second letter of the Hebrew alphabet - Chabad.org](https://www.chabad.org/library/article_cdo/aid/137074/jewish/Bet-Vet.htm)
- [Hebrew Letters and Their Meanings - Betemunah](https://www.betemunah.org/letters.html)

## Implementation

### Phase 1 (January 30, 2026)
- Basic letter search functionality (`findPesukimByStartingLetter`, `findPesukimByName`)
- Hebrew letter extraction and normalization
- Handling of final forms (sofit letters)
- Comprehensive test coverage

### Phase 2 (January 30, 2026)
- **Preferred Verses System**: Integration of traditional/preferred verses from established lists
- **Automatic Marking**: Search results automatically identify preferred verses with `preferred: true`
- **Smart Sorting**: Preferred verses are automatically sorted first in results
- **Direct Access**: `getPreferredPasukForName()` function for quick access to traditional choices
- **Extensible Data**: JSON-based system allows easy addition of new preferred verses
- **Community Sourcing**: Initial dataset includes verses from traditional Chabad and other community sources

### Current Status
- **22 letter combinations** with preferred verses (sample dataset)
- Ready for expansion to complete aleph-bet (484 possible combinations)
- Parsing system handles both Hebrew and English book references
- Supports notes and alternative information for special cases

### Adding More Preferred Verses

To extend the preferred verses database:

1. Edit `scripts/preferred-verses-input.json` to add new letter combinations
2. Use format: `"א-א": "Book chapter verse"` (reference only, no verse text)
3. Run `node scripts/process-preferred-verses.cjs` to regenerate the TypeScript data
4. The system automatically parses Hebrew numbers and book names
5. Verse text is fetched from the tanach data automatically

Example:
```json
{
  "allPesukim": {
    "א-א": "תהילים קיח כה",
    "ב-ב": "Psalms 54 8"
  }
}
```

## Implementation Date

This feature was initially implemented on January 30, 2026, with preferred verses system added the same day.

## License

This research document is provided for educational purposes as part of the @shafeh/tanach project (ISC License).
