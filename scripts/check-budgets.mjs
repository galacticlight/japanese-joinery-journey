// Prebuild sanity check: warns (never fails the build) when budget data disagree.
// Phase budgets are set per phase in phases.json; this compares them with tools.json and expenses.json.
import { readFileSync } from 'node:fs';
const read = (f) => JSON.parse(readFileSync(new URL(`../src/data/${f}`, import.meta.url)));
const phases = read('phases.json'), tools = read('tools.json'), expenses = read('expenses.json');
let warnings = 0;
const warn = (m) => { warnings++; console.warn(`⚠ budget check: ${m}`); };
const ids = new Set(phases.map((p) => p.id));
for (const t of tools) if (!ids.has(t.phase)) warn(`tool "${t.name}" has unknown phase "${t.phase}"`);
for (const e of expenses) if (!ids.has(e.phase)) warn(`expense "${e.item}" has unknown phase "${e.phase}"`);
for (const p of phases) {
  const toolCost = tools.filter((t) => t.phase === p.id && t.status === 'wanted').reduce((a, t) => a + t.price, 0);
  const spent = expenses.filter((e) => e.phase === p.id).reduce((a, e) => a + e.amount, 0);
  if (Math.round(toolCost) > p.budget) warn(`${p.id} "${p.name}": wanted tools cost $${toolCost.toFixed(2)} but budget is $${p.budget}`);
  if (spent > p.budget) warn(`${p.id} "${p.name}": spent $${spent.toFixed(2)} exceeds budget $${p.budget}`);
}
console.log(warnings ? `budget check: ${warnings} warning(s)` : 'budget check: OK');
