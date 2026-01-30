import { findPesukimByName } from '../src/index.js';
import { getPreferredVerse } from '../src/preferred-verses.js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const startLetters = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');
const endLetters = 'אבגדהוזחטיךלםןסעףפץקרשת'.split('');

const rows: string[] = [];

// Header row
rows.push(['start', 'end', 'count', 'has_preferred', 'preferred_book', 'preferred_ref'].join(','));

for (const s of startLetters) {
  for (const e of endLetters) {
    const matches = findPesukimByName(s, e);
    const pref = getPreferredVerse(s, e);
    rows.push([
      s,
      e,
      matches.length,
      pref ? 'yes' : 'no',
      pref ? pref.book : '',
      pref ? `${pref.book} ${pref.chapter}:${pref.verse}` : '',
    ].join(','));
  }
}

const outPath = join(__dirname, '..', 'preferred-verse-combos.csv');
writeFileSync(outPath, rows.join('\n') + '\n');
console.log(`Wrote ${rows.length - 1} rows to ${outPath}`);
