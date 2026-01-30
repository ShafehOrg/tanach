/**
 * Script to split data.ts into per-book JSON files.
 * These files can be served as static assets and fetched at runtime
 * by the dynamic entry point, avoiding bundling the full 6+ MB dataset.
 *
 * Usage: npx tsx scripts/generate-book-data.ts
 *
 * Output: dist/books/<bookName>.json for each of the 24 books
 */
import { data } from '../src/data.js';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const booksDir = resolve(__dirname, '../dist/books');

mkdirSync(booksDir, { recursive: true });

const bookNames: string[] = [];

for (const [bookName, bookData] of Object.entries(data)) {
  const outputPath = resolve(booksDir, `${bookName}.json`);
  writeFileSync(outputPath, JSON.stringify(bookData), 'utf-8');

  const stats = JSON.stringify(bookData).length;
  console.log(`  ${bookName}.json - ${(stats / 1024).toFixed(1)} KB`);
  bookNames.push(bookName);
}

// Write a manifest file listing all books
const manifestPath = resolve(booksDir, '_manifest.json');
writeFileSync(manifestPath, JSON.stringify(bookNames), 'utf-8');

console.log(`\nGenerated ${bookNames.length} book files + manifest in dist/books/`);
