# Margin Steward — Style Guide Implementation Requirements

## Overview

Apply the Margin Steward design and style guide (marginsteward-style-guide.md)
site-wide across all four existing pages. This is a visual and structural
pass — content changes are minimal and noted explicitly below. No new pages
are created in this pass.

The four pages in scope:
- / (home)
- /scenario
- /payroll-savings/
- /checklist

---

## Global Changes (apply to all pages)

### 1. Font Loading

Add to the document head on all pages:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
```

### 2. CSS Custom Properties

Replace all existing color and typography variables with the following,
defined on :root:

```css
:root {
  --blue-50:  #EAF0F7;
  --blue-100: #C8D8EB;
  --blue-200: #90B3D1;
  --blue-300: #5A8FB8;
  --blue-500: #2A6496;
  --blue-700: #1A3F5F;
  --blue-900: #0F2233;

  --ink:      #2E2E2E;
  --grey-500: #4A4F55;
  --grey-100: #F4F5F6;

  --positive: #3A7D5A;
  --negative: #8B3A3A;
  --neutral:  #5A6472;
  --data-ink: #1A3F5F;

  --bg-page:  #F3F4F6;
  --bg-card:  #FFFFFF;
  --bg-nav:   #FFFFFF;

  --border-subtle:  #EAF0F7;
  --border-default: #C8D8EB;

  --space-1:  8px;
  --space-2:  16px;
  --space-3:  24px;
  --space-4:  32px;
  --space-6:  48px;
  --space-8:  64px;
  --space-12: 96px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-page:  #0F2233;
    --bg-card:  #1A3F5F;
    --bg-nav:   #0F2233;

    --ink:      #EAF0F7;
    --grey-500: #90B3D1;

    --border-subtle:  #1A3F5F;
    --border-default: #2A6496;

    --blue-50:  #0F2233;
    --blue-100: #1A3F5F;
    --blue-700: #C8D8EB;
    --blue-900: #EAF0F7;

    --positive: #5AAF82;
    --negative: #B85A5A;
    --neutral:  #8A9AAA;
  }
}
```

### 3. Body and Base Styles

```css
body {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.7;
  color: var(--ink);
  background-color: var(--bg-page);
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}
```

### 4. Content Container

Wrap all page content (excluding nav) in a container:

```css
.content-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-3);
}
```

Apply to all pages. No exceptions for full-width stretching — the scenario
tool uses the same 800px container as all other pages.

### 5. Navigation

Nav uses dedicated color tokens to avoid inversion from the `--blue-*`
palette swap in dark mode. `--blue-900` becomes `#EAF0F7` (near-white)
in dark mode — using it as nav background would invert the nav. Dedicated
tokens hold the correct hex values in each mode regardless of palette swap.

#### HTML

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
      <svg class="icon-sun" ...></svg>
      <svg class="icon-moon" ...></svg>
    </button>
  </div>
</nav>
```

#### Nav CSS

```css
nav {
  background: var(--bg-nav);
  border-bottom: 0.5px solid var(--border-subtle);
}

.wordmark { color: var(--wordmark-color); }
.nav-link  { color: var(--nav-link-color); }
.nav-link:hover { color: var(--nav-link-hover-color); }
.nav-right { display: flex; align-items: center; gap: 28px; }
```

#### Dedicated nav tokens in :root

```css
:root {
  --bg-nav:               #FFFFFF;
  --wordmark-color:       #1A3F5F;
  --nav-link-color:       #4A4F55;
  --nav-link-hover-color: #2A6496;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-nav:               #0F2233;
    --wordmark-color:       #EAF0F7;
    --nav-link-color:       #90B3D1;
    --nav-link-hover-color: #EAF0F7;
  }
}
```

Same values repeated in `[data-theme="dark"]` and `[data-theme="light"]`
blocks (placed after the media query in the stylesheet to win on cascade).

### 5a. Flash Prevention (add to all pages)

Inline synchronous script in `<head>` **before** the CSS `<link>` tag.
Sets `data-theme` before first paint to prevent flash of wrong theme.

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

### 5b. Theme Toggle JS (add to all pages)

Inline script at the bottom of `<body>` (not a module — must run on all pages):

```html
<script>
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
</script>
```

### 6. Typography Scale

Apply globally:

```css
h1 {
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.25;
  color: var(--ink);
  margin: 0 0 var(--space-2) 0;
}

