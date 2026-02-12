import { formatUSD } from './constants.js';

export function generateCumulativeTableHTML(months, low, median, high) {
  let html = '<table class="min-w-full bg-white text-sm"><thead><tr class="border-b"><th style="text-align: right;" class="p-2">Month</th><th style="text-align: right;" class="p-2 text-right">Low</th><th style="text-align: right;" class="p-2 text-right">Median</th><th style="text-align: right;" class="p-2 text-right">High</th></tr></thead><tbody>';
  for (let i = 0; i < months; i++) {
    html += `<tr class="border-b"><td style="text-align: right;" class="p-2">${i+1}</td><td style="text-align: right;" class="p-2 text-right">${formatUSD(low[i])}</td><td style="text-align: right;" class="p-2 text-right">${formatUSD(median[i])}</td><td style="text-align: right;" class="p-2 text-right">${formatUSD(high[i])}</td></tr>`;
  }
  html += '</tbody></table>';
  return html;
}

export function generateMonthlyTableHTML(months, categories) {
  const catNames = categories.map(c => c.name || 'Category');
  let html = '<table class="min-w-full bg-white text-sm"><thead><tr class="border-b"><th style="text-align: right;" class="p-2">Month</th>';
  catNames.forEach(name => { html += `<th style="text-align: right;" class="p-2 text-right">${escapeHtml(name)}</th>`; });
  html += '<th style="text-align: right;" class="p-2 text-right">Total</th></tr></thead><tbody>';

  for (let m = 0; m < months; m++) {
    let row = `<tr style="text-align: right;" class="border-b"><td class="p-2">${m+1}</td>`;
    let total = 0;
    categories.forEach(cat => {
      const monthly = Number(cat.monthly_spend) || 0;
      const start = Number(cat.start_month) || 1;
      const value = ((m + 1) >= start) ? Math.round(monthly * (cat.medianRateDecimal ?? 0.14)) : 0;
      total += value;
      row += `<td style="text-align: right;" class="p-2 text-right">${formatUSD(value)}</td>`;
    });
    row += `<td style="text-align: right;" class="p-2 text-right">${formatUSD(total)}</td></tr>`;
    html += row;
  }
  html += '</tbody></table>';
  return html;
}

export function renderReportIntro(state) {
  const rows = (state.categories || []).map(cat => {
    return `<tr class="border-b"><td style="text-align: left;" class="p-2">${escapeHtml(cat.name || '')}</td><td style="text-align: right;" class="p-2 text-right">${formatUSD(Number(cat.monthly_spend)||0)}</td><td style="text-align: right;" class="p-2 text-right">${((cat.medianRateDecimal||0)*100).toFixed(0)}%</td><td style="text-align: right;" class="p-2 text-right">${Number(cat.start_month||1)}</td></tr>`;
  }).join('\n');
  return `<h2>Assumptions</h2><table class="min-w-full bg-white text-sm"><thead><tr class="border-b"><th style="text-align: left;" class="p-2 text-left">Category</th><th style="text-align: right;" class="p-2 text-right">Monthly Spend</th><th style="text-align: right;" class="p-2 text-right">Estimated vendor cost reduction (%)</th><th style="text-align: right;" class="p-2 text-right">Start Month</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

export const reductionPercentTooltip = '<div class="tooltip-wrapper">\
      <div class="font-medium text-white mt-2 cursor-help">Estimated vendor<br>cost reduction (%)</div>\
      <div class="tooltip-content no-print" role="tooltip" aria-hidden="true">\
          <div class="text-sm">\
              Estimated percentage reduction in vendor spend achievable through pricing alignment, service-level adjustments, or competitive pressure. Actual results vary by category.\
          </div>\
      </div>\
    </div>';