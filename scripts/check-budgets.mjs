// Prebuild sanity check: warns (never fails the build) when budget data disagree.
// Base budgets live in phases.json; contingency = fixed `contingency`, or round(lumberEstimate × pct / 100)
// with pct = phase `contingencyPct` ?? site.json `contingencyPct` (mirrors contingencyFor in src/lib.ts).
import { readFileSync } from 'node:fs';
const read = (f) => JSON.parse(readFileSync(new URL(`../src/data/${f}`, import.meta.url)));
const site = read('site.json'), phases = read('phases.json'), tools = read('tools.json'), expenses = read('expenses.json');
const CATEGORIES = ['tool', 'lumber', 'shipping', 'tax', 'replacement', 'misc'];
let warnings = 0, notes = 0;
const warn = (m) => { warnings++; console.warn(`⚠ budget check: ${m}`); };
const note = (m) => { notes++; console.log(`ℹ budget note: ${m}`); };
const contingency = (p) => typeof p.contingency === 'number' ? p.contingency : p.lumberEstimate ? Math.round(p.lumberEstimate * (p.contingencyPct ?? site.contingencyPct ?? 25) / 100) : 0;
const buckets = [...phases.map((p) => ({ ...p, cont: contingency(p) })), { ...site.unplanned, cont: 0 }];
const ids = new Set(buckets.map((b) => b.id));
for (const t of tools) if (!ids.has(t.phase)) warn(`tool "${t.name}" has unknown phase "${t.phase}"`);
for (const e of expenses) {
  if (!ids.has(e.phase)) warn(`expense "${e.item}" has unknown phase "${e.phase}" (valid: ${[...ids].join(', ')})`);
  if (typeof e.amount !== 'number') warn(`expense "${e.item}" has a non-numeric amount`);
  if (e.category !== undefined && !CATEGORIES.includes(e.category)) warn(`expense "${e.item}" has unknown category "${e.category}" (valid: ${CATEGORIES.join(', ')})`);
}
for (const b of buckets) {
  const toolCost = tools.filter((t) => t.phase === b.id && t.status === 'wanted').reduce((a, t) => a + t.price, 0);
  const spent = expenses.filter((e) => e.phase === b.id).reduce((a, e) => a + e.amount, 0);
  if (Math.round(toolCost) > b.budget) warn(`${b.id} "${b.name}": wanted tools cost $${toolCost.toFixed(2)} but base budget is $${b.budget}`);
  if (spent > b.budget + b.cont) warn(`${b.id} "${b.name}": spent $${spent.toFixed(2)} exceeds base $${b.budget} + contingency $${b.cont}`);
  else if (spent > b.budget) note(`${b.id} "${b.name}": spent $${spent.toFixed(2)} is over the base budget $${b.budget} (within contingency)`);
}
console.log(warnings ? `budget check: ${warnings} warning(s)` : `budget check: OK${notes ? ` (${notes} note(s))` : ''}`);
