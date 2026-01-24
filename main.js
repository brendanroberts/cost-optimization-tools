import { aggregateCategories } from './calculations.js';

let chartInstance = null;
let previousActiveElement = null;
let currentState = null;

// Color palette used across charts
const PALETTE = {
  navyblue: '#001f3f',
  'navyblue-50': '#8ecae6',
  'navyblue-100': '#45a29e',
  'navyblue-200': '#34675c',
  'navyblue-300': '#2d4f4a',
  'navyblue-400': '#23413b',
  'navyblue-500': '#1a3831',
  'navyblue-600': '#152e27',
  'navyblue-700': '#112321',
  'navyblue-800': '#0b1914',
  'navyblue-900': '#07100c'
};

function hexToRgba(hex, alpha = 1) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function formatUSD(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

// Small toast helper
function showToast(msg, timeout = 2000) {
  const t = document.createElement('div');
  t.className = 'fixed right-4 top-4 bg-navyblue text-white px-4 py-2 rounded shadow-lg z-60';
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(() => { try { t.remove(); } catch (e) {} }, timeout);
}

function renderCumulativeTable(months, low, median, high) {
  const container = document.getElementById('data-table');
  let html = '<table class="min-w-full bg-white text-sm"><thead><tr class="border-b"><th class="p-2 text-left">Month</th><th class="p-2 text-right">Low</th><th class="p-2 text-right">Median</th><th class="p-2 text-right">High</th></tr></thead><tbody>';
  for (let i = 0; i < months; i++) {
    html += `<tr class="border-b"><td class="p-2">${i+1}</td><td class="p-2 text-right">${formatUSD(low[i])}</td><td class="p-2 text-right">${formatUSD(median[i])}</td><td class="p-2 text-right">${formatUSD(high[i])}</td></tr>`;
  }
  html += '</tbody></table>';
  container.innerHTML = html;
}

function renderMonthlyTable(months, categories) {
  const container = document.getElementById('data-table');
  const catNames = categories.map(c => c.name || 'Category');
  let html = '<table class="min-w-full bg-white text-sm"><thead><tr class="border-b"><th class="p-2 text-left">Month</th>';
  catNames.forEach(name => { html += `<th class="p-2 text-right">${name}</th>`; });
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
  container.innerHTML = html;
}

function renderCumulativeChart(months, low, median, high) {
  const canvas = document.getElementById('myChart');
  // enforce fixed canvas height so re-renders don't grow the chart
  const FIXED_HEIGHT_PX = 420;
  canvas.style.height = FIXED_HEIGHT_PX + 'px';
  // set the canvas height attribute too (pixel height)
  canvas.height = FIXED_HEIGHT_PX;
  const ctx = canvas.getContext('2d');
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
    backgroundColor: hexToRgba(PALETTE['navyblue-100'], 0.18),
    pointRadius: 0,
    fill: '-1',
    tension: 0.2,
  };

  const medianDataset = {
    label: 'Median (14%)',
    data: median,
    borderColor: PALETTE['navyblue-500'],
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
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Month' } },
        y: { title: { display: true, text: 'Cumulative Savings (USD)' }, ticks: { callback: v => formatUSD(v) } }
      },
      plugins: { tooltip: { enabled: true } },
      interaction: { intersect: false, mode: 'index' }
    }
  });
}

function renderMonthlyChart(months, categories) {
  const canvas = document.getElementById('myChart');
  const FIXED_HEIGHT_PX = 420;
  canvas.style.height = FIXED_HEIGHT_PX + 'px';
  canvas.height = FIXED_HEIGHT_PX;
  const ctx = canvas.getContext('2d');
  const labels = Array.from({ length: months }, (_, i) => i + 1);

  if (chartInstance) chartInstance.destroy();

  const paletteKeys = ['navyblue-50','navyblue-100','navyblue-200','navyblue-300','navyblue-400','navyblue-500','navyblue-600','navyblue-700'];
  const colors = categories.map((c, idx) => PALETTE[paletteKeys[idx % paletteKeys.length]] || PALETTE.navyblue);
  const datasets = categories.map((cat, idx) => {
    const monthly = Number(cat.monthly_spend) || 0;
    const value = Math.round(monthly * (cat.medianRateDecimal ?? 0.14));
    const start = Number(cat.start_month) || 1;
    const data = Array.from({ length: months }, (_, i) => (i + 1) >= start ? value : 0);
    return {
      label: cat.name || `Cat ${idx+1}`,
      data,
      backgroundColor: colors[idx],
      stack: 'savings'
    };
  });

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        x: { stacked: true, title: { display: true, text: 'Month' } },
        y: { stacked: true, title: { display: true, text: 'Monthly Savings (USD)' }, ticks: { callback: v => formatUSD(v) } }
      },
      plugins: { tooltip: { enabled: true } }
    }
  });
}

