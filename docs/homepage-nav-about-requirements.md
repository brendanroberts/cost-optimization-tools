# marginsteward.com — Home Page Revision, Nav Update & About Page

---

## Change 1: Home Page Copy

### Current copy (remove entirely):
All body copy below the subheading, including the waste/telecom paragraph,
the navigation orientation paragraph, and the email capture prompt.

### Approved headline (h1):
The bills arrive. Nobody looks.

### Approved subheading (h2 or large body):
Margin Steward is a resource for accounting and finance professionals
who notice this — and want to do something about it for their clients.

### New body copy (replace existing):

The tools and resources here are built for advisors who want to bring
cost structure conversations to their clients — with something more
useful than a hunch. Category references, industry profiles, and a
scenario tool, each designed for a client conversation.

Cost categories. Industry profiles. A scenario tool. Each is designed
to support a client conversation, not replace the judgment behind it.

- "Cost categories" — link placeholder (href="#") until category pages exist
- "Industry profiles" — link to /profiles
- "A scenario tool" — link to /scenario

### Email capture (unchanged):
New cost categories, industry profiles, and tools are added as they're
developed. Leave an email address to follow along.

[email input + "Follow along" button — existing component, no change]

---

## Change 2: Navigation Update

### Current nav links:
- Profiles → /profiles
- Section 125 → /payroll-savings/
- Scenario → /scenario
- Checklist → /checklist

### Updated nav links:
- Profiles → /profiles
- Payroll Savings → /payroll-savings/
- Scenarios → /scenario
- Review Guide → /checklist
- About → /about

### Notes:
- Order as listed above, left to right on right side of nav
- "Scenarios" replaces "Scenario" — plural
- "Payroll Savings" replaces "Section 125" — more accessible label
- "Review Guide" replaces "Checklist" — signals value more clearly
- "About" is new — links to new /about page (see Change 3)
- Wordmark "MARGIN STEWARD" on left links to / — unchanged

---

## Change 3: About Page

### URL: /about
### Browser title: About | Margin Steward

### Page title (h1):
About

### Body copy:

Margin Steward was built by Brendan Roberts, a cost optimization
practitioner and software engineer based in Boulder, CO. The tools
and resources here grew out of work with CFOs, controllers, and finance
professionals who needed something more structured than a spreadsheet
and more flexible than a consultant's slide deck.

If something here is useful, that's the point.

[brendan@marginsteward.com](mailto:brendan@marginsteward.com)

### Photo:
No photo at this time. Page should render cleanly without one.
Structure the page so a photo can be added later above or alongside
the copy without requiring layout changes — a simple optional image
container with the copy flowing naturally beside or below it.

### Layout:
- Apply .content-container (800px)
- Generous vertical whitespace consistent with rest of site
- Email address rendered as a mailto link in body text style
- No CTA, no form, no additional elements

---

## Implementation Notes

- Home page headline "The bills arrive. Nobody looks." renders as h1
- Subheading renders as h2 or large body — should be visually distinct
  from the h1 but subordinate to it; use Libre Franklin Regular 400
  at 18-20px in --grey-500
- Remove the waste/telecom specifics paragraph entirely from home page
  — this content belongs on category pages
- The "A recovered dollar reaches the bottom line intact. New revenue
  doesn't." line is removed from home page — reserve for category pages
  and scenario tool
- About page goes live before nav is updated — confirm page is live
  at /about before adding the nav link
- All other pages and components unchanged in this pass
