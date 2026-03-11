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

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'mm-resize') return;
    // Verify message comes from our iframe
    if (iframe.contentWindow !== e.source) return;
    iframe.style.height = e.data.height + 'px';
  });
})();
