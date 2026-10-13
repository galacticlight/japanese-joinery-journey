# 木組み — The Joinery Journey

A public roadmap of Galacticlight learning Japanese joinery from zero: milestones, budget, time captures, tools, a joints glossary and resources.

**Live:** https://galacticlight.github.io/japanese-joinery-journey/

Built with [Astro](https://astro.build) + TypeScript, no client framework, hand-drawn SVG charts. Deploys to GitHub Pages on every push to `main` (`.github/workflows/deploy.yml`).

## Updating content (no code needed)

All content lives in `src/data/` and `src/content/journal/`. Edit, commit, push — the site rebuilds automatically.

| What | File | How |
|---|---|---|
| Milestone status / hours | `src/data/phases.json` | Set a milestone's `"status"` to `"planned"`, `"in-progress"` or `"done"`. Phase hours are the sum of milestone `hours` (calculated, not stored). `npm run build` warns if tool costs or spending exceed a phase budget. |
| A purchase | `src/data/expenses.json` | Append `{"date":"2026-10-20","item":"Gyokucho ryoba","amount":37.90,"phase":"p1"}` |
| A tool you now own | `src/data/tools.json` | Change `"status": "wanted"` → `"owned"` (and log the expense above). |
| Journal / time capture | `src/content/journal/YYYY-MM-DD-slug.md` | Copy the Day 0 file. Front-matter: `title`, `date`, `hours`, `phase`, `photos: [{src: "/photos/2026-10-20-plane.jpg", alt: "First shaving"}]`. Put images in `public/photos/`. |
| Joints / resources | `src/data/joints.json`, `src/data/resources.json` | Append an object with the same fields. |

## Budget: logging expenses, the Unplanned bucket, and contingency

**Log an expense** — append one object to `src/data/expenses.json` (any phase, any time):

```json
{"date":"2026-10-20","item":"Gyokucho ryoba","amount":37.90,"phase":"p1","category":"tool"}
```

- `phase`: a phase id from `phases.json` (`p0`–`p6`) or `"unplanned"`.
- `category` (optional): `tool`, `lumber`, `shipping`, `tax`, `replacement` or `misc`.

**Misc / Unplanned bucket** — use `"phase": "unplanned"` for shipping, tax, replacements and anything that doesn't belong to a phase. It's configured in `src/data/site.json` → `unplanned` (`budget` is $0 by default; raise it if you want an allowance). It has no milestones, isn't on the roadmap, and doesn't affect progress or total hours.

**Contingency (scrap allowance)** — tracked separately from each phase's base `budget`:

- A phase gets contingency only if it has a `lumberEstimate` (lumber/material dollars inside its budget).
- Contingency = round(`lumberEstimate` × `contingencyPct` / 100). The default `contingencyPct` is in `site.json` (25); override per phase with `"contingencyPct": 30`, or set a fixed `"contingency": 50`.
- Budget page: remaining = base + contingency − spent, with status *On budget*, *Using contingency* or *Over by $X*.

`npm run build` runs `scripts/check-budgets.mjs` first. It warns (without failing the build) about unknown phase ids or categories, wanted tools costing more than a phase's base budget, and spending above base + contingency; it prints a softer note when spending is over the base budget but still within contingency.

## Develop

```bash
npm install      # Node 22.12+
npm run dev      # http://localhost:4321/japanese-joinery-journey/
npm run build    # outputs dist/
```

Prices were researched on 2026-10-13 from the linked stores; budgets for lumber/books are labelled estimates.
