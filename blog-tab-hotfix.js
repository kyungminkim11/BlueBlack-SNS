(() => {
  'use strict';

  const BLOG_ROUTE = '#/admin';
  const SETTINGS_ROUTE = '#/settings';

  function makeButton(label, className, targetHash, attrName) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    button.setAttribute(attrName, label.toLowerCase());
    button.addEventListener('click', () => {
      location.hash = targetHash;
    });
    return button;
  }

  function ensureStyles() {
    if (document.getElementById('blog-tab-hotfix-style')) return;
    const style = document.createElement('style');
    style.id = 'blog-tab-hotfix-style';
    style.textContent = `
      .mobile-tabs-inner{
        display:grid!important;
        grid-template-columns:repeat(5,minmax(0,1fr))!important;
        width:100%!important;
        gap:4px!important;
        overflow:visible!important;
      }
      .mobile-tabs-inner .mobile-tab{
        min-width:0!important;
        padding-left:4px!important;
        padding-right:4px!important;
        white-space:nowrap!important;
        font-size:11px!important;
      }
      .bb-blog-tab{font-weight:900!important}
      .bb-admin-tab{font-weight:800!important}
      .bb-blog-nav .nav-dot{background:#936a24!important}
      .bb-admin-nav .nav-dot{background:#315f88!important}
      @media(max-width:380px){
        .mobile-tabs-inner .mobile-tab{font-size:10px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureMobileTabs() {
    const row = document.querySelector('.mobile-tabs-inner');
    if (!row) return;

    const legacyAdmin = row.querySelector('[data-admin-route="admin"]');
    if (legacyAdmin) {
      legacyAdmin.textContent = '블로그';
      legacyAdmin.classList.add('bb-blog-tab');
    }

    if (!row.querySelector('.bb-blog-tab')) {
      const blog = makeButton('블로그', 'mobile-tab bb-blog-tab', BLOG_ROUTE, 'data-blog-hotfix');
      const settings = row.querySelector('[data-settings-route]');
      row.insertBefore(blog, settings || null);
    }

    const settings = row.querySelector('[data-settings-route]');
    if (settings) {
      settings.textContent = '관리자';
      settings.classList.add('bb-admin-tab');
    } else if (!row.querySelector('.bb-admin-tab')) {
      row.appendChild(makeButton('관리자', 'mobile-tab bb-admin-tab', SETTINGS_ROUTE, 'data-settings-hotfix'));
    }
  }

  function ensureSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const legacyAdmin = sidebar.querySelector('[data-admin-route="admin"]');
    if (legacyAdmin) {
      legacyAdmin.innerHTML = '<span class="nav-dot"></span>블로그';
      legacyAdmin.classList.add('bb-blog-nav');
    }

    if (!sidebar.querySelector('.bb-blog-nav')) {
      const blog = makeButton('블로그', 'nav-button bb-blog-nav', BLOG_ROUTE, 'data-blog-hotfix');
      blog.innerHTML = '<span class="nav-dot"></span>블로그';
      sidebar.insertBefore(blog, sidebar.querySelector('.sidebar-divider'));
    }

    const settings = sidebar.querySelector('[data-settings-route]');
    if (settings) {
      settings.innerHTML = '<span class="nav-dot"></span>관리자';
      settings.classList.add('bb-admin-nav');
    } else if (!sidebar.querySelector('.bb-admin-nav')) {
      const admin = makeButton('관리자', 'nav-button bb-admin-nav', SETTINGS_ROUTE, 'data-settings-hotfix');
      admin.innerHTML = '<span class="nav-dot"></span>관리자';
      sidebar.insertBefore(admin, sidebar.querySelector('.sidebar-divider'));
    }
  }

  function ensureTopbar() {
    const actions = document.querySelector('.topbar-actions');
    if (!actions) return;

    const legacyAdmin = actions.querySelector('[data-admin-route="admin"]');
    if (legacyAdmin) {
      legacyAdmin.textContent = '블로그';
      legacyAdmin.classList.add('bb-blog-top');
    }

    if (!actions.querySelector('.bb-blog-top')) {
      const blog = makeButton('블로그', 'ghost-button bb-blog-top', BLOG_ROUTE, 'data-blog-hotfix');
      actions.insertBefore(blog, actions.querySelector('#logout-button'));
    }

    const settings = actions.querySelector('[data-settings-route]');
    if (settings) {
      settings.textContent = '관리자';
      settings.classList.add('bb-admin-top');
    }
  }

  function ensureVisible() {
    ensureStyles();
    ensureMobileTabs();
    ensureSidebar();
    ensureTopbar();
  }

  window.addEventListener('DOMContentLoaded', ensureVisible, { once: true });
  window.addEventListener('hashchange', ensureVisible);
  setInterval(ensureVisible, 400);
})();
