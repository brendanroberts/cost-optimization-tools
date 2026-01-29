import { renderCumulativeChart, renderMonthlyChart } from './charts.js';
import { generateCumulativeTableHTML, generateMonthlyTableHTML, renderReportIntro } from './ui.js';
import { aggregateCategories } from './calculations.js';

export async function exportReport(state) {
    const months = state.months || 36;
    
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

    const cumChart = renderCumulativeChart(months, agg.low, agg.median, agg.high, cumCanvas, true);
    const monChart = renderMonthlyChart(months, state.categories || [], monCanvas, true);

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
    h1 { font-size: 22pt; font-weight: normal; margin-bottom: 24px; }\
    h2 { font-size: 16pt; font-weight: normal; margin-top: 12px; }\
    table { width: 100%; border: 1px solid #ddd; border-collapse: collapse; margin-top:8px; }\
    tr { break-inside: avoid; page-break-inside: avoid; }
    th, td { padding: 6px; }\
    td { border-bottom: 1px solid #ddd; padding: 6px; }\
    th { border-bottom: 1px solid #ddd; background: #f6f6f6; }\
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
        html2pdf().set(opt).from(document.body).save().then(() => { try { window.setTimeout(() => { window.close(); }, 100); } catch(e) {} });\
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
        
}
