(() => {
  'use strict';

  const storageKey = 'blueblack-admin-blog-plan-v1';
  const versionKey = 'blueblack-july-blog-defaults-v2';

  if (localStorage.getItem(versionKey) !== 'done') {
    let data;
    try { data = JSON.parse(localStorage.getItem(storageKey) || 'null'); }
    catch { data = null; }
    if (!data || typeof data !== 'object') data = { policy: {}, months: {}, updatedAt: '' };
    if (!data.months || typeof data.months !== 'object') data.months = {};

    const current = Array.isArray(data.months['2026-07']) ? data.months['2026-07'] : [];
    const first = current[0] || {};
    const second = current[1] || {};
    const now = new Date().toLocaleString('ko-KR');

    data.months['2026-07'] = [
      {
        ...first,
        id: '2026-07-1', cycle: 1, targetWindow: '7월 1~2주차', date: first.date || '',
        title: '오퍼스88 전격 재입고', category: '브랜드·입점 소식', status: '초안 작성',
        memo: '최신 블로그 6개 전체 본문을 분석한 약 2,200자 초안과 사진 22장 구성안을 아래에서 확인. 실제 재입고 모델·펜촉 옵션·재고는 게시 직전 최종 확인.', updatedAt: now
      },
      {
        ...second,
        id: '2026-07-2', cycle: 2, targetWindow: '7월 3~4주차', date: second.date || '',
        title: '여름철 만년필과 잉크 관리법', category: '관리·보관 가이드', status: '아이디어',
        memo: '7월 시즌성과 검색 유입을 고려한 1순위 추천. 관리자 화면의 주제 후보 30개 중 다른 주제로 바로 변경할 수 있습니다.', updatedAt: now
      }
    ];

    data.updatedAt = now;
    localStorage.setItem(storageKey, JSON.stringify(data));
    localStorage.setItem(versionKey, 'done');
  }

  window.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('script[data-july-blog-enhanced]')) return;
    const script = document.createElement('script');
    script.src = './july-blog-enhanced.js?v=1';
    script.dataset.julyBlogEnhanced = 'true';
    script.async = true;
    document.head.appendChild(script);
  }, { once: true });

  const NativeObserver = window.MutationObserver;
  let restored = false;

  window.MutationObserver = class AdminGuardedObserver extends NativeObserver {
    constructor(callback) {
      super((records, observer) => {
        const route = location.hash.replace(/^#\//, '');
        if (route === 'admin' && document.querySelector('.admin-page')) return;
        callback(records, observer);
      });
      if (!restored) {
        restored = true;
        queueMicrotask(() => { window.MutationObserver = NativeObserver; });
      }
    }
  };
})();
