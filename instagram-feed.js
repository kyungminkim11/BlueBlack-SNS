(() => {
  'use strict';

  const STORAGE_KEY = 'blueblack-instagram-recent-posts-v1';
  const PROFILE_URL = 'https://www.instagram.com/blueblack_korea/';
  const MAX_POSTS = 12;
  let timer = null;

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[ch]);

  function readPosts() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter((item) => item && item.url) : [];
    } catch {
      return [];
    }
  }

  function writePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts.slice(0, MAX_POSTS)));
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

  function embedUrl(url) {
    return `${url.replace(/\/$/, '')}/embed/captioned/`;
  }

  function formatDate(value) {
    if (!value) return '날짜 미입력';
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function latestUpdate(posts) {
    const item = posts[0];
    if (!item) return '게시물 등록 전';
    return item.date ? formatDate(item.date) : '최근 등록됨';
  }

  function postCard(item, index) {
    return `
      <article class="instagram-post-card" data-instagram-index="${index}">
        <div class="instagram-embed-wrap">
          <iframe
            src="${escapeHTML(embedUrl(item.url))}"
            title="${escapeHTML(item.title || `Instagram 게시물 ${index + 1}`)}"
            loading="lazy"
            allowtransparency="true"
            allowfullscreen
            scrolling="no"
            referrerpolicy="strict-origin-when-cross-origin"></iframe>
          <div class="instagram-embed-fallback">
            <span>Instagram 미리보기를 불러오지 못했습니다.</span>
            <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">게시물 열기 ↗</a>
          </div>
        </div>
        <div class="instagram-card-info">
          <div>
            <span>${escapeHTML(formatDate(item.date))}</span>
            <strong>${escapeHTML(item.title || '제목 미입력')}</strong>
            ${item.memo ? `<p>${escapeHTML(item.memo)}</p>` : ''}
          </div>
          <div class="instagram-card-actions">
            <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            <button type="button" data-instagram-delete="${index}">삭제</button>
          </div>
        </div>
      </article>`;
  }

  function pageMarkup(posts) {
    return `
      <section class="instagram-page">
        <div class="instagram-hero">
          <div class="instagram-profile-mark" aria-hidden="true">IG</div>
          <div class="instagram-profile-copy">
            <p>BLUEBLACK OFFICIAL INSTAGRAM</p>
            <h1>@blueblack_korea</h1>
            <span>최근 게시물과 사진을 사내 워크스페이스에서 함께 확인합니다.</span>
          </div>
          <a class="instagram-profile-link" href="${PROFILE_URL}" target="_blank" rel="noopener noreferrer">인스타그램 열기 ↗</a>
        </div>

        <div class="instagram-stats">
          <article><span>등록된 최근 글</span><strong>${posts.length}</strong><small>최대 ${MAX_POSTS}개</small></article>
          <article><span>최근 갱신</span><strong>${escapeHTML(latestUpdate(posts))}</strong><small>현재 브라우저 기준</small></article>
          <article><span>표시 방식</span><strong>사진 + 원문</strong><small>Instagram 공식 임베드</small></article>
        </div>

        <section class="instagram-add-panel">
          <div class="instagram-section-head">
            <div><p>RECENT POST MANAGER</p><h2>최근 게시물 추가</h2></div>
            <span>게시물·릴스 주소를 붙여 넣으면 사진과 원문이 함께 표시됩니다.</span>
          </div>
          <form id="instagram-add-form" class="instagram-add-form">
            <label class="wide"><span>Instagram 게시물 주소</span><input id="instagram-post-url" type="url" required placeholder="https://www.instagram.com/p/... 또는 /reel/..."></label>
            <label><span>게시일</span><input id="instagram-post-date" type="date"></label>
            <label><span>내부 표시 제목</span><input id="instagram-post-title" type="text" maxlength="80" placeholder="예: 신제품 입고 안내"></label>
            <label class="wide"><span>메모</span><input id="instagram-post-memo" type="text" maxlength="160" placeholder="성과, 사진 구성, 다음 콘텐츠 참고 사항"></label>
            <button type="submit">최근 글에 추가</button>
          </form>
          <p id="instagram-form-message" class="instagram-form-message" role="status" aria-live="polite"></p>
        </section>

        <section class="instagram-feed-section">
          <div class="instagram-section-head">
            <div><p>RECENT INSTAGRAM</p><h2>최근 게시물</h2></div>
            <div class="instagram-feed-tools">
              <a href="${PROFILE_URL}" target="_blank" rel="noopener noreferrer">최근 게시물 주소 확인 ↗</a>
              ${posts.length ? '<button id="instagram-clear-all" type="button">전체 비우기</button>' : ''}
            </div>
          </div>
          ${posts.length
            ? `<div class="instagram-post-grid">${posts.map(postCard).join('')}</div>`
            : `<div class="instagram-empty">
                <div class="instagram-empty-icon">▦</div>
                <strong>아직 등록된 최근 게시물이 없습니다.</strong>
                <p>Instagram에서 최근 게시물을 연 뒤 주소를 복사해 위 입력칸에 붙여 넣어 주세요. 사진과 캡션이 이곳에 바로 표시됩니다.</p>
                <a href="${PROFILE_URL}" target="_blank" rel="noopener noreferrer">@blueblack_korea 열기 ↗</a>
              </div>`}
        </section>

        <section class="instagram-note">
          <strong>자동 연동 안내</strong>
          <p>Instagram은 공개 프로필의 최신 글 목록을 정적 웹사이트에서 직접 가져오는 기능을 제공하지 않습니다. 현재 방식은 게시물 주소만 한 번 등록하면 사진과 원문을 공식 임베드로 계속 확인할 수 있도록 구성했습니다.</p>
        </section>
      </section>`;
  }

  function setActive(active) {
    document.querySelectorAll('[data-instagram-route="instagram"]').forEach((button) => button.classList.toggle('active', active));
    if (active) {
      document.querySelectorAll('[data-route], [data-admin-route]').forEach((button) => button.classList.remove('active'));
    }
  }

  function renderInstagram() {
    const route = location.hash.replace(/^#\//, '');
    if (route !== 'instagram') return;
    const main = document.getElementById('main-content');
    if (!main) return;
    const posts = readPosts();
    main.innerHTML = pageMarkup(posts);
    setActive(true);
    bindPage(posts);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function bindPage(posts) {
    const form = document.getElementById('instagram-add-form');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = document.getElementById('instagram-form-message');
      const url = normalizePostUrl(document.getElementById('instagram-post-url')?.value);
      if (!url) {
        message.textContent = 'Instagram 게시물 또는 릴스 주소를 확인해 주세요.';
        message.className = 'instagram-form-message error';
        return;
      }
      if (posts.some((item) => item.url === url)) {
        message.textContent = '이미 등록된 게시물입니다.';
        message.className = 'instagram-form-message error';
        return;
      }
      const next = [{
        url,
        date: document.getElementById('instagram-post-date')?.value || '',
        title: document.getElementById('instagram-post-title')?.value.trim() || '',
        memo: document.getElementById('instagram-post-memo')?.value.trim() || '',
        addedAt: new Date().toISOString()
      }, ...posts].slice(0, MAX_POSTS);
      writePosts(next);
      renderInstagram();
    });

    document.querySelectorAll('[data-instagram-delete]').forEach((button) => button.addEventListener('click', () => {
      const index = Number(button.dataset.instagramDelete);
      if (!window.confirm('이 최근 게시물을 목록에서 삭제할까요?')) return;
      writePosts(posts.filter((_, itemIndex) => itemIndex !== index));
      renderInstagram();
    }));

    document.getElementById('instagram-clear-all')?.addEventListener('click', () => {
      if (!window.confirm('등록된 최근 Instagram 게시물을 모두 지울까요?')) return;
      writePosts([]);
      renderInstagram();
    });
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
    if (route === 'instagram') setTimeout(renderInstagram, 35);
    else setActive(false);
  }

  function scheduleSync() {
    clearTimeout(timer);
    timer = setTimeout(sync, 35);
  }

  window.addEventListener('DOMContentLoaded', scheduleSync, { once: true });
  window.addEventListener('hashchange', scheduleSync);
  new MutationObserver(scheduleSync).observe(document.documentElement, { childList: true, subtree: true });
})();