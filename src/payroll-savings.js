import { submissionUrl } from "./constants.js";

const slider = document.getElementById("empSlider");
const empDisplay = document.getElementById("empDisplay");
const savingsEl = document.getElementById("savings");
const form = document.getElementById("leadForm");
const status = document.getElementById("status");

const RATE = 575;

function update() {
  const employees = slider.value;
  empDisplay.textContent = Number(employees).toLocaleString();

  const total = employees * RATE;

  savingsEl.textContent = total.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function main() {
  slider.addEventListener("input", update);
  update();

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.textContent = "Sending...";

    try {
      await fetch(submissionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "fica-savings",
          employees: slider.value,
          contactName: form.contactName.value,
          company: form.company.value,
          email: form.email.value,
        }),
      });

      status.textContent = "Thanks — we'll contact you shortly.";
      form.reset();
    } catch {
      status.textContent = "Submission failed. Please email directly.";
    }
  });
}

document.addEventListener("DOMContentLoaded", main);
