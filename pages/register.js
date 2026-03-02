// =============================================
// register.js — Pantalla de registro
// Inyecta el HTML del registro en #app
// =============================================

function renderRegister() {

  var app = document.getElementById('app');

  app.innerHTML = `
    <div class="logo-top">
      <div class="logo-box-auth">✦</div>
      <span class="logo-nombre-auth">sclapp</span>
    </div>

    <div class="auth-card">
      <h1 class="auth-card-titulo">Crear cuenta</h1>
      <p class="auth-card-subtitulo">Intelligent data for real opportunities</p>

      <div class="error-msg" id="errorMsg"></div>

      <div class="form-group">
        <label>Nombre completo</label>
        <div class="input-wrapper">
          <span class="input-icon">👤</span>
          <input type="text" id="regNombre" placeholder="Tu nombre" />
        </div>
      </div>

      <div class="form-group">
        <label>Email</label>
        <div class="input-wrapper">
          <span class="input-icon">✉</span>
          <input type="email" id="regEmail" placeholder="tu@email.com" />
        </div>
      </div>

      <div class="form-group">
        <label>Contraseña</label>
        <div class="input-wrapper">
          <span class="input-icon">🔒</span>
          <input type="password" id="regPass" placeholder="Mínimo 6 caracteres" />
          <button class="toggle-password" id="togglePass">👁</button>
        </div>
      </div>

      <button class="btn-auth" id="btnRegister">Crear cuenta →</button>

      <div class="auth-footer">
        ¿Ya tienes cuenta?
        <a onclick="mostrarLogin()">Inicia sesión</a>
      </div>
    </div>
  `;

  // ——— Lógica del registro ———

  var nombreInput  = document.getElementById('regNombre');
  var emailInput   = document.getElementById('regEmail');
  var passInput    = document.getElementById('regPass');
  var btnRegister  = document.getElementById('btnRegister');
  var togglePass   = document.getElementById('togglePass');
  var errorMsg     = document.getElementById('errorMsg');

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

  // Quitar error al escribir
  [nombreInput, emailInput, passInput].forEach(function(input) {
    input.addEventListener('input', function() {
      errorMsg.classList.remove('show');
    });
  });

  // Click en "Crear cuenta"
  btnRegister.addEventListener('click', function() {

    var nombre = nombreInput.value.trim();
    var email  = emailInput.value.trim();
    var pass   = passInput.value.trim();

    // Validaciones básicas
    if (!nombre || !email || !pass) {
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
    btnRegister.textContent = 'Creando cuenta...';
    btnRegister.classList.add('loading');

    // Simulación del servidor (luego conectar con backend real)
    setTimeout(function() {
      alert('¡Cuenta creada con éxito! Ahora inicia sesión.');
      mostrarLogin();
    }, 1400);
  });
}
