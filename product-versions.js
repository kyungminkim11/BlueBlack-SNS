(() => {
  'use strict';

  const STORAGE_KEY = 'blueblack-sns-selected-copy-version-v1';
  let timer = null;

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[ch]);

  const VERSION_META = [
    { label: '정석 소개형', note: '제품명과 특징을 균형 있게 전달' },
    { label: '감성 기록형', note: '제품에 어울리는 장면과 분위기를 중심으로 구성' },
    { label: '특징 정리형', note: '핵심 정보를 빠르게 읽는 체크형 구성' },
    { label: '추천 대상형', note: '어떤 고객에게 잘 맞는지 중심으로 설명' },
    { label: '짧은 피드형', note: '모바일에서 빠르게 읽는 간결한 버전' }
  ];

  function currentProductId() {
    const route = location.hash.replace(/^#\//, '');
    if (!route.startsWith('product/')) return '';
    try { return decodeURIComponent(route.slice(8)); }
    catch { return route.slice(8); }
  }

  function ensurePeriod(value) {
    const text = String(value || '').trim();
    return /[.!?。]$/.test(text) ? text : `${text}.`;
  }

  function readSelection() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  }

  function saveSelection(productId, index) {
    const selections = readSelection();
    selections[productId] = index;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(selections)); } catch {}
  }

  function buildFallbackVersions(item) {
    const notice = ensurePeriod(item.notice);
    const feature = ensurePeriod(item.feature);
    const use = ensurePeriod(item.use);
    const photo = ensurePeriod(item.photo);
    return [
      `${item.emoji} ${item.name}\n\n${item.intro}\n\n${item.description}\n\n이번 게시물에서는 ${item.photo}으로 제품을 자세히 보여드릴 예정입니다.\n\n${notice}\n\n${item.hashtags}`,
      `${item.emoji} 책상 위의 작은 도구 하나가 기록의 분위기를 바꿉니다.\n\n${item.intro}\n\n천천히 살펴볼수록 제품의 외관과 쓰임이 자연스럽게 이어집니다. ${item.use}에게 특히 잘 어울리는 선택입니다.\n\n이번에는 ${item.photo}으로 실제 사용하는 순간을 담아보았습니다.\n\n${notice}\n\n${item.hashtags}`,
      `${item.emoji} ${item.name}, 어떤 제품일까요?\n\n✔ 카테고리: ${item.category}\n✔ 핵심 포인트: ${feature}\n✔ 추천 대상: ${use}\n✔ 사진 구성: ${photo}\n\n${item.description}\n\n${notice}\n\n${item.hashtags}`,
      `${item.emoji} 이런 분께 ${item.name}을 소개합니다.\n\n• ${item.use}\n• 제품의 외관과 실제 사용 장면을 함께 확인하고 싶은 분\n• 블루블랙 자사몰에서 새로운 문구를 찾고 있는 분\n\n${item.intro}\n\n${item.description}\n\n게시물에서는 ${item.photo}으로 살펴볼 수 있습니다.\n\n${notice}\n\n${item.hashtags}`,
      `${item.emoji} ${item.name}\n\n${item.intro}\n${feature}\n\n${item.photo}으로 제품을 만나보세요.\n\n${notice}\n\n${item.hashtags}`
    ];
  }

  function buildVersions(item, productId) {
    const explicit = window.BLUEBLACK_COPY_VARIANTS?.[productId];
    const texts = Array.isArray(explicit) && explicit.length === 5
      ? explicit
      : buildFallbackVersions(item);

    return VERSION_META.map((meta, index) => ({
      ...meta,
      text: String(texts[index] || '')
    }));
  }

  function introductionMarkup(item) {
    return `
      <section id="product-introduction-card" class="section-card product-introduction-card">
        <div class="section-head">
          <div><p class="product-content-kicker">PRODUCT OVERVIEW</p><h3>제품 소개·설명</h3></div>
          <span>${escapeHTML(item.category)}</span>
        </div>
        <div class="section-body">
          <p class="product-intro-lead">${escapeHTML(item.intro)}</p>
          <p class="product-intro-description">${escapeHTML(item.description)}</p>
          <div class="product-explain-grid">
            <div><span>핵심 포인트</span><strong>${escapeHTML(item.feature)}</strong></div>
            <div><span>추천 대상</span><strong>${escapeHTML(item.use)}</strong></div>
            <div><span>사진 구성</span><strong>${escapeHTML(item.photo)}</strong></div>
          </div>
          <div class="product-content-notice"><span aria-hidden="true">!</span>${escapeHTML(item.notice)}</div>
        </div>
      </section>`;
  }

  function mountIntroduction(item) {
    const primaryStack = document.querySelector('.detail-grid > .stack');
    if (!primaryStack) return;
    const existing = document.getElementById('product-introduction-card');
    if (existing) return;
    primaryStack.insertAdjacentHTML('afterbegin', introductionMarkup(item));
  }

  function renderVersion(section, productId, item, versions, selectedIndex) {
    const selected = versions[selectedIndex] || versions[0];
    const body = section.querySelector('.section-body');
    body.innerHTML = `
      <div class="copy-version-shell">
        <div class="copy-version-tabs" role="tablist" aria-label="SNS 글 버전 선택">
          ${versions.map((version, index) => `<button type="button" role="tab" data-copy-version="${index}" class="copy-version-tab ${index === selectedIndex ? 'active' : ''}" aria-selected="${index === selectedIndex}"><b>V${index + 1}</b><span>${escapeHTML(version.label)}</span></button>`).join('')}
        </div>
        <div class="copy-version-head">
          <div><span id="copy-version-label">V${selectedIndex + 1} · ${escapeHTML(selected.label)}</span><p id="copy-version-note">${escapeHTML(selected.note)}</p></div>
          <button id="copy-selected-version" class="copy-version-button" type="button">선택 원고 복사</button>
        </div>
        <pre id="selected-version-text" class="draft-text copy-version-text">${escapeHTML(selected.text)}</pre>
        <div class="copy-version-footer"><span>이 제품을 위해 별도로 작성한 5개 원고입니다. 선택 버전은 현재 브라우저에 저장됩니다.</span><strong id="copy-version-count">${selected.text.length.toLocaleString('ko-KR')}자</strong></div>
      </div>`;

    body.querySelectorAll('[data-copy-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const nextIndex = Number(button.dataset.copyVersion);
        saveSelection(productId, nextIndex);
        renderVersion(section, productId, item, versions, nextIndex);
      });
    });

    body.querySelector('#copy-selected-version').addEventListener('click', async (event) => {
      try {
        await navigator.clipboard.writeText(selected.text);
        event.currentTarget.textContent = '복사됨';
        event.currentTarget.classList.add('copied');
        setTimeout(() => {
          event.currentTarget.textContent = '선택 원고 복사';
          event.currentTarget.classList.remove('copied');
        }, 1400);
      } catch {
        event.currentTarget.textContent = '복사 실패';
      }
    });
  }

  function mountVersions(productId, item) {
    const oldDraft = document.getElementById('draft-text');
    if (!oldDraft) return;
    const section = oldDraft.closest('.section-card');
    if (!section || section.dataset.copyVariants === productId) return;
    section.dataset.copyVariants = productId;

    const title = section.querySelector('.section-head h3');
    const subtitle = section.querySelector('.section-head span');
    if (title) title.textContent = 'SNS 글 5가지 버전';
    if (subtitle) subtitle.textContent = '제품별 개별 작성 · 선택 후 복사';

    const versions = buildVersions(item, productId);
    const saved = readSelection();
    const selectedIndex = Number.isInteger(saved[productId]) ? saved[productId] : 0;
    renderVersion(section, productId, item, versions, selectedIndex);

    document.querySelectorAll('.metric-chip').forEach((chip) => {
      if (chip.querySelector('span')?.textContent?.trim() === 'DRAFT') {
        const strong = chip.querySelector('strong');
        if (strong) strong.textContent = '개별 원고 5개 완료';
      }
    });
  }

  function mount() {
    const productId = currentProductId();
    const item = window.BLUEBLACK_PRODUCT_CONTENT?.[productId];
    if (!productId || !item || !document.querySelector('.detail-hero')) return;
    mountIntroduction(item);
    mountVersions(productId, item);
  }

  function scheduleMount() {
    clearTimeout(timer);
    timer = setTimeout(mount, 60);
  }

  window.addEventListener('hashchange', scheduleMount);
  window.addEventListener('DOMContentLoaded', scheduleMount, { once: true });
  new MutationObserver(scheduleMount).observe(document.documentElement, { childList: true, subtree: true });
})();