function renderFromState(state) {
  if (!state) return;
  const months = state.months || 36;
  const view = state.view || 'cumulative';
  const titleEl = document.getElementById('table-title');
  if (titleEl) titleEl.innerText = (view === 'monthly') ? 'Monthly Savings Breakdown' : 'Cumulative Savings';
  if (view === 'monthly') {
    renderMonthlyChart(months, state.categories || []);
    renderMonthlyTable(months, state.categories || []);
  } else {
    const agg = aggregateCategories(state.categories || [], months);
    renderCumulativeChart(months, agg.low, agg.median, agg.high);
    renderCumulativeTable(months, agg.low, agg.median, agg.high);
  }
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
  // push a new history entry so back/forward navigates between states
  window.history.pushState({}, '', url.toString());
  // keep an in-memory copy of the current state for UI rendering
  currentState = state;
}

function clearChart() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  const container = document.getElementById('data-table');
  if (container) container.innerHTML = '';
}

function showModal(show) {
  const m = document.getElementById('initial-modal');
  if (!m) return;
  if (show) {
    previousActiveElement = document.activeElement;
    m.classList.remove('hidden');
    m.setAttribute('aria-hidden', 'false');
    // focus first input
    const first = m.querySelector('#modal-category');
    if (first) first.focus();
    // add keydown listener for Escape
    document.addEventListener('keydown', handleModalKeydown);
  } else {
    // move focus away from any element inside the modal before hiding it
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      try { previousActiveElement.focus(); } catch (e) { /* ignore */ }
    } else {
      const fallback = document.getElementById('months') || document.body;
      if (fallback && typeof fallback.focus === 'function') try { fallback.focus(); } catch (e) {}
    }

    m.classList.add('hidden');
    m.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleModalKeydown);
    previousActiveElement = null;
  }
}

function handleModalKeydown(e) {
  if (e.key === 'Escape') {
    showModal(false);
  }
}

function ensureAtLeastOneCategory(state) {
  if (!state.categories || !state.categories.length) {
    state.categories = [{ name: 'wireless telecom', monthly_spend: 1000, medianRateDecimal: 0.14, start_month: 1 }];
  }
}

