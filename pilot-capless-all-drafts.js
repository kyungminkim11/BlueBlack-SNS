(() => {
  'use strict';

  const targetIds = new Set(['pilot-capless-matte-elegance', 'pilot-capless-matte', 'pilot-capless-elegance', 'pilot-capless-se']);
  const labels = ['제품 핵심 소개형', '디자인·색감형', '옵션·구성 정리형', '사용·추천형', '짧은 피드형'];
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

  async function copyText(button, text, label) {
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = '복사됨';
      setTimeout(() => { button.textContent = label; }, 1200);
    } catch {
      button.textContent = '복사 실패';
    }
  }

  function render() {
    const productId = currentId();
    if (!targetIds.has(productId) || !document.querySelector('.detail-hero')) return;
    const variants = window.BLUEBLACK_COPY_VARIANTS?.[productId];
    if (!Array.isArray(variants) || variants.length !== 5) return;

    const section = findSection();
    if (!section || section.querySelectorAll('.all-draft-card').length === 5) return;

    const title = section.querySelector('.section-head h3');
    const subtitle = section.querySelector('.section-head span');
    if (title) title.textContent = 'SNS 원고 5개';
    if (subtitle) subtitle.textContent = '전체 원고를 한 화면에서 확인·복사';

    const cards = variants.map((text, index) => {
      const hashtags = (text.match(/#[^\s#]+/g) || []).length;
      return `<article class="all-draft-card">
        <div class="all-draft-head">
          <div class="all-draft-title"><b>V${index + 1}</b><div><strong>${escapeHTML(labels[index])}</strong></div></div>
          <button class="all-draft-copy" type="button" data-copy-index="${index}">이 원고 복사</button>
        </div>
        <pre class="all-draft-text">${escapeHTML(text)}</pre>
        <div class="all-draft-stats">${text.length.toLocaleString('ko-KR')}자 · 해시태그 ${hashtags}</div>
      </article>`;
    }).join('');

    const body = section.querySelector('.section-body');
    if (!body) return;
    body.innerHTML = `<div class="all-drafts-toolbar"><p>V1부터 V5까지 모두 표시됩니다.</p><button class="all-drafts-copy-all" type="button">원고 5개 전체 복사</button></div><div class="all-drafts-grid">${cards}</div>`;

    body.querySelectorAll('[data-copy-index]').forEach((button) => {
      button.addEventListener('click', () => copyText(button, variants[Number(button.dataset.copyIndex)], '이 원고 복사'));
    });

    body.querySelector('.all-drafts-copy-all')?.addEventListener('click', (event) => {
      const combined = variants.map((text, index) => `V${index + 1} · ${labels[index]}\n\n${text}`).join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n');
      copyText(event.currentTarget, combined, '원고 5개 전체 복사');
    });
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(render, 100);
  }

  window.addEventListener('DOMContentLoaded', schedule, { once: true });
  window.addEventListener('hashchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  window.setInterval(render, 900);
})();