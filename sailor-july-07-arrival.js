(() => {
  'use strict';

  const PRODUCT_ID = 'sailor-new-arrivals-0707';
  const EVENT_DATE = '2026-07-07';
  const TITLE = '세일러 신제품 입고 · 프로피트 캐주얼 잉크 증정';
  const DIRECT_ROUTE_KEY = 'blueblack-sailor-0707-route';

  const hashtagSets = [
    '#블루블랙펜샵 #세일러만년필 #세일러펜 #프로기어 #셀레스티얼아웃플로우 #프로피트캐주얼 #프로피트캐주얼라지 #투명만년필 #금장만년필 #만년필신제품 #만년필입고 #만년필추천 #일본만년필 #만년필잉크 #쓰리오잉크 #베이직잉크 #잉크증정 #문구스타그램 #펜스타그램 #만년필스타그램',
    '#블루블랙펜샵 #세일러 #세일러만년필 #프로기어 #프로기어만년필 #셀레스티얼아웃플로우 #21K만년필 #14K만년필 #금촉만년필 #만년필신제품 #신제품입고 #프로피트캐주얼 #투명만년필 #만년필추천 #고급만년필 #일본문구 #만년필수집 #펜스타그램 #문구스타그램 #만년필스타그램',
    '#블루블랙펜샵 #세일러만년필 #프로피트캐주얼 #프로피트캐주얼라지 #투명만년필 #베이시스만년필 #금장만년필 #데일리만년필 #입문만년필 #만년필추천 #만년필입고 #신제품입고 #만년필잉크 #쓰리오잉크 #베이직잉크 #잉크증정이벤트 #문구생활 #펜스타그램 #문구스타그램 #만년필스타그램',
    '#블루블랙펜샵 #세일러만년필 #프로피트캐주얼 #프로피트캐주얼라지 #만년필이벤트 #잉크증정 #쓰리오잉크 #베이직잉크 #만년필잉크 #만년필신제품 #세일러신제품 #프로기어 #셀레스티얼아웃플로우 #투명만년필 #만년필추천 #문구이벤트 #펜샵 #문구스타그램 #펜스타그램 #만년필스타그램',
    '#블루블랙펜샵 #세일러 #세일러만년필 #세일러신제품 #프로기어 #셀레스티얼아웃플로우 #프로피트캐주얼 #프로피트캐주얼라지 #투명만년필 #베이시스 #금촉만년필 #만년필입고 #신제품소식 #만년필추천 #잉크증정 #쓰리오베이직잉크 #만년필생활 #문구스타그램 #펜스타그램 #만년필스타그램'
  ];

  const variants = [
`✨ 세일러 신제품이 새롭게 입고되었습니다.

프로기어 셀레스티얼 아웃플로우 21K·14K부터,
투명한 바디가 매력적인 프로피트 캐주얼 라지 투명 만년필 GT,
차분하고 클래식한 프로피트 캐주얼 라지 베이시스 만년필 GT까지 만나보실 수 있습니다.

프로피트 캐주얼 제품을 구매하시면
제품 1개당 3·O 베이직 잉크 1병을 함께 증정해 드립니다. 🎁

이벤트는 2026년 7월 1일부터 9월 30일까지 진행되며,
증정품 재고 소진 시 조기 종료될 수 있습니다.
증정품은 교환 및 환불이 어렵습니다.

새롭게 입고된 세일러 만년필은
블루블랙 펜샵에서 직접 살펴보세요. :)

${hashtagSets[0]}`,
`🌌 세일러 프로기어 신제품이 입고되었습니다.

프로기어 셀레스티얼 아웃플로우를
21K와 14K 두 가지 모델로 만나보실 수 있습니다.

함께 입고된 제품은
프로피트 캐주얼 라지 투명 만년필 GT와
프로피트 캐주얼 라지 베이시스 만년필 GT입니다.

프로피트 캐주얼 제품 구매 시에는
제품 1개당 3·O 베이직 잉크 1병을 증정해 드립니다. 🎁

행사는 2026년 7월 1일부터 9월 30일까지 진행되며,
증정품 재고 소진 시 조기 종료될 수 있습니다.
증정품은 교환 및 환불이 어렵습니다.

세일러 신제품을 매장에서 천천히 살펴보세요.

${hashtagSets[1]}`,
`🖋️ 세일러 프로피트 캐주얼 라인업이 새롭게 입고되었습니다.

이번에 만나보실 수 있는 제품은
프로피트 캐주얼 라지 투명 만년필 GT와
프로피트 캐주얼 라지 베이시스 만년필 GT입니다.

속이 훤히 보이는 투명한 디자인과
캡 링을 더한 클래식한 베이시스 디자인 중에서
취향에 맞는 모델을 골라보실 수 있습니다.

프로피트 캐주얼 제품을 구매하시면
제품 1개당 3·O 베이직 잉크 1병을 증정해 드립니다. 🎁

이벤트는 2026년 7월 1일부터 9월 30일까지 진행되며,
증정품 재고 소진 시 조기 종료될 수 있습니다.
증정품은 교환 및 환불이 어렵습니다.

프로기어 셀레스티얼 아웃플로우 21K·14K도
함께 입고되었으니 매장에서 확인해 보세요. :)

${hashtagSets[2]}`,
`🎁 세일러 프로피트 캐주얼 구매 시 잉크를 함께 드립니다.

이벤트 기간 동안
프로피트 캐주얼 만년필을 구매하시면
제품 1개당 3·O 베이직 잉크 1병을 증정해 드립니다.

이번에 새롭게 입고된 제품은
프로피트 캐주얼 라지 투명 만년필 GT와
프로피트 캐주얼 라지 베이시스 만년필 GT입니다.

또한 세일러 프로기어 셀레스티얼 아웃플로우 21K·14K도
함께 만나보실 수 있습니다. 🌌

이벤트는 2026년 7월 1일부터 9월 30일까지 진행됩니다.
증정품 재고 소진 시 조기 종료될 수 있으며,
증정품은 교환 및 환불이 어렵습니다.

${hashtagSets[3]}`,
`💫 세일러 신제품이 여러 가지 입고되었습니다.

이번 입고에서는
프로기어 셀레스티얼 아웃플로우 21K·14K,
프로피트 캐주얼 라지 투명 만년필 GT,
프로피트 캐주얼 라지 베이시스 만년필 GT를
새롭게 만나보실 수 있습니다.

프로피트 캐주얼 라지 투명 GT의 깔끔한 투명 바디와
캡 링을 더한 베이시스 GT의 클래식한 구성을 비교해 보세요.

프로피트 캐주얼을 구매하시는 분께는
제품 1개당 3·O 베이직 잉크 1병을 함께 드립니다. 🎁

행사는 2026년 7월 1일부터 9월 30일까지 진행되며,
증정품 재고에 따라 조기 종료될 수 있습니다.
증정품은 교환 및 환불이 어렵습니다.

블루블랙 펜샵에서 실제 색감과 크기를 확인해 보세요. :)

${hashtagSets[4]}`
  ];

  const productContent = {
    name: TITLE,
    emoji: '🖋️',
    category: '만년필·입고·이벤트',
    intro: '세일러 신제품 3개 라인업의 입고와 프로피트 캐주얼 구매 사은품을 함께 안내하는 게시물입니다.',
    description: '세일러 공식 자료를 기준으로 프로피트 카주얼L 골드 트림과 베이시스 골드 트림의 출시일, 색상, 닙, 충전 방식, 소재와 크기를 정리했습니다. 셀레스티얼 아웃플로우는 전용 공식 공개 페이지를 확인하지 못해 21K·14K 프로기어 기본 모델의 공식 사양을 참고 정보로만 표시합니다.',
    feature: '프로피트 2종의 공식 사양과 차이점, 프로기어 21K·14K 기본 모델 참고 사양을 구분해 제공',
    use: '세일러 만년필의 새 입고 모델을 비교하거나 프로피트 캐주얼 구매를 고려하는 고객',
    photo: '전체 입고 제품 단체 컷, 프로기어 21K·14K 비교, 프로피트 캐주얼 투명·베이시스 비교, 닙·금장 디테일, 증정 잉크와 제품 조합, 행사 포스터',
    notice: '프로기어 셀레스티얼 아웃플로우의 실제 제품 코드, 색상 구성, 판매가와 입고 닙은 공급사 자료 또는 실물 입고표로 최종 확인해야 합니다. 일본 공식가는 국내 판매가가 아닙니다.',
    hashtags: hashtagSets[0]
  };

  const product = {
    date: EVENT_DATE,
    weekday: '화',
    type: '신제품 입고 · 이벤트',
    title: TITLE,
    summary: '세일러 프로기어 셀레스티얼 아웃플로우 21K·14K와 프로피트 카주얼L 골드 트림·베이시스 골드 트림의 공식 사양, 입고 소식과 잉크 증정 행사를 함께 안내합니다.',
    status: '공식 제품 정보 조사 완료',
    verification: '프로피트 2종 공식 확인 · 셀레스티얼 세부 확인 필요',
    statusTone: 'verified',
    officialName: '프로피트 카주얼L 골드 트림 / 프로피트 카주얼L 베이시스 골드 트림 외 프로기어 신제품',
    facts: [
      { label: '게시일', value: '2026년 7월 7일 화요일', verified: true },
      { label: '투명 모델 공식명', value: '프로피트 카주얼L 골드 트림 만년필', verified: true },
      { label: '투명 모델 일본 출시일', value: '2025년 10월 4일', verified: true },
      { label: '투명 모델 일본 공식가', value: '13,200엔(세금 포함) · 국내 판매가와 별도', verified: true },
      { label: '투명 모델 색상', value: '클리어 블랙 · 클리어 레드 · 클리어 블루 · 클리어 그린', verified: true },
      { label: '투명 모델 닙', value: '스테인리스 스틸 · 골드 IP · EF/F/MF/M/B', verified: true },
      { label: '투명 모델 충전 방식', value: '카트리지·컨버터 겸용', verified: true },
      { label: '투명 모델 소재·크기', value: 'PMMA 수지 · φ18×141mm · 19.8g', verified: true },
      { label: '베이시스 공식명', value: '프로피트 카주얼L 베이시스 골드 트림 만년필', verified: true },
      { label: '베이시스 일본 출시일', value: '2026년 5월 16일', verified: true },
      { label: '베이시스 일본 공식가', value: '16,500엔(세금 포함) · 국내 판매가와 별도', verified: true },
      { label: '베이시스 차이점', value: '카주얼L 골드 트림에 캡 링을 추가한 클래식한 구성', verified: true },
      { label: '베이시스 색상·닙', value: '클리어 4색 · 스테인리스 EF/F/MF/M/B', verified: true },
      { label: '베이시스 충전·크기', value: '카트리지·컨버터 겸용 · φ18×141mm · 19.8g', verified: true },
      { label: '프로기어 21K 기본 모델 참고', value: '21K 대형 닙 · φ18×129mm · 21.6g · 카트리지·컨버터 겸용', verified: true },
      { label: '프로기어 슬림 14K 기본 모델 참고', value: '14K 중형 닙 · φ17×124mm · 16.8g · 카트리지·컨버터 겸용', verified: true },
      { label: '셀레스티얼 아웃플로우 전용 사양', value: '공식 공개 페이지 미확인 · 실제 입고표와 공급사 자료 확인 필요', verified: false },
      { label: '행사 대상', value: '세일러 프로피트 캐주얼 구매 고객', verified: true },
      { label: '증정 혜택', value: '제품 1개당 3·O 베이직 잉크 1병', verified: true },
      { label: '행사 기간', value: '2026년 7월 1일 ~ 9월 30일', verified: true },
      { label: '행사 유의사항', value: '재고 소진 시 조기 종료 · 증정품 교환 및 환불 불가', verified: true }
    ],
    officialImages: [],
    features: [
      '프로피트 카주얼L 골드 트림은 투명한 PMMA 바디와 골드 IP 장식을 조합한 모델',
      '베이시스 골드 트림은 기존 카주얼L 골드 트림에 캡 링을 더해 장식성과 클래식한 인상을 강화',
      '두 프로피트 모델 모두 스테인리스 닙을 수작업으로 마감하며 EF부터 B까지 다섯 가지 굵기를 제공',
      '두 모델 모두 클리어 블랙·레드·블루·그린과 카트리지·컨버터 겸용 방식을 채택',
      '프로기어 21K와 프로기어 슬림 14K는 닙 크기, 본체 크기와 무게가 달라 비교 포인트가 분명함',
      '셀레스티얼 아웃플로우의 전용 색상·제품 코드·가격·닙 구성은 입고 자료 확인 후 확정'
    ],
    pros: [
      '투명 모델과 캡 링이 추가된 베이시스를 외형 차이로 쉽게 비교할 수 있음',
      'EF·F·MF·M·B로 선택 폭이 넓고 카트리지와 컨버터를 모두 사용할 수 있음',
      '공식 사양과 매장 확인이 필요한 항목을 구분해 잘못된 정보 게시 위험을 줄임',
      '프로기어 21K와 슬림 14K의 크기·무게 차이를 고객 설명에 활용하기 좋음'
    ],
    cons: [
      '일본 공식가는 참고 가격이며 블루블랙 펜샵 국내 판매가와 다를 수 있음',
      '셀레스티얼 아웃플로우 전용 공식 페이지가 확인되지 않아 디자인 설명을 단정하면 안 됨',
      '실제 입고 색상, 닙 굵기와 수량은 매장 재고표로 최종 확인 필요',
      '증정 가능한 3·O 베이직 잉크 색상과 선택 방식은 매장 운영 기준 확인 필요'
    ],
    sources: [
      { name: '세일러 공식 · 프로피트 카주얼L 골드 트림', url: 'https://sailor.co.jp/product/11-0820/', kind: '공식 제품 페이지', use: '출시일·일본 공식가·색상·닙·충전 방식·소재·크기 확인' },
      { name: '세일러 공식 · 프로피트 카주얼L 베이시스 골드 트림', url: 'https://sailor.co.jp/product/11-0822/', kind: '공식 제품 페이지', use: '출시일·캡 링 차이·일본 공식가·제품 사양 확인' },
      { name: '세일러 공식 · 프로페셔널기어 21K 기본 모델', url: 'https://sailor.co.jp/product/11-2036/', kind: '공식 제품 페이지', use: '21K 기본 모델의 닙·크기·무게 참고' },
      { name: '세일러 공식 · 프로페셔널기어 슬림 14K 기본 모델', url: 'https://sailor.co.jp/product/11-1221/', kind: '공식 제품 페이지', use: '14K 슬림 기본 모델의 닙·크기·무게 참고' }
    ],
    referencePosts: [],
    checklist: [
      '셀레스티얼 아웃플로우의 공급사 공식 자료 또는 제품 안내서 확보',
      '21K·14K 각각의 실제 제품 코드, 색상명과 입고 닙 확인',
      '프로피트 카주얼L 골드 트림과 베이시스의 국내 판매가·재고 확인',
      '실제 입고 색상이 공식 4색 전체인지 일부 색상인지 확인',
      '일본 공식가가 SNS 판매가처럼 보이지 않도록 참고 정보로만 사용',
      '프로피트 캐주얼 행사 적용 모델 범위 확인',
      '증정 가능한 3·O 베이직 잉크 색상과 고객 선택 방법 확인',
      '제품 1개당 잉크 1병, 9월 30일까지, 재고 소진 시 조기 종료 문구 유지',
      '증정품 교환·환불 불가 안내 포함',
      '사진 속 제품명·색상·닙과 본문 표기를 최종 대조'
    ],
    draft: { state: '원고 5개 작성 완료 · 공식 제품 정보 반영', text: variants[0] }
  };

  const eventData = {
    date: EVENT_DATE,
    weekday: '화',
    type: '신제품 입고 · 이벤트',
    title: TITLE,
    productId: PRODUCT_ID
  };

  window.BLUEBLACK_PRODUCT_CONTENT = Object.assign(window.BLUEBLACK_PRODUCT_CONTENT || {}, { [PRODUCT_ID]: productContent });
  window.BLUEBLACK_COPY_VARIANTS = window.BLUEBLACK_COPY_VARIANTS || {};
  window.BLUEBLACK_COPY_VARIANTS[PRODUCT_ID] = variants;
  window.BLUEBLACK_DRAFTS = window.BLUEBLACK_DRAFTS || {};
  window.BLUEBLACK_DRAFTS[PRODUCT_ID] = variants[0];

  const originalParse = JSON.parse.bind(JSON);
  JSON.parse = function blueblackScheduleParse(text, reviver) {
    const data = originalParse(text, reviver);
    try {
      if (data && data.meta && Array.isArray(data.events) && data.products && typeof data.products === 'object') {
        data.products[PRODUCT_ID] = product;
        if (!data.events.some((event) => event.productId === PRODUCT_ID)) data.events.push(eventData);
        data.events.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'ko'));
        data.meta.updatedAt = '2026.07.07';
      }
    } catch (error) {
      console.warn('7월 7일 세일러 SNS 일정을 추가하지 못했습니다.', error);
    }
    return data;
  };

  if (location.hash === `#/product/${PRODUCT_ID}`) {
    sessionStorage.setItem(DIRECT_ROUTE_KEY, location.hash);
  }

  const restoreTimer = window.setInterval(() => {
    const savedRoute = sessionStorage.getItem(DIRECT_ROUTE_KEY);
    if (!savedRoute || !document.querySelector('.workspace')) return;
    sessionStorage.removeItem(DIRECT_ROUTE_KEY);
    window.clearInterval(restoreTimer);
    if (location.hash !== savedRoute) location.hash = savedRoute;
  }, 120);

  window.setTimeout(() => window.clearInterval(restoreTimer), 15000);
})();
