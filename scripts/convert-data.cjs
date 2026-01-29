#!/usr/bin/env node

/**
 * Script to convert the old tanach.js format to compressed modern format
 * Reduces file size by ~60-70% by eliminating repetitive data
 */

const fs = require('fs');
const path = require('path');

// Import the old data
const { text } = require('../tanach.cjs');

console.log(`Converting ${text.length} verses...`);

// Build compressed structure
const compressed = {};

text.forEach((verse) => {
  const bookKey = verse.seferHe;

  // Initialize book if it doesn't exist
  if (!compressed[bookKey]) {
    compressed[bookKey] = {
      meta: {
        he: verse.sefer,
        en: verse.seferEn,
        heT: verse.seferHe
      },
      chapters: {}
    };
  }

  const book = compressed[bookKey];
  const chapterNum = verse.perekNum;

  // Initialize chapter if it doesn't exist
  if (!book.chapters[chapterNum]) {
    book.chapters[chapterNum] = [];
  }

  // Add verse as compact array [verseNum, text]
  book.chapters[chapterNum].push([verse.pasuknum, verse.txt]);
});

// Sort verses within each chapter
Object.keys(compressed).forEach(bookKey => {
  const book = compressed[bookKey];
  Object.keys(book.chapters).forEach(chapterNum => {
    book.chapters[chapterNum].sort((a, b) => a[0] - b[0]);
  });
});

// Write the new compressed data
const outputPath = path.join(__dirname, '../src/data.ts');
const output = `/**
 * Compressed Tanach data
 * Format: { [bookName]: { meta: {...}, chapters: { [chapterNum]: [[verseNum, text], ...] } } }
 *
 * This format reduces file size by ~60% compared to the original flat array
 */

import type { TanachData } from './types.js';

export const data: TanachData = ${JSON.stringify(compressed, null, 2)};
`;

fs.writeFileSync(outputPath, output, 'utf-8');

const oldSize = fs.statSync(path.join(__dirname, '../tanach.js')).size;
const newSize = fs.statSync(outputPath).size;
const reduction = ((1 - newSize / oldSize) * 100).toFixed(1);

console.log(`✓ Conversion complete!`);
console.log(`  Old size: ${(oldSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`  New size: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`  Reduction: ${reduction}%`);
console.log(`  Books: ${Object.keys(compressed).length}`);
console.log(`  Output: ${outputPath}`);
