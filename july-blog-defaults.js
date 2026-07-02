(() => {
  'use strict';

  const STORAGE_KEY = 'blueblack-admin-blog-plan-v1';
  const VERSION_KEY = 'blueblack-july-blog-defaults-v1';
  if (localStorage.getItem(VERSION_KEY) === 'done') return;

  let data;
  try { data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
  catch { data = null; }

  if (!data || typeof data !== 'object') data = { policy: {}, months: {}, updatedAt: '' };
  if (!data.months || typeof data.months !== 'object') data.months = {};

  const current = Array.isArray(data.months['2026-07']) ? data.months['2026-07'] : [];
  const first = current[0] || {};
  const second = current[1] || {};

  data.months['2026-07'] = [
    {
      ...first,
      id: '2026-07-1',
      cycle: 1,
      targetWindow: '7월 1~2주차',
      date: first.date || '',
      title: '오퍼스88 전격 재입고',
      category: '브랜드·입점 소식',
      status: '초안 작성',
      memo: '최신 블로그 6개 말투를 참고한 전체 초안과 사진 15장 구성안을 아래에서 확인. 실제 재입고 모델·펜촉 옵션·재고는 게시 직전 최종 확인.',
      updatedAt: new Date().toLocaleString('ko-KR')
    },
    {
      ...second,
      id: '2026-07-2',
      cycle: 2,
      targetWindow: '7월 3~4주차',
      date: second.date || '',
      title: '여름철 만년필과 잉크 관리법',
      category: '관리·보관 가이드',
      status: '아이디어',
      memo: '7월 시즌성과 검색 유입을 고려한 1순위 추천. 관리자 화면의 주제 후보 30개 중 다른 주제로 바로 변경할 수 있습니다.',
      updatedAt: new Date().toLocaleString('ko-KR')
    }
  ];

  data.updatedAt = new Date().toLocaleString('ko-KR');
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  localStorage.setItem(VERSION_KEY, 'done');
})();
