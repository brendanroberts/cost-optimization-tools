import { formatUSD } from './constants.js';

export function generateCumulativeTableHTML(months, low, median, high) {
  let html = '<table><thead><tr><th class="num">Month</th><th class="num">Low</th><th class="num">Median</th><th class="num">High</th></tr></thead><tbody>';
  for (let i = 0; i < months; i++) {
    html += `<tr><td class="num">${i+1}</td><td class="figure num">${formatUSD(low[i])}</td><td class="figure num">${formatUSD(median[i])}</td><td class="figure num">${formatUSD(high[i])}</td></tr>`;
  }
  html += '</tbody></table>';
  return html;
}

export function generateMonthlyTableHTML(months, categories) {
  const catNames = categories.map(c => c.name || 'Category');
  let html = '<table><thead><tr><th class="num">Month</th>';
  catNames.forEach(name => { html += `<th class="num">${escapeHtml(name)}</th>`; });
  html += '<th class="num">Total</th></tr></thead><tbody>';

  for (let m = 0; m < months; m++) {
    let row = `<tr><td class="num">${m+1}</td>`;
    let total = 0;
    categories.forEach(cat => {
      const monthly = Number(cat.monthly_spend) || 0;
      const start = Number(cat.start_month) || 1;
      const value = ((m + 1) >= start) ? Math.round(monthly * (cat.medianRateDecimal ?? 0.14)) : 0;
      total += value;
      row += `<td class="figure num">${formatUSD(value)}</td>`;
    });
    row += `<td class="figure num">${formatUSD(total)}</td></tr>`;
    html += row;
  }
  html += '</tbody></table>';
  return html;
}

export function renderReportIntro(state) {
  const rows = (state.categories || []).map(cat => {
    return `<tr><td>${escapeHtml(cat.name || '')}</td><td class="figure num">${formatUSD(Number(cat.monthly_spend)||0)}</td><td class="num">${((cat.medianRateDecimal||0)*100).toFixed(0)}%</td><td class="num">${Number(cat.start_month||1)}</td></tr>`;
  }).join('\n');
  return `<h2>Assumptions</h2><table><thead><tr><th>Category</th><th class="num">Monthly Spend</th><th class="num">Est. cost reduction (%)</th><th class="num">Start Month</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

export function generateSummaryHTML(categories) {
  const totalMonthly = (categories || []).reduce((sum, cat) => {
    return sum + (Number(cat.monthly_spend) || 0) * (cat.medianRateDecimal ?? 0.14);
  }, 0);

  const rows = (categories || []).map(cat => {
    const monthlySavings = Math.round((Number(cat.monthly_spend) || 0) * (cat.medianRateDecimal ?? 0.14));
    return `<div class="summary-row">
      <span>${escapeHtml(cat.name || 'Category')}</span>
      <span class="summary-row-figure">${formatUSD(monthlySavings)}</span>
    </div>`;
  }).join('');

  return `<div style="padding:var(--space-3) 0;">
  <p class="summary-header">Monthly savings at full optimization</p>
  <p class="summary-total">${formatUSD(Math.round(totalMonthly))}</p>
  <div class="summary-breakdown">
    ${rows}
  </div>
</div>`;
}

export const reductionPercentTooltip = '<div class="tooltip-wrapper">\
      <div class="cat-label cursor-help" style="margin-top:var(--space-2);">Estimated vendor<br>cost reduction (%)</div>\
      <div class="tooltip-content no-print" role="tooltip" aria-hidden="true">\
          Estimated percentage reduction in vendor spend achievable through pricing alignment, service-level adjustments, or competitive pressure. Actual results vary by category.\
      </div>\
    </div>';
