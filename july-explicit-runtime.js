(() => {
  'use strict';

  const copyStore = window.BLUEBLACK_COPY_VARIANTS = window.BLUEBLACK_COPY_VARIANTS || {};
  const sources = {
    pilot: copyStore['pilot-neox-wakaru'],
    nature0706: copyStore['monday-0706'],
    carandache: copyStore['caran-dache-849'],
    monteverde: copyStore['monteverde-calibra-4in1'],
    tonland: copyStore['monday-0713'],
    sheaffer: copyStore['sheaffer-vfm'],
    conifer: copyStore['conifer-notes'],
    nature0720: copyStore['monday-0720'],
    diplomat: copyStore['diplomat-traveller'],
    sailor: copyStore['sailor-deep-tone'],
    penco: copyStore['monday-0727'],
    waterman: copyStore['waterman-expert-deluxe'],
    esterbrook: copyStore['esterbrook-estie']
  };

  const rules = [
    { key: 'pilot', ids: ['pilot-neox-wakaru','pilot-neox','pilot-wakaru'], words: ['파이롯트네옥스','파일럿네옥스','네옥스그래파이트','neoxwakaru','네옥스와카루','네옥스와카쿠'] },
    { key: 'nature0706', ids: ['monday-0706'], words: ['monday0706'] },
    { key: 'carandache', ids: ['caran-dache-849','carandache-849'], words: ['까렌다쉬849','카렌다쉬849','carandache849'] },
    { key: 'monteverde', ids: ['monteverde-calibra-4in1','monteverde-calibra','monteverde-desk-set'], words: ['몬테베르데카리브라','몬테베르데칼리브라','카리브라4in1','monteverdecalibra'] },
    { key: 'tonland', ids: ['monday-0713','tonland-basic-6ring'], words: ['monday0713','톤랜드베이직6공','톤랜드가죽6공'] },
    { key: 'sheaffer', ids: ['sheaffer-vfm','sheaffer-vfm-ballpoint'], words: ['쉐퍼vfm','sheaffervfm'] },
    { key: 'conifer', ids: ['conifer-notes','conifer-view-unique'], words: ['코니퍼뷰유니크','코니퍼노트','코니퍼뷰','코니퍼유니크'] },
    { key: 'nature0720', ids: ['monday-0720'], words: ['monday0720'] },
    { key: 'diplomat', ids: ['diplomat-traveller','diplomat-traveller-set'], words: ['디플로마트트래블러','diplomattraveller'] },
    { key: 'sailor', ids: ['sailor-deep-tone','sailor-dipton','sailor-dipton-shimmer-sheen'], words: ['세일러딥톤','세일러딥턴','세일러dipton','sailordipton','dipton'] },
    { key: 'penco', ids: ['monday-0727','penco-prime-timber'], words: ['monday0727','펜코프라임팀버','pencoprimetimber'] },
    { key: 'waterman', ids: ['waterman-expert-deluxe','waterman-expert-3-deluxe','waterman-expert-metallic'], words: ['워터맨엑스퍼트','watermanexpert'] },
    { key: 'esterbrook', ids: ['esterbrook-estie','esterbrook-estie-fountain-pen','estie-fountain-pen'], words: ['에스터브룩에스티','esterbrookestie'] }
  ];

  const normalize = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9가-힣]/g, '');

  function currentProductId() {
    const route = location.hash.replace(/^#\//, '');
    if (!route.startsWith('product/')) return '';
    try { return decodeURIComponent(route.slice(8)); }
    catch { return route.slice(8); }
  }

  function findRule(productId, title) {
    const idKey = normalize(productId);
    const titleKey = normalize(title);
    return rules.find((rule) =>
      rule.ids.some((id) => normalize(id) === idKey) ||
      rule.words.some((word) => {
        const key = normalize(word);
        return key && (idKey.includes(key) || titleKey.includes(key));
      })
    );
  }

  function apply() {
    const productId = currentProductId();
    if (!productId) return;
    const title = document.querySelector('.detail-hero h2')?.textContent?.trim() || '';
    const rule = findRule(productId, title);
    if (!rule) return;
    const variants = sources[rule.key];
    if (!Array.isArray(variants) || variants.length !== 5) return;

    copyStore[productId] = variants;
    rule.ids.forEach((id) => { copyStore[id] = variants; });

    const section = document.getElementById('selected-version-text')?.closest('.section-card');
    if (section && section.dataset.copyVariants === productId) {
      section.removeAttribute('data-copy-variants');
      section.querySelector('.section-body')?.replaceChildren();
      const legacyDraft = document.createElement('pre');
      legacyDraft.id = 'draft-text';
      legacyDraft.className = 'draft-text';
      section.querySelector('.section-body')?.appendChild(legacyDraft);
    }
  }

  let timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(apply, 30);
  }

  apply();
  window.addEventListener('DOMContentLoaded', schedule, { once: true });
  window.addEventListener('hashchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();