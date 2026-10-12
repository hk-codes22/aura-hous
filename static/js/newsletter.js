/* Newsletter sign-up: sends the email to php/subscribe.php */
(function () {
  'use strict';
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      fetch('php/subscribe.php', { method: 'POST', body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (d) { if (d.ok) form.reset(); window.AuraCart.toast(d.message); })
        .catch(function () { window.AuraCart.toast('Server not reachable.'); });
    });
  });
})();
