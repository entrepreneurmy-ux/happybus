// Instant Layout Shell to eliminate all fetch flicker
const SITE_HEADER = `
<header class="so-header">
  <div class="so-container">
    <div class="so-flex-row">
      <a href="admin-dashboard.html" class="so-brand">
        <div class="so-logo-box">
          <i data-lucide="bus" style="width: 24px; height: 24px; stroke-width: 2.5;"></i>
        </div>
        <div>
          <span class="so-brand-text">Happy<span class="so-brand-highlight">Bus</span></span>
        </div>
      </a>
      <div class="so-right-container">
        <button onclick="handleSignOut()" class="so-desktop-btn">
          <i data-lucide="log-out" style="width: 16px; height: 16px;"></i>
          <span>Sign Out</span>
        </button>
        <div class="so-mobile-toggle-wrap">
          <button id="mobile-menu-button" type="button" class="so-mobile-btn" aria-label="Toggle Menu">
            <i data-lucide="menu" id="menu-icon" style="width: 24px; height: 24px;"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div id="mobile-menu" class="so-mobile-dropdown hidden">
    <div style="display: flex; flex-direction: column; align-items: flex-end;">
      <button onclick="handleSignOut()" class="so-mobile-dropdown-btn">
        <i data-lucide="log-out" style="width: 16px; height: 16px;"></i>
        <span>Sign Out</span>
      </button>
    </div>
  </div>
</header>
`;

const SITE_SIDEBAR = `
<aside class="w-full md:w-64 flex-shrink-0">
  <div class="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm sticky top-24 space-y-2">
    <div class="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
      Admin Dashboard
    </div>
    <nav class="space-y-1">
      <a href="admin-dashboard.html" id="nav-overview" class="admin-nav flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold text-xs transition" data-page="admin-dashboard.html">
        <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
        <span>Overview</span>
      </a>
      <a href="admin-routes.html" id="nav-routes" class="admin-nav flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold text-xs transition" data-page="admin-routes.html">
        <i data-lucide="calendar-range" class="w-4 h-4"></i>
        <span>Routes & Schedule</span>
      </a>
      <a href="admin-driverbus.html" id="nav-driverbus" class="admin-nav flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold text-xs transition" data-page="admin-driverbus.html">
        <i data-lucide="users" class="w-4 h-4"></i>
        <span>Driver & Bus</span>
      </a>
      <a href="admin-studentdetail.html" id="nav-students" class="admin-nav flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold text-xs transition" data-page="admin-studentdetail.html">
        <i data-lucide="graduation-cap" class="w-4 h-4"></i>
        <span>Student Detail</span>
      </a>
      <a href="admin-bustracking.html" id="nav-tracking" class="admin-nav flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold text-xs transition" data-page="admin-bustracking.html">
        <i data-lucide="map-pin" class="w-4 h-4"></i>
        <span>Live GPS</span>
      </a>
      <a href="admin-payment.html" id="nav-payment" class="admin-nav flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold text-xs transition" data-page="admin-payment.html">
        <i data-lucide="credit-card" class="w-4 h-4"></i>
        <span>Payment & Revenue</span>
      </a>
      <a href="admin-setting.html" id="nav-setting" class="admin-nav flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold text-xs transition" data-page="admin-setting.html">
        <i data-lucide="settings" class="w-4 h-4"></i>
        <span>Setting</span>
      </a>
    </nav>
  </div>
</aside>
`;

// Inject instantly before paint
document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.getElementById('header-placeholder');
  const sidebarEl = document.getElementById('sidebar-placeholder');

  if (headerEl) headerEl.outerHTML = SITE_HEADER;
  if (sidebarEl) sidebarEl.outerHTML = SITE_SIDEBAR;

  // Highlight active page
  const currentFileName = window.location.pathname.split('/').pop() || 'admin-dashboard.html';
  document.querySelectorAll('.admin-nav').forEach(link => {
    if (link.getAttribute('data-page') === currentFileName) {
      link.className = "admin-nav flex items-center gap-3 px-3 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-sm transition";
    }
  });

  // Mobile menu toggle handler
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
});

async function handleSignOut() {
  if (typeof supabaseClient !== 'undefined') {
    await supabaseClient.auth.signOut();
  }
  window.location.href = 'signin.html';
}