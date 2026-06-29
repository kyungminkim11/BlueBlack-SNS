(() => {
  'use strict';
  const NativeObserver = window.MutationObserver;
  let restored = false;

  window.MutationObserver = class AdminGuardedObserver extends NativeObserver {
    constructor(callback) {
      super((records, observer) => {
        const route = location.hash.replace(/^#\//, '');
        if (route === 'admin' && document.querySelector('.admin-page')) return;
        callback(records, observer);
      });
      if (!restored) {
        restored = true;
        queueMicrotask(() => { window.MutationObserver = NativeObserver; });
      }
    }
  };
})();