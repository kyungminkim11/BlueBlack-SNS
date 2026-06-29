(() => {
  'use strict';
  let timer = null;

  function currentId() {
    const route = location.hash.replace(/^#\//, '');
    if (!route.startsWith('product/')) return '';
    try { return decodeURIComponent(route.slice(8)); }
    catch { return route.slice(8); }
  }

  function bindCopy() {
    const button = document.getElementById('copy-draft');
    if (!button || button.dataset.copyOverride === 'yes') return;
    button.dataset.copyOverride = 'yes';
    button.addEventListener('click', async (event) => {
      const text = window.BLUEBLACK_DRAFTS?.[currentId()];
      if (!text) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = '복사됨';
        button.classList.add('copied');
        setTimeout(() => {
          button.textContent = '복사';
          button.classList.remove('copied');
        }, 1500);
      } catch {
        button.textContent = '복사 실패';
      }
    }, true);
  }

  function scheduleBind() {
    clearTimeout(timer);
    timer = setTimeout(bindCopy, 40);
  }

  window.addEventListener('hashchange', scheduleBind);
  window.addEventListener('DOMContentLoaded', scheduleBind, { once: true });
  new MutationObserver(scheduleBind).observe(document.documentElement, { childList: true, subtree: true });
})();
