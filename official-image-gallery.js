(() => {
  'use strict';

  const STYLE_ID = 'blueblack-official-gallery-style';
  const DIALOG_ID = 'blueblack-official-gallery';
  let items = [];
  let currentIndex = 0;

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .image-card-media{cursor:zoom-in}
      .image-card-media::after{
        content:'확대';position:absolute;right:10px;bottom:10px;z-index:2;
        padding:6px 9px;border:1px solid rgba(255,255,255,.28);border-radius:999px;
        color:#fff;background:rgba(3,10,15,.68);backdrop-filter:blur(10px);
        font-size:9px;font-weight:900;letter-spacing:.04em;opacity:0;transform:translateY(4px);
        transition:opacity .2s ease,transform .2s ease
      }
      .image-card:hover .image-card-media::after,.image-card-media:focus-visible::after{opacity:1;transform:none}
      .official-image-index{
        position:absolute;left:10px;top:10px;z-index:2;display:inline-flex;align-items:center;
        min-height:25px;padding:0 8px;border:1px solid rgba(255,255,255,.24);border-radius:999px;
        color:#fff;background:rgba(3,10,15,.62);backdrop-filter:blur(9px);
        font-size:9px;font-weight:900;letter-spacing:.04em;pointer-events:none
      }
      #${DIALOG_ID}{
        width:min(1180px,calc(100vw - 28px));height:min(880px,calc(100dvh - 28px));
        margin:auto;padding:0;border:1px solid rgba(255,255,255,.14);border-radius:22px;
        color:#f5f2ea;background:#050d13;box-shadow:0 40px 130px rgba(0,0,0,.72);overflow:hidden
      }
      #${DIALOG_ID}::backdrop{background:rgba(0,0,0,.82);backdrop-filter:blur(8px)}
      .official-gallery-shell{height:100%;display:grid;grid-template-rows:auto minmax(0,1fr) auto}
      .official-gallery-head,.official-gallery-foot{
        display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 16px;
        border-color:rgba(255,255,255,.09);background:rgba(8,20,28,.96)
      }
      .official-gallery-head{border-bottom:1px solid rgba(255,255,255,.09)}
      .official-gallery-foot{border-top:1px solid rgba(255,255,255,.09)}
      .official-gallery-title{min-width:0}
      .official-gallery-title strong{display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .official-gallery-title span{display:block;margin-top:4px;color:#768993;font-size:9px}
      .official-gallery-close,.official-gallery-nav{
        border:1px solid rgba(255,255,255,.12);border-radius:11px;color:#e5ecef;background:#10232e;
        font-size:11px;font-weight:900;transition:background .18s ease,border-color .18s ease
      }
      .official-gallery-close{min-width:74px;min-height:38px}
      .official-gallery-close:hover,.official-gallery-nav:hover{border-color:rgba(213,183,119,.34);background:#18313f}
      .official-gallery-stage{position:relative;min-height:0;display:grid;place-items:center;padding:18px;background:#02080c}
      .official-gallery-image{display:block;max-width:100%;max-height:100%;object-fit:contain}
      .official-gallery-nav{position:absolute;top:50%;width:44px;height:54px;transform:translateY(-50%);font-size:22px}
      .official-gallery-prev{left:14px}.official-gallery-next{right:14px}
      .official-gallery-caption{min-width:0;flex:1}
      .official-gallery-caption strong{display:block;font-size:11px;line-height:1.45}
      .official-gallery-caption span{display:block;margin-top:4px;color:#72858f;font-size:9px;line-height:1.5}
      .official-gallery-source{flex:0 0 auto;color:#d5b777;font-size:9px;font-weight:900;text-decoration:none}
      .official-gallery-source:hover{text-decoration:underline}
      @media(max-width:620px){
        #${DIALOG_ID}{width:100vw;height:100dvh;max-width:none;max-height:none;border:0;border-radius:0}
        .official-gallery-stage{padding:10px 8px 64px}
        .official-gallery-nav{top:auto;bottom:10px;transform:none;width:48%;height:44px}
        .official-gallery-prev{left:8px}.official-gallery-next{right:8px}
        .official-gallery-foot{align-items:flex-start;flex-direction:column}
        .image-card-media::after{opacity:1;transform:none}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureDialog() {
    let dialog = document.getElementById(DIALOG_ID);
    if (dialog) return dialog;

    dialog = document.createElement('dialog');
    dialog.id = DIALOG_ID;
    dialog.setAttribute('aria-label', '공식 이미지 확대 보기');
    dialog.innerHTML = `
      <div class="official-gallery-shell">
        <header class="official-gallery-head">
          <div class="official-gallery-title"><strong id="official-gallery-heading">공식 이미지</strong><span id="official-gallery-count"></span></div>
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
        if (!media.querySelector('.official-image-index')) {
          const badge = document.createElement('span');
          badge.className = 'official-image-index';
          badge.textContent = `${index + 1} / ${cards.length}`;
          media.appendChild(badge);
        } else {
          media.querySelector('.official-image-index').textContent = `${index + 1} / ${cards.length}`;
        }
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

  const observer = new MutationObserver(() => collectItems());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  ensureStyles();
  collectItems();
})();
