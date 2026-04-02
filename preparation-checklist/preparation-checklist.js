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
      <div class="text-gray-600 mt-4">
        <p>No scenario data found. <a href="/scenario" class="text-blue-600 underline">Return to the scenario tool</a> and click "Generate My Preparation Checklist" to generate this page.</p>
      </div>`;
    return;
  }

  const categories = data.categories;
  let html = '';

  // Section 1: Selected categories
  html += `
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4 border-b pb-2">Your Selected Categories</h2>
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-gray-50">
            <th class="text-left p-3 border border-gray-200">Category</th>
            <th class="text-right p-3 border border-gray-200">Monthly Spend</th>
            <th class="text-right p-3 border border-gray-200">Annual Spend</th>
          </tr>
        </thead>
        <tbody>
          ${categories.map(cat => `
          <tr>
            <td class="p-3 border border-gray-200">${escapeHtml(cat.name)}</td>
            <td class="p-3 border border-gray-200 text-right">${formatUSD(cat.monthly_spend)}</td>
            <td class="p-3 border border-gray-200 text-right">${formatUSD((cat.monthly_spend || 0) * 12)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </section>`;

  // Section 2: What to gather
  html += `
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4 border-b pb-2">What to Gather</h2>
      <p class="text-sm text-gray-600 mb-6">For each category below, locate the following before your vendor review.</p>
      ${categories.map(cat => `
      <div class="mb-6">
        <h3 class="font-semibold mb-2">${escapeHtml(cat.name)}</h3>
        <ul class="list-disc ml-5 text-sm space-y-1 text-gray-700">
          <li>Recent invoices (last 3 months)</li>
          <li>Copies of active contracts or service agreements</li>
        </ul>
      </div>`).join('')}
    </section>`;

  // Section 3: General preparation notes
  html += `
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4 border-b pb-2">General Preparation Notes</h2>
      <ul class="list-disc ml-5 text-sm space-y-2 text-gray-700">
        <li>Gather materials in digital form where possible</li>
        <li>Note any contracts with upcoming renewal or expiration dates</li>
        <li>Flag any services that have changed in scope but not in price</li>
      </ul>
    </section>`;

  app.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', render);
