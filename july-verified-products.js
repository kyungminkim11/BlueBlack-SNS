(() => {
  'use strict';

  const configs = window.BLUEBLACK_JULY_PRODUCTS || [];
  const contentStore = window.BLUEBLACK_PRODUCT_CONTENT = window.BLUEBLACK_PRODUCT_CONTENT || {};
  const copyStore = window.BLUEBLACK_COPY_VARIANTS = window.BLUEBLACK_COPY_VARIANTS || {};
  let timer = null;
  let mountedKey = '';

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[ch]);

  const normalize = (value = '') => String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[·ㆍ・,()[\]{}\/\\._:;\-–—'"`~!@#$%^*+=?<>]/g, '')
    .replace(/\s+/g, '');

  const currentProductId = () => {
    const route = location.hash.replace(/^#\//, '');
    if (!route.startsWith('product/')) return '';
    try { return decodeURIComponent(route.slice(8)); }
    catch { return route.slice(8); }
  };

  function register(config, id) {
    if (!id) return;
    contentStore[id] = config.content;
    copyStore[id] = config.variants;
  }

  configs.forEach((config) => (config.ids || []).forEach((id) => register(config, id)));

  function findConfig(productId, title) {
    const idKey = normalize(productId);
    const titleKey = normalize(title);
    return configs.find((config) => {
      if ((config.ids || []).some((id) => normalize(id) === idKey)) return true;
      return (config.match || []).some((keyword) => {
        const key = normalize(keyword);
        return key && (titleKey.includes(key) || idKey.includes(key));
      });
    });
  }

  function sourceMarkup(sources = []) {
    return sources.map(([name, url, note, type]) => `
      <a class="july-source-link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">
        <span class="july-source-copy">
          <span class="july-source-name-row">
            <strong>${escapeHTML(name)}</strong>
            ${type ? `<em>${escapeHTML(type)}</em>` : ''}
          </span>
          <small>${escapeHTML(note)}</small>
        </span>
        <b aria-hidden="true">↗</b>
      </a>`).join('');
  }

  function researchGuideMarkup(guide) {
    if (!guide || !Array.isArray(guide.checks) || !guide.checks.length) return '';
    return `
      <div class="july-research-guide">
        <div class="july-research-guide-head">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>${escapeHTML(guide.title || '직접 확인할 것')}</strong>
            ${guide.summary ? `<p>${escapeHTML(guide.summary)}</p>` : ''}
          </div>
        </div>
        <ol>${guide.checks.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ol>
      </div>`;
  }

  function cardMarkup(config) {
    const checkedAt = config.checkedAt || '2026.07.01';
    const verificationBadge = config.verificationBadge || '공식·판매 자료 확인';
    const sourceTitle = config.sourceTitle || '검증 출처';
    return `
      <section id="july-verified-research" class="section-card july-verified-card" data-july-key="${escapeHTML(config.key)}">
        <div class="section-head july-verified-head">
          <div><p class="product-content-kicker">VERIFIED RESEARCH</p><h3>검증된 제품 정보</h3></div>
          <span class="july-verified-badge">${escapeHTML(verificationBadge)}</span>
        </div>
        <div class="section-body">
          <div class="july-research-summary">
            <strong>${escapeHTML(config.content.name)}</strong>
            <p>${escapeHTML(config.content.description)}</p>
          </div>
          <div class="july-fact-grid">
            ${(config.facts || []).map(([label, value]) => `<div class="july-fact-item"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></div>`).join('')}
          </div>
          ${researchGuideMarkup(config.researchGuide)}
          <div class="july-caution"><span aria-hidden="true">!</span><p><b>게시 전 주의</b>${escapeHTML(config.caution || config.content.notice)}</p></div>
          <div class="july-source-block">
            <div class="july-source-title"><strong>${escapeHTML(sourceTitle)}</strong><span>${(config.sources || []).length}개 링크</span></div>
            <div class="july-source-list">${sourceMarkup(config.sources)}</div>
          </div>
          <p class="july-checked-at">자료 확인일 ${escapeHTML(checkedAt)} · 판매 옵션과 재고는 게시 직전 다시 확인</p>
        </div>
      </section>`;
  }

  function mount() {
    const productId = currentProductId();
    const hero = document.querySelector('.detail-hero');
    if (!productId || !hero) {
      mountedKey = '';
      document.getElementById('july-verified-research')?.remove();
      return;
    }

    const title = hero.querySelector('h2')?.textContent?.trim() || '';
    const config = findConfig(productId, title);
    if (!config) {
      mountedKey = '';
      document.getElementById('july-verified-research')?.remove();
      return;
    }

    register(config, productId);

    const existing = document.getElementById('july-verified-research');
    if (existing?.dataset.julyKey === config.key && mountedKey === `${productId}:${config.key}`) return;
    existing?.remove();

    const primaryStack = document.querySelector('.detail-grid > .stack');
    if (!primaryStack) return;
    primaryStack.insertAdjacentHTML('afterbegin', cardMarkup(config));
    mountedKey = `${productId}:${config.key}`;
  }

  function scheduleMount() {
    clearTimeout(timer);
    timer = setTimeout(mount, 10);
  }

  window.addEventListener('hashchange', scheduleMount);
  window.addEventListener('DOMContentLoaded', scheduleMount, { once: true });
  new MutationObserver(scheduleMount).observe(document.documentElement, { childList: true, subtree: true });
})();
