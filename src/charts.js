import { PALETTE, hexToRgba, formatUSD } from "./constants.js";
import { chartDimensions as printDimensions } from "./pdf.js";

let chartInstance = null;

export function clearChart() {
  if (chartInstance) {
    try {
      chartInstance.destroy();
    } catch (e) {}
    chartInstance = null;
  }
}

function getChartContext(canvasEl, printable = false) {
  const canvas = canvasEl || document.getElementById("scenarioChart");
  const FIXED_HEIGHT_PX = printable ? printDimensions.height : 420;
  canvas.style.height = FIXED_HEIGHT_PX + "px";
  canvas.height = FIXED_HEIGHT_PX;
  const ctx = canvas.getContext("2d");
  return ctx;
}

export function renderCumulativeChart(
  months,
  low,
  median,
  high,
  canvasEl = null,
  printable = false,
) {
  const ctx = getChartContext(canvasEl, printable);
  const labels = Array.from({ length: months }, (_, i) => i + 1);
  const fontSize = printable ? '24px' : '13px';

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
          enabled: true,
        },
        legend: {
          labels: {
            font: {
              size: fontSize,
            },
          },
        },
      },
      interaction: { intersect: false, mode: "index" },
    },
  };

  if (canvasEl) {
    const tmp = new Chart(ctx, cfg);
    return tmp;
  }

  if (chartInstance && !printable) clearChart();
  chartInstance = new Chart(ctx, cfg);
  return chartInstance;
}

function getMonthlyDataSets(months, categories) {
  const paletteKeys = [
    "navyblue-700",
    "navyblue-600",
    "navyblue-500",
    "navyblue-400",
    "navyblue-300",
    "navyblue-200",
    "navyblue-100",
    "navyblue-50",
  ];
  const colors = categories.map(
    (c, idx) =>
      PALETTE[paletteKeys[idx % paletteKeys.length]] || PALETTE.navyblue,
  );
  
  return categories.map((cat, idx) => {
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
}

export function renderMonthlyChart(
  months,
  categories,
  canvasEl = null,
  printable = false,
) {
  const ctx = getChartContext(canvasEl, printable);
  const labels = Array.from({ length: months }, (_, i) => i + 1);
  const fontSize = printable ? 24 : 13;
  const datasets = getMonthlyDataSets(months, categories);

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
          enabled: true,
        },
        legend: {
          labels: {
            font: {
              size: fontSize,
            },
          },
        },
      },
    },
  };

  if (canvasEl) {
    const c = new Chart(ctx, cfg);
    return c;
  }

  if (chartInstance && !printable) clearChart();
  chartInstance = new Chart(ctx, cfg);
  return chartInstance;
}
