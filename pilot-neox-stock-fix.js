(() => {
  'use strict';

  const configs = window.BLUEBLACK_JULY_PRODUCTS || [];
  const copyStore = window.BLUEBLACK_COPY_VARIANTS = window.BLUEBLACK_COPY_VARIANTS || {};
  const contentStore = window.BLUEBLACK_PRODUCT_CONTENT = window.BLUEBLACK_PRODUCT_CONTENT || {};
  const config = configs.find((item) => item.key === 'pilot-neox-wakaru');
  if (!config) return;

  config.content = {
    ...(config.content || {}),
    intro: '네옥스 그래파이트의 필기 성능에 WAKARU의 오리지널 스티커와 한정 패키지를 더한 샤프심입니다. 블루블랙에는 0.5mm 규격 6종이 입고되었습니다.',
    description: '파이롯트 공식 전체 라인업은 0.3mm 6종과 0.5mm 6종으로 구성되지만, 블루블랙 펜샵에는 현재 0.5mm 규격의 6가지 패키지만 입고되었습니다. 심경과 경도는 케이스 뒷면에서 확인할 수 있으며, WAKARU 감수 오리지널 스티커로 케이스를 직접 꾸밀 수 있습니다.',
    feature: '블루블랙 입고 0.5mm 6종 패키지, WAKARU 오리지널 스티커, 케이스 뒷면 심경·경도 표기',
    photo: '0.5mm 6종 패키지 비교, 동봉 스티커, 꾸미기 전후, 케이스 뒷면 규격, 실제 필기 농도',
    notice: '블루블랙 판매 제품은 0.5mm 규격 6종입니다. 패키지별 경도와 재고는 게시 직전에 다시 확인하세요.'
  };

  config.facts = [
    ['업로드 예정일', '2026.07.02'],
    ['블루블랙 입고', '0.5mm 규격 · 총 6가지 패키지'],
    ['공식 전체 라인업', '0.3mm 6종 + 0.5mm 6종 · 총 12종'],
    ['구성', 'WAKARU 감수 오리지널 데코레이션 스티커'],
    ['표기 방식', '심경과 경도는 케이스 뒷면에서 확인'],
    ['공식 특징', '잘 부러지지 않고 진하며 부드러운 필기감'],
    ['제품 성격', '2026년 수량 한정 패키지'],
    ['해시태그 기준', '관련 태그 20개'],
    ['브랜드 공식 계정', '게시 전 PILOT 공식 인스타그램 계정 확인 필수']
  ];

  config.caution = '블루블랙에는 0.5mm 규격 6종만 입고되었습니다. 공식 전체 라인업인 12종 또는 0.3mm가 매장에서 판매되는 것처럼 작성하지 마세요.';

  const fixDraft = (draft) => String(draft || '')
    .replace(/0\.3mm와 0\.5mm 두 가지 규격으로 구성되며,\s*규격별 6가지씩 총 12가지 패키지를/g, '블루블랙에는 0.5mm 규격으로 입고되었으며,\n총 6가지 패키지를')
    .replace(/0\.3mm와 0\.5mm 규격으로 만나볼 수 있으며,\s*규격별 6가지씩 총 12가지 디자인이 준비되어 있답니다\./g, '블루블랙에는 0.5mm 규격으로 입고되었으며,\n총 6가지 디자인이 준비되어 있답니다.')
    .replace('✔ 0.3mm · 0.5mm 두 가지 규격', '✔ 블루블랙 입고 규격 0.5mm')
    .replace('✔ 규격별 6종, 총 12가지 패키지', '✔ 0.5mm 총 6가지 패키지')
    .replace('0.3mm와 0.5mm 샤프를 자주 사용하는 분,', '0.5mm 샤프를 자주 사용하는 분,')
    .replace(/총 12가지 패키지/g, '총 6가지 패키지')
    .replace('0.3mm·0.5mm 두 가지 규격과 총 6가지 패키지,', '0.5mm 규격과 총 6가지 패키지,')
    .replace(/#03mm샤프심/g, '#샤프심케이스');

  const variants = Array.isArray(config.variants)
    ? config.variants.map(fixDraft)
    : ((config.ids || []).map((id) => copyStore[id]).find(Array.isArray) || []).map(fixDraft);

  config.variants = variants;
  (config.ids || []).forEach((id) => {
    copyStore[id] = variants;
    contentStore[id] = config.content;
  });
})();
