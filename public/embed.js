(function () {
  var container = document.getElementById('mm-calculator');
  if (!container) {
    console.warn('[MonkeyMum] Element #mm-calculator not found.');
    return;
  }

  var script = document.currentScript;
  var baseUrl = script && script.src
    ? script.src.replace(/\/embed\.js(\?.*)?$/, '')
    : 'https://monkey.niftyminds.agency';

  var iframe = document.createElement('iframe');
  iframe.src = baseUrl + '/embed';
  iframe.style.cssText = 'width:100%;border:none;overflow:hidden;display:block;transition:height 0.2s ease;';
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('title', 'Monkey Mum - Průvodce výběrem zábrany');
  iframe.height = '600';

  container.appendChild(iframe);

  // Listener pro resize zprávy z iframe
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'mm-resize') return;
    // Verify message comes from our iframe
    if (iframe.contentWindow !== e.source) return;
    iframe.style.height = e.data.height + 'px';
  });

  // Listener pro tracking eventy z konfiguratoru
  window.addEventListener('message', function (e) {
    // Bezpečnostní kontrola - akceptujeme pouze zprávy z naší iframe origin
    var allowedOrigins = [
      'https://monkey.niftyminds.agency',
      'http://localhost:3000' // pro lokální vývoj
    ];
    if (allowedOrigins.indexOf(e.origin) === -1) return;

    // Filtruj jen tracking zprávy z konfigurátoru
    if (!e.data || e.data.source !== 'monkey-configurator') return;
    if (!e.data.event) return;

    // Inicializace dataLayer (pokud ještě neexistuje)
    window.dataLayer = window.dataLayer || [];

    // Push do dataLayer
    window.dataLayer.push({
      event: e.data.event,
      configurator: e.data.data || {}
    });

    // Debug log v konzoli (volitelné - můžeš smazat v produkci)
    if (window.console && window.console.log) {
      console.log('[MonkeyMum Tracking]', e.data.event, e.data.data);
    }
  });
})();
