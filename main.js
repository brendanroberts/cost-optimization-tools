import { aggregateCategories } from './src/calculations.js';
import { renderCumulativeChart, renderMonthlyChart, clearChart } from './src/charts.js';
import { generateCumulativeTableHTML, generateMonthlyTableHTML } from './src/ui.js';
import { exportReport } from './src/pdf.js';

let currentState = null;

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

function showModal(show) {
  const m = document.getElementById('initial-modal');
  let previousActiveElement = null;

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

  // Export PDF handler using html2pdf
  // see also https://ekoopmans.github.io/html2pdf.js/
  const exportBtn = document.getElementById('export-pdf-btn');
  if (exportBtn) {
    let state = getStateFromUrl() || {};
    exportBtn.addEventListener('click', async () => {
      await exportReport(state);
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
