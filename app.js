
(() => {
  "use strict";

  const app = document.getElementById("app");
  let state = { data: null, failed: 0, lockedUntil: 0, idleTimer: null };
  const AAD_TEXT = "BlueBlack-SNS-v1";
  const IDLE_MS = 20 * 60 * 1000;

  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const b64ToBytes = (b64) => {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  };

  const escapeHTML = (value = "") =>
    String(value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[ch]);

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
      {
        name: "AES-GCM",
        iv: b64ToBytes(payload.iv),
        additionalData: b64ToBytes(payload.aad),
        tagLength: 128
      },
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

  function renderLogin(message = "") {
    state.data = null;
    location.hash = "";
    app.innerHTML = `
      <main class="login-shell" aria-labelledby="login-title">
        <section class="login-card">
          <div class="brand-mark" aria-hidden="true">BB</div>
          <p class="eyebrow">INTERNAL WORKSPACE</p>
          <h1 id="login-title">BlueBlack SNS</h1>
          <p class="login-copy">사내 일정과 제품 검수 자료를 확인하려면 로그인하세요.</p>
          <form id="login-form" class="login-form" autocomplete="off">
            <label><span>아이디</span><input id="username" type="text" autocomplete="username" required /></label>
            <label>
              <span>비밀번호</span>
              <div class="password-row">
                <input id="password" type="password" autocomplete="current-password" required />
                <button id="toggle-password" class="icon-button" type="button">보기</button>
              </div>
            </label>
            <button id="login-button" class="primary-button" type="submit">
              <span class="button-label">로그인</span><span class="spinner" hidden></span>
            </button>
            <p id="login-message" class="form-message" role="alert">${escapeHTML(message)}</p>
          </form>
          <div class="security-note"><strong>보안 안내</strong><p>인증 정보는 저장되지 않으며 암호화된 자료는 로그인 후 브라우저 메모리에서만 열립니다.</p></div>
        </section>
        <p class="footer-note">Unauthorized access is prohibited.</p>
      </main>`;

    const form = document.getElementById("login-form");
    const toggle = document.getElementById("toggle-password");
    toggle.addEventListener("click", () => {
      const input = document.getElementById("password");
      input.type = input.type === "password" ? "text" : "password";
      toggle.textContent = input.type === "password" ? "보기" : "숨김";
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
      button.disabled = true;
      spinner.hidden = false;
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
      } catch (error) {
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

  function renderWorkspace() {
    const meta = state.data.meta;
    app.innerHTML = `
      <div class="workspace">
        <header class="topbar">
          <div class="topbar-brand">
            <div class="topbar-logo">BB</div>
            <div>
              <div class="topbar-title">${escapeHTML(meta.title)}</div>
              <span class="topbar-sub">${escapeHTML(meta.subtitle)}</span>
            </div>
          </div>
          <div class="topbar-actions">
            <button id="home-button" class="ghost-button" type="button">일정</button>
            <button id="logout-button" class="ghost-button" type="button">로그아웃</button>
          </div>
        </header>
        <div class="app-shell">
          <aside class="sidebar">
            <p class="nav-label">WORKSPACE</p>
            <button class="nav-button active" data-route="schedule"><span class="nav-dot"></span>전체 일정</button>
            <button class="nav-button" data-route="july"><span class="nav-dot"></span>7월</button>
            <button class="nav-button" data-route="august"><span class="nav-dot"></span>8월</button>
            <div class="side-security">${escapeHTML(meta.securityNotice)}<br><br>20분 동안 활동이 없으면 자동 로그아웃됩니다.</div>
          </aside>
          <main id="main-content" class="main-content"></main>
        </div>
      </div>`;

    document.getElementById("logout-button").addEventListener("click", () => logout());
    document.getElementById("home-button").addEventListener("click", () => routeTo("schedule"));
    document.querySelectorAll("[data-route]").forEach((button) => {
      button.addEventListener("click", () => routeTo(button.dataset.route));
    });
    window.addEventListener("hashchange", handleRoute);
    handleRoute();
  }

  function routeTo(route) {
    location.hash = `#/${route}`;
  }

  function handleRoute() {
    if (!state.data) return;
    const route = location.hash.replace(/^#\//, "") || "schedule";
    document.querySelectorAll(".nav-button").forEach((b) => b.classList.toggle("active", b.dataset.route === route));
    if (route.startsWith("product/")) {
      renderProduct(route.split("/")[1]);
      return;
    }
    if (route === "july") return renderSchedule(7);
    if (route === "august") return renderSchedule(8);
    renderSchedule();
  }

  function monthName(month) { return `${month}월`; }

  function buildCalendar(year, month, events) {
    const first = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = 0; i < first.getDay(); i++) cells.push(`<div class="day-cell empty"></div>`);
    for (let day = 1; day <= lastDate; day++) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = events.filter((event) => event.date === date);
      cells.push(`
        <div class="day-cell ${dayEvents.length ? "has-event" : ""}">
          <div class="day-number">${day}</div>
          ${dayEvents.map((event) => `<button class="event-button" data-product="${escapeHTML(event.productId)}">${escapeHTML(event.title)}</button>`).join("")}
        </div>`);
    }
    return `
      <section class="calendar-card">
        <div class="calendar-head"><h3>2026년 ${monthName(month)}</h3><span>${events.filter(e => Number(e.date.slice(5,7)) === month).length}개 일정</span></div>
        <div class="week-row"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div>
        <div class="calendar-grid">${cells.join("")}</div>
      </section>`;
  }

  function renderSchedule(filterMonth = null) {
    const main = document.getElementById("main-content");
    const events = state.data.events.filter((event) => !filterMonth || Number(event.date.slice(5,7)) === filterMonth);
    const months = filterMonth ? [filterMonth] : [7, 8];

    main.innerHTML = `
      <div class="page-head">
        <div><h2>${filterMonth ? `2026년 ${filterMonth}월 일정` : "7·8월 SNS 일정"}</h2><p>날짜 또는 제품명을 누르면 제품 검수 페이지로 이동합니다.</p></div>
        <span class="meta-chip">최종 갱신 ${escapeHTML(state.data.meta.updatedAt)}</span>
      </div>
      <div class="notice-banner"><span class="notice-icon">!</span><div>${escapeHTML(state.data.meta.securityNotice)} 제품 정보는 검증 상태를 확인한 뒤 사용하세요.</div></div>
      <div class="month-grid">${months.map((m) => buildCalendar(2026, m, state.data.events)).join("")}</div>
      <div class="schedule-list">
        ${events.map((event) => {
          const product = state.data.products[event.productId];
          return `<article class="schedule-row">
            <div class="schedule-date">${escapeHTML(event.date.slice(5).replace("-", "/"))} ${escapeHTML(event.weekday)}</div>
            <div><div class="schedule-title">${escapeHTML(event.title)}</div><div class="schedule-type">${escapeHTML(event.type)} · ${escapeHTML(product?.status || "상태 미확인")}</div></div>
            <button class="open-button" data-product="${escapeHTML(event.productId)}">상세 보기</button>
          </article>`;
        }).join("")}
      </div>
      <p class="updated-note">암호화된 내부 자료 · 외부 공유 금지</p>`;

    main.querySelectorAll("[data-product]").forEach((button) => {
      button.addEventListener("click", () => routeTo(`product/${button.dataset.product}`));
    });
  }

  function listHTML(items, emptyText = "등록된 정보가 없습니다.") {
    if (!items || !items.length) return `<div class="empty-state">${escapeHTML(emptyText)}</div>`;
    return `<ul class="bullet-list">${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
  }

  function linksHTML(items, emptyText) {
    if (!items || !items.length) return `<div class="empty-state">${escapeHTML(emptyText)}</div>`;
    return `<div class="link-list">${items.map((item) => `
      <a class="link-card" href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">
        <strong>${escapeHTML(item.name)}</strong>
        <span>${escapeHTML(item.kind || item.publisher || "")}${item.use || item.note ? ` · ${escapeHTML(item.use || item.note)}` : ""}</span>
      </a>`).join("")}</div>`;
  }

  function renderProduct(productId) {
    const product = state.data.products[productId];
    const main = document.getElementById("main-content");
    if (!product) {
      main.innerHTML = `<div class="empty-state">해당 제품 페이지를 찾지 못했습니다.</div>`;
      return;
    }

    const images = product.officialImages?.length
      ? `<div class="image-grid">${product.officialImages.map((image) => `
          <figure class="image-card">
            <img src="${image.src}" alt="${escapeHTML(image.alt)}" />
            <figcaption>
              <strong>${escapeHTML(image.caption)}</strong>
              <a href="${escapeHTML(image.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(image.sourceLabel)}</a>
              <p>${escapeHTML(image.notice || "")}</p>
            </figcaption>
          </figure>`).join("")}</div>`
      : `<div class="empty-state">검증된 공식 또는 자사몰 이미지가 아직 등록되지 않았습니다. 출처와 사용 가능 여부를 확인한 뒤 추가해야 합니다.</div>`;

    main.innerHTML = `
      <div class="breadcrumb"><button id="back-schedule" type="button">일정</button><span>›</span><span>${escapeHTML(product.date)}</span></div>
      <section class="detail-hero">
        <div>
          <div class="detail-date">${escapeHTML(product.date)} · ${escapeHTML(product.weekday)}요일 · ${escapeHTML(product.type)}</div>
          <h2>${escapeHTML(product.title)}</h2>
          <p>${escapeHTML(product.summary)}</p>
        </div>
        <span class="status-badge ${escapeHTML(product.statusTone || "")}">${escapeHTML(product.status)} · ${escapeHTML(product.verification)}</span>
      </section>

      <div class="detail-grid">
        <div class="stack">
          <section class="section-card">
            <div class="section-head"><h3>제품 정보</h3><span>확인된 사실만 표시</span></div>
            <div class="section-body">
              <div class="fact-list">
                <div class="fact-row"><div class="fact-label">공식 표기</div><div class="fact-value">${escapeHTML(product.officialName || "확인 필요")}${product.englishName ? `<br><span class="small-muted">${escapeHTML(product.englishName)}</span>` : ""}</div><div class="fact-state">●</div></div>
                ${product.facts.map((fact) => `<div class="fact-row"><div class="fact-label">${escapeHTML(fact.label)}</div><div class="fact-value">${escapeHTML(fact.value)}</div><div class="fact-state">${fact.verified ? "✓" : "?"}</div></div>`).join("")}
              </div>
            </div>
          </section>

          <section class="section-card">
            <div class="section-head"><h3>공식·자사몰 이미지</h3><span>출처 링크 포함</span></div>
            <div class="section-body">${images}</div>
          </section>

          <section class="section-card">
            <div class="section-head"><h3>제품 특징</h3><span>검증 정보 기반</span></div>
            <div class="section-body">${listHTML(product.features, "공식 정보 검증 후 등록합니다.")}</div>
          </section>

          <section class="section-card">
            <div class="section-head"><h3>장점과 주의점</h3><span>내부 콘텐츠 기획용</span></div>
            <div class="section-body split-two">
              <div class="mini-panel pro"><h4>장점</h4>${listHTML(product.pros)}</div>
              <div class="mini-panel con"><h4>단점·주의점</h4>${listHTML(product.cons)}</div>
            </div>
          </section>

          <section class="section-card">
            <div class="section-head"><h3>1차 원고</h3><span>전일 검토용</span></div>
            <div class="section-body">
              <div class="draft-box">
                <span class="draft-state">${escapeHTML(product.draft?.state || "작성 전")}</span>
                <button class="copy-button" id="copy-draft" type="button">복사</button>
                <pre class="draft-text" id="draft-text">${escapeHTML(product.draft?.text || "")}</pre>
              </div>
            </div>
          </section>
        </div>

        <aside class="stack">
          <section class="section-card">
            <div class="section-head"><h3>검증 출처</h3><span>${product.sources?.length || 0}개</span></div>
            <div class="section-body">${linksHTML(product.sources, "공식 제조사·수입원·자사몰 출처를 조사 중입니다.")}</div>
          </section>

          <section class="section-card">
            <div class="section-head"><h3>다른 곳의 글</h3><span>표현·사진 구성 참고용</span></div>
            <div class="section-body">${linksHTML(product.referencePosts, "경쟁사 또는 외부 참고 글이 아직 등록되지 않았습니다.")}</div>
          </section>

          <section class="section-card">
            <div class="section-head"><h3>업로드 전 확인</h3><span>체크리스트</span></div>
            <div class="section-body">${listHTML(product.checklist)}</div>
          </section>
        </aside>
      </div>
      <p class="updated-note">이 페이지의 검증 상태를 확인하지 않고 외부 게시물에 사용하지 마세요.</p>`;

    document.getElementById("back-schedule").addEventListener("click", () => routeTo("schedule"));
    document.getElementById("copy-draft").addEventListener("click", async (event) => {
      const text = product.draft?.text || "";
      try {
        await navigator.clipboard.writeText(text);
        event.currentTarget.textContent = "복사됨";
        event.currentTarget.classList.add("copied");
        setTimeout(() => {
          event.currentTarget.textContent = "복사";
          event.currentTarget.classList.remove("copied");
        }, 1500);
      } catch {
        event.currentTarget.textContent = "복사 실패";
      }
    });
  }

  renderLogin();
})();
