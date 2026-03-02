// =============================================
// empresas.js — Vista de Empresas
// Tabla premium con datos realistas y filtros
// =============================================

function renderEmpresas() {

  var main = document.getElementById('main-content');

  main.innerHTML = `
    <div class="view-container">

      <div class="view-header">
        <div>
          <h2 class="view-title">Empresas</h2>
          <p class="view-subtitle">Intelligent data on tech vacancy opportunities</p>
        </div>
        <button class="btn-primario" onclick="abrirModalScraping()">
          🔍 Ejecutar scraping
        </button>
      </div>

      <!-- Filtros Premium -->
      <div class="filtros-bar">
        <div class="filtro-item" style="flex: 1;">
          <input type="text" class="filtro-input" style="width:100%;" placeholder="🔎 Buscar por nombre..." id="filtroBuscar" oninput="filtrarEmpresas()" />
        </div>
        <div class="filtro-item">
          <select class="filtro-select" id="filtroTech" onchange="filtrarEmpresas()">
            <option value="">Todas las Tecnologías</option>
            <option value="React">React</option>
            <option value="Python">Python</option>
            <option value="Node.js">Node.js</option>
            <option value="Angular">Angular</option>
          </select>
        </div>
        <div class="filtro-item">
          <select class="filtro-select" id="filtroScore" onchange="filtrarEmpresas()">
            <option value="">Cualquier Score</option>
            <option value="Alta">Oportunidad Alta</option>
            <option value="Media">Oportunidad Media</option>
          </select>
        </div>
      </div>

      <!-- Tabla Estilo Dashboard -->
      <div class="tabla-wrapper">
        <table class="tabla">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Tecnologías</th>
              <th>Nivel</th>
              <th>Ciudad</th>
              <th>Score IA</th>
              <th style="text-align:right;">Acciones</th>
            </tr>
          </thead>
          <tbody id="tablaBody">
            <!-- Los datos se inyectan dinámicamente -->
          </tbody>
        </table>
      </div>

    </div>

    <!-- Modal de Scraping -->
    <div class="panel-overlay" id="modalScraping" style="display:none;">
      <div class="panel">
        <div class="panel-header">
          <h3>🔍 Configurar Scraping</h3>
          <button class="modal-cerrar" onclick="cerrarModalScraping()">✕</button>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label>Plataforma de búsqueda</label>
            <select class="filtro-select" style="width:100%;" id="scrapingSource">
              <option>LinkedIn Jobs</option>
              <option>Computrabajo</option>
              <option>Indeed Colombia</option>
            </select>
          </div>
          <div class="form-group">
            <label>Tecnología objetivo</label>
            <input type="text" class="filtro-input" style="width:100%;" placeholder="ej: Senior React Developer" id="scrapingQuery" />
          </div>
          <div id="scrapingStatus" style="margin-top:15px;"></div>
        </div>
        <div class="panel-footer">
          <button class="btn-cancelar" onclick="cerrarModalScraping()">Cancelar</button>
          <button class="btn-primario" onclick="ejecutarScraping()">Iniciar búsqueda</button>
        </div>
      </div>
    </div>
  `;

  // Cargar datos iniciales
  cargarDatosEmpresas();
}

// Datos realistas para simular el sistema
var datosEmpresas = [
  { nombre: 'TechCorp Solutions', tech: 'React, Node.js', nivel: 'Senior', ciudad: 'Bogotá', score: 'Alta' },
  { nombre: 'InnovateTech', tech: 'Python, Django', nivel: 'Mid', ciudad: 'Medellín', score: 'Alta' },
  { nombre: 'ByteForge', tech: 'Angular, .NET', nivel: 'Junior', ciudad: 'Cali', score: 'Media' },
  { nombre: 'AppWorks Studio', tech: 'React Native', nivel: 'Mid', ciudad: 'Remoto', score: 'Alta' },
  { nombre: 'CloudNine Labs', tech: 'Node.js, AWS', nivel: 'Senior', ciudad: 'Bogotá', score: 'Media' },
  { nombre: 'DevFactory', tech: 'Python, FastAPI', nivel: 'Mid', ciudad: 'Medellín', score: 'Alta' },
  { nombre: 'StartupXYZ', tech: 'Vue.js, Firebase', nivel: 'Junior', ciudad: 'Bucaramanga', score: 'Alta' }
];

function cargarDatosEmpresas(filtro = '') {
  var tbody = document.getElementById('tablaBody');
  if (!tbody) return;

  var techFiltro = document.getElementById('filtroTech')?.value || '';
  var scoreFiltro = document.getElementById('filtroScore')?.value || '';
  var textoFiltro = document.getElementById('filtroBuscar')?.value.toLowerCase() || '';

  var filtrados = datosEmpresas.filter(function(e) {
    var matchText = e.nombre.toLowerCase().includes(textoFiltro);
    var matchTech = techFiltro === '' || e.tech.includes(techFiltro);
    var matchScore = scoreFiltro === '' || e.score === scoreFiltro;
    return matchText && matchTech && matchScore;
  });

  if (filtrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="tabla-vacia">🔍 No se encontraron empresas con esos criterios.</td></tr>';
    return;
  }

  var html = '';
  filtrados.forEach(function(e) {
    var scoreClass = e.score === 'Alta' ? 'badge-alta' : 'badge-media';
    html += `
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
          <button class="kanban-kebab" onclick="abrirOpcionesEmpresa('${e.nombre}')">⋮</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function filtrarEmpresas() {
  cargarDatosEmpresas();
}

function abrirModalScraping() {
  document.getElementById('modalScraping').style.display = 'flex';
}

function cerrarModalScraping() {
  document.getElementById('modalScraping').style.display = 'none';
  document.getElementById('scrapingStatus').innerHTML = '';
}

function ejecutarScraping() {
  var status = document.getElementById('scrapingStatus');
  var query = document.getElementById('scrapingQuery').value;
  
  if (!query) {
    alert('Por favor ingresa un término de búsqueda.');
    return;
  }

  status.innerHTML = `
    <div style="padding:15px;background:rgba(45,212,191,0.05);border:1px dashed #2dd4bf44;border-radius:8px;text-align:center;">
      <p style="color:#2dd4bf;font-size:13px;margin-bottom:5px;">⏳ Buscando vacantes para "${query}"...</p>
      <div style="width:100%;height:3px;background:#1a2535;border-radius:10px;overflow:hidden;">
        <div id="scrapingBar" style="width:0;height:100%;background:#2dd4bf;transition:width 3s linear;"></div>
      </div>
    </div>
  `;

  setTimeout(function() {
    document.getElementById('scrapingBar').style.width = '100%';
  }, 50);

  setTimeout(function() {
    status.innerHTML = `
      <div style="padding:15px;background:rgba(52,211,153,0.1);border:1px solid #34d39944;border-radius:8px;text-align:center;">
        <p style="color:#34d399;font-size:13px;font-weight:600;">✅ ¡Scraping completado!</p>
        <p style="color:#64748b;font-size:11px;">Se encontraron 12 nuevas empresas potenciales.</p>
      </div>
    `;
  }, 3200);
}

function abrirOpcionesEmpresa(nombre) {
  alert('Opciones para ' + nombre + ' (Contactar, Ver detalles, Ignorar)');
}
