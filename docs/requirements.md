# Cost Optimization Insight Tool

## Overview
This project is a lightweight, web-based cost savings insight calculator designed for accountants and CFOs. It is intentionally neutral, conservative, and exploratory. It is not a sales tool or forecasting engine.

The goal is to help users build confidence in understanding vendor cost optimization potential through clear visuals and repeatable narratives.

---

## Core Principles

- Neutral, analytical tone
- No guarantees or sales language
- Anonymous, low-friction usage
- Confidence-building over urgency
- Conservative assumptions

---

## Default Assumptions

- Default savings rate shown: **14%**
  - This represents half of an underlying 28% average
  - No explanation is provided in the UI
- Savings range: ±20% of default
  - Low: 11.2%
  - High: 16.8%

---

## User Flow

### Initial Modal
Displayed on first load unless valid URL parameters are present.

Required inputs:
- Category (dropdown)
- Monthly spend (numeric, USD)

At least one category must always exist.

Reset returns the user to this modal and clears state.

---

## Charting Requirements

### Chart Types
- Cumulative (default)
- Monthly

### Timeframes
- 36 months
- 60 months

### Cumulative View
- X-axis: months
- Y-axis: cumulative savings ($)
- Shaded band: low-to-high range
- Thin median line (14%)
- Hover tooltip shows month, low, median, high

### Monthly View
- Bar chart
- Bars show median monthly savings
- Tooltip shows low/high range

### Multiple Categories
- Support adding multiple categories
- Categories appear as stacked or overlaid series
- At least one category always present

---

## Table Requirements

Displayed below the chart.

Columns:
- Month
- Category
- Low estimate ($)
- Median estimate ($)
- High estimate ($)
- Cumulative total ($)

Values should be rounded to whole dollars.

---

## Controls

- Toggle: Cumulative / Monthly
- Toggle: 36 / 60 months
- Add category
- Reset

---

## URL State

All inputs and toggles must be encoded as query parameters.

- Categories
- Monthly spend
- Timeframe
- Chart type

Loading a valid URL restores state and skips the modal.

---

## Visual Design

- Navy blue primary color
- Fonts: Arial, optionally Calibri
- Minimal animation
- Conservative visual style

---

## Non-Goals

- Lead capture
- AI branding
- Forecasting guarantees
- Aggressive alerts or warnings
