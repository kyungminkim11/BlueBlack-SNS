(() => {
  'use strict';

  const PRODUCT_ID = 'sailor-new-arrivals-0707';
  const EVENT_DATE = '2026-07-07';
  const TITLE = '세일러 신제품 입고 · 프로피트 캐주얼 잉크 증정';
  const DIRECT_ROUTE_KEY = 'blueblack-sailor-0707-route';
  const hashtags = '#블루블랙펜샵 #세일러 #세일러만년필 #프로기어 #셀레스티얼아웃플로우 #프로피트캐주얼 #만년필신제품 #만년필입고 #쓰리오잉크 #베이직잉크 #만년필잉크 #문구스타그램 #SailorPen #FountainPen';

  const variants = [
`🖋️

세일러 신제품이 새롭게 입고되었습니다!

이번에 만나보실 수 있는 제품은 세일러 프로기어 셀레스티얼 아웃플로우 21K / 14K, 세일러 프로피트 캐주얼 라지 투명 만년필 GT, 세일러 프로피트 캐주얼 라지 베이시스 만년필 GT입니다.

프로기어 셀레스티얼 아웃플로우는 21K와 14K 두 가지로, 프로피트 캐주얼 라지는 투명과 베이시스 GT 두 모델로 준비했습니다. 각 제품의 서로 다른 인상을 매장에서 천천히 비교해 보세요. ✨

프로피트 캐주얼 구매 시 제품 1개당 쓰리오 베이직 잉크 1병을 함께 증정합니다. 이벤트는 2026년 9월 30일까지 진행되며, 증정품 재고 소진 시 조기 종료될 수 있습니다. 🎁

증정품은 교환 및 환불이 어렵습니다.

새롭게 입고된 세일러 만년필과 잉크를 블루블랙 펜샵에서 만나보세요!

${hashtags}`,
`🌌

세일러 프로기어 셀레스티얼 아웃플로우 21K / 14K가 입고되었습니다!

이번 입고에서는 21K와 14K 두 가지를 함께 만나보실 수 있어, 원하는 구성을 직접 비교해 보기 좋습니다.

세일러 프로피트 캐주얼 라지 라인업도 함께 준비했습니다.

💎 프로피트 캐주얼 라지 투명 만년필 GT
🖋️ 프로피트 캐주얼 라지 베이시스 만년필 GT

프로피트 캐주얼 구매 고객님께는 제품 1개당 쓰리오 베이직 잉크 1병을 증정합니다. 행사는 2026년 9월 30일까지이며, 준비된 증정품이 모두 소진되면 예정보다 일찍 종료될 수 있습니다. 🎁

세일러의 새로운 입고 제품을 블루블랙 펜샵에서 확인해 보세요!

${hashtags}`,
`✨

세일러 신제품 3종이 입고되었습니다!

이번 입고 목록을 한눈에 정리해 드립니다.

▪ 세일러 프로기어 셀레스티얼 아웃플로우 21K / 14K
▪ 세일러 프로피트 캐주얼 라지 투명 만년필 GT
▪ 세일러 프로피트 캐주얼 라지 베이시스 만년필 GT

프로기어는 21K와 14K, 프로피트 캐주얼 라지는 투명과 베이시스 GT로 구성되어 있어 모델별 차이를 비교하며 고르실 수 있습니다. 🖋️

프로피트 캐주얼 구매 시 제품 1개당 쓰리오 베이직 잉크 1병을 증정합니다. 이벤트 기간은 2026년 7월 1일부터 9월 30일까지이며, 재고 소진 시 조기 종료됩니다. 🎁

증정품은 교환 및 환불이 어렵습니다.

블루블랙 펜샵에서 직접 만나보세요!

${hashtags}`,
`🎁

프로피트 캐주얼과 함께 쓰리오 베이직 잉크를 만나보세요!

세일러 프로피트 캐주얼 라지 투명 만년필 GT와 베이시스 만년필 GT가 새롭게 입고되었습니다.

이벤트 기간 중 프로피트 캐주얼을 구매하시면 제품 1개당 쓰리오 베이직 잉크 1병을 증정합니다. 행사는 2026년 9월 30일까지 진행되며, 증정품 재고가 소진되면 조기 종료될 수 있습니다.

함께 입고된 세일러 프로기어 셀레스티얼 아웃플로우 21K / 14K도 매장에서 확인하실 수 있습니다. 🌌

증정품은 교환 및 환불이 어렵습니다.

새로운 만년필을 고르고 잉크까지 함께 즐겨보세요. 블루블랙 펜샵에서 만나보세요!

${hashtags}`,
`🖋️

세일러 신제품이 입고되었습니다!

▪ 프로기어 셀레스티얼 아웃플로우 21K / 14K
▪ 프로피트 캐주얼 라지 투명 만년필 GT
▪ 프로피트 캐주얼 라지 베이시스 만년필 GT

프로피트 캐주얼 구매 시 제품 1개당 쓰리오 베이직 잉크 1병을 증정합니다. 이벤트는 2026년 9월 30일까지이며, 재고 소진 시 조기 종료됩니다. 🎁

증정품은 교환 및 환불이 어렵습니다.

블루블랙 펜샵에서 만나보세요!

${hashtags}`
  ];

  const productContent = {
    name: TITLE,
    emoji: '🖋️',
    category: '만년필·입고·이벤트',
    intro: '세일러 신제품 3개 라인업의 입고와 프로피트 캐주얼 구매 사은품을 함께 안내하는 게시물입니다.',
    description: '프로기어 셀레스티얼 아웃플로우 21K / 14K와 프로피트 캐주얼 라지 투명 GT, 베이시스 GT의 입고 사실을 먼저 알리고, 프로피트 캐주얼 구매 시 제품 1개당 쓰리오 베이직 잉크 1병을 증정하는 행사 조건을 함께 전달합니다.',
    feature: '신제품 입고와 구매 혜택을 한 게시물에서 명확하게 전달',
    use: '세일러 만년필의 새 입고 모델을 비교하거나 프로피트 캐주얼 구매를 고려하는 고객',
    photo: '전체 입고 제품 단체 컷, 프로기어 21K·14K 비교, 프로피트 캐주얼 투명·베이시스 비교, 닙·금장 디테일, 증정 잉크와 제품 조합, 행사 포스터',
    notice: '업로드 전에 모델별 실제 재고, 판매가, 닙 옵션과 증정 가능한 잉크 색상을 최종 확인합니다.',
    hashtags
  };

  const product = {
    date: EVENT_DATE,
    weekday: '화',
    type: '신제품 입고 · 이벤트',
    title: TITLE,
    summary: '세일러 프로기어 셀레스티얼 아웃플로우 21K / 14K와 프로피트 캐주얼 라지 투명·베이시스 GT 입고, 프로피트 캐주얼 구매 사은품을 함께 안내합니다.',
    status: '1차안 작성 완료',
    verification: '제품명·행사 조건 확인 완료',
    statusTone: 'verified',
    officialName: '세일러 프로기어 셀레스티얼 아웃플로우 21K / 14K 외 2종',
    facts: [
      { label: '게시일', value: '2026년 7월 7일 화요일', verified: true },
      { label: '신제품 1', value: '세일러 프로기어 셀레스티얼 아웃플로우 21K / 14K', verified: true },
      { label: '신제품 2', value: '세일러 프로피트 캐주얼 라지 투명 만년필 GT', verified: true },
      { label: '신제품 3', value: '세일러 프로피트 캐주얼 라지 베이시스 만년필 GT', verified: true },
      { label: '행사 대상', value: '세일러 프로피트 캐주얼 구매 고객', verified: true },
      { label: '증정 혜택', value: '제품 1개당 쓰리오 베이직 잉크 1병', verified: true },
      { label: '행사 기간', value: '2026년 7월 1일 ~ 9월 30일', verified: true },
      { label: '종료 조건', value: '증정품 재고 소진 시 조기 종료 가능', verified: true },
      { label: '증정품 안내', value: '증정품 교환·환불 불가', verified: true },
      { label: '행사 판매처', value: '쓰리오 베이직 잉크 취급 판매처에 한하여 진행', verified: true }
    ],
    officialImages: [],
    features: [
      '세일러 신제품 3개 라인업의 입고 소식을 한 번에 안내',
      '프로기어 셀레스티얼 아웃플로우 21K와 14K를 함께 소개',
      '프로피트 캐주얼 라지 투명 GT와 베이시스 GT를 나란히 비교',
      '프로피트 캐주얼 구매 사은품의 기간·수량·종료 조건을 명확히 표기'
    ],
    pros: [
      '신제품과 이벤트를 함께 안내해 구매 혜택이 바로 보임',
      '21K·14K, 투명·베이시스처럼 비교 포인트를 사진으로 구성하기 좋음',
      '행사 포스터가 준비되어 있어 조건을 정확하게 보조할 수 있음'
    ],
    cons: [
      '모델별 닙 굵기, 판매가와 실제 재고는 업로드 직전 확인 필요',
      '증정 가능한 잉크 색상과 고객 선택 방식은 매장 운영 기준 확인 필요',
      '증정품 재고 소진 시 행사 종료 문구를 반드시 유지',
      '증정품 교환·환불 불가 안내를 누락하지 않기'
    ],
    sources: [
      { name: '블루블랙 펜샵', url: 'https://blueblack.co.kr/', kind: '자사몰', use: '상품 페이지·가격·재고 게시 전 확인' }
    ],
    referencePosts: [],
    checklist: [
      '세 제품의 자사몰 상품 페이지가 공개되었는지 확인',
      '프로기어 셀레스티얼 아웃플로우 21K·14K의 실제 색상과 닙 옵션 확인',
      '프로피트 캐주얼 라지 투명 GT·베이시스 GT의 가격과 재고 확인',
      '프로피트 캐주얼 행사 적용 범위를 매장 운영 기준으로 확인',
      '증정 가능한 쓰리오 베이직 잉크 색상과 선택 방법 확인',
      '제품 1개당 잉크 1병, 9월 30일까지, 재고 소진 시 조기 종료 문구 유지',
      '증정품 교환·환불 불가 안내 포함',
      '사용자 제공 행사 포스터를 게시 이미지에 함께 첨부',
      '사진 속 제품명과 본문 표기가 정확히 일치하는지 확인'
    ],
    draft: { state: '1차안 작성 완료 · 최종 검수 전', text: variants[0] }
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
        data.meta.updatedAt = '2026.07.06';
      }
    } catch (error) {
      console.warn('7월 7일 세일러 SNS 일정을 추가하지 못했습니다.', error);
    }
    return data;
  };

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[ch]);

  if (location.hash === `#/product/${PRODUCT_ID}`) sessionStorage.setItem(DIRECT_ROUTE_KEY, location.hash);

  function openProduct() {
    location.hash = `#/product/${PRODUCT_ID}`;
  }

  function addCalendarEntry() {
    if (document.querySelector(`.calendar-card [data-product="${PRODUCT_ID}"]`)) return;
    const julyCard = [...document.querySelectorAll('.calendar-card')].find((card) => card.querySelector('.calendar-head h3')?.textContent.includes('2026년 7월'));
    if (!julyCard) return;
    const dayCell = [...julyCard.querySelectorAll('.day-cell')].find((cell) => cell.querySelector('.day-number')?.textContent.trim() === '7');
    const events = dayCell?.querySelector('.day-events');
    if (!dayCell || !events) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'event-button verified';
    button.dataset.product = PRODUCT_ID;
    button.title = TITLE;
    button.setAttribute('aria-label', `${EVENT_DATE} ${TITLE}`);
    button.innerHTML = `<span>${escapeHTML(TITLE)}</span>`;
    button.addEventListener('click', openProduct);
    events.appendChild(button);
    dayCell.classList.add('has-event');

    const count = julyCard.querySelector('.calendar-head span');
    const match = count?.textContent.match(/(\d+)/);
    if (count && match) count.textContent = `${Number(match[1]) + 1}개 일정`;
  }

  function addListEntry() {
    const list = document.getElementById('schedule-list');
    if (!list || list.querySelector(`[data-product="${PRODUCT_ID}"]`)) return;

    const row = document.createElement('article');
    row.className = 'schedule-row verified';
    row.dataset.product = PRODUCT_ID;
    row.tabIndex = 0;
    row.setAttribute('role', 'button');
    row.setAttribute('aria-label', `${EVENT_DATE} ${TITLE} 상세 보기`);
    row.innerHTML = `
      <div class="schedule-date"><strong>07</strong><span>07월 · 화</span></div>
      <div class="schedule-content"><div class="schedule-title">${escapeHTML(TITLE)}</div><div class="schedule-type">신제품 입고 · 이벤트</div><span class="status-pill verified">1차안 작성 완료</span></div>
      <span class="schedule-arrow" aria-hidden="true">→</span>`;
    row.addEventListener('click', openProduct);
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProduct();
      }
    });

    const rows = [...list.querySelectorAll('.schedule-row')];
    const lastJuly7 = rows.filter((item) => item.querySelector('.schedule-date strong')?.textContent.trim() === '07' && item.querySelector('.schedule-date span')?.textContent.includes('07월')).at(-1);
    if (lastJuly7) lastJuly7.insertAdjacentElement('afterend', row);
    else list.appendChild(row);

    const count = document.getElementById('list-count');
    const match = count?.textContent.match(/(\d+)/);
    if (count && match) count.textContent = `${Number(match[1]) + 1}개 게시물`;
  }

  function renderFallbackDetail() {
    if (location.hash !== `#/product/${PRODUCT_ID}`) return;
    const main = document.getElementById('main-content');
    if (!main) return;
    const currentTitle = main.querySelector('.detail-hero h2')?.textContent.trim();
    if (currentTitle === TITLE) return;

    main.innerHTML = `
      <div class="breadcrumb"><button id="back-sailor-schedule" type="button">일정</button><span>›</span><span>${EVENT_DATE}</span></div>
      <section class="detail-hero">
        <div><div class="detail-date">${EVENT_DATE} · 화요일 · 신제품 입고 · 이벤트</div><h2>${escapeHTML(TITLE)}</h2><p>${escapeHTML(product.summary)}</p></div>
        <span class="status-badge verified">1차안 작성 완료 · 제품명·행사 조건 확인 완료</span>
      </section>
      <div class="detail-metrics">
        <div class="metric-chip"><span>VERIFIED FACTS</span><strong>${product.facts.length}/${product.facts.length}</strong></div>
        <div class="metric-chip"><span>SOURCES</span><strong>1개</strong></div>
        <div class="metric-chip"><span>OFFICIAL IMAGES</span><strong>0개</strong></div>
        <div class="metric-chip"><span>DRAFT</span><strong>1차안 작성 완료</strong></div>
      </div>
      <div class="detail-grid">
        <div class="stack">
          <section class="section-card"><div class="section-head"><h3>제품 정보</h3><span>확인된 사실만 표시</span></div><div class="section-body"><div class="fact-list">${product.facts.map((fact) => `<div class="fact-row"><div class="fact-label">${escapeHTML(fact.label)}</div><div class="fact-value">${escapeHTML(fact.value)}</div><div class="fact-state">✓</div></div>`).join('')}</div></div></section>
          <section class="section-card"><div class="section-head"><h3>제품 특징</h3><span>검증 정보 기반</span></div><div class="section-body"><ul class="bullet-list">${product.features.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul></div></section>
          <section class="section-card"><div class="section-head"><h3>1차 원고</h3><span>전일 검토용</span></div><div class="section-body"><div class="draft-box"><div class="draft-topline"><span class="draft-state">1차안 작성 완료 · 최종 검수 전</span><span class="draft-count">${variants[0].length.toLocaleString('ko-KR')}자</span></div><button class="copy-button" id="copy-sailor-draft" type="button">복사</button><pre class="draft-text">${escapeHTML(variants[0])}</pre></div></div></section>
        </div>
        <aside class="stack">
          <section class="section-card"><div class="section-head"><h3>업로드 전 확인</h3><span>체크리스트</span></div><div class="section-body"><ul class="bullet-list">${product.checklist.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul></div></section>
        </aside>
      </div>`;

    document.getElementById('back-sailor-schedule')?.addEventListener('click', () => { location.hash = '#/july'; });
    document.getElementById('copy-sailor-draft')?.addEventListener('click', async (event) => {
      try {
        await navigator.clipboard.writeText(variants[0]);
        event.currentTarget.textContent = '복사됨';
      } catch {
        event.currentTarget.textContent = '복사 실패';
      }
    });
  }

  function restoreDirectRoute() {
    if (!document.querySelector('.workspace')) return;
    const route = sessionStorage.getItem(DIRECT_ROUTE_KEY);
    if (!route) return;
    sessionStorage.removeItem(DIRECT_ROUTE_KEY);
    if (location.hash !== route) location.hash = route;
  }

  let timer = null;
  function applyFallbacks() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      restoreDirectRoute();
      addCalendarEntry();
      addListEntry();
      renderFallbackDetail();
    }, 40);
  }

  window.addEventListener('DOMContentLoaded', applyFallbacks, { once: true });
  window.addEventListener('hashchange', applyFallbacks);
  new MutationObserver(applyFallbacks).observe(document.documentElement, { childList: true, subtree: true });
})();
