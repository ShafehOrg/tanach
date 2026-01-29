# Tanach API

![Node.js CI](https://github.com/sharshi/tanach-pkg/workflows/Node.js%20CI/badge.svg)

Modern TypeScript library for accessing the complete Hebrew Bible (Tanach) text.

## Features

- 📖 Complete Tanach text (Torah, Neviim, Kesuvim)
- 🚀 Modern ES modules with TypeScript support
- 📦 Optimized data format (25% smaller than original)
- 🔍 Type-safe API
- 🌐 Works in Node.js and browsers
- 📝 Full test coverage

## Installation

```bash
npm install @shafeh/tanach
```

## Usage

```typescript
import { tanach, getChapter, getBooks } from '@shafeh/tanach';

// Get a specific verse
const verse = tanach('Bereishit', 1, 1);
console.log(verse?.text); // בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ:
console.log(verse?.bookEnglish); // Genesis

// Get an entire chapter
const chapter = getChapter('Bereishit', 1);
console.log(chapter?.length); // 31 verses

// Get all available books
const books = getBooks();
console.log(books); // ['Bereishit', 'Shemot', ...]
```

## API

### `tanach(book: string, chapter: number, verse: number)`

Get a specific verse.

**Parameters:**
- `book` - Book name (transliterated Hebrew, e.g., "Bereishit")
- `chapter` - Chapter number
- `verse` - Verse number

**Returns:** `VerseResult | null`

### `getChapter(book: string, chapter: number)`

Get all verses in a chapter.

**Returns:** `VerseResult[] | null`

### `getBooks()`

Get all available book names.

**Returns:** `string[]`

### `getBookMeta(book: string)`

Get metadata for a specific book.

**Returns:** `BookMeta | null`

### `sections`

Array of the three main sections: `['Torah', 'Neviim', 'Kesuvim']`

### `torah()`, `neviim()`, `kesuvim()`

Helper functions that return section names.

## Types

```typescript
interface VerseResult {
  book: string;
  bookHebrew: string;
  bookEnglish: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BookMeta {
  he: string;      // Hebrew (בראשית)
  en: string;      // English (Genesis)
  heT: string;     // Transliterated (Bereishit)
}
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Watch mode for tests
npm run test:watch
```

## Publishing

### Automated Publishing (GitHub Actions)

The package is automatically published to npm when:

1. **Release is created**: Create a new release on GitHub, and the package will be automatically published
2. **Manual trigger**: Go to Actions → "Publish to npm" → Run workflow

### Prerequisites

Set up the `NPM_TOKEN` secret in your GitHub repository:

1. Generate an npm access token at https://www.npmjs.com/settings/[username]/tokens
2. Add it as a repository secret named `NPM_TOKEN`
3. Ensure the token has publish permissions

### Manual Publishing

```bash
# Bump version
npm version patch|minor|major

# Build and publish
npm run build
npm publish --access public
```

## CI/CD

The repository includes two GitHub Actions workflows:

- **CI** (`.github/workflows/ci.yml`): Runs tests on Node.js 18, 20, and 22 for all PRs and pushes to main
- **Publish** (`.github/workflows/npm-publish.yml`): Publishes package to npm on releases

## Data Format

The library uses an optimized compressed format that reduces file size by ~25% compared to the original flat array structure. Data is nested by book and chapter for efficient lookups.

## License

ISC
