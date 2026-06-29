(() => {
  'use strict';
  const configs = window.BLUEBLACK_HOUSE_COPY_CONFIGS || [];
  const store = window.BLUEBLACK_COPY_VARIANTS = window.BLUEBLACK_COPY_VARIANTS || {};
  const clean = (value = '') => String(value).trim();
  const join = (items = []) => items
    .filter((value) => value !== null && value !== undefined && value !== false)
    .join('\n')
    .replace(/\n\n\n+/g, '\n\n')
    .trim();
  const tags = (item) => [item.account, item.hashtags].filter(Boolean).join('\n');
  const features = (item) => item.features?.length
    ? `${item.featureTitle || '✨ Check Point'}\n\n${item.features.join('\n')}` : '';
  const recommends = (item) => item.recommend?.length ? item.recommend.join('\n') : '';

  function build(item) {
    const warning = clean(item.warning);
    return [
      join([item.emoji,item.announce,'',item.intro,'',item.detail,'',features(item),warning ? `\n${warning}` : '','',item.cta,'',tags(item)]),
      join([item.emoji,item.v2Title || item.announce,'',item.mood,'',item.v2Body || item.detail,'',item.use,warning ? `\n${warning}` : '','',item.ctaAlt || item.cta,'',tags(item)]),
      join([item.emoji,item.v3Title || `${item.name}의 매력을 한눈에 살펴보세요!`,'',item.v3Intro || item.intro,'',features(item),'',item.v3Body || item.detail,warning ? `\n${warning}` : '','',item.cta,'',tags(item)]),
      join([item.emoji,item.v4Title || `이런 분께 ${item.name}을 추천드립니다!`,'',item.use,'',recommends(item),'',item.v4Body || item.detail,warning ? `\n${warning}` : '','',item.ctaAlt || item.cta,'',tags(item)]),
      join([item.emoji,item.announce,'',item.short,warning ? `\n${warning}` : '','',item.ctaShort || item.cta,'',tags(item)])
    ];
  }

  const normalize = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
  configs.forEach((item) => {
    item.variants = build(item);
    (item.ids || []).forEach((id) => { store[id] = item.variants; });
  });
  window.BLUEBLACK_FIND_HOUSE_COPY = (productId, title = '') => {
    const idKey = normalize(productId);
    const titleKey = normalize(title);
    const item = configs.find((config) =>
      (config.ids || []).some((id) => normalize(id) === idKey) ||
      (config.match || []).some((keyword) => {
        const key = normalize(keyword);
        return key && (idKey.includes(key) || titleKey.includes(key));
      })
    );
    if (!item) return null;
    const variants = item.variants || build(item);
    if (productId) store[productId] = variants;
    return variants;
  };
})();