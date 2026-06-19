# marginsteward.com — Profile-Specific Scenario Tool Links

## Overview

Update the scenario tool links on each profile page to carry
pre-loaded state — categories and starting dollar amounts specific to
that profile. The user lands in a scenario already tailored to their
context rather than an empty tool.

## URL Structure

The scenario tool accepts a `state` query parameter containing
double-URL-encoded JSON. The JSON structure:

```json
{
  "months": 12,
  "view": "summary",
  "categories": [
    {
      "name": "Category Name",
      "monthly_spend": 5000,
      "medianRateDecimal": 0.14,
      "start_month": 1
    }
  ]
}
```

All categories use the same defaults except for `name` and
`monthly_spend`:
- `months`: 12
- `view`: "summary"
- `medianRateDecimal`: 0.14
- `start_month`: 1

## Changes by Profile

### Manufacturing (/profiles/manufacturing/)

Replace the existing scenario tool link with one carrying this state:

```json
{
  "months": 12,
  "view": "summary",
  "categories": [
    {"name": "Telecom", "monthly_spend": 5000, "medianRateDecimal": 0.14, "start_month": 1},
    {"name": "Waste and recycling", "monthly_spend": 6000, "medianRateDecimal": 0.14, "start_month": 1},
    {"name": "Uniforms", "monthly_spend": 8000, "medianRateDecimal": 0.14, "start_month": 1}
  ]
}
```

### Distribution (/profiles/distribution/)

Replace the existing scenario tool link with one carrying this state:

```json
{
  "months": 12,
  "view": "summary",
  "categories": [
    {"name": "Small package shipping", "monthly_spend": 30000, "medianRateDecimal": 0.14, "start_month": 1},
    {"name": "Credit card processing fees", "monthly_spend": 6000, "medianRateDecimal": 0.14, "start_month": 1}
  ]
}
```

### Nonprofits (/profiles/nonprofits/)

Replace the existing scenario tool link with one carrying this state:

```json
{
  "months": 12,
  "view": "summary",
  "categories": [
    {"name": "Telecom", "monthly_spend": 5000, "medianRateDecimal": 0.14, "start_month": 1},
    {"name": "Credit card processing fees", "monthly_spend": 6000, "medianRateDecimal": 0.14, "start_month": 1},
    {"name": "Software", "monthly_spend": 5000, "medianRateDecimal": 0.14, "start_month": 1}
  ]
}
```

## Encoding

Each JSON object should be:
1. Serialized to a JSON string
2. URL-encoded once with `encodeURIComponent()`
3. URL-encoded again with `encodeURIComponent()` — double encoding
   matches the existing tool's state parameter format

The resulting link format:

```
https://marginsteward.com/scenarios?state=<double-encoded-json>
```

## Link Treatment

The link text and surrounding copy on each profile page remain
unchanged — only the href changes. Each profile already has its
tool prompt section at the bottom of the page; this change updates
the href on those existing links.

## Implementation Approach

Encode each JSON payload at build time and hardcode the resulting
URL into the page. This is cleaner than client-side JS construction
since the values are static per profile.

## Notes

- The trailing slash on /scenarios is preserved in the link if the
  existing tool URL uses one — match the actual served URL pattern
- No changes to the scenario tool itself
- No changes to the profile page content or layout otherwise
- The nonprofit page also has a separate link to /payroll-savings/
  for the Section 125 reference — that link is unaffected by this
  change
