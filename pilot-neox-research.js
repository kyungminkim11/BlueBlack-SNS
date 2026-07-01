(() => {
  'use strict';

  const configs = window.BLUEBLACK_JULY_PRODUCTS || [];
  const config = configs.find((item) => item.key === 'pilot-neox-wakaru');
  if (!config) return;

  const query = encodeURIComponent('파이롯트 네옥스 그래파이트 WAKARU 한정 샤프심');
  const baseQuery = encodeURIComponent('파이롯트 네옥스 그래파이트 샤프심 후기');
  const japaneseQuery = encodeURIComponent('パイロット ネオックス・グラファイト 限定 WAKARU レビュー');

  config.checkedAt = '2026.07.01';
  config.verificationBadge = '공식 확인 + 리뷰 탐색';
  config.sourceTitle = '공식·리뷰·판매 자료';

  const extraFacts = [
    ['리뷰 현황', '한정 패키지 공개 초기 · 장기 사용 후기는 아직 제한적'],
    ['비교 추천', '기존 네옥스 심과 동일 규격으로 필기감·농도·번짐 비교'],
    ['촬영 우선순위', '12종 배열 → 스티커 → 뒷면 규격 → 필기 비교 순서']
  ];

  const labels = new Set((config.facts || []).map(([label]) => label));
  config.facts = [...(config.facts || []), ...extraFacts.filter(([label]) => !labels.has(label))];

  config.researchGuide = {
    title: '내일 게시 전 직접 확인할 것',
    summary: '한정판 자체의 공개 사용 후기가 아직 많지 않으므로, 공식 정보와 매장 실물 테스트를 함께 확인하는 편이 안전합니다.',
    checks: [
      '실제 입고된 0.3mm·0.5mm 경도와 패키지 종류를 모두 촬영하기',
      '기존 네옥스 샤프심과 같은 샤프로 농도·부드러움·번짐 비교하기',
      '힘을 동일하게 주고 선을 그어 부러짐과 가루 발생 정도 확인하기',
      '지우개로 지운 뒤 잔흔과 종이 눌림을 가까이 촬영하기',
      '동봉 스티커 수량, 크기, 접착감과 꾸민 뒤 케이스 사용성을 확인하기'
    ]
  };

  config.sources = [
    ['파이롯트 공식 한정 제품 페이지', 'https://www.pilot.co.jp/promotion/neox-graphite_limited/', '12종 라인업·WAKARU 스티커·공식 특징 확인', '공식'],
    ['블루블랙 자사몰', 'https://blueblack.co.kr/', '국내 입고 옵션·가격·게시일 재고 최종 확인', '판매 확인'],
    ['네이버 블로그 후기 검색', `https://search.naver.com/search.naver?where=blog&query=${baseQuery}`, '국내 사용자 필기감·농도·번짐 후기를 찾아보는 검색 링크', '후기 검색'],
    ['YouTube 영상 리뷰 검색', `https://www.youtube.com/results?search_query=${query}`, '샤프심 필기 비교와 패키지 실물 영상을 찾아보는 검색 링크', '영상 검색'],
    ['네이버 쇼핑 가격·구매후기 검색', `https://search.shopping.naver.com/search/all?query=${query}`, '국내 판매처·가격·구매 후기 유무 확인', '가격·후기'],
    ['일본 현지 리뷰 검색', `https://www.google.com/search?q=${japaneseQuery}`, '일본어 사용 후기와 현지 판매 정보를 찾아보는 검색 링크', '일본 반응']
  ];
})();
