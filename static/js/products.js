/* Upgrades every .product card */
(function () {
  'use strict';
  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.2C1.3 8.6 3 5 6.5 5c2 0 3.5 1.2 4.5 2.7C12 6.2 13.5 5 15.5 5 19 5 20.7 8.6 19.5 11.8 19.5 11.8 12 21 12 21z"/></svg>';
  var isNewPage = document.body.classList.contains('page-new-arrivals');

  document.querySelectorAll('.product').forEach(function (card) {
    var img = card.querySelector('img');
    var nameEl = card.querySelector('.name');
    var priceEl = card.querySelector('.price');
    var details = card.querySelector('.product-details');
    if (!img || !nameEl || !priceEl || !details) return;

    var price = parseInt(priceEl.textContent.replace(/[^\d]/g, ''), 10);
    if (isNaN(price)) return;
    var name = nameEl.textContent.trim();
    var id = img.getAttribute('src');

    priceEl.textContent = window.AuraCart.money(price);
    card.dataset.price = price;
    card.dataset.name = name;

    /* image wrapper + badge + wishlist heart */
    var media = document.createElement('div');
    media.className = 'product-media';
    card.insertBefore(media, card.firstChild);
    media.appendChild(img);
    if (isNewPage) media.insertAdjacentHTML('beforeend', '<span class="badge">New</span>');

    var heart = document.createElement('button');
    heart.type = 'button';
    heart.className = 'wish-btn';
    heart.innerHTML = HEART;
    heart.setAttribute('aria-label', 'Save ' + name + ' to wishlist');
    heart.setAttribute('aria-pressed', window.AuraWish.has(id));
    heart.addEventListener('click', function () {
      heart.setAttribute('aria-pressed', window.AuraWish.toggle({ id: id, name: name, price: price, img: id }));
    });
    /* keep the heart in sync when an item is removed from the wishlist drawer */
    document.addEventListener('aura:wishlist', function () {
      heart.setAttribute('aria-pressed', window.AuraWish.has(id));
    });
    media.appendChild(heart);

    /* add to bag */
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'add-btn';
    btn.textContent = 'Add to Bag';
    details.appendChild(btn);
    btn.addEventListener('click', function () {
      window.AuraCart.add({ id: id, name: name, price: price, img: id });
      btn.classList.add('added'); btn.textContent = 'Added \u2713';
      setTimeout(function () { btn.classList.remove('added'); btn.textContent = 'Add to Bag'; }, 1400);
    });
  });
})();
