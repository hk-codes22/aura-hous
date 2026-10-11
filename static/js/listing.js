/* Listing pages: item count + sorting */
(function () {
  'use strict';
  var grid = document.querySelector('.cloth-section');
  var select = document.getElementById('sort');
  var countEl = document.querySelector('.result-count');
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.product'));
  cards.forEach(function (c, i) { c.dataset.order = i; });
  if (countEl) countEl.textContent = cards.length + ' items';
  if (!select) return;

  var sorters = {
    featured: function (a, b) { return a.dataset.order - b.dataset.order; },
    'price-asc': function (a, b) { return a.dataset.price - b.dataset.price; },
    'price-desc': function (a, b) { return b.dataset.price - a.dataset.price; },
    name: function (a, b) { return a.dataset.name.localeCompare(b.dataset.name); }
  };
  select.addEventListener('change', function () {
    cards.slice().sort(sorters[select.value]).forEach(function (c) { grid.appendChild(c); });
  });
})();
