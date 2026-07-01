(() => {
  'use strict';

  const API_URL = 'https://jnciddblcndmthmmvqrz.supabase.co/functions/v1/blueblack-workspace';
  const DEVICE_KEY = 'blueblack-trusted-device-v1';
  const STATUSES = ['예정','원고 작성 중','검수 대기','검수 완료','촬영 완료','게시 완료','보류','취소'];
  const CONTENT_TYPES = ['신제품 소개','재입고','사용법','브랜드 이야기','직원 추천','릴스 자막','스토리 문구','블로그용 긴 글'];
  const ROLE_TYPES = ['관리자','작성자','검수자','조회 전용'];
  const REVIEW_DEFAULTS = ['제품명 정확성','가격 확인','색상·재질 확인','공식 링크 확인','판매 여부 확인','맞춤법 확인','해시태그 확인','사진과 내용 일치'];
  const PHOTO_DEFAULTS = ['제품 전체','펜촉·닙','캡과 클립','필기 모습','손에 든 크기','패키지','컬러 비교','매장 진열','릴스 세로 영상'];
  const ASSIGNEE_FIELDS = [['research','자료 조사'],['copy','원고 작성'],['photo','촬영'],['review','검수'],['publish','게시']];

  let timer = null;
  let productLoading = false;
  let adminLoading = false;
  let scheduleLoading = false;
  let saveTimer = null;
  let currentProduct = null;
  let currentSettings = {};
  let lastBootstrapSignature = '';

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  })[ch]);

  function auth() {
    try {
      const parsed = JSON.parse(localStorage.getItem(DEVICE_KEY) || 'null');
      return parsed?.deviceId && parsed?.deviceToken ? { deviceId: parsed.deviceId, deviceToken: parsed.deviceToken } : null;
    } catch { return null; }
  }

  async function api(action, payload = {}) {
    const device = auth();
    if (!device) return { ok:false, status:401, data:{ error:'device_not_saved' } };
    try {
      const response = await fetch(API_URL, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ action, ...device, ...payload }),
        cache:'no-store'
      });
      let data = {};
      try { data = await response.json(); } catch {}
      return { ok:response.ok && data.ok, status:response.status, data };
    } catch {
      return { ok:false, status:0, data:{ error:'network_error' } };
    }
  }

  function currentRoute() { return location.hash.replace(/^#\//,'') || 'schedule'; }
  function currentProductId() {
    const route = currentRoute();
    if (!route.startsWith('product/')) return '';
    try { return decodeURIComponent(route.slice(8)); } catch { return route.slice(8); }
  }
  function todayText() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }
  function dateOnly(value) { return value ? String(value).slice(0,10) : ''; }
  function formatDateTime(value) {
    if (!value) return '기록 없음';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '기록 없음';
    return date.toLocaleString('ko-KR',{ month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit' });
  }
  function asObject(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
  function asArray(value) { return Array.isArray(value) ? value : []; }

  function defaultSettings() {
    return {
      hashtags:['#블루블랙','#blueblack','#만년필','#문구','#stationery'],
      mentions:['@blueblack_korea'],
      reviewItems:REVIEW_DEFAULTS,
      photoItems:PHOTO_DEFAULTS
    };
  }

  function publishingSettings(settings = currentSettings) {
    return { ...defaultSettings(), ...asObject(settings?.publishing) };
  }

  function normalizeRecord(record, productId, title = '', plannedDate = '') {
    return {
      product_id:productId,
      title:record?.title || title,
      planned_date:dateOnly(record?.planned_date || plannedDate),
      status:record?.status || '예정',
      actual_date:dateOnly(record?.actual_date),
      instagram_url:record?.instagram_url || '',
      content_type:record?.content_type || '신제품 소개',
      final_copy:record?.final_copy || '',
      final_copy_label:record?.final_copy_label || '',
      final_confirmed:Boolean(record?.final_confirmed),
      final_confirmed_at:record?.final_confirmed_at || '',
      review_checklist:asObject(record?.review_checklist),
      photo_checklist:asObject(record?.photo_checklist),
      assignees:asObject(record?.assignees),
      metrics:asObject(record?.metrics),
      performance_note:record?.performance_note || '',
      reference_post:Boolean(record?.reference_post),
      reuse_at:dateOnly(record?.reuse_at),
      reuse_type:record?.reuse_type || '',
      internal_note:record?.internal_note || '',
      hashtags:asArray(record?.hashtags),
      mentions:asArray(record?.mentions),
      updated_at:record?.updated_at || '',
      updated_by:record?.updated_by || 'kevin'
    };
  }

  function checkListMarkup(items, values, group) {
    return items.map((item,index) => `
      <label class="ops-check-item ${values[item] ? 'checked' : ''}">
        <input type="checkbox" data-ops-check="${group}" data-check-name="${escapeHTML(item)}" ${values[item] ? 'checked' : ''}>
        <span class="ops-check-box">✓</span><span>${escapeHTML(item)}</span><small>${index+1}/${items.length}</small>
      </label>`).join('');
  }

  function options(values, selected) {
    return values.map((value) => `<option value="${escapeHTML(value)}" ${value === selected ? 'selected' : ''}>${escapeHTML(value)}</option>`).join('');
  }

  function diagnostics(text) {
    const clean = String(text || '');
    const hashtags = clean.match(/#[^\s#]+/g) || [];
    const mentions = clean.match(/@[A-Za-z0-9._]+/g) || [];
    const first = clean.split(/\n\s*\n/)[0] || '';
    const words = clean.toLowerCase().match(/[가-힣a-z0-9]{2,}/g) || [];
    const counts = words.reduce((acc,word) => ((acc[word]=(acc[word]||0)+1),acc),{});
    const repeated = Object.entries(counts).filter(([,count]) => count >= 5).sort((a,b) => b[1]-a[1]).slice(0,3);
    const warnings = [];
    if (clean.length > 2200) warnings.push('Instagram 본문이 매우 깁니다.');
    if (first.length > 140) warnings.push('첫 문단이 길어 모바일에서 답답할 수 있습니다.');
    if (hashtags.length > 20) warnings.push('해시태그가 20개를 넘습니다.');
    if (repeated.length) warnings.push(`반복 표현: ${repeated.map(([word,count]) => `${word} ${count}회`).join(', ')}`);
    if (!clean.trim()) warnings.push('최종 원고가 비어 있습니다.');
    return { characters:clean.length, hashtags:hashtags.length, mentions:mentions.length, lines:clean.split('\n').length, warnings };
  }

  function adaptCopy(text, type) {
    const source = String(text || '').trim();
    if (!source) return '';
    if (type === '릴스 자막') return source.replace(/([.!?])\s+/g,'$1\n').split('\n').filter(Boolean).slice(0,14).join('\n');
    if (type === '스토리 문구') return `${source.replace(/\s+/g,' ').slice(0,120)}${source.length>120?'…':''}`;
    if (type === '재입고') return `다시 만나볼 수 있습니다.\n\n${source}`;
    if (type === '직원 추천') return `블루블랙 직원이 직접 골라 소개합니다.\n\n${source}`;
    if (type === '사용법') return `사용 전 확인해 주세요.\n\n${source}`;
    if (type === '블로그용 긴 글') return `${source}\n\n제품의 세부 사양과 실제 사용 장면, 추천 대상은 공식 정보와 촬영 자료를 바탕으로 추가 정리합니다.`;
    return source;
  }

  function progress(items, values) {
    const done = items.filter((item) => Boolean(values[item])).length;
    return { done, total:items.length, percent:items.length ? Math.round(done/items.length*100) : 0 };
  }

  function productOperationsMarkup(record, comments, activity, settings) {
    const config = publishingSettings(settings);
    const review = progress(config.reviewItems, record.review_checklist);
    const photos = progress(config.photoItems, record.photo_checklist);
    const stats = diagnostics(record.final_copy);
    const metricFields = [['likes','좋아요'],['comments','댓글'],['saves','저장'],['shares','공유'],['views','조회수'],['reach','도달'],['profileVisits','프로필 방문']];
    const unresolved = comments.filter((item) => !item.resolved).length;

    return `
      <section id="content-operations-panel" class="ops-panel">
        <div class="ops-panel-head">
          <div><p>CONTENT OPERATIONS</p><h2>게시 운영·최종 검수</h2><span>진행 상태부터 게시 성과와 재활용 일정까지 모든 기기에서 함께 관리합니다.</span></div>
          <div class="ops-save-area"><span id="ops-save-status">마지막 저장 ${escapeHTML(formatDateTime(record.updated_at))}</span><button id="ops-save-now" type="button">지금 저장</button></div>
        </div>

        <div class="ops-summary-grid">
          <article><span>진행 상태</span><strong>${escapeHTML(record.status)}</strong><small>${escapeHTML(record.planned_date || '예정일 미입력')}</small></article>
          <article><span>검수 체크</span><strong>${review.done}/${review.total}</strong><small>${review.percent}% 완료</small></article>
          <article><span>사진 준비</span><strong>${photos.done}/${photos.total}</strong><small>${photos.percent}% 완료</small></article>
          <article><span>확인할 댓글</span><strong>${unresolved}</strong><small>미해결 메모</small></article>
        </div>

        <div class="ops-grid">
          <section class="ops-card ops-span-2">
            <div class="ops-card-head"><div><p>01 WORKFLOW</p><h3>게시 상태와 실제 업로드</h3></div><span>일정과 게시 결과 연결</span></div>
            <div class="ops-form-grid">
              <label><span>진행 상태</span><select data-ops-field="status">${options(STATUSES,record.status)}</select></label>
              <label><span>콘텐츠 유형</span><select data-ops-field="content_type">${options(CONTENT_TYPES,record.content_type)}</select></label>
              <label><span>예정 게시일</span><input data-ops-field="planned_date" type="date" value="${escapeHTML(record.planned_date)}"></label>
              <label><span>실제 게시일</span><input data-ops-field="actual_date" type="date" value="${escapeHTML(record.actual_date)}"></label>
              <label class="wide"><span>Instagram 게시물 주소</span><div class="ops-inline-input"><input data-ops-field="instagram_url" type="url" value="${escapeHTML(record.instagram_url)}" placeholder="https://www.instagram.com/p/...">${record.instagram_url ? `<a href="${escapeHTML(record.instagram_url)}" target="_blank" rel="noopener noreferrer">열기 ↗</a>` : ''}</div></label>
              <label class="wide"><span>일정·제품 변경 및 내부 메모</span><textarea data-ops-field="internal_note" rows="3" placeholder="일정 변경, 제품 변경, 공식 정보 확인 대기 등을 기록합니다.">${escapeHTML(record.internal_note)}</textarea></label>
            </div>
          </section>

          <section class="ops-card ops-span-2">
            <div class="ops-card-head"><div><p>02 FINAL COPY</p><h3>최종 원고 확정</h3></div><span>${record.final_confirmed ? `확정 ${escapeHTML(formatDateTime(record.final_confirmed_at))}` : '아직 확정되지 않음'}</span></div>
            <div class="ops-copy-toolbar">
              <button id="ops-import-selected-copy" type="button">현재 선택 원고 불러오기</button>
              <button id="ops-adapt-copy" type="button">선택 유형에 맞게 변환</button>
              <button id="ops-insert-tags" type="button">기본 태그 추가</button>
              <button id="ops-copy-final" type="button">최종 원고 복사</button>
            </div>
            <label class="ops-block-label"><span>선택 원고·수정본</span><textarea id="ops-final-copy" data-ops-field="final_copy" rows="13" placeholder="5개 원고 중 선택한 글을 불러오거나 직접 수정하세요.">${escapeHTML(record.final_copy)}</textarea></label>
            <input data-ops-field="final_copy_label" id="ops-final-copy-label" type="hidden" value="${escapeHTML(record.final_copy_label)}">
            <div class="ops-diagnostics" id="ops-diagnostics">
              <span><b>${stats.characters}</b>자</span><span>해시태그 <b>${stats.hashtags}</b></span><span>멘션 <b>${stats.mentions}</b></span><span>줄 <b>${stats.lines}</b></span>
              <p>${stats.warnings.length ? escapeHTML(stats.warnings.join(' · ')) : '길이와 태그 구성이 안정적입니다.'}</p>
            </div>
            <div class="ops-final-row">
              <span>원고 출처: <b id="ops-copy-source-label">${escapeHTML(record.final_copy_label || '직접 수정본')}</b></span>
              <button id="ops-final-confirm" class="${record.final_confirmed ? 'confirmed' : ''}" type="button">${record.final_confirmed ? '✓ 최종 원고 확정됨' : '최종 원고 확정'}</button>
            </div>
          </section>

          <section class="ops-card">
            <div class="ops-card-head"><div><p>03 REVIEW</p><h3>필수 검수</h3></div><span>${review.done}/${review.total}</span></div>
            <div class="ops-progress"><i style="width:${review.percent}%"></i></div>
            <div class="ops-check-list">${checkListMarkup(config.reviewItems,record.review_checklist,'review')}</div>
          </section>

          <section class="ops-card">
            <div class="ops-card-head"><div><p>04 PHOTO</p><h3>사진·영상 준비</h3></div><span>${photos.done}/${photos.total}</span></div>
            <div class="ops-progress"><i style="width:${photos.percent}%"></i></div>
            <div class="ops-check-list">${checkListMarkup(config.photoItems,record.photo_checklist,'photo')}</div>
          </section>

          <section class="ops-card">
            <div class="ops-card-head"><div><p>05 ASSIGNEES</p><h3>담당자 배정</h3></div><span>업무별 담당</span></div>
            <div class="ops-assignee-list">${ASSIGNEE_FIELDS.map(([key,label]) => `<label><span>${label}</span><input data-assignee="${key}" type="text" value="${escapeHTML(record.assignees[key] || '')}" placeholder="담당자 이름"></label>`).join('')}</div>
          </section>

          <section class="ops-card">
            <div class="ops-card-head"><div><p>06 TAG LIBRARY</p><h3>해시태그·멘션</h3></div><span>원고에 바로 추가</span></div>
            <div class="ops-tag-library">${config.hashtags.map((tag) => `<button type="button" data-insert-tag="${escapeHTML(tag)}">${escapeHTML(tag)}</button>`).join('')}${config.mentions.map((tag) => `<button type="button" class="mention" data-insert-tag="${escapeHTML(tag)}">${escapeHTML(tag)}</button>`).join('')}</div>
            <div class="ops-form-grid one">
              <label><span>이 제품 전용 해시태그</span><input data-ops-list="hashtags" type="text" value="${escapeHTML(record.hashtags.join(' '))}" placeholder="#브랜드 #제품명"></label>
              <label><span>공식 계정 멘션</span><input data-ops-list="mentions" type="text" value="${escapeHTML(record.mentions.join(' '))}" placeholder="@brand_official"></label>
            </div>
          </section>

          <section class="ops-card ops-span-2">
            <div class="ops-card-head"><div><p>07 PERFORMANCE</p><h3>게시 성과와 우수 사례</h3></div><span>게시 후 기록</span></div>
            <div class="ops-metric-grid">${metricFields.map(([key,label]) => `<label><span>${label}</span><input data-metric="${key}" type="number" min="0" value="${Number(record.metrics[key] || 0)}"></label>`).join('')}</div>
            <div class="ops-form-grid">
              <label class="wide"><span>성과가 좋았던 이유·다음 적용점</span><textarea data-ops-field="performance_note" rows="4" placeholder="첫 문장, 사진 구도, 업로드 시간, 이벤트 여부 등을 기록합니다.">${escapeHTML(record.performance_note)}</textarea></label>
              <label class="ops-toggle-label"><input data-ops-boolean="reference_post" type="checkbox" ${record.reference_post ? 'checked' : ''}><span>다음 콘텐츠 참고 게시물로 지정</span></label>
            </div>
          </section>

          <section class="ops-card">
            <div class="ops-card-head"><div><p>08 REUSE</p><h3>콘텐츠 재활용</h3></div><span>다시 활용할 시점</span></div>
            <div class="ops-form-grid one">
              <label><span>재활용 알림일</span><input data-ops-field="reuse_at" type="date" value="${escapeHTML(record.reuse_at)}"></label>
              <label><span>재활용 방식</span><select data-ops-field="reuse_type">${options(['','재입고 글','스토리 재공유','릴스로 변환','사용법 콘텐츠','계절 콘텐츠'],record.reuse_type)}</select></label>
            </div>
          </section>

          <section class="ops-card">
            <div class="ops-card-head"><div><p>09 COMMENTS</p><h3>댓글·확인 메모</h3></div><span>${unresolved}개 확인 필요</span></div>
            <form id="ops-comment-form" class="ops-comment-form"><textarea id="ops-comment-input" rows="3" placeholder="가격 재확인, 사진 교체, 매니저 확인 요청 등을 남겨주세요."></textarea><button type="submit">댓글 추가</button></form>
            <div class="ops-comment-list">${comments.length ? comments.map((item) => `<article class="${item.resolved ? 'resolved' : ''}"><div><strong>${escapeHTML(item.author)}</strong><span>${escapeHTML(formatDateTime(item.created_at))}</span></div><p>${escapeHTML(item.body)}</p><button type="button" data-comment-resolve="${escapeHTML(item.id)}" data-resolved="${item.resolved}">${item.resolved ? '다시 열기' : '해결 완료'}</button></article>`).join('') : '<div class="ops-empty">등록된 댓글이 없습니다.</div>'}</div>
          </section>

          <section class="ops-card ops-span-2">
            <div class="ops-card-head"><div><p>10 CHANGE LOG</p><h3>변경 기록</h3></div><span>최근 ${Math.min(activity.length,20)}건</span></div>
            <div class="ops-activity-list">${activity.length ? activity.slice(0,20).map((item) => `<article><i></i><div><strong>${escapeHTML(item.action)}</strong><span>${escapeHTML(formatDateTime(item.created_at))} · ${escapeHTML(item.actor)}</span></div></article>`).join('') : '<div class="ops-empty">아직 변경 기록이 없습니다.</div>'}</div>
          </section>
        </div>
      </section>`;
  }

  function lockedMarkup(title='운영 기능을 사용하려면 기기를 저장해 주세요.') {
    return `<section id="content-operations-panel" class="ops-locked"><strong>${escapeHTML(title)}</strong><p>kevin 계정으로 다시 로그인할 때 ‘이 기기 저장’을 선택하면 휴대폰·개인 노트북·회사 노트북에서 같은 데이터를 사용할 수 있습니다.</p></section>`;
  }

  function collectProductPatch(panel) {
    const patch = {};
    panel.querySelectorAll('[data-ops-field]').forEach((field) => { patch[field.dataset.opsField] = field.value; });
    panel.querySelectorAll('[data-ops-boolean]').forEach((field) => { patch[field.dataset.opsBoolean] = field.checked; });
    patch.review_checklist = {};
    patch.photo_checklist = {};
    panel.querySelectorAll('[data-ops-check]').forEach((field) => { patch[`${field.dataset.opsCheck}_checklist`][field.dataset.checkName] = field.checked; });
    patch.assignees = {};
    panel.querySelectorAll('[data-assignee]').forEach((field) => { patch.assignees[field.dataset.assignee] = field.value.trim(); });
    patch.metrics = {};
    panel.querySelectorAll('[data-metric]').forEach((field) => { patch.metrics[field.dataset.metric] = Math.max(0,Number(field.value || 0)); });
    panel.querySelectorAll('[data-ops-list]').forEach((field) => { patch[field.dataset.opsList] = field.value.split(/[\s,]+/).map((x) => x.trim()).filter(Boolean); });
    return patch;
  }

  async function saveProduct(panel, immediate=false) {
    clearTimeout(saveTimer);
    if (!immediate) {
      saveTimer = setTimeout(() => saveProduct(panel,true),700);
      const status = panel.querySelector('#ops-save-status');
      if (status) status.textContent = '변경 사항 저장 대기';
      return;
    }
    const productId = currentProductId();
    if (!productId) return;
    const status = panel.querySelector('#ops-save-status');
    const button = panel.querySelector('#ops-save-now');
    if (status) status.textContent = '저장 중…';
    if (button) button.disabled = true;
    const patch = collectProductPatch(panel);
    patch.title = document.querySelector('.detail-hero h2')?.textContent?.trim() || currentProduct?.title || '';
    const response = await api('save',{ productId, patch });
    if (!response.ok) {
      if (status) status.textContent = response.status===401 ? '기기 인증 필요' : '저장 실패';
    } else {
      currentProduct = normalizeRecord(response.data.record,productId);
      if (status) status.textContent = `저장됨 ${formatDateTime(currentProduct.updated_at)}`;
    }
    if (button) button.disabled = false;
  }

  function updateDiagnostics(panel) {
    const text = panel.querySelector('#ops-final-copy')?.value || '';
    const info = diagnostics(text);
    const target = panel.querySelector('#ops-diagnostics');
    if (!target) return;
    target.innerHTML = `<span><b>${info.characters}</b>자</span><span>해시태그 <b>${info.hashtags}</b></span><span>멘션 <b>${info.mentions}</b></span><span>줄 <b>${info.lines}</b></span><p>${info.warnings.length ? escapeHTML(info.warnings.join(' · ')) : '길이와 태그 구성이 안정적입니다.'}</p>`;
  }

  function bindProductPanel(panel, comments, settings) {
    panel.querySelectorAll('input,select,textarea').forEach((field) => field.addEventListener('input',() => {
      if (field.id === 'ops-final-copy') updateDiagnostics(panel);
      if (field.matches('[data-ops-check]')) field.closest('.ops-check-item')?.classList.toggle('checked',field.checked);
      saveProduct(panel,false);
    }));
    panel.querySelector('#ops-save-now')?.addEventListener('click',() => saveProduct(panel,true));

    panel.querySelector('#ops-import-selected-copy')?.addEventListener('click',() => {
      const selected = document.querySelector('#selected-version-text')?.textContent?.trim() || document.querySelector('#draft-text')?.textContent?.trim() || '';
      const label = document.querySelector('#copy-version-label')?.textContent?.trim() || '1차 원고';
      if (!selected) return window.alert('불러올 선택 원고가 없습니다.');
      panel.querySelector('#ops-final-copy').value = selected;
      panel.querySelector('#ops-final-copy-label').value = label;
      panel.querySelector('#ops-copy-source-label').textContent = label;
      updateDiagnostics(panel);
      saveProduct(panel,false);
    });

    panel.querySelector('#ops-adapt-copy')?.addEventListener('click',() => {
      const field = panel.querySelector('#ops-final-copy');
      const type = panel.querySelector('[data-ops-field="content_type"]')?.value || '신제품 소개';
      field.value = adaptCopy(field.value,type);
      updateDiagnostics(panel);
      saveProduct(panel,false);
    });

    const insertTag = (tag) => {
      const field = panel.querySelector('#ops-final-copy');
      if (!field) return;
      if (!field.value.includes(tag)) field.value = `${field.value.trim()}${field.value.trim()?'\n\n':''}${tag}`;
      updateDiagnostics(panel);
      saveProduct(panel,false);
    };
    panel.querySelectorAll('[data-insert-tag]').forEach((button) => button.addEventListener('click',() => insertTag(button.dataset.insertTag)));
    panel.querySelector('#ops-insert-tags')?.addEventListener('click',() => {
      const config = publishingSettings(settings);
      [...config.hashtags,...config.mentions].forEach(insertTag);
    });
    panel.querySelector('#ops-copy-final')?.addEventListener('click',async (event) => {
      try {
        await navigator.clipboard.writeText(panel.querySelector('#ops-final-copy')?.value || '');
        event.currentTarget.textContent = '복사됨';
        setTimeout(() => { event.currentTarget.textContent = '최종 원고 복사'; },1200);
      } catch { event.currentTarget.textContent = '복사 실패'; }
    });

    panel.querySelector('#ops-final-confirm')?.addEventListener('click',async (event) => {
      const config = publishingSettings(settings);
      const patch = collectProductPatch(panel);
      const missing = config.reviewItems.filter((item) => !patch.review_checklist[item]);
      if (missing.length) return window.alert(`필수 검수 ${missing.length}개를 먼저 완료해 주세요.\n\n${missing.join('\n')}`);
      if (!patch.final_copy.trim()) return window.alert('최종 원고가 비어 있습니다.');
      patch.final_confirmed = !currentProduct?.final_confirmed;
      const response = await api('save',{ productId:currentProductId(), patch });
      if (!response.ok) return window.alert('최종 확정 상태를 저장하지 못했습니다.');
      currentProduct = normalizeRecord(response.data.record,currentProductId());
      event.currentTarget.classList.toggle('confirmed',currentProduct.final_confirmed);
      event.currentTarget.textContent = currentProduct.final_confirmed ? '✓ 최종 원고 확정됨' : '최종 원고 확정';
    });

    panel.querySelector('#ops-comment-form')?.addEventListener('submit',async (event) => {
      event.preventDefault();
      const input = panel.querySelector('#ops-comment-input');
      const body = input.value.trim();
      if (!body) return;
      const response = await api('comment_add',{ productId:currentProductId(), body });
      if (!response.ok) return window.alert('댓글을 저장하지 못했습니다.');
      await renderProductOperations(true);
    });
    panel.querySelectorAll('[data-comment-resolve]').forEach((button) => button.addEventListener('click',async () => {
      const response = await api('comment_resolve',{ id:button.dataset.commentResolve, resolved:button.dataset.resolved!=='true' });
      if (!response.ok) return window.alert('댓글 상태를 변경하지 못했습니다.');
      await renderProductOperations(true);
    }));
  }

  function parseProductHeader() {
    const title = document.querySelector('.detail-hero h2')?.textContent?.trim() || '';
    const dateText = document.querySelector('.detail-date')?.textContent || '';
    const match = dateText.match(/\d{4}-\d{2}-\d{2}/);
    return { title, plannedDate:match?.[0] || '' };
  }

  async function renderProductOperations(force=false) {
    const productId = currentProductId();
    if (!productId || productLoading) return;
    const host = document.querySelector('.detail-metrics');
    if (!host) return;
    if (!force && document.querySelector('#content-operations-panel')) return;
    document.querySelector('#content-operations-panel')?.remove();
    if (!auth()) {
      host.insertAdjacentHTML('afterend',lockedMarkup());
      return;
    }

    productLoading = true;
    const header = parseProductHeader();
    await api('bootstrap',{ items:[{ productId,title:header.title,plannedDate:header.plannedDate }] });
    const response = await api('get',{ productId });
    if (!response.ok) {
      host.insertAdjacentHTML('afterend',lockedMarkup('운영 데이터를 불러오지 못했습니다.'));
      productLoading = false;
      return;
    }
    currentSettings = response.data.settings || {};
    currentProduct = normalizeRecord(response.data.record,productId,header.title,header.plannedDate);
    host.insertAdjacentHTML('afterend',productOperationsMarkup(currentProduct,response.data.comments || [],response.data.activity || [],currentSettings));
    const panel = document.querySelector('#content-operations-panel');
    bindProductPanel(panel,response.data.comments || [],currentSettings);
    productLoading = false;
  }

  function parseScheduleItems() {
    return [...document.querySelectorAll('.schedule-row[data-product]')].map((row) => {
      const monthText = row.querySelector('.schedule-date span')?.textContent || '';
      const day = row.querySelector('.schedule-date strong')?.textContent?.trim() || '';
      const month = monthText.match(/(\d{1,2})월/)?.[1] || '';
      return {
        productId:row.dataset.product,
        title:row.querySelector('.schedule-title')?.textContent?.trim() || '',
        plannedDate:month && day ? `2026-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}` : ''
      };
    }).filter((item) => item.productId);
  }

  function daysBetween(a,b) {
    if (!a || !b) return null;
    return Math.round((new Date(`${b}T12:00:00`) - new Date(`${a}T12:00:00`))/86400000);
  }

  function recordWarnings(records) {
    const today = todayText();
    const warnings = [];
    records.forEach((record) => {
      const gap = daysBetween(today,dateOnly(record.planned_date));
      const reviewValues = asObject(record.review_checklist);
      const photoValues = asObject(record.photo_checklist);
      const reviewDone = REVIEW_DEFAULTS.filter((item) => reviewValues[item]).length;
      const photoDone = PHOTO_DEFAULTS.filter((item) => photoValues[item]).length;
      if (gap !== null && gap < 0 && !['게시 완료','취소'].includes(record.status)) warnings.push({ tone:'danger',text:`${record.title || record.product_id}: 예정일이 지났지만 게시 완료가 아닙니다.` });
      else if (gap !== null && gap >= 0 && gap <= 3 && !record.final_confirmed) warnings.push({ tone:'warn',text:`${record.title || record.product_id}: ${gap===0?'오늘':`${gap}일 후`} 게시 예정 · 최종 원고 미확정` });
      if (record.status === '게시 완료' && !record.instagram_url) warnings.push({ tone:'warn',text:`${record.title || record.product_id}: 실제 게시물 링크가 없습니다.` });
      if (record.status === '검수 완료' && reviewDone < REVIEW_DEFAULTS.length) warnings.push({ tone:'warn',text:`${record.title || record.product_id}: 검수 상태와 체크리스트가 일치하지 않습니다.` });
      if (record.status === '촬영 완료' && photoDone < PHOTO_DEFAULTS.length) warnings.push({ tone:'warn',text:`${record.title || record.product_id}: 사진 체크리스트가 일부 남아 있습니다.` });
    });
    return warnings.slice(0,10);
  }

  function scheduleOverviewMarkup(records) {
    const route = currentRoute();
    const month = route === 'july' ? 7 : route === 'august' ? 8 : null;
    const filtered = records.filter((record) => !month || Number(dateOnly(record.planned_date).slice(5,7))===month);
    const completed = filtered.filter((record) => record.status==='게시 완료').length;
    const confirmed = filtered.filter((record) => record.final_confirmed).length;
    const review = filtered.filter((record) => record.status==='검수 완료' || record.status==='촬영 완료' || record.status==='게시 완료').length;
    const warnings = recordWarnings(filtered);
    return `
      <section id="ops-schedule-overview" class="ops-schedule-overview">
        <div class="ops-overview-head"><div><p>OPERATIONS CENTER</p><h2>콘텐츠 진행 현황</h2></div><a href="#/admin">전체 관리자 보기 →</a></div>
        <div class="ops-overview-stats">
          <article><span>대상 콘텐츠</span><strong>${filtered.length}</strong></article>
          <article><span>최종 원고 확정</span><strong>${confirmed}</strong><small>${filtered.length ? Math.round(confirmed/filtered.length*100) : 0}%</small></article>
          <article><span>검수 이상 완료</span><strong>${review}</strong><small>${filtered.length ? Math.round(review/filtered.length*100) : 0}%</small></article>
          <article><span>게시 완료</span><strong>${completed}</strong><small>${filtered.length ? Math.round(completed/filtered.length*100) : 0}%</small></article>
        </div>
        <div class="ops-alert-center"><div class="ops-alert-title"><strong>알림 센터</strong><span>${warnings.length}건 확인 필요</span></div>${warnings.length ? warnings.map((item) => `<p class="${item.tone}">${escapeHTML(item.text)}</p>`).join('') : '<p class="good">현재 긴급하게 확인할 항목이 없습니다.</p>'}</div>
      </section>`;
  }

  function applyStatusToSchedule(records) {
    const byId = Object.fromEntries(records.map((record) => [record.product_id,record]));
    document.querySelectorAll('.schedule-row[data-product]').forEach((row) => {
      const record = byId[row.dataset.product];
      if (!record) return;
      row.querySelector('.ops-row-status')?.remove();
      const pill = document.createElement('span');
      pill.className = `ops-row-status status-${record.status.replace(/\s/g,'-')}`;
      pill.textContent = record.status;
      row.querySelector('.schedule-content')?.appendChild(pill);
    });
    document.querySelectorAll('.event-button[data-product]').forEach((button) => {
      const record = byId[button.dataset.product];
      if (record) button.dataset.opsStatus = record.status;
    });
  }

  async function renderScheduleOperations(force=false) {
    if (!['schedule','july','august'].includes(currentRoute()) || scheduleLoading) return;
    const pageHead = document.querySelector('.page-head');
    if (!pageHead) return;
    if (!force && document.querySelector('#ops-schedule-overview')) return;
    if (!auth()) return;
    scheduleLoading = true;
    const items = parseScheduleItems();
    const signature = JSON.stringify(items);
    if (items.length && signature !== lastBootstrapSignature) {
      await api('bootstrap',{ items });
      lastBootstrapSignature = signature;
    }
    const response = await api('list');
    if (response.ok) {
      currentSettings = response.data.settings || {};
      document.querySelector('#ops-schedule-overview')?.remove();
      pageHead.insertAdjacentHTML('afterend',scheduleOverviewMarkup(response.data.records || []));
      applyStatusToSchedule(response.data.records || []);
    }
    scheduleLoading = false;
  }

  function score(record) {
    const m = asObject(record.metrics);
    return Number(m.likes||0) + Number(m.comments||0)*2 + Number(m.saves||0)*3 + Number(m.shares||0)*3 + Number(m.views||0)*0.02;
  }

  function adminOperationsMarkup(data) {
    const records = data.records || [];
    const settings = publishingSettings(data.settings || {});
    const month = new Date().getMonth()+1;
    const year = new Date().getFullYear();
    const monthRecords = records.filter((record) => dateOnly(record.planned_date).startsWith(`${year}-${String(month).padStart(2,'0')}`));
    const posted = monthRecords.filter((record) => record.status==='게시 완료').length;
    const confirmed = monthRecords.filter((record) => record.final_confirmed).length;
    const warnings = recordWarnings(records);
    const top = [...records].filter((r) => score(r)>0).sort((a,b) => score(b)-score(a)).slice(0,5);
    const reuse = [...records].filter((r) => r.reuse_at).sort((a,b) => String(a.reuse_at).localeCompare(String(b.reuse_at))).slice(0,8);
    const openComments = data.openComments || [];
    const team = data.team || [];
    const activity = data.activity || [];

    return `
      <section id="ops-admin-suite" class="ops-admin-suite">
        <div class="ops-admin-head"><div><p>SNS OPERATIONS ADMIN</p><h2>게시 운영 통합 관리</h2><span>일정·원고·검수·촬영·게시·성과·재활용·권한을 한곳에서 관리합니다.</span></div><button id="ops-admin-refresh" type="button">새로고침</button></div>
        <div class="ops-admin-stats">
          <article><span>${month}월 콘텐츠</span><strong>${monthRecords.length}</strong><small>${year}년 기준</small></article>
          <article><span>원고 확정</span><strong>${confirmed}</strong><small>${monthRecords.length ? Math.round(confirmed/monthRecords.length*100) : 0}%</small></article>
          <article><span>게시 완료</span><strong>${posted}</strong><small>${monthRecords.length ? Math.round(posted/monthRecords.length*100) : 0}%</small></article>
          <article><span>미해결 댓글</span><strong>${openComments.length}</strong><small>확인 필요</small></article>
        </div>

        <div class="ops-admin-grid">
          <section class="ops-admin-card ops-admin-span-2">
            <div class="ops-card-head"><div><p>NOTIFICATIONS</p><h3>알림 센터</h3></div><span>${warnings.length}건</span></div>
            <div class="ops-admin-alerts">${warnings.length ? warnings.map((item) => `<p class="${item.tone}">${escapeHTML(item.text)}</p>`).join('') : '<p class="good">현재 긴급하게 확인할 항목이 없습니다.</p>'}</div>
          </section>

          <section class="ops-admin-card">
            <div class="ops-card-head"><div><p>TOP CONTENT</p><h3>성과 우수 게시물</h3></div><span>종합 점수</span></div>
            <div class="ops-ranking">${top.length ? top.map((record,index) => `<a href="#/product/${encodeURIComponent(record.product_id)}"><b>${index+1}</b><span>${escapeHTML(record.title || record.product_id)}</span><strong>${Math.round(score(record))}</strong></a>`).join('') : '<div class="ops-empty">아직 성과가 입력된 게시물이 없습니다.</div>'}</div>
          </section>

          <section class="ops-admin-card">
            <div class="ops-card-head"><div><p>REUSE QUEUE</p><h3>재활용 예정</h3></div><span>${reuse.length}건</span></div>
            <div class="ops-reuse-list">${reuse.length ? reuse.map((record) => `<a href="#/product/${encodeURIComponent(record.product_id)}"><span>${escapeHTML(record.reuse_at)}</span><strong>${escapeHTML(record.title || record.product_id)}</strong><small>${escapeHTML(record.reuse_type || '방식 미정')}</small></a>`).join('') : '<div class="ops-empty">재활용 일정이 없습니다.</div>'}</div>
          </section>

          <section class="ops-admin-card ops-admin-span-2">
            <div class="ops-card-head"><div><p>TAG LIBRARY</p><h3>해시태그·멘션 라이브러리</h3></div><span>원고 작성 공통 설정</span></div>
            <div class="ops-settings-grid">
              <label><span>기본 해시태그 · 공백 또는 줄바꿈</span><textarea id="ops-setting-hashtags" rows="5">${escapeHTML(settings.hashtags.join('\n'))}</textarea></label>
              <label><span>기본 멘션 · 공백 또는 줄바꿈</span><textarea id="ops-setting-mentions" rows="5">${escapeHTML(settings.mentions.join('\n'))}</textarea></label>
            </div>
            <button id="ops-save-tags" type="button">태그 설정 저장</button>
          </section>

          <section class="ops-admin-card ops-admin-span-2">
            <div class="ops-card-head"><div><p>TEAM & ROLES</p><h3>계정·권한 정책</h3></div><span>관리자 · 작성자 · 검수자 · 조회 전용</span></div>
            <div class="ops-team-list">${team.map((member) => `<article data-member="${escapeHTML(member.username)}"><div><strong>${escapeHTML(member.display_name)}</strong><span>@${escapeHTML(member.username)}</span></div><select data-member-role>${options(ROLE_TYPES,member.role)}</select><label><input data-member-active type="checkbox" ${member.active ? 'checked' : ''}>사용</label><button data-member-save type="button">저장</button>${member.username==='kevin'?'':`<button data-member-delete class="danger" type="button">삭제</button>`}</article>`).join('')}</div>
            <form id="ops-member-form" class="ops-member-form"><input id="ops-member-username" placeholder="아이디"><input id="ops-member-name" placeholder="표시 이름"><select id="ops-member-role">${options(ROLE_TYPES,'조회 전용')}</select><button type="submit">권한 항목 추가</button></form>
            <p class="ops-policy-note">현재 암호화 로그인 계정은 kevin 하나입니다. 이 목록은 업무 권한 정책을 관리하며, 실제 신규 로그인 발급은 별도 암호화 계정 생성 단계가 필요합니다.</p>
          </section>

          <section class="ops-admin-card ops-admin-span-2">
            <div class="ops-card-head"><div><p>DATA & BACKUP</p><h3>백업·내보내기·복원</h3></div><span>JSON · CSV</span></div>
            <div class="ops-backup-actions"><button id="ops-export-json" type="button">전체 JSON 백업</button><button id="ops-export-csv" type="button">진행 현황 CSV</button><label>JSON 복원<input id="ops-import-json" type="file" accept="application/json"></label></div>
          </section>

          <section class="ops-admin-card ops-admin-span-2">
            <div class="ops-card-head"><div><p>ACTIVITY</p><h3>최근 변경 기록</h3></div><span>${activity.length}건</span></div>
            <div class="ops-admin-activity">${activity.length ? activity.slice(0,40).map((item) => `<article><span>${escapeHTML(formatDateTime(item.created_at))}</span><strong>${escapeHTML(item.action)}</strong><small>${escapeHTML(item.product_id || '관리 설정')} · ${escapeHTML(item.actor)}</small></article>`).join('') : '<div class="ops-empty">변경 기록이 없습니다.</div>'}</div>
          </section>
        </div>
      </section>`;
  }

  function downloadFile(name,content,type='application/json') {
    const url = URL.createObjectURL(new Blob([content],{ type }));
    const link = document.createElement('a');
    link.href=url; link.download=name; link.click();
    setTimeout(() => URL.revokeObjectURL(url),1000);
  }

  function recordsToCsv(records) {
    const headers = ['product_id','title','planned_date','status','actual_date','instagram_url','content_type','final_confirmed','updated_at'];
    const cell = (value) => `"${String(value ?? '').replace(/"/g,'""')}"`;
    return [headers.join(','),...records.map((record) => headers.map((key) => cell(record[key])).join(','))].join('\n');
  }

  function bindAdminSuite(section,data) {
    section.querySelector('#ops-admin-refresh')?.addEventListener('click',() => renderAdminOperations(true));
    section.querySelector('#ops-save-tags')?.addEventListener('click',async () => {
      const parse = (id) => section.querySelector(id).value.split(/[\s,]+/).map((x) => x.trim()).filter(Boolean);
      const current = publishingSettings(data.settings || {});
      const response = await api('settings_save',{ settingKey:'publishing', data:{ ...current, hashtags:parse('#ops-setting-hashtags'), mentions:parse('#ops-setting-mentions') } });
      window.alert(response.ok ? '태그 설정을 저장했습니다.' : '태그 설정을 저장하지 못했습니다.');
    });
    section.querySelectorAll('[data-member-save]').forEach((button) => button.addEventListener('click',async () => {
      const row = button.closest('[data-member]');
      const member = data.team.find((item) => item.username===row.dataset.member);
      const response = await api('member_save',{ username:row.dataset.member, displayName:member.display_name, role:row.querySelector('[data-member-role]').value, active:row.querySelector('[data-member-active]').checked });
      if (response.ok) renderAdminOperations(true); else window.alert('권한을 저장하지 못했습니다.');
    }));
    section.querySelectorAll('[data-member-delete]').forEach((button) => button.addEventListener('click',async () => {
      const row = button.closest('[data-member]');
      if (!window.confirm(`${row.dataset.member} 권한 항목을 삭제할까요?`)) return;
      const response = await api('member_delete',{ username:row.dataset.member });
      if (response.ok) renderAdminOperations(true); else window.alert('권한 항목을 삭제하지 못했습니다.');
    }));
    section.querySelector('#ops-member-form')?.addEventListener('submit',async (event) => {
      event.preventDefault();
      const username = section.querySelector('#ops-member-username').value.trim();
      const displayName = section.querySelector('#ops-member-name').value.trim();
      const role = section.querySelector('#ops-member-role').value;
      if (!username || !displayName) return;
      const response = await api('member_save',{ username, displayName, role, active:true });
      if (response.ok) renderAdminOperations(true); else window.alert('권한 항목을 추가하지 못했습니다.');
    });
    section.querySelector('#ops-export-json')?.addEventListener('click',() => downloadFile(`blueblack-sns-backup-${todayText()}.json`,JSON.stringify(data,null,2)));
    section.querySelector('#ops-export-csv')?.addEventListener('click',() => downloadFile(`blueblack-sns-status-${todayText()}.csv`,`\ufeff${recordsToCsv(data.records || [])}`,'text/csv;charset=utf-8'));
    section.querySelector('#ops-import-json')?.addEventListener('change',async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        const records = parsed.records || parsed.data?.records || [];
        if (!Array.isArray(records)) throw new Error('invalid');
        if (!window.confirm(`${records.length}개 운영 데이터를 복원할까요?`)) return;
        const response = await api('import',{ records });
        if (!response.ok) throw new Error('failed');
        renderAdminOperations(true);
      } catch { window.alert('올바른 BlueBlack 운영 백업 파일이 아닙니다.'); }
      event.target.value='';
    });
  }

  async function renderAdminOperations(force=false) {
    if (currentRoute()!=='admin' || adminLoading) return;
    const hero = document.querySelector('.admin-hero');
    if (!hero) return;
    if (!force && document.querySelector('#ops-admin-suite')) return;
    document.querySelector('#ops-admin-suite')?.remove();
    if (!auth()) {
      hero.insertAdjacentHTML('afterend',lockedMarkup('관리자 운영 기능을 사용하려면 이 기기를 저장해 주세요.').replace('id="content-operations-panel"','id="ops-admin-suite"'));
      return;
    }
    adminLoading=true;
    const response = await api('dashboard');
    if (response.ok) {
      hero.insertAdjacentHTML('afterend',adminOperationsMarkup(response.data));
      bindAdminSuite(document.querySelector('#ops-admin-suite'),response.data);
    }
    adminLoading=false;
  }

  function sync() {
    const route = currentRoute();
    if (route.startsWith('product/')) renderProductOperations(false);
    else if (['schedule','july','august'].includes(route)) renderScheduleOperations(false);
    else if (route==='admin') renderAdminOperations(false);
  }

  function scheduleSync() {
    clearTimeout(timer);
    timer=setTimeout(sync,80);
  }

  window.BLUEBLACK_CONTENT_OPERATIONS = {
    refreshProduct:() => renderProductOperations(true),
    refreshSchedule:() => renderScheduleOperations(true),
    refreshAdmin:() => renderAdminOperations(true)
  };

  window.addEventListener('DOMContentLoaded',scheduleSync,{ once:true });
  window.addEventListener('hashchange',scheduleSync);
  new MutationObserver(scheduleSync).observe(document.documentElement,{ childList:true,subtree:true });
})();