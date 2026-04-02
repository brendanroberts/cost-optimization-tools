# Onboarding UX Specification --- Static Vanilla JS Pipeline

## System Overview (UX Intent)

This system is a **procedural onboarding assistant**, not a marketing
funnel.

Tone:

> neutral, tool-like, predictable

User mental model:

> "I am preparing onboarding."

------------------------------------------------------------------------

## Page Flow Specification

### PAGE 1 --- Scenario → Engagement Transition

**Goal**\
Convert modeling curiosity into intentional onboarding.

**UX Elements**

At bottom of scenario tool:

    Ready to act on one or more categories?

    → Begin onboarding preparation

No urgency or marketing tone.

**Behavior**

-   Parse URL state into onboarding context
-   Categories displayed on next page

------------------------------------------------------------------------

### PAGE 2 --- Category Engagement Selector

**Goal**\
Create explicit commitment and clarify document expectations.

**Layout**

    Step 1 of 3 — Select categories to onboard

For each category:

    ☐ Category Name
    Monthly spend: $X
    Estimated reduction: Y%

    To proceed, you’ll need:
    • 3 recent invoices OR
    • Online billing access

**Footer**

    Continue → Preparation overview

**Validation**

-   At least one category selected
-   Inline message only:

> "Select at least one category to continue."

No popups.

------------------------------------------------------------------------

### PAGE 3 --- Preparation Overview

**Goal**\
Set expectations and reduce onboarding anxiety.

#### Section --- What Happens Next

    After submission:

    1. I’ll contact you by email to schedule a short onboarding call.
    2. During that call we will:
       • review invoices or portal access
       • review and sign service agreement
       • execute authorization documents
    3. Work begins after documents are complete.

Tone: procedural and calm.

#### Section --- What To Prepare

Auto-generated per selected category:

    For Category:
    • last 3 invoices OR portal login

**Footer**

    I’m ready → Submit onboarding request

------------------------------------------------------------------------

### PAGE 4 --- Submission Form

**Goal**\
Capture contact information and transmit onboarding intent.

Fields:

    Name (required)
    Business name (optional)
    Email (required)
    Phone (optional)
    Notes (optional)

Checkbox:

    ☐ I understand onboarding requires invoices and signed documents

**Submit Button**

    Submit onboarding request

------------------------------------------------------------------------

## Submission State UX

### Loading State

Button changes to:

    Submitting…

Optional spinner. No overlays.

------------------------------------------------------------------------

### Success State

Inline confirmation replaces form:

    ✓ Onboarding request received

    I’ll contact you shortly by email to schedule a call.
    You can close this page.

Optional:

    Download preparation checklist

------------------------------------------------------------------------

### Failure State

Inline message:

    Submission failed.

    Please try again or email:
    [your email]

Form contents preserved.

------------------------------------------------------------------------

## Error Handling Philosophy

### Client-Side Validation

Use native browser validation:

-   required attributes
-   email input type
-   inline feedback

Avoid heavy custom validation frameworks.

------------------------------------------------------------------------

### Network Failure Handling

Pattern:

    try submit
    catch error
    show inline message
    retain state

No automatic retries or hidden timers.

------------------------------------------------------------------------

### Edge Case Handling

  Case               Behavior
  ------------------ ---------------------------
  Empty categories   prevent continue
  Lost URL state     show restart link
  Submit timeout     inline retry
  Partial input      preserved in localStorage

------------------------------------------------------------------------

## State Management Specification

All onboarding state stored in:

    localStorage.onboardingContext

Structure:

    {
      scenarioCategories,
      selectedCategories,
      contactInfo,
      timestamp
    }

Rules:

-   Update after each step
-   Restore on reload
-   Clear on success

No cookies required.

------------------------------------------------------------------------

## Accessibility + Simplicity Rules

Developer guidelines:

-   semantic HTML
-   label-associated inputs
-   keyboard navigation intact
-   readable layout without JS where possible
-   avoid modal dialogs

------------------------------------------------------------------------

## Copy Style Guide

Tone:

✔ neutral\
✔ procedural\
✔ confident\
✔ non-salesy

Avoid:

✘ hype\
✘ urgency triggers\
✘ persuasion language

Voice should resemble onboarding instructions for professional software.

------------------------------------------------------------------------

## Developer Architecture Notes

Suggested structure:

    /scenario.html
    /onboarding.html
    /app.js
    /styles.css

JS responsibilities:

-   Parse URL state
-   Render steps
-   Persist localStorage
-   Submit payload
-   Handle UI transitions

Vanilla DOM manipulation is sufficient.

------------------------------------------------------------------------

## Psychological UX Goals

Each page answers a hidden user concern:

Scenario → "Is this relevant?"\
Selection → "What am I committing to?"\
Preparation → "What happens next?"\
Submission → "Did it work?"

Reducing uncertainty increases trust and completion.
