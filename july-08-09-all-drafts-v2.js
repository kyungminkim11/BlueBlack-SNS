(() => {
  'use strict';

  const targetIds = new Set([
    'three-o-basic-ink-new-colors-0708',
    'monteverde-calibra-4in1',
    'sheaffer-vfm',
    'sheaffer-vfm-ballpoint',
    'pilot-capless-decimo-matt-elegance-0708',
    'penco-prime-timber-mechanical-pencil'
  ]);
  const defaultLabels = [
    ['제품 핵심 소개형', '대표 특징과 주요 사양을 균형 있게 전달'],
    ['디자인·분위기형', '실제 색감, 소재, 구조적 인상을 중심으로 전달'],
    ['옵션·구성형', '색상, 구성품, 선택 정보를 읽기 쉽게 정리'],
    ['사용·추천형', '실제 사용 장면과 추천 대상을 중심으로 전달'],
    ['짧은 피드형', '핵심만 빠르게 읽히는 간결한 게시글']
  ];
  const labelsByProduct = {
    'monteverde-calibra-4in1': [
      ['제품 핵심 소개형', '볼펜·스타일러스·룰러·스탠드 구성을 균형 있게 전달'],
      ['디자인·분위기형', '블랙·다크 그레이와 데스크 세트 인상을 중심으로 전달'],
      ['옵션·구성형', '4-in-1 구성과 색상 옵션을 읽기 쉽게 정리'],
      ['사용·추천형', '업무 책상, 서재, 태블릿 사용 장면을 중심으로 전달'],
      ['짧은 피드형', '핵심 구성만 빠르게 읽히는 간결한 소개글']
    ],
    'pilot-capless-decimo-matt-elegance-0708': [
      ['신제품 입고 기본형', '입고 소식과 핵심 특징을 균형 있게 전달'],
      ['신제품 무드형', '신규 입고 분위기와 제품 인상을 중심으로 전달'],
      ['비교 정리형', '매트·엘레강스의 차이를 빠르게 비교'],
      ['색상 구성형', '색상과 라인 구성을 중심으로 전달'],
      ['업무·실사용형', '사용 장면과 추천 대상을 중심으로 전달']
    ],
    'penco-prime-timber-mechanical-pencil': [
      ['제품 핵심 소개형', '2.0mm 심·나무 바디·전용 샤프너를 균형 있게 전달'],
      ['색상·옵션형', '기본 6색과 추가금 옵션 4종을 중심으로 전달'],
      ['특징 정리형', '심 규격과 구성품, 활용 정보를 빠르게 정리'],
      ['사용·드로잉형', '필기·스케치·도면 메모 활용 장면을 중심으로 전달'],
      ['짧은 피드형', '핵심 특징과 색상 구성을 간결하게 소개']
    ]
  };
  let timer = null;

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[character]);

  function currentId() {
    const route = location.hash.replace(/^#\//, '');
    if (!route.startsWith('product/')) return '';
    try { return decodeURIComponent(route.slice(8)); }
    catch { return route.slice(8); }
  }

  function findSection() {
    return document.getElementById('draft-text')?.closest('.section-card')
      || document.querySelector('.copy-version-shell')?.closest('.section-card')
      || document.querySelector('.all-drafts-grid')?.closest('.section-card')
      || [...document.querySelectorAll('.section-card')].find((section) => /원고|SNS 글/.test(section.querySelector('.section-head h3')?.textContent || ''))
      || null;
  }

  async function copy(button, text, originalLabel) {
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = '복사됨';
      setTimeout(() => { button.textContent = originalLabel; }, 1200);
    } catch {
      button.textContent = '복사 실패';
    }
  }

  function signatureOf(variants) {
    return variants.map((text) => `${text.length}:${text.slice(0, 24)}`).join('|');
  }

  function labelsFor(productId) {
    return labelsByProduct[productId] || defaultLabels;
  }

  function render() {
    const productId = currentId();
    if (!targetIds.has(productId) || !document.querySelector('.detail-hero')) return;

    const variants = window.BLUEBLACK_COPY_VARIANTS?.[productId];
    if (!Array.isArray(variants) || variants.length !== 5) return;

    const labels = labelsFor(productId);
    const section = findSection();
    if (!section) return;
    const signature = signatureOf(variants);
    if (section.dataset.copyVariants === productId && section.dataset.draftsSignature === signature && section.querySelectorAll('.all-draft-card').length === 5) return;

    const title = section.querySelector('.section-head h3');
    const subtitle = section.querySelector('.section-head span');
    if (title) title.textContent = 'SNS 원고 5개';
    if (subtitle) subtitle.textContent = '전체 원고를 한 화면에서 확인·복사';

    const cards = variants.map((text, index) => {
      const hashtags = (text.match(/#[^\s#]+/g) || []).length;
      const mentions = (text.match(/@[A-Za-z0-9._]+/g) || []).length;
      const label = labels[index] || [`V${index + 1}`, 'SNS 원고'];
      return `<article class="all-draft-card">
        <div class="all-draft-head">
          <div class="all-draft-title"><b>V${index + 1}</b><div><strong>${escapeHTML(label[0])}</strong><span>${escapeHTML(label[1])}</span></div></div>
          <button class="all-draft-copy" type="button" data-copy-index="${index}">이 원고 복사</button>
        </div>
        <pre class="all-draft-text">${escapeHTML(text)}</pre>
        <div class="all-draft-stats">${text.length.toLocaleString('ko-KR')}자 · 해시태그 ${hashtags}${mentions ? ` · 계정 태그 ${mentions}` : ''}</div>
      </article>`;
    }).join('');

    const body = section.querySelector('.section-body');
    if (!body) return;
    body.innerHTML = `<div class="all-drafts-toolbar"><p>V1부터 V5까지 모두 표시됩니다.</p><button class="all-drafts-copy-all" type="button">원고 5개 전체 복사</button></div><div class="all-drafts-grid">${cards}</div>`;
    section.dataset.copyVariants = productId;
    section.dataset.draftsSignature = signature;

    body.querySelectorAll('[data-copy-index]').forEach((button) => {
      button.addEventListener('click', () => copy(button, variants[Number(button.dataset.copyIndex)], '이 원고 복사'));
    });

    body.querySelector('.all-drafts-copy-all')?.addEventListener('click', (event) => {
      const allText = variants.map((text, index) => `V${index + 1} · ${(labels[index] || [`V${index + 1}`])[0]}\n\n${text}`).join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n');
      copy(event.currentTarget, allText, '원고 5개 전체 복사');
    });

    document.querySelectorAll('.metric-chip').forEach((chip) => {
      if (chip.querySelector('span')?.textContent?.trim() === 'DRAFT') {
        const value = chip.querySelector('strong');
        if (value) value.textContent = '완성 원고 5개';
      }
    });
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(render, 80);
  }

  window.addEventListener('DOMContentLoaded', schedule, { once: true });
  window.addEventListener('hashchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  window.setInterval(render, 800);
})();