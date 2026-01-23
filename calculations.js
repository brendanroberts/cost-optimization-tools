// Calculation helpers for cumulative savings
export function computeCategoryCumulative(monthlySpend, medianRateDecimal, months) {
  const lowRate = medianRateDecimal * 0.9;
  const highRate = medianRateDecimal * 1.1;

  let totalLow = 0;
  let totalMedian = 0;
  let totalHigh = 0;

  const low = [];
  const median = [];
  const high = [];

  for (let i = 0; i < months; i++) {
    totalLow += monthlySpend * lowRate + (totalLow * lowRate);
    totalMedian += monthlySpend * medianRateDecimal + (totalMedian * medianRateDecimal);
    totalHigh += monthlySpend * highRate + (totalHigh * highRate);

    low.push(Math.round(totalLow));
    median.push(Math.round(totalMedian));
    high.push(Math.round(totalHigh));
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
    const { low, median, high } = computeCategoryCumulative(cat.monthly_spend, cat.medianRateDecimal ?? 0.14, months);
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
