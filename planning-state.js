setInterval(() => {
  document.querySelectorAll('.schedule-timeline-item').forEach((item) => {
    if (item.querySelector('.timeline-label')?.textContent?.trim() === '현재 원고') {
      const value = item.querySelector('strong');
      if (value) value.textContent = '1차안 작성 완료 · 최종 검수 전';
    }
  });
}, 500);
