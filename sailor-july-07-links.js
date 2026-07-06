(() => {
  'use strict';

  const PRODUCT_ID = 'sailor-new-arrivals-0707';

  const officialSources = [
    {
      name: '세일러 공식 · Celestial Outflow 21K',
      url: 'https://en.sailor.co.jp/product/11-8950/',
      kind: '공식 제품 페이지',
      use: 'Universe Series 설명, M82 모티프, 21K 제품 코드·닙·소재·크기·무게 확인'
    },
    {
      name: '세일러 공식 · Celestial Outflow 14K',
      url: 'https://en.sailor.co.jp/product/11-8951/',
      kind: '공식 제품 페이지',
      use: 'Universe Series 설명, 14K 제품 코드·닙·소재·크기·무게 확인'
    },
    {
      name: '세일러 일본 공식 · 프로피트 카주얼L 골드 트림',
      url: 'https://sailor.co.jp/product/11-0820/',
      kind: '공식 제품 페이지',
      use: '출시일·일본 공식가·4색·닙·충전 방식·PMMA 소재·크기·무게 확인'
    },
    {
      name: '세일러 일본 공식 · 프로피트 카주얼L 베이시스 골드 트림',
      url: 'https://sailor.co.jp/product/11-0822/',
      kind: '공식 제품 페이지',
      use: '출시일·일본 공식가·캡 링 차이·4색·닙·충전 방식·크기·무게 확인'
    },
    {
      name: '블루블랙 펜샵',
      url: 'https://blueblack.co.kr/',
      kind: '자사몰',
      use: '국내 판매가·실제 입고 색상·닙·재고·증정 행사 조건 최종 확인'
    }
  ];

  const externalPenShops = [
    {
      name: 'The Pen Company · Sailor 1911 Casual L Gold Trim',
      url: 'https://www.thepencompany.com/en-us/product/sailor-1911-casual-l-gold-trim/',
      kind: '해외 펜샵 상품 페이지',
      note: 'Muted Black 계열의 제품 설명·사진 구성 참고용. 가격과 구성은 해당 판매처 기준입니다.'
    },
    {
      name: 'Goulet Pens · Sailor 1911 Casual L Muted Black',
      url: 'https://www.gouletpens.com/products/sailor-1911-casual-l-fountain-pen-muted-black',
      kind: '해외 펜샵 상품 페이지',
      note: '카주얼L 골드 트림 계열의 상세 설명과 촬영 구도 참고용입니다.'
    },
    {
      name: 'Fontoplumo · Sailor 1911 Casual L Gold Trim',
      url: 'https://fontoplumo.nl/nl/products/sailor-1911-casual-l-gold-trim-fountain-pen',
      kind: '해외 펜샵 상품 페이지',
      note: '카주얼L 골드 트림의 외형·상품 설명 참고용입니다.'
    },
    {
      name: 'Fontoplumo · Sailor 1911 Casual L Basis Gold Trim',
      url: 'https://fontoplumo.nl/nl/products/sailor-1911-casual-l-basis-muted-black-gold-trim-fountain-pen',
      kind: '해외 펜샵 상품 페이지',
      note: '베이시스 골드 트림의 캡 링과 외형 비교 참고용입니다.'
    },
    {
      name: 'Atlas Stationers · Sailor 1911 Casual L Stable Gold Trim',
      url: 'https://www.atlasstationers.com/products/sailor-1911-casual-l-stable-fountain-pen-with-gold-trim-muted-black',
      kind: '해외 펜샵 상품 페이지',
      note: '판매처에서 Stable로 표기한 베이시스 계열 페이지입니다. 명칭은 세일러 공식 표기를 우선 확인하세요.'
    }
  ];

  const extraChecklist = [
    '공식 출처 카드는 회사에서 검토할 때 먼저 열어 제품 코드와 실제 입고표를 대조',
    '다른 펜샵의 가격·재고·구성은 참고만 하고 공식 사양으로 사용하지 않기',
    'The Pen Company·Goulet·Fontoplumo 페이지는 Muted Black 계열이므로 국내 입고 클리어 4색과 혼동하지 않기',
    'Atlas Stationers의 Stable 표기는 세일러 공식명 Basis와 다르므로 외부 문구에 그대로 사용하지 않기',
    '셀레스티얼 아웃플로우의 다른 펜샵 상세 글은 현재 검색 가능한 범위에서 뚜렷한 별도 게시물을 확인하지 못했으므로 공식 페이지를 기준으로 검토'
  ];

  const previousParse = JSON.parse.bind(JSON);
  JSON.parse = function sailorSourceLinksParse(text, reviver) {
    const data = previousParse(text, reviver);
    try {
      const product = data?.products?.[PRODUCT_ID];
      if (product) {
        product.sources = officialSources;
        product.referencePosts = externalPenShops;
        product.checklist = [...(product.checklist || []), ...extraChecklist];
        if (data.meta) data.meta.updatedAt = '2026.07.07';
      }
    } catch (error) {
      console.warn('세일러 출처 및 외부 펜샵 링크를 반영하지 못했습니다.', error);
    }
    return data;
  };
})();
