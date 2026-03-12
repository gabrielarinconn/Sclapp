import { apiClient } from './apiClient.js';

// Dashboard view: KPIs, charts and AI report
export function renderDashboardView(main) {
  main.innerHTML = `
    <div class="view-container">

      <!-- Título + botones de acción -->
      <div class="view-header">
        <div>
          <h2 class="view-title">Dashboard</h2>
          <p class="view-subtitle">Intelligent data for real opportunities</p>
        </div>
        <div class="view-header-botones">
          <button class="btn-secundario" id="btnExportPdf">📄 Export PDF</button>
          <button class="btn-primario" id="btnGenerateAiReport">✦ Generate AI Report</button>
        </div>
      </div>

      <!-- ====== KPIs ====== -->
      <div class="kpis-grid">

        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icono-box teal">🏢</div>
            <span class="kpi-cambio positivo">↑ +12.5%</span>
          </div>
          <div class="kpi-numero">1,247</div>
          <div class="kpi-label">Companies with vacancies</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icono-box blue">✉</div>
            <span class="kpi-cambio positivo">↑ +8.3%</span>
          </div>
          <div class="kpi-numero">3,842</div>
          <div class="kpi-label">Emails sent</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icono-box purple">🛡</div>
            <span class="kpi-cambio positivo">↑ +23.1%</span>
          </div>
          <div class="kpi-numero">89</div>
          <div class="kpi-label">Companies engaged</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icono-box orange">📈</div>
            <span class="kpi-cambio negativo">↓ -2.1%</span>
          </div>
          <div class="kpi-numero">42.7%</div>
          <div class="kpi-label">Open rate</div>
        </div>

      </div>

      <!-- ====== Fila 1: Gráfica de área + Donut pipeline ====== -->
      <div class="graficas-row">

        <!-- Area chart: email activity -->
        <div class="grafica-card">
          <div class="grafica-top">
            <span class="grafica-titulo">Email activity</span>
            <div class="leyenda">
              <div class="leyenda-item">
                <div class="leyenda-dot" style="background:#2dd4bf;"></div> Sent
              </div>
              <div class="leyenda-item">
                <div class="leyenda-dot" style="background:#f59e0b;"></div> Opened
              </div>
              <div class="leyenda-item">
                <div class="leyenda-dot" style="background:#34d399;"></div> Negotiation
              </div>
            </div>
          </div>
          <div class="chart-box">
            <canvas id="chartArea"></canvas>
          </div>
        </div>

        <!-- Donut: pipeline kanban -->
        <div class="grafica-card">
          <span class="grafica-titulo">Pipeline</span>
          <div class="chart-box-sm" style="margin-top:12px;">
            <canvas id="chartDonut"></canvas>
          </div>
          <div class="donut-leyenda">
            <div class="donut-item">
              <div class="donut-item-izq">
                <div class="donut-dot" style="background:#60a5fa;"></div> Ready
              </div>
              <span class="donut-valor">245</span>
            </div>
            <div class="donut-item">
              <div class="donut-item-izq">
                <div class="donut-dot" style="background:#2dd4bf;"></div> Sent
              </div>
              <span class="donut-valor">180</span>
            </div>
            <div class="donut-item">
              <div class="donut-item-izq">
                <div class="donut-dot" style="background:#f59e0b;"></div> Opened
              </div>
              <span class="donut-valor">55</span>
            </div>
            <div class="donut-item">
              <div class="donut-item-izq">
                <div class="donut-dot" style="background:#a78bfa;"></div> Negotiation
              </div>
              <span class="donut-valor">42</span>
            </div>
            <div class="donut-item">
              <div class="donut-item-izq">
                <div class="donut-dot" style="background:#34d399;"></div> Vinculados
              </div>
              <span class="donut-valor">18</span>
            </div>
          </div>
        </div>

      </div>

      <!-- ====== Fila 2: Gráfica de línea + Reporte IA ====== -->
      <div class="graficas-row-2">

        <!-- Gráfica de línea: crecimiento semanal -->
        <div class="grafica-card">
          <span class="grafica-titulo">Companies engaged</span>
          <p class="grafica-subtitulo">Weekly growth</p>
          <div class="chart-box-sm">
            <canvas id="chartLinea"></canvas>
          </div>
        </div>

        <!-- AI report -->
        <div class="reporte-card">
          <div class="reporte-encabezado">
            <div>
              <div class="reporte-titulo">✦ AI Report</div>
              <div class="reporte-subtitulo">Automatic analysis of your pipeline</div>
            </div>
            <button class="btn-secundario" id="btnExportPdfSecondary">📄 Export PDF</button>
          </div>
          <div class="reporte-lista" id="reporte-lista">
            <div class="reporte-item">
              <span class="reporte-item-ico">📊</span>
              <span>
                <strong style="color:#e2e8f0;">Positive trend:</strong>
                Companies using React and Python have a 34% higher probability of hiring junior talent.
              </span>
            </div>
            <div class="reporte-item">
              <span class="reporte-item-ico">🎯</span>
              <span>
                <strong style="color:#e2e8f0;">Recommendation:</strong>
                Prioritize fintech startups — 3x higher reply rate than enterprise companies.
              </span>
            </div>
            <div class="reporte-item">
              <span class="reporte-item-ico">⚡</span>
              <span>
                <strong style="color:#e2e8f0;">Opportunity:</strong>
                18 companies in "Negotiation" have had no follow-up for more than 5 days. Re-contact is recommended.
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;

  const exportButtons = [
    document.getElementById('btnExportPdf'),
    document.getElementById('btnExportPdfSecondary'),
  ].filter(Boolean);

  exportButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      window.alert('PDF export will be connected to the backend.');
    });
  });

  const aiButton = document.getElementById('btnGenerateAiReport');
  if (aiButton) {
    aiButton.addEventListener('click', async () => {
      const list = document.getElementById('reporte-lista');
      if (!list) return;

      list.innerHTML =
        '<p style="color:#475569;font-size:13px;padding:10px 0;">⏳ Generating AI insights...</p>';

      try {
        const report = await apiClient.getDashboardAiReport();
        if (report && Array.isArray(report.items)) {
          list.innerHTML = report.items
            .map(
              (item) => `
              <div class="reporte-item">
                <span class="reporte-item-ico">${item.icon || '📊'}</span>
                <span>
                  <strong style="color:#e2e8f0;">${item.title}</strong>
                  ${item.description}
                </span>
              </div>
            `
            )
            .join('');
        } else {
          list.innerHTML =
            '<p style="color:#475569;font-size:13px;padding:10px 0;">No AI report data available yet.</p>';
        }
      } catch (error) {
        list.innerHTML =
          '<p style="color:#ef4444;font-size:13px;padding:10px 0;">Could not load AI report from backend.</p>';
      }
    });
  }

  // Create charts after injecting HTML
  setTimeout(function () {
    createAreaChart();
    createDonutChart();
    createLineChart();
  }, 50);
}

// Area chart — email activity
function createAreaChart() {
  var ctx = document.getElementById('chartArea');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Sent',
          data: [100, 120, 140, 130, 150, 110, 90],
          borderColor: '#2dd4bf',
          backgroundColor: 'rgba(45,212,191,0.15)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0
        },
        {
          label: 'Opened',
          data: [40, 50, 55, 60, 70, 55, 45],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,0.15)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0
        },
        {
          label: 'Negotiation',
          data: [5, 8, 6, 10, 12, 8, 6],
          borderColor: '#34d399',
          backgroundColor: 'rgba(52,211,153,0.05)',
          fill: true,
          tension: 0.4,
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: '#1a2535' },
          ticks: { color: '#475569', font: { size: 11 } }
        },
        y: {
          grid: { color: '#1a2535' },
          ticks: { color: '#475569', font: { size: 11 } },
          beginAtZero: true
        }
      }
    }
  });
}

// Donut chart — pipeline kanban
function createDonutChart() {
  var ctx = document.getElementById('chartDonut');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Ready', 'Sent', 'Opened', 'Negotiation', 'Engaged'],
      datasets: [{
        data: [245, 180, 55, 42, 18],
        backgroundColor: ['#60a5fa', '#2dd4bf', '#f59e0b', '#a78bfa', '#34d399'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: { legend: { display: false } }
    }
  });
}

// Line chart — engaged companies
function createLineChart() {
  var ctx = document.getElementById('chartLinea');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [{
        label: 'Engaged',
        data: [2, 5, 9, 16, 24, 32],
        borderColor: '#2dd4bf',
        backgroundColor: 'rgba(45,212,191,0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#2dd4bf'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: '#1a2535' },
          ticks: { color: '#475569', font: { size: 11 } }
        },
        y: {
          grid: { color: '#1a2535' },
          ticks: { color: '#475569', font: { size: 11 } },
          beginAtZero: true
        }
      }
    }
  });
}

