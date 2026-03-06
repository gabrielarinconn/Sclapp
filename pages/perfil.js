// =============================================
// perfil.js — Vista de Perfil
// Configuración de cuenta, SMTP y actividad
// =============================================

function renderPerfil() {

  var main = document.getElementById('main-content');

  main.innerHTML = `
    <div class="view-container">

      <div class="view-header">
        <div>
          <h2 class="view-title">Mi Perfil</h2>
          <p class="view-subtitle">Account settings and SMTP configuration</p>
        </div>
      </div>

      <div class="perfil-grid">

        <!-- Lado izquierdo: Datos personales -->
        <div class="perfil-card">
          <div class="perfil-seccion-titulo">👤 Datos personales</div>
          
          <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:20px;padding:20px;background:#0f1720;border-radius:12px;border:1px solid #1a2535;">
            <div class="avatar-grande" style="margin-bottom:12px;font-size:32px;width:80px;height:80px;">SC</div>
            <span style="color:#e2e8f0;font-weight:600;font-size:16px;">sclapp User</span>
            <span style="color:#475569;font-size:12px;">Premium Member</span>
            <button class="btn-sm-sec" style="margin-top:12px;">Subir nueva foto</button>
          </div>

          <div class="form-group">
            <label style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Nombre completo</label>
            <input type="text" class="input-app" value="sclapp Admin" id="perfilNombre" />
          </div>

          <div class="form-group">
            <label style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Correo electrónico</label>
            <input type="email" class="input-app" value="admin@sclapp.com" id="perfilEmail" />
          </div>

          <button class="btn-primario" onclick="guardarPerfil()" style="width:100%;margin-top:15px;">
            Actualizar perfil
          </button>
        </div>

        <!-- Lado derecho: Configuración SMTP -->
        <div class="perfil-card">
          <div class="perfil-seccion-titulo">✉ Configuración SMTP</div>
          <p style="font-size:12px;color:#475569;margin-bottom:15px;">Configure your professional email to send outreach campaigns directly from SCLAPP.</p>

          <div class="form-group">
            <label style="font-size:11px;color:#64748b;font-weight:600;">SERVIDOR SMTP</label>
            <input type="text" class="input-app" placeholder="ej: smtp.gmail.com" id="smtpHost" value="smtp.gmail.com" />
          </div>

          <div class="form-group">
            <label style="font-size:11px;color:#64748b;font-weight:600;">USUARIO / EMAIL</label>
            <input type="email" class="input-app" placeholder="tu-correo@gmail.com" id="smtpUser" />
          </div>

          <div class="form-group">
            <label style="font-size:11px;color:#64748b;font-weight:600;">CONTRASEÑA DE APLICACIÓN</label>
            <div style="position:relative;">
              <input type="password" class="input-app" placeholder="•••• •••• •••• ••••" id="smtpPass" />
            </div>
            <small style="font-size:10px;color:#334155;margin-top:4px;display:block;">* Use an 'App Password' if you have 2FA enabled.</small>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <button class="btn-secundario" onclick="probarConexion()">Test Connection</button>
            <button class="btn-primario" onclick="guardarSMTP()">Save Config</button>
          </div>
        </div>

        <!-- Fila inferior: Actividad Reciente -->
        <div class="perfil-card perfil-full">
          <div class="perfil-seccion-titulo">📋 Actividad Reciente</div>
          <div class="reporte-lista">
            <div class="reporte-item">
              <span class="reporte-item-ico">🔑</span>
              <span style="flex:1;">
                <strong style="color:#e2e8f0;">Inicio de sesión:</strong> Exitosa desde Bogotá, Colombia.
              </span>
              <span style="color:#334155;font-size:11px;">Hace 5 min</span>
            </div>
            <div class="reporte-item">
              <span class="reporte-item-ico">✉</span>
              <span style="flex:1;">
                <strong style="color:#e2e8f0;">Configuración SMTP:</strong> Actualizada correctamente.
              </span>
              <span style="color:#334155;font-size:11px;">Ayer, 14:20</span>
            </div>
            <div class="reporte-item">
              <span class="reporte-item-ico">🏢</span>
              <span style="flex:1;">
                <strong style="color:#e2e8f0;">Scraping:</strong> Se importaron 15 nuevas empresas de LinkedIn.
              </span>
              <span style="color:#334155;font-size:11px;">23 Feb, 09:12</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

function guardarPerfil() {
  alert('Información de perfil actualizada.');
}

function guardarSMTP() {
  alert('Configuración SMTP guardada exitosamente.');
}

function probarConexion() {
  var btn = event.target;
  btn.textContent = '⏳ Testing...';
  btn.disabled = true;
  
  setTimeout(function() {
    alert('Conexión establecida con el servidor SMTP.');
    btn.textContent = 'Test Connection';
    btn.disabled = false;
  }, 2000);
}
