/* Shopping bag: stored in localStorage*/
(function () {
  'use strict';
  var KEY = 'aura-cart';
  var body = document.body;

  function money(n) { return 'Rs ' + Number(n).toLocaleString('en-IN'); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ } }

  var cart = load();

  /*build drawer + toast markup once*/
  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div class="cart-overlay" data-cart-close></div>' +
    '<aside class="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag">' +
      '<div class="cart-head"><h3>Your Bag</h3><button class="cart-close" data-cart-close aria-label="Close bag">&times;</button></div>' +
      '<div class="cart-items"></div>' +
      '<div class="cart-foot"><div class="cart-total"><span>Subtotal</span><span class="cart-subtotal">Rs 0</span></div>' +
      '<button class="btn btn-outline" data-cart-close>Continue Shopping</button></div>' +
    '</aside><div class="toast" role="status" aria-live="polite"></div>';
  while (wrap.firstChild) body.appendChild(wrap.firstChild);

  var itemsEl = document.querySelector('.cart-items');
  var subtotalEl = document.querySelector('.cart-subtotal');
  var countEl = document.querySelector('.cart-count');
  var toastEl = document.querySelector('.toast');
  var toastTimer;

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  function render() {
    var count = 0, total = 0;
    cart.forEach(function (i) { count += i.qty; total += i.qty * i.price; });
    if (countEl) { countEl.textContent = count; countEl.classList.toggle('has-items', count > 0); }
    subtotalEl.textContent = money(total);
    if (!cart.length) {
      itemsEl.innerHTML = '<div class="cart-empty">Your bag is empty.<br>Find something you love.</div>';
      return;
    }
    itemsEl.innerHTML = cart.map(function (i) {
      return '<div class="cart-item" data-id="' + esc(i.id) + '">' +
        '<img src="' + esc(i.img) + '" alt="' + esc(i.name) + '">' +
        '<div><h4>' + esc(i.name) + '</h4><div>' + money(i.price) + '</div>' +
        '<div class="qty"><button data-act="dec" aria-label="Decrease quantity">&minus;</button><span>' + i.qty +
        '</span><button data-act="inc" aria-label="Increase quantity">+</button></div></div>' +
        '<button class="remove" data-act="remove">Remove</button></div>';
    }).join('');
  }

  function add(item) {
    var existing = cart.filter(function (i) { return i.id === item.id; })[0];
    if (existing) existing.qty++; else cart.push({ id: item.id, name: item.name, price: item.price, img: item.img, qty: 1 });
    save(); render();
    if (countEl) { countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump'); }
    toast(item.name + ' added to your bag');
  }

  /*open / close / quantity controls*/
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-open]')) { body.classList.add('cart-open'); return; }
    if (e.target.closest('[data-cart-close]')) { body.classList.remove('cart-open'); return; }
    var act = e.target.closest('[data-act]');
    if (!act) return;
    var id = act.closest('.cart-item').dataset.id;
    var item = cart.filter(function (i) { return i.id === id; })[0];
    if (!item) return;
    if (act.dataset.act === 'inc') item.qty++;
    if (act.dataset.act === 'dec') item.qty--;
    if (act.dataset.act === 'remove') item.qty = 0;
    cart = cart.filter(function (i) { return i.qty > 0; });
    save(); render();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') body.classList.remove('cart-open'); });

  render();
  window.AuraCart = { add: add, toast: toast, money: money };
})();
