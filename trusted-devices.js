(() => {
  'use strict';

  const API_URL = 'https://jnciddblcndmthmmvqrz.supabase.co/functions/v1/blueblack-devices';
  const ACCOUNT = 'kevin';
  const META_KEY = 'blueblack-trusted-device-v1';
  const DB_NAME = 'blueblack-device-vault';
  const STORE_NAME = 'keys';
  const WRAP_KEY_ID = 'device-wrap-key';
  const CHECKBOX_ID = 'remember-this-device';
  const DEVICE_NAME_ID = 'remember-device-name';

  const nativeDeriveKey = SubtleCrypto.prototype.deriveKey;
  let autoKeyRaw = null;
  let autoAttempted = false;
  let autoSubmitting = false;
  let sessionUser = '';
  let sessionKeyRaw = null;
  let pendingRemember = false;
  let pendingDeviceName = '';
  let registrationRunning = false;
  let boundForm = null;
  let timer = null;

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

  const randomToken = () => bytesToBase64(crypto.getRandomValues(new Uint8Array(48)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

  function readMeta() {
    try {
      const parsed = JSON.parse(localStorage.getItem(META_KEY) || 'null');
      return parsed && parsed.deviceId && parsed.deviceToken && parsed.wrappedKey && parsed.wrapIv ? parsed : null;
    } catch {
      return null;
    }
  }

  function writeMeta(meta) {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  }

  function clearMeta() {
    localStorage.removeItem(META_KEY);
  }

  function openVault() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function readVaultKey() {
    const db = await openVault();
    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(WRAP_KEY_ID);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async function writeVaultKey(key) {
    const db = await openVault();
    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(key, WRAP_KEY_ID);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async function getWrapKey() {
    let key = await readVaultKey();
    if (key) return key;
    key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    await writeVaultKey(key);
    return key;
  }

  async function wrapPayloadKey(rawKey) {
    const wrapKey = await getWrapKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const wrapped = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, wrapKey, rawKey);
    return { wrappedKey: bytesToBase64(wrapped), wrapIv: bytesToBase64(iv) };
  }

  async function unwrapPayloadKey(meta) {
    const wrapKey = await readVaultKey();
    if (!wrapKey) throw new Error('wrap_key_missing');
    return new Uint8Array(await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToBytes(meta.wrapIv) },
      wrapKey,
      base64ToBytes(meta.wrappedKey)
    ));
  }

  async function api(action, extra = {}, useDevice = true) {
    const meta = readMeta();
    const payload = { action, ...extra };
    if (useDevice && meta) {
      payload.deviceId = meta.deviceId;
      payload.deviceToken = meta.deviceToken;
    }
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });
    let data = {};
    try { data = await response.json(); } catch {}
    return { ok: response.ok && data.ok, status: response.status, data };
  }

  function defaultDeviceName() {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'Android 휴대폰';
    if (/iPhone|iPad/i.test(ua)) return /iPad/i.test(ua) ? 'iPad' : 'iPhone';
    if (/Windows/i.test(ua)) return 'Windows 노트북';
    if (/Macintosh|Mac OS/i.test(ua)) return 'Mac';
    return '내 기기';
  }

  function platformName() {
    return navigator.userAgentData?.platform || navigator.platform || '';
  }

  function toast(message, tone = 'success') {
    document.querySelector('.trusted-device-toast')?.remove();
    const element = document.createElement('div');
    element.className = `trusted-device-toast ${tone}`;
    element.textContent = message;
    document.body.appendChild(element);
    setTimeout(() => element.remove(), 3800);
  }

  SubtleCrypto.prototype.deriveKey = async function trustedDeviceDeriveKey(
    algorithm,
    baseKey,
    derivedKeyType,
    extractable,
    keyUsages
  ) {
    if (autoKeyRaw) {
      const raw = autoKeyRaw;
      autoKeyRaw = null;
      sessionUser = ACCOUNT;
      sessionKeyRaw = raw;
      return crypto.subtle.importKey('raw', raw, derivedKeyType, false, keyUsages);
    }

    const username = document.getElementById('username')?.value.trim().toLowerCase() || '';
    const capture = username === ACCOUNT;
    const key = await nativeDeriveKey.call(
      this,
      algorithm,
      baseKey,
      derivedKeyType,
      capture ? true : extractable,
      keyUsages
    );

    if (capture) {
      try {
        sessionUser = username;
        sessionKeyRaw = new Uint8Array(await crypto.subtle.exportKey('raw', key));
      } catch {
        sessionKeyRaw = null;
      }
    }
    return key;
  };

  function rememberMarkup() {
    const wrapper = document.createElement('div');
    wrapper.className = 'trusted-device-login-option';
    wrapper.innerHTML = `
      <label class="trusted-device-check-row">
        <input id="${CHECKBOX_ID}" type="checkbox">
        <span class="trusted-device-box" aria-hidden="true"></span>
        <span><strong>이 기기 저장</strong><small>kevin 계정 전용 · 다음 접속부터 로그인 없이 열기</small></span>
      </label>
      <label class="trusted-device-name-row" hidden>
        <span>기기 이름</span>
        <input id="${DEVICE_NAME_ID}" type="text" maxlength="80" value="${defaultDeviceName()}">
      </label>`;
    return wrapper;
  }

  function updateRememberAvailability(form) {
    const username = form.querySelector('#username')?.value.trim().toLowerCase() || '';
    const checkbox = form.querySelector(`#${CHECKBOX_ID}`);
    const wrapper = checkbox?.closest('.trusted-device-login-option');
    const nameRow = wrapper?.querySelector('.trusted-device-name-row');
    const isKevin = username === ACCOUNT;
    if (checkbox) checkbox.disabled = !isKevin;
    wrapper?.classList.toggle('disabled', !isKevin);
    if (!isKevin && checkbox) checkbox.checked = false;
    if (nameRow) nameRow.hidden = !isKevin || !checkbox?.checked;
  }

  async function tryAutoLogin(form) {
    if (autoAttempted) return;
    autoAttempted = true;
    const meta = readMeta();
    if (!meta) return;

    const message = form.querySelector('#login-message');
    if (message) message.textContent = '저장된 기기를 확인하고 있습니다.';

    try {
      const checked = await api('check');
      if (!checked.ok) {
        if (checked.status === 401) clearMeta();
        if (message) message.textContent = checked.status === 401
          ? '이 기기의 자동 로그인이 해제되었습니다. 다시 로그인해 주세요.'
          : '기기 확인에 실패했습니다. 직접 로그인해 주세요.';
        return;
      }

      autoKeyRaw = await unwrapPayloadKey(meta);
      autoSubmitting = true;
      form.querySelector('#username').value = ACCOUNT;
      form.querySelector('#password').value = 'trusted-device';
      const label = form.querySelector('.button-label');
      if (label) label.textContent = '자동 로그인 중';
      setTimeout(() => form.requestSubmit(), 80);
    } catch {
      if (message) message.textContent = '저장된 기기 정보를 열지 못했습니다. 다시 로그인해 주세요.';
    }
  }

  function bindLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    if (!form.querySelector(`#${CHECKBOX_ID}`)) {
      const passwordGroup = form.querySelectorAll('.field-group')[1];
      passwordGroup?.insertAdjacentElement('afterend', rememberMarkup());
    }

    updateRememberAvailability(form);
    if (boundForm !== form) {
      boundForm = form;
      form.querySelector('#username')?.addEventListener('input', () => updateRememberAvailability(form));
      form.querySelector(`#${CHECKBOX_ID}`)?.addEventListener('change', () => updateRememberAvailability(form));
      form.addEventListener('submit', () => {
        const username = form.querySelector('#username')?.value.trim().toLowerCase() || '';
        if (autoSubmitting) {
          pendingRemember = false;
          autoSubmitting = false;
          return;
        }
        sessionUser = username;
        sessionKeyRaw = null;
        pendingRemember = username === ACCOUNT && Boolean(form.querySelector(`#${CHECKBOX_ID}`)?.checked);
        pendingDeviceName = form.querySelector(`#${DEVICE_NAME_ID}`)?.value.trim() || defaultDeviceName();
      }, true);
    }

    tryAutoLogin(form);
  }

  async function registerCurrentDevice(deviceName = pendingDeviceName || defaultDeviceName()) {
    if (registrationRunning || sessionUser !== ACCOUNT || !sessionKeyRaw) return false;
    registrationRunning = true;
    try {
      const oldMeta = readMeta();
      const deviceId = oldMeta?.deviceId || crypto.randomUUID();
      const deviceToken = oldMeta?.deviceToken || randomToken();
      const result = await api('register', {
        deviceId,
        deviceToken,
        deviceName,
        userAgent: navigator.userAgent,
        platform: platformName(),
        proofKey: bytesToBase64(sessionKeyRaw)
      }, false);
      if (!result.ok) throw new Error(result.data?.error || 'register_failed');
      const wrapped = await wrapPayloadKey(sessionKeyRaw);
      writeMeta({
        deviceId: result.data.deviceId,
        deviceToken: result.data.deviceToken,
        deviceName,
        ...wrapped,
        savedAt: new Date().toISOString()
      });
      pendingRemember = false;
      toast('이 기기를 저장했습니다. 다음 접속부터 자동 로그인됩니다.');
      return true;
    } catch (error) {
      toast(error.message === 'device_limit'
        ? '저장 가능한 기기 수를 초과했습니다. 관리자에서 기존 기기를 삭제해 주세요.'
        : '기기 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'error');
      return false;
    } finally {
      registrationRunning = false;
    }
  }

  function formatTime(value) {
    if (!value) return '기록 없음';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '기록 없음';
    return date.toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  }

  function deviceRows(devices, currentDeviceId) {
    if (!devices.length) return '<div class="trusted-device-empty">등록된 기기가 없습니다.</div>';
    return devices.map((device) => {
      const current = device.id === currentDeviceId;
      const revoked = Boolean(device.revoked_at);
      return `
        <article class="trusted-device-row ${revoked ? 'revoked' : ''}" data-device-id="${device.id}">
          <div class="trusted-device-icon">${/Android|iPhone|Mobile/i.test(device.user_agent || '') ? 'M' : 'PC'}</div>
          <div class="trusted-device-info">
            <div><strong>${device.device_name || '이름 없는 기기'}</strong>${current ? '<span class="trusted-current-badge">현재 기기</span>' : ''}${revoked ? '<span class="trusted-revoked-badge">사용 중지</span>' : ''}</div>
            <p>${device.platform || '플랫폼 정보 없음'} · 마지막 사용 ${formatTime(device.last_seen_at)}</p>
            <small>등록 ${formatTime(device.created_at)}</small>
          </div>
          <div class="trusted-device-actions">
            <button type="button" data-device-rename>이름 변경</button>
            ${revoked
              ? '<button type="button" class="restore" data-device-restore>다시 추가</button>'
              : '<button type="button" class="danger" data-device-revoke>삭제</button>'}
          </div>
        </article>`;
    }).join('');
  }

  async function renderDeviceManager(force = false) {
    const page = document.querySelector('.admin-page');
    if (!page) return;
    let section = page.querySelector('#trusted-device-manager');
    if (section && !force) return;
    if (!section) {
      section = document.createElement('section');
      section.id = 'trusted-device-manager';
      section.className = 'trusted-device-manager';
      page.querySelector('.admin-hero')?.insertAdjacentElement('afterend', section);
    }

    const meta = readMeta();
    section.innerHTML = `
      <div class="trusted-device-manager-head">
        <div><p>KEVIN TRUSTED DEVICES</p><h2>로그인 기기 관리</h2><span>저장된 기기는 접속할 때마다 서버에서 사용 가능 여부를 확인합니다.</span></div>
        <div class="trusted-device-manager-tools">
          ${!meta && sessionUser === ACCOUNT && sessionKeyRaw ? '<button id="save-current-device" type="button">현재 기기 추가</button>' : ''}
          <button id="refresh-trusted-devices" type="button">새로고침</button>
        </div>
      </div>
      <div class="trusted-device-add-guide">
        <strong>새 기기 추가 방법</strong>
        <span>새 휴대폰이나 노트북에서 kevin으로 한 번 로그인한 뒤 <b>이 기기 저장</b>을 선택하세요. 등록되면 이 목록에 자동으로 나타납니다.</span>
        <button id="copy-device-login-link" type="button">접속 주소 복사</button>
      </div>
      <div id="trusted-device-list" class="trusted-device-list">
        <div class="trusted-device-loading">기기 목록을 불러오는 중입니다.</div>
      </div>`;

    section.querySelector('#save-current-device')?.addEventListener('click', async () => {
      const name = window.prompt('이 기기의 이름을 입력해 주세요.', defaultDeviceName());
      if (!name) return;
      if (await registerCurrentDevice(name.trim())) renderDeviceManager(true);
    });
    section.querySelector('#refresh-trusted-devices')?.addEventListener('click', () => renderDeviceManager(true));
    section.querySelector('#copy-device-login-link')?.addEventListener('click', async (event) => {
      try {
        await navigator.clipboard.writeText(`${location.origin}${location.pathname}`);
        event.currentTarget.textContent = '복사됨';
        setTimeout(() => { event.currentTarget.textContent = '접속 주소 복사'; }, 1200);
      } catch {
        event.currentTarget.textContent = '복사 실패';
      }
    });

    const list = section.querySelector('#trusted-device-list');
    if (!meta) {
      list.innerHTML = `<div class="trusted-device-empty"><strong>현재 브라우저는 저장된 기기가 아닙니다.</strong><span>kevin으로 로그인할 때 이 기기 저장을 선택하거나 위의 현재 기기 추가 버튼을 사용해 주세요.</span></div>`;
      return;
    }

    const result = await api('list');
    if (!result.ok) {
      if (result.status === 401) clearMeta();
      list.innerHTML = '<div class="trusted-device-empty error">기기 목록을 불러오지 못했습니다.</div>';
      return;
    }

    list.innerHTML = deviceRows(result.data.devices || [], result.data.currentDeviceId);
    list.querySelectorAll('[data-device-rename]').forEach((button) => button.addEventListener('click', async () => {
      const row = button.closest('[data-device-id]');
      const currentName = row.querySelector('.trusted-device-info strong')?.textContent || '';
      const nextName = window.prompt('새 기기 이름을 입력해 주세요.', currentName);
      if (!nextName?.trim()) return;
      const response = await api('rename', { targetDeviceId: row.dataset.deviceId, deviceName: nextName.trim() });
      if (response.ok) renderDeviceManager(true);
      else toast('기기 이름을 변경하지 못했습니다.', 'error');
    }));
    list.querySelectorAll('[data-device-revoke]').forEach((button) => button.addEventListener('click', async () => {
      const row = button.closest('[data-device-id]');
      const name = row.querySelector('.trusted-device-info strong')?.textContent || '이 기기';
      if (!window.confirm(`${name}의 자동 로그인을 삭제할까요?`)) return;
      const response = await api('revoke', { targetDeviceId: row.dataset.deviceId });
      if (!response.ok) return toast('기기를 삭제하지 못했습니다.', 'error');
      if (response.data.revokedCurrentDevice) {
        clearMeta();
        toast('현재 기기의 자동 로그인이 해제되었습니다.');
      }
      renderDeviceManager(true);
    }));
    list.querySelectorAll('[data-device-restore]').forEach((button) => button.addEventListener('click', async () => {
      const row = button.closest('[data-device-id]');
      const response = await api('restore', { targetDeviceId: row.dataset.deviceId });
      if (response.ok) renderDeviceManager(true);
      else toast('기기를 다시 추가하지 못했습니다.', 'error');
    }));
  }

  async function verifyCurrentDevice() {
    if (!document.querySelector('.workspace') || !readMeta()) return;
    try {
      const result = await api('check');
      if (result.status === 401) {
        clearMeta();
        window.alert('관리자에서 이 기기의 사용이 중지되었습니다. 다시 로그인해 주세요.');
        location.reload();
      }
    } catch {}
  }

  function sync() {
    bindLoginForm();
    const workspace = document.querySelector('.workspace');
    if (workspace && pendingRemember) registerCurrentDevice();
    if (location.hash.replace(/^#\//, '') === 'admin') setTimeout(() => renderDeviceManager(false), 80);
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(sync, 30);
  }

  window.BLUEBLACK_TRUSTED_DEVICES = {
    registerCurrentDevice,
    clearCurrentDevice: clearMeta,
    refreshManager: () => renderDeviceManager(true)
  };

  window.addEventListener('DOMContentLoaded', schedule, { once: true });
  window.addEventListener('hashchange', schedule);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') verifyCurrentDevice();
  });
  setInterval(verifyCurrentDevice, 5 * 60 * 1000);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();