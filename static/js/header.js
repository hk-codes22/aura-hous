/* Header behaviour: mobile menu toggle and shadow on scroll */
(function () {
  'use strict';
  var body = document.body;
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { body.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', false); }
    });
  }

  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
