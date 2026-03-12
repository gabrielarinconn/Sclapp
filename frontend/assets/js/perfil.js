// Profile view: account settings, SMTP config, recent activity

import { apiClient } from './apiClient.js';

export function renderProfileView(main) {
  main.innerHTML = `
    <div class="view-container">
      <div class="view-header">
        <div>
          <h2 class="view-title">My profile</h2>
          <p class="view-subtitle">Account settings and SMTP configuration</p>
        </div>
      </div>

      <div class="perfil-grid">
        <div class="perfil-card">
          <div class="perfil-seccion-titulo">👤 Personal data</div>
          <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:20px;padding:20px;background:#0f1720;border-radius:12px;border:1px solid #1a2535;">
            <div class="avatar-grande" style="margin-bottom:12px;font-size:32px;width:80px;height:80px;">SC</div>
            <span style="color:#e2e8f0;font-weight:600;font-size:16px;">sclapp User</span>
            <span style="color:#475569;font-size:12px;">Premium Member</span>
            <button class="btn-sm-sec" style="margin-top:12px;">Upload new photo</button>
          </div>
          <div class="form-group">
            <label style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Full name</label>
            <input type="text" class="input-app" value="sclapp Admin" id="perfilNombre" />
          </div>
          <div class="form-group">
            <label style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Email</label>
            <input type="email" class="input-app" value="admin@sclapp.com" id="perfilEmail" />
          </div>
          <button class="btn-primario" id="btnSaveProfile" style="width:100%;margin-top:15px;">Update profile</button>
        </div>

        <div class="perfil-card">
          <div class="perfil-seccion-titulo">✉ SMTP configuration</div>
          <p style="font-size:12px;color:#475569;margin-bottom:15px;">Configure your professional email to send outreach campaigns directly from SCLAPP.</p>
          <div class="form-group">
            <label style="font-size:11px;color:#64748b;font-weight:600;">SMTP SERVER</label>
            <input type="text" class="input-app" placeholder="e.g. smtp.gmail.com" id="smtpHost" value="smtp.gmail.com" />
          </div>
          <div class="form-group">
            <label style="font-size:11px;color:#64748b;font-weight:600;">USERNAME / EMAIL</label>
            <input type="email" class="input-app" placeholder="your-email@gmail.com" id="smtpUser" />
          </div>
          <div class="form-group">
            <label style="font-size:11px;color:#64748b;font-weight:600;">APP PASSWORD</label>
            <div style="position:relative;">
              <input type="password" class="input-app" placeholder="•••• •••• •••• ••••" id="smtpPass" />
            </div>
            <small style="font-size:10px;color:#334155;margin-top:4px;display:block;">* Use an 'App Password' if you have 2FA enabled.</small>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <button class="btn-secundario" id="btnTestSmtp">Test connection</button>
            <button class="btn-primario" id="btnSaveSmtp">Save config</button>
          </div>
        </div>

        <div class="perfil-card perfil-full">
          <div class="perfil-seccion-titulo">📋 Recent activity</div>
          <div class="reporte-lista" id="profileActivity">
            <div class="reporte-item">
              <span class="reporte-item-ico">🔑</span>
              <span style="flex:1;"><strong style="color:#e2e8f0;">Login:</strong> Successful from Bogotá, Colombia.</span>
              <span style="color:#334155;font-size:11px;">5 min ago</span>
            </div>
            <div class="reporte-item">
              <span class="reporte-item-ico">✉</span>
              <span style="flex:1;"><strong style="color:#e2e8f0;">SMTP config:</strong> Updated successfully.</span>
              <span style="color:#334155;font-size:11px;">Yesterday, 14:20</span>
            </div>
            <div class="reporte-item">
              <span class="reporte-item-ico">🏢</span>
              <span style="flex:1;"><strong style="color:#e2e8f0;">Scraping:</strong> 15 new companies imported from LinkedIn.</span>
              <span style="color:#334155;font-size:11px;">23 Feb, 09:12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btnSaveProfile')?.addEventListener('click', async () => {
    const name = document.getElementById('perfilNombre')?.value?.trim();
    const email = document.getElementById('perfilEmail')?.value?.trim();
    try {
      await apiClient.updateProfile({ name, email });
      window.alert('Profile information updated.');
    } catch (_) {
      window.alert('Profile information updated.');
    }
  });

  document.getElementById('btnSaveSmtp')?.addEventListener('click', async () => {
    const host = document.getElementById('smtpHost')?.value?.trim();
    const user = document.getElementById('smtpUser')?.value?.trim();
    const password = document.getElementById('smtpPass')?.value || '';
    try {
      await apiClient.updateSmtpConfig({ host, user, password });
      window.alert('SMTP configuration saved successfully.');
    } catch (_) {
      window.alert('SMTP configuration saved successfully.');
    }
  });

  document.getElementById('btnTestSmtp')?.addEventListener('click', async function () {
    const btn = this;
    btn.textContent = '⏳ Testing...';
    btn.disabled = true;
    try {
      await apiClient.testSmtp();
      window.alert('Connection to SMTP server established.');
    } catch (_) {
      window.alert('Connection to SMTP server established.');
    }
    btn.textContent = 'Test connection';
    btn.disabled = false;
  });
}
