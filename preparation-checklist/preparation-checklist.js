function getDataFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('data')) return null;
  try {
    return JSON.parse(decodeURIComponent(params.get('data')));
  } catch (e) {
    return null;
  }
}

function formatUSD(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(n || 0);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render() {
  const data = getDataFromUrl();
  const app = document.getElementById('app');

  if (!data || !data.categories || !data.categories.length) {
    app.innerHTML = `
      <p>No scenario data found. <a href="/scenario">Return to the scenario tool</a> and click "Generate My Preparation Checklist" to generate this page.</p>`;
    return;
  }

  const categories = data.categories;
  let html = '';

  // Section 1: Selected categories
  html += `
    <section class="prep-section">
      <h2>Your Selected Categories</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th class="num">Monthly Spend</th>
            <th class="num">Annual Spend</th>
          </tr>
        </thead>
        <tbody>
          ${categories.map(cat => `
          <tr>
            <td>${escapeHtml(cat.name)}</td>
            <td class="figure num">${formatUSD(cat.monthly_spend)}</td>
            <td class="figure num">${formatUSD((cat.monthly_spend || 0) * 12)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </section>`;

  // Section 2: What to gather
  html += `
    <section class="prep-section">
      <h2>What to Gather</h2>
      <p>For each category below, locate the following before your vendor review.</p>
      ${categories.map(cat => `
      <div class="prep-category-block">
        <h3>${escapeHtml(cat.name)}</h3>
        <ul>
          <li>Recent invoices (last 3 months)</li>
          <li>Copies of active contracts or service agreements</li>
        </ul>
      </div>`).join('')}
    </section>`;

  // Section 3: General preparation notes
  html += `
    <section class="prep-section">
      <h2>General Preparation Notes</h2>
      <ul>
        <li>Gather materials in digital form where possible</li>
        <li>Note any contracts with upcoming renewal or expiration dates</li>
        <li>Flag any services that have changed in scope but not in price</li>
      </ul>
    </section>`;

  app.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', render);
