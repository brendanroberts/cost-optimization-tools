# marginsteward.com — Nonprofit Page, Profiles Landing & Nav Update

---

## Page 1: Nonprofit Profile
### URL: /nonprofits
### Browser title: Vendor Costs & the Cost of Fundraising — Nonprofits | Margin Steward
### Page title (h1): Vendor Costs & the Cost of Fundraising — Nonprofits

---

### Opening

Every dollar a nonprofit spends on an invoice it shouldn't have to pay
is a dollar its development team has to go raise. That's not a metaphor
— it's the actual math. Fundraising has real costs: staff time, events,
campaigns, donor stewardship. When vendor costs run higher than they
should, the gap gets filled by fundraising effort that could have gone
elsewhere.

The organizations most exposed to this are the ones doing the most good.
Mission-driven staff focus on programs. Finance staff are stretched.
Vendor contracts auto-renew. Nobody has time to look.

---

### What's Worth Examining (h2)

The categories that consistently produce recoverable spend in nonprofit
organizations are not exotic. They're the same services every
organization uses — telecommunications, donation processing, payroll,
and software. The difference is that nonprofits have access to pricing
and programs that most organizations don't, and are frequently not
taking advantage of them.

---

### Donation Processing (h2)

Most donation platforms charge a percentage of every transaction. At low
volume that's a reasonable tradeoff for simplicity. At higher volume it
becomes a meaningful line item — one that grows automatically as
fundraising improves, without anyone deciding to increase it.

Processing rates, platform fees, and the terms under which they apply
are worth examining periodically. The market for donation processing has
evolved, and what was competitive three years ago may not be today.

#### The questions worth asking:

- What is our effective rate — total processing fees divided by total
  donation volume — across all channels?
- Have we benchmarked our current platform against alternatives at our
  current transaction volume?
- Are we paying platform fees for capabilities we don't actively use?

---

### Telecommunications (h2)

Nonprofit offices accumulate telecom services the same way any
organization does — gradually, without a systematic review, on contracts
that auto-renew. The difference is that mission-focused organizations
are less likely to have someone whose job it is to notice.

Multi-site organizations — those with program offices, chapter
locations, or satellite facilities — are particularly exposed. Each
location has its own service history. The aggregate is rarely examined
as a whole.

#### The questions worth asking:

- Do we have a complete picture of every telecom service we're paying
  for across all locations?
- When did we last review whether our current services and rates reflect
  what's available in the market?
- Are we carrying lines or services that predate staff or program
  changes?

---

### Payroll — Section 125 (h2)

Nonprofits qualify for Section 125 plans on the same terms as
private-sector employers. The FICA savings are identical. The
implementation is identical. The main difference is that nonprofit
finance staff are often too stretched to have looked into it.

For organizations with 10 or more W2 employees and an existing health
plan, this is worth a 15-minute conversation.

[Section 125 — Employer FICA Savings →] — link to /payroll-savings/

---

### Software (h2)

Nonprofits have access to donated and deeply discounted software through
programs like TechSoup that most organizations don't. Microsoft, Google
Workspace, and Adobe are available at a fraction of commercial rates.
Many nonprofits are not fully utilizing what's available to them — and
are paying commercial or near-commercial rates as a result.

Beyond licensing, the broader question is whether the current software
stack reflects current needs. SaaS subscriptions accumulate. Tools get
added for specific projects and stay on the books. A periodic audit of
what's being paid for versus what's being used tends to surface
recoverable spend.

#### The questions worth asking:

- Are we paying commercial rates for software that's available to us
  at nonprofit pricing?
- Do we have a current inventory of every SaaS subscription we're
  paying for?
- Are there tools in our stack that are unused or underused relative
  to what we're paying?

---

### As Organizations Grow (h2)

Larger nonprofits — regional and national organizations, those with
multiple program sites, those with warehouse or distribution operations
— begin to incur cost categories that smaller organizations don't.
Office and janitorial supplies on service contracts. Small package
shipping for program materials. Waste and recycling at facilities with
meaningful physical operations.

The same dynamics apply: contracts set up once, renewed automatically,
rarely benchmarked. The dollar amounts grow with the organization.

---

### Tool Prompt

To model the cumulative cash flow impact across these categories, use
the scenario tool.

[Cost Optimization Scenario Tool →] — link to /scenario

---

## Page 2: Profiles Landing
### URL: /profiles
### Browser title: Profiles | Margin Steward
### Page title (h1): Profiles

---

### Opening (short paragraph, no h2)

Cost patterns vary by organization type. These profiles cover the
categories most worth examining in each, with diagnostic questions for
the conversations that follow.

---

### Profile Cards

Render each profile as a left-border callout card using the existing
.callout component pattern from the style guide:

```
border-left: 3px solid var(--blue-500);
padding: 16px 20px;
background: var(--blue-50);
border-radius: 0 4px 4px 0;
margin: 24px 0;
```

Each card contains:
- Profile name in h3 style (Franklin SemiBold 600, 18px, --ink)
- One-line description in body style (Franklin Regular 400, 15px,
  --grey-500)
- Link arrow "→" following the description, linking to the profile page

---

**Card 1 — Nonprofits**
Heading: Nonprofits
Description: Vendor costs and the cost of fundraising.
Link: → /nonprofits

**Card 2 — Distribution**
Heading: Distribution
Description: Small package shipping and merchant services.
Link: → /distribution

**Card 3 — Manufacturing**
Heading: Manufacturing
Description: Telecom, waste, and uniforms.
Link: → /manufacturing

---

### Closing note (short, below cards)

Additional profiles are added as they're developed.

---

## Nav Update

### Current nav links (right side):
- Section 125 → /payroll-savings/
- Scenario → /scenario
- Checklist → /checklist

### Updated nav links:
- Profiles → /profiles
- Section 125 → /payroll-savings/
- Scenario → /scenario
- Checklist → /checklist

"Profiles" is added as the first link on the right side, before
Section 125.

### Notes
- Flat nav — no dropdown from Profiles
- When additional profile pages are added, they are linked from
  /profiles only, not from the nav directly
- Nav link label: "Profiles" — not "Industries", not "Verticals"

---

## Retrofit Note — Future Pass

The opening paragraphs of the distribution and manufacturing pages
should be revisited to lead harder on consequence, consistent with the
nonprofit opening. This is deferred to a subsequent pass but noted here
for continuity.

- /distribution: current opening is accurate but doesn't name the
  real cost of inaction — revise to connect shipping and processing
  costs to margin and competitive position
- /manufacturing: current "accumulating wear" metaphor is atmospheric
  but soft — revise to name what's actually at stake when vendor
  contracts go unreviewed in a manufacturing operation

---

## Implementation Notes

- All three pages use .content-container (800px max-width)
- "The questions worth asking:" lists use em dash list markers
  consistent with existing pages
- Section 125 crosslink on nonprofit page styled as a plain text link
  with arrow, consistent with tool prompt links
- Profile cards on /profiles use the .callout component exactly as
  specced in the style guide — no new component needed
- All three pages go live before the nav is updated — update nav
  last once pages are confirmed live and correct
