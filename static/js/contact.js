/* Contact form: sends the message to php/contact.php */
(function () {
  'use strict';
  var form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    fetch('php/contact.php', { method: 'POST', body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d.ok) form.reset(); window.AuraCart.toast(d.message); })
      .catch(function () { window.AuraCart.toast('Server not reachable.'); });
  });
})();