function renderCategoryList(state) {
  const list = document.getElementById('categories-list');
  if (!list) return;
  ensureAtLeastOneCategory(state);
  list.innerHTML = '';
  state.categories.forEach((cat, idx) => {
    const row = document.createElement('div');
    row.className = 'p-2 rounded';

    // container with left column (name + amount) and right column (remove button)
    const container = document.createElement('div');
    container.className = 'flex items-start gap-2';

    const leftCol = document.createElement('div');
    leftCol.className = 'flex-1';

    const nameInput = document.createElement('input');
    nameInput.value = cat.name;
    nameInput.className = 'w-full p-2 rounded text-black text-sm';
    nameInput.addEventListener('change', (e) => {
      cat.name = e.target.value || 'Category';
      pushStateToUrl(state);
    });
    // update category labels live as user types
    nameInput.addEventListener('keyup', (e) => {
      cat.name = e.target.value || 'Category';
      pushStateToUrl(state);
      renderFromState(state);
    });

    const bottomRow = document.createElement('div');
    bottomRow.className = 'mt-2';

    const spendInput = document.createElement('input');
    spendInput.type = 'text';
    spendInput.value = (typeof cat.monthly_spend === 'number') ? String(cat.monthly_spend) : (cat.monthly_spend ?? '');
    spendInput.placeholder = 'Monthly spend';
    spendInput.className = 'w-full p-2 rounded text-sm text-black';
    spendInput.addEventListener('input', (e) => {
      const raw = e.target.value || '';
      const cleaned = raw.replace(/[^0-9-]/g, '');
      const v = parseInt(cleaned || '0', 10) || 0;
      cat.monthly_spend = v;
      pushStateToUrl(state);
      renderFromState(state);
    });

    bottomRow.appendChild(spendInput);
    // Start month input
    const startRow = document.createElement('div');
    startRow.className = 'mt-2 flex items-center gap-2';

    const startLabel = document.createElement('span');
    startLabel.className = 'text-xs text-gray-700';
    startLabel.innerText = 'Start';

    const startInput = document.createElement('input');
    startInput.type = 'number';
    startInput.min = 1;
    startInput.value = cat.start_month || 1;
    startInput.className = 'w-20 p-2 rounded text-sm text-black';
    startInput.addEventListener('input', (e) => {
      const v = parseInt(e.target.value || '1', 10) || 1;
      // clamp to at least 1
      cat.start_month = Math.max(1, v);
      pushStateToUrl(state);
      renderFromState(state);
    });

    startRow.appendChild(startLabel);
    startRow.appendChild(startInput);
    bottomRow.appendChild(startRow);
    // Rate input (percent) per category — text input with trailing % indicator
    const rateRow = document.createElement('div');
    rateRow.className = 'mt-2 flex items-center gap-2 text-sm';

    const rateWrapper = document.createElement('div');
    rateWrapper.className = 'relative w-24';

    const rateInput = document.createElement('input');
    rateInput.type = 'text';
    const percent = ((cat.medianRateDecimal ?? 0.14) * 100).toFixed(1);
    rateInput.value = percent;
    rateInput.setAttribute('aria-label', 'Savings rate percent');
    rateInput.className = 'w-full pr-8 p-2 rounded text-sm text-black';
    rateInput.addEventListener('input', (e) => {
      const raw = e.target.value || '14';
      const cleaned = String(raw).replace(/[^0-9.\-]/g, '');
      const p = parseFloat(cleaned);
      cat.medianRateDecimal = (isNaN(p) ? 0.14 : p / 100);
      pushStateToUrl(state);
      renderFromState(state);
    });

    const percentSpan = document.createElement('span');
    percentSpan.className = 'absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-700 pointer-events-none';
    percentSpan.innerText = '%';

    rateWrapper.appendChild(rateInput);
    rateWrapper.appendChild(percentSpan);
    rateRow.appendChild(rateWrapper);
    bottomRow.appendChild(rateRow);

    leftCol.appendChild(nameInput);
    leftCol.appendChild(bottomRow);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'text-sm text-white bg-navyblue px-2 py-1 rounded';
    removeBtn.innerText = '✕';
    removeBtn.title = 'Remove category';
    removeBtn.addEventListener('click', () => {
      if ((state.categories || []).length <= 1) {
        alert('At least one category is required');
        return;
      }
      state.categories.splice(idx, 1);
      pushStateToUrl(state);
      renderCategoryList(state);
      renderFromState(state);
    });

    container.appendChild(leftCol);
    container.appendChild(removeBtn);
    row.appendChild(container);
    list.appendChild(row);
  });
}

function addCategoryToState(state, name = 'New Category', monthly = 1000) {
  state.categories = state.categories || [];
  state.categories.push({ name, monthly_spend: monthly, medianRateDecimal: 0.14 });
  pushStateToUrl(state);
}

function loadFromState(state) {
  ensureAtLeastOneCategory(state);
  document.getElementById('months').value = state.months || 36;
  const viewEl = document.getElementById('view-mode');
  if (viewEl) viewEl.value = state.view || 'cumulative';
}

function collectStateFromUI(existingState) {
  const months = parseInt(document.getElementById('months').value, 10) || 36;
  const state = existingState || {};
  state.months = months;
  state.view = document.getElementById('view-mode')?.value || 'cumulative';
  // if categories already defined (from modal or URL), keep them; otherwise try to use modal inputs
  if (!state.categories || !state.categories.length) {
    const name = document.getElementById('modal-category')?.value || 'wireless telecom';
    const monthly = parseInt(document.getElementById('modal-monthly')?.value || '1000', 10) || 1000;
    state.categories = [{ name, monthly_spend: monthly, medianRateDecimal: 0.14 }];
  }
  return state;
}

