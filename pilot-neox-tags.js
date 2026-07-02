(() => {
  const items = window.BLUEBLACK_JULY_PRODUCTS || [];
  const copies = window.BLUEBLACK_COPY_VARIANTS = window.BLUEBLACK_COPY_VARIANTS || {};
  const item = items.find((entry) => entry.key === 'pilot-neox-wakaru');
  if (!item) return;

  const tagLine = '#파이롯트 #PILOT #네옥스그래파이트 #NEOXGraphite #WAKARU #와카루 #샤프심 #샤프심추천 #샤프펜슬 #샤프리필 #03mm샤프심 #05mm샤프심 #한정문구 #문구신제품 #문구추천 #필기구 #필기구추천 #공부문구 #블루블랙펜샵 #블블샵';
  item.content.hashtags = tagLine;
  item.hashtagTarget = 20;
  item.officialAccountRequired = true;
  item.officialAccountStatus = 'PILOT 브랜드 공식 인스타그램 계정 확인 필요';

  const existingLabels = new Set((item.facts || []).map(([label]) => label));
  const checks = [
    ['해시태그 기준', '관련 태그 20개'],
    ['브랜드 공식 계정', '게시 전 PILOT 공식 인스타그램 계정 확인 필수']
  ];
  item.facts = [...(item.facts || []), ...checks.filter(([label]) => !existingLabels.has(label))];

  if (Array.isArray(item.variants)) {
    item.variants = item.variants.map((draft) => {
      const body = String(draft || '')
        .split('\n')
        .filter((line) => !line.trim().startsWith('#'))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      return `${body}\n\n${tagLine}`;
    });
    (item.ids || []).forEach((id) => { copies[id] = item.variants; });
  }
})();
