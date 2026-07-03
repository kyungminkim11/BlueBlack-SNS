(() => {
  'use strict';

  const BLOG_ROUTE = 'blog';
  const LEGACY_BLOG_ROUTE = 'admin';
  const SETTINGS_ROUTE = 'settings';
  const BLOG_STORAGE_KEY = 'blueblack-admin-blog-plan-v1';
  let timer = null;
  let blogStartedAt = 0;
  let settingsRun = 0;

  const currentRoute = () => location.hash.replace(/^#\//, '') || 'schedule';

  function injectStyles() {
    if (document.getElementById('workspace-route-split-style')) return;
    const style = document.createElement('style');
    style.id = 'workspace-route-split-style';
    style.textContent = `
      body.route-blog .blog-duty-reminder,
      body.route-settings .blog-duty-reminder{display:none!important}
      body.route-blog #ops-admin-suite,
      body.route-blog #trusted-device-manager{display:none!important}
      .blog-route-button .nav-dot{background:#936a24!important}
      .settings-route-button .nav-dot{background:#315f88!important}
      .settings-page{display:grid;gap:20px}
      .settings-loading{padding:22px;border:1px solid rgba(35,53,45,.12);border-radius:17px;background:#fff;color:#718079;font-size:13px}
      .settings-page .admin-hero{background:linear-gradient(135deg,#eef3f8 0%,#fff 70%)}
      .blog-workspace-page>.admin-hero{background:linear-gradient(135deg,#fff5df 0%,#fff 72%)}
      .blog-workspace-page>.admin-hero .admin-eyebrow{color:#8a6428}
      .blog-workspace-page>.admin-hero .admin-hero-actions a{background:#765a25}
      @media(max-width:720px){
        .mobile-tabs-inner{overflow-x:auto;scrollbar-width:none}
        .mobile-tabs-inner::-webkit-scrollbar{display:none}
        .mobile-tabs-inner .mobile-tab{flex:0 0 auto;min-width:64px}
      }
      @media(max-width:460px){
        .settings-top-button{display:none}
      }
    `;
    document.head.appendChild(style);
  }

  function labelBlogButton(button) {
    if (!button) return;
    button.classList.add('blog-route-button');
    if (button.classList.contains('nav-button')) {
      button.innerHTML = '<span class="nav-dot"></span>블로그';
    } else {
      button.textContent = '블로그';
    }
  }

  function relabelLegacyAdminButtons() {
    document.querySelectorAll('[data-admin-route="admin"]').forEach(labelBlogButton);
  }

  function makeSettingsButton(className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `${className} settings-route-button`;
    button.dataset.settingsRoute = SETTINGS_ROUTE;
    button.innerHTML = className.includes('nav-button')
      ? '<span class="nav-dot"></span>관리자'
      : '관리자';
    button.addEventListener('click', () => { location.hash = '#/settings'; });
    return button;
  }

  function injectSettingsNavigation() {
    const top = document.querySelector('.topbar-actions');
    const side = document.querySelector('.sidebar');
    const mobile = document.querySelector('.mobile-tabs-inner');

    if (top && !top.querySelector('[data-settings-route]')) {
      top.insertBefore(makeSettingsButton('ghost-button settings-top-button'), top.querySelector('#logout-button'));
    }
    if (side && !side.querySelector('[data-settings-route]')) {
      side.insertBefore(makeSettingsButton('nav-button settings-nav-button'), side.querySelector('.sidebar-divider'));
    }
    if (mobile && !mobile.querySelector('[data-settings-route]')) {
      mobile.appendChild(makeSettingsButton('mobile-tab settings-mobile-button'));
    }
  }

  function setRouteClasses(route) {
    document.body.classList.toggle('route-blog', route === BLOG_ROUTE || route === LEGACY_BLOG_ROUTE);
    document.body.classList.toggle('route-settings', route === SETTINGS_ROUTE);
  }

  function setActiveNavigation(route) {
    if (route === BLOG_ROUTE || route === LEGACY_BLOG_ROUTE) {
      document.querySelectorAll('[data-route], [data-settings-route]').forEach((button) => button.classList.remove('active'));
      document.querySelectorAll('[data-admin-route="admin"]').forEach((button) => button.classList.add('active'));
      return;
    }
    if (route === SETTINGS_ROUTE) {
      document.querySelectorAll('[data-route], [data-admin-route]').forEach((button) => button.classList.remove('active'));
      document.querySelectorAll('[data-settings-route]').forEach((button) => button.classList.add('active'));
      return;
    }
    document.querySelectorAll('[data-settings-route], [data-admin-route]').forEach((button) => button.classList.remove('active'));
  }

  function updateStoredBlogWording() {
    try {
      const data = JSON.parse(localStorage.getItem(BLOG_STORAGE_KEY) || 'null');
      const slots = data?.months?.['2026-07'];
      if (!Array.isArray(slots)) return;
      let changed = false;
      slots.forEach((slot) => {
        if (typeof slot.memo === 'string' && slot.memo.includes('관리자 화면')) {
          slot.memo = slot.memo.replaceAll('관리자 화면', '블로그 탭');
          changed = true;
        }
      });
      if (changed) localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }

  function polishBlogPage() {
    const page = document.querySelector('.admin-page');
    if (!page) return;
    page.classList.add('blog-workspace-page');
    page.classList.remove('settings-page');

    const hero = page.querySelector(':scope > .admin-hero');
    if (hero) {
      const eyebrow = hero.querySelector('.admin-eyebrow');
      const title = hero.querySelector('h1');
      const description = hero.querySelector('p:not(.admin-eyebrow)');
      const blogLink = hero.querySelector('.admin-hero-actions a');
      if (eyebrow) eyebrow.textContent = 'BLUEBLACK NAVER BLOG';
      if (title) title.textContent = '블로그';
      if (description) description.textContent = '게시 일정, 주제 기획, 초안, 제품 조사와 검증 링크를 한곳에서 관리합니다.';
      if (blogLink) blogLink.textContent = '네이버 블로그 열기 ↗';
      hero.querySelector('#admin-open-guide')?.remove();
    }

    page.querySelector('#ops-admin-suite')?.remove();
    page.querySelector('#trusted-device-manager')?.remove();
    document.querySelectorAll('.blog-duty-reminder').forEach((element) => element.remove());

    page.querySelectorAll('input, textarea').forEach((field) => {
      if (typeof field.value === 'string' && field.value.includes('관리자 화면')) {
        field.value = field.value.replaceAll('관리자 화면', '블로그 탭');
      }
    });

    const toolsTitle = page.querySelector('.admin-tools strong');
    if (toolsTitle?.textContent.trim() === '관리 데이터') toolsTitle.textContent = '블로그 데이터';
    document.title = 'BlueBlack Blog — Internal Workspace';
  }

  function blogReady() {
    const workbench = document.getElementById('july-blog-workbench');
    return Boolean(
      document.querySelector('.admin-page .admin-blog-section') &&
      workbench &&
      document.getElementById('opus88-product-research') &&
      workbench.dataset.enhanced === 'true'
    );
  }

  function finalizeBlogRoute(force = false) {
    if (currentRoute() !== LEGACY_BLOG_ROUTE) return;
    if (!blogStartedAt) blogStartedAt = Date.now();
    if (!force && !blogReady() && Date.now() - blogStartedAt < 4500) return;

    history.replaceState(null, '', '#/blog');
    blogStartedAt = 0;
    setRouteClasses(BLOG_ROUTE);
    polishBlogPage();
    relabelLegacyAdminButtons();
    injectSettingsNavigation();
    setActiveNavigation(BLOG_ROUTE);
  }

  function beginBlogRoute() {
    const route = currentRoute();
    if (route === BLOG_ROUTE && !document.querySelector('.admin-page .admin-blog-section')) {
      location.hash = '#/admin';
      return;
    }
    if (route === LEGACY_BLOG_ROUTE) {
      if (!blogStartedAt) blogStartedAt = Date.now();
      finalizeBlogRoute(false);
      return;
    }
    if (route === BLOG_ROUTE) {
      polishBlogPage();
      setActiveNavigation(BLOG_ROUTE);
    }
  }

  function settingsMarkup() {
    return `
      <section class="admin-page settings-page">
        <div class="admin-hero">
          <div>
            <p class="admin-eyebrow">BLUEBLACK SNS ADMIN</p>
            <h1>관리자</h1>
            <p>SNS 게시 운영, 최종 원고 검수, 권한, 로그인 기기와 백업 설정을 관리합니다.</p>
          </div>
          <div class="admin-hero-actions">
            <button id="settings-open-guide" type="button">SNS 작성 기준</button>
          </div>
        </div>
        <div id="settings-loading" class="settings-loading">관리자 운영 데이터를 불러오는 중입니다.</div>
      </section>`;
  }

  function refreshSettingsPanels(runId) {
    if (currentRoute() !== SETTINGS_ROUTE || runId !== settingsRun) return;

    if (!document.getElementById('ops-admin-suite') && window.BLUEBLACK_CONTENT_OPERATIONS?.refreshAdmin) {
      const originalHash = location.hash;
      history.replaceState(null, '', '#/admin');
      try { window.BLUEBLACK_CONTENT_OPERATIONS.refreshAdmin(); }
      finally { history.replaceState(null, '', originalHash); }
    }

    if (!document.getElementById('trusted-device-manager')) {
      window.BLUEBLACK_TRUSTED_DEVICES?.refreshManager?.();
    }

    if (document.getElementById('ops-admin-suite') || document.getElementById('trusted-device-manager')) {
      document.getElementById('settings-loading')?.remove();
    }
  }

  function renderSettings() {
    const main = document.getElementById('main-content');
    if (!main || currentRoute() !== SETTINGS_ROUTE) return;

    if (!main.querySelector('.settings-page')) main.innerHTML = settingsMarkup();
    setRouteClasses(SETTINGS_ROUTE);
    setActiveNavigation(SETTINGS_ROUTE);
    document.title = 'BlueBlack SNS Admin — Internal Workspace';

    main.querySelector('#settings-open-guide')?.addEventListener('click', () => {
      document.querySelector('[data-sns-writing-guide]')?.click();
    }, { once: true });

    const runId = ++settingsRun;
    [0, 350, 900, 1800].forEach((delay) => {
      setTimeout(() => refreshSettingsPanels(runId), delay);
    });
  }

  function sync() {
    injectStyles();
    relabelLegacyAdminButtons();
    injectSettingsNavigation();

    const route = currentRoute();
    setRouteClasses(route);

    if (route === LEGACY_BLOG_ROUTE || route === BLOG_ROUTE) beginBlogRoute();
    else if (route === SETTINGS_ROUTE) renderSettings();
    else {
      blogStartedAt = 0;
      setActiveNavigation(route);
      document.querySelectorAll('.blog-duty-reminder').forEach((element) => element.remove());
      if (document.querySelector('.workspace')) document.title = 'BlueBlack SNS — Internal Workspace';
    }
  }

  function scheduleSync() {
    clearTimeout(timer);
    timer = setTimeout(sync, 45);
  }

  updateStoredBlogWording();
  window.addEventListener('DOMContentLoaded', scheduleSync, { once: true });
  window.addEventListener('hashchange', scheduleSync);
  new MutationObserver(scheduleSync).observe(document.documentElement, { childList: true, subtree: true });
})();