function main() {
  // Handle URL state and initialize currentState so sidebar renders immediately
  const urlState = getStateFromUrl();
  if (urlState) {
    currentState = urlState;
    loadFromState(currentState);
    showModal(false);
    // render sidebar categories from state
    renderCategoryList(currentState);
  } else {
    // do not render categories yet — wait for user to complete the initial modal
    currentState = null;
    showModal(true);
  }

  // Modal start button
  document.getElementById('modal-start').addEventListener('click', () => {
    const state = collectStateFromUI();
    pushStateToUrl(state);

    // update in-memory state and sidebar
    currentState = state;
    renderCategoryList(currentState);

    // Render immediately so the user sees the chart without having to click Render
    renderFromState(state);

    // move focus to a non-modal control before hiding to avoid aria-hidden-on-focused-element
    const monthsEl = document.getElementById('months');
    if (monthsEl && typeof monthsEl.focus === 'function') monthsEl.focus();

    showModal(false);
  });

  // Close button
  const modalClose = document.getElementById('modal-close');
  if (modalClose) modalClose.addEventListener('click', () => showModal(false));

  // Backdrop click closes modal
  const modalBackdrop = document.getElementById('modal-backdrop');
  if (modalBackdrop) modalBackdrop.addEventListener('click', () => showModal(false));

  // Add category: open a quick prompt (keeps implementation light)
  const addCatBtn = document.getElementById('add-category');
  if (addCatBtn) {
    addCatBtn.addEventListener('click', () => {
      // require initial modal/state first
      if (!currentState) { showModal(true); return; }
      const name = prompt('Category name', 'New Category');
      const monthly = parseInt(prompt('Monthly spend (whole dollars)', '1000') || '1000', 10);
      if (!name) return;
      addCategoryToState(currentState, name, monthly);
      renderCategoryList(currentState);
      renderFromState(currentState);
    });
  }

  // Add category from aside (left rail)
  const asideAdd = document.getElementById('aside-add-category');
  if (asideAdd) {
    asideAdd.addEventListener('click', () => {
      // Ensure initial modal/state has been completed first
      if (!currentState) { showModal(true); return; }
      addCategoryToState(currentState, `Category ${ (currentState.categories||[]).length + 1 }`, 1000);
      renderCategoryList(currentState);
      renderFromState(currentState);
    });
  }

  // Immediate render when months selector changes
  const monthsSelect = document.getElementById('months');
  if (monthsSelect) {
    monthsSelect.addEventListener('change', (e) => {
      const months = parseInt(e.target.value, 10) || 36;
      let state = getStateFromUrl() || {};
      state.months = months;
      if (!state.categories || !state.categories.length) state = collectStateFromUI(state);
      pushStateToUrl(state);
      renderFromState(state);
    });
  }

  // Reset button: remove state from URL and show modal
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const url = new URL(window.location.href);
      url.searchParams.delete('state');
      // push the reset state so back will restore previous state
      window.history.pushState({}, '', url.toString());
      clearChart();
      // reset months control to default
      const monthsEl = document.getElementById('months');
      if (monthsEl) monthsEl.value = 36;
      // clear categories list UI as well
      const list = document.getElementById('categories-list');
      if (list) list.innerHTML = '';
      currentState = null;
      showModal(true);
    });
  }

  // Bookmark button: copy current URL (with state) to clipboard
  const bookmarkBtn = document.getElementById('bookmark-btn');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', async () => {
      // ensure we have state in URL
      let state = currentState || getStateFromUrl() || {};
      if (!state || !state.categories || !state.categories.length) {
        state = collectStateFromUI(state);
      }
      pushStateToUrl(state);
      const url = window.location.href;
      try {
        await navigator.clipboard.writeText(url);
        showToast('Scenario link copied to clipboard');
      } catch (err) {
        // fallback: prompt
        prompt('Copy this URL', url);
      }
    });
  }

  // View mode selector
  const viewSelect = document.getElementById('view-mode');
  if (viewSelect) {
    viewSelect.addEventListener('change', (e) => {
      const view = e.target.value || 'cumulative';
      let state = getStateFromUrl() || {};
      state.view = view;
      if (!state.categories || !state.categories.length) state = collectStateFromUI(state);
      pushStateToUrl(state);
      renderFromState(state);
    });
  }

  // Render on form submit
  document.getElementById('chart-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let state = getStateFromUrl() || {};
    state = collectStateFromUI(state);
    pushStateToUrl(state);
    renderFromState(state);
  });

  // If URL state existed, render immediately
  if (urlState) {
    renderFromState(urlState);
  }

  // If the months selector has autofocus on load, remove it to avoid unexpected focus
  const monthsElInit = document.getElementById('months');
  if (monthsElInit && document.activeElement === monthsElInit) {
    try { monthsElInit.blur(); } catch (e) { /* ignore */ }
  }
}

document.addEventListener('DOMContentLoaded', main);
