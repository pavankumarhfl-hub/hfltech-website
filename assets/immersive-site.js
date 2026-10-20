/* Compatibility loader: the page-specific scene engine owns visual selection. */
/* SEO-ADD: Items #11, #13, #15, #16 — load non-blocking shared SEO enhancements on pages using the global immersive loader. */
(()=>{if(document.querySelector('script[data-seo-enhancements]'))return;const s=document.createElement('script');s.src='/assets/seo-enhancements.js';s.defer=true;s.dataset.seoEnhancements='true';document.head.appendChild(s)})();
(()=>{if(document.querySelector('script[data-page-scenes]'))return;const s=document.createElement('script');s.src='/assets/page-scenes.js';s.defer=true;s.dataset.pageScenes='true';document.head.appendChild(s)})();
