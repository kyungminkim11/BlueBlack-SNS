(() => {
  'use strict';

  const STORAGE_KEY = 'blueblack-admin-blog-plan-v1';
  const MIGRATION_KEY = 'blueblack-july-blog-plan-v2';
  const ANALYSIS_URL = './naver-blog-latest-analysis.json';
  let timer = null;
  let analysisCache = null;

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[ch]);

  const draft = `안녕하세요! 블루블랙 펜샵 Kevin입니다.

오늘은 오퍼스88 만년필을 기다려주셨던 분들께 반가운 재입고 소식을 전해드리려고 합니다!

개성 있는 컬러와 큼직한 바디, 잉크가 담긴 모습을 그대로 감상할 수 있는 디자인으로 꾸준히 사랑받아온 오퍼스88 만년필이 블블샵에 다시 찾아왔습니다.✨

[사진 1 | 재입고된 오퍼스88 만년필 전체 대표 컷]

오퍼스88는 모델마다 바디의 형태와 컬러 조합이 확실해, 같은 브랜드 안에서도 취향에 맞는 한 자루를 고르는 재미가 큰데요.

이번에는 차분한 색감부터 투명한 데모 바디까지 서로 다른 매력을 가진 제품들을 함께 살펴보겠습니다!

[사진 2 | 오퍼스88 로고와 캡 디테일]
[사진 3 | 재입고 제품을 한 줄로 배열한 전체 컷]

오퍼스88 하모니 만년필

부드러운 곡선의 바디와 선명한 색 조합이 돋보이는 하모니입니다. 손에 쥐었을 때 존재감이 느껴지는 크기와 화려한 패턴을 좋아하시는 분이라면 먼저 눈여겨보기 좋은 모델인데요.

빛의 방향에 따라 달라지는 바디의 표정과 세부 컬러를 가까이에서 확인해 보세요.

[사진 4 | 하모니 전체 모습]
[사진 5 | 하모니 바디 패턴과 펜촉 확대]

오퍼스88 재즈 만년필

재즈는 단정한 실루엣과 클래식한 분위기가 매력적인 모델입니다.

라이트 블루, 레드, 블랙처럼 컬러에 따라 인상이 확연히 달라져서 밝고 산뜻한 색을 좋아하는 분부터 차분한 색을 선호하는 분까지 폭넓게 고르실 수 있답니다.

[사진 6 | 재즈 라이트 블루·레드·블랙 비교]
[사진 7 | 재즈 캡과 클립 디테일]
[사진 8 | 재즈를 손에 쥔 크기 비교]

오퍼스88 사파이어 데모 만년필

잉크가 담긴 모습을 감상하는 즐거움을 중요하게 생각한다면 사파이어 데모도 함께 살펴보세요.

투명감이 살아 있는 바디와 시원한 블루 컬러가 어우러져 여름철에 사용하기에도 잘 어울리는 인상을 보여줍니다. 어떤 잉크를 채우느냐에 따라 펜의 분위기가 달라지는 점도 투명 만년필만의 매력입니다.💙

[사진 9 | 사파이어 데모 전체 모습]
[사진 10 | 잉크가 보이는 투명 바디 확대]
[사진 11 | 블루 계열 잉크와 함께 연출한 컷]

모델별로 선택 가능한 펜촉과 현재 재고는 다를 수 있으니, 구매 전 자사몰의 옵션을 확인해 주세요.

오프라인 매장에서는 실제 크기와 색감, 손에 쥐었을 때의 느낌을 비교하며 살펴보실 수 있습니다. 사진만으로 고민되셨다면 직접 여러 모델을 나란히 놓고 취향에 맞는 한 자루를 골라보세요!

[사진 12 | 모델별 크기 비교]
[사진 13 | 종이에 직접 필기하는 모습]
[사진 14 | 펜촉 굵기 비교 필기 샘플]

오랜만에 다시 만나는 오퍼스88 만년필!

하모니와 재즈, 사파이어 데모처럼 각기 다른 매력을 가진 모델들을 지금 블루블랙 펜샵에서 만나보세요.😊

[사진 15 | 블루블랙 매장 진열 또는 마무리 대표 컷]

※ 재입고 제품과 펜촉 옵션은 실시간 재고에 따라 달라질 수 있습니다. 정확한 판매 상태는 자사몰 또는 매장에서 확인해 주세요.`;

  const topics = [
    ['7월 시즌 1순위', '여름철 만년필과 잉크 관리법', '고온·직사광선·차량 보관·휴대 시 주의사항을 정리하는 검색형 콘텐츠'],
    ['7월 시즌', '장마철 노트와 종이 보관법', '습기와 종이 휨을 줄이는 보관 방법 및 제습 팁'],
    ['7월 시즌', '휴가 갈 때 챙기기 좋은 만년필과 노트', '휴대성과 기록 용도를 중심으로 여행용 문구 조합 추천'],
    ['7월 시즌', '여름에 어울리는 블루·터쿼이즈 잉크 추천', '시원한 색감의 잉크를 발색 사진과 함께 소개'],
    ['7월 시즌', '여름 데스크 셋업 추천', '시원한 컬러의 펜·노트·데스크 소품을 한 번에 큐레이션'],
    ['사용법', '아이드로퍼 만년필 처음 사용하는 법', '잉크 주입부터 휴대 전 확인까지 초보자용 단계별 안내'],
    ['사용법', '만년필 세척은 언제 해야 할까?', '잉크 교체·장기 미사용·흐름 불량 상황별 세척 기준'],
    ['사용법', '만년필이 갑자기 안 나올 때 확인할 것', '잉크 잔량·펜촉·피드·세척 여부를 순서대로 점검'],
    ['사용법', '카트리지·컨버터·피스톤·아이드로퍼 차이', '충전 방식별 장단점과 추천 대상을 비교'],
    ['사용법', '투명 만년필 착색을 줄이는 관리법', '잉크 선택과 세척 주기, 보관 시 주의사항 소개'],
    ['비교', '오퍼스88 재즈·하모니·데모 비교', '바디 디자인·크기·투명감·추천 취향을 한눈에 비교'],
    ['비교', 'EF·F·M 펜촉 굵기 실제 필기 비교', '같은 잉크와 종이로 굵기 차이를 촬영하는 검색형 글'],
    ['비교', '입문용 만년필 10만원대 추천', '예산별 후보와 사용 목적을 정리하는 구매 가이드'],
    ['비교', '투명 만년필 브랜드별 매력 비교', '오퍼스88·트위스비 등 투명 바디의 특징과 선택 기준'],
    ['비교', '만년필용 노트 종이별 잉크 발색 비교', '마쉬멜로우지·알토크림·코니퍼 등 동일 잉크 테스트'],
    ['구매 가이드', '첫 만년필 고를 때 꼭 확인할 7가지', '펜촉·그립·무게·충전 방식·예산·A/S·시필을 설명'],
    ['구매 가이드', '만년필 선물 고르는 법', '입학·취업·생일·퇴직 등 상황별 제품과 각인 선택법'],
    ['구매 가이드', '잉크 한 병을 고를 때 보는 기준', '색상 외에 용량·건조 속도·번짐·세척 난이도를 안내'],
    ['구매 가이드', '필기량이 많은 사람을 위한 만년필', '잉크 용량과 그립 피로도를 중심으로 추천'],
    ['구매 가이드', '한정판 만년필 구매 전 체크리스트', '실물 색감·구성품·닙·재고·A/S를 확인하는 방법'],
    ['매장 콘텐츠', '블루블랙 펜샵 시필 가이드', '처음 방문한 고객이 매장에서 제품을 비교하는 순서'],
    ['매장 콘텐츠', '직원이 직접 고른 여름 만년필 5종', '직원별 선택 이유와 추천 잉크를 함께 소개'],
    ['매장 콘텐츠', '블루블랙에서 만나는 대만 문구 브랜드', '오퍼스88와 코니퍼 등 대만 브랜드를 묶어 소개'],
    ['매장 콘텐츠', '매장에서 가장 많이 받는 만년필 질문', '고객 FAQ를 묶어 신뢰도와 검색 유입을 높이는 글'],
    ['브랜드', '오퍼스88 브랜드와 대표 라인업 알아보기', '재즈·하모니·데모·오마르 등 라인별 디자인 중심 소개'],
    ['브랜드', '세일러 펜뷔페 조합 고르는 방법', '새로운 컬러 조합과 실제 선택 과정을 상세히 안내'],
    ['브랜드', '톤랜드 6공 다이어리 활용법', '리필 구성과 일정·메모·가계부 조합 사례 소개'],
    ['종이·기록', '필사에 잘 맞는 노트 고르는 법', '줄 간격·종이색·비침·펼침성을 기준으로 안내'],
    ['종이·기록', '만년필 잉크가 종이마다 다르게 보이는 이유', '발색·번짐·비침 차이를 실제 사진으로 설명'],
    ['종이·기록', '여행 기록을 오래 남기는 문구 조합', '휴대용 펜·노트·스티커·보관 방법을 제안']
  ];

  const photoPlan = [
    '재입고 제품 전체 대표 컷', '브랜드 로고·캡 디테일', '전 제품 일렬 배열',
    '하모니 전체', '하모니 패턴·펜촉 확대', '재즈 3색 비교', '재즈 클립 디테일',
    '손에 쥔 크기', '사파이어 데모 전체', '투명 바디 확대', '잉크를 채운 연출',
    '모델별 크기 비교', '실제 필기 장면', '펜촉 굵기 비교', '매장 진열 마무리 컷'
  ];

  const titleOptions = [
    '오퍼스88 만년필 전격 재입고｜하모니·재즈·사파이어 데모를 다시 만나보세요',
    '기다리셨던 오퍼스88 만년필 재입고 소식!',
    '오퍼스88 재즈·하모니·사파이어 데모 만년필 재입고',
    '대용량 잉크와 개성 있는 디자인, 오퍼스88 만년필이 돌아왔습니다',
    '블루블랙 펜샵 오퍼스88 재입고｜모델별 매력 살펴보기'
  ];

  function readData() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
    catch { return null; }
  }

  function writeData(data) {
    data.updatedAt = new Date().toLocaleString('ko-KR');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function migratePlan() {
    if (localStorage.getItem(MIGRATION_KEY) === 'done') return;
    const data = readData();
    const slots = data?.months?.['2026-07'];
    if (!Array.isArray(slots) || slots.length < 2) return;

    slots[0] = {
      ...slots[0],
      targetWindow: '7월 1~2주차',
      title: '오퍼스88 전격 재입고',
      category: '브랜드·입점 소식',
      status: '초안 작성',
      memo: '최신 블로그 6개 말투를 참고한 전체 초안과 사진 15장 구성안을 아래에서 확인. 실제 재입고 모델·펜촉 옵션·재고는 게시 직전 최종 확인.'
    };
    slots[1] = {
      ...slots[1],
      targetWindow: '7월 3~4주차',
      title: '여름철 만년필과 잉크 관리법',
      category: '관리·보관 가이드',
      status: '아이디어',
      memo: '7월 시즌성과 검색 유입을 고려한 1순위 추천. 아래 주제 후보 30개 중 다른 주제로 변경 가능.'
    };
    writeData(data);
    localStorage.setItem(MIGRATION_KEY, 'done');
  }

  async function loadAnalysis() {
    if (analysisCache) return analysisCache;
    try {
      const response = await fetch(ANALYSIS_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error();
      analysisCache = await response.json();
      return analysisCache;
    } catch {
      return null;
    }
  }

  function analysisMarkup(data) {
    if (!data?.posts?.length) return '<p class="july-blog-muted">최신 글 분석 데이터를 불러오지 못했습니다.</p>';
    return `
      <div class="july-blog-analysis-summary">
        <div><span>확인 글</span><strong>${data.count}개</strong></div>
        <div><span>RSS 평균 미리보기</span><strong>${data.summary.average_text_length}자</strong></div>
        <div><span>범위</span><strong>${data.summary.min_text_length}~${data.summary.max_text_length}자</strong></div>
        <div><span>말투</span><strong>직원 인사 + 친근한 소개</strong></div>
      </div>
      <div class="july-blog-recent-list">
        ${data.posts.map((post, index) => `
          <a href="${escapeHTML(post.link)}" target="_blank" rel="noopener noreferrer">
            <b>${String(index + 1).padStart(2, '0')}</b>
            <span><strong>${escapeHTML(post.title)}</strong><small>${escapeHTML(post.published.slice(5, 16))} · RSS 미리보기 ${post.text_length}자</small></span>
            <em>↗</em>
          </a>`).join('')}
      </div>
      <div class="july-blog-analysis-note">
        <strong>작성 패턴</strong>
        <p>“안녕하세요! 블루블랙 펜샵 ○○입니다”로 시작하고, 소식을 바로 밝힌 뒤 제품·이벤트의 핵심을 짧은 문단과 목록으로 설명합니다. 느낌표와 이모지를 가볍게 사용하며 마지막에는 구매 또는 방문을 안내합니다.</p>
        <small>RSS는 본문 일부와 대표 이미지 위주로 제공되므로 실제 전체 글자 수와 사진 수는 더 많을 수 있습니다. 이번 초안은 게시용 분량과 사진 15장 구성으로 확장했습니다.</small>
      </div>`;
  }

  function topicMarkup() {
    const groups = [...new Set(topics.map(([group]) => group))];
    return groups.map((group) => `
      <section class="july-topic-group">
        <h4>${escapeHTML(group)}</h4>
        <div class="july-topic-list">
          ${topics.filter(([itemGroup]) => itemGroup === group).map(([, title, note], index) => `
            <article class="july-topic-item ${group.includes('1순위') ? 'recommended' : ''}">
              <div><strong>${escapeHTML(title)}</strong><p>${escapeHTML(note)}</p></div>
              <button type="button" data-apply-topic="${escapeHTML(title)}" data-topic-note="${escapeHTML(note)}">3~4주차 적용</button>
            </article>`).join('')}
        </div>
      </section>`).join('');
  }

  function sectionMarkup(analysis) {
    const charCount = draft.replace(/\s/g, '').length;
    return `
      <section id="july-blog-workbench" class="july-blog-workbench">
        <div class="july-blog-head">
          <div><p>JULY NAVER BLOG</p><h2>7월 블로그 주제·초안</h2><span>최근 게시물 6개 분석을 바탕으로 준비한 1~2주차 원고와 3~4주차 후보입니다.</span></div>
          <a href="https://blog.naver.com/paikorea" target="_blank" rel="noopener noreferrer">회사 블로그 열기 ↗</a>
        </div>

        <div class="july-blog-tabs" role="tablist">
          <button type="button" class="active" data-july-blog-tab="draft">1~2주차 초안</button>
          <button type="button" data-july-blog-tab="topics">3~4주차 주제 ${topics.length}개</button>
          <button type="button" data-july-blog-tab="analysis">최신 글 6개 분석</button>
        </div>

        <div class="july-blog-panel active" data-july-blog-panel="draft">
          <div class="july-blog-grid">
            <section class="july-blog-card">
              <div class="july-blog-card-head"><div><span>BLOG DRAFT</span><h3>오퍼스88 전격 재입고</h3></div><b>${charCount.toLocaleString()}자 · 사진 15장</b></div>
              <div class="july-title-options">
                <strong>제목 후보</strong>
                ${titleOptions.map((title, index) => `<button type="button" data-copy-title="${escapeHTML(title)}"><span>${index + 1}</span>${escapeHTML(title)}</button>`).join('')}
              </div>
              <textarea id="july-opus-blog-draft" rows="34" spellcheck="false">${escapeHTML(draft)}</textarea>
              <div class="july-draft-actions">
                <button id="july-copy-blog-draft" type="button">전체 초안 복사</button>
                <button id="july-download-blog-draft" type="button">TXT 저장</button>
              </div>
            </section>

            <aside class="july-blog-card july-photo-card">
              <div class="july-blog-card-head"><div><span>PHOTO PLAN</span><h3>촬영·삽입 순서</h3></div><b>15컷</b></div>
              <ol>${photoPlan.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ol>
              <div class="july-blog-caution">
                <strong>게시 전 확인</strong>
                <p>현재 자사몰의 오퍼스88 카테고리에는 하모니, 재즈 라이트 블루·레드·블랙, 사파이어 데모 등이 표시됩니다. 실제 재입고 제품, 닙 옵션과 판매 가능 상태는 촬영 당일 다시 확인하세요.</p>
              </div>
              <div class="july-blog-keywords"><strong>검색 키워드</strong><p>오퍼스88 · 오퍼스88 만년필 · 오퍼스88 재입고 · 재즈 만년필 · 하모니 만년필 · 데모 만년필 · 투명 만년필 · 블루블랙 펜샵</p></div>
            </aside>
          </div>
        </div>

        <div class="july-blog-panel" data-july-blog-panel="topics">
          <div class="july-topic-intro"><strong>1순위 추천: 여름철 만년필과 잉크 관리법</strong><p>7월의 계절성과 정보 검색 수요를 함께 잡을 수 있고, 앞선 오퍼스88 재입고 글과 내용이 겹치지 않아 다음 글로 연결하기 좋습니다.</p></div>
          ${topicMarkup()}
        </div>

        <div class="july-blog-panel" data-july-blog-panel="analysis">
          ${analysisMarkup(analysis)}
        </div>
      </section>`;
  }

  function applyTopic(title, note) {
    const data = readData();
    const slots = data?.months?.['2026-07'];
    if (!Array.isArray(slots) || !slots[1]) return;
    slots[1].targetWindow = '7월 3~4주차';
    slots[1].title = title;
    slots[1].status = '아이디어';
    slots[1].memo = note;
    writeData(data);
    localStorage.setItem(MIGRATION_KEY, 'done');
    const titleInput = document.querySelector('.admin-blog-slot[data-slot-index="1"] [data-field="title"]');
    const memoInput = document.querySelector('.admin-blog-slot[data-slot-index="1"] [data-field="memo"]');
    if (titleInput) titleInput.value = title;
    if (memoInput) memoInput.value = note;
  }

  function bind(section) {
    section.querySelectorAll('[data-july-blog-tab]').forEach((button) => button.addEventListener('click', () => {
      const tab = button.dataset.julyBlogTab;
      section.querySelectorAll('[data-july-blog-tab]').forEach((item) => item.classList.toggle('active', item === button));
      section.querySelectorAll('[data-july-blog-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.julyBlogPanel === tab));
    }));

    section.querySelector('#july-copy-blog-draft')?.addEventListener('click', async (event) => {
      const text = section.querySelector('#july-opus-blog-draft')?.value || draft;
      try {
        await navigator.clipboard.writeText(text);
        const button = event.currentTarget;
        const original = button.textContent;
        button.textContent = '복사됨';
        setTimeout(() => { button.textContent = original; }, 1300);
      } catch { window.alert('복사하지 못했습니다. 초안 영역을 직접 선택해 주세요.'); }
    });

    section.querySelector('#july-download-blog-draft')?.addEventListener('click', () => {
      const text = section.querySelector('#july-opus-blog-draft')?.value || draft;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = '2026-07-오퍼스88-재입고-블로그-초안.txt';
      anchor.click();
      URL.revokeObjectURL(url);
    });

    section.querySelectorAll('[data-copy-title]').forEach((button) => button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copyTitle);
        button.classList.add('copied');
        setTimeout(() => button.classList.remove('copied'), 1000);
      } catch {}
    }));

    section.querySelectorAll('[data-apply-topic]').forEach((button) => button.addEventListener('click', () => {
      applyTopic(button.dataset.applyTopic, button.dataset.topicNote || '');
      const original = button.textContent;
      button.textContent = '적용 완료';
      button.classList.add('applied');
      setTimeout(() => { button.textContent = original; button.classList.remove('applied'); }, 1300);
    }));
  }

  async function mount() {
    if (location.hash.replace(/^#\//, '') !== 'admin') return;
    migratePlan();
    const adminSection = document.querySelector('.admin-blog-section');
    if (!adminSection || document.getElementById('july-blog-workbench')) return;
    const analysis = await loadAnalysis();
    if (location.hash.replace(/^#\//, '') !== 'admin' || document.getElementById('july-blog-workbench')) return;
    adminSection.insertAdjacentHTML('afterend', sectionMarkup(analysis));
    bind(document.getElementById('july-blog-workbench'));
  }

  function scheduleMount() {
    clearTimeout(timer);
    timer = setTimeout(mount, 80);
  }

  window.addEventListener('DOMContentLoaded', scheduleMount, { once: true });
  window.addEventListener('hashchange', scheduleMount);
  new MutationObserver(scheduleMount).observe(document.documentElement, { childList: true, subtree: true });
})();
