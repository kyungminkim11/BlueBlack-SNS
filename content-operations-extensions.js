(() => {
  'use strict';

  const API_URL = 'https://jnciddblcndmthmmvqrz.supabase.co/functions/v1/blueblack-workspace';
  const DEVICE_KEY = 'blueblack-trusted-device-v1';
  let timer = null;
  let productBusy = false;
  let adminBusy = false;

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  })[ch]);

  function auth() {
    try {
      const value = JSON.parse(localStorage.getItem(DEVICE_KEY) || 'null');
      return value?.deviceId && value?.deviceToken ? { deviceId:value.deviceId, deviceToken:value.deviceToken } : null;
    } catch { return null; }
  }

  async function api(action, payload = {}) {
    const device = auth();
    if (!device) return { ok:false, status:401, data:{} };
    try {
      const response = await fetch(API_URL, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ action, ...device, ...payload }), cache:'no-store'
      });
      let data={}; try { data=await response.json(); } catch {}
      return { ok:response.ok && data.ok, status:response.status, data };
    } catch { return { ok:false, status:0, data:{} }; }
  }

  function route() { return location.hash.replace(/^#\//,'') || 'schedule'; }
  function productId() {
    const current=route(); if(!current.startsWith('product/')) return '';
    try { return decodeURIComponent(current.slice(8)); } catch { return current.slice(8); }
  }
  function formatDate(value) {
    if(!value) return '';
    const date=new Date(value); if(Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
  }
  function normalizeUrl(value) {
    try { const url=new URL(String(value||'').trim()); return ['http:','https:'].includes(url.protocol) ? url.href : ''; }
    catch { return ''; }
  }
  function isImage(url) { return /\.(?:jpe?g|png|webp|gif|avif)(?:[?#].*)?$/i.test(url); }

  function assetMarkup(urls) {
    return `
      <div class="ops-assets-extension">
        <div class="ops-extension-head"><div><p>PHOTO ASSETS</p><h4>촬영 자료·미리보기</h4></div><span>${urls.length}개 등록</span></div>
        <form id="ops-asset-form" class="ops-asset-form"><input id="ops-asset-url" type="url" placeholder="사진, Drive 폴더 또는 자료 링크"><button type="submit">링크 추가</button></form>
        <div class="ops-asset-grid">${urls.length ? urls.map((url,index) => `
          <article>
            <a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">
              ${isImage(url) ? `<img src="${escapeHTML(url)}" alt="촬영 자료 ${index+1}" loading="lazy">` : '<div class="ops-asset-file">LINK</div>'}
              <span>${escapeHTML(new URL(url).hostname.replace(/^www\./,''))}</span>
            </a>
            <button type="button" data-remove-asset="${index}">삭제</button>
          </article>`).join('') : '<div class="ops-empty">촬영본 또는 공유 폴더 링크를 등록하면 여기서 바로 확인할 수 있습니다.</div>'}</div>
      </div>`;
  }

  function versionsMarkup(versions) {
    return `
      <div class="ops-versions-extension">
        <div class="ops-extension-head"><div><p>COPY HISTORY</p><h4>최종 원고 수정 이력</h4></div><span>${versions.length}개 버전</span></div>
        <div class="ops-version-history">${versions.length ? versions.map((item,index) => `
          <article>
            <div><strong>V${versions.length-index} · ${escapeHTML(item.version_label || '직접 수정본')}</strong><span>${escapeHTML(formatDate(item.created_at))}</span></div>
            <p>${escapeHTML(String(item.copy_text||'').slice(0,180))}${String(item.copy_text||'').length>180?'…':''}</p>
            <div><button type="button" data-copy-version-history="${index}">복사</button><button type="button" data-restore-version-history="${index}">이 버전 복원</button></div>
          </article>`).join('') : '<div class="ops-empty">최종 원고를 수정해 저장하면 버전 이력이 자동으로 남습니다.</div>'}</div>
      </div>`;
  }

  async function saveAssets(urls) {
    return api('save',{ productId:productId(), patch:{ asset_urls:urls } });
  }

  async function mountProductExtensions() {
    if(!route().startsWith('product/') || productBusy || !auth()) return;
    const panel=document.querySelector('#content-operations-panel');
    if(!panel || panel.querySelector('.ops-assets-extension')) return;
    productBusy=true;
    const response=await api('get',{ productId:productId() });
    if(!response.ok) { productBusy=false; return; }
    let urls=Array.isArray(response.data.record?.asset_urls) ? response.data.record.asset_urls : [];
    const photoCard=[...panel.querySelectorAll('.ops-card')].find((card)=>card.querySelector('h3')?.textContent.includes('사진·영상 준비'));
    const copyCard=[...panel.querySelectorAll('.ops-card')].find((card)=>card.querySelector('h3')?.textContent.includes('최종 원고 확정'));
    photoCard?.insertAdjacentHTML('beforeend',assetMarkup(urls));
    copyCard?.insertAdjacentHTML('beforeend',versionsMarkup(response.data.versions || []));

    const assetWrap=panel.querySelector('.ops-assets-extension');
    assetWrap?.querySelector('#ops-asset-form')?.addEventListener('submit',async (event)=>{
      event.preventDefault();
      const field=assetWrap.querySelector('#ops-asset-url');
      const url=normalizeUrl(field.value);
      if(!url) return window.alert('올바른 자료 링크를 입력해 주세요.');
      if(!urls.includes(url)) urls=[...urls,url].slice(0,30);
      const saved=await saveAssets(urls);
      if(!saved.ok) return window.alert('자료 링크를 저장하지 못했습니다.');
      window.BLUEBLACK_CONTENT_OPERATIONS?.refreshProduct();
    });
    assetWrap?.querySelectorAll('[data-remove-asset]').forEach((button)=>button.addEventListener('click',async ()=>{
      urls=urls.filter((_,index)=>index!==Number(button.dataset.removeAsset));
      const saved=await saveAssets(urls);
      if(!saved.ok) return window.alert('자료 링크를 삭제하지 못했습니다.');
      window.BLUEBLACK_CONTENT_OPERATIONS?.refreshProduct();
    }));
    panel.querySelectorAll('[data-copy-version-history]').forEach((button)=>button.addEventListener('click',async ()=>{
      const item=(response.data.versions||[])[Number(button.dataset.copyVersionHistory)];
      try { await navigator.clipboard.writeText(item?.copy_text || ''); button.textContent='복사됨'; } catch { button.textContent='복사 실패'; }
    }));
    panel.querySelectorAll('[data-restore-version-history]').forEach((button)=>button.addEventListener('click',()=>{
      const item=(response.data.versions||[])[Number(button.dataset.restoreVersionHistory)];
      const field=panel.querySelector('#ops-final-copy');
      const label=panel.querySelector('#ops-final-copy-label');
      if(!item || !field) return;
      if(!window.confirm('이 버전을 현재 최종 원고로 복원할까요?')) return;
      field.value=item.copy_text;
      if(label) label.value=`이력 복원 · ${item.version_label || '직접 수정본'}`;
      field.dispatchEvent(new Event('input',{bubbles:true}));
    }));
    productBusy=false;
  }

  function download(name,content,type='text/plain;charset=utf-8') {
    const url=URL.createObjectURL(new Blob([content],{type}));
    const link=document.createElement('a'); link.href=url; link.download=name; link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function finalCopiesText(records) {
    const confirmed=records.filter((item)=>item.final_confirmed && item.final_copy);
    return confirmed.map((item,index)=>[
      `${index+1}. ${item.title || item.product_id}`,
      `예정일: ${String(item.planned_date||'').slice(0,10) || '-'}`,
      `상태: ${item.status || '-'}`,
      `원고 버전: ${item.final_copy_label || '직접 수정본'}`,
      '', item.final_copy, '', '----------------------------------------', ''
    ].join('\n')).join('\n');
  }

  async function mountAdminExtensions() {
    if(route()!=='admin' || adminBusy || !auth()) return;
    const suite=document.querySelector('#ops-admin-suite');
    const actions=suite?.querySelector('.ops-backup-actions');
    if(!suite || !actions || suite.querySelector('#ops-export-final-copies')) return;
    adminBusy=true;
    const response=await api('dashboard');
    if(response.ok) {
      const finalButton=document.createElement('button');
      finalButton.id='ops-export-final-copies'; finalButton.type='button'; finalButton.textContent='확정 원고 모음';
      finalButton.addEventListener('click',()=>download(`blueblack-final-copies-${new Date().toISOString().slice(0,10)}.txt`,finalCopiesText(response.data.records||[])));
      const printButton=document.createElement('button');
      printButton.id='ops-print-month'; printButton.type='button'; printButton.textContent='월간 일정 PDF·인쇄';
      printButton.addEventListener('click',()=>{
        document.body.classList.add('ops-print-mode');
        window.print();
        setTimeout(()=>document.body.classList.remove('ops-print-mode'),800);
      });
      actions.append(finalButton,printButton);
    }
    adminBusy=false;
  }

  function sync() {
    mountProductExtensions();
    mountAdminExtensions();
  }
  function schedule() { clearTimeout(timer); timer=setTimeout(sync,120); }

  window.addEventListener('DOMContentLoaded',schedule,{once:true});
  window.addEventListener('hashchange',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();