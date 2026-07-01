(() => {
  'use strict';

  const API_URL = 'https://jnciddblcndmthmmvqrz.supabase.co/functions/v1/blueblack-instagram';
  const STORAGE_KEY = 'blueblack-instagram-recent-posts-v1';
  const DEVICE_KEY = 'blueblack-trusted-device-v1';
  const PROFILE_URL = 'https://www.instagram.com/blueblack_korea/';
  const MAX_POSTS = 24;

  let timer = null;
  let rendering = false;

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[ch]);

  function readLegacyPosts() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter((item) => item && item.url) : [];
    } catch {
      return [];
    }
  }

  function readDeviceAuth() {
    try {
      const parsed = JSON.parse(localStorage.getItem(DEVICE_KEY) || 'null');
      if (!parsed?.deviceId || !parsed?.deviceToken) return null;
      return { deviceId: parsed.deviceId, deviceToken: parsed.deviceToken };
    } catch {
      return null;
    }
  }

  async function api(action, payload = {}, requireAuth = false) {
    const body = { action, ...payload };
    if (requireAuth) {
      const auth = readDeviceAuth();
      if (!auth) return { ok: false, status: 401, data: { error: 'device_not_saved' } };
      Object.assign(body, auth);
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store'
      });
      let data = {};
      try { data = await response.json(); } catch {}
      return { ok: response.ok && data.ok, status: response.status, data };
    } catch {
      return { ok: false, status: 0, data: { error: 'network_error' } };
    }
  }

  function normalizePostUrl(value) {
    try {
      const url = new URL(String(value || '').trim());
      if (!/(^|\.)instagram\.com$/i.test(url.hostname)) return '';
      const match = url.pathname.match(/^\/(p|reel|tv)\/([^/]+)/i);
      if (!match) return '';
      return `https://www.instagram.com/${match[1].toLowerCase()}/${match[2]}/`;
    } catch {
      return '';
    }
  }

  function parseUrls(value) {
    return [...new Set(String(value || '')
      .split(/[\s,]+/)
      .map(normalizePostUrl)
      .filter(Boolean))]
      .slice(0, MAX_POSTS);
  }

  function embedUrl(url) {
    return `${url.replace(/\/$/, '')}/embed/captioned/`;
  }

  function formatDate(value) {
    if (!value) return '게시일 미입력';
    const date = new Date(value.length === 10 ? `${value}T12:00:00+09:00` : value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function latestUpdate(posts) {
    const item = posts[0];
    if (!item) return '게시물 등록 전';
    return formatDate(item.published_at || item.added_at);
  }

  function postCard(item, canManage) {
    const fallbackTitle = item.post_type === 'reel' ? 'Instagram 릴스' : 'Instagram 게시물';
    return `
      <article class="instagram-post-card" data-instagram-id="${escapeHTML(item.id)}">
        <div class="instagram-embed-wrap">
          <iframe
            src="${escapeHTML(embedUrl(item.permalink))}"
            title="${escapeHTML(item.title || fallbackTitle)}"
            loading="lazy"
            allowtransparency="true"
            allowfullscreen
            scrolling="no"
            referrerpolicy="strict-origin-when-cross-origin"></iframe>
          <div class="instagram-embed-fallback">
            <span>Instagram 미리보기를 불러오지 못했습니다.</span>
            <a href="${escapeHTML(item.permalink)}" target="_blank" rel="noopener noreferrer">게시물 열기 ↗</a>
          </div>
        </div>
        <div class="instagram-card-info">
          <div>
            <span>${escapeHTML(formatDate(item.published_at || item.added_at))}</span>
            <strong>${escapeHTML(item.title || fallbackTitle)}</strong>
            ${item.memo ? `<p>${escapeHTML(item.memo)}</p>` : ''}
          </div>
          <div class="instagram-card-actions">
            <a href="${escapeHTML(item.permalink)}" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            ${canManage ? `<button type="button" data-instagram-delete="${escapeHTML(item.id)}">삭제</button>` : ''}
          </div>
        </div>
      </article>`;
  }

  function pageMarkup(posts, online, canManage) {
    const managerDisabled = canManage ? '' : 'disabled';
    return `
      <section class="instagram-page">
        <div class="instagram-hero">
          <div class="instagram-profile-mark" aria-hidden="true">IG</div>
          <div class="instagram-profile-copy">
            <p>BLUEBLACK OFFICIAL INSTAGRAM</p>
            <h1>@blueblack_korea</h1>
            <span>Instagram에 게시한 사진과 원문을 모든 기기에서 함께 확인합니다.</span>
          </div>
          <a class="instagram-profile-link" href="${PROFILE_URL}" target="_blank" rel="noopener noreferrer">인스타그램 열기 ↗</a>
        </div>

        <div class="instagram-stats">
          <article><span>공유된 최근 글</span><strong>${posts.length}</strong><small>최대 ${MAX_POSTS}개</small></article>
          <article><span>최근 게시 기준</span><strong>${escapeHTML(latestUpdate(posts))}</strong><small>모든 기기 공통</small></article>
          <article><span>연결 상태</span><strong class="instagram-connection ${online ? 'online' : 'offline'}">${online ? '공유 연결됨' : '오프라인'}</strong><small>사진 + Instagram 원문</small></article>
        </div>

        <section class="instagram-add-panel ${canManage ? '' : 'is-locked'}">
          <div class="instagram-section-head">
            <div><p>SHARED POST MANAGER</p><h2>최근 게시물 등록</h2></div>
            <span>한 번 등록하면 휴대폰·개인 노트북·회사 노트북에서 같은 목록이 표시됩니다.</span>
          </div>
          <form id="instagram-add-form" class="instagram-add-form">
            <label class="wide"><span>Instagram 게시물 주소</span><textarea id="instagram-post-urls" rows="3" required ${managerDisabled} placeholder="게시물 또는 릴스 주소를 붙여 넣어 주세요. 여러 개는 줄바꿈으로 한 번에 등록할 수 있습니다."></textarea></label>
            <label><span>게시일</span><input id="instagram-post-date" type="date" ${managerDisabled}></label>
            <label><span>내부 표시 제목</span><input id="instagram-post-title" type="text" maxlength="120" ${managerDisabled} placeholder="예: 신제품 입고 안내"></label>
            <label class="wide"><span>메모</span><input id="instagram-post-memo" type="text" maxlength="300" ${managerDisabled} placeholder="성과, 사진 구성, 다음 콘텐츠 참고 사항"></label>
            <button type="submit" ${managerDisabled}>공유 목록에 추가</button>
          </form>
          <p id="instagram-form-message" class="instagram-form-message" role="status" aria-live="polite">${canManage ? '' : '이 브라우저에서 kevin 계정으로 로그인할 때 ‘이 기기 저장’을 선택하면 게시물을 관리할 수 있습니다.'}</p>
        </section>

        <section class="instagram-feed-section">
          <div class="instagram-section-head">
            <div><p>RECENT INSTAGRAM</p><h2>최근 게시물</h2></div>
            <div class="instagram-feed-tools">
              <button id="instagram-refresh" type="button">새로고침</button>
              <a href="${PROFILE_URL}" target="_blank" rel="noopener noreferrer">게시물 주소 확인 ↗</a>
              ${canManage && posts.length ? '<button id="instagram-clear-all" class="danger" type="button">전체 비우기</button>' : ''}
            </div>
          </div>
          ${posts.length
            ? `<div class="instagram-post-grid">${posts.map((item) => postCard(item, canManage)).join('')}</div>`
            : `<div class="instagram-empty">
                <div class="instagram-empty-icon">▦</div>
                <strong>아직 공유된 Instagram 게시물이 없습니다.</strong>
                <p>@blueblack_korea에서 게시물이나 릴스 주소를 복사해 위 입력칸에 등록하면 사진과 원문이 이곳에 표시됩니다.</p>
                <a href="${PROFILE_URL}" target="_blank" rel="noopener noreferrer">@blueblack_korea 열기 ↗</a>
              </div>`}
        </section>

        <section class="instagram-note">
          <strong>표시 방식</strong>
          <p>게시물 사진과 캡션은 Instagram 공식 임베드 화면으로 표시합니다. 등록 목록은 브라우저가 아니라 공유 서버에 저장되어 어느 기기에서 접속해도 동일하게 보입니다.</p>
        </section>
      </section>`;
  }

  function loadingMarkup() {
    return `
      <section class="instagram-page">
        <div class="instagram-loading-card">
          <span class="instagram-loading-spinner" aria-hidden="true"></span>
          <strong>Instagram 게시물을 불러오는 중입니다.</strong>
        </div>
      </section>`;
  }

  async function migrateLegacyPosts(serverPosts) {
    if (serverPosts.length || !readDeviceAuth()) return serverPosts;
    const legacy = readLegacyPosts();
    if (!legacy.length) return serverPosts;

    const response = await api('add', {
      items: legacy.map((item) => ({
        url: item.url,
        date: item.date,
        title: item.title,
        memo: item.memo,
        source: 'browser-migration'
      }))
    }, true);
    if (!response.ok) return serverPosts;
    localStorage.removeItem(STORAGE_KEY);
    const refreshed = await api('list');
    return refreshed.ok ? (refreshed.data.posts || []) : serverPosts;
  }

  function setActive(active) {
    document.querySelectorAll('[data-instagram-route="instagram"]').forEach((button) => button.classList.toggle('active', active));
    if (active) document.querySelectorAll('[data-route], [data-admin-route]').forEach((button) => button.classList.remove('active'));
  }

  async function renderInstagram(force = false) {
    const route = location.hash.replace(/^#\//, '');
    if (route !== 'instagram' || rendering) return;
    const main = document.getElementById('main-content');
    if (!main) return;
    if (!force && main.querySelector('.instagram-page:not(:has(.instagram-loading-card))')) {
      setActive(true);
      return;
    }

    rendering = true;
    main.innerHTML = loadingMarkup();
    setActive(true);

    const response = await api('list');
    let posts = response.ok ? (response.data.posts || []) : readLegacyPosts().map((item, index) => ({
      id: `legacy-${index}`,
      permalink: item.url,
      post_type: /\/reel\//.test(item.url) ? 'reel' : 'post',
      title: item.title || '',
      memo: item.memo || '',
      published_at: item.date || '',
      added_at: item.addedAt || ''
    }));

    if (response.ok) posts = await migrateLegacyPosts(posts);

    if (location.hash.replace(/^#\//, '') === 'instagram') {
      main.innerHTML = pageMarkup(posts, response.ok, Boolean(readDeviceAuth()));
      bindPage(posts);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    rendering = false;
  }

  function setMessage(text, isError = false) {
    const message = document.getElementById('instagram-form-message');
    if (!message) return;
    message.textContent = text;
    message.className = `instagram-form-message${isError ? ' error' : ''}`;
  }

  function bindPage(posts) {
    document.getElementById('instagram-add-form')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const urls = parseUrls(document.getElementById('instagram-post-urls')?.value);
      if (!urls.length) return setMessage('Instagram 게시물 또는 릴스 주소를 확인해 주세요.', true);

      const date = document.getElementById('instagram-post-date')?.value || '';
      const title = document.getElementById('instagram-post-title')?.value.trim() || '';
      const memo = document.getElementById('instagram-post-memo')?.value.trim() || '';
      setMessage('공유 목록에 저장하고 있습니다.');

      const response = await api('add', {
        items: urls.map((url) => ({ url, date, title, memo, source: 'manual' }))
      }, true);

      if (!response.ok) {
        if (response.data?.error === 'device_not_saved' || response.status === 401) {
          return setMessage('이 기기를 저장한 kevin 계정에서만 게시물을 등록할 수 있습니다.', true);
        }
        return setMessage('게시물을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.', true);
      }
      await renderInstagram(true);
    });

    document.querySelectorAll('[data-instagram-delete]').forEach((button) => button.addEventListener('click', async () => {
      if (!window.confirm('이 게시물을 공유 목록에서 삭제할까요?')) return;
      const response = await api('delete', { id: button.dataset.instagramDelete }, true);
      if (!response.ok) return window.alert('게시물을 삭제하지 못했습니다.');
      await renderInstagram(true);
    }));

    document.getElementById('instagram-clear-all')?.addEventListener('click', async () => {
      if (!window.confirm('공유된 Instagram 게시물을 모두 지울까요?')) return;
      const response = await api('clear', {}, true);
      if (!response.ok) return window.alert('게시물을 비우지 못했습니다.');
      await renderInstagram(true);
    });

    document.getElementById('instagram-refresh')?.addEventListener('click', () => renderInstagram(true));
  }

  function addNavButton(parent, className, label, before = null) {
    if (!parent || parent.querySelector('[data-instagram-route="instagram"]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.dataset.instagramRoute = 'instagram';
    button.innerHTML = className.includes('nav-button') ? '<span class="nav-dot"></span>최근 SNS' : label;
    button.addEventListener('click', () => { location.hash = '#/instagram'; });
    parent.insertBefore(button, before);
  }

  function injectNavigation() {
    const top = document.querySelector('.topbar-actions');
    const side = document.querySelector('.sidebar');
    const mobile = document.querySelector('.mobile-tabs-inner');
    addNavButton(top, 'ghost-button instagram-top-button', '최근 SNS', top?.querySelector('[data-admin-route="admin"]') || top?.querySelector('#logout-button') || null);
    addNavButton(side, 'nav-button instagram-nav-button', '최근 SNS', side?.querySelector('[data-admin-route="admin"]') || side?.querySelector('.sidebar-divider') || null);
    addNavButton(mobile, 'mobile-tab instagram-mobile-button', '최근 SNS', mobile?.querySelector('[data-admin-route="admin"]') || null);
  }

  function sync() {
    injectNavigation();
    const route = location.hash.replace(/^#\//, '') || 'schedule';
    if (route === 'instagram') {
      if (!document.querySelector('.instagram-page')) setTimeout(() => renderInstagram(false), 35);
      else setActive(true);
    } else {
      setActive(false);
    }
  }

  function scheduleSync() {
    clearTimeout(timer);
    timer = setTimeout(sync, 35);
  }

  window.addEventListener('DOMContentLoaded', scheduleSync, { once: true });
  window.addEventListener('hashchange', scheduleSync);
  new MutationObserver(scheduleSync).observe(document.documentElement, { childList: true, subtree: true });
})();