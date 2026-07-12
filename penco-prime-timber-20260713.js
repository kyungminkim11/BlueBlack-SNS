(() => {
  'use strict';

  const PRODUCT_ID = 'penco-prime-timber-mechanical-pencil';
  const PRODUCT_DATE = '2026-07-13';
  const PRODUCT_URL = 'https://blueblack.co.kr/product/%ED%8E%9C%EC%BD%94-%ED%94%84%EB%9D%BC%EC%9E%84-%ED%8C%80%EB%B2%84-%EC%83%A4%ED%94%84/5390/category/1816/display/1/';
  const hashtags = '#블루블랙펜샵 #펜코 #PENCO #프라임팀버 #프라임팀버2점0 #2mm샤프 #샤프펜슬 #드로잉샤프 #목재샤프 #필기구 #문구추천 #펜추천 #문구스타그램 #펜스타그램 #stationery #mechanicalpencil';

  const colors = [
    '레드',
    '민트',
    '브라운',
    '블루',
    '옐로우',
    '화이트',
    '네이비 브라운 (+1,500원)',
    '레드 브라스 (+1,500원)',
    '블랙 브라스 (+1,500원)',
    '화이트 브라스 (+1,500원)'
  ];

  const variants = [
`✏️

펜코 프라임 팀버 2.0 샤프를 소개합니다!✨

나무 바디에 2.0mm 굵은 샤프심을 사용하는 제품으로,
필기뿐 아니라 스케치와 드로잉에도 활용하기 좋은 샤프인데요.

레드, 민트, 브라운, 블루, 옐로우, 화이트 기본 색상과
브라스 포인트를 더한 옵션까지 총 10가지로 준비되어 있습니다.🎨

함께 구성된 전용 샤프너로 굵어진 심 끝을 다시 다듬어 사용할 수 있는 점도 실용적인 포인트입니다.

펜코 프라임 팀버 샤프를 블블샵에서 확인해 보세요!💙

${hashtags}`,
`🎨

색상 고르는 재미가 있는 2.0mm 샤프,
펜코 프라임 팀버를 소개합니다.✏️

기본 색상은 레드, 민트, 브라운, 블루, 옐로우, 화이트 6종이며,
네이비 브라운·레드 브라스·블랙 브라스·화이트 브라스 옵션도 함께 준비되어 있습니다.

브라스 옵션은 자사몰 기준 각 1,500원의 추가금이 적용됩니다.

나무 바디의 자연스러운 질감과 굵은 2.0mm 심이 만나
메모부터 스케치까지 다양한 장면에서 활용하기 좋은 제품입니다.

원하는 색상의 프라임 팀버를 블블샵에서 골라보세요!💙

${hashtags}`,
`📝

펜코 프라임 팀버 2.0 샤프의 포인트를 확인해 보세요!✨

✔ 2.0mm 굵은 샤프심 사용
✔ 자연스러운 질감의 나무 바디
✔ 필기·스케치·드로잉에 활용 가능
✔ 심 끝을 다듬을 수 있는 전용 샤프너 구성
✔ 기본 6색과 추가금 옵션 4종, 총 10가지 색상

연필처럼 편안한 분위기와 샤프의 편리함을 함께 갖춘 제품으로,
책상 위에서 자주 꺼내 쓰기 좋은 필기구입니다.

펜코 프라임 팀버 샤프를 블블샵에서 살펴보세요!💙

${hashtags}`,
`🪵

연필의 분위기는 그대로,
심은 교체해서 오래 사용할 수 있도록.

펜코 프라임 팀버는 나무 바디와 2.0mm 굵은 심을 조합한 샤프입니다.✏️

일반적인 가는 샤프보다 선이 굵게 표현되어
아이디어 스케치, 도면 메모, 다이어리 드로잉처럼
선의 표정이 필요한 작업에 활용하기 좋습니다.

심이 무뎌졌을 때는 함께 구성된 전용 샤프너로 다시 다듬어 사용할 수 있습니다.

색상별 바디와 브라스 디테일까지 사진으로 확인해 보세요!💙

${hashtags}`,
`📚

펜코 프라임 팀버 2.0 샤프가 준비되었습니다!✨

2.0mm 굵은 심과 나무 바디,
전용 샤프너를 함께 구성한 펜코의 디자인 샤프입니다.

기본 6색과 브라스 포인트 옵션 4종으로 구성되어
취향과 책상 분위기에 맞춰 선택할 수 있습니다.🎨

필기부터 스케치까지 폭넓게 활용할 수 있는
펜코 프라임 팀버 샤프를 블블샵에서 확인해 주세요!💙

${hashtags}`
  ];

  const product = {
    date: PRODUCT_DATE,
    weekday: '월',
    type: '제품 소개',
    title: '펜코 프라임 팀버 샤프',
    summary: '나무 바디와 2.0mm 굵은 심, 전용 샤프너를 구성한 펜코 프라임 팀버 샤프 제품 소개 일정입니다.',
    status: '제품 이미지·상세페이지·색상 반영 완료',
    verification: '사용자 제공 자사몰 자료 기준 2.0mm 규격·전용 샤프너·10개 색상 옵션 확인 완료 / 판매가와 재고는 게시 직전 재확인',
    statusTone: 'verified',
    officialName: '펜코 프라임 팀버 샤프',
    englishName: 'PENCO Prime Timber 2.0 Mechanical Pencil',
    facts: [
      { label: '게시일', value: '2026년 7월 13일 월요일', verified: true },
      { label: '브랜드', value: 'PENCO', verified: true },
      { label: '자사몰 상품명', value: '펜코 프라임 팀버 샤프', verified: true },
      { label: '심 규격', value: '2.0mm', verified: true },
      { label: '기본 색상', value: '레드 · 민트 · 브라운 · 블루 · 옐로우 · 화이트', verified: true },
      { label: '추가금 옵션', value: '네이비 브라운 · 레드 브라스 · 블랙 브라스 · 화이트 브라스 (각 +1,500원)', verified: true },
      { label: '전체 옵션', value: `${colors.length}종 · 자사몰 옵션명 그대로 반영`, verified: true },
      { label: '구성 특징', value: '2.0mm 샤프와 전용 샤프너 구성', verified: true },
      { label: '활용', value: '일상 필기 · 스케치 · 드로잉 · 도면 메모', verified: true },
      { label: '상품 페이지', value: PRODUCT_URL, verified: true },
      { label: '게시 전 점검', value: '기본 판매가와 색상별 재고 재확인', verified: false }
    ],
    officialImages: [
      {
        src: './assets/penco-prime-timber/hero.svg?v=20260712-1',
        alt: '노트 위에 놓인 펜코 프라임 팀버 2.0 샤프 여러 색상과 전용 샤프너',
        caption: '펜코 프라임 팀버 제품 이미지',
        sourceUrl: PRODUCT_URL,
        sourceLabel: '블루블랙 자사몰 상품 페이지',
        notice: '사용자가 제공한 제품 이미지를 내부 검수용으로 등록했습니다.'
      },
      {
        src: './assets/penco-prime-timber/detail-overview.svg?v=20260712-1',
        alt: '펜코 프라임 팀버 샤프의 색상, 사용 장면, 전용 샤프너와 제품 특징을 설명하는 상세페이지',
        caption: '제품 상세페이지 전체 구성',
        sourceUrl: PRODUCT_URL,
        sourceLabel: '블루블랙 자사몰 상세페이지',
        notice: '색상과 2.0mm 규격, 전용 샤프너 사용 장면을 확인할 수 있습니다.'
      }
    ],
    features: [
      '2.0mm 굵은 심을 사용하는 샤프펜슬',
      '나무 바디 특유의 질감과 펜코의 빈티지한 그래픽',
      '필기뿐 아니라 스케치·드로잉·도면 메모에 활용 가능',
      '굵어진 심 끝을 다듬을 수 있는 전용 샤프너 구성',
      '기본 6색과 추가금 옵션 4종을 포함한 총 10가지 색상 옵션',
      '브라스 옵션은 자사몰 기준 각 1,500원 추가'
    ],
    pros: [
      '연필과 비슷한 친숙한 외형에 심 교체 방식의 편리함을 더함',
      '2.0mm 심으로 선의 굵기와 농담을 표현하기 좋음',
      '색상 선택지가 많아 제품 단체 컷과 컬러 비교 콘텐츠에 적합',
      '전용 샤프너 사용 장면을 짧은 영상 소재로 활용 가능'
    ],
    cons: [
      '가는 글씨 위주의 필기에는 일반 0.5mm 샤프보다 굵게 느껴질 수 있음',
      '브라스 옵션 4종은 기본 색상보다 각 1,500원 추가됨',
      '자사몰의 “네이비 브라운” 옵션명은 게시물에도 임의 수정하지 않고 그대로 사용',
      '판매가와 색상별 재고는 게시 직전 다시 확인하기'
    ],
    sources: [
      {
        name: '블루블랙 자사몰 · 펜코 프라임 팀버 샤프',
        url: PRODUCT_URL,
        kind: '자사몰 상품 페이지',
        use: '상품명·2.0mm 규격·색상 옵션·추가금·상세페이지 이미지 확인'
      }
    ],
    referencePosts: [],
    checklist: [
      '기본 6색과 추가금 옵션 4종의 실제 입고 재고 확인',
      '“네이비 브라운” 옵션명을 자사몰 표기와 다시 대조',
      '2.0mm 심과 전용 샤프너 구성품 촬영',
      '기본 색상과 브라스 옵션의 금속 디테일 비교 촬영',
      '굵은 선·가느다란 선을 비교할 수 있도록 심을 깎기 전후 촬영',
      'SNS 본문에는 기본 판매가를 게시 직전 확인한 뒤에만 기재'
    ],
    draft: { state: '사용자 제공 자료 반영 완료 · SNS 원고 5개 업데이트', text: variants[0] }
  };

  window.BLUEBLACK_PRODUCT_CONTENT = Object.assign(window.BLUEBLACK_PRODUCT_CONTENT || {}, {
    [PRODUCT_ID]: {
      name: product.title,
      emoji: '✏️',
      category: '2.0mm 샤프·드로잉 필기구',
      intro: product.summary,
      description: '사용자가 제공한 자사몰 제품 이미지와 상세페이지, 색상 옵션표를 기준으로 주요 제품 정보를 반영했습니다.',
      feature: '2.0mm 굵은 심·나무 바디·전용 샤프너·총 10가지 색상',
      use: '일상 필기부터 스케치와 드로잉까지 활용할 디자인 샤프를 찾는 분',
      photo: '전체 색상 단체 컷·기본/브라스 옵션 비교·나무 바디 질감·전용 샤프너 사용·필기선 비교',
      notice: '색상별 재고와 기본 판매가는 게시 직전 자사몰 기준 재확인',
      hashtags
    }
  });

  window.BLUEBLACK_COPY_VARIANTS = window.BLUEBLACK_COPY_VARIANTS || {};
  window.BLUEBLACK_COPY_VARIANTS[PRODUCT_ID] = variants;
  window.BLUEBLACK_DRAFTS = window.BLUEBLACK_DRAFTS || {};
  window.BLUEBLACK_DRAFTS[PRODUCT_ID] = variants[0];

  const previousParse = JSON.parse.bind(JSON);
  JSON.parse = function blueblackPencoPrimeTimberParse(text, reviver) {
    const data = previousParse(text, reviver);
    try {
      if (data && data.meta && Array.isArray(data.events) && data.products) {
        data.products[PRODUCT_ID] = Object.assign({}, data.products[PRODUCT_ID] || {}, product);

        const event = {
          date: PRODUCT_DATE,
          weekday: '월',
          type: '제품 소개',
          title: product.title,
          productId: PRODUCT_ID
        };

        const index = data.events.findIndex((item) =>
          item.productId === PRODUCT_ID ||
          /펜코\s*프라임\s*팀버|penco\s*prime\s*timber/i.test(`${item.title || ''} ${item.productId || ''}`)
        );

        if (index >= 0) data.events[index] = Object.assign({}, data.events[index], event);
        else data.events.push(event);

        data.events.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'ko'));
        data.meta.updatedAt = '2026.07.12';
      }
    } catch (error) {
      console.warn('펜코 프라임 팀버 샤프 일정을 반영하지 못했습니다.', error);
    }
    return data;
  };
})();