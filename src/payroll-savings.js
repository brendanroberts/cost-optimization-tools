const slider = document.getElementById("empSlider");
const empDisplay = document.getElementById("empDisplay");

const EMPLOYEE_TAKEHOME = 2544;
const EMPLOYER_FICA = 574;

const fmt = (n) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

function update() {
  const employees = Number(slider.value);
  empDisplay.textContent = employees.toLocaleString();

  document.getElementById("takehome-per").textContent = fmt(EMPLOYEE_TAKEHOME);
  document.getElementById("takehome-total").textContent = fmt(EMPLOYEE_TAKEHOME * employees);
  document.getElementById("fica-per").textContent = fmt(EMPLOYER_FICA);
  document.getElementById("fica-total").textContent = fmt(EMPLOYER_FICA * employees);

  const combinedEl = document.getElementById("combined-total");
  if (combinedEl) combinedEl.textContent = fmt((EMPLOYEE_TAKEHOME + EMPLOYER_FICA) * employees);
}

document.addEventListener("DOMContentLoaded", () => {
  slider.addEventListener("input", update);
  update();
});
