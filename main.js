document.getElementById('chart-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const monthlySpend = parseFloat(document.getElementById('monthly_spend').value);
  const savingsRate = parseFloat(document.getElementById('savings_rate').value) / 100;
  const months = parseInt(document.getElementById('months').value);

  const data = [];
  let totalSavings = 0;

  for (let i = 0; i < months; i++) {
    totalSavings += monthlySpend * savingsRate + (totalSavings * savingsRate);
    data.push({
      x: i,
      y: totalSavings
    });
  }

  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.x),
      datasets: [{
        label: 'Total Savings',
        data: data.map(d => d.y),
        fill: true,
        backgroundColor: 'rgba(0, 51, 102, 0.2)',
        borderColor: 'rgba(0, 51, 102, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Total Savings'
          }
        }
      },
      plugins: {
        tooltip: {
          enabled: true
        }
      }
    }
  });
});
