(() => {
  'use strict';

  const PILOT_ID = 'pilot-capless-matte-elegance';
  let timer = null;

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[character]);

  function currentRoute() {
    return location.hash.replace(/^#\//, '') || 'schedule';
  }

  function renderPendingDetailHeader(route) {
    if (route !== `product/${PILOT_ID}`) return;
    const date = document.querySelector('.detail-date');
    if (date) date.textContent = '업로드 미정 · 제품 소개';
  }

  function render() {
    const route = currentRoute();
    renderPendingDetailHeader(route);
    if (!['schedule', 'july', 'august'].includes(route)) return;

    const main = document.getElementById('main-content');
    const anchor = main?.querySelector('.schedule-viewbar');
    if (!main || !anchor) return;

    const items = window.BLUEBLACK_PENDING_PRODUCTS || [];
    const existing = document.getElementById('pending-schedule-section');
    if (!items.length) {
      existing?.remove();
      return;
    }
    if (existing?.dataset.count === String(items.length)) return;
    existing?.remove();

    const section = document.createElement('section');
    section.id = 'pending-schedule-section';
    section.className = 'pending-schedule-section';
    section.dataset.count = String(items.length);
    section.innerHTML = `
      <div class="pending-schedule-head">
        <div><p class="pending-schedule-kicker">DATE TO BE CONFIRMED</p><h3>업로드 미정</h3></div>
        <span>${items.length}개 준비 중</span>
      </div>
      <div class="pending-schedule-list">
        ${items.map((item) => `
          <button class="pending-schedule-item" type="button" data-pending-product="${escapeHTML(item.productId)}">
            <span class="pending-schedule-date">미정</span>
            <span class="pending-schedule-content">
              <span class="pending-schedule-title">${escapeHTML(item.title)}</span>
              <span class="pending-schedule-meta"><span>${escapeHTML(item.type || '제품 소개')}</span><span class="pending-schedule-status">${escapeHTML(item.status || '준비 중')}</span><span>${escapeHTML(item.note || '')}</span></span>
            </span>
            <span class="pending-schedule-arrow" aria-hidden="true">→</span>
          </button>`).join('')}
      </div>`;

    anchor.insertAdjacentElement('afterend', section);
    section.querySelectorAll('[data-pending-product]').forEach((button) => {
      button.addEventListener('click', () => {
        location.hash = `#/product/${encodeURIComponent(button.dataset.pendingProduct)}`;
      });
    });
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(render, 80);
  }

  window.addEventListener('DOMContentLoaded', schedule, { once: true });
  window.addEventListener('hashchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  schedule();
})();