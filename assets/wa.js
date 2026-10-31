/**
 * WhatsApp links for the legal pages.
 *
 * These pages only announce intent, so one number is enough. Kept in a file
 * instead of inline so the Content-Security-Policy can forbid inline scripts
 * (`script-src 'self'`) instead of allowing `'unsafe-inline'`.
 */
(function () {
  var PHONE = '593983859723';
  var links = document.querySelectorAll('[data-wa]');
  for (var i = 0; i < links.length; i++) {
    links[i].href = 'https://wa.me/' + PHONE;
    links[i].target = '_blank';
    links[i].rel = 'noopener';
  }
})();