h2 {
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 600;
  font-size: 22px;
  line-height: 1.3;
  color: var(--ink);
  margin: var(--space-6) 0 var(--space-2) 0;
}

h3 {
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.4;
  color: var(--ink);
  margin: var(--space-4) 0 var(--space-2) 0;
}

p {
  margin: 0 0 var(--space-3) 0;
}

p:last-child {
  margin-bottom: 0;
}

a {
  color: var(--blue-500);
  text-decoration: none;
}

a:hover {
  color: var(--blue-700);
  text-decoration: underline;
}
```

### 7. Footer

Replace any existing footer with:

```html
<footer>
  <!-- extensible — no content at this time -->
</footer>
```

```css
footer {
  margin-top: var(--space-12);
}
```

### 8. Email Address Correction

Replace all instances of broberts@marginsteward.com with
brendan@marginsteward.com across all pages.

---

## Page-Specific Changes

### Home Page (/)

#### Copy correction
The opening line currently reads "Businesses have a natural tendency to
leak money." Replace with the approved copy:

"Vendor contracts have a natural tendency to outlive the conditions that
made them reasonable."

Full approved home page copy for reference:

---
Vendor contracts have a natural tendency to outlive the conditions that
made them reasonable. Margin Steward is a resource for accounting and
finance professionals who notice this — and want to do something about it
for their clients.

Most of this is already suspected. Waste hauling contracts commonly run
three years, auto-renew on 60-day windows, and carry stiff penalties for
early changes. Telecom lines accumulate. Shipping rates drift. The tools
here are designed to make these patterns quantifiable and presentable —
so the conversation moves from suspicion to specifics. A recovered dollar
reaches the bottom line intact. New revenue doesn't.

Cost categories. Industry profiles. A scenario tool. Each is designed to
support a client conversation, not replace the judgment behind it.

New cost categories, industry profiles, and tools are added as they're
developed. Leave an email address to follow along.
---

Note: "Cost categories" and "Industry profiles" are placeholder links
(href="#") until those pages exist. "A scenario tool" links to /scenario.

#### Layout
- Apply .content-container
- Generous top padding — var(--space-8)
- Paragraph spacing per type scale
- Email capture form styled per style guide component pattern

#### Email capture form
Style per the style guide email capture component. Button label:
"Follow along". Confirmation text: "You're on the list."

---

### Scenario Tool (/scenario)

#### Layout
- Apply .content-container — 800px max-width, same as all other pages
- Remove any full-width stretching
- Page title "Cost Optimization - Scenario Analysis" — apply h1 styles
  but consider whether a simpler title is appropriate:
  "Cost Optimization — Scenario Analysis" (em dash, not hyphen)

#### Tool chrome
- Sidebar panel (expense categories) and main tool panel should sit
  within the 800px container
- On mobile: sidebar stacks above main panel
- Tool controls (months selector, view toggle, buttons) styled using
  Libre Franklin Medium 500, 13px, consistent with nav link style
- Buttons (Reset, Bookmark, Export, PDF, Generate My Preparation
  Checklist) — remove any colored button backgrounds; use:

```css
.tool-button {
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 500;
  font-size: 13px;
  padding: 8px 16px;
  background: transparent;
  border: 0.5px solid var(--border-default);
  color: var(--grey-500);
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 0.01em;
}

.tool-button:hover {
  border-color: var(--blue-500);
  color: var(--blue-500);
}
```

#### FAQ section
- Section heading "FAQ" — apply h2 styles
- FAQ item labels — Libre Franklin Medium 500, 16px, var(--ink)
- FAQ item body — Libre Franklin Regular 400, 16px, var(--ink),
  line-height 1.7
- Accordion expand/collapse styling — minimal; use a simple + / − toggle
  in var(--grey-500)

#### Financial figures in tool output
- Apply DM Mono to all dollar amounts and percentage figures in the
  tool output area
- Positive savings figures: var(--positive)
- Apply .figure-positive class

#### Contact email in FAQ
- Update broberts@marginsteward.com → brendan@marginsteward.com

---

### Section 125 Page (/payroll-savings/)

#### Layout
- Apply .content-container
- Page title h1: "Section 125 Plans — Employer FICA Savings"

#### Three-number hero
Style per style guide hero component:

```html
<div class="hero-numbers">
  <div class="hero-stat">
    <span class="hero-stat-number">~$575</span>
    <span class="hero-stat-label">annual FICA savings per employee</span>
  </div>
  <div class="hero-stat">
    <span class="hero-stat-number">45 days</span>
    <span class="hero-stat-label">typical time to implement</span>
  </div>
  <div class="hero-stat">
    <span class="hero-stat-number">$0</span>
    <span class="hero-stat-label">net cost to employer</span>
  </div>
