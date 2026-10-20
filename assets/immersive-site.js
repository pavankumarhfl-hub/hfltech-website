/* Compatibility loader: the page-specific scene engine owns visual selection. */
(()=>{if(document.querySelector('script[data-page-scenes]'))return;const s=document.createElement('script');s.src='/assets/page-scenes.js';s.defer=true;s.dataset.pageScenes='true';document.head.appendChild(s)})();
