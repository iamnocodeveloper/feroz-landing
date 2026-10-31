/**
 * Loads the privacy policy / terms from the backend so a super admin can edit
 * them from the panel and the change shows here.
 *
 * Plain fetch, no dependencies — same spirit as the rest of the landing. The
 * static HTML in each page stays as the fallback: if the fetch fails, the page
 * still shows the last version that shipped in the source.
 */
(function () {
  var INSFORGE_URL = 'https://vmuvsp6s.us-east.insforge.app';
  // Public anon key (safe in a browser, same one the app uses).
  var ANON_KEY = 'anon_822985ad06519efb801e57801b9f73bbd9c03a9d4ef4ac94466ce5e67f752262';

  function escapeHtml(text) {
    return text.replace(/[&<>"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char];
    });
  }

  function inline(text) {
    return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  // Minimal markdown: ## / ### headings, - lists and **bold**.
  function render(markdown) {
    var lines = markdown.split(/\r?\n/);
    var html = '';
    var inList = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      var match;

      if (line === '') {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        continue;
      }

      if ((match = line.match(/^#{2,3}\s+(.*)$/))) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += match[0].startsWith('###') ? '<h3>' + inline(match[1]) + '</h3>' : '<h2>' + inline(match[1]) + '</h2>';
        continue;
      }

      if ((match = line.match(/^-\s+(.*)$/))) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += '<li>' + inline(match[1]) + '</li>';
        continue;
      }

      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += '<p>' + inline(line) + '</p>';
    }

    if (inList) html += '</ul>';
    return html;
  }

  function formatDate(value) {
    var date = new Date(value);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  /**
   * The slug of the document this page shows.
   *
   * `data-legal="query"` means "take it from the URL", which is how
   * `legal.html?doc=cookies` renders a document the super admin created from the
   * panel — no new HTML file needed for each one.
   */
  function slugFor(main) {
    var declared = main.getAttribute('data-legal');
    if (declared && declared !== 'query') return declared;

    var match = window.location.search.match(/[?&]doc=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  async function load() {
    var main = document.querySelector('[data-legal]');
    if (!main) return;
    var slug = slugFor(main);
    if (!slug) return;

    try {
      var response = await fetch(
        INSFORGE_URL +
          '/api/database/records/legal_documents?slug=eq.' +
          encodeURIComponent(slug) +
          '&select=title,body,updated_at&limit=1',
        { headers: { apikey: ANON_KEY, Authorization: 'Bearer ' + ANON_KEY } },
      );
      if (!response.ok) return;

      var rows = await response.json();
      var doc = Array.isArray(rows) ? rows[0] : null;
      if (!doc || !doc.body) return;

      document.title = (doc.title || 'FEROZ') + ' — FEROZ';
      main.innerHTML =
        '<h1>' +
        escapeHtml(doc.title || '') +
        '</h1>' +
        '<p class="meta">Última actualización: ' +
        escapeHtml(formatDate(doc.updated_at)) +
        '.</p>' +
        render(doc.body);
    } catch (error) {
      // Keep the static fallback.
    }
  }

  load();
})();
