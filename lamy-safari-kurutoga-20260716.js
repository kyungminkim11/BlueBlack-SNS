(() => {
  'use strict';

  const PRODUCT_ID = 'lamy-safari-kurutoga-inside';
  const PRODUCT_DATE = '2026-07-16';
  const PRODUCT_URL = 'https://www.lamy.com/ja-jp/lamy-safari-kurutoga';
  const hashtags = '#블루블랙펜샵 #라미 #LAMY #라미사파리 #사파리쿠루토가 #쿠루토가 #KURUTOGA #쿠루토가인사이드 #샤프 #샤프펜슬 #0점5샤프 #필기구 #문구추천 #펜추천 #문구스타그램 #펜스타그램 #stationery #mechanicalpencil';

  const colors = ['블랙', '비스타(투명)', '블루', '옐로우'];

  const variants = [
`✏️

라미 사파리의 디자인과 쿠루토가의 기능이 만났습니다!✨

라미 사파리 쿠루토가 인사이드 샤프는
사파리 특유의 인체공학적 그립과 상징적인 금속 클립에
필기할 때마다 샤프심이 조금씩 회전하는 쿠루토가 엔진을 더한 0.5mm 샤프입니다.

심이 한쪽으로만 닳는 편마모를 줄여
가늘고 또렷한 글씨를 비교적 일정하게 이어갈 수 있으며,
쿠루토가 KS 모델과 같은 계열의 엔진을 적용해 펜촉의 흔들림도 줄였습니다.📝

블랙, 비스타, 블루, 옐로우 4가지 컬러로 만나보실 수 있습니다.🎨

라미 사파리 쿠루토가 샤프를 블블샵에서 확인해 보세요!💙

${hashtags}`,
`🌀

쓰는 동안 심이 돌아가며 뾰족함을 유지하는
라미 사파리 쿠루토가 인사이드 샤프를 소개합니다!✏️

일반 샤프심은 필기하면서 한쪽이 비스듬히 닳아
글씨가 점점 굵어지거나 종이에 걸리는 느낌이 생길 수 있는데요.

쿠루토가 엔진은 종이에 닿을 때마다 심을 조금씩 회전시켜
선 굵기를 일정하게 유지하고, 또렷하고 안정적인 필기를 도와줍니다.

여기에 라미 사파리의 편안한 삼각 그립과 실용적인 금속 클립을 그대로 담아
익숙한 디자인과 새로운 필기 기능을 함께 즐길 수 있습니다.✨

${hashtags}`,
`📝

라미 사파리 쿠루토가 샤프의 포인트를 확인해 보세요!✨

✔ 필기할 때마다 심이 조금씩 회전하는 쿠루토가 엔진
✔ 심의 편마모를 줄여 가늘고 또렷한 글씨 유지
✔ 펜촉의 움직임을 줄인 KS 계열 엔진 적용
✔ 라미 사파리 특유의 인체공학적 그립
✔ 상징적이면서 실용적인 금속 클립
✔ 0.5mm 심 규격과 4가지 컬러

필기할 때 펜촉의 움직임이 크게 느껴지지 않도록 설계되어
공부, 업무 메모, 다이어리처럼 오래 집중해서 쓰는 장면에도 잘 어울립니다.✍️

${hashtags}`,
`🎨

라미 사파리 쿠루토가 인사이드,
어떤 컬러가 가장 마음에 드시나요?✏️

차분한 블랙과 내부 구조가 보이는 비스타,
선명한 블루와 사파리를 대표하는 경쾌한 옐로우까지
총 4가지 컬러로 구성되었습니다.

사파리 특유의 컬러와 바디 디자인은 그대로 유지하면서
0.5mm 쿠루토가 엔진을 더해 글씨의 선명도와 안정감을 높인 제품입니다.✨

전체 컬러와 실제 필기 모습을 사진으로 비교해 보세요!💙

${hashtags}`,
`📚

익숙한 라미 사파리 디자인에
심이 돌아가는 쿠루토가 기능을 더한 새로운 샤프!✏️

라미 사파리 쿠루토가 인사이드는
인체공학적 그립과 금속 클립, 0.5mm 쿠루토가 엔진을 갖춘 제품입니다.

심이 한쪽으로 닳는 현상을 줄여
가늘고 선명한 글씨를 안정적으로 이어갈 수 있어
수업 필기부터 업무 메모와 다이어리까지 폭넓게 활용하기 좋습니다.📝

블랙, 비스타, 블루, 옐로우 4가지 컬러를 블블샵에서 만나보세요!💙

${hashtags}`
  ];

  const product = {
    date: PRODUCT_DATE,
    weekday: '목',
    type: '제품 소개',
    title: '라미 사파리 쿠루토가 샤프',
    summary: '라미 사파리의 인체공학적 디자인에 심이 회전하는 0.5mm 쿠루토가 엔진을 결합한 샤프 제품 소개 일정입니다.',
    status: '라미 공식 제품 정보·기능·4색 구성 반영 완료',
    verification: 'LAMY 일본 공식 페이지 기준 사파리 그립·금속 클립·0.5mm·4색·쿠루토가 KS 계열 엔진·교체 지우개 규격 확인 완료 / 국내 판매가와 실제 입고 재고는 게시 직전 재확인',
    statusTone: 'verified',
    officialName: 'LAMY safari KURUTOGA inside',
    englishName: 'LAMY safari KURUTOGA inside 0.5 mm Mechanical Pencil',
    facts: [
      { label: '게시일', value: '2026년 7월 16일 목요일', verified: true },
      { label: '브랜드', value: 'LAMY × KURUTOGA', verified: true },
      { label: '공식 제품명', value: 'LAMY safari KURUTOGA inside', verified: true },
      { label: '제품 유형', value: '쿠루토가 엔진을 탑재한 샤프펜슬', verified: true },
      { label: '심 규격', value: '0.5mm', verified: true },
      { label: '컬러', value: colors.join(' · '), verified: true },
      { label: '핵심 구조', value: '필기할 때마다 심을 조금씩 회전시키는 쿠루토가 엔진', verified: true },
      { label: '엔진 특징', value: '쿠루토가 KS 모델과 같은 계열의 저흔들림 구조', verified: true },
      { label: '사파리 디자인', value: '인체공학적 그립 · 상징적이고 실용적인 금속 클립', verified: true },
      { label: '교체 지우개', value: '미쓰비시연필 샤프 지우개 S · 상품 코드 SKS', verified: true },
      { label: '공식 페이지', value: PRODUCT_URL, verified: true },
      { label: '게시 전 점검', value: '국내 판매가 · 실제 입고 컬러 · 색상별 재고 재확인', verified: false }
    ],
    officialImages: [
      {
        src: 'https://a.storyblok.com/f/302549/3840x1000/a9988f00e2/header_kurutoga_new_1920pxx500px.png',
        alt: '라미 사파리 쿠루토가 인사이드 4가지 컬러와 제품명',
        caption: 'LAMY safari KURUTOGA inside 공식 메인 비주얼',
        sourceUrl: PRODUCT_URL,
        sourceLabel: 'LAMY 일본 공식 제품 페이지',
        notice: '공식 제품 페이지의 제품 비주얼입니다.'
      },
      {
        src: 'https://a.storyblok.com/f/302549/5828x4298/5886105306/kurutoga_0213_underbar_48471_v2.jpg',
        alt: '라미 사파리 쿠루토가 인사이드 제품 디테일',
        caption: '사파리 바디와 쿠루토가 기능을 결합한 제품 디테일',
        sourceUrl: PRODUCT_URL,
        sourceLabel: 'LAMY 일본 공식 제품 페이지',
        notice: '그립과 금속 클립, 전체 실루엣 확인용 이미지입니다.'
      },
      {
        src: 'https://a.storyblok.com/f/302549/5084x6227/f2cc9340fa/kurutoga_260210_45875.jpg',
        alt: '라미 사파리 쿠루토가 인사이드 실제 필기 장면',
        caption: '0.5mm 쿠루토가 엔진을 활용한 필기 이미지',
        sourceUrl: PRODUCT_URL,
        sourceLabel: 'LAMY 일본 공식 제품 페이지',
        notice: '필기 자세와 사용 장면 확인용 이미지입니다.'
      },
      {
        src: 'https://a.storyblok.com/f/302549/400x500/e683ac67c6/kurutoga_a-02_400x500px.png',
        alt: '쿠루토가 엔진의 심 회전 기능 설명 이미지',
        caption: '심이 회전하며 편마모를 줄이는 쿠루토가 기능',
        sourceUrl: PRODUCT_URL,
        sourceLabel: 'LAMY 일본 공식 제품 페이지',
        notice: '쿠루토가 작동 원리를 설명하는 공식 이미지입니다.'
      }
    ],
    features: [
      '인기 있는 LAMY safari 디자인에 쿠루토가 기능을 탑재한 신규 설계 모델',
      '필기할 때마다 0.5mm 샤프심이 조금씩 회전해 한쪽으로 닳는 편마모를 줄임',
      '쿠루토가 KS 모델과 같은 계열의 엔진을 적용해 펜촉의 움직임과 흔들림을 억제',
      '사파리 특유의 인체공학적 삼각 그립과 상징적인 금속 클립 유지',
      '블랙·비스타·블루·옐로우 총 4가지 컬러 구성',
      '교체 지우개는 미쓰비시연필 샤프 지우개 S(SKS) 사용'
    ],
    pros: [
      '심 끝이 한쪽으로만 닳는 현상을 줄여 가늘고 또렷한 글씨를 비교적 일정하게 유지',
      '심 끝이 종이에 걸리는 느낌과 부러짐 위험을 줄여 안정적인 필기에 도움',
      '심 가루 발생과 종이 오염을 줄이는 데 도움이 되는 구조',
      '펜촉의 상하 움직임을 줄인 엔진으로 장시간 필기에도 집중하기 쉬움',
      '라미 사파리의 익숙한 그립과 컬러 디자인을 선호하는 사용자에게 접근성이 높음',
      '비스타 컬러는 내부 쿠루토가 구조가 보여 기능 설명 콘텐츠에 활용하기 좋음'
    ],
    cons: [
      '쿠루토가 엔진은 종이에 눌렀다 떼는 일반적인 필기 동작에서 작동하므로 사용 습관에 따라 회전 체감이 달라질 수 있음',
      '기존 LAMY safari 샤프용 교체 지우개와 호환되지 않으며 미쓰비시연필 SKS 규격을 사용해야 함',
      '국내 판매가와 입고 컬러, 색상별 재고는 게시 직전에 자사몰과 매장 실물로 최종 확인 필요'
    ],
    sources: [
      {
        name: 'LAMY 일본 공식 · LAMY safari KURUTOGA inside',
        url: PRODUCT_URL,
        kind: '공식 제품 페이지',
        use: '공식 제품명·사파리 디자인·0.5mm·4색·쿠루토가 엔진·KS 계열 구조·교체 지우개 규격 확인'
      }
    ],
    referencePosts: [],
    checklist: [
      '블랙·비스타·블루·옐로우 4색의 실제 입고 여부와 재고 확인',
      '비스타 컬러에서 내부 쿠루토가 엔진이 보이는 디테일 촬영',
      '일반 샤프와 글씨 굵기 변화를 비교할 수 있는 연속 필기 컷 촬영',
      '사파리 삼각 그립과 금속 클립 클로즈업 촬영',
      '심 회전 표시가 보이도록 짧은 영상 또는 연속 사진 촬영',
      '교체 지우개 SKS 규격과 실제 구성품 확인',
      '국내 판매가와 색상별 재고는 게시 직전 자사몰 기준 재확인'
    ],
    draft: { state: '라미 공식 정보 반영 완료 · SNS 원고 5개 등록', text: variants[0] }
  };

  window.BLUEBLACK_PRODUCT_CONTENT = Object.assign(window.BLUEBLACK_PRODUCT_CONTENT || {}, {
    [PRODUCT_ID]: {
      name: product.title,
      emoji: '✏️',
      category: '0.5mm 샤프·회전식 샤프심',
      intro: product.summary,
      description: 'LAMY 일본 공식 제품 페이지를 기준으로 사파리의 인체공학적 디자인과 쿠루토가 엔진의 특징을 반영했습니다.',
      feature: '0.5mm 쿠루토가 엔진·저흔들림 KS 계열 구조·사파리 삼각 그립·금속 클립·4가지 컬러',
      use: '글씨 굵기를 일정하게 유지하면서 공부·업무·다이어리 필기를 오래 이어가고 싶은 분',
      photo: '4색 단체 컷·비스타 내부 구조·삼각 그립·금속 클립·심 회전 표시·일반 샤프와 필기선 비교',
      notice: '국내 판매가와 실제 입고 컬러, 재고는 게시 직전 재확인',
      hashtags
    }
  });

  window.BLUEBLACK_COPY_VARIANTS = window.BLUEBLACK_COPY_VARIANTS || {};
  window.BLUEBLACK_COPY_VARIANTS[PRODUCT_ID] = variants;
  window.BLUEBLACK_DRAFTS = window.BLUEBLACK_DRAFTS || {};
  window.BLUEBLACK_DRAFTS[PRODUCT_ID] = variants[0];

  const previousParse = JSON.parse.bind(JSON);
  JSON.parse = function blueblackLamySafariKurutogaParse(text, reviver) {
    const data = previousParse(text, reviver);
    try {
      if (data && data.meta && Array.isArray(data.events) && data.products) {
        data.products[PRODUCT_ID] = Object.assign({}, data.products[PRODUCT_ID] || {}, product);

        const event = {
          date: PRODUCT_DATE,
          weekday: '목',
          type: '제품 소개',
          title: product.title,
          productId: PRODUCT_ID
        };

        const index = data.events.findIndex((item) =>
          item.productId === PRODUCT_ID ||
          /라미\s*사파리\s*쿠루토가|lamy\s*safari\s*kurutoga/i.test(`${item.title || ''} ${item.productId || ''}`)
        );

        if (index >= 0) data.events[index] = Object.assign({}, data.events[index], event);
        else data.events.push(event);

        data.events.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'ko'));
        data.meta.updatedAt = '2026.07.15';
      }
    } catch (error) {
      console.warn('라미 사파리 쿠루토가 샤프 일정을 반영하지 못했습니다.', error);
    }
    return data;
  };
})();
