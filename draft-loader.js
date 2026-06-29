(() => {
  'use strict';
  let timer = null;

  function productId() {
    const route = location.hash.replace(/^#\//, '');
    if (!route.startsWith('product/')) return '';
    try { return decodeURIComponent(route.slice(8)); }
    catch { return route.slice(8); }
  }

  function applyDraft() {
    const id = productId();
    const text = window.BLUEBLACK_DRAFTS?.[id];
    if (!text) return;
    const draftText = document.getElementById('draft-text');
    if (!draftText) return;

    if (draftText.dataset.overrideId !== id) {
      draftText.textContent = text;
      draftText.dataset.overrideId = id;
    }

    const state = document.querySelector('.draft-state');
    if (state) state.textContent = '1차안 작성 완료 · 최종 검수 전';

    const count = document.querySelector('.draft-count');
    if (count) count.textContent = `${text.length.toLocaleString('ko-KR')}자`;

    document.querySelectorAll('.metric-chip').forEach((chip) => {
      if (chip.querySelector('span')?.textContent?.trim() === 'DRAFT') {
        const strong = chip.querySelector('strong');
        if (strong) strong.textContent = '1차안 완료';
      }
    });
  }

  function scheduleApply() {
    clearTimeout(timer);
    timer = setTimeout(applyDraft, 30);
  }

  window.addEventListener('hashchange', scheduleApply);
  window.addEventListener('DOMContentLoaded', scheduleApply, { once: true });
  new MutationObserver(scheduleApply).observe(document.documentElement, { childList: true, subtree: true });
})();
