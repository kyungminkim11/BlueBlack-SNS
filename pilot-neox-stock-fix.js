(() => {
  'use strict';

  const configs = window.BLUEBLACK_JULY_PRODUCTS || [];
  const copyStore = window.BLUEBLACK_COPY_VARIANTS = window.BLUEBLACK_COPY_VARIANTS || {};
  const contentStore = window.BLUEBLACK_PRODUCT_CONTENT = window.BLUEBLACK_PRODUCT_CONTENT || {};
  const config = configs.find((item) => item.key === 'pilot-neox-wakaru');

  if (config) {
    const finalDraft = `✏️

파이롯트 네옥스 그래파이트 와카루 샤프심을 소개합니다!✨

진하고 부드러운 필기감으로 꾸준히 사랑받는 네옥스 그래파이트가
일러스트레이터 와카루와 만나 특별한 패키지로 완성되었습니다.👀

0.5mm 규격의 HB와 B 두 가지 경도로 구성되며,
총 6가지 패키지를 만나보실 수 있는데요!
심경과 경도가 한눈에 보이는 케이스에 오리지널 스티커가 함께 들어 있어
취향대로 꾸미는 재미까지 더했답니다.🌈

네옥스 그래파이트 특유의 진하고 부드러운 필기감은 그대로,
필통 속 작은 문구에 귀여운 포인트를 더해보세요.✍️

한정 수량으로 만나볼 수 있는 와카루 패키지를
지금 블루블랙 펜샵에서 만나보세요~!🏷

#파이롯트 #PILOT #네옥스그래파이트 #NEOXGraphite #WAKARU #와카루 #샤프심 #샤프심추천 #샤프펜슬 #샤프리필 #샤프심케이스 #05mm샤프심 #한정문구 #문구신제품 #문구추천 #필기구 #필기구추천 #공부문구 #블루블랙펜샵 #블블샵`;

    config.content = {
      ...(config.content || {}),
      name: '파이롯트 네옥스 그래파이트 와카루 샤프심',
      intro: '0.5mm 규격의 HB와 B 두 가지 경도, 총 6가지 한정 패키지로 구성된 네옥스 그래파이트 샤프심입니다.',
      description: '파이롯트 네옥스 그래파이트와 일러스트레이터 와카루가 함께한 한정 패키지입니다. 블루블랙에서 소개하는 제품은 0.5mm 규격이며 HB와 B 두 가지 경도, 총 6가지 패키지로 구성됩니다. 심경과 경도는 케이스에서 확인할 수 있고 오리지널 스티커로 직접 꾸밀 수 있습니다.',
      feature: '0.5mm 규격, HB·B 두 가지 경도, 총 6가지 패키지, 와카루 오리지널 스티커',
      photo: '0.5mm 6종 패키지 비교, HB·B 경도 표기, 동봉 스티커, 꾸미기 전후, 실제 필기 농도',
      notice: '판매 제품은 0.5mm 규격이며 HB와 B 두 가지 경도로 구성됩니다. 패키지별 재고는 게시 직전에 다시 확인하세요.'
    };

    config.facts = [
      ['업로드 예정일', '2026.07.02'],
      ['규격', '0.5mm'],
      ['경도', 'HB · B 두 가지'],
      ['패키지', '총 6가지'],
      ['구성', '와카루 오리지널 데코레이션 스티커'],
      ['표기 방식', '심경과 경도를 케이스에서 확인'],
      ['공식 특징', '진하고 부드러운 필기감'],
      ['제품 성격', '한정 수량 패키지'],
      ['해시태그 기준', '관련 태그 20개']
    ];

    config.caution = '게시글에는 0.5mm 규격, HB와 B 두 가지 경도, 총 6가지 패키지만 안내합니다. 와카루는 본문에서 한글로 표기하세요.';

    const existing = Array.isArray(config.variants)
      ? [...config.variants]
      : ((config.ids || []).map((id) => copyStore[id]).find(Array.isArray) || []);
    const variants = [finalDraft, ...existing.slice(1)];

    config.variants = variants;
    (config.ids || []).forEach((id) => {
      copyStore[id] = variants;
      contentStore[id] = config.content;
    });
  }

  const previousParse = JSON.parse.bind(JSON);
  const readJSON = (url) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    if (request.status !== 200 && request.status !== 0) throw new Error(`load_failed:${url}`);
    return previousParse(request.responseText);
  };

  try {
    const core = readJSON('./pilot-capless-core.json?v=20260707-1');
    const drafts = [
      ...readJSON('./pilot-capless-drafts-a.json?v=20260707-1'),
      ...readJSON('./pilot-capless-drafts-b.json?v=20260707-1')
    ];
    const ids = [core.productId, ...(core.aliases || [])];

    core.product.draft.text = drafts[0] || '';
    ids.forEach((id) => {
      copyStore[id] = drafts;
      contentStore[id] = core.content;
    });

    window.BLUEBLACK_DRAFTS = window.BLUEBLACK_DRAFTS || {};
    ids.forEach((id) => { window.BLUEBLACK_DRAFTS[id] = drafts[0] || ''; });

    window.BLUEBLACK_PENDING_PRODUCTS = window.BLUEBLACK_PENDING_PRODUCTS || [];
    if (!window.BLUEBLACK_PENDING_PRODUCTS.some((item) => item.productId === core.productId)) {
      window.BLUEBLACK_PENDING_PRODUCTS.push(core.pending);
    }

    JSON.parse = function pilotCaplessPendingParse(text, reviver) {
      const data = previousParse(text, reviver);
      try {
        if (data && data.meta && Array.isArray(data.events) && data.products) {
          data.products[core.productId] = core.product;
          data.events = data.events.filter((event) => !ids.includes(event.productId));
          data.meta.updatedAt = '2026.07.07';
        }
      } catch (error) {
        console.warn('파이롯트 캡리스 미정 정보를 반영하지 못했습니다.', error);
      }
      return data;
    };
  } catch (error) {
    console.warn('파이롯트 캡리스 미정 자료를 불러오지 못했습니다.', error);
  }

  const loadSupportingFiles = () => {
    if (!document.querySelector('link[data-pending-schedule-style]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './pending-schedule.css?v=20260707-1';
      link.dataset.pendingScheduleStyle = 'true';
      document.head.appendChild(link);
    }

    [
      ['./pending-schedule.js?v=20260707-1', 'pending-schedule-loader'],
      ['./pilot-capless-all-drafts.js?v=20260707-1', 'pilot-capless-draft-loader']
    ].forEach(([src, marker]) => {
      if (document.querySelector(`script[data-loader="${marker}"]`)) return;
      const script = document.createElement('script');
      script.src = src;
      script.dataset.loader = marker;
      script.async = true;
      document.head.appendChild(script);
    });
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', loadSupportingFiles, { once: true });
  } else {
    loadSupportingFiles();
  }
})();