// SPA bootstrap: auth via cookies (GET /auth/me). No localStorage for session.

import { initRouter, navigateTo } from './router.js';
import { apiClient, setSessionExpiredHandler } from './apiClient.js';
import { renderLoginView } from './login.js';
import { renderRegisterView } from './register.js';
import { renderDashboardView } from './dashboard.js';
import { renderCompaniesView } from './empresas.js';
import { renderEmailsView } from './correos.js';
import { renderProfileView } from './perfil.js';

const appRoot = document.getElementById('app');

export function showLoginScreen() {
  document.body.className = 'auth-body';
  appRoot.className = '';
  renderLoginView(appRoot, {
    onSubmit: handleLoginSubmit,
    onGoToRegister: showRegisterScreen,
  });
}

export function showRegisterScreen() {
  document.body.className = 'auth-body';
  appRoot.className = '';
  renderRegisterView(appRoot, {
    onSubmit: handleRegisterSubmit,
    onGoToLogin: showLoginScreen,
  });
}

function showAppShell(user) {
  document.body.className = '';
  appRoot.className = 'spa-body';

  const displayName = user?.full_name || user?.user_name || 'sclapp';
  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'SC';

  appRoot.innerHTML = `
    <aside id="sidebar">
      <div class="sidebar-logo">
        <div class="logo-box">✦</div>
        <span class="logo-nombre">sclapp</span>
      </div>
      <nav class="sidebar-nav">
        <button class="nav-item" data-view="dashboard">
          <span class="nav-icono">⊞</span>
          <span>Dashboard</span>
        </button>
        <button class="nav-item" data-view="companies">
          <span class="nav-icono">🏢</span>
          <span>Companies</span>
        </button>
        <button class="nav-item" data-view="emails">
          <span class="nav-icono">✉</span>
          <span>Emails</span>
        </button>
        <button class="nav-item" data-view="profile">
          <span class="nav-icono">👤</span>
          <span>Profile</span>
        </button>
      </nav>
      <div class="sidebar-bottom">
        <button class="btn-cerrar-sesion" id="btnLogout">
          <span>↪</span>
          <span>Log out</span>
        </button>
        <div class="sidebar-user">
          <div class="avatar-small" id="sidebarAvatar">${initials}</div>
          <div>
            <span class="sidebar-user-nombre" id="sidebarUserName">${displayName}</span>
            <span class="sidebar-user-version">v1.0.0 MVP</span>
          </div>
        </div>
      </div>
    </aside>
    <div id="app-wrapper">
      <div id="topbar">
        <div class="topbar-search">
          <span style="color:#475569;font-size:13px;">🔍</span>
          <input type="text" placeholder="Search companies, emails..." />
        </div>
        <div class="topbar-right">
          <button class="topbar-ico-btn">🔔</button>
          <div class="avatar-usuario">${initials}</div>
        </div>
      </div>
      <main id="main-content"></main>
      <footer id="footer">
        <span>sclapp v1.0.0 — Tech Talent Lead Finder</span>
        <span>Last update: 2 minutes ago</span>
      </footer>
    </div>
  `;

  const mainContent = document.getElementById('main-content');
  initRouter({
    mainElement: mainContent,
    routes: {
      dashboard: renderDashboardView,
      companies: renderCompaniesView,
      emails: renderEmailsView,
      profile: renderProfileView,
    },
  });

  document.querySelectorAll('#sidebar .nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      setActiveNav(view);
      navigateTo(view);
      window.location.hash = view;
    });
  });

  const logoutButton = document.getElementById('btnLogout');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      const confirmed = window.confirm('Are you sure you want to log out?');
      if (confirmed) {
        try {
          await apiClient.logout();
        } catch (_) {}
        showLoginScreen();
      }
    });
  }

  const initialView = window.location.hash.replace('#', '') || 'dashboard';
  setActiveNav(initialView);
  navigateTo(initialView);
}

function setActiveNav(view) {
  document.querySelectorAll('#sidebar .nav-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
}

async function handleLoginSubmit({ email, password, showError, setLoading }) {
  setLoading(true);
  try {
    const response = await apiClient.login({ email, password });
    if (response?.user) {
      showAppShell(response.user);
      return;
    }
    showError('Invalid email or password.');
  } catch (err) {
    if (err?.message?.includes('401')) {
      showError('Invalid email or password.');
    } else {
      showError('Unable to reach the server. Please try again.');
    }
  } finally {
    setLoading(false);
  }
}

async function handleRegisterSubmit({ name, email, password, showError, setLoading }) {
  setLoading(true);
  try {
    await apiClient.register({ full_name: name, email, password });
    window.alert('Account created successfully. Please log in.');
    showLoginScreen();
  } catch (err) {
    showError(err?.message?.includes('409') ? 'Email already registered.' : 'Unable to create account. Please try again.');
  } finally {
    setLoading(false);
  }
}

setSessionExpiredHandler(() => showLoginScreen());

(async () => {
  try {
    const data = await apiClient.me();
    if (data?.user) {
      showAppShell(data.user);
      return;
    }
  } catch (_) {}
  showLoginScreen();
})();
