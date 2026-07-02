(() => {
  'use strict';

  let promptText = '';
  let mounted = false;
  let observerTimer = null;

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[ch]);

  async function loadPrompt() {
    if (promptText) return promptText;
    const [baseResponse, addendumResponse] = await Promise.all([
      fetch('./SNS_WRITING_PROMPT.md', { cache: 'no-store' }),
      fetch('./SNS_WRITING_PROMPT_ADDENDUM.md', { cache: 'no-store' })
    ]);
    if (!baseResponse.ok) throw new Error('SNS 작성 기준을 불러오지 못했습니다.');
    const basePrompt = await baseResponse.text();
    const addendum = addendumResponse.ok ? await addendumResponse.text() : '';
    promptText = addendum ? `${basePrompt}\n\n---\n\n${addendum}` : basePrompt;
    window.BLUEBLACK_SNS_WRITING_PROMPT = promptText;
    return promptText;
  }

  function closePanel() {
    const overlay = document.getElementById('sns-writing-guide-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.classList.remove('guide-open');
    setTimeout(() => overlay.remove(), 180);
  }

  function promptSummaryMarkup() {
    return `
      <div class="guide-summary-grid">
        <div><span>시작</span><strong>첫 줄에 제품 맞춤 이모지 1개</strong></div>
        <div><span>본문</span><strong>짧은 문단 4~7개 · 구체적 제품 정보 중심</strong></div>
        <div><span>톤</span><strong>친근한 존댓말 · 밝고 자연스럽게</strong></div>
        <div><span>출력</span><strong>제품별 완성형 원고 5가지 버전</strong></div>
        <div><span>마무리</span><strong>브랜드 공식 계정 + 해시태그 약 20개</strong></div>
        <div><span>사진</span><strong>대표·구성·디테일·사용·비교·정보 컷</strong></div>
      </div>`;
  }

  async function openPanel() {
    let overlay = document.getElementById('sns-writing-guide-overlay');
    if (overlay) {
      overlay.classList.add('is-open');
      document.body.classList.add('guide-open');
      return;
    }

    overlay = document.createElement('div');
    overlay.id = 'sns-writing-guide-overlay';
    overlay.className = 'sns-writing-guide-overlay';
    overlay.innerHTML = `
      <section class="sns-writing-guide-panel" role="dialog" aria-modal="true" aria-labelledby="sns-guide-title">
        <div class="guide-panel-head">
          <div>
            <p>CONTENT SETTINGS</p>
            <h2 id="sns-guide-title">SNS 작성 기준</h2>
            <span>실제 블루블랙 게시글을 기준으로 정리한 마스터 프롬프트</span>
          </div>
          <button id="sns-guide-close" class="guide-close-button" type="button" aria-label="닫기">×</button>
        </div>
        <div class="guide-panel-body">
          ${promptSummaryMarkup()}
          <div class="guide-toolbar">
            <div><strong>마스터 프롬프트</strong><span>향후 모든 제품 원고 작성 시 우선 적용</span></div>
            <button id="sns-guide-copy" type="button">전체 프롬프트 복사</button>
          </div>
          <pre id="sns-guide-prompt" class="guide-prompt-box">불러오는 중...</pre>
          <div class="guide-checklist">
            <strong>업로드 전 핵심 확인</strong>
            <p>자사몰 등록·재고 · 사진 6종 구도 · 공식 브랜드 계정 · 해시태그 약 20개 · 날짜와 이벤트 조건</p>
          </div>
        </div>
      </section>`;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    document.body.classList.add('guide-open');

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closePanel();
    });
    overlay.querySelector('#sns-guide-close').addEventListener('click', closePanel);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && document.getElementById('sns-writing-guide-overlay')) closePanel();
    }, { once: true });

    const promptEl = overlay.querySelector('#sns-guide-prompt');
    const copyButton = overlay.querySelector('#sns-guide-copy');

    try {
      const prompt = await loadPrompt();
      promptEl.textContent = prompt;
      copyButton.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(prompt);
          copyButton.textContent = '복사됨';
          copyButton.classList.add('copied');
          setTimeout(() => {
            copyButton.textContent = '전체 프롬프트 복사';
            copyButton.classList.remove('copied');
          }, 1400);
        } catch {
          copyButton.textContent = '복사 실패';
        }
      });
    } catch (error) {
      promptEl.textContent = error.message;
      copyButton.disabled = true;
    }
  }

  function makeButton(className, text, compact = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.dataset.snsWritingGuide = 'true';
    button.innerHTML = compact
      ? `<span aria-hidden="true">✦</span><span>${escapeHTML(text)}</span>`
      : `<span class="nav-dot"></span>${escapeHTML(text)}`;
    button.addEventListener('click', openPanel);
    return button;
  }

  function mountButtons() {
    const topbarActions = document.querySelector('.topbar-actions');
    const sidebar = document.querySelector('.sidebar');
    const mobileTabsInner = document.querySelector('.mobile-tabs-inner');
    if (!topbarActions && !sidebar && !mobileTabsInner) {
      mounted = false;
      return;
    }

    if (topbarActions && !topbarActions.querySelector('[data-sns-writing-guide]')) {
      const button = makeButton('ghost-button sns-guide-top-button', '작성 기준', true);
      const logout = topbarActions.querySelector('#logout-button');
      topbarActions.insertBefore(button, logout || null);
    }

    if (sidebar && !sidebar.querySelector('[data-sns-writing-guide]')) {
      const button = makeButton('nav-button sns-guide-nav-button', 'SNS 작성 기준');
      const divider = sidebar.querySelector('.sidebar-divider');
      sidebar.insertBefore(button, divider || null);
    }

    if (mobileTabsInner && !mobileTabsInner.querySelector('[data-sns-writing-guide]')) {
      const button = makeButton('mobile-tab sns-guide-mobile-button', '작성 기준', true);
      mobileTabsInner.appendChild(button);
    }

    mounted = true;
  }

  function scheduleMount() {
    clearTimeout(observerTimer);
    observerTimer = setTimeout(mountButtons, 40);
  }

  window.addEventListener('DOMContentLoaded', scheduleMount, { once: true });
  window.addEventListener('hashchange', scheduleMount);
  new MutationObserver(scheduleMount).observe(document.documentElement, { childList: true, subtree: true });
  loadPrompt().catch(() => {});
})();
