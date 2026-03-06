// =============================================
// login.js — Pantalla de inicio de sesión
// Inyecta el HTML del login en #app
// =============================================

function renderLogin() {

  var app = document.getElementById('app');

  app.innerHTML = `
    <div class="logo-top">
      <div class="logo-box-auth">✦</div>
      <span class="logo-nombre-auth">sclapp</span>
    </div>

    <div class="auth-card">
      <h1 class="auth-card-titulo">Bienvenido de vuelta</h1>
      <p class="auth-card-subtitulo">Inicia sesión para continuar</p>

      <div class="error-msg" id="errorMsg"></div>

      <div class="form-group">
        <label>Email</label>
        <div class="input-wrapper">
          <span class="input-icon">✉</span>
          <input type="email" id="loginEmail" placeholder="tu@email.com" />
        </div>
      </div>

      <div class="form-group">
        <label>Contraseña</label>
        <div class="input-wrapper">
          <span class="input-icon">🔒</span>
          <input type="password" id="loginPass" placeholder="••••••••" />
          <button class="toggle-password" id="togglePass">👁</button>
        </div>
      </div>

      <button class="btn-auth" id="btnLogin">Iniciar sesión →</button>

      <div class="auth-footer">
        ¿No tienes cuenta?
        <a onclick="mostrarRegister()">Regístrate</a>
      </div>
    </div>
  `;

  // ——— Lógica del login ———

  var emailInput = document.getElementById('loginEmail');
  var passInput  = document.getElementById('loginPass');
  var btnLogin   = document.getElementById('btnLogin');
  var togglePass = document.getElementById('togglePass');
  var errorMsg   = document.getElementById('errorMsg');

  // Mostrar / ocultar contraseña
  togglePass.addEventListener('click', function() {
    if (passInput.type === 'password') {
      passInput.type = 'text';
      togglePass.textContent = '🙈';
    } else {
      passInput.type = 'password';
      togglePass.textContent = '👁';
    }
  });

  // Quitar el mensaje de error al escribir
  emailInput.addEventListener('input', function() {
    errorMsg.classList.remove('show');
  });
  passInput.addEventListener('input', function() {
    errorMsg.classList.remove('show');
  });

  // Click en "Iniciar sesión"
  btnLogin.addEventListener('click', function() {

    var email = emailInput.value.trim();
    var pass  = passInput.value.trim();

    // Validaciones básicas
    if (!email || !pass) {
      errorMsg.textContent = 'Por favor completa todos los campos.';
      errorMsg.classList.add('show');
      return;
    }

    if (!email.includes('@')) {
      errorMsg.textContent = 'Ingresa un correo electrónico válido.';
      errorMsg.classList.add('show');
      return;
    }

    if (pass.length < 6) {
      errorMsg.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      errorMsg.classList.add('show');
      return;
    }

    // Efecto de carga
    btnLogin.textContent = 'Iniciando sesión...';
    btnLogin.classList.add('loading');

    // Simulación del servidor (luego conectar con backend real)
    setTimeout(function() {
      if (email === 'admin@sclapp.com' && pass === '123456') {
        // ✅ Login exitoso → cargar el SPA
        mostrarSPA();
      } else {
        errorMsg.textContent = 'Correo o contraseña incorrectos.';
        errorMsg.classList.add('show');
        btnLogin.textContent = 'Iniciar sesión →';
        btnLogin.classList.remove('loading');
      }
    }, 1200);
  });

  // También funciona con Enter
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Enter') {
      btnLogin.click();
      document.removeEventListener('keydown', handler);
    }
  });
}
