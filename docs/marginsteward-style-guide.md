# Margin Steward — Design & Style Guide

## Philosophy

Typography carries hierarchy. Whitespace carries structure. Color carries
meaning. Nothing decorates for its own sake.

The site should feel like a well-made reference document — not a product
landing page, not a SaaS dashboard. A smart reader should be able to orient
themselves immediately without being guided by visual noise.

---

## Typography

### Typefaces

**Libre Franklin** — primary typeface for all prose, headings, navigation,
labels, and UI copy. Load via Google Fonts. Use the full weight range.

**DM Mono** — secondary typeface for financial figures, calculator outputs,
the three-number hero, and table data. Load via Google Fonts.

### Type Scale

| Role | Face | Weight | Size | Line Height | Color |
|---|---|---|---|---|---|
| H1 | Libre Franklin | Bold 700 | 32px | 1.25 | --ink |
| H2 | Libre Franklin | SemiBold 600 | 22px | 1.3 | --ink |
| H3 | Libre Franklin | Medium 500 | 18px | 1.4 | --ink |
| Body | Libre Franklin | Regular 400 | 16px | 1.7 | --ink |
| Secondary | Libre Franklin | Regular 400 | 14px | 1.6 | --grey-500 |
| Nav links | Libre Franklin | Medium 500 | 13px | 1 | --grey-500 |
| Labels | Libre Franklin | Medium 500 | 13px | 1.4 | --grey-500 |
| Fine print | Libre Franklin | Light 300 | 12px | 1.5 | --grey-500 |
| Financial figures | DM Mono | Regular 400 | inherit | inherit | contextual |
| Hero numbers | DM Mono | Regular 400 | 40px | 1 | --ink |
| Hero labels | Libre Franklin | Regular 400 | 13px | 1.4 | --grey-500 |

### Wordmark

```
font-family: 'Libre Franklin', sans-serif;
font-weight: 500;
font-size: 12px;
letter-spacing: 0.2em;
text-transform: uppercase;
```

Light mode color: --wordmark-color (#1A3F5F)
Dark mode color: --wordmark-color (#EAF0F7)

The wordmark uses a dedicated token rather than `--blue-700` directly,
because `--blue-700` inverts in dark mode (see nav token section below).

---

## Color Palette

### CSS Custom Properties

```css
:root {
  /* Primary blues */
  --blue-50:  #EAF0F7;
  --blue-100: #C8D8EB;
  --blue-200: #90B3D1;
  --blue-300: #5A8FB8;
  --blue-500: #2A6496;
  --blue-700: #1A3F5F;
  --blue-900: #0F2233;

  /* Neutrals */
  --ink:       #2E2E2E;
  --grey-500:  #4A4F55;
  --grey-100:  #F4F5F6;

  /* Financial tokens */
  --positive:  #3A7D5A;
  --negative:  #8B3A3A;
  --neutral:   #5A6472;

  /* Data */
  --data-ink:  #1A3F5F;

  /* Surfaces */
  --bg-page:   #F3F4F6;
  --bg-card:   #FFFFFF;

  /* Nav tokens — dedicated to avoid inversion in dark mode */
  --bg-nav:               #FFFFFF;
  --wordmark-color:       #1A3F5F;
  --nav-link-color:       #4A4F55;
  --nav-link-hover-color: #2A6496;

  /* Borders */
  --border-subtle:  #EAF0F7;
  --border-default: #C8D8EB;
}
```

### Dark Mode Properties

The `--blue-*` palette variables invert in dark mode (e.g. `--blue-900`
becomes the lightest value). This makes them unsuitable as direct nav
color references. The nav uses dedicated tokens that hold correct hex
values in each mode.

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Surfaces */
    --bg-page:  #0F2233;
    --bg-card:  #1A3F5F;

    /* Text */
    --ink:      #EAF0F7;
    --grey-500: #90B3D1;

    /* Borders */
    --border-subtle:  #1A3F5F;
    --border-default: #2A6496;

    /* Blues invert for legibility */
    --blue-50:  #0F2233;
    --blue-100: #1A3F5F;
    --blue-700: #C8D8EB;
    --blue-900: #EAF0F7;

    /* Financial tokens — slightly lighter for dark surfaces */
    --positive: #5AAF82;
    --negative: #B85A5A;
    --neutral:  #8A9AAA;

    /* Nav tokens — hardcoded hex, not aliases to blue-* vars */
    --bg-nav:               #0F2233;
    --wordmark-color:       #EAF0F7;
    --nav-link-color:       #90B3D1;
    --nav-link-hover-color: #EAF0F7;
  }
}
```

### Manual Theme Override

When the user activates the light/dark toggle, `data-theme="dark"` or
`data-theme="light"` is set on `<html>`. These blocks must appear **after**
the media query in the stylesheet so cascade order gives them priority
(both selectors have equal specificity 0-1-0).

```css
[data-theme="dark"] {
  --bg-page: #0F2233; --bg-card: #1A3F5F;
  --ink: #EAF0F7; --grey-500: #90B3D1;
  --border-subtle: #1A3F5F; --border-default: #2A6496;
  --blue-50: #0F2233; --blue-100: #1A3F5F;
  --blue-700: #C8D8EB; --blue-900: #EAF0F7;
  --positive: #5AAF82; --negative: #B85A5A; --neutral: #8A9AAA;
  --bg-nav: #0F2233; --wordmark-color: #EAF0F7;
  --nav-link-color: #90B3D1; --nav-link-hover-color: #EAF0F7;
}

