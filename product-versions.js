(() => {
  'use strict';

  const STORAGE_KEY = 'blueblack-sns-selected-copy-version-v2';
  const REVIEW_KEY = 'blueblack-sns-copy-review-v1';
  let timer = null;

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[ch]);

  const normalize = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9가-힣]/g, '');

  const VERSION_META = [
    { label: '정석 소개형', note: '제품명과 핵심 정보를 균형 있게 전달' },
    { label: '감성 기록형', note: '제품에 어울리는 장면과 분위기를 중심으로 구성' },
    { label: '특징 정리형', note: '옵션과 핵심 정보를 빠르게 읽는 체크형 구성' },
    { label: '추천 대상형', note: '어떤 고객에게 잘 맞는지 중심으로 설명' },
    { label: '짧은 피드형', note: '모바일에서 빠르게 읽는 간결한 버전' }
  ];

  const JULY_COPY_RULES = [
    { canonical: ['pilot-neox-wakaru', 'pilot-neox', 'pilot-wakaru'], words: ['파이롯트네옥스', '파일럿네옥스', '네옥스그래파이트', 'neoxwakaru'] },
    { canonical: ['monday-0706'], words: ['monday0706', '0706네이처노트'] },
    { canonical: ['caran-dache-849', 'carandache-849'], words: ['까렌다쉬849', '카렌다쉬849', 'carandache849'] },
    { canonical: ['monteverde-calibra-4in1', 'monteverde-calibra', 'monteverde-desk-set'], words: ['몬테베르데카리브라', '몬테베르데칼리브라', '카리브라4in1', 'monteverdecalibra'] },
    { canonical: ['monday-0713', 'tonland-basic-6ring'], words: ['monday0713', '톤랜드베이직6공', '톤랜드가죽6공'] },
    { canonical: ['sheaffer-vfm', 'sheaffer-vfm-ballpoint'], words: ['쉐퍼vfm', 'sheaffervfm'] },
    { canonical: ['conifer-notes', 'conifer-view-unique'], words: ['코니퍼뷰유니크', '코니퍼노트', '코니퍼뷰', '코니퍼유니크'] },
    { canonical: ['monday-0720'], words: ['monday0720', '0720네이처노트'] },
    { canonical: ['diplomat-traveller', 'diplomat-traveller-set'], words: ['디플로마트트래블러', 'diplomattraveller'] },
    { canonical: ['sailor-deep-tone', 'sailor-dipton', 'sailor-dipton-shimmer-sheen'], words: ['세일러딥톤', '세일러딥턴', '세일러dipton', 'sailordipton', 'dipton'] },
    { canonical: ['monday-0727', 'penco-prime-timber'], words: ['monday0727', '펜코프라임팀버', 'pencoprimetimber'] },
    { canonical: ['waterman-expert-deluxe', 'waterman-expert-3-deluxe', 'waterman-expert-metallic'], words: ['워터맨엑스퍼트', 'watermanexpert'] },
    { canonical: ['esterbrook-estie', 'esterbrook-estie-fountain-pen', 'estie-fountain-pen'], words: ['에스터브룩에스티', 'esterbrookestie'] }
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

  function readObject(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); }
    catch { return {}; }
  }

  function writeObject(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  function readSelection() { return readObject(STORAGE_KEY); }

  function saveSelection(productId, index) {
    const selections = readSelection();
    selections[productId] = index;
    writeObject(STORAGE_KEY, selections);
  }

  function isReviewed(productId) {
    return Boolean(readObject(REVIEW_KEY)[productId]);
  }

  function setReviewed(productId, value) {
    const review = readObject(REVIEW_KEY);
    if (value) review[productId] = { reviewed: true, updatedAt: new Date().toISOString() };
    else delete review[productId];
    writeObject(REVIEW_KEY, review);
  }

  function isFiveTexts(value) {
    return Array.isArray(value) && value.length === 5 && value.every((text) => typeof text === 'string' && text.trim());
  }

  function resolveExplicitVersions(productId, item) {
    const store = window.BLUEBLACK_COPY_VARIANTS || {};
    const direct = store[productId];
    if (isFiveTexts(direct)) return { texts: direct, source: '직접 작성 원고' };

    const idKey = normalize(productId);
    const titleKey = normalize(`${item?.name || ''} ${document.querySelector('.detail-hero h2')?.textContent || ''}`);
    const rule = JULY_COPY_RULES.find((entry) =>
      entry.canonical.some((id) => normalize(id) === idKey) ||
      entry.words.some((word) => {
        const key = normalize(word);
        return key && (idKey.includes(key) || titleKey.includes(key));
      })
    );

    if (rule) {
      for (const alias of rule.canonical) {
        if (isFiveTexts(store[alias])) return { texts: store[alias], source: '7월 재작성 원고' };
      }
    }

    if (typeof window.BLUEBLACK_FIND_HOUSE_COPY === 'function') {
      const generated = window.BLUEBLACK_FIND_HOUSE_COPY(productId, item?.name || '');
      if (isFiveTexts(generated)) return { texts: generated, source: '작성 기준 적용 원고' };
    }

    return null;
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
    const explicit = resolveExplicitVersions(productId, item);
    const texts = explicit?.texts || buildFallbackVersions(item);
    return {
      source: explicit?.source || '임시 자동 원고',
      versions: VERSION_META.map((meta, index) => ({ ...meta, text: String(texts[index] || '') }))
    };
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
    if (!primaryStack || document.getElementById('product-introduction-card')) return;
    primaryStack.insertAdjacentHTML('afterbegin', introductionMarkup(item));
  }

  function textStats(text) {
    const hashtags = (text.match(/#[^\s#]+/g) || []).length;
    const mentions = (text.match(/@[A-Za-z0-9._]+/g) || []).length;
    return { characters: text.length, hashtags, mentions };
  }

  async function copyToClipboard(button, text, normalLabel) {
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = '복사됨';
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = normalLabel;
        button.classList.remove('copied');
      }, 1400);
    } catch {
      button.textContent = '복사 실패';
    }
  }

  function renderVersion(section, productId, item, versions, selectedIndex, source) {
    const selected = versions[selectedIndex] || versions[0];
    const reviewed = isReviewed(productId);
    const stats = textStats(selected.text);
    const body = section.querySelector('.section-body');
    body.innerHTML = `
      <div class="copy-version-shell">
        <div class="copy-version-statusbar">
          <span class="copy-source-badge ${source === '임시 자동 원고' ? 'fallback' : ''}">${escapeHTML(source)}</span>
          <button id="copy-review-toggle" class="copy-review-button ${reviewed ? 'reviewed' : ''}" type="button">${reviewed ? '✓ 검수 완료' : '검수 완료로 표시'}</button>
        </div>
        <div class="copy-version-tabs" role="tablist" aria-label="SNS 글 버전 선택">
          ${versions.map((version, index) => `<button type="button" role="tab" data-copy-version="${index}" class="copy-version-tab ${index === selectedIndex ? 'active' : ''}" aria-selected="${index === selectedIndex}"><b>V${index + 1}</b><span>${escapeHTML(version.label)}</span></button>`).join('')}
        </div>
        <div class="copy-version-head">
          <div><span id="copy-version-label">V${selectedIndex + 1} · ${escapeHTML(selected.label)}</span><p id="copy-version-note">${escapeHTML(selected.note)}</p></div>
          <div class="copy-version-actions">
            <button id="copy-all-versions" class="copy-version-button secondary" type="button">5개 전체 복사</button>
            <button id="copy-selected-version" class="copy-version-button" type="button">선택 원고 복사</button>
          </div>
        </div>
        <pre id="selected-version-text" class="draft-text copy-version-text">${escapeHTML(selected.text)}</pre>
        <div class="copy-version-footer">
          <span>선택 버전은 이 브라우저에 저장됩니다.</span>
          <div class="copy-version-stats"><strong>${stats.characters.toLocaleString('ko-KR')}자</strong><span>해시태그 ${stats.hashtags}</span>${stats.mentions ? `<span>계정 태그 ${stats.mentions}</span>` : ''}</div>
        </div>
      </div>`;

    body.querySelectorAll('[data-copy-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const nextIndex = Number(button.dataset.copyVersion);
        saveSelection(productId, nextIndex);
        renderVersion(section, productId, item, versions, nextIndex, source);
      });
    });

    body.querySelector('#copy-selected-version').addEventListener('click', (event) => {
      copyToClipboard(event.currentTarget, selected.text, '선택 원고 복사');
    });

    body.querySelector('#copy-all-versions').addEventListener('click', (event) => {
      const combined = versions.map((version, index) => `V${index + 1} · ${version.label}\n\n${version.text}`).join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n');
      copyToClipboard(event.currentTarget, combined, '5개 전체 복사');
    });

    body.querySelector('#copy-review-toggle').addEventListener('click', () => {
      setReviewed(productId, !isReviewed(productId));
      renderVersion(section, productId, item, versions, selectedIndex, source);
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

    const built = buildVersions(item, productId);
    const saved = readSelection();
    const savedIndex = Number(saved[productId]);
    const selectedIndex = Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < 5 ? savedIndex : 0;
    renderVersion(section, productId, item, built.versions, selectedIndex, built.source);

    document.querySelectorAll('.metric-chip').forEach((chip) => {
      if (chip.querySelector('span')?.textContent?.trim() === 'DRAFT') {
        const strong = chip.querySelector('strong');
        if (strong) strong.textContent = isReviewed(productId) ? '원고 5개 · 검수 완료' : '개별 원고 5개 준비';
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
    timer = setTimeout(mount, 50);
  }

  window.addEventListener('hashchange', scheduleMount);
  window.addEventListener('DOMContentLoaded', scheduleMount, { once: true });
  new MutationObserver(scheduleMount).observe(document.documentElement, { childList: true, subtree: true });
})();