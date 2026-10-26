// Rastreamento dos cliques no WhatsApp (Fase 2 do plano).
// - Guarda gclid/gbraid/wbraid e UTMs da visita por 90 dias.
// - Visitas vindas de anúncio levam um código curto na mensagem do WhatsApp,
//   que liga o contato no CRM ao clique (conversão offline, Fase 6).
// - Cada clique gera o evento "whatsapp_click" no dataLayer (GTM -> GA4 / Google Ads).
(function () {
  var KEY = 'rr_attr';
  var TTL = 90 * 24 * 60 * 60 * 1000;
  var cfg = window.SITE || {};
  window.dataLayer = window.dataLayer || [];

  function load() {
    try {
      var a = JSON.parse(localStorage.getItem(KEY) || 'null');
      return a && Date.now() - a.ts < TTL ? a : null;
    } catch (e) {
      return null;
    }
  }

  function save(a) {
    try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {}
  }

  function newRef() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var out = '';
    for (var i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  var params = new URLSearchParams(location.search);
  var fields = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term'];
  var fromUrl = {};
  fields.forEach(function (f) { if (params.get(f)) fromUrl[f] = params.get(f); });

  var attr = load();
  if (Object.keys(fromUrl).length) {
    // Nova visita com parâmetros substitui a anterior (último clique).
    attr = fromUrl;
    attr.ref = newRef();
    attr.landing = location.pathname;
    attr.ts = Date.now();
    save(attr);
  }
  var isAd = !!(attr && (attr.gclid || attr.gbraid || attr.wbraid));

  function message(base) {
    return isAd ? base + '\n\n(Cód. ' + attr.ref + ')' : base;
  }

  document.querySelectorAll('a[data-wa]').forEach(function (a) {
    a.href = 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(message(a.getAttribute('data-wa')));
    a.addEventListener('click', function () {
      var data = {
        event: 'whatsapp_click',
        wa_location: a.getAttribute('data-wa-location'),
        area: cfg.area,
        page_type: cfg.pageType,
        service: cfg.service,
        lead_ref: isAd ? attr.ref : undefined,
      };
      window.dataLayer.push(data);

      if (cfg.leadEndpoint && isAd) {
        var payload = JSON.stringify({
          ref: attr.ref,
          area: cfg.area,
          gclid: attr.gclid || '',
          gbraid: attr.gbraid || '',
          wbraid: attr.wbraid || '',
          utm_campaign: attr.utm_campaign || '',
          utm_term: attr.utm_term || '',
          landing: attr.landing,
          page: location.pathname,
          ts: new Date().toISOString(),
        });
        try {
          navigator.sendBeacon(cfg.leadEndpoint, new Blob([payload], { type: 'text/plain' }));
        } catch (e) {}
      }
    });
  });
})();
