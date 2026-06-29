(() => {
  'use strict';

  const STORAGE_KEY = 'blueblack-admin-blog-plan-v1';
  const BLOG_URL = 'https://blog.naver.com/paikorea';
  const MONTHLY_TARGET = 2;
  const INTERVAL_DAYS = 14;
  let timer = null;
  let selectedYear = 2026;
  let selectedMonth = 7;

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[ch]);

  function defaultSlot(year, month, cycle) {
    return {
      id: `${year}-${String(month).padStart(2, '0')}-${cycle}`,
      cycle,
      targetWindow: cycle === 1 ? '1차 · 월 초~둘째 주' : '2차 · 1차 게시 후 14일',
      date: '',
      title: '',
      category: '제품 심층 소개',
      status: '아이디어',
      memo: '',
      updatedAt: ''
    };
  }

  function createDefaultData() {
    const months = {};
    for (let year = 2026; year <= 2027; year += 1) {
      for (let month = 1; month <= 12; month += 1) {
        const key = `${year}-${String(month).padStart(2, '0')}`;
        months[key] = [defaultSlot(year, month, 1), defaultSlot(year, month, 2)];
      }
    }
    return {
      policy: {
        monthlyTarget: MONTHLY_TARGET,
        intervalDays: INTERVAL_DAYS,
        annualTarget: MONTHLY_TARGET * 12,
        blogUrl: BLOG_URL,
        note: '매월 블로그 글 2개 작성 · 2주마다 1개 업로드'
      },
      months,
      updatedAt: ''
    };
  }

  function readData() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!parsed || typeof parsed !== 'object') return createDefaultData();
      const base = createDefaultData();
      return {
        ...base,
        ...parsed,
        policy: { ...base.policy, ...(parsed.policy || {}) },
        months: { ...base.months, ...(parsed.months || {}) }
      };
    } catch {
      return createDefaultData();
    }
  }

  function writeData(data) {
    data.updatedAt = new Date().toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function monthKey(year = selectedYear, month = selectedMonth) {
    return `${year}-${String(month).padStart(2, '0')}`;
  }

  function ensureMonth(data, year = selectedYear, month = selectedMonth) {
    const key = monthKey(year, month);
    if (!Array.isArray(data.months[key]) || data.months[key].length !== 2) {
      data.months[key] = [defaultSlot(year, month, 1), defaultSlot(year, month, 2)];
    }
    return data.months[key];
  }

  function addDays(dateText, days) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText || '')) return '';
    const date = new Date(`${dateText}T12:00:00`);
    date.setDate(date.getDate() + days);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function dayGap(first, second) {
    if (!first || !second) return null;
    const a = new Date(`${first}T12:00:00`);
    const b = new Date(`${second}T12:00:00`);
    return Math.round((b - a) / 86400000);
  }

  function annualStats(data, year) {
    let completed = 0;
    let planned = 0;
    for (let month = 1; month <= 12; month += 1) {
      const slots = ensureMonth(data, year, month);
      slots.forEach((slot) => {
        if (slot.date || slot.title || slot.status !== '아이디어') planned += 1;
        if (slot.status === '업로드 완료') completed += 1;
      });
    }
    return { completed, planned, target: MONTHLY_TARGET * 12 };
  }

  function statusOptions(selected) {
    return ['아이디어', '자료 조사', '초안 작성', '사진 준비', '검수 중', '업로드 예정', '업로드 완료']
      .map((value) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${value}</option>`).join('');
  }

  function categoryOptions(selected) {
    return ['제품 심층 소개', '브랜드·입점 소식', '만년필 사용법', '잉크·종이 비교', '관리·보관 가이드', '매장 이야기', '이벤트·공지', '기타']
      .map((value) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${value}</option>`).join('');
  }

  function slotMarkup(slot, index, gap) {
    const gapState = index === 1 && gap !== null
      ? gap === INTERVAL_DAYS
        ? '<span class="admin-gap good">14일 간격</span>'
        : `<span class="admin-gap warn">현재 ${gap}일 간격</span>`
      : '';
    return `
      <article class="admin-blog-slot" data-slot-index="${index}">
        <div class="admin-slot-head">
          <div><span>BLOG ${index + 1}</span><h3>${escapeHTML(slot.targetWindow)}</h3></div>
          ${gapState}
        </div>
        <div class="admin-form-grid">
          <label><span>업로드 예정일</span><input data-field="date" type="date" value="${escapeHTML(slot.date)}"></label>
          <label><span>진행 상태</span><select data-field="status">${statusOptions(slot.status)}</select></label>
          <label class="wide"><span>글 제목·주제</span><input data-field="title" type="text" value="${escapeHTML(slot.title)}" placeholder="예: 만년필 입문자를 위한 닙 선택 가이드"></label>
          <label><span>콘텐츠 유형</span><select data-field="category">${categoryOptions(slot.category)}</select></label>
          <label class="wide"><span>자료·촬영·수정 메모</span><textarea data-field="memo" rows="4" placeholder="공식 자료 링크, 필요한 사진, 검수 사항 등을 적어주세요.">${escapeHTML(slot.memo)}</textarea></label>
        </div>
        <div class="admin-slot-foot">
          <span>${slot.updatedAt ? `마지막 수정 ${escapeHTML(slot.updatedAt)}` : '아직 저장된 작업이 없습니다.'}</span>
          <button class="admin-clear-slot" type="button">내용 비우기</button>
        </div>
      </article>`;
  }

  function adminMarkup(data) {
    const slots = ensureMonth(data);
    const stats = annualStats(data, selectedYear);
    const completedMonth = slots.filter((slot) => slot.status === '업로드 완료').length;
    const gap = dayGap(slots[0].date, slots[1].date);
    const progress = Math.round((stats.completed / stats.target) * 100);

    return `
      <section class="admin-page">
        <div class="admin-hero">
          <div>
            <p class="admin-eyebrow">BLUEBLACK CONTENT ADMIN</p>
            <h1>콘텐츠 관리자</h1>
            <p>SNS 일정과 블로그 운영 기준을 한곳에서 관리합니다.</p>
          </div>
          <div class="admin-hero-actions">
            <a href="${BLOG_URL}" target="_blank" rel="noopener noreferrer">회사 블로그 열기 ↗</a>
            <button id="admin-open-guide" type="button">SNS 작성 기준</button>
          </div>
        </div>

        <div class="admin-policy-grid">
          <article class="admin-policy-card accent"><span>월간 블로그 목표</span><strong>2개</strong><p>매달 블로그 게시글 두 편을 작성합니다.</p></article>
          <article class="admin-policy-card"><span>기본 업로드 간격</span><strong>14일</strong><p>2주마다 한 편씩 업로드하는 것을 기준으로 합니다.</p></article>
          <article class="admin-policy-card"><span>${selectedYear}년 목표</span><strong>${stats.completed} / ${stats.target}</strong><p>계획 등록 ${stats.planned}건 · 달성률 ${progress}%</p></article>
          <article class="admin-policy-card"><span>${selectedMonth}월 진행</span><strong>${completedMonth} / 2</strong><p>${completedMonth === 2 ? '이번 달 목표를 완료했습니다.' : `${2 - completedMonth}개의 글이 남았습니다.`}</p></article>
        </div>

        <section class="admin-rule-banner">
          <div><b>블로그 운영 필수 규칙</b><span>매월 2개 작성 · 2주마다 1개 업로드 · 연간 총 24개 목표</span></div>
          <a href="${BLOG_URL}" target="_blank" rel="noopener noreferrer">blog.naver.com/paikorea</a>
        </section>

        <div class="admin-period-bar">
          <label><span>관리 연도</span><select id="admin-year-select"><option value="2026" ${selectedYear === 2026 ? 'selected' : ''}>2026년</option><option value="2027" ${selectedYear === 2027 ? 'selected' : ''}>2027년</option></select></label>
          <div class="admin-month-tabs">
            ${Array.from({ length: 12 }, (_, i) => i + 1).map((month) => `<button type="button" data-admin-month="${month}" class="${month === selectedMonth ? 'active' : ''}">${month}월</button>`).join('')}
          </div>
        </div>

        <section class="admin-blog-section">
          <div class="admin-section-head">
            <div><p>BLOG CONTENT PLAN</p><h2>${selectedYear}년 ${selectedMonth}월 블로그 2회 계획</h2></div>
            <span>1차 날짜 입력 시 2차 날짜를 14일 후로 자동 제안합니다.</span>
          </div>
          <div class="admin-blog-slots">${slots.map((slot, index) => slotMarkup(slot, index, gap)).join('')}</div>
        </section>

        <section class="admin-tools">
          <div><strong>관리 데이터</strong><p>입력 내용은 현재 브라우저에 자동 저장됩니다. 다른 기기에서도 사용하려면 JSON 백업을 내려받아 복원하세요.</p><small>마지막 전체 저장: ${escapeHTML(data.updatedAt || '저장 기록 없음')}</small></div>
          <div class="admin-tool-actions">
            <button id="admin-export" type="button">JSON 백업</button>
            <label class="admin-import-label">JSON 복원<input id="admin-import" type="file" accept="application/json"></label>
            <button id="admin-reset-month" class="danger" type="button">이번 달 초기화</button>
          </div>
        </section>
      </section>`;
  }

  function collectAndSave() {
    const data = readData();
    const slots = ensureMonth(data);
    document.querySelectorAll('.admin-blog-slot').forEach((card) => {
      const index = Number(card.dataset.slotIndex);
      const slot = slots[index];
      card.querySelectorAll('[data-field]').forEach((field) => {
        slot[field.dataset.field] = field.value.trim ? field.value.trim() : field.value;
      });
      slot.updatedAt = new Date().toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    });
    writeData(data);
    return data;
  }

  function renderAdmin() {
    const main = document.getElementById('main-content');
    if (!main || location.hash.replace(/^#\//, '') !== 'admin') return;
    const data = readData();
    main.innerHTML = adminMarkup(data);
    setAdminActive(true);
    bindAdmin(data);
  }

  function bindAdmin(data) {
    const main = document.getElementById('main-content');
    const firstDate = main.querySelector('.admin-blog-slot[data-slot-index="0"] [data-field="date"]');
    const secondDate = main.querySelector('.admin-blog-slot[data-slot-index="1"] [data-field="date"]');

    firstDate?.addEventListener('change', () => {
      if (firstDate.value && !secondDate.value) secondDate.value = addDays(firstDate.value, INTERVAL_DAYS);
      collectAndSave();
      renderAdmin();
    });

    main.querySelectorAll('input, select, textarea').forEach((field) => {
      if (field.id === 'admin-year-select' || field.id === 'admin-import') return;
      field.addEventListener('change', () => { collectAndSave(); renderAdmin(); });
      field.addEventListener('blur', () => collectAndSave());
    });

    main.querySelectorAll('[data-admin-month]').forEach((button) => button.addEventListener('click', () => {
      collectAndSave();
      selectedMonth = Number(button.dataset.adminMonth);
      renderAdmin();
    }));

    main.querySelector('#admin-year-select')?.addEventListener('change', (event) => {
      collectAndSave();
      selectedYear = Number(event.target.value);
      renderAdmin();
    });

    main.querySelectorAll('.admin-clear-slot').forEach((button) => button.addEventListener('click', () => {
      if (!window.confirm('이 블로그 계획의 입력 내용을 모두 지울까요?')) return;
      const index = Number(button.closest('.admin-blog-slot').dataset.slotIndex);
      const next = readData();
      ensureMonth(next)[index] = defaultSlot(selectedYear, selectedMonth, index + 1);
      writeData(next);
      renderAdmin();
    }));

    main.querySelector('#admin-reset-month')?.addEventListener('click', () => {
      if (!window.confirm(`${selectedYear}년 ${selectedMonth}월 블로그 계획 2개를 모두 초기화할까요?`)) return;
      const next = readData();
      next.months[monthKey()] = [defaultSlot(selectedYear, selectedMonth, 1), defaultSlot(selectedYear, selectedMonth, 2)];
      writeData(next);
      renderAdmin();
    });

    main.querySelector('#admin-export')?.addEventListener('click', () => {
      const latest = collectAndSave();
      const blob = new Blob([JSON.stringify(latest, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `blueblack-content-admin-${selectedYear}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    });

    main.querySelector('#admin-import')?.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        if (!parsed || typeof parsed !== 'object' || !parsed.months) throw new Error();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        renderAdmin();
      } catch {
        window.alert('올바른 블루블랙 관리자 백업 파일이 아닙니다.');
      }
    });

    main.querySelector('#admin-open-guide')?.addEventListener('click', () => {
      const guideButton = document.querySelector('[data-sns-writing-guide]');
      if (guideButton) guideButton.click();
    });
  }

  function setAdminActive(active) {
    document.querySelectorAll('[data-admin-route="admin"]').forEach((button) => button.classList.toggle('active', active));
    if (active) document.querySelectorAll('[data-route]').forEach((button) => button.classList.remove('active'));
  }

  function addNavButton(parent, className, label, before = null) {
    if (!parent || parent.querySelector('[data-admin-route="admin"]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.dataset.adminRoute = 'admin';
    button.innerHTML = className.includes('nav-button') ? '<span class="nav-dot"></span>관리자' : label;
    button.addEventListener('click', () => { location.hash = '#/admin'; });
    parent.insertBefore(button, before);
  }

  function injectNavigation() {
    const top = document.querySelector('.topbar-actions');
    const side = document.querySelector('.sidebar');
    const mobile = document.querySelector('.mobile-tabs-inner');
    if (!top && !side && !mobile) return;
    addNavButton(top, 'ghost-button admin-top-button', '관리자', top?.querySelector('#logout-button') || null);
    addNavButton(side, 'nav-button admin-nav-button', '관리자', side?.querySelector('.sidebar-divider') || null);
    addNavButton(mobile, 'mobile-tab admin-mobile-button', '관리자');
  }

  function injectBlogReminder() {
    const route = location.hash.replace(/^#\//, '') || 'schedule';
    if (!['schedule', 'july', 'august'].includes(route)) return;
    const main = document.getElementById('main-content');
    if (!main || main.querySelector('.blog-duty-reminder')) return;
    const reminder = document.createElement('section');
    reminder.className = 'blog-duty-reminder';
    reminder.innerHTML = `<div><span>NAVER BLOG ROUTINE</span><strong>매월 블로그 글 2개 · 2주마다 1개</strong><p>회사 블로그 콘텐츠도 SNS 일정과 함께 준비해 주세요.</p></div><div><a href="${BLOG_URL}" target="_blank" rel="noopener noreferrer">블로그 열기 ↗</a><button type="button">관리자에서 계획하기</button></div>`;
    reminder.querySelector('button').addEventListener('click', () => { location.hash = '#/admin'; });
    main.insertAdjacentElement('afterbegin', reminder);
  }

  function sync() {
    injectNavigation();
    const route = location.hash.replace(/^#\//, '') || 'schedule';
    if (route === 'admin') {
      setTimeout(renderAdmin, 30);
    } else {
      setAdminActive(false);
      setTimeout(injectBlogReminder, 70);
    }
  }

  function scheduleSync() {
    clearTimeout(timer);
    timer = setTimeout(sync, 40);
  }

  window.addEventListener('DOMContentLoaded', scheduleSync, { once: true });
  window.addEventListener('hashchange', scheduleSync);
  new MutationObserver(scheduleSync).observe(document.documentElement, { childList: true, subtree: true });
})();