import { submissionUrl } from './constants.js';
let form, state = {
  source: 'onboarding',
  scenarioCategories: [],
  selectedCategories: [],
  contact: {},
};


/////////////////////////
// UTILITIES
/////////////////////////

function parseScenario() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("data");

  if (!raw) return null;

  try {
    const payload = JSON.parse(decodeURIComponent(raw));
    state.scenarioCategories = payload.categories || [];
    return state;
  } catch {
    return null;
  }
}

function currency(n) {
  return "$" + n.toLocaleString();
}

function render(html) {
  document.getElementById("app").innerHTML = html;
}

/////////////////////////
// STEP 1 — CATEGORY SELECT
/////////////////////////

function stepSelect() {
  let html = `
<h2 class="text-xl font-semibold mb-4">Step 1 — Select categories</h2>
<form id="categoryForm" class="space-y-6">
`;

  state.scenarioCategories.forEach((c, i) => {
    const checked = state.selectedCategories.includes(i) ? "checked" : "";

    html += `
<label class="block border rounded p-4 hover:bg-gray-50">
<input type="checkbox" data-index="${i}" ${checked} class="mr-2">
<strong>${c.name}</strong><br>
Spend: ${currency(c.monthly_spend)} / mo<br>
Est reduction: ${(c.medianRateDecimal * 100).toFixed(0)}%
<p class="text-sm text-gray-600 mt-2">
Requires 3 invoices OR billing portal access
</p>
</label>
`;
  });

  html += `
<p id="error" class="text-red-600 hidden">Select at least one category.</p>

<button class="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">
Continue
</button>
</form>
`;

  render(html);

  document.getElementById("categoryForm").onsubmit = (e) => {
    e.preventDefault();

    state.selectedCategories = [
      ...document.querySelectorAll("input:checked"),
    ].map((cb) => parseInt(cb.dataset.index));

    if (!state.selectedCategories.length) {
      document.getElementById("error").classList.remove("hidden");
      return;
    }

    stepPrep();
  };
}

/////////////////////////
// STEP 2 — PREPARATION
/////////////////////////

function stepPrep() {
  let html = `
<h2 class="text-xl font-semibold mb-4">Step 2 — Preparation overview</h2>

<div class="space-y-3 text-gray-700 mb-6">
<p>After submission:</p>
<ul class="list-disc ml-6">
<li>I'll contact you to schedule an onboarding call</li>
<li>We'll review invoices and documents</li>
<li>Service agreement + authorization signing</li>
</ul>
</div>

<h3 class="font-semibold mb-2">Prepare:</h3>
<ul class="list-disc ml-6 mb-6">
`;

  state.selectedCategories.forEach((i) => {
    const c = state.scenarioCategories[i];
    html += `<li>${c.name}: invoices OR portal login</li>`;
  });

  html += `
</ul>

<button id="continue"
class="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">
I’m ready
</button>
`;

  render(html);

  document.getElementById("continue").onclick = stepSubmit;
}

/////////////////////////
// STEP 3 — SUBMISSION
/////////////////////////

function stepSubmit() {
  render(`
<h2 class="text-xl font-semibold mb-4">Step 3 — Submit onboarding request</h2>

<form id="submitForm" class="space-y-4">

<input required name="contactName" placeholder="Name"
class="w-full border p-2 rounded" id="name">

<input required type="email" name="email" placeholder="Email"
class="w-full border p-2 rounded" id="email">

<textarea name="notes" placeholder="Notes (optional)"
class="w-full border p-2 rounded" id="notes"></textarea>

<label class="flex gap-2 items-start">
<input type="checkbox" name="ack" id="ack" required>
<span>I understand the onboarding call will include reviewing invoices and documents</span>
</label>

<p id="error" class="text-red-600 hidden"></p>

<button class="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">
Submit
</button>

</form>
`);

  form = document.getElementById("submitForm");

  form.onsubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData(form);
    const json = Object.fromEntries(formData.entries());
    const btn = e.target.querySelector("button");
    btn.textContent = "Submitting…";

    state.contact = {
      name: json.contactName,
      email: json.email,
      notes: json.notes,
    };

    try {
      await fetch(submissionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });

      render(`
<div class="text-green-700">
<h2 class="text-xl font-semibold mb-2">✓ Request received</h2>
<p>I’ll contact you shortly to schedule onboarding.</p>
</div>
`);
    } catch (e) {
      document.getElementById("error").textContent =
        "Submission failed. Please retry or email directly.";
      document.getElementById("error").classList.remove("hidden");

      btn.textContent = "Submit";
    }
  };
}

/////////////////////////
// INIT
/////////////////////////

parseScenario();

if (!state.scenarioCategories.length) {
    render(`
<p class="text-red-600">
Scenario data missing. Please restart from the calculator.
</p>
`);
} else {
  stepSelect();
}
