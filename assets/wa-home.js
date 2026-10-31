/**
 * WhatsApp links for the home page.
 *
 * One number, two conversations: the greeting tells whoever answers whether this
 * is a client or a carrier before the first line. External file so the CSP can
 * be `script-src 'self'`.
 */
(function () {
  var PHONE = '593983859723';
  var MESSAGES = {
    cliente: 'Hola, quiero publicar un envío en FEROZ. Vengo de la página web, soy cliente.',
    transportista:
      'Hola, quiero ofertar envíos en FEROZ. Vengo de la página web, soy transportista.',
  };

  var links = document.querySelectorAll('[data-wa]');
  for (var i = 0; i < links.length; i++) {
    var message = MESSAGES[links[i].dataset.wa] || MESSAGES.cliente;
    links[i].href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(message);
    links[i].target = '_blank';
    links[i].rel = 'noopener';
  }
})();