</div>
```

```css
.hero-numbers {
  display: flex;
  gap: var(--space-6);
  margin: var(--space-6) 0;
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
  margin-top: var(--space-1);
  display: block;
}
```

#### Section headings
"How It Works", "Who Qualifies", "Estimate the Impact", "Example",
"To Get Started" — apply h2 styles

#### Calculator outputs
Apply style guide calculator output component pattern:
- Two output rows: Employee take-home increase, Employer FICA savings
- Total line: Combined employer profit impact
- All figures in DM Mono, var(--positive)
- Per the calculator component CSS in style guide

#### Example table
Apply style guide data table pattern. "Cost to the employer: zero."
rendered as a standalone line below the table in Libre Franklin Medium
500, var(--ink).

#### To Get Started list
Simple unordered list, no bullet styling beyond a subtle indent.
Remove default list markers or replace with an em dash:

```css
.to-get-started li {
  list-style: none;
  padding-left: 0;
  font-size: 15px;
  color: var(--ink);
  padding: 4px 0;
}

.to-get-started li::before {
  content: "— ";
  color: var(--grey-500);
}
```

---

### Checklist (/checklist)

#### Layout
- Apply .content-container
- Page title h1: "Business Services Spend Checklist"
- Subtitle — Libre Franklin Regular 400, 15px, var(--grey-500)

#### Checklist sections
Section headings (Vendor Pricing & Contracts, Service Delivery
Verification, etc.) — apply h3 styles

#### Checklist items
Each item is a checkbox + label. Style:

```css
.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-1) 0;
  border-bottom: 0.5px solid var(--border-subtle);
}

.checklist-item:last-child {
  border-bottom: none;
}

.checklist-item input[type="checkbox"] {
  margin-top: 3px;
  flex-shrink: 0;
  accent-color: var(--blue-500);
}

.checklist-item label {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: var(--ink);
  line-height: 1.5;
  cursor: pointer;
}
```

#### Print styles
The checklist is designed to be printed. Ensure print styles are clean:

```css
@media print {
  nav { display: none; }
  footer { display: none; }
  body {
    font-size: 12px;
    color: #000;
    background: #fff;
  }
  .content-container {
    max-width: 100%;
    padding: 0;
  }
}
```

---

## Mobile Responsiveness

Apply to all pages:

```css
@media (max-width: 600px) {
  .content-container {
    padding: var(--space-4) var(--space-2);
  }

  h1 { font-size: 26px; }
  h2 { font-size: 20px; }

  .hero-numbers {
    flex-direction: column;
    gap: var(--space-4);
  }

  .hero-stat-number {
    font-size: 32px;
  }

  .nav-links {
    gap: var(--space-3);
  }

  .email-capture {
    flex-direction: column;
    align-items: flex-start;
  }

  .email-input {
    width: 100%;
  }
}
```

---

## Implementation Order

Suggested order to minimize visual breakage during implementation:

1. CSS custom properties and base styles (global)
2. Font loading (global)
3. Navigation replacement (global)
4. Footer (global)
5. Content container application (all pages)
6. Typography scale (global)
7. Home page copy correction and layout
8. Section 125 page — hero numbers and calculator styling
9. Scenario tool — container constraint and tool chrome styling
10. Checklist — section styling and print styles
11. Mobile responsive pass (all pages)
12. Dark mode review pass (all pages)

---

## Notes

- Do not introduce any CSS framework or utility library — vanilla CSS
  and custom properties only, consistent with existing codebase
- Preserve all existing JavaScript functionality — this is a style pass
  only, not a logic change
- The scenario tool's full-width behavior is intentionally removed in
  this pass — constrain to 800px container
- Test dark mode on all pages after implementation
- Test print output on /checklist after implementation
- Confirm DM Mono renders correctly on financial figures before
  considering complete
