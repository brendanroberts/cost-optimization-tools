// Calculation helpers for cumulative savings
export function computeCategoryCumulative(monthlySpend, medianRateDecimal, months, startMonth = 1) {
  const lowRate = medianRateDecimal * 0.9;
  const highRate = medianRateDecimal * 1.1;

  // ensure numeric monthlySpend
  const monthly = Number(monthlySpend) || 0;

  let cumulativeLow = 0;
  let cumulativeMedian = 0;
  let cumulativeHigh = 0;

  const low = [];
  const median = [];
  const high = [];

  // Each month, if month >= startMonth then savings = monthly * rate; cumulative adds the monthly savings (no compounding)
  for (let i = 0; i < months; i++) {
    const monthIndex = i + 1;
    if (monthIndex >= startMonth) {
      cumulativeLow += monthly * lowRate;
      cumulativeMedian += monthly * medianRateDecimal;
      cumulativeHigh += monthly * highRate;
    }

    low.push(Math.round(cumulativeLow));
    median.push(Math.round(cumulativeMedian));
    high.push(Math.round(cumulativeHigh));
  }

  return { low, median, high };
}

// Aggregate multiple categories by summing per-month values
export function aggregateCategories(categories, months) {
  // categories: [{name, monthly_spend, medianRateDecimal}]
  const aggLow = new Array(months).fill(0);
  const aggMedian = new Array(months).fill(0);
  const aggHigh = new Array(months).fill(0);

  categories.forEach(cat => {
    const { low, median, high } = computeCategoryCumulative(cat.monthly_spend, cat.medianRateDecimal ?? 0.14, months, cat.start_month ?? 1);
    for (let i = 0; i < months; i++) {
      aggLow[i] += low[i];
      aggMedian[i] += median[i];
      aggHigh[i] += high[i];
    }
  });

  // Round aggregated values to whole dollars
  return {
    low: aggLow.map(v => Math.round(v)),
    median: aggMedian.map(v => Math.round(v)),
    high: aggHigh.map(v => Math.round(v)),
  };
}
