(() => {
  'use strict';

  const STORAGE_KEY = 'blueblack-sns-product-memos-v1';
  let renderTimer = null;
  let mountedProductId = '';

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[ch]);

  function getProductId() {
    const route = location.hash.replace(/^#\//, '');
    if (!route.startsWith('product/')) return '';
    try { return decodeURIComponent(route.slice(8)); }
    catch { return route.slice(8); }
  }

  function readAllMemos() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeAllMemos(value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }

  function hasMemo(memo) {
    return Boolean(memo && [
      memo.plannedDate,
      memo.replacementProduct,
      memo.scheduleMemo,
      memo.productMemo,
      memo.generalMemo
    ].some((value) => String(value || '').trim()));
  }

  function formatDate(dateText) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText || '')) return dateText || '미입력';
    const [year, month, day] = dateText.split('-');
    return `${year}.${month}.${day}`;
  }

  function extractSchedule() {
    const detailDate = document.querySelector('.detail-date')?.textContent || '';
    const date = detailDate.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '';
    const parts = detailDate.split('·').map((item) => item.trim());
    const weekday = parts[1] || '';
    const category = parts[2] || '';
    const title = document.querySelector('.detail-hero h2')?.textContent?.trim() || '';
    const draftState = document.querySelector('.draft-state')?.textContent?.trim() || '확인 필요';
    return { date, weekday, category, title, draftState };
  }

  function createPlanningPanel(productId) {
    const schedule = extractSchedule();
    if (!schedule.date || !schedule.title) return null;

    const allMemos = readAllMemos();
    const memo = allMemos[productId] || {};
    const changedDate = memo.plannedDate
      ? `<div class="planning-change"><span>변경 검토일</span><strong>${escapeHTML(formatDate(memo.plannedDate))}</strong></div>`
      : '';

    const wrapper = document.createElement('div');
    wrapper.id = 'product-planning-panel';
    wrapper.className = 'product-planning-grid';
    wrapper.innerHTML = `
      <section class="planning-card schedule-planning-card">
        <div class="planning-card-head">
          <div>
            <p class="planning-kicker">PUBLISHING SCHEDULE</p>
            <h3>게시 예정 일정</h3>
          </div>
          <span class="schedule-confirmed-badge">달력 등록</span>
        </div>
        <div class="schedule-timeline">
          <div class="schedule-timeline-item primary">
            <span class="timeline-label">업로드 예정일</span>
            <strong>${escapeHTML(formatDate(schedule.date))}</strong>
            <small>${escapeHTML(schedule.weekday)} · ${escapeHTML(schedule.category)}</small>
          </div>
          <div class="schedule-timeline-item">
            <span class="timeline-label">1차안 확인</span>
            <strong>전날 저녁</strong>
            <small>제품 정보와 원고 사전 검토</small>
          </div>
          <div class="schedule-timeline-item">
            <span class="timeline-label">최종본 확인</span>
            <strong>당일 오전 7시</strong>
            <small>수정 의견과 재고 상태 재검수</small>
          </div>
          <div class="schedule-timeline-item">
            <span class="timeline-label">현재 원고</span>
            <strong>${escapeHTML(schedule.draftState)}</strong>
            <small>최종 사용 여부는 검토 후 결정</small>
          </div>
        </div>
        ${changedDate}
      </section>

      <section class="planning-card memo-planning-card">
        <div class="planning-card-head">
          <div>
            <p class="planning-kicker">CHANGE MEMO</p>
            <h3>일정·제품 변경 메모</h3>
          </div>
          <span id="memo-save-state" class="memo-save-state">${memo.updatedAt ? `저장됨 ${escapeHTML(memo.updatedAt)}` : '미저장'}</span>
        </div>
        <div class="memo-form-grid">
          <label class="memo-field">
            <span>변경 희망 업로드일</span>
            <input id="memo-planned-date" type="date" value="${escapeHTML(memo.plannedDate || '')}">
          </label>
          <label class="memo-field">
            <span>변경 희망 제품명</span>
            <input id="memo-replacement-product" type="text" value="${escapeHTML(memo.replacementProduct || '')}" placeholder="예: 다른 색상 또는 대체 제품">
          </label>
          <label class="memo-field memo-field-wide">
            <span>일정 변경 메모</span>
            <textarea id="memo-schedule" rows="3" placeholder="촬영 일정, 게시일 이동 사유 등을 적어주세요.">${escapeHTML(memo.scheduleMemo || '')}</textarea>
          </label>
          <label class="memo-field memo-field-wide">
            <span>제품 변경 메모</span>
            <textarea id="memo-product" rows="3" placeholder="대체 제품, 색상, 옵션 변경 내용을 적어주세요.">${escapeHTML(memo.productMemo || '')}</textarea>
          </label>
          <label class="memo-field memo-field-wide">
            <span>기타 작업 메모</span>
            <textarea id="memo-general" rows="3" placeholder="사진 준비, 재고 확인, 수정 의견 등을 적어주세요.">${escapeHTML(memo.generalMemo || '')}</textarea>
          </label>
        </div>
        <div class="memo-actions">
          <p>메모는 현재 브라우저에만 저장되며 다른 기기와 자동 동기화되지 않습니다.</p>
          <div>
            <button id="memo-clear-button" class="memo-secondary-button" type="button">메모 지우기</button>
            <button id="memo-save-button" class="memo-primary-button" type="button">메모 저장</button>
          </div>
        </div>
      </section>`;

    return wrapper;
  }

  function bindPlanningPanel(productId, panel) {
    const saveState = panel.querySelector('#memo-save-state');
    const fields = panel.querySelectorAll('input, textarea');

    fields.forEach((field) => field.addEventListener('input', () => {
      saveState.textContent = '변경사항 미저장';
      saveState.classList.add('unsaved');
    }));

    panel.querySelector('#memo-save-button').addEventListener('click', () => {
      const allMemos = readAllMemos();
      const now = new Date();
      const timestamp = now.toLocaleString('ko-KR', {
        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
      });

      allMemos[productId] = {
        plannedDate: panel.querySelector('#memo-planned-date').value,
        replacementProduct: panel.querySelector('#memo-replacement-product').value.trim(),
        scheduleMemo: panel.querySelector('#memo-schedule').value.trim(),
        productMemo: panel.querySelector('#memo-product').value.trim(),
        generalMemo: panel.querySelector('#memo-general').value.trim(),
        updatedAt: timestamp
      };

      try {
        writeAllMemos(allMemos);
        saveState.textContent = `저장됨 ${timestamp}`;
        saveState.classList.remove('unsaved');
        saveState.classList.add('saved');
        updateScheduleMemoBadges();
        setTimeout(() => saveState.classList.remove('saved'), 1400);
      } catch {
        saveState.textContent = '저장 실패';
        saveState.classList.add('unsaved');
      }
    });

    panel.querySelector('#memo-clear-button').addEventListener('click', () => {
      if (!window.confirm('이 제품의 일정·제품 변경 메모를 모두 지울까요?')) return;
      const allMemos = readAllMemos();
      delete allMemos[productId];
      try { writeAllMemos(allMemos); } catch {}
      fields.forEach((field) => { field.value = ''; });
      saveState.textContent = '메모 없음';
      saveState.classList.remove('unsaved', 'saved');
      updateScheduleMemoBadges();
      panel.querySelector('.planning-change')?.remove();
    });
  }

  function mountPlanningPanel() {
    const productId = getProductId();
    const hero = document.querySelector('.detail-hero');
    if (!productId || !hero) {
      mountedProductId = '';
      updateScheduleMemoBadges();
      return;
    }

    const existing = document.getElementById('product-planning-panel');
    if (existing && mountedProductId === productId) return;
    existing?.remove();

    const panel = createPlanningPanel(productId);
    if (!panel) return;
    hero.insertAdjacentElement('afterend', panel);
    bindPlanningPanel(productId, panel);
    mountedProductId = productId;
  }

  function updateScheduleMemoBadges() {
    const memos = readAllMemos();
    document.querySelectorAll('.schedule-row[data-product]').forEach((row) => {
      const productId = row.dataset.product;
      const memo = memos[productId];
      let badge = row.querySelector('.local-memo-badge');

      if (!hasMemo(memo)) {
        badge?.remove();
        return;
      }

      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'local-memo-badge';
        row.querySelector('.schedule-content')?.append(badge);
      }

      badge.textContent = memo.plannedDate
        ? `메모 · ${formatDate(memo.plannedDate).slice(5)}`
        : '메모 있음';
    });
  }

  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(() => {
      mountPlanningPanel();
      updateScheduleMemoBadges();
    }, 40);
  }

  window.addEventListener('hashchange', scheduleRender);
  window.addEventListener('DOMContentLoaded', scheduleRender, { once: true });
  new MutationObserver(scheduleRender).observe(document.documentElement, { childList: true, subtree: true });
})();