[data-theme="light"] {
  --bg-page: #F3F4F6; --bg-card: #FFFFFF;
  --ink: #2E2E2E; --grey-500: #4A4F55;
  --border-subtle: #EAF0F7; --border-default: #C8D8EB;
  --blue-50: #EAF0F7; --blue-100: #C8D8EB;
  --blue-700: #1A3F5F; --blue-900: #0F2233;
  --positive: #3A7D5A; --negative: #8B3A3A; --neutral: #5A6472;
  --bg-nav: #FFFFFF; --wordmark-color: #1A3F5F;
  --nav-link-color: #4A4F55; --nav-link-hover-color: #2A6496;
}
```

### Color Usage Rules

- Blue-700 / blue-500: links and interactive elements (use directly — not in nav)
- Nav colors: always use the dedicated `--wordmark-color`, `--nav-link-color`,
  `--nav-link-hover-color`, `--bg-nav` tokens
- Blue-900: deepest navy backgrounds (non-nav)
- Ink: all body text in light mode
- Grey-500: secondary text, nav links, labels
- Grey-100 / --bg-page: page background
- White / --bg-card: content cards, nav background (light mode)
- --positive: savings figures, favorable outcomes — DM Mono only
- --negative: cost figures, unfavorable outcomes — DM Mono only
- --neutral: net zero, unchanged figures — DM Mono only
- Never use --positive or --negative for non-financial content

---

## Layout & Grid

### Max Content Width

All pages: **800px** centered, with horizontal padding of 24px on each side.

```css
.content-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}
```

No exceptions for full-width tool stretching. The scenario tool and all
other pages share the same 800px container. The tool fills the container
rather than the viewport.

### Spacing Scale

Base unit: 8px

| Token | Value | Use |
|---|---|---|
| --space-1 | 8px | Component internal gaps |
| --space-2 | 16px | Between related elements |
| --space-3 | 24px | Between sections within a component |
| --space-4 | 32px | Between components |
| --space-6 | 48px | Between major page sections |
| --space-8 | 64px | Top/bottom page padding |
| --space-12 | 96px | Between thematically distinct sections |

### Vertical Rhythm

- Page top padding: 64px (--space-8)
- Between major sections: 48–64px (--space-6 to --space-8)
- Between body paragraphs: 24px (--space-3)
- Between a heading and its following paragraph: 16px (--space-2)
- Between a paragraph and its following heading: 48px (--space-6)

Whitespace is structural. When in doubt, add more of it.

---

## Navigation

### Structure

- Left: wordmark (links to /)
- Right: `.nav-right` div containing flat nav links + theme toggle button
- Height: 52px
- No logo, no icon — wordmark only

### HTML

```html
<nav>
  <a href="/" class="wordmark">Margin Steward</a>
  <div class="nav-right">
    <ul class="nav-links">
      <li><a href="/payroll-savings/" class="nav-link">Section 125</a></li>
      <li><a href="/scenario" class="nav-link">Scenario</a></li>
      <li><a href="/checklist" class="nav-link">Checklist</a></li>
    </ul>
    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle light/dark mode">
      <svg class="icon-sun" ...sun icon SVG...></svg>
      <svg class="icon-moon" ...moon icon SVG...></svg>
    </button>
  </div>
