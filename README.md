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

## Develop

```bash
npm install      # Node 22.12+
npm run dev      # http://localhost:4321/japanese-joinery-journey/
npm run build    # outputs dist/
```

Prices were researched on 2026-10-13 from the linked stores; budgets for lumber/books are labelled estimates.
