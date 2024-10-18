import Chart from 'chart.js/auto';

let usageGapChart, productGapChart, performanceGapChart;

document.addEventListener('DOMContentLoaded', () => {
  const analysisType = document.getElementById('analysisType');
  analysisType.addEventListener('change', showSelectedAnalysis);

  document.getElementById('marketPotential').addEventListener('input', updateUsageGap);
  document.getElementById('currentUsage').addEventListener('input', updateUsageGap);
  document.getElementById('totalSegments').addEventListener('input', updateProductGap);
  document.getElementById('coveredSegments').addEventListener('input', updateProductGap);
  document.getElementById('metrics').addEventListener('input', updatePerformanceGap);

  showSelectedAnalysis();
});

function showSelectedAnalysis() {
  const analysisType = document.getElementById('analysisType').value;
  document.getElementById('usageGap').style.display = analysisType === 'usage' ? 'block' : 'none';
  document.getElementById('productGap').style.display = analysisType === 'product' ? 'block' : 'none';
  document.getElementById('performanceGap').style.display = analysisType === 'performance' ? 'block' : 'none';

  if (analysisType === 'usage') updateUsageGap();
  if (analysisType === 'product') updateProductGap();
  if (analysisType === 'performance') updatePerformanceGap();
}

function updateUsageGap() {
  const marketPotential = parseFloat(document.getElementById('marketPotential').value) || 0;
  const currentUsage = parseFloat(document.getElementById('currentUsage').value) || 0;
  const usageGap = Math.max(0, marketPotential - currentUsage);

  if (usageGapChart) usageGapChart.destroy();
  usageGapChart = new Chart(document.getElementById('usageGapChart'), {
    type: 'bar',
    data: {
      labels: ['Market Potential', 'Current Usage', 'Usage Gap'],
      datasets: [{
        data: [marketPotential, currentUsage, usageGap],
        backgroundColor: ['#36a2eb', '#ff6384', '#ffce56']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Usage Gap Analysis' }
      }
    }
  });

  const resultDiv = document.getElementById('usageGapResult');
  resultDiv.innerHTML = `
    <p>The usage gap is: ${usageGap}</p>
    <p>This represents ${((usageGap / marketPotential) * 100).toFixed(2)}% of the market potential.</p>
  `;
}

function updateProductGap() {
  const totalSegments = parseInt(document.getElementById('totalSegments').value) || 0;
  const coveredSegments = parseInt(document.getElementById('coveredSegments').value) || 0;
  const productGap = Math.max(0, totalSegments - coveredSegments);

  if (productGapChart) productGapChart.destroy();
  productGapChart = new Chart(document.getElementById('productGapChart'), {
    type: 'pie',
    data: {
      labels: ['Covered Segments', 'Product Gap'],
      datasets: [{
        data: [coveredSegments, productGap],
        backgroundColor: ['#36a2eb', '#ff6384']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Market Segment Coverage' }
      }
    }
  });

  const resultDiv = document.getElementById('productGapResult');
  resultDiv.innerHTML = `
    <p>Your products cover ${coveredSegments} out of ${totalSegments} segments.</p>
    <p>The product gap is ${productGap} segments, or ${((productGap / totalSegments) * 100).toFixed(2)}% of the market.</p>
  `;
}

function updatePerformanceGap() {
  const metrics = document.getElementById('metrics').value.split('\n').filter(metric => metric.trim() !== '');
  const metricInputs = document.getElementById('metricInputs');
  metricInputs.innerHTML = '';

  metrics.forEach((metric, index) => {
    metricInputs.innerHTML += `
      <input type="number" id="current${index}" placeholder="Current ${metric}" value="50">
      <input type="number" id="target${index}" placeholder="Target ${metric}" value="75">
    `;
  });

  Array.from(metricInputs.querySelectorAll('input')).forEach(input => {
    input.addEventListener('input', renderPerformanceChart);
  });

  renderPerformanceChart();
}

function renderPerformanceChart() {
  const metrics = document.getElementById('metrics').value.split('\n').filter(metric => metric.trim() !== '');
  const currentValues = metrics.map((_, index) => parseFloat(document.getElementById(`current${index}`).value) || 0);
  const targetValues = metrics.map((_, index) => parseFloat(document.getElementById(`target${index}`).value) || 0);

  if (performanceGapChart) performanceGapChart.destroy();
  performanceGapChart = new Chart(document.getElementById('performanceGapChart'), {
    type: 'bar',
    data: {
      labels: metrics,
      datasets: [
        {
          label: 'Current',
          data: currentValues,
          backgroundColor: '#36a2eb'
        },
        {
          label: 'Target',
          data: targetValues,
          backgroundColor: '#ff6384'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Current vs Target Performance' }
      }
    }
  });

  const resultDiv = document.getElementById('performanceGapResult');
  resultDiv.innerHTML = '<h3>Performance Gap Analysis:</h3>';
  metrics.forEach((metric, index) => {
    const gap = targetValues[index] - currentValues[index];
    resultDiv.innerHTML += `<p>${metric}: Current ${currentValues[index]}, Target ${targetValues[index]}, Gap ${gap}</p>`;
  });
}
