(() => {
  'use strict';

  const SESSION_KEY = 'blueblack-workspace-tab-session-v1';
  const ROUTE_KEY = 'blueblack-workspace-refresh-route-v1';
  const TRUSTED_META_KEY = 'blueblack-trusted-device-v1';
  const MAX_AGE = 12 * 60 * 60 * 1000;
  const nativeDeriveKey = SubtleCrypto.prototype.deriveKey;
  const nativeStorageGetItem = Storage.prototype.getItem;

  let pendingRawKey = null;
  let resumeRawKey = null;
  let resumeAvailable = false;
  let workspaceSeen = false;
  let storageGuardActive = false;
  let refreshTimer = null;
  const initialRoute = location.hash || sessionStorage.getItem(ROUTE_KEY) || '';

  const bytesToBase64 = (value) => {
    const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
    let binary = '';
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  };

  const base64ToBytes = (value) => {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  };

  function readSession() {
    try {
      const value = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (!value?.rawKey || !value?.savedAt || Date.now() - value.savedAt > MAX_AGE) {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
      return value;
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  function saveSession(rawKey) {
    if (!rawKey) return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        rawKey: bytesToBase64(rawKey),
        savedAt: Date.now()
      }));
    } catch {}
  }

  function clearSession() {
    pendingRawKey = null;
    resumeRawKey = null;
    resumeAvailable = false;
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(ROUTE_KEY);
    } catch {}
  }

  const storedSession = readSession();
  if (storedSession) {
    try {
      resumeRawKey = base64ToBytes(storedSession.rawKey);
      resumeAvailable = true;
    } catch {
      clearSession();
    }
  }

  // A tab-session resume takes priority over the longer-term trusted-device check.
  // Hide only the trusted-device metadata read during the initial resume attempt.
  if (resumeAvailable) {
    storageGuardActive = true;
    Storage.prototype.getItem = function guardedGetItem(key) {
      if (storageGuardActive && this === localStorage && key === TRUSTED_META_KEY) return null;
      return nativeStorageGetItem.call(this, key);
    };
  }

  function releaseStorageGuard() {
    if (!storageGuardActive) return;
    storageGuardActive = false;
    Storage.prototype.getItem = nativeStorageGetItem;
  }

  SubtleCrypto.prototype.deriveKey = async function sessionDeriveKey(
    algorithm,
    baseKey,
    derivedKeyType,
    extractable,
    keyUsages
  ) {
    if (resumeAvailable && resumeRawKey) {
      const raw = resumeRawKey;
      resumeAvailable = false;
      pendingRawKey = raw;
      return crypto.subtle.importKey('raw', raw, derivedKeyType, true, keyUsages);
    }

    const key = await nativeDeriveKey.call(
      this,
      algorithm,
      baseKey,
      derivedKeyType,
      true,
      keyUsages
    );

    try {
      pendingRawKey = new Uint8Array(await crypto.subtle.exportKey('raw', key));
    } catch {
      pendingRawKey = null;
    }
    return key;
  };

  function hardRefresh() {
    try {
      sessionStorage.setItem(ROUTE_KEY, location.hash || initialRoute || '#/schedule');
    } catch {}
    const url = new URL(location.href);
    url.searchParams.set('refresh', String(Date.now()));
    location.replace(url.toString());
  }

  function addRefreshButtons() {
    const topbar = document.querySelector('.topbar-actions');
    if (topbar && !topbar.querySelector('#workspace-refresh-button')) {
      const button = document.createElement('button');
      button.id = 'workspace-refresh-button';
      button.className = 'ghost-button workspace-refresh-button';
      button.type = 'button';
      button.innerHTML = '<span aria-hidden="true">↻</span><span>새로고침</span>';
      button.addEventListener('click', () => {
        button.disabled = true;
        button.lastElementChild.textContent = '새로고침 중';
        hardRefresh();
      });
      const home = topbar.querySelector('#home-button');
      topbar.insertBefore(button, home || topbar.firstChild);
    }

    const loginCard = document.querySelector('.login-card');
    if (loginCard && !loginCard.querySelector('#login-refresh-button')) {
      const button = document.createElement('button');
      button.id = 'login-refresh-button';
      button.className = 'login-refresh-button';
      button.type = 'button';
      button.innerHTML = '<span aria-hidden="true">↻</span> 페이지 새로고침';
      button.addEventListener('click', hardRefresh);
      loginCard.appendChild(button);
    }
  }

  function fixRememberCheckbox() {
    const form = document.getElementById('login-form');
    const checkbox = document.getElementById('remember-this-device');
    const option = checkbox?.closest('.trusted-device-login-option');
    const label = checkbox?.closest('.trusted-device-check-row');
    if (!form || !checkbox || !option || !label) return;

    checkbox.disabled = false;
    option.classList.remove('disabled');

    if (!label.dataset.rememberClickFix) {
      label.dataset.rememberClickFix = 'yes';
      label.addEventListener('pointerdown', () => {
        const username = form.querySelector('#username');
        if (username && !username.value.trim()) {
          username.value = 'kevin';
          username.dispatchEvent(new Event('input', { bubbles: true }));
        }
        checkbox.disabled = false;
        option.classList.remove('disabled');
      }, true);
      label.addEventListener('click', () => {
        setTimeout(() => {
          checkbox.disabled = false;
          option.classList.remove('disabled');
          const nameRow = option.querySelector('.trusted-device-name-row');
          if (nameRow) nameRow.hidden = !checkbox.checked;
        }, 0);
      });
    }
  }

  function restoreRoute() {
    const route = initialRoute || sessionStorage.getItem(ROUTE_KEY) || '';
    if (route && route.startsWith('#/') && location.hash !== route) location.hash = route;
    try { sessionStorage.removeItem(ROUTE_KEY); } catch {}
  }

  function sync() {
    addRefreshButtons();
    fixRememberCheckbox();

    const workspace = document.querySelector('.workspace');
    const loginForm = document.getElementById('login-form');

    if (workspace) {
      if (!workspaceSeen) {
        workspaceSeen = true;
        if (pendingRawKey) saveSession(pendingRawKey);
        releaseStorageGuard();
        restoreRoute();
      }
      return;
    }

    if (workspaceSeen && loginForm) {
      // Explicit or idle logout must not immediately log back in.
      clearSession();
      releaseStorageGuard();
      workspaceSeen = false;
    }
  }

  function scheduleSync() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(sync, 35);
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('#logout-button')) clearSession();
  }, true);

  window.addEventListener('DOMContentLoaded', () => {
    addRefreshButtons();
    fixRememberCheckbox();

    if (!storedSession) {
      releaseStorageGuard();
      return;
    }

    const form = document.getElementById('login-form');
    if (!form) return;
    const username = form.querySelector('#username');
    const password = form.querySelector('#password');
    const message = form.querySelector('#login-message');
    if (username) username.value = 'kevin';
    if (password) password.value = 'session-refresh';
    if (message) message.textContent = '이 탭의 로그인 상태를 복원하고 있습니다.';

    setTimeout(() => {
      if (!document.body.contains(form) || document.querySelector('.workspace')) return;
      form.requestSubmit();
    }, 0);

    setTimeout(() => {
      if (!document.querySelector('.workspace')) {
        clearSession();
        releaseStorageGuard();
      }
    }, 5000);
  }, { once: true });

  window.addEventListener('hashchange', scheduleSync);
  new MutationObserver(scheduleSync).observe(document.documentElement, { childList: true, subtree: true });
})();