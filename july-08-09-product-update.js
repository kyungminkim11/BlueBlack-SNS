(() => {
  'use strict';

  const INK_ID = 'three-o-basic-ink-new-colors-0708';
  const MONTE_ID = 'monteverde-calibra-4in1';
  const INK_DATE = '2026-07-08';
  const MONTE_DATE = '2026-07-09';

  const inkTags = '#블루블랙펜샵 #쓰리오잉크 #쓰리오베이직잉크 #3Oink #3OBasicInk #만년필잉크 #병잉크 #30ml잉크 #잉크신색상 #Crimson #Watermelon #Papaya #Sandstone #Mocha #잉크발색 #잉크추천 #문구스타그램 #잉크스타그램 #펜스타그램 #fountainpenink';
  const monteTags = '#블루블랙펜샵 #몬테베르데 #몬테베르데카리브라 #카리브라4in1 #Monteverde #MonteverdeUSA #Calibra #4in1DeskSet #데스크세트 #멀티필기구 #필기구세트 #데스크용품 #업무용필기구 #문구추천 #펜추천 #문구스타그램 #펜스타그램 #필기생활 #stationery #writingtools';

  const inkVariants = [
`🎨

쓰리오 베이직 잉크에 신규 색상 5종이 추가되었습니다!✨

이번에 새롭게 만나보실 수 있는 색상은 크림슨, 워터멜론, 파파야, 샌드스톤, 모카입니다.
선명한 레드와 코랄부터 차분한 베이지·브라운까지 따뜻한 계열을 한 번에 비교해 보실 수 있는데요.🌈

❤️ Crimson
🍉 Watermelon
🧡 Papaya
🏜️ Sandstone
☕ Mocha

각 색상은 30ml 병으로 구성되어 있으며, 실제 발색은 종이와 펜촉, 조명에 따라 조금씩 다르게 보일 수 있습니다.✍️

새롭게 더해진 다섯 가지 색을 블루블랙 펜샵에서 직접 비교해 보세요~!💙

${inkTags}`,
`🍉

쓰리오 베이직 잉크의 새로운 다섯 색상이 추가되었습니다!✨

크림슨의 깊은 붉은빛, 워터멜론의 산뜻한 코랄 핑크, 파파야의 또렷한 오렌지부터
샌드스톤과 모카의 차분한 뉴트럴 톤까지 서로 다른 분위기를 골라보실 수 있답니다.🎨

❤️ Crimson
🩷 Watermelon
🧡 Papaya
🤎 Sandstone
☕ Mocha

30ml 용량으로 여러 색을 함께 즐기기 좋으며, 같은 잉크도 사용하는 종이와 펜촉에 따라 발색과 농담이 달라질 수 있어요.🖋️

따뜻한 색감으로 채워진 신규 컬러 5종을 블블샵에서 만나보세요~!🌈

${inkTags}`,
`🖋️

쓰리오 베이직 잉크 신규 색상 5종을 소개합니다!✨

새롭게 추가된 컬러는 Crimson, Watermelon, Papaya, Sandstone, Mocha이며
모두 30ml 병잉크로 만나보실 수 있습니다.📚

🔴 붉은 계열: Crimson
🩷 코랄·핑크 계열: Watermelon
🟠 오렌지 계열: Papaya
🟤 베이지·브라운 계열: Sandstone, Mocha

밝고 선명한 색부터 차분한 색까지 선택 폭이 넓어졌는데요.
화면과 실제 종이 위의 발색은 다를 수 있으니 시필 색상도 함께 비교해 주세요.✍️

다섯 가지 신규 컬러를 블루블랙 펜샵에서 만나보세요~!💙

${inkTags}`,
`📖

따뜻한 색의 잉크로 필사와 기록에 새로운 분위기를 더해보세요!✨

쓰리오 베이직 잉크에 크림슨, 워터멜론, 파파야, 샌드스톤, 모카 5가지 색상이 새롭게 추가되었습니다.
짧은 메모에는 선명한 색을, 긴 글에는 차분한 뉴트럴 컬러를 골라 사용할 수 있는데요.🎨

각 색상은 30ml 병으로 구성되어 여러 색을 번갈아 사용하기에도 좋습니다.🖋️

잉크의 실제 색은 종이의 색과 재질, 펜촉 굵기와 조명에 따라 달라질 수 있으니 발색표를 함께 비교해 주세요.👀

나의 기록에 어울리는 신규 컬러를 블블샵에서 만나보세요~!💙

${inkTags}`,
`🎨

쓰리오 베이직 잉크 신규 색상 5종이 추가되었습니다!✨

❤️ Crimson
🍉 Watermelon
🧡 Papaya
🏜️ Sandstone
☕ Mocha

선명한 레드·오렌지부터 차분한 베이지·브라운까지,
30ml 병잉크로 취향에 맞는 색을 골라보세요.🖋️

새로운 다섯 색상을 블루블랙 펜샵에서 만나보세요~!💙

${inkTags}`
  ];

  const monteVariants = [
`🧰

몬테베르데 카리브라 4-in-1 데스크 세트를 소개합니다!✨

책상 위에서 필요한 네 가지 필기 기능을 하나의 세트로 구성해
상황에 따라 필요한 도구를 바꿔 사용할 수 있는 제품인데요.🖊️

여러 필기구를 각각 꺼내 두지 않아도 한 자리에서 정리해 사용할 수 있어
업무 메모와 서명, 간단한 기록이 많은 데스크 환경에 잘 어울립니다.📋

제품을 살펴보실 때에는 패키지에 표시된 구성과 각 기능의 작동 방식,
사용 가능한 리필 규격을 함께 확인해 주세요.🔍

실용적인 데스크 필기구를 찾고 계셨다면 블루블랙 펜샵에서 만나보세요~!💚

@monteverdeUSA

${monteTags}`,
`🖤

몬테베르데 카리브라 4-in-1 데스크 세트를 소개합니다!✨

여러 개의 필기구를 따로 늘어놓는 대신
네 가지 기능을 하나의 세트 안에 담아 책상 위를 간결하게 정리할 수 있는데요.🧰

필요한 순간에 기능을 바꿔 사용하는 구조라
업무 공간이나 서재처럼 다양한 기록이 이어지는 자리에서 활용하기 좋습니다.🖊️

세트 전체의 실루엣과 각 부분의 디테일,
기능을 전환하는 방식까지 직접 살펴보세요.👀

책상 위에 실용적인 포인트를 더해줄 카리브라 4-in-1을 블블샵에서 만나보세요~!💚

@monteverdeUSA

${monteTags}`,
`🔍

몬테베르데 카리브라 4-in-1 데스크 세트의 구성을 살펴보세요!✨

✔ 하나의 데스크 세트
✔ 네 가지 필기 기능
✔ 기능을 바꿔가며 사용하는 멀티 구성
✔ 업무와 일상 기록에 활용하기 좋은 형태

구매 전에는 실제 패키지에 표시된 네 가지 구성과
각 기능에 맞는 리필 규격을 확인하시는 것이 중요한데요.🧰

세트 전체와 작동 방식, 손에 들었을 때의 크기를 비교하면
나의 사용 환경에 잘 맞는지 더욱 쉽게 판단할 수 있습니다.🖊️

여러 필기 도구를 한 번에 정리하고 싶다면 블루블랙 펜샵에서 확인해 보세요~!💚

@monteverdeUSA

${monteTags}`,
`📋

업무 중 사용하는 필기 도구가 자주 바뀐다면
몬테베르데 카리브라 4-in-1 데스크 세트를 살펴보세요!✨

서로 다른 상황에서 필요한 기능을 한 세트 안에서 바꿔 사용할 수 있도록 구성된 제품입니다.🖊️

여러 자루를 따로 보관하는 번거로움을 줄이고
책상 위 필기 도구를 한곳에 정리하고 싶은 분께 잘 어울리는데요.🧰

실제 구성 기능과 리필 규격은 제품 패키지의 표기를 확인한 뒤
평소 자주 사용하는 필기 방식과 비교해 선택해 주세요.🔍

데스크 위의 실용적인 필기 파트너를 블블샵에서 만나보세요~!💚

@monteverdeUSA

${monteTags}`,
`🧰

몬테베르데 카리브라 4-in-1 데스크 세트를 소개합니다!✨

네 가지 필기 기능을 하나의 세트로 구성해
필요한 도구를 간편하게 바꿔 사용할 수 있습니다.🖊️

업무용 책상과 서재의 필기구를 깔끔하게 정리하고 싶다면
블루블랙 펜샵에서 직접 확인해 보세요~!💚

@monteverdeUSA

${monteTags}`
  ];

  const inkProduct = {
    date: INK_DATE, weekday: '수', type: '신규 색상', title: '쓰리오 베이직 잉크 신규 색상 5종',
    summary: 'Crimson, Watermelon, Papaya, Sandstone, Mocha 5가지 신규 색상과 30ml 용량을 정리했습니다.',
    status: '공개 이미지 검증 완료', verification: '색상명·용량 확인 · 재고 확인 필요', statusTone: 'verified',
    officialName: '3·O Basic Ink 신규 색상 5종',
    englishName: 'Crimson · Watermelon · Papaya · Sandstone · Mocha',
    facts: [
      { label: '게시일', value: '2026년 7월 8일 수요일', verified: true },
      { label: '신규 색상', value: 'Crimson · Watermelon · Papaya · Sandstone · Mocha', verified: true },
      { label: '용량', value: '각 30ml', verified: true },
      { label: '공개 자료', value: '신규 5색 제품 이미지와 전체 컬러 차트', verified: true },
      { label: '잉크 세부 유형', value: '공급사 상세 표기 확인 필요', verified: false },
      { label: '자사몰 등록·재고', value: '게시 전 확인 필요', verified: false }
    ],
    officialImages: [
      { src: 'https://pbs.twimg.com/media/HMR1sN_aoAAHkrW?format=jpg&name=large', alt: '3·O Basic Ink 신규 색상 5종', caption: 'Crimson, Watermelon, Papaya, Sandstone, Mocha', sourceUrl: 'https://x.com/Firstmate_pen/status/2074040653193887829', sourceLabel: 'First Mate Pen X', notice: '공개 홍보 이미지 · 재사용 권한은 공급사 확인' },
      { src: 'https://pbs.twimg.com/media/HMR1sODbUAA1JIr?format=jpg&name=large', alt: '3·O Basic Ink 컬러 차트', caption: '전체 컬러 차트와 신규 색상 5종', sourceUrl: 'https://x.com/Firstmate_pen/status/2074040653193887829', sourceLabel: 'First Mate Pen X', notice: '화면과 실제 종이 발색은 다를 수 있음' }
    ],
    features: ['5가지 신규 컬러', '공개 제품 이미지에서 각 30ml 병으로 확인', '레드·코랄·오렌지와 베이지·브라운 계열 구성', '동일 조건의 실제 발색 비교 촬영 필요'],
    pros: ['따뜻한 계열의 선택 폭이 넓어짐', '30ml 용량으로 여러 색을 비교하기 좋음', '전체 컬러 차트가 함께 공개됨'],
    cons: ['화면과 실제 발색이 다를 수 있음', '잉크의 세부 유형은 공급사 확인 필요', '자사몰 등록과 판매 재고 확인 필요'],
    sources: [{ name: 'First Mate Pen X · 3·O Basic Ink 신규 색상', url: 'https://x.com/Firstmate_pen/status/2074040653193887829', kind: '공급사 공개 게시물', use: '신규 색상명·30ml·컬러 차트 확인' }],
    referencePosts: [],
    checklist: ['자사몰 등록과 판매 재고 확인', '5가지 영문 색상명과 30ml 라벨 재확인', '잉크 세부 유형과 사용 가능 필기구 확인', '동일 종이·펜촉·조명으로 발색표 촬영', '공식 인스타그램 계정 확인 전 임의 태그 금지', '홍보 이미지 재사용 권한 확인'],
    draft: { state: '마스터 프롬프트 적용 원고 5개 작성 완료', text: inkVariants[0] }
  };

  const monteProduct = {
    date: MONTE_DATE, weekday: '목', type: '제품 소개', title: '몬테베르데 카리브라 4-in-1 데스크 세트',
    summary: '자사몰에 등록된 카리브라 4-in-1 데스크 세트의 확인 정보와 검증 항목을 정리했습니다.',
    status: '자사몰 제품 확인 완료', verification: '제품명·4-in-1 확인 · 세부 구성 확인 필요', statusTone: 'verified',
    officialName: '몬테베르데 카리브라 4-in-1 데스크 세트',
    englishName: 'Monteverde Calibra 4-in-1 Desk Set',
    facts: [
      { label: '게시일', value: '2026년 7월 9일 목요일', verified: true },
      { label: '브랜드', value: 'Monteverde USA', verified: true },
      { label: '제품 유형', value: '네 가지 기능을 묶은 데스크용 필기구 세트', verified: true },
      { label: '자사몰 상품', value: '블루블랙 상품번호 5369', verified: true },
      { label: '공식 인스타그램', value: '@monteverdeUSA', verified: true },
      { label: '현행 공식 페이지', value: '동일 모델 전용 페이지 미확인', verified: true },
      { label: '세부 기능·리필 규격', value: '실물 패키지와 상세 페이지 확인 필요', verified: false },
      { label: '판매 재고', value: '게시 직전 확인 필요', verified: false }
    ],
    officialImages: [],
    features: ['한 세트 안에 네 가지 필기 기능을 구성', '필요한 기능을 바꿔 사용하는 데스크용 멀티 세트', '블루블랙 자사몰에 별도 상품 페이지 등록', '실물 패키지 중심 검증 필요'],
    pros: ['여러 필기 기능을 한곳에 정리하기 좋음', '기능 전환 장면을 활용한 콘텐츠에 적합', '업무·서재용이라는 사용 목적이 분명함'],
    cons: ['현행 공식 사이트에서 동일 모델 상세 사양 미확인', '구성 기능과 리필 규격을 추정하면 안 됨', '재고와 리필 공급 여부 확인 필요'],
    sources: [
      { name: '블루블랙 자사몰 · 카리브라 4-in-1 데스크 세트', url: 'https://blueblack.co.kr/product/%EB%AA%AC%ED%85%8C%EB%B2%A0%EB%A5%B4%EB%8D%B0-%EC%B9%B4%EB%A6%AC%EB%B8%8C%EB%9D%BC-4in1-%EB%8D%B0%EC%8A%A4%ED%81%AC-%EC%84%B8%ED%8A%B8/5369/category/762/display/1/', kind: '자사몰 상품 페이지', use: '제품명·상품 페이지 확인' },
      { name: 'Monteverde USA 공식 홈페이지', url: 'https://www.monteverdepens.com/', kind: '브랜드 공식 사이트', use: '브랜드·현행 컬렉션·공식 인스타그램 확인' },
      { name: 'Monteverde USA 공식 카탈로그', url: 'https://www.monteverdepens.com/pages/catalogs', kind: '브랜드 공식 자료', use: '현행 제품군 대조' }
    ],
    referencePosts: [],
    checklist: ['자사몰 상세에서 네 가지 기능의 정확한 명칭 확인', '패키지 구성품과 작동 방식 촬영', '리필 규격과 교체 방법 확인', '현재 재고와 품절 여부 확인', '리필·A/S 공급 여부 확인', '가격은 SNS 본문에 임의 기재하지 않기'],
    draft: { state: '마스터 프롬프트 적용 원고 5개 작성 완료', text: monteVariants[0] }
  };

  window.BLUEBLACK_PRODUCT_CONTENT = Object.assign(window.BLUEBLACK_PRODUCT_CONTENT || {}, {
    [INK_ID]: { name: inkProduct.title, emoji: '🎨', category: '만년필 잉크 · 신규 색상', intro: inkProduct.summary, description: '공개 신제품 이미지와 컬러 차트에서 5가지 색상과 30ml 용량을 확인했습니다.', feature: '따뜻한 계열로 확장된 신규 5색', use: '새로운 병잉크 색을 비교하려는 만년필 사용자', photo: '5색 단체·라벨·동일 조건 발색·굵기 비교·컬러 차트', notice: '판매 재고와 잉크 세부 유형은 게시 전 확인', hashtags: inkTags },
    [MONTE_ID]: { name: monteProduct.title, emoji: '🧰', category: '멀티 데스크 필기구', intro: monteProduct.summary, description: '자사몰 제품명은 확인했으나 현행 공식 사이트에서 동일 모델의 전용 상세 페이지는 확인되지 않았습니다.', feature: '네 가지 기능을 하나의 데스크 세트로 구성', use: '책상 위 여러 필기 기능을 한곳에 정리하려는 분', photo: '세트 전체·구성품·기능 전환·작동부·리필 표기', notice: '세부 기능과 리필 규격은 실물로 최종 확인', hashtags: monteTags }
  });

  window.BLUEBLACK_COPY_VARIANTS = window.BLUEBLACK_COPY_VARIANTS || {};
  window.BLUEBLACK_COPY_VARIANTS[INK_ID] = inkVariants;
  window.BLUEBLACK_COPY_VARIANTS[MONTE_ID] = monteVariants;
  window.BLUEBLACK_DRAFTS = window.BLUEBLACK_DRAFTS || {};
  window.BLUEBLACK_DRAFTS[INK_ID] = inkVariants[0];
  window.BLUEBLACK_DRAFTS[MONTE_ID] = monteVariants[0];

  const originalParse = JSON.parse.bind(JSON);
  JSON.parse = function blueblackJulyEightNineParse(text, reviver) {
    const data = originalParse(text, reviver);
    try {
      if (data && data.meta && Array.isArray(data.events) && data.products) {
        data.products[INK_ID] = inkProduct;
        data.products[MONTE_ID] = monteProduct;

        const upsert = (item, matcher) => {
          const index = data.events.findIndex((event) => event.productId === item.productId || matcher(event));
          if (index >= 0) data.events[index] = Object.assign({}, data.events[index], item);
          else data.events.push(item);
        };

        upsert({ date: INK_DATE, weekday: '수', type: '신규 색상', title: inkProduct.title, productId: INK_ID },
          (event) => event.date === INK_DATE && /쓰리오|3.?O|베이직\s*잉크/i.test(`${event.title || ''} ${event.productId || ''}`));

        upsert({ date: MONTE_DATE, weekday: '목', type: '제품 소개', title: monteProduct.title, productId: MONTE_ID },
          (event) => event.date === MONTE_DATE && /몬테베르데|카리브라|monteverde|calibra/i.test(`${event.title || ''} ${event.productId || ''}`));

        data.events.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'ko'));
        data.meta.updatedAt = '2026.07.07';
      }
    } catch (error) {
      console.warn('7월 8일·9일 SNS 제품 정보를 반영하지 못했습니다.', error);
    }
    return data;
  };
})();