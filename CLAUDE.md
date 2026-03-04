# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

**Run locally:**
```bash
python3 -m http.server 8000
# Access at http://localhost:8000
```

No build process, no package manager. All files are served as-is.

## Architecture

This is a static site with no build step — vanilla JavaScript ES6 modules, HTML5, and Tailwind CSS (via CDN). It consists of four pages:

| Page | Path | Purpose |
|------|------|---------|
| Scenario Calculator | `/index.html` | Main tool: multi-category vendor cost savings modeling |
| Onboarding Flow | `/onboarding/index.html` | 4-step wizard for users ready to engage |
| FICA Calculator | `/payroll-savings/index.html` | Payroll tax savings estimator |
| Checklist | `/checklist/index.html` | Printable vendor review checklist |

### JavaScript Modules (`src/`)

- **`main.js`** — Scenario calculator: URL state management, chart/table rendering, category management
- **`calculations.js`** — `computeCategoryCumulative()`: calculates low/median/high savings per category
- **`charts.js`** — Chart.js wrappers: cumulative line chart and monthly stacked bar chart
- **`ui.js`** — HTML generators for data tables, tooltips, formatters
- **`pdf.js`** — PDF export (lazy-loads html2pdf.js on demand)
- **`constants.js`** — Default state, color palette (navy blue), USD formatter, Lambda API URL
- **`onboarding.js`** — 4-step form wizard with validation and Lambda submission
- **`payroll-savings.js`** — Slider-driven FICA calculator and form submission

### State Management

The scenario calculator stores all state in the URL query string (`?state=...` as URL-encoded JSON). This makes scenarios shareable and bookmarkable with no backend. The onboarding page receives selected categories via `?data=...`.

### Backend

Form submissions (onboarding and FICA) POST JSON to an AWS Lambda function URL defined in `src/constants.js`. The Lambda accepts all form fields as-is.

### External CDN Dependencies

- Tailwind CSS 2.2.19
- Chart.js (data visualization)
- html2pdf.js 0.9.3 (lazy-loaded on PDF export)
- Google Fonts (Libre Franklin)

## Product Context

The tool is for accountants and CFOs evaluating vendor cost optimization. The tone is neutral and analytical — no sales language, urgency, or guarantees. Default savings rate is 14% (±10% range). The onboarding flow captures contact info only after the user has already modeled their scenario.
