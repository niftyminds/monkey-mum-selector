/**
 * Pošle tracking event do parent okna (monkeymum.com) přes postMessage.
 * Bezpečné volat odkudkoliv - pokud aplikace neběží v iframe, nic se nestane.
 *
 * V dev módu nebo s ?debug=1 v URL vypisuje eventy do konzole.
 */
export function trackEvent(eventName: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  // Debug logging - dev mode nebo ?debug=1 v URL
  const isDebug =
    process.env.NODE_ENV !== 'production' ||
    (typeof window !== 'undefined' && window.location.search.includes('debug=1'));

  if (isDebug) {
    console.log('🎯 Track:', eventName, data ?? {});
  }

  // Spustit jen když běží v iframe
  if (window.parent === window) return;

  // Určení target origin
  // V dev módu nebo na localhostu povolíme všechny origins ('*') pro snadné testování
  // V produkci používáme konkrétní origin monkeymum.com pro bezpečnost
  let targetOrigin = 'https://www.monkeymum.com';

  if (process.env.NODE_ENV !== 'production' || window.location.hostname === 'localhost') {
    targetOrigin = '*';
  }

  window.parent.postMessage(
    {
      event: eventName,
      source: 'monkey-configurator',
      data: data ?? {},
    },
    targetOrigin
  );
}
