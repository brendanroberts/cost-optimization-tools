import { formatUSD } from './constants.js';

export function generateCumulativeTableHTML(months, low, median, high) {
  let html = '<table class="min-w-full bg-white text-sm"><thead><tr class="border-b"><th class="p-2 text-left">Month</th><th class="p-2 text-right">Low</th><th class="p-2 text-right">Median</th><th class="p-2 text-right">High</th></tr></thead><tbody>';
  for (let i = 0; i < months; i++) {
    html += `<tr class="border-b"><td class="p-2">${i+1}</td><td class="p-2 text-right">${formatUSD(low[i])}</td><td class="p-2 text-right">${formatUSD(median[i])}</td><td class="p-2 text-right">${formatUSD(high[i])}</td></tr>`;
  }
  html += '</tbody></table>';
  return html;
}

export function generateMonthlyTableHTML(months, categories) {
  const catNames = categories.map(c => c.name || 'Category');
  let html = '<table class="min-w-full bg-white text-sm"><thead><tr class="border-b"><th class="p-2 text-left">Month</th>';
  catNames.forEach(name => { html += `<th class="p-2 text-right">${escapeHtml(name)}</th>`; });
  html += '<th class="p-2 text-right">Total</th></tr></thead><tbody>';

  for (let m = 0; m < months; m++) {
    let row = `<tr class="border-b"><td class="p-2">${m+1}</td>`;
    let total = 0;
    categories.forEach(cat => {
      const monthly = Number(cat.monthly_spend) || 0;
      const start = Number(cat.start_month) || 1;
      const value = ((m + 1) >= start) ? Math.round(monthly * (cat.medianRateDecimal ?? 0.14)) : 0;
      total += value;
      row += `<td class="p-2 text-right">${formatUSD(value)}</td>`;
    });
    row += `<td class="p-2 text-right">${formatUSD(total)}</td></tr>`;
    html += row;
  }
  html += '</tbody></table>';
  return html;
}

export function renderReportIntro(state) {
  const rows = (state.categories || []).map(cat => {
    return `<tr class="border-b"><td class="p-2">${escapeHtml(cat.name || '')}</td><td class="p-2 text-right">${formatUSD(Number(cat.monthly_spend)||0)}</td><td class="p-2 text-right">${((cat.medianRateDecimal||0)*100).toFixed(1)}%</td><td class="p-2 text-right">${Number(cat.start_month||1)}</td></tr>`;
  }).join('\n');
  return `<h2>Assumptions</h2><table class="min-w-full bg-white text-sm"><thead><tr class="border-b"><th class="p-2 text-left">Category</th><th class="p-2 text-right">Monthly Spend</th><th class="p-2 text-right">Savings Rate</th><th class="p-2 text-right">Start Month</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

