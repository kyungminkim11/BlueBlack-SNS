(() => {
  "use strict";

  const app = document.getElementById("app");
  const state = { data: null, failed: 0, lockedUntil: 0, idleTimer: null, currentFilter: "" };
  const IDLE_MS = 20 * 60 * 1000;
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const b64ToBytes = (b64) => {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
    return out;
  };

  const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[ch]);

  const safeUrl = (value = "") => {
    try {
      const url = new URL(String(value), window.location.href);
      if (!["http:", "https:"].includes(url.protocol)) return "#";
      return url.href;
    } catch {
      return "#";
    }
  };

  const getDomain = (value = "") => {
    try { return new URL(value, window.location.href).hostname.replace(/^www\./, ""); }
    catch { return ""; }
  };

  async function decryptPayload(username, password) {
    const response = await fetch("./payload.json", { cache: "no-store" });
    if (!response.ok) throw new Error("자료 파일을 불러오지 못했습니다.");
    const payload = await response.json();
    const material = enc.encode(`${username}\0${password}`);
    const baseKey = await crypto.subtle.importKey("raw", material, "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: b64ToBytes(payload.salt), iterations: payload.iterations, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64ToBytes(payload.iv), additionalData: b64ToBytes(payload.aad), tagLength: 128 },
      key,
      b64ToBytes(payload.data)
    );
    return JSON.parse(dec.decode(plaintext));
  }

  function setIdleTimer() {
    clearTimeout(state.idleTimer);
    state.idleTimer = setTimeout(() => logout("보안을 위해 자동 로그아웃되었습니다."), IDLE_MS);
  }

  ["click", "keydown", "touchstart"].forEach((eventName) => {
    document.addEventListener(eventName, () => {
      if (state.data) setIdleTimer();
    }, { passive: true });
  });

  function loginMarkup(message = "") {
    return `
      <main class="login-shell" aria-labelledby="login-title">
        <section class="login-frame">
          <div class="login-intro" aria-hidden="true">
            <div class="intro-brand">
              <span class="brand-monogram">BB</span>
              <span class="intro-brand-copy">BLUEBLACK<br>CONTENT DESK</span>
            </div>
            <div class="intro-main">
              <p class="intro-kicker">EDITORIAL CONTROL ROOM</p>
              <h2>검증된 정보로<br>완성하는 콘텐츠.</h2>
              <p>제품 조사부터 게시 일정, 1차 원고까지 한곳에서 안전하게 관리합니다.</p>
            </div>
            <div class="intro-footer"><span>Encrypted workspace</span><span>2026</span></div>
          </div>
          <section class="login-card">
            <div class="mobile-brand" aria-hidden="true"><span class="brand-monogram small">BB</span><span>BlueBlack SNS</span></div>
            <div class="login-heading">
              <p class="eyebrow">INTERNAL ACCESS</p>
              <h1 id="login-title">워크스페이스 로그인</h1>
              <p class="login-copy">사내 일정과 제품 검수 자료를 확인하려면 인증 정보를 입력하세요.</p>
            </div>
            <form id="login-form" class="login-form" autocomplete="off">
              <label class="field-group"><span>아이디</span><input id="username" type="text" autocomplete="username" spellcheck="false" placeholder="아이디 입력" required></label>
              <label class="field-group"><span>비밀번호</span><div class="password-row"><input id="password" type="password" autocomplete="current-password" placeholder="비밀번호 입력" required><button id="toggle-password" class="icon-button" type="button" aria-label="비밀번호 표시 전환">보기</button></div></label>
              <button id="login-button" class="primary-button" type="submit"><span class="button-label">로그인</span><span class="button-arrow" aria-hidden="true">→</span><span class="spinner" hidden aria-hidden="true"></span></button>
              <p id="login-message" class="form-message" role="alert" aria-live="polite">${escapeHTML(message)}</p>
            </form>
            <div class="security-note"><span class="security-dot" aria-hidden="true"></span><div><strong>브라우저 내 복호화</strong><p>인증 정보는 저장하거나 전송하지 않으며, 암호화된 자료는 로그인 후 이 기기에서만 열립니다.</p></div></div>
            <p class="login-legal">BlueBlack internal use only · Unauthorized access prohibited</p>
          </section>
        </section>
      </main>`;
  }

  function renderLogin(message = "") {
    state.data = null;
    state.currentFilter = "";
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    app.innerHTML = loginMarkup(message);

    const form = document.getElementById("login-form");
    const toggle = document.getElementById("toggle-password");
    toggle.addEventListener("click", () => {
      const input = document.getElementById("password");
      const visible = input.type === "password";
      input.type = visible ? "text" : "password";
      toggle.textContent = visible ? "숨김" : "보기";
      toggle.setAttribute("aria-label", visible ? "비밀번호 숨기기" : "비밀번호 표시");
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const now = Date.now();
      const messageEl = document.getElementById("login-message");
      if (now < state.lockedUntil) {
        const seconds = Math.ceil((state.lockedUntil - now) / 1000);
        messageEl.textContent = `잠시 후 다시 시도하세요. (${seconds}초)`;
        return;
      }

      const button = document.getElementById("login-button");
      const spinner = button.querySelector(".spinner");
      const label = button.querySelector(".button-label");
      const arrow = button.querySelector(".button-arrow");
      button.disabled = true;
      spinner.hidden = false;
      arrow.hidden = true;
      label.textContent = "확인 중";
      messageEl.textContent = "";

      try {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const data = await decryptPayload(username, password);
        state.data = data;
        state.failed = 0;
        renderWorkspace();
        setIdleTimer();
      } catch {
        state.failed += 1;
        if (state.failed >= 5) {
          state.lockedUntil = Date.now() + 30_000;
          state.failed = 0;
          messageEl.textContent = "로그인 시도가 잠시 제한되었습니다. 30초 후 다시 시도하세요.";
        } else {
          messageEl.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
        }
      } finally {
        if (document.body.contains(button)) {
          button.disabled = false;
          spinner.hidden = true;
          arrow.hidden = false;
          label.textContent = "로그인";
        }
      }
    });
  }

  function logout(message = "") {
    clearTimeout(state.idleTimer);
    state.data = null;
    renderLogin(message);
  }

  function isVerified(product) {
    const text = `${product?.status || ""} ${product?.verification || ""}`;
    return /완료|검증됨|게시 가능|업로드 가능/.test(text) && !/대기|보류|필요|미완료/.test(text);
  }

  function getWorkspaceStats() {
    const events = state.data?.events || [];
    const products = state.data?.products || {};
    const verified = Object.values(products).filter(isVerified).length;
    const pending = Math.max(Object.keys(products).length - verified, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = events
      .map((event) => ({ ...event, time: new Date(`${event.date}T00:00:00`).getTime() }))
      .filter((event) => event.time >= today.getTime())
      .sort((a, b) => a.time - b.time)[0];
    return { total: events.length, verified, pending, upcoming };
  }

  function renderWorkspace() {
    const meta = state.data.meta;
    const stats = getWorkspaceStats();
    app.innerHTML = `
      <div class="workspace">
        <header class="topbar">
          <div class="topbar-brand">
            <div class="topbar-logo">BB</div>
            <div><div class="topbar-title">${escapeHTML(meta.title)}</div><span class="topbar-sub">${escapeHTML(meta.subtitle)}</span></div>
          </div>
          <div class="topbar-actions">
            <span class="secure-pill">암호화 세션</span>
            <button id="home-button" class="ghost-button" type="button">일정</button>
            <button id="logout-button" class="ghost-button" type="button">로그아웃</button>
          </div>
        </header>
        <nav class="mobile-tabs" aria-label="일정 보기">
          <div class="mobile-tabs-inner">
            <button class="mobile-tab active" data-route="schedule" type="button">전체</button>
            <button class="mobile-tab" data-route="july" type="button">7월</button>
            <button class="mobile-tab" data-route="august" type="button">8월</button>
          </div>
        </nav>
        <div class="app-shell">
          <aside class="sidebar">
            <p class="nav-label">WORKSPACE</p>
            <button class="nav-button active" data-route="schedule" type="button"><span class="nav-dot"></span>전체 일정</button>
            <button class="nav-button" data-route="july" type="button"><span class="nav-dot"></span>7월</button>
            <button class="nav-button" data-route="august" type="button"><span class="nav-dot"></span>8월</button>
            <div class="sidebar-divider"></div>
            <div class="side-meta">
              <div class="side-meta-row"><span>전체 일정</span><strong>${stats.total}</strong></div>
              <div class="side-meta-row"><span>검증 완료</span><strong>${stats.verified}</strong></div>
              <div class="side-meta-row"><span>검증 대기</span><strong>${stats.pending}</strong></div>
            </div>
            <div class="side-security">${escapeHTML(meta.securityNotice)}<br><br>20분 동안 활동이 없으면 자동 로그아웃됩니다.</div>
          </aside>
          <main id="main-content" class="main-content"></main>
        </div>
      </div>`;

    document.getElementById("logout-button").addEventListener("click", () => logout());
    document.getElementById("home-button").addEventListener("click", () => routeTo("schedule"));
    document.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () => routeTo(button.dataset.route)));
    window.onhashchange = handleRoute;
    handleRoute();
  }

  function routeTo(route) { location.hash = `#/${route}`; }

  function handleRoute() {
    if (!state.data) return;
    const route = location.hash.replace(/^#\//, "") || "schedule";
    document.querySelectorAll("[data-route]").forEach((button) => button.classList.toggle("active", button.dataset.route === route));
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (route.startsWith("product/")) return renderProduct(decodeURIComponent(route.slice(8)));
    if (route === "july") return renderSchedule(7);
    if (route === "august") return renderSchedule(8);
    renderSchedule();
  }

  function monthName(month) { return `${month}월`; }

  function buildCalendar(year, month, events) {
    const first = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0).getDate();
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const cells = [];
    for (let i = 0; i < first.getDay(); i += 1) cells.push('<div class="day-cell empty" aria-hidden="true"></div>');
    for (let day = 1; day <= lastDate; day += 1) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = events.filter((event) => event.date === date);
      const eventButtons = dayEvents.map((event) => {
        const product = state.data.products[event.productId];
        const tone = isVerified(product) ? "verified" : "pending";
        return `<button class="event-button ${tone}" data-product="${escapeHTML(event.productId)}" title="${escapeHTML(event.title)}">${escapeHTML(event.title)}</button>`;
      }).join("");
      cells.push(`
        <div class="day-cell ${dayEvents.length ? "has-event" : ""} ${date === todayKey ? "is-today" : ""}">
          <div class="day-number">${day}</div>${eventButtons}
        </div>`);
    }
    const monthEventCount = events.filter((event) => Number(event.date.slice(5, 7)) === month).length;
    return `
      <section class="calendar-card">
        <div class="calendar-head"><h3>2026년 ${monthName(month)}</h3><span>${monthEventCount}개 일정</span></div>
        <div class="week-row"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div>
        <div class="calendar-grid">${cells.join("")}</div>
      </section>`;
  }

  function renderStatsCards(events) {
    const products = state.data.products;
    const verifiedCount = events.filter((event) => isVerified(products[event.productId])).length;
    const pendingCount = Math.max(events.length - verifiedCount, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next = events
      .map((event) => ({ ...event, time: new Date(`${event.date}T00:00:00`).getTime() }))
      .filter((event) => event.time >= today.getTime())
      .sort((a, b) => a.time - b.time)[0];
    return `
      <div class="stats-grid">
        <article class="stat-card"><span class="stat-label">TOTAL POSTS</span><strong class="stat-value">${events.length}</strong><span class="stat-note">선택 기간 전체 게시물</span></article>
        <article class="stat-card"><span class="stat-label">VERIFIED</span><strong class="stat-value">${verifiedCount}</strong><span class="stat-note">검증 완료 상태</span></article>
        <article class="stat-card"><span class="stat-label">PENDING</span><strong class="stat-value">${pendingCount}</strong><span class="stat-note">추가 확인이 필요한 항목</span></article>
        <article class="stat-card"><span class="stat-label">NEXT POST</span><strong class="stat-value">${next ? escapeHTML(next.date.slice(5).replace("-", "/")) : "—"}</strong><span class="stat-note">${next ? escapeHTML(next.title) : "예정된 게시물이 없습니다"}</span></article>
      </div>`;
  }

  function scheduleRowsHTML(events) {
    if (!events.length) return '<div class="no-results">검색 결과가 없습니다.</div>';
    return events.map((event) => {
      const product = state.data.products[event.productId];
      const status = product?.status || "상태 미확인";
      return `<article class="schedule-row" data-search-text="${escapeHTML(`${event.title} ${event.type} ${status}`.toLowerCase())}">
        <div class="schedule-date">${escapeHTML(event.date.slice(5).replace("-", "/"))} <span class="small-muted">${escapeHTML(event.weekday)}</span></div>
        <div><div class="schedule-title">${escapeHTML(event.title)}</div><div class="schedule-type">${escapeHTML(event.type)}<span class="schedule-status">${escapeHTML(status)}</span></div></div>
        <button class="open-button" data-product="${escapeHTML(event.productId)}" type="button">상세 보기</button>
      </article>`;
    }).join("");
  }

  function bindProductButtons(scope) {
    scope.querySelectorAll("[data-product]").forEach((button) => {
      button.addEventListener("click", () => routeTo(`product/${encodeURIComponent(button.dataset.product)}`));
    });
  }

  function renderSchedule(filterMonth = null) {
    const main = document.getElementById("main-content");
    const events = state.data.events.filter((event) => !filterMonth || Number(event.date.slice(5, 7)) === filterMonth);
    const months = filterMonth ? [filterMonth] : [7, 8];
    const title = filterMonth ? `2026년 ${filterMonth}월 일정` : "7·8월 SNS 일정";

    main.innerHTML = `
      <div class="page-head">
        <div><p class="page-kicker">EDITORIAL CALENDAR</p><h2>${title}</h2><p>날짜 또는 제품명을 선택하면 제품 검수 페이지로 이동합니다.</p></div>
        <span class="meta-chip">최종 갱신 ${escapeHTML(state.data.meta.updatedAt)}</span>
      </div>
      ${renderStatsCards(events)}
      <div class="notice-banner"><span class="notice-icon">!</span><div>${escapeHTML(state.data.meta.securityNotice)} 제품 정보는 검증 상태를 확인한 뒤 사용하세요.</div></div>
      <div class="section-title-row"><h3>게시 캘린더</h3><span>제품명을 눌러 상세 정보 확인</span></div>
      <div class="month-grid">${months.map((month) => buildCalendar(2026, month, state.data.events)).join("")}</div>
      <div class="schedule-toolbar">
        <div class="search-wrap"><span class="search-icon">⌕</span><input id="schedule-search" type="search" placeholder="제품명 또는 상태 검색" aria-label="일정 검색"></div>
        <span id="list-count" class="list-count">${events.length}개 게시물</span>
      </div>
      <div id="schedule-list" class="schedule-list">${scheduleRowsHTML(events)}</div>
      <p class="updated-note">암호화된 내부 자료 · 외부 공유 금지</p>`;

    bindProductButtons(main);
    const search = document.getElementById("schedule-search");
    search.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      const filtered = events.filter((event) => {
        const product = state.data.products[event.productId];
        return `${event.title} ${event.type} ${product?.status || ""}`.toLowerCase().includes(query);
      });
      const list = document.getElementById("schedule-list");
      list.innerHTML = scheduleRowsHTML(filtered);
      document.getElementById("list-count").textContent = `${filtered.length}개 게시물`;
      bindProductButtons(list);
    });
  }

  function listHTML(items, emptyText = "등록된 정보가 없습니다.") {
    if (!items || !items.length) return `<div class="empty-state">${escapeHTML(emptyText)}</div>`;
    return `<ul class="bullet-list">${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
  }

  function linksHTML(items, emptyText) {
    if (!items || !items.length) return `<div class="empty-state">${escapeHTML(emptyText)}</div>`;
    return `<div class="link-list">${items.map((item) => {
      const url = safeUrl(item.url);
      const detail = `${item.kind || item.publisher || ""}${item.use || item.note ? ` · ${item.use || item.note}` : ""}`;
      return `<a class="link-card" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer"><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(detail)}</span><span class="link-domain">${escapeHTML(getDomain(url))}</span></a>`;
    }).join("")}</div>`;
  }

  function getAdjacentProducts(productId) {
    const events = [...state.data.events].sort((a, b) => a.date.localeCompare(b.date));
    const index = events.findIndex((event) => event.productId === productId);
    return { previous: index > 0 ? events[index - 1] : null, next: index >= 0 && index < events.length - 1 ? events[index + 1] : null };
  }

  function renderProduct(productId) {
    const product = state.data.products[productId];
    const main = document.getElementById("main-content");
    if (!product) {
      main.innerHTML = '<div class="empty-state">해당 제품 페이지를 찾지 못했습니다.</div>';
      return;
    }

    const facts = product.facts || [];
    const verifiedFacts = facts.filter((fact) => fact.verified).length;
    const sourceCount = product.sources?.length || 0;
    const imageCount = product.officialImages?.length || 0;
    const draftText = product.draft?.text || "";
    const adjacent = getAdjacentProducts(productId);

    const images = imageCount
      ? `<div class="image-grid">${product.officialImages.map((image) => {
          const src = safeUrl(image.src);
          const sourceUrl = safeUrl(image.sourceUrl);
          return `<figure class="image-card"><div class="image-card-media"><img src="${escapeHTML(src)}" alt="${escapeHTML(image.alt)}" loading="lazy"><div class="image-fallback">이미지를 불러오지 못했습니다.</div></div><figcaption><strong>${escapeHTML(image.caption)}</strong><a href="${escapeHTML(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(image.sourceLabel)} ↗</a><p>${escapeHTML(image.notice || "")}</p></figcaption></figure>`;
        }).join("")}</div>`
      : '<div class="empty-state">검증된 공식 또는 자사몰 이미지가 아직 등록되지 않았습니다. 출처와 사용 가능 여부를 확인한 뒤 추가해야 합니다.</div>';

    main.innerHTML = `
      <div class="breadcrumb"><button id="back-schedule" type="button">일정</button><span>›</span><span>${escapeHTML(product.date)}</span></div>
      <section class="detail-hero">
        <div><div class="detail-date">${escapeHTML(product.date)} · ${escapeHTML(product.weekday)}요일 · ${escapeHTML(product.type)}</div><h2>${escapeHTML(product.title)}</h2><p>${escapeHTML(product.summary)}</p></div>
        <span class="status-badge ${escapeHTML(product.statusTone || "")}">${escapeHTML(product.status)} · ${escapeHTML(product.verification)}</span>
      </section>
      <div class="detail-metrics">
        <div class="metric-chip"><span>VERIFIED FACTS</span><strong>${verifiedFacts}/${facts.length}</strong></div>
        <div class="metric-chip"><span>SOURCES</span><strong>${sourceCount}개</strong></div>
        <div class="metric-chip"><span>OFFICIAL IMAGES</span><strong>${imageCount}개</strong></div>
        <div class="metric-chip"><span>DRAFT</span><strong>${escapeHTML(product.draft?.state || "작성 전")}</strong></div>
      </div>
      <div class="product-nav">
        ${adjacent.previous ? `<button class="product-nav-button" data-product="${escapeHTML(adjacent.previous.productId)}" type="button">← ${escapeHTML(adjacent.previous.title)}</button>` : "<span></span>"}
        ${adjacent.next ? `<button class="product-nav-button next" data-product="${escapeHTML(adjacent.next.productId)}" type="button">${escapeHTML(adjacent.next.title)} →</button>` : ""}
      </div>
      <div class="detail-grid">
        <div class="stack">
          <section class="section-card"><div class="section-head"><h3>제품 정보</h3><span>확인된 사실만 표시</span></div><div class="section-body"><div class="fact-list"><div class="fact-row"><div class="fact-label">공식 표기</div><div class="fact-value">${escapeHTML(product.officialName || "확인 필요")}${product.englishName ? `<br><span class="small-muted">${escapeHTML(product.englishName)}</span>` : ""}</div><div class="fact-state">●</div></div>${facts.map((fact) => `<div class="fact-row"><div class="fact-label">${escapeHTML(fact.label)}</div><div class="fact-value">${escapeHTML(fact.value)}</div><div class="fact-state ${fact.verified ? "" : "unverified"}">${fact.verified ? "✓" : "?"}</div></div>`).join("")}</div></div></section>
          <section class="section-card"><div class="section-head"><h3>공식·자사몰 이미지</h3><span>출처 링크 포함</span></div><div class="section-body">${images}</div></section>
          <section class="section-card"><div class="section-head"><h3>제품 특징</h3><span>검증 정보 기반</span></div><div class="section-body">${listHTML(product.features, "공식 정보 검증 후 등록합니다.")}</div></section>
          <section class="section-card"><div class="section-head"><h3>장점과 주의점</h3><span>내부 콘텐츠 기획용</span></div><div class="section-body split-two"><div class="mini-panel pro"><h4>장점</h4>${listHTML(product.pros)}</div><div class="mini-panel con"><h4>단점·주의점</h4>${listHTML(product.cons)}</div></div></section>
          <section class="section-card"><div class="section-head"><h3>1차 원고</h3><span>전일 검토용</span></div><div class="section-body"><div class="draft-box"><div class="draft-topline"><span class="draft-state">${escapeHTML(product.draft?.state || "작성 전")}</span><span class="draft-count">${draftText.length.toLocaleString("ko-KR")}자</span></div><button class="copy-button" id="copy-draft" type="button">복사</button><pre class="draft-text" id="draft-text">${escapeHTML(draftText)}</pre></div></div></section>
        </div>
        <aside class="stack">
          <section class="section-card"><div class="section-head"><h3>검증 출처</h3><span>${sourceCount}개</span></div><div class="section-body">${linksHTML(product.sources, "공식 제조사·수입원·자사몰 출처를 조사 중입니다.")}</div></section>
          <section class="section-card"><div class="section-head"><h3>다른 곳의 글</h3><span>표현·사진 구성 참고용</span></div><div class="section-body">${linksHTML(product.referencePosts, "경쟁사 또는 외부 참고 글이 아직 등록되지 않았습니다.")}</div></section>
          <section class="section-card"><div class="section-head"><h3>업로드 전 확인</h3><span>체크리스트</span></div><div class="section-body">${listHTML(product.checklist)}</div></section>
        </aside>
      </div>
      <p class="updated-note">이 페이지의 검증 상태를 확인하지 않고 외부 게시물에 사용하지 마세요.</p>`;

    document.getElementById("back-schedule").addEventListener("click", () => routeTo("schedule"));
    bindProductButtons(main);
    main.querySelectorAll(".image-card img").forEach((image) => image.addEventListener("error", () => image.classList.add("is-broken"), { once: true }));
    document.getElementById("copy-draft").addEventListener("click", async (event) => {
      try {
        await navigator.clipboard.writeText(draftText);
        event.currentTarget.textContent = "복사됨";
        event.currentTarget.classList.add("copied");
        setTimeout(() => { event.currentTarget.textContent = "복사"; event.currentTarget.classList.remove("copied"); }, 1500);
      } catch {
        event.currentTarget.textContent = "복사 실패";
      }
    });
  }

  renderLogin();
})();
