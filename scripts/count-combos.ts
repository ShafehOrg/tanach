import { findPesukimByName } from '../src/index.js';

const startLetters = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');
const endLetters = 'אבגדהוזחטיךלםןסעףפץקרשת'.split('');

const results: {combo: string; count: number}[] = [];

for (const s of startLetters) {
  for (const e of endLetters) {
    const matches = findPesukimByName(s, e);
    results.push({ combo: s + '-' + e, count: matches.length });
  }
}

results.sort((a, b) => b.count - a.count);

console.log('Top 25 letter combos by number of matching verses in Tanach:');
console.log('─'.repeat(50));
for (let i = 0; i < 25; i++) {
  const r = results[i];
  const bar = '█'.repeat(Math.round(r.count / 10));
  console.log(`  ${String(i+1).padStart(2)}. ${r.combo}  ${String(r.count).padStart(5)} verses  ${bar}`);
}

console.log();
console.log('Bottom 10 (fewest matches):');
console.log('─'.repeat(50));
for (let i = results.length - 10; i < results.length; i++) {
  const r = results[i];
  console.log(`      ${r.combo}  ${String(r.count).padStart(5)} verses`);
}

const total = results.reduce((sum, r) => sum + r.count, 0);
console.log();
console.log(`Total combos: ${results.length}`);
console.log(`Total matching verses across all combos: ${total}`);
console.log(`Average per combo: ${Math.round(total / results.length)}`);
