import { aggregateCategories } from './calculations.js';

let chartInstance = null;
let previousActiveElement = null;
let currentState = null;

// Color palette used across charts

/*
Primary data series → #12456C
Secondary data → #2F6F9F, #4F82AB
Contextual / historical data → #7D9BC0, #AFC2DA
Grids / axes → #B8BDC3
Text → #2E2E2E
*/

const PALETTE = {
  // Light to dark blues (from index.html comment palette)
  'navyblue-50': '#E6EDF5',
  'navyblue-100': '#AFC2DA',
  'navyblue-200': '#7D9BC0',
  'navyblue-300': '#4F82AB',
  'navyblue-400': '#2F6F9F',
  'navyblue-500': '#1E5D8A',
  'navyblue-600': '#12456C',
  'navyblue-700': '#0B2F4A',
  // neutrals for deep accents and text
  'navyblue-800': '#4A4F55',
  'navyblue-900': '#2E2E2E',
  // primary (brand/nav)
  navyblue: '#12456C',
  // complementary accents
  'accent-teal': '#2E8B57',
  'accent-orange': '#E68A00',
  'accent-yellow': '#F2C94C'
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

// store original intro content so we can restore it after report mode
let _origIntroHTML = null;

function renderReportIntro(state) {
  const rows = (state.categories || []).map(cat => {
    return `<tr class=""><td class="p-2 text-left">${escapeHtml(cat.name || '')}</td><td class="p-2 text-right">${formatUSD(Number(cat.monthly_spend)||0)}</td><td class="p-2 text-right">${((cat.medianRateDecimal||0)*100).toFixed(1)}%</td><td class="p-2 text-right">${Number(cat.start_month||1)}</td></tr>`;
  }).join('\n');
  return `<table class="min-w-full bg-white text-sm"><tr class=""><th class="p-2 text-left">Category</th><th class="p-2 text-right">Monthly Spend</th><th class="p-2 text-right">Savings Rate</th><th class="p-2 text-right">Starting Month</th></tr>${rows}</table>`;
}

function generateCumulativeTableHTML(months, low, median, high) {
  let html = '<table class="min-w-full bg-white text-sm"><thead><tr class="border-b"><th class="p-2 text-right">Month</th><th class="p-2 text-right">Low</th><th class="p-2 text-right">Median</th><th class="p-2 text-right">High</th></tr></thead><tbody>';
  for (let i = 0; i < months; i++) {
    html += `<tr class="border-b"><td class="p-2 text-right">${i+1}</td><td class="p-2 text-right">${formatUSD(low[i])}</td><td class="p-2 text-right">${formatUSD(median[i])}</td><td class="p-2 text-right">${formatUSD(high[i])}</td></tr>`;
  }
  html += '</tbody></table>';
  return html;
}

function generateMonthlyTableHTML(months, categories) {
  const catNames = categories.map(c => c.name || 'Category');
  let html = '<table class="min-w-full bg-white text-sm"><thead><tr class="border-b"><th class="p-2 text-right">Month</th>';
  catNames.forEach(name => { html += `<th class="p-2 text-right">${escapeHtml(name)}</th>`; });
  html += '<th class="p-2 text-right">Total</th></tr></thead><tbody>';

  for (let m = 0; m < months; m++) {
    let row = `<tr class="border-b"><td class="p-2 text-right">${m+1}</td>`;
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

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// function toggleReportMode(enabled) {
//   const body = document.body;
//   if (enabled) {
//     body.classList.add('report-mode');
//     const intro = document.getElementById('intro-text');
//     if (intro && _origIntroHTML === null) _origIntroHTML = intro.innerHTML;
//     const state = currentState || getStateFromUrl() || collectStateFromUI();
//     if (intro) intro.innerHTML = renderReportIntro(state);
//     // update table title
//     const titleEl = document.getElementById('table-title');
//     if (titleEl) titleEl.innerText = (state.view === 'monthly') ? 'Monthly Savings (Report)' : 'Cumulative Savings (Report)';
//   } else {
//     body.classList.remove('report-mode');
//     const intro = document.getElementById('intro-text');
//     if (intro && _origIntroHTML !== null) intro.innerHTML = _origIntroHTML;
//     // restore table title
//     const titleEl = document.getElementById('table-title');
//     if (titleEl) titleEl.innerText = (document.getElementById('view-mode')?.value === 'monthly') ? 'Monthly Savings Breakdown' : 'Cumulative Savings';
//   }
// }

// Small toast helper
function showToast(msg, timeout = 2000) {
  const t = document.createElement('div');
  t.className = 'fixed right-4 top-4 bg-grey-500 text-white px-4 py-2 rounded shadow-lg z-60';
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(() => { try { t.remove(); } catch (e) {} }, timeout);
}

function renderCumulativeTable(months, low, median, high) {
  const container = document.getElementById('data-table');
  container.innerHTML = generateCumulativeTableHTML(months, low, median, high);
}

function renderMonthlyTable(months, categories) {
  const container = document.getElementById('data-table');
  container.innerHTML = generateMonthlyTableHTML(months, categories);
}

function renderCumulativeChart(months, low, median, high, canvasEl = null) {
  const canvas = canvasEl || document.getElementById('myChart');
  const FIXED_HEIGHT_PX = 420;
  canvas.style.height = FIXED_HEIGHT_PX + 'px';
  canvas.height = FIXED_HEIGHT_PX;
  const ctx = canvas.getContext('2d');
  const labels = Array.from({ length: months }, (_, i) => i + 1);

  // datasets
  const lowDataset = {
    label: 'Low',
    data: low,
    borderColor: 'rgba(0,0,0,0)',
    backgroundColor: 'rgba(0,0,0,0)',
    pointRadius: 0,
    fill: false,
    tension: 0.2,
  };

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

  const cfg = {
    type: 'line',
    data: { labels, datasets: [lowDataset, highDataset, medianDataset] },
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
  };

  if (canvasEl) {
    const tmp = new Chart(ctx, cfg);
    return tmp;
  }

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, cfg);
  return chartInstance;
}

function renderMonthlyChart(months, categories, canvasEl = null) {
  const canvas = canvasEl || document.getElementById('myChart');
  const FIXED_HEIGHT_PX = 420;
  canvas.style.height = FIXED_HEIGHT_PX + 'px';
  canvas.height = FIXED_HEIGHT_PX;
  const ctx = canvas.getContext('2d');
  const labels = Array.from({ length: months }, (_, i) => i + 1);

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

  const cfg = {
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
  };

  if (canvasEl) {
    const tmp = new Chart(ctx, cfg);
    return tmp;
  }

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, cfg);
  return chartInstance;
}

function renderFromState(state) {
  if (!state) return;
  const months = state.months || 36;
  const view = state.view || 'cumulative';
  const titleEl = document.getElementById('table-title');
  if (titleEl) titleEl.innerText = (view === 'monthly') ? 'Monthly Savings Breakdown' : 'Cumulative Savings';
  
  const chartDesc = document.getElementById('chart-desc');
  if (chartDesc) chartDesc.innerText = (view === 'monthly') ? '' : 'Shaded band indicates a ±10% range around the cumulative savings rate';
  
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

    const nameLabel = document.createElement('label');
    nameLabel.className = 'block text-sm font-medium text-white';
    nameLabel.innerText = 'Category';

    const nameInput = document.createElement('input');
    nameInput.id = `cat-name-${idx}`;
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

    
    // Start month input
    const bottomRow = document.createElement('div');
    bottomRow.className = 'mt-6';

    const spendLabel = document.createElement('label');
    spendLabel.className = 'block text-sm font-medium text-white';
    spendLabel.innerText = 'Monthly spend (USD)';

    const spendInput = document.createElement('input');
    spendInput.id = `cat-spend-${idx}`;
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

    const inputContainer = document.createElement('div');
    inputContainer.className = 'mt-2';
    inputContainer.appendChild(spendInput);
    
    bottomRow.appendChild(spendLabel);
    bottomRow.appendChild(inputContainer);



    // Start month input
    const startRow = document.createElement('div');
    startRow.className = 'mt-6';

    const startLabel = document.createElement('label');
    startLabel.className = 'block text-sm font-medium text-white';
    startLabel.innerText = 'Start month';

    const startInput = document.createElement('input');
    startInput.id = `cat-start-${idx}`;
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

    const startMonthContainer = document.createElement('div');
    startMonthContainer.className = 'mt-2';
    startMonthContainer.appendChild(startInput);

    startRow.appendChild(startLabel);
    startRow.appendChild(startMonthContainer);
    bottomRow.appendChild(startRow);
    


    // Rate input (percent) per category — text input with trailing % indicator
    const rateRow = document.createElement('div');
    rateRow.className = 'mt-6';

    const rateLabel = document.createElement('label');
    rateLabel.className = 'block text-sm font-medium text-white';
    rateLabel.innerText = 'Savings rate (%)';

    const rateInput = document.createElement('input');
    rateInput.id = `cat-rate-${idx}`;
    rateInput.type = 'text';
    const percent = ((cat.medianRateDecimal ?? 0.14) * 100).toFixed(0);
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


    const rateContainer = document.createElement('div');
    rateContainer.className = 'mt-2';
    rateContainer.appendChild(rateInput);

    rateRow.appendChild(rateLabel);
    rateRow.appendChild(rateContainer);
    bottomRow.appendChild(rateRow);

    
    const nameContainer = document.createElement('div');
    nameContainer.className = 'mt-2';
    nameContainer.appendChild(nameInput);
    
    leftCol.appendChild(nameLabel);
    leftCol.appendChild(nameContainer);
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


    if (state.categories.length > 1 && idx < state.categories.length - 1) {
      const hr = document.createElement('hr');
      hr.className = 'my-4 border-gray-400';
      row.appendChild(hr);
    }

    list.appendChild(row);
  });
}

