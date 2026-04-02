# marginsteward.com — Home Page Reframe Requirements

## Overview

The current home page (/) is the scenario tool itself with no introduction
or framing. This change moves the scenario tool to its own URL, replaces the
home page with new copy and an email capture form, and links through to the
tool from the home page.

---

## Change 1: Move the Scenario Tool

### Current state
The scenario tool lives at /.

### Required change
Move the scenario tool to /scenario.

- All existing tool functionality, state, export, and PDF features remain
  unchanged
- The "Generate My Preparation Checklist" button (per previous requirements
  doc) should update its internal links if any reference /
- Update any internal links or references to the tool throughout the codebase
  to point to /scenario

---

## Change 2: New Home Page Content

Replace the current home page at / with the following copy and structure.
No existing tool code should remain on this page.

### Typography and layout
- Match existing site typography and spacing conventions exactly
- No new fonts, colors, or decorative elements
- Clean, minimal — consistent with the existing editorial aesthetic
- Page should be readable and well-spaced on both desktop and mobile

### Copy — render exactly as written, preserving paragraph breaks

**Paragraph 1:**
Vendor contracts have a natural tendency to outlive the conditions that made
them reasonable. Margin Steward is a resource for accounting and finance
professionals who notice this — and want to do something about it for their
clients.

**Paragraph 2:**
Most of this is already suspected. Waste hauling contracts commonly run three
years, auto-renew on 60-day windows, and carry stiff penalties for early
changes. Telecom lines accumulate. Shipping rates drift. The tools here are
designed to make these patterns quantifiable and presentable — so the
conversation moves from suspicion to specifics. A recovered dollar reaches
the bottom line intact. New revenue doesn't.

**Paragraph 3:**
Cost categories. Industry profiles. A scenario tool. Each is designed to
support a client conversation, not replace the judgment behind it.

- "Cost categories" — link placeholder, no destination yet (href="#")
- "Industry profiles" — link placeholder, no destination yet (href="#")
- "A scenario tool" — link to /scenario

**Paragraph 4 — Email capture section:**
New cost categories, industry profiles, and tools are added as they're
developed. Leave an email address to follow along.

Followed immediately by the email capture form (see Change 3 below).

---

## Change 3: Email Capture Form

### Placement
Immediately below paragraph 4 on the home page.

### Fields
- Email address input (required, type="email")
- Submit button — label: "Follow along"

### Validation
- Client-side: required field, valid email format
- On invalid submission: inline error, no page reload
- On successful submission: replace form with a single confirmation line:
  "You're on the list."

### Submission behavior
- POST to the existing Lambda endpoint already in the codebase
- Payload:
```json
{
  "source": "marginsteward-home-email-capture",
  "email": "<user input>"
}
```
- Fire and forget — no response handling beyond success/failure state
- On network error or non-200 response: display inline message:
  "Something went wrong. Try again or reach out directly."

### Styling
- Form should be minimal — consistent with existing site input styles
- No box, card, or container styling around the form
- Input and button should sit inline or in a simple single-column layout
- No labels beyond the placeholder text "your@email.com" in the input field
- Button styled consistently with existing site button conventions

---

## Change 4: Navigation

Leave existing navigation unchanged for this pass. Nav will be updated in
a subsequent requirements document once category and vertical pages are built.

---

## Change 5: Internal Link Audit

Search the codebase for any hardcoded references to / that were intended
to point to the scenario tool, and update them to /scenario. This includes
but is not limited to:

- Nav links
- The "Cost optimization scenarios" nav item — update href to /scenario
- Any back-links or internal references within the checklist or payroll
  savings pages

---

## Out of Scope for This Pass

- Category pages
- Vertical pages
- Navigation restructure
- Email list service integration (Lambda endpoint handles delivery for now)
- Any analytics or tracking
