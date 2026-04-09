# marginsteward.com — Payroll Savings Page: Third Iteration Requirements

## Overview

The payroll savings page at /payroll-savings/ needs a significant simplification
pass. The goal is to align the page more closely with the attached 1-pager PDF
in structure, economy, and tone. The "What Makes This Worth Reviewing"
subsection structure is removed entirely. The calculator is simplified to two
outputs. The page follows the PDF's sequence: hero numbers, opening, mechanism,
qualification, calculator, example, what's needed, contact.

---

## Change 1: Add Three-Number Hero

Add a prominent three-number display directly below the page title (h1) and
above the opening paragraphs.

### Three numbers to display:
- ~$575 — label: "annual FICA savings per employee"
- 45 days — label: "typical time to implement"
- $0 — label: "net cost to employer"

### Styling:
- Large, prominent numbers — the most visually dominant element on the page
- Labels in smaller text below each number
- Horizontal layout on desktop, stacked on mobile
- Consistent with existing site aesthetic — no new colors or decorative elements
- No boxes, cards, or borders — clean typographic treatment only

---

## Change 2: Replace Opening Copy

### Remove entirely:
The current opening two paragraphs beginning "A Section 125 cafeteria plan
lets employees pay..."

### Replace with:

Employers pay FICA tax at 7.65% of taxable salaries. Most are paying that
rate on more payroll than they need to — not because of an error, but because
a simple, long-established plan was never set up. Section 125 has made this
fixable since 1978.

If an organization hasn't done this, the math below is theirs to keep.

---

## Change 3: Remove "What Makes This Worth Reviewing" Section

Remove the entire "What Makes This Worth Reviewing" section, including all
four subsections:
- Plan eligibility
- Compatibility with existing payroll and benefits
- Compliance requirements
- Savings profile

Replace with the following two sections:

### How It Works

No vendors change. Existing health carriers, payroll provider, and benefits
stay exactly as-is. A plan document is added. Employees elect to pay certain
benefit premiums pre-tax. Taxable payroll shrinks. FICA is calculated on the
smaller base. Employer pays less. Every year. Automatically.

Employees benefit too. Each takes home roughly $212 more per month — at no
cost to them or the employer.

### Who Qualifies

Any employer with 5 or more full-time W2 employees and an existing health
plan — or one looking to establish benefits for the first time. Works across
industries including non-profit, government, education, and private sector.
S-corp owners and sole proprietors cannot participate themselves, but their
employees can, and that's where the savings are.

---

## Change 4: Simplify Calculator Outputs

### Remove:
The "Employer premium reductions" row and its associated qualifier note
entirely.

### Retain:
- Employee take-home increase (per employee / year + overall annual)
- Employer FICA savings (per employee / year + overall annual)
- Combined employer profit impact total (Employer FICA savings only —
  employee take-home increase is not employer profit and should not be
  included in this total)

### Per-employee constants (unchanged):
- Employee take-home increase: $2,544 per employee per year
- Employer FICA savings: $574 per employee per year

### Calculator heading and framing copy (unchanged from previous iteration):
"Estimate the Impact"

The calculator shows two effects of a Section 125 plan, all from the same
input: headcount. This is not a coincidence — they both flow from the same
mechanism.

Adjust the slider. The per-employee assumptions are standard. The math is not
complicated, which is part of what makes this interesting.

### Below-calculator caveat (unchanged):
Results assume full participation, which rarely happens in practice. Actual
outcomes are lower. They are still usually worth pursuing.

---

## Change 5: Add Example Section

Add a new section after the calculator with the following content:

### Section heading:
Example

### Body:
A bank with 344 employees had not set up a Section 125 plan.
Implementation took 45 days.

### Table:
| Savings Type | Per Employee / Year | Total Annual |
|---|---|---|
| Employer FICA reduction | $574 | $197,318 |
| Employee net pay increase | $2,544 | $875,136 |

Cost to the employer: zero.

### Styling:
- Simple table, consistent with existing site aesthetic
- "Cost to the employer: zero." should be set as a standalone line below
  the table, not inside it — give it visual weight

---

## Change 6: Replace Closing Section

### Remove:
The current closing paragraph beginning "Setting this up requires a qualified
plan administrator..."
The scenario tool link.

### Replace with:

**Section heading:**
To Get Started

**Body — render as a simple list:**
- Number of full-time employees
- Payroll provider
- Pay cycle
- Current insurance provider
- 2–3 available appointment slots

**Contact note (paragraph below the list):**
Setting this up requires a qualified plan administrator — it isn't something
an accountant or bookkeeper handles directly. A 15-minute call is all it takes.

If you'd like to explore whether this is appropriate for a client, reach out.

"reach out" should be a mailto link to: broberts@marginsteward.com

---

## Page Structure After Changes

The complete page sequence should be:

1. H1: Section 125 Plans — Employer FICA Savings
2. Three-number hero (~$575 / 45 days / $0)
3. Opening paragraphs (FICA tax / fixable since 1978)
4. How It Works
5. Who Qualifies
6. Estimate the Impact (calculator)
7. Example (banking case study table)
8. To Get Started (list + contact note)

---

## Notes for Implementation

- The scenario tool link at the bottom of the page is removed in this pass
- No other pages or navigation items change in this pass
- Preserve all existing calculator JavaScript — only the output rendering
  changes (remove premium reductions row)
- Test calculator outputs across full slider range
- Confirm mobile layout renders cleanly at common breakpoints