</nav>
```

### CSS

Nav uses dedicated color tokens (not `--blue-*` aliases) to avoid color
inversion from the palette swap in dark mode.

```css
nav {
  background: var(--bg-nav);
  border-bottom: 0.5px solid var(--border-subtle);
}

.wordmark { color: var(--wordmark-color); }
.nav-link  { color: var(--nav-link-color); }
.nav-link:hover { color: var(--nav-link-hover-color); }
```

Dark mode via media query and `[data-theme]` override both set the same
dedicated token values (see Color Palette section).

### Theme Toggle

The toggle button sits inside `.nav-right`, after `.nav-links`. It shows
a sun icon (visible in dark mode) or moon icon (visible in light mode).
Icon visibility is controlled by CSS using `.icon-sun` / `.icon-moon`
classes, not JS.

```css
.nav-right { display: flex; align-items: center; gap: 28px; }

.theme-toggle {
  background: none; border: none; cursor: pointer;
  color: var(--nav-link-color);
}
.theme-toggle:hover { color: var(--nav-link-hover-color); }

.icon-sun  { display: none; }
.icon-moon { display: block; }

/* In dark mode, show sun (to switch back to light) */
@media (prefers-color-scheme: dark) { .icon-sun { display: block; } .icon-moon { display: none; } }
[data-theme="dark"] .icon-sun  { display: block; }
[data-theme="dark"] .icon-moon { display: none; }
[data-theme="light"] .icon-sun  { display: none; }
[data-theme="light"] .icon-moon { display: block; }
```

Toggle JS (inline, not a module — must run on all pages):

```javascript
(function() {
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ms-theme', next);
    });
  }
})();
```

### Flash Prevention

To prevent a flash of wrong theme on page load, each HTML `<head>` includes
an inline synchronous script **before** the CSS `<link>`:

```html
<script>
  (function() {
    var stored = localStorage.getItem('ms-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
<link href="...main.css" rel="stylesheet">
```

### Nav Links — Current Set

As of this version, nav links are flat and tool-focused. Labels and
destinations will evolve as category and vertical pages are added.

Current links (right side, left to right):
- Section 125 → /payroll-savings/
- Scenario → /scenario
- Checklist → /checklist

When category pages are added, a "Categories" link replaces individual
tool links, or links are reorganized. No dropdowns — flat nav expands
horizontally or reorganizes as needed.

---

## Page Background

```css
body {
  background-color: var(--bg-page); /* #F3F4F6 light, #0F2233 dark */
}
```

Content cards and the nav sit on this background. White (#FFFFFF in light
mode, --blue-700 in dark mode) is used for cards and panels that need
to lift off the page surface.

---

## Component Patterns

### Three-Number Hero

Used on the Section 125 page. Three statistics displayed prominently
above the opening copy.

```css
.hero-numbers {
  display: flex;
  gap: 48px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.hero-stat-number {
  font-family: 'DM Mono', monospace;
  font-size: 40px;
  font-weight: 400;
  color: var(--ink);
  line-height: 1;
  display: block;
}

.hero-stat-label {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--grey-500);
  margin-top: 8px;
  display: block;
}
```

### Financial Figures

All financial figures — calculator outputs, table data, inline dollar
amounts used as callouts — use DM Mono and the financial color tokens.

```css
.figure-positive {
  font-family: 'DM Mono', monospace;
  color: var(--positive);
}

.figure-negative {
  font-family: 'DM Mono', monospace;
  color: var(--negative);
}

.figure-neutral {
  font-family: 'DM Mono', monospace;
  color: var(--neutral);
}
```

### Calculator Outputs

Two-column layout: label left, figure right. Total line separated by
a 0.5px rule above it.

```css
.calc-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 12px 0;
  border-bottom: 0.5px solid var(--border-subtle);
}

.calc-label {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--grey-500);
}

.calc-figure {
  font-family: 'DM Mono', monospace;
  font-size: 16px;
  color: var(--positive);
}

.calc-total-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 16px 0 0 0;
  margin-top: 8px;
  border-top: 0.5px solid var(--border-default);
}

