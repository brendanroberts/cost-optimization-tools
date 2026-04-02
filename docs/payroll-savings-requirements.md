# marginsteward.com — Payroll Savings Page Revision Requirements

## Overview

The Section 125 payroll savings page at /payroll-savings/ needs two categories
of changes: copy replacement throughout, and a significant expansion of the
calculator to show three outputs instead of one.

---

## Change 1: Replace Opening Copy

### Current copy (remove entirely):
- Page title: "Payroll tax optimization that improves employee benefits —
  with compliant implementation."
- Subtitle: "Designed to integrate with existing payroll and health benefit
  systems without operational disruption."
- Bullet point list

### Replace with:

**Page title (h1):**
Section 125 Plans — Employer FICA Savings

**Opening paragraphs:**
A Section 125 cafeteria plan lets employees pay for certain benefits with
pre-tax dollars. The employer, as a result, collects FICA taxes on a smaller
payroll base. This is legal, well-established, and for reasons that remain
unclear, not universally adopted.

No vendors to negotiate with. No contracts to renegotiate. No switching costs.
The mechanism has been in the tax code since 1978. It just needs to be set up.

---

## Change 2: Replace "What Makes This Worth Reviewing" Section

Replace all four subsections with the following. Preserve the existing heading
structure (h2 for section title, bold or h3 for subsection labels).

**Plan eligibility**
Section 125 plans are available to most private-sector employers regardless
of size. S-corp owners and sole proprietors can't participate themselves,
though their employees can — which is where the savings are anyway.

**Compatibility with existing payroll and benefits**
It works alongside whatever payroll provider and health benefits are already
in place. No carriers change. No systems change. A plan document gets added
and elections get processed differently. That's mostly it.

**Compliance requirements**
A compliant plan requires a formal plan document, annual nondiscrimination
testing, and consistent administration. None of this is exotic. It should be
reviewed by a qualified plan administrator, but it is not the kind of thing
that keeps them up at night.

**Savings profile**
Savings scale with headcount and benefit election amounts. More participating
employees at higher election levels produce larger FICA reductions. The math
is linear and the savings recur every payroll period.

---

## Change 3: Replace Calculator Section Heading and Framing Copy

### Current heading and framing copy (remove):
"Estimate Employer FICA Savings"
"The calculator below estimates annual employer FICA tax savings based on
employee headcount. It assumes a standard benefit election amount per
participating employee and applies the current employer FICA rate.
Use this to frame a rough order of magnitude for a client conversation. Actual
savings depend on participation rates, employee eligibility, and plan
administration."

### Replace heading with:
Estimate the Impact

### Replace framing copy with:
The calculator shows three effects of a Section 125 plan, all from the same
input: headcount. This is not a coincidence — they all flow from the same
mechanism.

Adjust the slider. The per-employee assumptions are standard. The math is not
complicated, which is part of what makes this interesting.

---

## Change 4: Expand Calculator Outputs

### Current state
The calculator takes a single input (number of employees via slider) and
displays one output: "Estimated employer FICA reduction" as a single dollar
amount.

### Per-employee constants
All three outputs are derived from headcount using fixed per-employee amounts:

- Employee take-home increase: $2,544 per employee per year
- Employer FICA savings: $574 per employee per year
- Employer premium reductions: $1,798 per employee per year

### Required outputs
Replace the single output with four labeled results, all updating dynamically
as the slider changes:

**Row 1:** Employee take-home increase
- Per employee: $X
- Overall annual: $X

**Row 2:** Employer FICA savings
- Per employee: $X
- Overall annual: $X

**Row 3:** Employer premium reductions
- Per employee: $X
- Overall annual: $X

**Row 4 — total line, visually distinct:**
Combined employer profit impact
- Overall annual: $X
  (sum of employer FICA savings + employer premium reductions only —
  employee take-home increase is a benefit to employees, not employer profit)

### Formatting
- All dollar amounts formatted with comma separators, no decimal places
- Total line should be visually separated from the three rows above it —
  a simple rule or additional spacing, consistent with existing site aesthetic
- No new colors introduced except to maintain the existing green treatment
  on the primary output if appropriate — use judgment to apply it to the
  combined employer profit impact total as the most salient number
- Layout should work cleanly on mobile

### Existing slider
The existing employee count slider remains unchanged. Current default and
range should be preserved unless they need adjustment to accommodate the
example headcount of 344 employees — confirm the slider range covers at
least 1–500.

---

## Change 5: Replace Below-Calculator Caveat

### Current copy (remove):
The bullet point list beginning "Results shown are illustrative..."
and the paragraph beginning "A preliminary review of headcount..."

### Replace with:
Results assume full participation, which rarely happens in practice. Actual
outcomes are lower. They are still usually worth pursuing.

---

## Change 6: Replace Closing Section

### Current copy (remove):
"This page is one of several cost category resources on Margin Steward.
To model Section 125 savings alongside other vendor and operational cost
opportunities, use the scenario tool."
[Cost Optimization Scenario Tool →]

### Replace with two elements:

**Specialist note paragraph:**
Setting this up requires a qualified plan administrator. This isn't something
an accountant or bookkeeper handles directly — it goes through a specialist.
If you'd like to explore whether it's appropriate for a client, reach out.

"reach out" should be a mailto link to: brendan@marginsteward.com

**Scenario tool link (retain, update destination):**
To model Section 125 savings alongside other vendor and operational cost
opportunities, use the scenario tool.

[Cost Optimization Scenario Tool →] — update href to /scenario per the
homepage reframe requirements document.

---

## Change 7: Update Navigation Link

The current nav item "Payroll tax savings" links to /payroll-savings/.
Update the display label to "Section 125 savings" to match the page title.
href remains /payroll-savings/ — no URL change.

---

## Notes for Implementation

- Preserve all existing calculator JavaScript logic — only the output
  rendering changes, not the input mechanism
- The three per-employee constants are fixed — hardcode them
- No new dependencies
- Test all four output rows and the total line across the full slider range
- Confirm mobile layout renders cleanly at common breakpoints
