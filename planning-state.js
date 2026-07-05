(() => {
  'use strict';

  const TARGET_LABEL = '현재 원고';
  const TARGET_VALUE = '1차안 작성 완료 · 최종 검수 전';
  let scheduled = false;

  function applyPlanningState() {
    document.querySelectorAll('.schedule-timeline-item').forEach((item) => {
      if (item.querySelector('.timeline-label')?.textContent?.trim() !== TARGET_LABEL) return;
      const value = item.querySelector('strong');
      if (value && value.textContent.trim() !== TARGET_VALUE) value.textContent = TARGET_VALUE;
    });
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      applyPlanningState();
    });
  }

  const root = document.getElementById('app') || document.documentElement;
  new MutationObserver(scheduleApply).observe(root, { childList: true, subtree: true });
  window.addEventListener('hashchange', scheduleApply);
  scheduleApply();
})();