.calc-total-label {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
}

.calc-total-figure {
  font-family: 'DM Mono', monospace;
  font-size: 20px;
  font-weight: 400;
  color: var(--positive);
}
```

### Left-Border Callout

Used for pull quotes, highlighted copy, and editorial callouts.

```css
.callout {
  border-left: 3px solid var(--blue-500);
  padding: 16px 20px;
  background: var(--blue-50);
  border-radius: 0 4px 4px 0;
  margin: 32px 0;
}

.callout p {
  font-size: 15px;
  color: var(--blue-700);
  margin: 0;
  line-height: 1.6;
}
```

### Data Tables

Clean, minimal. No zebra striping. Rules only where they aid reading.

```css
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th {
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--grey-500);
  text-align: left;
  padding: 8px 0;
  border-bottom: 0.5px solid var(--border-default);
}

td {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 14px;
  color: var(--ink);
  padding: 12px 0;
  border-bottom: 0.5px solid var(--border-subtle);
  vertical-align: top;
}

td.figure {
  font-family: 'DM Mono', monospace;
  color: var(--positive);
}

tr:last-child td {
  border-bottom: none;
}
```

### Email Capture Form

Minimal. Input and button inline. No card wrapper, no borders around
the form as a unit. Sits naturally in the page flow.

```css
.email-capture {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 24px;
  flex-wrap: wrap;
}

.email-input {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 14px;
  padding: 10px 14px;
  border: 0.5px solid var(--border-default);
  background: var(--bg-card);
  color: var(--ink);
  border-radius: 4px;
  width: 260px;
}

.email-input:focus {
  outline: none;
  border-color: var(--blue-500);
}

.email-button {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 20px;
  background: var(--blue-700);
  color: var(--blue-50);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 0.02em;
}

.email-button:hover {
  background: var(--blue-500);
}

.email-confirmation {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 14px;
  color: var(--grey-500);
}
```

---

## Footer

No footer content at this time. A footer element exists in the markup
for extensibility but renders nothing visible.

```html
<footer>
  <!-- extensible — no content at this time -->
</footer>
```

```css
footer {
  margin-top: 96px;
}
```

The top margin preserves breathing room below the last page element
regardless of future footer content.

---

## Implementation Notes for Claude Code

- Load Libre Franklin and DM Mono via Google Fonts API
- All CSS custom properties defined on :root as above
- Dark mode via @media (prefers-color-scheme: dark) for system preference,
  with [data-theme="dark"/"light"] attribute overrides for manual toggle
- Flash prevention: synchronous inline script in each <head> before CSS links
  sets data-theme from localStorage before first paint
- Theme toggle: inline JS at bottom of each page body — not a module
- Apply .content-container to all page wrappers — no exceptions for
  full-width tool stretching
- Nav rendered as a single shared component across all pages
- Font loading: include font-display: swap to prevent invisible text
  during load
- No CSS frameworks — custom properties and vanilla CSS only, consistent
  with existing codebase approach
