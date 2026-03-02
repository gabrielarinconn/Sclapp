// =============================================
// correos.js — Vista Correos / Outreach
// Kanban con 5 columnas: Ready, Enviados,
// Abiertos, Negociación, Vinculados
// =============================================

function renderCorreos() {

  var main = document.getElementById('main-content');

  // Datos de las tarjetas por columna
  var columnas = [
    {
      id: 'ready',
      icono: '☰',
      nombre: 'Ready',
      color: '#94a3b8',
      tarjetas: [
        { empresa: 'TechCorp Solutions', desc: 'Propuesta de talento junior React',     prioridad: 'Alta',  tiempo: 'Hace 2h' },
        { empresa: 'AppWorks Studio',    desc: 'Desarrolladores Angular disponibles',   prioridad: 'Media', tiempo: 'Hace 4h' },
        { empresa: 'ByteForge',          desc: 'Talento Node.js para proyecto',         prioridad: 'Media', tiempo: 'Hace 5h' }
      ]
    },
    {
      id: 'enviados',
      icono: '✈',
      nombre: 'Enviados',
      color: '#2dd4bf',
      tarjetas: [
        { empresa: 'InnovateTech',    desc: 'Propuesta colaboración tech',  prioridad: 'Alta',  tiempo: 'Hace 1d' },
        { empresa: 'CloudNine Labs', desc: 'Talento Vue.js junior',        prioridad: 'Media', tiempo: 'Hace 2d' }
      ]
    },
    {
      id: 'abiertos',
      icono: '👁',
      nombre: 'Abiertos',
      color: '#f59e0b',
      tarjetas: [
        { empresa: 'DevFactory',  desc: 'Desarrolladores Python disponibles', prioridad: 'Alta', tiempo: 'Hace 3d' },
        { empresa: 'StartupXYZ', desc: 'Equipo React para proyecto Q1',        prioridad: 'Alta', tiempo: 'Hace 4d' }
      ]
    },
    {
      id: 'negociacion',
      icono: '💬',
      nombre: 'Negociación',
      color: '#a78bfa',
      tarjetas: [
        { empresa: 'DataDriven Co', desc: 'Acuerdo de servicios tech', prioridad: 'Alta', tiempo: 'Hace 1sem' }
      ]
    },
    {
      id: 'vinculados',
      icono: '🛡',
      nombre: 'Vinculados',
      color: '#34d399',
      tarjetas: [
        { empresa: 'DevFactory', desc: 'Contrato firmado — 3 juniors', prioridad: 'Alta', tiempo: 'Hace 2sem' }
      ]
    }
  ];

  // Construir el HTML de cada columna
  function crearColumna(col) {

    // Construir las tarjetas de la columna
    var tarjetasHTML = '';

    if (col.tarjetas.length === 0) {
      tarjetasHTML = '<div class="kanban-vacio">Sin empresas en esta etapa</div>';
    } else {
      col.tarjetas.forEach(function(t) {

        // Definir el color del badge según prioridad
        var badgeClase = t.prioridad === 'Alta' ? 'badge-alta' : 'badge-media';

        tarjetasHTML += `
          <div class="kanban-tarjeta">
            <div class="kanban-tarjeta-top">
              <div class="kanban-empresa-info">
                <div class="kanban-empresa-ico">🏢</div>
                <span class="kanban-empresa-nombre">${t.empresa}</span>
              </div>
              <button class="kanban-kebab">⋮</button>
            </div>
            <p class="kanban-tarjeta-desc">${t.desc}</p>
            <div class="kanban-tarjeta-footer">
              <span class="badge ${badgeClase}">${t.prioridad}</span>
              <span class="kanban-tiempo">🕐 ${t.tiempo}</span>
            </div>
          </div>
        `;
      });
    }

    return `
      <div class="kanban-col">
        <div class="kanban-col-header">
          <span class="col-icono" style="color:${col.color};">${col.icono}</span>
          <span class="col-nombre" style="color:${col.color};">${col.nombre}</span>
          <span class="col-badge">${col.tarjetas.length}</span>
        </div>
        <div class="kanban-col-body">
          ${tarjetasHTML}
        </div>
      </div>
    `;
  }

  // Unir todas las columnas
  var todasLasColumnas = '';
  columnas.forEach(function(col) {
    todasLasColumnas += crearColumna(col);
  });

  // Inyectar el HTML completo
  main.innerHTML = `
    <div class="view-container">

      <!-- Título + botones -->
      <div class="view-header">
        <div>
          <h2 class="view-title">Correos — Outreach</h2>
          <p class="view-subtitle">Gestiona el pipeline de contacto con empresas</p>
        </div>
        <div class="view-header-botones">
          <button class="btn-secundario" onclick="abrirGeneradorIA()">
            ✦ Generar plantilla IA
          </button>
          <button class="btn-primario" onclick="envioMasivo()">
            ✈ Envío masivo
          </button>
        </div>
      </div>

      <!-- Tablero Kanban (scroll horizontal) -->
      <div class="kanban-board">
        ${todasLasColumnas}
      </div>

    </div>

    <!-- Panel lateral: Generador de plantilla IA -->
    <div class="panel-overlay" id="panelIA" style="display:none;">
      <div class="panel">
        <div class="panel-header">
          <h3>✦ Generador de plantilla IA</h3>
          <button class="modal-cerrar" onclick="cerrarPanel()">✕</button>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label style="font-size:13px;color:#64748b;display:block;margin-bottom:7px;">Asunto del correo</label>
            <input type="text" class="filtro-input" style="width:100%;"
              placeholder="Ej: Oportunidad de colaboración tech" id="asuntoPlantilla" />
          </div>
          <div class="form-group" style="margin-top:14px;">
            <label style="font-size:13px;color:#64748b;display:block;margin-bottom:7px;">Mensaje</label>
            <textarea class="email-textarea" id="cuerpoPlantilla"
              placeholder="Describe el contexto y la IA generará el correo..."></textarea>
          </div>
          <button class="btn-ia" onclick="generarConIA()">🤖 Generar con IA</button>
        </div>
        <div class="panel-footer">
          <button class="btn-cancelar" onclick="cerrarPanel()">Cancelar</button>
          <button class="btn-primario" onclick="guardarPlantilla()">Guardar plantilla</button>
        </div>
      </div>
    </div>
  `;
}

// ——————————————————————————————————————
// Funciones de los botones
// ——————————————————————————————————————

function abrirGeneradorIA() {
  document.getElementById('panelIA').style.display = 'flex';
}

function cerrarPanel() {
  document.getElementById('panelIA').style.display = 'none';
}

function guardarPlantilla() {
  alert('✅ Plantilla guardada. (se conectará con el backend)');
  cerrarPanel();
}

function generarConIA() {
  var cuerpo = document.getElementById('cuerpoPlantilla');
  cuerpo.value = 'Generando con IA...';
  setTimeout(function() {
    cuerpo.value = 'Hola {{nombre_empresa}},\n\nHemos identificado que tu empresa está buscando talento tech junior, y en SCLAPP conectamos exactamente ese perfil con empresas como la tuya.\n\n¿Podríamos agendar una llamada de 15 minutos esta semana?\n\nSaludos,\n{{tu_nombre}} — SCLAPP';
  }, 1500);
}

function envioMasivo() {
  alert('✈ Envío masivo — se conectará con el backend para enviar correos en lote.');
}
