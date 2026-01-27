import { PALETTE, hexToRgba, formatUSD } from "./constants.js";

let chartInstance = null;

export function clearChart() {
  if (chartInstance) {
    try {
      chartInstance.destroy();
    } catch (e) {}
    chartInstance = null;
  }
}

export function renderCumulativeChart(
  months,
  low,
  median,
  high,
  canvasEl = null,
  printable = false,
) {
  const canvas = canvasEl || document.getElementById("myChart");
  const FIXED_HEIGHT_PX = 420;
  canvas.style.height = FIXED_HEIGHT_PX + "px";
  canvas.height = FIXED_HEIGHT_PX;
  const ctx = canvas.getContext("2d");
  const labels = Array.from({ length: months }, (_, i) => i + 1);
  const fontSize = printable ? 24 : 13;

  const lowDataset = {
    label: "Low",
    data: low,
    borderColor: "rgba(0,0,0,0)",
    backgroundColor: "rgba(0,0,0,0)",
    pointRadius: 0,
    fill: false,
    tension: 0.2,
  };

  const highDataset = {
    label: "High",
    data: high,
    borderColor: "rgba(0,0,0,0)",
    backgroundColor: hexToRgba(PALETTE["navyblue-100"], 0.18),
    pointRadius: 0,
    fill: "-1",
    tension: 0.2,
  };

  const medianDataset = {
    label: "Median",
    data: median,
    borderColor: PALETTE["navyblue-500"],
    backgroundColor: "rgba(0,0,0,0)",
    pointRadius: 2,
    fill: false,
    tension: 0.2,
  };

  const cfg = {
    type: "line",
    data: { labels, datasets: [lowDataset, highDataset, medianDataset] },
    options: {
      maintainAspectRatio: printable,
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Month",
            font: {
              size: fontSize,
            },
          },
          ticks: {
            font: {
              size: fontSize,
            },
          },
        },
        y: {
          title: { 
            display: true, 
            text: "Cumulative Savings (USD)",
            font: {
              size: fontSize,
            },
         },
          ticks: {
            font: {
              size: fontSize,
            },
            callback: (v) => formatUSD(v),
          },
        },
      },
      plugins: { 
        tooltip: { 
            enabled: true 
        },
        legend: {
            labels: {
                font: {
                    size: fontSize
                }
            }
        } 
     },
      interaction: { intersect: false, mode: "index" },
    },
  };

  if (canvasEl) {
    const tmp = new Chart(ctx, cfg);
    return tmp;
  }

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, cfg);
  return chartInstance;
}

export function renderMonthlyChart(months, categories, canvasEl = null, printable = false) {
  const canvas = canvasEl || document.getElementById("myChart");
  const FIXED_HEIGHT_PX = 420;
  canvas.style.height = FIXED_HEIGHT_PX + "px";
  canvas.height = FIXED_HEIGHT_PX;
  const ctx = canvas.getContext("2d");
  const labels = Array.from({ length: months }, (_, i) => i + 1);
  const fontSize = printable ? 24 : 13;

  const paletteKeys = [
    "navyblue-50",
    "navyblue-100",
    "navyblue-200",
    "navyblue-300",
    "navyblue-400",
    "navyblue-500",
    "navyblue-600",
    "navyblue-700",
  ];
  const colors = categories.map(
    (c, idx) =>
      PALETTE[paletteKeys[idx % paletteKeys.length]] || PALETTE.navyblue,
  );
  const datasets = categories.map((cat, idx) => {
    const monthly = Number(cat.monthly_spend) || 0;
    const value = Math.round(monthly * (cat.medianRateDecimal ?? 0.14));
    const start = Number(cat.start_month) || 1;
    const data = Array.from({ length: months }, (_, i) =>
      i + 1 >= start ? value : 0,
    );
    return {
      label: cat.name || `Cat ${idx + 1}`,
      data,
      backgroundColor: colors[idx],
      stack: "savings",
    };
  });

  const cfg = {
    type: "bar",
    data: { labels, datasets },
    options: {
      maintainAspectRatio: printable,
      responsive: true,
      scales: {
        x: {
          stacked: true,
          title: { 
            display: true, 
            text: "Month",
            font: {
              size: fontSize,
            },
          },
          ticks: {
            font: {
              size: fontSize,
            },
          },
        },
        y: {
          stacked: true,
          title: { 
            display: true, 
            text: "Monthly Savings (USD)", 
            font: {
              size: fontSize,
            },
          },
          ticks: {
            font: {
              size: fontSize,
            },
            callback: (v) => formatUSD(v),
          },
        },
      },    
      plugins: { 
        tooltip: { 
            enabled: true 
        },
        legend: {
            labels: {
                font: {
                    size: fontSize
                }
            }
        } 
     },
    },
  };

  if (canvasEl) {
    const tmp = new Chart(ctx, cfg);
    return tmp;
  }

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, cfg);
  return chartInstance;
}
