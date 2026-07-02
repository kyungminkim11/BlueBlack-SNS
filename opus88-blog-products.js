(() => {
  'use strict';

  let timer = null;

  const products = [
    {
      key: 'harmony',
      name: '오퍼스88 하모니 만년필',
      tagline: '마블 레진과 로즈골드 장식이 돋보이는 가벼운 대용량 아이드로퍼',
      image: 'https://blueblack.co.kr/web/product/big/202512/9f9e57360917936dd3be5720c6a518f1.jpg',
      shopUrl: 'https://blueblack.co.kr/product/오퍼스88-하모니-만년필/4785/category/191/display/1/',
      price: '184,800원',
      listPrice: '264,000원',
      options: '브라운 · 레드/그레이 / F · M촉',
      facts: [
        ['충전 방식', '병 잉크를 직접 넣는 아이드로퍼 방식'],
        ['잉크 차단', '후면 노브로 작동하는 피스톤식 셧오프 밸브'],
        ['펜촉', '로즈골드 도금 #6 JoWo 스틸 닙'],
        ['잉크 용량', '해외 판매처 표기 약 2.6ml'],
        ['닫은 길이', '약 145.6mm'],
        ['무게', '약 25g'],
        ['바디·그립', '바디 약 14.2mm · 그립 약 10.2mm'],
        ['캡', '스크루 캡 약 2.25회전 · 공식 판매처 기준 비포스팅']
      ],
      strengths: [
        '세 모델 중 비교적 가볍고 바디가 덜 굵어 큰 펜이 부담스러운 사용자도 접근하기 좋습니다.',
        '마블 레진과 로즈골드 클립·닙의 조합이 확실해 대표 이미지와 디테일 촬영에 유리합니다.',
        '2.6ml 안팎의 대용량과 잉크 차단 밸브를 함께 갖춰 장시간 필기에 적합합니다.',
        '#6 JoWo 규격이라 익숙한 서양식 스틸 닙의 필기감과 교체 편의성을 기대할 수 있습니다.'
      ],
      weaknesses: [
        '캡을 바디 뒤에 안정적으로 꽂아 사용하는 모델이 아니어서 포스팅을 선호하면 불편할 수 있습니다.',
        '카트리지·컨버터가 아니라 병 잉크와 스포이드가 필요해 외부에서 빠르게 충전하기 어렵습니다.',
        '블루블랙 판매 옵션은 F·M촉으로 제한되며, 두 마블 색상은 개체마다 무늬가 조금씩 달라질 수 있습니다.',
        '세 모델 중 자사몰 판매가가 가장 높아 디자인과 장식을 중요하게 보는 고객에게 더 잘 맞습니다.'
      ],
      recommend: '화려한 마블 패턴, 로즈골드 장식, 가벼운 대형 만년필을 선호하는 분',
      blogCopy: '하모니는 마블 레진과 로즈골드 장식이 가장 먼저 눈에 들어오는 모델입니다. 약 25g의 비교적 가벼운 무게에 약 2.6ml의 잉크를 담을 수 있어, 디자인의 존재감과 장시간 필기 성능을 함께 원하는 분께 잘 어울립니다. 다만 캡을 뒤에 꽂아 사용하는 모델이 아니며 병 잉크를 직접 넣는 방식이라, 구매 전 실제 크기와 충전 방법을 함께 확인해 보시는 것을 추천드립니다.',
      sources: [
        ['블루블랙 판매 페이지', 'https://blueblack.co.kr/product/오퍼스88-하모니-만년필/4785/category/191/display/1/'],
        ['Goulet 제품·사양', 'https://www.gouletpens.com/products/opus-88-harmony-fountain-pen-mocha-mousse-limited-edition'],
        ['Fountain Pen Revolution', 'https://fprevolutionusa.com/products/opus-88-harmony-fountain-pen'],
        ['Pen Chalet 컬렉션', 'https://www.penchalet.com/fine_pens/fountain_pens/opus_88_harmony_fountain_pen.html']
      ]
    },
    {
      key: 'jazz',
      name: '오퍼스88 재즈 만년필',
      tagline: '전통적인 실루엣과 포스팅 가능한 캡을 갖춘 균형형 모델',
      image: 'https://blueblack.co.kr/web/product/big/202501/d9a2afd4bcbefa753711d51f29793a12.jpg',
      shopUrl: 'https://blueblack.co.kr/product/오퍼스88-재즈-만년필-라이트-블루/2624/category/191/display/1/',
      price: '라이트 블루·레드 119,000원 / 블랙 130,200원',
      listPrice: '170,000원 또는 186,000원',
      options: '블로그 대상: 라이트 블루 · 레드 · 블랙 / 자사몰 확인 EF · F촉',
      facts: [
        ['충전 방식', '대용량 아이드로퍼 + 셧오프 밸브'],
        ['펜촉', '실버 #6 JoWo 스틸 닙'],
        ['잉크 용량', '해외 판매처 표기 약 2.97ml'],
        ['닫은 길이', '약 151.2mm'],
        ['캡을 꽂은 길이', '약 174mm'],
        ['무게', '약 28g'],
        ['바디·그립', '바디 약 15.2mm · 그립 약 11.2mm'],
        ['캡', '스크루 캡 약 3.5회전 · 포스팅 가능']
      ],
      strengths: [
        '클래식한 시가형 실루엣이라 화려한 마블보다 단정한 디자인을 원하는 고객에게 설명하기 쉽습니다.',
        '캡을 바디 뒤에 꽂을 수 있어 포스팅 여부에 따라 길이와 무게 중심을 조절할 수 있습니다.',
        '약 2.97ml의 큰 잉크 용량과 잉크창, 차단 밸브를 갖춰 잔량 확인과 장시간 필기에 유리합니다.',
        '해외 실사용 평가에서는 큰 손에서 편안하고 장시간 필기 시 피로가 적다는 반응이 반복됩니다.'
      ],
      weaknesses: [
        '닫은 길이 약 151mm, 바디 지름 약 15mm로 작은 손이나 얇은 펜을 선호하는 사용자에게는 크게 느껴질 수 있습니다.',
        '캡을 여는 데 약 3.5회전이 필요해 짧은 메모를 자주 하는 상황에서는 번거로울 수 있습니다.',
        '포스팅하면 약 174mm까지 길어져 손 크기와 필기 자세에 따라 뒤쪽이 길게 느껴질 수 있습니다.',
        '색상별 가격과 판매 닙이 다르므로 하나의 가격·옵션으로 묶어 안내하면 안 됩니다.'
      ],
      recommend: '전통적인 디자인, 넉넉한 그립, 포스팅 가능한 대용량 데일리 만년필을 찾는 분',
      blogCopy: '재즈는 오퍼스88의 대용량 아이드로퍼 구조를 보다 익숙한 시가형 바디에 담은 모델입니다. 약 2.97ml의 잉크 용량과 차단 밸브, 잉크창을 갖추고 있으며 캡을 바디 뒤에 꽂아 사용할 수도 있습니다. 넉넉한 그립을 선호하는 분께는 편안하지만, 바디가 굵고 캡을 여는 회전 수가 많은 편이라 매장에서 직접 크기와 사용 동작을 확인해 보시는 것이 좋습니다.',
      sources: [
        ['라이트 블루 판매 페이지', 'https://blueblack.co.kr/product/오퍼스88-재즈-만년필-라이트-블루/2624/category/191/display/1/'],
        ['레드 판매 페이지', 'https://blueblack.co.kr/product/오퍼스88-재즈-만년필-레드/2622/category/191/display/1/'],
        ['블랙 판매 페이지', 'https://blueblack.co.kr/product/오퍼스88-재즈-만년필-블랙/2621/category/191/display/1/'],
        ['Goulet 제품·사양', 'https://www.gouletpens.com/products/opus-88-jazz-fountain-pen-solid-black'],
        ['The Pen Addict 실사용 리뷰', 'https://www.penaddict.com/blog/2024/1/31/opus-88-jazz-fountain-pen-review']
      ]
    },
    {
      key: 'sapphire',
      name: '오퍼스88 사파이어 데모 만년필',
      tagline: '블루 마블과 투명감, 블랙 닙으로 잉크까지 보여주는 비주얼 중심 모델',
      image: 'https://blueblack.co.kr/web/product/big/202501/5fcd96f2755f5e95784c65b30792ddae.jpg',
      shopUrl: 'https://blueblack.co.kr/product/오퍼스88-사파이어-데모-만년필/4784/category/191/display/1/',
      price: '147,000원',
      listPrice: '210,000원',
      options: 'EF · F · M · B 블랙 닙',
      facts: [
        ['바디', '사파이어 블루 계열의 반투명 마블 아크릴·레진'],
        ['충전 방식', '대용량 아이드로퍼 + 피스톤식 셧오프 밸브'],
        ['펜촉', '블랙 코팅 #6 JoWo 스틸 닙'],
        ['잉크 용량', '해외 판매처 표기 약 3.5ml'],
        ['크기·무게', '판매처 표기가 약 143~150mm · 약 23~27g으로 달라 실물 확인 권장'],
        ['캡', '스크루 캡 · 비포스팅 안내가 일반적'],
        ['구성', '유리 스포이드와 제품 케이스'],
        ['자사몰 리뷰', '2026.07.02 확인 1건']
      ],
      strengths: [
        '블루 마블과 반투명 바디 덕분에 잉크 잔량과 잉크색을 함께 보여줄 수 있어 사진 콘텐츠에 가장 유리합니다.',
        '약 3.5ml로 안내되는 대용량 구조라 세 모델 중 잉크를 자주 보충하지 않고 오래 쓰는 매력이 큽니다.',
        'EF부터 B까지 블랙 닙 옵션이 확인돼 세밀한 필기부터 굵은 잉크 표현까지 선택 폭이 넓습니다.',
        '블랙 닙과 크롬 클립, 밝은 블루 끝 장식의 대비가 강해 여름 시즌 콘텐츠와 잘 어울립니다.'
      ],
      weaknesses: [
        '크고 긴 데모 계열이며 캡을 뒤에 꽂지 않는 사용이 일반적이라 작은 펜을 선호하면 부담스러울 수 있습니다.',
        '투명·반투명 바디는 잉크 얼룩과 내부 잔여물이 눈에 잘 보여 세척 상태가 외관에 직접 드러납니다.',
        '마블 패턴과 투명도는 개체별 차이가 있어 자사몰 이미지와 실물 무늬가 완전히 같지 않을 수 있습니다.',
        '해외 판매처의 크기·무게 표기가 서로 달라 블로그에 정확한 수치를 넣기 전 매장 실물 측정이 필요합니다.'
      ],
      recommend: '잉크색과 잔량을 보는 재미, 블루 마블, 다양한 닙 굵기를 중요하게 보는 분',
      blogCopy: '사파이어 데모는 블루 마블의 반투명 바디와 블랙 닙이 어우러져 잉크를 채운 뒤의 모습까지 즐길 수 있는 모델입니다. 해외 판매처 기준 약 3.5ml의 넉넉한 용량으로 안내되며, 블루블랙에서는 EF·F·M·B 블랙 닙 옵션을 확인할 수 있습니다. 다만 투명한 바디는 잉크 얼룩과 세척 상태가 잘 보이고 개체마다 마블 무늬가 달라, 실물의 색감과 패턴을 직접 비교하는 재미가 큰 제품입니다.',
      sources: [
        ['블루블랙 판매 페이지', 'https://blueblack.co.kr/product/오퍼스88-사파이어-데모-만년필/4784/category/191/display/1/'],
        ['Pen Boutique 제품 정보', 'https://www.penboutique.com/products/opus-88-demo-fountain-pen-2024-sapphire'],
        ['Goldspot 제품 정보', 'https://goldspot.com/products/opus-88-demonstrator-fountain-pen-in-sapphire'],
        ['Cult Pens 제품 정보', 'https://cultpens.com/products/opus-88-demonstrator-eye-dropper-fountain-pen-sapphire']
      ]
    }
  ];

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[ch]);

  const productMarkup = (product) => `
    <article class="opus-research-product" data-opus-product="${product.key}">
      <div class="opus-product-visual">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)} 제품 이미지" loading="lazy" />
        <div><span>BLUEBLACK PRICE</span><strong>${escapeHTML(product.price)}</strong><small>소비자가 ${escapeHTML(product.listPrice)}</small></div>
      </div>
      <div class="opus-product-title">
        <div><p>${escapeHTML(product.tagline)}</p><h4>${escapeHTML(product.name)}</h4></div>
        <a href="${escapeHTML(product.shopUrl)}" target="_blank" rel="noopener noreferrer">자사몰 ↗</a>
      </div>
      <div class="opus-product-options"><span>판매 옵션</span><strong>${escapeHTML(product.options)}</strong></div>
      <div class="opus-product-facts">${product.facts.map(([label, value]) => `<div><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></div>`).join('')}</div>
      <div class="opus-procon-grid">
        <section class="opus-pros"><h5>장점</h5><ul>${product.strengths.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul></section>
        <section class="opus-cons"><h5>아쉬운 점</h5><ul>${product.weaknesses.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul></section>
      </div>
      <div class="opus-recommend"><span>추천 대상</span><strong>${escapeHTML(product.recommend)}</strong></div>
      <div class="opus-blog-copy"><div><span>BLOG INSERT</span><strong>초안에 넣을 제품 설명</strong></div><p>${escapeHTML(product.blogCopy)}</p><button type="button" data-copy-opus="${product.key}">문장 복사</button></div>
      <details class="opus-sources"><summary>검증 자료 ${product.sources.length}개</summary>${product.sources.map(([name, url]) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer"><span>${escapeHTML(name)}</span><b>↗</b></a>`).join('')}</details>
    </article>`;

  function comparisonMarkup() {
    return `
      <section id="opus88-product-research" class="opus88-product-research">
        <div class="opus-research-head">
          <div><p>OPUS 88 PRODUCT RESEARCH</p><h3>재입고 제품별 정보·장단점</h3><span>공식 구조와 국내외 판매 자료, 실사용 평가를 자사몰 판매 옵션과 대조했습니다.</span></div>
          <b>2026.07.02 확인</b>
        </div>
        <div class="opus-common-guide">
          <div><span>01</span><strong>섹션을 열고 스포이드로 병 잉크를 바디에 직접 넣습니다.</strong></div>
          <div><span>02</span><strong>필기할 때 후면 노브를 조금 풀어 잉크가 피드로 흐르게 합니다.</strong></div>
          <div><span>03</span><strong>이동·보관할 때 밸브를 잠그면 누수와 잉크 버핑 위험을 줄일 수 있습니다.</strong></div>
          <p>세 모델 모두 대용량과 차단 밸브가 핵심입니다. 반대로 카트리지처럼 빠르게 교체할 수 없고, 충전·세척과 밸브 조작을 익혀야 한다는 점을 함께 안내해야 합니다.</p>
        </div>
        <div class="opus-quick-table">
          <div class="opus-table-head"><span>모델</span><span>용량</span><span>무게</span><span>포스팅</span><span>핵심 선택 이유</span></div>
          <div><strong>하모니</strong><span>약 2.6ml</span><span>약 25g</span><span>불가</span><span>마블·로즈골드·가벼움</span></div>
          <div><strong>재즈</strong><span>약 2.97ml</span><span>약 28g</span><span>가능</span><span>전통적 형태·균형·잉크창</span></div>
          <div><strong>사파이어 데모</strong><span>약 3.5ml</span><span>약 23~27g</span><span>불가</span><span>잉크가 보이는 블루 비주얼</span></div>
        </div>
        <div class="opus-product-list">${products.map(productMarkup).join('')}</div>
        <div class="opus-final-check">
          <strong>게시 전 실물 확인</strong>
          <p>재입고 수량, 색상별 닙 재고, 기본 구성품, 실제 무게와 길이, 캡 포스팅 여부를 촬영 당일 확인하세요. 특히 사파이어 데모의 크기·무게는 해외 판매처 표기가 달라 웹에는 범위로 표시했습니다.</p>
        </div>
      </section>`;
  }

  function bind(section) {
    section.querySelectorAll('[data-copy-opus]').forEach((button) => button.addEventListener('click', async () => {
      const product = products.find((item) => item.key === button.dataset.copyOpus);
      if (!product) return;
      try {
        await navigator.clipboard.writeText(product.blogCopy);
        const original = button.textContent;
        button.textContent = '복사됨';
        setTimeout(() => { button.textContent = original; }, 1200);
      } catch { window.alert('복사하지 못했습니다. 문장을 직접 선택해 주세요.'); }
    }));
  }

  function mount() {
    if (location.hash.replace(/^#\//, '') !== 'admin') return;
    const panel = document.querySelector('#july-blog-workbench [data-july-blog-panel="draft"]');
    if (!panel || document.getElementById('opus88-product-research')) return;
    panel.insertAdjacentHTML('beforeend', comparisonMarkup());
    bind(document.getElementById('opus88-product-research'));
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(mount, 100);
  }

  window.addEventListener('DOMContentLoaded', schedule, { once: true });
  window.addEventListener('hashchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
