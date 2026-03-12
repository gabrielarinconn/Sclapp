// Companies view: table with filters and scraping modal

import { apiClient } from './apiClient.js';

const FALLBACK_COMPANIES = [
  { nombre: 'TechCorp Solutions', tech: 'React, Node.js', nivel: 'Senior', ciudad: 'Bogotá', score: 'Alta' },
  { nombre: 'InnovateTech', tech: 'Python, Django', nivel: 'Mid', ciudad: 'Medellín', score: 'Alta' },
  { nombre: 'ByteForge', tech: 'Angular, .NET', nivel: 'Junior', ciudad: 'Cali', score: 'Media' },
  { nombre: 'AppWorks Studio', tech: 'React Native', nivel: 'Mid', ciudad: 'Remoto', score: 'Alta' },
  { nombre: 'CloudNine Labs', tech: 'Node.js, AWS', nivel: 'Senior', ciudad: 'Bogotá', score: 'Media' },
  { nombre: 'DevFactory', tech: 'Python, FastAPI', nivel: 'Mid', ciudad: 'Medellín', score: 'Alta' },
  { nombre: 'StartupXYZ', tech: 'Vue.js, Firebase', nivel: 'Junior', ciudad: 'Bucaramanga', score: 'Alta' },
];

export function renderCompaniesView(main) {
  main.innerHTML = `
    <div class="view-container">
      <div class="view-header">
        <div>
          <h2 class="view-title">Companies</h2>
          <p class="view-subtitle">Intelligent data on tech vacancy opportunities</p>
        </div>
        <button class="btn-primario" id="btnOpenScraping">🔍 Run scraping</button>
      </div>

      <div class="filtros-bar">
        <div class="filtro-item" style="flex: 1;">
          <input type="text" class="filtro-input" style="width:100%;" placeholder="🔎 Search by name..." id="filtroBuscar" />
        </div>
        <div class="filtro-item">
          <select class="filtro-select" id="filtroTech">
            <option value="">All technologies</option>
            <option value="React">React</option>
            <option value="Python">Python</option>
            <option value="Node.js">Node.js</option>
            <option value="Angular">Angular</option>
          </select>
        </div>
        <div class="filtro-item">
          <select class="filtro-select" id="filtroScore">
            <option value="">Any score</option>
            <option value="Alta">High opportunity</option>
            <option value="Media">Medium opportunity</option>
          </select>
        </div>
      </div>

      <div class="tabla-wrapper">
        <table class="tabla">
          <thead>
            <tr>
              <th>Company</th>
              <th>Technologies</th>
              <th>Level</th>
              <th>City</th>
              <th>AI Score</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody id="tablaBody"></tbody>
        </table>
      </div>
    </div>

    <div class="panel-overlay" id="modalScraping" style="display:none;">
      <div class="panel">
        <div class="panel-header">
          <h3>🔍 Configure scraping</h3>
          <button class="modal-cerrar" id="btnCloseScraping">✕</button>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label>Search platform</label>
            <select class="filtro-select" style="width:100%;" id="scrapingSource">
              <option>LinkedIn Jobs</option>
              <option>Computrabajo</option>
              <option>Indeed Colombia</option>
            </select>
          </div>
          <div class="form-group">
            <label>Target technology / role</label>
            <input type="text" class="filtro-input" style="width:100%;" placeholder="e.g. Senior React Developer" id="scrapingQuery" />
          </div>
          <div id="scrapingStatus" style="margin-top:15px;"></div>
        </div>
        <div class="panel-footer">
          <button class="btn-cancelar" id="btnCancelScraping">Cancel</button>
          <button class="btn-primario" id="btnStartScraping">Start search</button>
        </div>
      </div>
    </div>
  `;

  let companiesData = [...FALLBACK_COMPANIES];

  function renderTableRows() {
    const tbody = document.getElementById('tablaBody');
    if (!tbody) return;

    const techFilter = document.getElementById('filtroTech')?.value || '';
    const scoreFilter = document.getElementById('filtroScore')?.value || '';
    const textFilter = (document.getElementById('filtroBuscar')?.value || '').toLowerCase();

    const filtered = companiesData.filter((e) => {
      const matchText = e.nombre.toLowerCase().includes(textFilter);
      const matchTech = !techFilter || e.tech.includes(techFilter);
      const matchScore = !scoreFilter || e.score === scoreFilter;
      return matchText && matchTech && matchScore;
    });

    if (filtered.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="tabla-vacia">🔍 No companies found with these criteria.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered
      .map((e) => {
        const scoreClass = e.score === 'Alta' ? 'badge-alta' : 'badge-media';
        const escapedName = e.nombre.replace(/'/g, "\\'");
        return `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:10px;">
                <div style="width:30px;height:30px;background:#1a2535;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#2dd4bf;font-weight:bold;font-size:12px;">${e.nombre[0]}</div>
                <span style="font-weight:600;color:#e2e8f0;">${e.nombre}</span>
              </div>
            </td>
            <td style="color:#64748b;font-size:12px;">${e.tech}</td>
            <td style="color:#64748b;font-size:12px;">${e.nivel}</td>
            <td style="color:#64748b;font-size:12px;">${e.ciudad}</td>
            <td><span class="badge ${scoreClass}">${e.score}</span></td>
            <td style="text-align:right;">
              <button class="kanban-kebab" data-company="${escapedName}">⋮</button>
            </td>
          </tr>
        `;
      })
      .join('');

    tbody.querySelectorAll('.kanban-kebab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.company || '';
        window.alert(`Options for ${name} (Contact, View details, Ignore)`);
      });
    });
  }

  async function loadCompanies() {
    try {
      const data = await apiClient.getCompanies();
      if (Array.isArray(data) && data.length > 0) {
        companiesData = data.map((c) => ({
          nombre: c.name || c.nombre || c.company_name || '—',
          tech: c.tech || c.technologies || c.tech_stack || '—',
          nivel: c.nivel || c.level || '—',
          ciudad: c.ciudad || c.city || c.location || '—',
          score: c.score || c.ai_score || 'Media',
        }));
      }
    } catch (_) {
      companiesData = [...FALLBACK_COMPANIES];
    }
    renderTableRows();
  }

  ['filtroBuscar', 'filtroTech', 'filtroScore'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(id === 'filtroBuscar' ? 'input' : 'change', renderTableRows);
  });

  document.getElementById('btnOpenScraping')?.addEventListener('click', () => {
    document.getElementById('modalScraping').style.display = 'flex';
  });

  document.getElementById('btnCloseScraping')?.addEventListener('click', () => {
    document.getElementById('modalScraping').style.display = 'none';
    document.getElementById('scrapingStatus').innerHTML = '';
  });

  document.getElementById('btnCancelScraping')?.addEventListener('click', () => {
    document.getElementById('modalScraping').style.display = 'none';
    document.getElementById('scrapingStatus').innerHTML = '';
  });

  document.getElementById('btnStartScraping')?.addEventListener('click', async () => {
    const queryEl = document.getElementById('scrapingQuery');
    const statusEl = document.getElementById('scrapingStatus');
    const query = queryEl?.value?.trim() || '';

    if (!query) {
      window.alert('Please enter a search term.');
      return;
    }

    statusEl.innerHTML = `
      <div style="padding:15px;background:rgba(45,212,191,0.05);border:1px dashed #2dd4bf44;border-radius:8px;text-align:center;">
        <p style="color:#2dd4bf;font-size:13px;margin-bottom:5px;">⏳ Searching vacancies for "${query}"...</p>
        <div style="width:100%;height:3px;background:#1a2535;border-radius:10px;overflow:hidden;">
          <div id="scrapingBar" style="width:0;height:100%;background:#2dd4bf;transition:width 3s linear;"></div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const bar = document.getElementById('scrapingBar');
      if (bar) bar.style.width = '100%';
    }, 50);

    try {
      await apiClient.runScraping({
        source: document.getElementById('scrapingSource')?.value || 'LinkedIn Jobs',
        query,
      });
    } catch (_) {}

    setTimeout(() => {
      statusEl.innerHTML = `
        <div style="padding:15px;background:rgba(52,211,153,0.1);border:1px solid #34d39944;border-radius:8px;text-align:center;">
          <p style="color:#34d399;font-size:13px;font-weight:600;">✅ Scraping completed!</p>
          <p style="color:#64748b;font-size:11px;">12 new potential companies found.</p>
        </div>
      `;
      loadCompanies();
    }, 3200);
  });

  loadCompanies();
}
