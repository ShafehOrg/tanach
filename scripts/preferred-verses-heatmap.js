#!/usr/bin/env node

/**
 * Displays a 2D heatmap grid of preferred verse coverage
 * for every start-letter / end-letter combination.
 *
 * Run:  node scripts/preferred-verses-heatmap.js
 */

const fs = require('fs');
const path = require('path');

// Parse the preferred verses data directly from the source text file
const raw = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'full-prefered-verse-list.txt'),
  'utf8'
);
const data = JSON.parse(raw);

// Build a set of all letter pairs that have a valid source
const filled = new Set();
for (const item of data.allPesukim) {
  const key = Object.keys(item)[0];
  const [text, ref] = item[key];
  if (text && ref && ref !== 'No source' && ref !== '?') {
    filled.add(key);
  }
}

// Letter lists
const startLetters = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');
const endLetters   = 'אבגדהוזחטיכךלםמןנסעףפץצקרשת'.split('');

// ANSI color helpers
const GREEN  = '\x1b[42m\x1b[30m';  // green bg, black text
const RED    = '\x1b[41m\x1b[37m';  // red bg, white text
const YELLOW = '\x1b[43m\x1b[30m';  // yellow bg (header)
const RESET  = '\x1b[0m';
const DIM    = '\x1b[2m';
const BOLD   = '\x1b[1m';

// Stats
let totalPairs = 0;
let filledPairs = 0;

// Header
console.log();
console.log(`${BOLD}Preferred Verse Coverage Heatmap${RESET}`);
console.log(`${GREEN} \u2588 ${RESET} = has verse    ${RED} \u2588 ${RESET} = no source`);
console.log();

// Column headers (end letters)
process.stdout.write('     ');
for (const e of endLetters) {
  process.stdout.write(` ${e}`);
}
console.log('   total');
process.stdout.write('    \u250C');
for (let i = 0; i < endLetters.length; i++) {
  process.stdout.write('\u2500\u2500');
}
console.log('\u2500\u2510');

// Rows
for (const s of startLetters) {
  process.stdout.write(` ${s}  \u2502`);
  let rowCount = 0;
  let rowTotal = 0;

  for (const e of endLetters) {
    const key = `${s}-${e}`;
    totalPairs++;
    rowTotal++;

    if (filled.has(key)) {
      process.stdout.write(`${GREEN} \u2588${RESET}`);
      filledPairs++;
      rowCount++;
    } else {
      process.stdout.write(`${DIM} \u00B7${RESET}`);
    }
  }

  // Row summary
  const pct = Math.round((rowCount / rowTotal) * 100);
  console.log(`\u2502 ${rowCount}/${rowTotal} (${pct}%)`);
}

// Bottom border
process.stdout.write('    \u2514');
for (let i = 0; i < endLetters.length; i++) {
  process.stdout.write('\u2500\u2500');
}
console.log('\u2500\u2518');

// Column totals
process.stdout.write('     ');
for (const e of endLetters) {
  let colCount = 0;
  for (const s of startLetters) {
    if (filled.has(`${s}-${e}`)) colCount++;
  }
  if (colCount === startLetters.length) {
    process.stdout.write(`${GREEN}${colCount < 10 ? ' ' : ''}${colCount}${RESET}`);
  } else if (colCount === 0) {
    process.stdout.write(`${RED} 0${RESET}`);
  } else {
    process.stdout.write(`${colCount < 10 ? ' ' : ''}${colCount}`);
  }
}
console.log();

// Summary
console.log();
const totalPct = Math.round((filledPairs / totalPairs) * 100);
console.log(`${BOLD}Total: ${filledPairs}/${totalPairs} pairs have a preferred verse (${totalPct}%)${RESET}`);
console.log(`${BOLD}Missing: ${totalPairs - filledPairs} pairs${RESET}`);
console.log();
