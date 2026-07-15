(() => {
  'use strict';

  const DIALOG_ID = 'blueblack-official-gallery';
  let items = [];
  let currentIndex = 0;

  function ensureDialog() {
    let dialog = document.getElementById(DIALOG_ID);
    if (dialog) return dialog;

    dialog = document.createElement('dialog');
    dialog.id = DIALOG_ID;
    dialog.setAttribute('aria-label', '공식 이미지 확대 보기');
    dialog.innerHTML = `
      <div class="official-gallery-shell">
        <header class="official-gallery-head">
          <div class="official-gallery-title">
            <strong id="official-gallery-heading">공식 이미지</strong>
            <span id="official-gallery-count"></span>
          </div>
          <button class="official-gallery-close" type="button">닫기</button>
        </header>
        <div class="official-gallery-stage">
          <button class="official-gallery-nav official-gallery-prev" type="button" aria-label="이전 이미지">‹</button>
          <img class="official-gallery-image" alt="" />
          <button class="official-gallery-nav official-gallery-next" type="button" aria-label="다음 이미지">›</button>
        </div>
        <footer class="official-gallery-foot">
          <div class="official-gallery-caption"><strong></strong><span></span></div>
          <a class="official-gallery-source" href="#" target="_blank" rel="noopener noreferrer">공식 출처 열기 ↗</a>
        </footer>
      </div>`;

    dialog.querySelector('.official-gallery-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.official-gallery-prev').addEventListener('click', () => show(currentIndex - 1));
    dialog.querySelector('.official-gallery-next').addEventListener('click', () => show(currentIndex + 1));
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') show(currentIndex - 1);
      if (event.key === 'ArrowRight') show(currentIndex + 1);
    });

    document.body.appendChild(dialog);
    return dialog;
  }

  function collectItems() {
    const cards = [...document.querySelectorAll('.image-grid .image-card')];
    items = cards.map((card, index) => {
      const image = card.querySelector('img');
      const caption = card.querySelector('figcaption strong');
      const source = card.querySelector('figcaption a');
      const notice = card.querySelector('figcaption p');
      const media = card.querySelector('.image-card-media');

      if (media) {
        media.tabIndex = 0;
        media.setAttribute('role', 'button');
        media.setAttribute('aria-label', `${caption?.textContent?.trim() || '공식 이미지'} 확대 보기`);

        let badge = media.querySelector('.official-image-index');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'official-image-index';
          media.appendChild(badge);
        }
        badge.textContent = `${index + 1} / ${cards.length}`;
      }

      return {
        src: image?.currentSrc || image?.src || '',
        alt: image?.alt || '',
        caption: caption?.textContent?.trim() || '공식 이미지',
        notice: notice?.textContent?.trim() || '',
        sourceUrl: source?.href || '#',
        media
      };
    });
  }

  function show(index) {
    collectItems();
    if (!items.length) return;

    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const dialog = ensureDialog();
    const image = dialog.querySelector('.official-gallery-image');

    image.src = item.src;
    image.alt = item.alt;
    dialog.querySelector('#official-gallery-heading').textContent = item.caption;
    dialog.querySelector('#official-gallery-count').textContent = `공식 이미지 ${currentIndex + 1} / ${items.length}`;
    dialog.querySelector('.official-gallery-caption strong').textContent = item.caption;
    dialog.querySelector('.official-gallery-caption span').textContent = item.notice;
    dialog.querySelector('.official-gallery-source').href = item.sourceUrl;

    if (!dialog.open) dialog.showModal();
  }

  document.addEventListener('click', (event) => {
    const media = event.target.closest('.image-card-media');
    if (!media || !media.closest('.image-grid')) return;

    collectItems();
    const index = items.findIndex((item) => item.media === media);
    if (index >= 0) show(index);
  });

  document.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    const media = event.target.closest?.('.image-card-media');
    if (!media || !media.closest('.image-grid')) return;

    event.preventDefault();
    collectItems();
    const index = items.findIndex((item) => item.media === media);
    if (index >= 0) show(index);
  });

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      collectItems();
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  collectItems();
})();