function addCategoryToState(state, name = 'New Category', monthly = 1000) {
  state.categories = state.categories || [];
  state.categories.unshift({ name, monthly_spend: monthly, medianRateDecimal: 0.14 });
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

  // Report button: toggle printable report view
  // const reportBtn = document.getElementById('report-btn');
  // const printBtn = document.getElementById('print-btn');
  // if (reportBtn) {
  //   reportBtn.addEventListener('click', () => {
  //     const isOn = document.body.classList.contains('report-mode');
  //     toggleReportMode(!isOn);
  //   });
  // }
  // if (printBtn) {
  //   printBtn.addEventListener('click', () => {
  //     // ensure report mode is on when printing
  //     if (!document.body.classList.contains('report-mode')) toggleReportMode(true);
  //     setTimeout(() => window.print(), 50);
  //   });
  // }

  // Export PDF handler using html2pdf
  // see also https://ekoopmans.github.io/html2pdf.js/
  const exportBtn = document.getElementById('export-pdf-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      const state = currentState || getStateFromUrl() || collectStateFromUI();
      const months = state.months || 36;
      ensureAtLeastOneCategory(state);

      // compute cumulative datasets
      const agg = aggregateCategories(state.categories || [], months);

      // render temporary canvases in the current window and capture images
      const cumCanvas = document.createElement('canvas');
      cumCanvas.width = 1100; cumCanvas.height = 220;
      cumCanvas.style.position = 'absolute'; cumCanvas.style.left = '-9999px'; cumCanvas.style.top = '0';
      const monCanvas = document.createElement('canvas');
      monCanvas.width = 1100; monCanvas.height = 220;
      monCanvas.style.position = 'absolute'; monCanvas.style.left = '-9999px'; monCanvas.style.top = '0';

      // attach to DOM so Chart.js can render reliably
      document.body.appendChild(cumCanvas);
      document.body.appendChild(monCanvas);

      const cumChart = renderCumulativeChart(months, agg.low, agg.median, agg.high, cumCanvas);
      const monChart = renderMonthlyChart(months, state.categories || [], monCanvas);

      // allow render
      await new Promise(r => setTimeout(r, 250));

      const cumDataUrl = cumCanvas.toDataURL('image/png', 0.98);
      const monDataUrl = monCanvas.toDataURL('image/png', 0.98);

      // destroy temp charts and remove canvases
      try { if (cumChart && typeof cumChart.destroy === 'function') cumChart.destroy(); } catch (e) {}
      try { if (monChart && typeof monChart.destroy === 'function') monChart.destroy(); } catch (e) {}
      try { cumCanvas.remove(); } catch (e) {}
      try { monCanvas.remove(); } catch (e) {}

      // open a new window and write the printable report HTML into it
      const win = window.open('', '_blank');
      if (!win) {
        showToast('Unable to open new window for PDF');
        return;
      }

      const reportHTML = `\
<!doctype html>\
<html>\
<head>\
  <meta charset="utf-8">\
  <title>Cost optimization - potential scenarios</title>\
  <meta name="viewport" content="width=device-width, initial-scale=1">\
  <style>\
    @import url('https://fonts.googleapis.com/css?family=Libre+Franklin:400,700&display=swap');\
    body { font-family: "Libre Franklin", Arial, Helvetica, sans-serif; font-size: 9pt; color: #222; margin: 24px; }\
    h1 { font-size: 22pt; margin-bottom: 24px; }\
    h2 { font-size: 16pt; margin-top: 12px; }\
    table { width: 100%; border-collapse: collapse; margin-top:8px; }\
    tr { break-inside: avoid; page-break-inside: avoid; }
    th, td { border: 1px solid #ddd; padding: 6px; text-align: right; }\
    th { background: #f6f6f6; text-align: left; }\
    td.left { text-align: left; }\
    .chart { width: 100%; height: 220px; margin: 12px 0; }\
    .break-before { page-break-before: always; }\
    .intro { margin-bottom: 36px; }\
  </style>\
</head>\
</head>\
<body>\
  <h1>Cost optimization - potential scenarios</h1>\
  <div id="intro" class="intro">${renderReportIntro(state)}</div>\
  <h2>Cumulative Savings</h2>\
  <img class="chart" src="${cumDataUrl}" height="220" />\
  ${generateCumulativeTableHTML(months, agg.low, agg.median, agg.high)}\
  <h2 class="break-before">By Month</h2>\
  <img class="chart" src="${monDataUrl}" height="220" />\
  <h2>Savings Breakdown</h2>\
  ${generateMonthlyTableHTML(months, state.categories || [])}\
</head>\
  <script>\
    (function(){\
      function generate(){\
        const opt = { margin: 0.4, filename: 'savings-potential.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };\
        html2pdf().set(opt).from(document.body).save().then(() => { try { window.close(); } catch(e) {} });\
      }\
      if (window.html2pdf) { generate(); } else {\
        var s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js'; s.onload = generate; document.head.appendChild(s);\
      }\
    })();\
  <\/script>\
</body>\
</html>\
`;

      win.document.open();
      win.document.write(reportHTML);
      win.document.close();
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

  // FAQ accordion: wire up toggle buttons (hidden from PDF via .no-print)
  const faqButtons = document.querySelectorAll('.faq-button');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const content = item.querySelector('.faq-content');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', (!expanded).toString());
      if (content) content.style.display = expanded ? 'none' : 'block';
      const icon = btn.querySelector('.faq-icon');
      if (icon) icon.textContent = expanded ? '+' : '−';
    });
  });
}

document.addEventListener('DOMContentLoaded', main);
