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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.textContent = "Sending...";

    try {
      await fetch(submissionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "fica_lead",
          employees: slider.value,
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
