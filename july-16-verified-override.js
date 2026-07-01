(() => {
  'use strict';

  const configs = window.BLUEBLACK_JULY_PRODUCTS = window.BLUEBLACK_JULY_PRODUCTS || [];
  const copyStore = window.BLUEBLACK_COPY_VARIANTS = window.BLUEBLACK_COPY_VARIANTS || {};
  const contentStore = window.BLUEBLACK_PRODUCT_CONTENT = window.BLUEBLACK_PRODUCT_CONTENT || {};
  const CHECKED_AT = '2026.07.01';

  const findExisting = (ids) => configs.find((item) =>
    (item.ids || []).some((id) => ids.includes(id))
  );

  const getFive = (ids, fallback = []) => {
    const current = ids.map((id) => copyStore[id]).find((value) => Array.isArray(value) && value.length);
    const merged = [...(current || []), ...fallback].filter(Boolean);
    return merged.slice(0, 5);
  };

  const tonlandVariants = [
`🤎

필요한 기록만 골라 채우는 톤랜드 베이직 6공 다이어리를 소개합니다!📒

A6와 A5 두 가지 사이즈, 그레이·브라운·아이보리·와인브라운·딥그린·블랙·네이비·머스타드까지 8가지 컬러로 구성되어 취향과 사용 목적에 맞춰 선택할 수 있는데요.✨

라인과 무지, 일간·주간·월간 스케줄, 그리드와 도트, 코넬, 가계부, 체크리스트 등 다양한 6공 리필을 조합해 나만의 기록 방식을 만들 수 있습니다. 지퍼 포켓과 명함 포켓, 파일 포켓, 인덱스와 포토카드 리필도 함께 살펴보세요.✍️

2026년 7월 1일 기준 자사몰에서는 품절로 확인됩니다. 게시 전 재입고 여부와 판매 옵션을 다시 안내드리겠습니다.

@tonland_official
#톤랜드 #tonland #6공다이어리 #가죽다이어리 #다이어리리필 #플래너 #기록생활 #블루블랙펜샵`,
`🎨

기록하는 방식도, 다이어리의 색도 내 취향대로 골라보세요!📒

톤랜드 베이직 6공 다이어리는 휴대하기 좋은 A6와 넉넉하게 기록하기 좋은 A5 두 가지 사이즈로 만나볼 수 있습니다. 차분한 그레이와 브라운부터 딥그린, 네이비, 머스타드까지 8가지 컬러가 준비되어 있어 책상과 가방에 어울리는 색을 고르는 재미가 있는데요.🤎

속지는 고정되어 있지 않습니다. 일정 관리, 업무 메모, 가계부, 일기, 체크리스트처럼 필요한 리필만 더해 한 권을 자신에게 맞게 구성할 수 있습니다.✨

현재 자사몰 품절 상태로, 실제 게시 전 재입고 여부를 확인해 안내드릴 예정입니다.

@tonland_official
#톤랜드 #가죽다이어리 #6공바인더 #다이어리꾸미기 #플래너 #문구생활 #블루블랙펜샵 #tonland`,
`🔍

톤랜드 베이직 6공 다이어리의 구성을 한눈에 살펴보세요!📒

✔ A6 · A5 두 가지 사이즈
✔ 그레이·브라운·아이보리·와인브라운·딥그린·블랙·네이비·머스타드 8가지 컬러
✔ 라인·무지·그리드·도트·코넬 리필
✔ 일간·주간·월간 스케줄과 가계부·일기·체크리스트
✔ 지퍼·명함·파일·포토카드 포켓과 인덱스 구성
✔ 자사몰 표시 판매가 17,000원, 전용 리필 2,000원

가격과 재고는 변동될 수 있습니다. 7월 1일 기준 품절로 확인되어 게시 당일 판매 상태를 다시 확인하겠습니다.

@tonland_official
#톤랜드 #tonland #6공다이어리 #다이어리속지 #바인더리필 #플래너 #블루블랙펜샵`,
`👜

이런 분께 톤랜드 베이직 6공 다이어리를 추천드립니다!🤎

• A6와 A5 중 생활 방식에 맞는 크기를 고르고 싶은 분
• 일정과 메모, 가계부를 한 권에 정리하고 싶은 분
• 사용한 속지는 보관하고 필요한 페이지만 교체하고 싶은 분
• 다양한 포켓과 인덱스로 수납까지 구성하고 싶은 분
• 차분한 컬러의 6공 다이어리를 찾는 분

기록 방식이 달라져도 리필만 바꾸면 한 권을 새롭게 사용할 수 있습니다. 컬러와 사이즈, 리필 종류를 사진으로 비교해 보세요.✍️

현재 품절 상태이므로 게시 전 재입고 여부를 확인해 정확히 안내드리겠습니다.

@tonland_official
#톤랜드 #6공다이어리 #가죽문구 #플래너추천 #기록생활 #문구추천 #블루블랙펜샵 #tonland`,
`🤎

톤랜드 베이직 6공 다이어리!📒

A6·A5 두 가지 사이즈와 8가지 컬러, 일정·메모·가계부·포켓까지 폭넓게 조합할 수 있는 다양한 전용 리필로 나만의 한 권을 구성해 보세요.✍️

2026년 7월 1일 기준 자사몰 품절 · 게시 전 재입고 여부 재확인

@tonland_official
#톤랜드 #tonland #6공다이어리 #다이어리리필 #플래너 #블루블랙펜샵`
  ];

  ['monday-0713', 'tonland-basic-6ring'].forEach((id) => { copyStore[id] = tonlandVariants; });

  const definitions = [
    {
      key: 'pilot-neox-wakaru',
      ids: ['pilot-neox-wakaru', 'pilot-neox', 'pilot-wakaru'],
      match: ['파이롯트 네옥스', '파일럿 네옥스', 'neox wakaru', '네옥스 와카루'],
      plannedDate: '2026-07-02',
      content: {
        name: '파이롯트 네옥스 그래파이트 WAKARU 한정 샤프심', emoji: '✏️', category: '샤프심·한정 문구',
        intro: '네옥스 그래파이트의 필기 성능에 WAKARU의 오리지널 스티커와 12가지 한정 패키지를 더한 샤프심입니다.',
        description: '파이롯트 공식 자료에 따르면 네옥스 그래파이트의 잘 부러지지 않고 진하며 부드러운 필기감은 그대로 유지하면서, 0.3mm 6종과 0.5mm 6종으로 총 12가지 케이스를 전개합니다. 심경과 경도는 케이스 뒷면에서 확인할 수 있고, WAKARU 감수 오리지널 스티커로 케이스를 직접 꾸밀 수 있습니다.',
        feature: '0.3mm·0.5mm 총 12종 패키지, WAKARU 오리지널 스티커, 케이스 뒷면 심경·경도 표기',
        use: '필기 성능과 한정 패키지, 직접 꾸미는 재미를 함께 원하는 분',
        photo: '12종 패키지 비교, 동봉 스티커, 꾸미기 전후, 케이스 뒷면 규격, 실제 필기 농도',
        notice: '수량 한정 제품입니다. 입고된 심경·경도·패키지 종류와 재고는 게시 직전에 다시 확인하세요.',
        hashtags: '#블루블랙펜샵 #파이롯트 #네옥스그래파이트 #WAKARU #샤프심 #한정문구 #mechanicalpencil'
      },
      facts: [
        ['업로드 예정일', '2026.07.02'],
        ['라인업', '0.3mm 6종 + 0.5mm 6종 · 총 12종'],
        ['구성', 'WAKARU 감수 오리지널 데코레이션 스티커'],
        ['표기 방식', '심경과 경도는 케이스 뒷면에서 확인'],
        ['공식 특징', '잘 부러지지 않고 진하며 부드러운 필기감'],
        ['제품 성격', '2026년 수량 한정 패키지']
      ],
      sources: [
        ['파이롯트 공식 한정 제품 페이지', 'https://www.pilot.co.jp/promotion/neox-graphite_limited/', '12종 라인업·스티커·제품 특징 확인'],
        ['블루블랙 자사몰', 'https://blueblack.co.kr/', '국내 입고 옵션과 게시일 재고 확인']
      ],
      caution: '공식 협업명은 WAKARU(와카루)입니다. 국내 입고된 심경·경도와 패키지 종류는 실물 재고 기준으로 최종 확인해야 합니다.'
    },
    {
      key: 'blueblack-nature-note-0706',
      ids: ['monday-0706', 'blueblack-nature-note', 'nature-note'],
      match: ['블루블랙 네이처 노트', '네이처 노트', 'nature note'],
      plannedDate: '2026-07-06',
      content: {
        name: '블루블랙 네이처 노트', emoji: '📖', category: '노트·종이',
        intro: '두 가지 종이와 네 가지 기록 형식을 비교하며 만년필과 잘 맞는 한 권을 고르는 블루블랙의 노트입니다.',
        description: 'A5 규격의 네이처 노트는 밝은 마쉬멜로우지 81.4g/㎡와 크림 톤의 알토크림 맥스 61g/㎡ 두 가지 종이로 구성됩니다. 마쉬멜로우지는 무지·줄지·도트, 알토크림 맥스는 무지·줄지·방안 내지로 선택할 수 있습니다. 오프라인 매장에서는 준비된 만년필 또는 개인 필기구로 직접 써보며 종이색, 잉크 발색과 필기감을 비교할 수 있습니다.',
        feature: 'A5 148×210mm, 마쉬멜로우지·알토크림 맥스, 무지·줄지·도트·방안 선택',
        use: '만년필 잉크 발색과 종이색, 내지 구성을 직접 비교해 노트를 고르고 싶은 분',
        photo: '두 종이의 색 차이, 내지 4종, 같은 잉크 발색 비교, 뒷면 비침, 매장 시필 장면',
        notice: '판매 중인 종이와 내지 조합, 재고는 게시 전에 자사몰과 매장 실물을 다시 확인하세요.',
        hashtags: '#블루블랙펜샵 #네이처노트 #만년필노트 #A5노트 #잉크발색 #노트추천 #stationery'
      },
      facts: [
        ['업로드 예정일', '2026.07.06'],
        ['크기', 'A5 · 148×210mm'],
        ['마쉬멜로우지', '81.4g/㎡ · 무지·줄지·도트'],
        ['알토크림 맥스', '61g/㎡ · 무지·줄지·방안'],
        ['매장 체험', '매장 비치 필기구 또는 개인 필기구로 시필 가능'],
        ['촬영 핵심', '종이색·잉크 발색·번짐·비침 비교']
      ],
      sources: [
        ['블루블랙 자사몰', 'https://blueblack.co.kr/', '자사 기획 제품의 판매 옵션과 재고 확인'],
        ['블루블랙 오프라인 매장 안내', 'https://blueblack.co.kr/', '시필 가능 여부와 촬영 실물 최종 확인']
      ],
      caution: '종이 중량과 내지 조합은 현재 정리된 제품 자료 기준입니다. 게시 전 실제 판매 옵션 및 촬영 제품의 라벨을 한 번 더 대조하세요.'
    },
    {
      key: 'caran-dache-849',
      ids: ['caran-dache-849', 'carandache-849'],
      match: ['까렌다쉬 849', '카렌다쉬 849', 'caran d ache 849', 'caran-dache 849'],
      plannedDate: '2026-07-07',
      content: {
        name: '까렌다쉬 849 메탈 볼펜', emoji: '🔷', category: '유성 볼펜',
        intro: '육각형 알루미늄 바디와 간결한 노크 구조를 갖춘 까렌다쉬의 스위스 메이드 데일리 볼펜입니다.',
        description: '849는 육각형 알루미늄 바디, 금속 클립과 푸시 버튼으로 구성된 까렌다쉬의 대표 볼펜입니다. 교체 가능한 골리앗 리필을 사용하며 공식 안내 기준 최대 A4 약 600페이지 분량을 필기할 수 있습니다. 컬러에 따라 같은 실루엣도 전혀 다른 인상을 보여줍니다.',
        feature: '육각 알루미늄 바디, 금속 클립·푸시 버튼, 교체형 골리앗 리필, Swiss Made',
        use: '가볍고 굴러가지 않는 리필형 데일리 볼펜을 찾는 분',
        photo: '컬러 비교, 육각 단면, 클립과 노크, 골리앗 리필, 손에 쥔 크기와 필기선',
        notice: '컬러와 리필 굵기·잉크색은 판매 옵션에 따라 다릅니다. 게시 전 입고 모델과 재고를 확인하세요.',
        hashtags: '#블루블랙펜샵 #까렌다쉬 #까렌다쉬849 #849볼펜 #골리앗리필 #스위스메이드 #carandache'
      },
      facts: [
        ['업로드 예정일', '2026.07.07'],
        ['바디', '육각형 알루미늄'],
        ['작동', '푸시 버튼 노크 방식'],
        ['리필', '교체형 까렌다쉬 골리앗 볼펜 리필'],
        ['공식 안내 필기량', '최대 A4 약 600페이지'],
        ['생산', 'Swiss Made · 제네바 생산']
      ],
      sources: [
        ['까렌다쉬 공식 849 컬렉션', 'https://www.carandache.com/ch/en/849-ballpoint-s-1116.htm', '바디·작동 방식·골리앗 리필 확인'],
        ['블루블랙 자사몰', 'https://blueblack.co.kr/', '국내 판매 컬러·리필 옵션·재고 확인']
      ],
      caution: '“최대 A4 약 600페이지”는 제조사의 골리앗 리필 기준 안내이며 실제 필기량은 사용 방식에 따라 달라질 수 있습니다.'
    },
    {
      key: 'monteverde-calibra-4in1',
      ids: ['monteverde-calibra-4in1', 'monteverde-calibra', 'monteverde-desk-set'],
      match: ['몬테베르데 카리브라', '몬테베르데 칼리브라', 'monteverde calibra', '카리브라 4in1'],
      plannedDate: '2026-07-09',
      content: {
        name: '몬테베르데 카리브라 4-in-1 데스크 세트', emoji: '🧰', category: '멀티 데스크 필기구 세트',
        intro: '하나의 데스크 세트에서 네 가지 기능을 전환해 사용하는 몬테베르데의 멀티 필기구입니다.',
        description: '현재 몬테베르데 공식 현행 카탈로그에서는 동일 모델의 상세 페이지를 확인하기 어려운 구형 또는 단종 가능 제품입니다. 따라서 제품명만 보고 네 가지 기능을 추정하지 않고, 입고된 패키지와 실물에서 구성품·전환 방식·리필 규격을 확인해 소개합니다. 콘텐츠는 전체 구성과 실제 작동 순서를 중심으로 제작합니다.',
        feature: '네 가지 기능을 한 세트에 구성한 데스크 필기구 · 실물 패키지 검증 필수',
        use: '책상 위 여러 필기 도구를 한 구성으로 정리하고 기능을 바꿔 사용하고 싶은 분',
        photo: '패키지 정면, 전체 구성, 기능 전환 순서, 리필 각인, 기능별 필기선과 책상 위 사용 장면',
        notice: '구성품·기능명·리필 규격을 추정해 작성하지 않습니다. 촬영 전 실물 패키지와 작동 방식을 확인하세요.',
        hashtags: '#블루블랙펜샵 #몬테베르데 #카리브라 #Calibra #4in1 #데스크세트 #monteverde'
      },
      facts: [
        ['업로드 예정일', '2026.07.09'],
        ['확인 제품명', 'Monteverde Calibra 4-in-1 Desk Set'],
        ['제품 유형', '네 가지 기능을 묶은 데스크 필기구 세트'],
        ['공식 현행 카탈로그', '동일 모델 상세 페이지 미확인'],
        ['실물 검증', '구성품·기능명·작동 방식·리필 규격'],
        ['콘텐츠 방식', '기능 전환과 실제 필기 장면 중심']
      ],
      sources: [
        ['몬테베르데 공식 홈페이지', 'https://www.monteverdepens.com/', '현행 제품군과 브랜드 정보 확인'],
        ['블루블랙 자사몰', 'https://blueblack.co.kr/', '입고 제품명·패키지·판매 상태 최종 확인']
      ],
      caution: '온라인 공식 세부 사양이 부족합니다. 네 가지 기능의 정확한 명칭과 리필 규격은 반드시 입고 실물과 패키지 표기를 확인한 뒤 최종 원고에 넣어야 합니다.'
    },
    {
      key: 'tonland-basic-6ring-0713',
      ids: ['monday-0713', 'tonland-basic-6ring'],
      match: ['톤랜드 베이직', '톤랜드 6공', 'tonland basic', '6공 다이어리'],
      plannedDate: '2026-07-13',
      content: {
        name: '톤랜드 베이직 6공 다이어리', emoji: '🤎', category: '다이어리·바인더',
        intro: 'A6·A5 두 가지 사이즈와 8가지 컬러, 폭넓은 전용 리필을 조합하는 6공 다이어리입니다.',
        description: '블루블랙 자사몰 기준 A6와 A5 두 가지 사이즈, 그레이·브라운·아이보리·와인브라운·딥그린·블랙·네이비·머스타드 8가지 컬러로 구성됩니다. 전용 리필은 라인·무지·스케줄·그리드·도트·코넬·가계부·일기·체크리스트부터 지퍼·명함·파일·포토카드 포켓과 인덱스까지 폭넓게 선택할 수 있습니다. 2026년 7월 1일 확인 당시 자사몰 판매가는 17,000원, 전용 리필은 2,000원이며 본품은 품절 상태입니다.',
        feature: 'A6·A5, 8가지 컬러, 일정·메모·수납을 조합하는 다양한 6공 리필',
        use: '일정과 기록, 가계부와 수납을 한 권 안에서 자신에게 맞게 구성하고 싶은 분',
        photo: 'A6·A5 크기 비교, 8색 표지, 링 구조, 리필 종류, 포켓·인덱스 조합, 실제 사용 장면',
        notice: '가격과 품절 상태는 2026년 7월 1일 확인값입니다. 게시 직전 재입고·가격·옵션을 다시 확인하세요.',
        hashtags: '#블루블랙펜샵 #톤랜드 #tonland #6공다이어리 #다이어리리필 #플래너 #기록생활'
      },
      facts: [
        ['업로드 예정일', '2026.07.13'],
        ['사이즈', 'A6 · A5'],
        ['컬러', '그레이·브라운·아이보리·와인브라운·딥그린·블랙·네이비·머스타드'],
        ['리필', '라인·무지·일/주/월 스케줄·그리드·도트·코넬·가계부·일기·체크리스트 등'],
        ['수납 리필', '지퍼·명함·파일·포토카드 포켓과 인덱스'],
        ['7월 1일 자사몰', '본품 17,000원 · 리필 2,000원 · 본품 품절']
      ],
      sources: [
        ['블루블랙 자사몰 제품 페이지', 'https://blueblack.co.kr/product/%ED%86%A4%EB%9E%9C%EB%93%9C-%EB%B2%A0%EC%9D%B4%EC%A7%81-6%EA%B3%B5-%EB%8B%A4%EC%9D%B4%EC%96%B4%EB%A6%AC/5279/category/1/display/7/?icid=MAIN.product_listmain_6', '가격·사이즈·컬러·리필·품절 상태 확인'],
        ['블루블랙 자사몰', 'https://blueblack.co.kr/', '게시일 재입고 및 판매 상태 재확인']
      ],
      caution: '현재 품절 상태이므로 “지금 구매하세요” 또는 “판매 중”이라는 표현을 사용하지 않습니다. 게시 전 재입고 여부와 가격을 반드시 다시 확인하세요.',
      variants: tonlandVariants
    },
    {
      key: 'sheaffer-vfm',
      ids: ['sheaffer-vfm', 'sheaffer-vfm-ballpoint'],
      match: ['쉐퍼 vfm', 'sheaffer vfm'],
      plannedDate: '2026-07-14',
      content: {
        name: '쉐퍼 VFM 볼펜', emoji: '🖊️', category: '유성 볼펜',
        intro: '간결한 실루엣과 쉐퍼를 상징하는 White Dot를 갖춘 데일리 볼펜입니다.',
        description: 'VFM은 일상과 업무에서 휴대하기 쉬운 쉐퍼의 필기구 컬렉션입니다. 제품 세대와 마감에 따라 색상, 트림, 작동 방식과 호환 리필이 달라질 수 있으므로 이번 게시물에서는 실제 입고 모델의 외관, White Dot, 작동 방식과 리필 각인을 직접 확인해 안내합니다.',
        feature: '단정한 바디, 쉐퍼 White Dot, 교체형 리필, 입고 모델별 다양한 마감',
        use: '업무 메모와 일상 필기에 사용할 단정한 브랜드 볼펜을 찾는 분',
        photo: '전체 실루엣, White Dot와 클립, 작동 방식, 리필 각인, 손에 쥔 모습과 실제 필기선',
        notice: 'VFM은 출시 시기와 마감별 사양 차이가 있습니다. 색상·트림·작동 방식·호환 리필은 촬영 실물 기준으로 확인하세요.',
        hashtags: '#블루블랙펜샵 #쉐퍼 #쉐퍼VFM #VFM볼펜 #데일리볼펜 #sheaffer #ballpointpen'
      },
      facts: [
        ['업로드 예정일', '2026.07.14'],
        ['컬렉션', 'Sheaffer VFM'],
        ['제품 유형', '교체형 리필을 사용하는 볼펜'],
        ['브랜드 표식', '쉐퍼를 상징하는 White Dot'],
        ['주요 용도', '업무 메모·서명·일상 기록'],
        ['최종 확인', '색상·트림·작동 방식·호환 리필은 입고 모델 기준']
      ],
      sources: [
        ['쉐퍼 공식 볼펜 컬렉션', 'https://sheaffer.com/collections/ballpoint-pen', '공식 볼펜 제품군과 리필 카테고리 확인'],
        ['쉐퍼 공식 홈페이지', 'https://sheaffer.com/', '브랜드 및 White Dot 안내 확인'],
        ['블루블랙 자사몰', 'https://blueblack.co.kr/', '국내 입고 모델·색상·판매 상태 확인']
      ],
      caution: '사진만으로 노크식 또는 트위스트식이라고 단정하지 않습니다. 실제 입고 제품을 작동하고 리필 각인을 확인한 뒤 원고를 확정하세요.'
    },
    {
      key: 'conifer-notes',
      ids: ['conifer-notes', 'conifer-view-unique'],
      match: ['코니퍼 노트', 'conifer note', '코니퍼 뷰', '코니퍼 유니크'],
      plannedDate: '2026-07-16',
      content: {
        name: '코니퍼 노트 — 뷰·유니크', emoji: '📘', category: '노트·종이',
        intro: '코니퍼의 View와 Unique 노트를 표지, 판형, 제본과 내지, 실제 필기 결과를 중심으로 비교합니다.',
        description: '온라인에서 확인 가능한 공식 수치 자료가 제한적인 제품이므로 정확한 크기, 페이지 수와 종이 중량을 임의로 작성하지 않습니다. 판매 중인 실물과 자사몰 옵션을 기준으로 두 라인의 표지, 판형, 제본, 내지 형식을 대조하고 같은 만년필·볼펜·샤프로 써서 발색, 번짐과 비침을 비교합니다.',
        feature: 'View·Unique 두 라인의 외관과 내지, 실제 필기 결과를 동일 조건에서 비교',
        use: '표지 디자인뿐 아니라 내지 형식과 실제 종이 사용감을 보고 노트를 선택하고 싶은 분',
        photo: '두 라인 표지, 크기와 제본, 내지, 펼침, 만년필·볼펜·샤프 테스트, 뒷면 비침',
        notice: '정확한 규격·페이지 수·종이 사양은 촬영 실물의 라벨과 자사몰 옵션을 확인한 뒤 입력하세요.',
        hashtags: '#블루블랙펜샵 #코니퍼 #코니퍼노트 #뷰노트 #유니크노트 #노트추천 #stationery'
      },
      facts: [
        ['업로드 예정일', '2026.07.16'],
        ['비교 대상', 'Conifer View · Unique 노트'],
        ['확인 항목', '표지·판형·제본·내지·펼침'],
        ['필기 테스트', '만년필 발색·번짐·비침, 볼펜과 샤프 필기감'],
        ['실물 확인', '정확한 크기·페이지 수·종이 중량·색상 옵션'],
        ['작성 원칙', '확인되지 않은 숫자 사양은 게시하지 않음']
      ],
      sources: [
        ['블루블랙 자사몰', 'https://blueblack.co.kr/', '판매 제품명·옵션·재고 확인'],
        ['블루블랙 오프라인 매장 실물', 'https://blueblack.co.kr/', '라벨·내지·제본과 필기 테스트 최종 검증']
      ],
      caution: '공개된 공식 수치 자료가 충분하지 않습니다. 정확한 규격과 종이 사양은 반드시 실물 라벨과 자사몰 상세 옵션을 대조한 뒤 입력하세요.'
    }
  ];

  definitions.forEach((definition) => {
    const current = findExisting(definition.ids);
    const variants = definition.variants || getFive(definition.ids, current?.variants || []);
    const completed = {
      ...current,
      ...definition,
      checkedAt: CHECKED_AT,
      content: { ...(current?.content || {}), ...definition.content },
      variants
    };

    const index = current ? configs.indexOf(current) : -1;
    if (index >= 0) configs[index] = completed;
    else configs.unshift(completed);

    definition.ids.forEach((id) => {
      contentStore[id] = completed.content;
      copyStore[id] = variants;
    });
  });

  window.BLUEBLACK_JULY_16_VERIFIED = {
    checkedAt: CHECKED_AT,
    through: '2026-07-16',
    products: definitions.map(({ key, plannedDate, ids }) => ({ key, plannedDate, ids }))
  };
})();