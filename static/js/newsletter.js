/* Newsletter sign-up:Connect to your email service here*/
(function () {
  'use strict';
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.reset();
      window.AuraCart.toast('Thanks for subscribing!');
    });
  });
})();
