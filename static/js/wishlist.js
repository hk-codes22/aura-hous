/* Wishlist: saved in localStorage
   Requires cart.js to load first */
(function () {
  'use strict';
  var KEY = 'aura-wishlist';
  var body = document.body;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* storage unavailable */ } }
  function find(id) { return list.filter(function (i) { return i.id === id; })[0]; }

  var list = load();

  /* ----- build drawer markup once ----- */
  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div class="wish-overlay" data-wish-close></div>' +
    '<aside class="wish-drawer" role="dialog" aria-modal="true" aria-label="Wishlist">' +
      '<div class="wish-head"><h3>Your Wishlist</h3><button class="wish-close" data-wish-close aria-label="Close wishlist">&times;</button></div>' +
      '<div class="wish-items"></div>' +
      '<div class="wish-foot"><button class="btn btn-outline" data-wish-close>Continue Shopping</button></div>' +
    '</aside>';
  while (wrap.firstChild) body.appendChild(wrap.firstChild);

  var itemsEl = document.querySelector('.wish-items');
  var countEl = document.querySelector('.wish-count');

  function render() {
    if (countEl) {
      countEl.textContent = list.length;
      countEl.classList.toggle('has-items', list.length > 0);
    }
    if (!list.length) {
      itemsEl.innerHTML = '<div class="wish-empty">Nothing saved yet.<br>Tap the heart on any product to keep it here.</div>';
      return;
    }
    itemsEl.innerHTML = list.map(function (i) {
      return '<div class="wish-item" data-id="' + esc(i.id) + '">' +
        '<img src="' + esc(i.img) + '" alt="' + esc(i.name) + '">' +
        '<div><h4>' + esc(i.name) + '</h4><div>' + window.AuraCart.money(i.price) + '</div>' +
        '<button class="wish-add" data-wish-act="bag">Add to Bag</button></div>' +
        '<button class="remove" data-wish-act="remove">Remove</button></div>';
    }).join('');
  }

  /* Adds the item if it is not saved yet, removes it if it is. Returns true when it is now saved. */
  function toggle(item) {
    var on = !find(item.id);
    list = list.filter(function (i) { return i.id !== item.id; });
    if (on) list.push({ id: item.id, name: item.name, price: item.price, img: item.img });
    save(); render();
    if (on && countEl) { countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump'); }
    window.AuraCart.toast(on ? 'Saved to wishlist' : 'Removed from wishlist');
    document.dispatchEvent(new CustomEvent('aura:wishlist'));
    return on;
  }

  /* ----- open / close / row buttons (event delegation) ----- */
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-wish-open]')) {
      body.classList.remove('cart-open');
      body.classList.add('wish-open');
      return;
    }
    if (e.target.closest('[data-wish-close]')) { body.classList.remove('wish-open'); return; }
    if (e.target.closest('[data-cart-open]')) { body.classList.remove('wish-open'); return; }

    var btn = e.target.closest('[data-wish-act]');
    if (!btn) return;
    var item = find(btn.closest('.wish-item').dataset.id);
    if (!item) return;
    if (btn.dataset.wishAct === 'remove') {
      list = list.filter(function (i) { return i.id !== item.id; });
      save(); render();
      document.dispatchEvent(new CustomEvent('aura:wishlist'));
    } else {
      window.AuraCart.add(item);
      btn.classList.add('added'); btn.textContent = 'Added \u2713';
      setTimeout(function () { btn.classList.remove('added'); btn.textContent = 'Add to Bag'; }, 1400);
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') body.classList.remove('wish-open'); });

  render();
  window.AuraWish = { has: function (id) { return !!find(id); }, toggle: toggle };
})();
