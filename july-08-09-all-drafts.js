(() => {
  'use strict';

  const TARGETS = new Set([
    'three-o-basic-ink-new-colors-0708',
    'monteverde-calibra-4in1'
  ]);

  const META = [
    ['제품 핵심 소개형', '대표 특징과 주요 정보를 균형 있게 전달'],
    ['디자인·색감형', '색과 분위기, 외형을 중심으로 전달'],
    ['옵션·구성 정리형', '색상과 구성 정보를 빠르게 확인'],
    ['사용·추천형', '활용 장면과 추천 대상을 중심으로 전달'],
    ['짧은 피드형', '핵심만 간결하게 전달']
  ];

  let timer = null;

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[ch]);

  function currentProductId() {
    const route = location.hash.replace(/^#\//, '');
    if (!route.startsWith('product/')) return '';
    try { return decodeURIComponent(route.slice(8)); }
    catch { return route.slice(8); }
  }

  async function copyText(button, text, label) {
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = '복사됨';
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = label;
        button.classList.remove('copied');
      }, 1400);
    } catch {
      button.textContent = '복사 실패';
    }
  }

  function findDraftSection() {
    const direct = document.getElementById('draft-text')?.closest('.section-card');
    if (direct) return direct;
    const versioned = document.querySelector('.copy-version-shell')?.closest('.section-card');
    if (versioned) return versioned;
    return [...document.querySelectorAll('.section-card')].find((section) => {
      const title = section.querySelector('.section-head h3')?.textContent || '';
      return /원고|SNS 글/.test(title);
    }) || null;
  }

  function renderAllDrafts(productId, variants) {
    const section = findDraftSection();
    if (!section || section.dataset.allDrafts === productId) return;

    section.dataset.allDrafts = productId;
    section.dataset.copyVariants = productId;

    const title = section.querySelector('.section-head h3');
    const subtitle = section.querySelector('.section-head span');
    if (title) title.textContent = 'SNS 원고 5개';
    if (subtitle) subtitle.textContent = '전체 원고를 한 화면에서 확인·복사';

    const body = section.querySelector('.section-body');
    if (!body) return;

    const cards = variants.map((text, index) => {
      const hashtagCount = (text.match(/#[^\s#]+/g) || []).length;
      const mentionCount = (text.match(/@[A-Za-z0-9._]+/g) || []).length;
      return `
        <article class="all-draft-card" data-all-draft-card="${index}">
          <div class="all-draft-head">
            <div class="all-draft-title">
              <b>V${index + 1}</b>
              <div><strong>${escapeHTML(META[index][0])}</strong><span>${escapeHTML(META[index][1])}</span></div>
            </div>
            <button class="all-draft-copy" type="button" data-copy-draft="${index}">이 원고 복사</button>
          </div>
          <pre class="all-draft-text">${escapeHTML(text)}</pre>
          <div class="all-draft-stats">${text.length.toLocaleString('ko-KR')}자 · 해시태그 ${hashtagCount}${mentionCount ? ` · 계정 태그 ${mentionCount}` : ''}</div>
        </article>`;
    }).join('');

    body.innerHTML = `
      <div class="all-drafts-toolbar">
        <p>V1부터 V5까지 모두 표시됩니다. 각각 복사하거나 한 번에 복사할 수 있습니다.</p>
        <button class="all-drafts-copy-all" type="button">원고 5개 전체 복사</button>
      </div>
      <div class="all-drafts-grid">${cards}</div>`;

    body.querySelectorAll('[data-copy-draft]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.copyDraft);
        copyText(button, variants[index], '이 원고 복사');
      });
    });

    body.querySelector('.all-drafts-copy-all')?.addEventListener('click', (event) => {
      const combined = variants.map((text, index) => `V${index + 1} · ${META[index][0]}\n\n${text}`).join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n');
      copyText(event.currentTarget, combined, '원고 5개 전체 복사');
    });

    document.querySelectorAll('.metric-chip').forEach((chip) => {
      if (chip.querySelector('span')?.textContent?.trim() === 'DRAFT') {
        const strong = chip.querySelector('strong');
        if (strong) strong.textContent = '완성 원고 5개';
      }
    });
  }

  function mount() {
    const productId = currentProductId();
    if (!TARGETS.has(productId) || !document.querySelector('.detail-hero')) return;
    const variants = window.BLUEBLACK_COPY_VARIANTS?.[productId];
    if (!Array.isArray(variants) || variants.length !== 5) return;
    renderAllDrafts(productId, variants);
  }

  function scheduleMount() {
    clearTimeout(timer);
    timer = setTimeout(mount, 70);
  }

  window.addEventListener('DOMContentLoaded', scheduleMount, { once: true });
  window.addEventListener('hashchange', scheduleMount);
  new MutationObserver(scheduleMount).observe(document.documentElement, { childList: true, subtree: true });
})();