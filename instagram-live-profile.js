(() => {
  'use strict';

  const PROFILE_URL = 'https://www.instagram.com/blueblack_korea/';
  const EMBED_URL = 'https://www.instagram.com/blueblack_korea/embed/';
  let timer = null;

  function injectProfile() {
    if (location.hash.replace(/^#\//, '') !== 'instagram') return;
    const page = document.querySelector('.instagram-page');
    const hero = page?.querySelector('.instagram-hero');
    if (!page || !hero || page.querySelector('#instagram-live-profile')) return;

    const section = document.createElement('section');
    section.id = 'instagram-live-profile';
    section.className = 'instagram-live-profile';
    section.innerHTML = `
      <div class="instagram-live-head">
        <div>
          <p>LIVE PROFILE</p>
          <h2>Instagram 최근 게시물 바로 보기</h2>
          <span>@blueblack_korea 계정에서 공개된 최근 게시물을 Instagram 화면으로 불러옵니다.</span>
        </div>
        <a href="${PROFILE_URL}" target="_blank" rel="noopener noreferrer">Instagram에서 크게 보기 ↗</a>
      </div>
      <div class="instagram-live-frame-wrap">
        <iframe
          src="${EMBED_URL}"
          title="BlueBlack Korea Instagram 최근 게시물"
          loading="eager"
          allowtransparency="true"
          allowfullscreen
          scrolling="yes"
          referrerpolicy="strict-origin-when-cross-origin"></iframe>
        <div class="instagram-live-fallback">
          <strong>Instagram 화면이 표시되지 않나요?</strong>
          <span>Instagram 로그인 상태나 브라우저의 추적 방지 설정에 따라 미리보기가 막힐 수 있습니다.</span>
          <a href="${PROFILE_URL}" target="_blank" rel="noopener noreferrer">@blueblack_korea 열기 ↗</a>
        </div>
      </div>`;

    hero.insertAdjacentElement('afterend', section);
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(injectProfile, 80);
  }

  window.addEventListener('DOMContentLoaded', schedule, { once: true });
  window.addEventListener('hashchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();