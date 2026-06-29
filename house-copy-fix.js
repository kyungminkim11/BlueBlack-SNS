(() => {
  'use strict';
  function apply() {
    const store = window.BLUEBLACK_COPY_VARIANTS || {};
    (window.BLUEBLACK_HOUSE_COPY_CONFIGS || []).forEach((item) => {
      if (!Array.isArray(item.variants) || item.variants.length !== 5) return;
      (item.ids || []).forEach((id) => { store[id] = item.variants; });
    });
    window.BLUEBLACK_COPY_VARIANTS = store;
  }
  apply();
  window.addEventListener('hashchange', () => setTimeout(apply, 30));
})();