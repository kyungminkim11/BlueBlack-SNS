(() => {
  'use strict';

  const STORAGE_KEY = 'blueblack-ops-open-sections-v1';
  const COLLAPSE_TITLES = new Set([
    '필수 검수',
    '사진·영상 준비',
    '담당자 배정',
    '해시태그·멘션',
    '게시 성과와 우수 사례',
    '콘텐츠 재활용',
    '댓글·확인 메모',
    '변경 기록'
  ]);

  let timer = null;

  function route() {
    return location.hash.replace(/^#\//, '') || 'schedule';
  }

  function productId() {
    const current = route();
    if (!current.startsWith('product/')) return '';
    try { return decodeURIComponent(current.slice(8)); }
    catch { return current.slice(8); }
  }

  function readOpenState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeOpenState(value) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch {}
  }

  function sectionKey(title) {
    return `${productId()}::${title}`;
  }

  function isOpen(title) {
    return Boolean(readOpenState()[sectionKey(title)]);
  }

  function setOpen(title, value) {
    const state = readOpenState();
    const key = sectionKey(title);
    if (value) state[key] = true;
    else delete state[key];
    writeOpenState(state);
  }

  function addQuickAccess(panel) {
    const metrics = document.querySelector('.detail-metrics');
    if (!metrics || document.querySelector('#ops-quick-access')) return;

    const bar = document.createElement('div');
    bar.id = 'ops-quick-access';
    bar.className = 'ops-quick-access';
    bar.innerHTML = `
      <div>
        <strong>게시 운영 관리</strong>
        <span>원고와 제품 정보는 먼저 보고, 검수·촬영·성과 기능은 아래에서 필요할 때 열 수 있습니다.</span>
      </div>
      <button type="button">관리 기능 보기 ↓</button>`;

    bar.querySelector('button').addEventListener('click', () => {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    metrics.insertAdjacentElement('afterend', bar);
  }

  function movePanelAfterDraft(panel) {
    const detailGrid = document.querySelector('.detail-grid');
    if (!detailGrid) return;
    if (panel.previousElementSibling !== detailGrid) detailGrid.insertAdjacentElement('afterend', panel);
    addQuickAccess(panel);
  }

  function wrapBody(card, head) {
    let body = card.querySelector(':scope > .ops-collapsible-body');
    if (!body) {
      body = document.createElement('div');
      body.className = 'ops-collapsible-body';
      card.appendChild(body);
    }

    [...card.childNodes]
      .filter((node) => node !== head && node !== body)
      .forEach((node) => body.appendChild(node));

    return body;
  }

  function applyCollapsedState(card, title, open) {
    const button = card.querySelector(':scope > .ops-card-head .ops-collapse-button');
    card.classList.toggle('is-collapsed', !open);
    card.classList.toggle('is-open', open);
    if (button) {
      button.setAttribute('aria-expanded', String(open));
      button.innerHTML = open ? '<span>접기</span><b>−</b>' : '<span>열기</span><b>＋</b>';
    }
  }

  function repairCollapsible(card) {
    const head = card.querySelector(':scope > .ops-card-head');
    if (!head) return;
    wrapBody(card, head);
  }

  function makeCollapsible(card) {
    const head = card.querySelector(':scope > .ops-card-head');
    const title = head?.querySelector('h3')?.textContent?.trim() || '';
    if (!head || !COLLAPSE_TITLES.has(title)) return;

    if (card.dataset.opsCompactReady === 'true') {
      repairCollapsible(card);
      return;
    }

    card.dataset.opsCompactReady = 'true';
    card.classList.add('ops-collapsible');
    wrapBody(card, head);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ops-collapse-button';
    button.setAttribute('aria-label', `${title} 펼치기 또는 접기`);
    head.appendChild(button);

    const toggle = () => {
      const next = card.classList.contains('is-collapsed');
      setOpen(title, next);
      applyCollapsedState(card, title, next);
    };

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      toggle();
    });
    head.addEventListener('click', (event) => {
      if (event.target.closest('button, a, input, select, textarea')) return;
      toggle();
    });
    head.tabIndex = 0;
    head.setAttribute('role', 'button');
    head.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggle();
    });

    applyCollapsedState(card, title, isOpen(title));
  }

  function addPanelControls(panel) {
    const saveArea = panel.querySelector('.ops-save-area');
    if (!saveArea || saveArea.querySelector('.ops-toggle-advanced')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ops-toggle-advanced';
    button.textContent = '숨은 기능 모두 열기';
    button.addEventListener('click', () => {
      const cards = [...panel.querySelectorAll('.ops-collapsible')];
      const shouldOpen = cards.some((card) => card.classList.contains('is-collapsed'));
      cards.forEach((card) => {
        const title = card.querySelector(':scope > .ops-card-head h3')?.textContent?.trim() || '';
        setOpen(title, shouldOpen);
        applyCollapsedState(card, title, shouldOpen);
      });
      button.textContent = shouldOpen ? '숨은 기능 모두 접기' : '숨은 기능 모두 열기';
    });
    saveArea.insertBefore(button, saveArea.querySelector('#ops-save-now') || null);
  }

  function enhance() {
    if (!route().startsWith('product/')) return;
    const panel = document.querySelector('#content-operations-panel');
    if (!panel) return;

    movePanelAfterDraft(panel);
    panel.querySelectorAll(':scope .ops-card').forEach(makeCollapsible);
    addPanelControls(panel);
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(enhance, 60);
  }

  window.addEventListener('DOMContentLoaded', schedule, { once: true });
  window.addEventListener('hashchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();