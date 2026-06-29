(() => {
  'use strict';

  const configs = window.BLUEBLACK_HOUSE_COPY_CONFIGS || [];
  const store = window.BLUEBLACK_COPY_VARIANTS = window.BLUEBLACK_COPY_VARIANTS || {};

  const clean = (value = '') => String(value).trim();
  const compact = (items = []) => items.filter(Boolean).join('\n');
  const tagLine = (item) => compact([item.account, item.hashtags]);
  const featureBlock = (item) => item.features?.length
    ? `${item.featureTitle || '✨ Check Point'}\n\n${item.features.join('\n')}`
    : '';
  const recommendBlock = (item) => item.recommend?.length
    ? item.recommend.join('\n')
    : '';

  function makeVariants(item) {
    const tags = tagLine(item);
    const warning = clean(item.warning);
    return [
      compact([
        item.emoji,
        item.announce,
        '',
        item.intro,
        '',
        item.detail,
        '',
        featureBlock(item),
        warning ? `\n${warning}` : '',
        '',
        item.cta,
        '',
        tags
      ]),
      compact([
        item.emoji,
        item.v2Title || item.announce,
        '',
        item.mood,
        '',
        item.v2Body || item.detail,
        '',
        item.use,
        warning ? `\n${warning}` : '',
        '',
        item.ctaAlt || item.cta,
        '',
        tags
      ]),
      compact([
        item.emoji,
        item.v3Title || `${item.name}의 매력을 한눈에 살펴보세요!`,
        '',
        item.v3Intro || item.intro,
        '',
        featureBlock(item),
        '',
        item.v3Body || item.detail,
        warning ? `\n${warning}` : '',
        '',
        item.cta,
        '',
        tags
      ]),
      compact([
        item.emoji,
        item.v4Title || `이런 분께 ${item.name}을 추천드립니다!`,
        '',
        item.use,
        '',
        recommendBlock(item),
        '',
        item.v4Body || item.detail,
        warning ? `\n${warning}` : '',
        '',
        item.ctaAlt || item.cta,
        '',
        tags
      ]),
      compact([
        item.emoji,
        item.announce,
        '',
        item.short,
        warning ? `\n${warning}` : '',
        '',
        item.ctaShort || item.cta,
        '',
        tags
      ])
    ];
  }

  function normalize(value = '') {
    return String(value).toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
  }

  configs.forEach((item) => {
    const variants = makeVariants(item);
    item.variants = variants;
    (item.ids || []).forEach((id) => { store[id] = variants; });
  });

  window.BLUEBLACK_FIND_HOUSE_COPY = (productId, title = '') => {
    const idKey = normalize(productId);
    const titleKey = normalize(title);
    const item = configs.find((config) => {
      if ((config.ids || []).some((id) => normalize(id) === idKey)) return true;
      return (config.match || []).some((keyword) => {
        const key = normalize(keyword);
        return key && (idKey.includes(key) || titleKey.includes(key));
      });
    });
    if (!item) return null;
    const variants = item.variants || makeVariants(item);
    if (productId) store[productId] = variants;
    return variants;
  };
})();