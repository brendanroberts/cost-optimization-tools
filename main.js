import { aggregateCategories } from './calculations.js';

let chartInstance = null;

function formatUSD(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function renderTable(months, low, median, high) {
  const container = document.getElementById('data-table');
  let html = '<table class="min-w-full bg-white text-sm"><thead><tr class="border-b"><th class="p-2 text-left">Month</th><th class="p-2 text-right">Low</th><th class="p-2 text-right">Median</th><th class="p-2 text-right">High</th></tr></thead><tbody>';
  for (let i = 0; i < months; i++) {
    html += `<tr class="border-b"><td class="p-2">${i+1}</td><td class="p-2 text-right">${formatUSD(low[i])}</td><td class="p-2 text-right">${formatUSD(median[i])}</td><td class="p-2 text-right">${formatUSD(high[i])}</td></tr>`;
  }
  html += '</tbody></table>';
  container.innerHTML = html;
}

function renderChart(months, low, median, high) {
  const ctx = document.getElementById('myChart').getContext('2d');
  const labels = Array.from({ length: months }, (_, i) => i + 1);

  // Destroy existing chart
  if (chartInstance) chartInstance.destroy();

  // Low dataset (baseline for band)
  const lowDataset = {
    label: 'Low',
    data: low,
    borderColor: 'rgba(0,0,0,0)',
    backgroundColor: 'rgba(0,0,0,0)',
    pointRadius: 0,
    fill: false,
    tension: 0.2,
  };

  // High dataset fills to previous dataset (low) creating shaded band
  const highDataset = {
    label: 'High',
    data: high,
    borderColor: 'rgba(0,0,0,0)',
    backgroundColor: 'rgba(0, 51, 102, 0.18)',
    pointRadius: 0,
    fill: '-1',
    tension: 0.2,
  };

  const medianDataset = {
    label: 'Median (14%)',
    data: median,
    borderColor: 'rgba(0, 51, 102, 1)',
    backgroundColor: 'rgba(0,0,0,0)',
    pointRadius: 2,
    fill: false,
    tension: 0.2,
  };

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [lowDataset, highDataset, medianDataset]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Month' } },
        y: { title: { display: true, text: 'Cumulative Savings (USD)' }, ticks: { callback: v => formatUSD(v) } }
      },
      plugins: { tooltip: { enabled: true } },
      interaction: { intersect: false, mode: 'index' }
    }
  });
}

function getStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('state')) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(params.get('state')));
    return parsed;
  } catch (e) {
    console.warn('Invalid state param');
    return null;
  }
}

function pushStateToUrl(state) {
  const s = encodeURIComponent(JSON.stringify(state));
  const url = new URL(window.location.href);
  url.searchParams.set('state', s);
  window.history.replaceState({}, '', url.toString());
}

function showModal(show) {
  const m = document.getElementById('initial-modal');
  if (show) m.classList.remove('hidden'); else m.classList.add('hidden');
}

function ensureAtLeastOneCategory(state) {
  if (!state.categories || !state.categories.length) {
    state.categories = [{ name: 'General', monthly_spend: 1000, medianRateDecimal: 0.14 }];
  }
}

function loadFromState(state) {
  ensureAtLeastOneCategory(state);
  document.getElementById('months').value = state.months || 36;
}

function collectStateFromUI(existingState) {
  const months = parseInt(document.getElementById('months').value, 10) || 36;
  const state = existingState || {};
  state.months = months;
  // if categories already defined (from modal or URL), keep them; otherwise try to use modal inputs
  if (!state.categories || !state.categories.length) {
    const name = document.getElementById('modal-category')?.value || 'General';
    const monthly = parseInt(document.getElementById('modal-monthly')?.value || '1000', 10) || 1000;
    state.categories = [{ name, monthly_spend: monthly, medianRateDecimal: 0.14 }];
  }
  return state;
}

function main() {
  // Handle URL state
  const urlState = getStateFromUrl();
  if (urlState) {
    loadFromState(urlState);
    showModal(false);
  } else {
    showModal(true);
  }

  // Modal start button
  document.getElementById('modal-start').addEventListener('click', () => {
    const state = collectStateFromUI();
    pushStateToUrl(state);
    showModal(false);
  });

  // Add category: open a quick prompt (keeps implementation light)
  document.getElementById('add-category').addEventListener('click', () => {
    const name = prompt('Category name', 'New Category');
    const monthly = parseInt(prompt('Monthly spend (whole dollars)', '1000') || '1000', 10);
    if (!name) return;
    const state = getStateFromUrl() || {};
    state.categories = state.categories || [];
    state.categories.push({ name, monthly_spend: monthly, medianRateDecimal: 0.14 });
    pushStateToUrl(state);
    alert('Category added — click Render Chart to update.');
  });

  // Render on form submit
  document.getElementById('chart-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let state = getStateFromUrl() || {};
    state = collectStateFromUI(state);
    pushStateToUrl(state);

    const months = state.months || 36;
    const agg = aggregateCategories(state.categories, months);
    renderChart(months, agg.low, agg.median, agg.high);
    renderTable(months, agg.low, agg.median, agg.high);
  });

  // If URL state existed, render immediately
  if (urlState) {
    const months = urlState.months || 36;
    const agg = aggregateCategories(urlState.categories, months);
    renderChart(months, agg.low, agg.median, agg.high);
    renderTable(months, agg.low, agg.median, agg.high);
  }
}

document.addEventListener('DOMContentLoaded', main);
