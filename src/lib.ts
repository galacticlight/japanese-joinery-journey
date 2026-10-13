import rawPhases from './data/phases.json';
import expenses from './data/expenses.json';
import tools from './data/tools.json';
/** Phases with estHours derived from the sum of their milestone hours (single source of truth). */
export const phases = rawPhases.map((p) => ({ ...p, estHours: p.milestones.reduce((a, m) => a + m.hours, 0) }));
export type Status = 'planned' | 'in-progress' | 'done';
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (p: string) => `${base}${p}`;
export const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: n % 1 ? 2 : 0 });
type Expense = { date: string; item: string; amount: number; phase: string };
export const allExpenses = expenses as Expense[];
export function stats() {
  const ms = phases.flatMap((p) => p.milestones);
  const done = ms.filter((m) => m.status === 'done');
  const weight = (m: { hours: number }) => m.hours;
  const total = ms.reduce((a, m) => a + weight(m), 0);
  const doneW = done.reduce((a, m) => a + weight(m), 0) + ms.filter((m) => m.status === 'in-progress').reduce((a, m) => a + weight(m) / 2, 0);
  const planned = phases.reduce((a, p) => a + p.budget, 0);
  const spent = allExpenses.reduce((a, e) => a + e.amount, 0);
  const estHours = phases.reduce((a, p) => a + p.estHours, 0);
  const starter = tools.filter((t) => t.starter).reduce((a, t) => a + t.price, 0);
  return { msCount: ms.length, doneCount: done.length, pct: Math.round((doneW / total) * 100), planned, spent, estHours, starter };
}
export function phaseStatus(p: (typeof phases)[number]): Status {
  const s = p.milestones.map((m) => m.status);
  if (s.every((x) => x === 'done')) return 'done';
  if (s.some((x) => x !== 'planned')) return 'in-progress';
  return 'planned';
}
export function spentBy(phaseId: string) { return allExpenses.filter((e) => e.phase === phaseId).reduce((a, e) => a + e.amount, 0); }
