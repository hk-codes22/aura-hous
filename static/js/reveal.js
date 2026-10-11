/* Add selectors to TARGETS to animate more things */
(function () {
  'use strict';
  var TARGETS = '.product, .category-card, .cloth-category > a, .trust-strip div, .promo-band-inner, ' +
    '.platform-card, .support-grid .card, .stat-card, .review, .gallery-box, .content-block > div';
  if (!('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(TARGETS).forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    io.observe(el);
  });
})();
