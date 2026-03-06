

var app = document.getElementById('app');

// ————————————————————————————————————
// MOSTRAR LOGIN
// (el HTML lo inyecta login.js)
// ————————————————————————————————————
function mostrarLogin() {
  document.body.className = '';
  app.className = 'auth-body';
  renderLogin();
}

// ————————————————————————————————————
// MOSTRAR REGISTER
// (el HTML lo inyecta register.js)
// ————————————————————————————————————
function mostrarRegister() {
  renderRegister();
}

// ————————————————————————————————————
// MOSTRAR EL SPA COMPLETO (después del login)
// Inyecta el sidebar + topbar + footer
// y carga el dashboard por defecto
// ————————————————————————————————————
function mostrarSPA() {
  document.body.className = '';
  app.className = 'spa-body';

  app.innerHTML = `
    <!-- Sidebar izquierdo -->
    <aside id="sidebar">
      <div class="sidebar-logo">
        <div class="logo-box">✦</div>
        <span class="logo-nombre">sclapp</span>
      </div>

      <nav class="sidebar-nav">
        <button class="nav-item active" id="nav-dashboard" onclick="loadView('dashboard')">
          <span class="nav-icono">⊞</span>
          <span>Dashboard</span>
        </button>
        <button class="nav-item" id="nav-empresas" onclick="loadView('empresas')">
          <span class="nav-icono">🏢</span>
          <span>Empresas</span>
        </button>
        <button class="nav-item" id="nav-correos" onclick="loadView('correos')">
          <span class="nav-icono">✉</span>
          <span>Correos</span>
        </button>
        <button class="nav-item" id="nav-perfil" onclick="loadView('perfil')">
          <span class="nav-icono">👤</span>
          <span>Perfil</span>
        </button>
      </nav>

      <div class="sidebar-bottom">
        <button class="btn-cerrar-sesion" onclick="cerrarSesion()">
          <span>↪</span>
          <span>Cerrar sesión</span>
        </button>
        <div class="sidebar-user">
          <div class="avatar-small">SC</div>
          <div>
            <span class="sidebar-user-nombre">sclapp</span>
            <span class="sidebar-user-version">v1.0.0 MVP</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Columna derecha -->
    <div id="app-wrapper">
      <div id="topbar">
        <div class="topbar-search">
          <span style="color:#475569;font-size:13px;">🔍</span>
          <input type="text" placeholder="Buscar empresas, correos..." />
        </div>
        <div class="topbar-right">
          <button class="topbar-ico-btn">🔔</button>
          <div class="avatar-usuario">U</div>
        </div>
      </div>

      <!-- Las vistas se inyectan aquí -->
      <main id="main-content"></main>

      <footer id="footer">
        <span>sclapp v1.0.0 — Tech Talent Lead Finder</span>
        <span>Última actualización: hace 2 minutos</span>
      </footer>
    </div>
  `;

  // Cargar el dashboard al entrar
  loadView('dashboard');
}

// ————————————————————————————————————
// ROUTER — cambia la vista activa
// sin recargar la página
// ————————————————————————————————————
function loadView(vista) {

  // Marcar el botón activo en la navegación
  var botones = document.querySelectorAll('.nav-item');
  botones.forEach(function(btn) { btn.classList.remove('active'); });

  var btnActivo = document.getElementById('nav-' + vista);
  if (btnActivo) { btnActivo.classList.add('active'); }

  // Llamar a la función de renderizado correspondiente
  if (vista === 'dashboard') { renderDashboard(); }
  if (vista === 'empresas')  { renderEmpresas();  }
  if (vista === 'correos')   { renderCorreos();   }
  if (vista === 'perfil')    { renderPerfil();    }
}


function cerrarSesion() {
  var ok = confirm('¿Seguro que quieres cerrar sesión?');
  if (ok) { mostrarLogin(); }
}

// ————————————————————————————————————
// ARRANCAR → mostrar la pantalla de login
// ————————————————————————————————————
mostrarLogin();
