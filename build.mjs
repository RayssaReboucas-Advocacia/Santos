// Gera o site estático na raiz do repositório (pronto para GitHub Pages).
//   node build.mjs          gera os arquivos
//   node build.mjs serve    gera e serve em http://localhost:8080
// Edite o conteúdo em src/ e rode o build; não edite os .html gerados.

import { mkdirSync, writeFileSync, copyFileSync, readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, lawyers, placeholders } from './src/config.mjs';
import { pages, notFound, areas } from './src/pages.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const updated = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

const nav = [
  ['/', 'Início'],
  ['/direito-de-familia/', 'Família'],
  ['/direito-previdenciario/', 'Previdenciário'],
  ['/praia-grande/', 'Praia Grande'],
  ['/sobre/', 'Sobre'],
  ['/contato/', 'Contato'],
];

const waIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-1-.3-1.7-.6-2.9-1.3-4.8-4.3-4.9-4.5-.1-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.8 1.9.8 2 .1.1.1.3 0 .5-.1.2-.2.3-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.4.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.3.1.5.2.5.3.1.2.1.7-.1 1.4Z"/></svg>';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (s) => s.replace(/<[^>]+>/g, '');
const abs = (path) => site.url + path;
const basePath = new URL(site.url).pathname.replace(/\/$/, ''); // ex.: "/Santos" no GitHub Pages de projeto
const waHref = (text) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

// Variáveis {{chave}} usadas no conteúdo. Valores terminados em "Link" ou "Html" já são HTML.
const vars = { privacyContact: site.email || `WhatsApp ${site.whatsappDisplay}`, updated };
const initials = (name) => name.replace(/^Dra?\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join('');
for (const [id, l] of Object.entries(lawyers)) {
  for (const k of ['short', 'fullName', 'oab', 'area']) vars[`${id}.${k}`] = l[k];
  vars[`${id}.linkedinLink`] = l.linkedin ? ` · <a href="${l.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : '';
  vars[`${id}.photoHtml`] = l.photo
    ? `<img class="profile-photo" src="/assets/${l.photo}" alt="${esc(l.short)}" width="88" height="88" loading="lazy">`
    : `<span class="profile-photo profile-initials" aria-hidden="true">${initials(l.short)}</span>`;
}
const fill = (html) => html.replace(/\{\{([\w.]+)\}\}/g, (_, k) => (/(Link|Html)$/.test(k) ? vars[k] : esc(vars[k] ?? '')));

const areaOf = (page) => (page.area ? areas[page.area] : null);
const serviceArea = (path) => Object.values(areas).find((a) => a.services.some((s) => s.path === path));

const waButton = (page, location, label) =>
  `<a class="btn-wa" href="${waHref(page.wa)}" data-wa="${esc(page.wa)}" data-wa-location="${location}" target="_blank" rel="noopener">${waIcon}<span>${label}</span></a>`;

// Cada advogada tem a própria prática (LegalService), sem sociedade entre elas.
const practiceId = (id) => abs(`/sobre/#${id}-pratica`);
const personId = (id) => abs(`/sobre/#${id}`);

function practiceNode(areaKey) {
  const a = areas[areaKey];
  const l = lawyers[a.lawyer];
  return {
    '@type': 'LegalService',
    '@id': practiceId(a.lawyer),
    name: `${l.short} · ${a.name}`,
    url: abs(a.path),
    telephone: '+' + site.whatsapp,
    ...(site.email && { email: site.email }),
    areaServed: site.cities.map((name) => ({ '@type': 'City', name })),
    knowsAbout: a.services.map((s) => s.name),
    sameAs: [l.linkedin, site.instagram].filter(Boolean),
    founder: { '@id': personId(a.lawyer) },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: a.name,
      itemListElement: a.services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: abs(s.path) } })),
    },
  };
}

function personNode(areaKey) {
  const a = areas[areaKey];
  const l = lawyers[a.lawyer];
  return {
    '@type': 'Person',
    '@id': personId(a.lawyer),
    name: l.fullName,
    jobTitle: 'Advogada',
    knowsAbout: a.name,
    url: abs(`/sobre/#${a.lawyer}`),
    worksFor: { '@id': practiceId(a.lawyer) },
    sameAs: [l.linkedin].filter(Boolean),
  };
}

function jsonLd(page) {
  const graph = [{ '@type': 'WebSite', '@id': abs('/#site'), name: site.brand, url: abs('/'), inLanguage: 'pt-BR' }];
  const keys = page.area ? [page.area] : Object.keys(areas);
  for (const k of keys) graph.push(practiceNode(k), personNode(k));

  if (page.service) {
    graph.push({
      '@type': 'Service',
      name: page.service,
      serviceType: page.service,
      url: abs(page.path),
      provider: { '@id': practiceId(areas[page.area].lawyer) },
      areaServed: site.cities.map((name) => ({ '@type': 'City', name })),
    });
  }
  if (page.path !== '/') {
    const crumbs = [['Início', '/']];
    if (page.service) crumbs.push([areaOf(page).name, areaOf(page).path]);
    crumbs.push([strip(page.h1), page.path]);
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

const gtmHead = site.gtmId
  ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.gtmId}');</script>`
  : '';
const gtmBody = site.gtmId
  ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${site.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`
  : '';

function render(page) {
  const area = areaOf(page);
  const lawyer = area && lawyers[area.lawyer];
  const title = page.title.includes('|') ? page.title : `${page.title} | ${site.brand}`;

  const byline = lawyer
    ? `<p class="byline">Atendimento: <strong>${esc(lawyer.short)}</strong> · ${esc(area.name)} · ${esc(lawyer.oab)}</p>`
    : '';

  const breadcrumb = page.service
    ? `<nav class="crumbs" aria-label="Você está em"><a href="/">Início</a> › <a href="${area.path}">${area.name}</a></nav>`
    : '';

  const faq = page.faq?.length
    ? `<section class="section section-alt"><div class="container narrow"><h2>Dúvidas frequentes</h2>
${page.faq.map(([q, a]) => `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`).join('\n')}
<p class="muted">As respostas são informativas e gerais. Cada caso tem particularidades que precisam ser avaliadas em consulta.</p></div></section>`
    : '';

  const cta = page.noCta
    ? ''
    : `<section class="cta"><div class="container narrow"><h2>Vamos conversar sobre o seu caso</h2>
<p>Conte brevemente a sua situação pelo WhatsApp para agendar uma consulta${lawyer ? ` com a ${esc(lawyer.short)}` : ''}, online ou presencial.</p>
${waButton(page, 'rodape', 'Falar pelo WhatsApp')}</div></section>`;

  const current = page.service ? area.path : page.path;
  const navHtml = nav
    .map(([href, label]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`)
    .join('');

  const footerLawyers = Object.values(areas)
    .map((a) => {
      const l = lawyers[a.lawyer];
      return `<p class="footer-name"><strong>${esc(l.fullName)}</strong> · ${esc(a.name)} · ${esc(l.oab)}</p>`;
    })
    .join('\n  ');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${abs(page.path)}">`}
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(site.brand)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${abs(page.path)}">
<meta name="theme-color" content="#1a2a3a">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/style.css">
<script type="application/ld+json">${jsonLd(page)}</script>
<script>window.SITE=${JSON.stringify({ whatsapp: site.whatsapp, leadEndpoint: site.leadEndpoint, area: page.area || 'geral', service: page.service || '', pageType: page.service ? 'servico' : page.path.replace(/\//g, '') || 'home' })};</script>
${gtmHead}
</head>
<body>
${gtmBody}
<header class="site-header">
  <div class="container header-row">
    <a class="logo" href="/">${site.logo.map(esc).join(' <span>·</span> ')} <small>Advogadas</small></a>
    ${waButton(page, 'cabecalho', 'WhatsApp')}
  </div>
  <nav class="container nav" aria-label="Principal">${navHtml}</nav>
</header>
<main>
<section class="hero"><div class="container narrow">
  ${breadcrumb}
  <h1>${page.h1}</h1>
  <p class="lead">${fill(page.lead)}</p>
  ${waButton(page, 'topo', lawyer ? `Falar com a ${lawyer.short} no WhatsApp` : 'Falar com uma advogada no WhatsApp')}
  ${byline}
</div></section>
${fill(page.body)}
${faq}
${cta}
</main>
<footer class="site-footer"><div class="container">
  ${footerLawyers}
  <p>Advogadas autônomas · Atendimento em ${site.cities.join(', ')} (SP)</p>
  <p>WhatsApp <a href="${waHref(page.wa)}" data-wa="${esc(page.wa)}" data-wa-location="rodape-texto" target="_blank" rel="noopener">${site.whatsappDisplay}</a>${site.email ? ` · <a href="mailto:${site.email}">${site.email}</a>` : ''}</p>
  <p class="social">${site.instagram ? `<a href="${site.instagram}" target="_blank" rel="noopener">Instagram</a> · ` : ''}<a href="/sobre/">Sobre as advogadas</a> · <a href="/contato/">Contato e cartão digital</a> · <a href="/politica-de-privacidade/">Política de privacidade</a></p>
  <p class="disclaimer">Conteúdo de caráter informativo, conforme o Código de Ética e Disciplina da OAB e o Provimento nº 205/2021. Não substitui a consulta com advogado.</p>
</div></footer>
<a class="wa-float" href="${waHref(page.wa)}" data-wa="${esc(page.wa)}" data-wa-location="flutuante" target="_blank" rel="noopener" aria-label="Falar pelo WhatsApp">${waIcon}</a>
<script src="/assets/site.js" defer></script>
</body>
</html>
`;
  // Caminhos relativos para funcionar tanto no domínio próprio quanto em usuario.github.io/repo/.
  // O 404 é servido em qualquer profundidade, então usa caminhos absolutos a partir da base do site.
  if (page.path === notFound.path) return html.replace(/(href|src)="\/(?!\/)/g, `$1="${basePath}/`);
  const depth = page.path.split('/').filter(Boolean).length;
  const prefix = depth ? '../'.repeat(depth) : './';
  return html.replace(/(href|src)="\/(?!\/)([^"]*)"/g, (_, attr, rest) => `${attr}="${prefix}${rest}"`);
}

function outFile(path) {
  return path.endsWith('.html') ? join(root, path) : join(root, path, 'index.html');
}

function build() {
  for (const page of pages) {
    if (page.service && serviceArea(page.path) !== areas[page.area]) throw new Error(`${page.path}: area não bate com a lista de serviços`);
  }
  for (const page of [...pages, notFound]) {
    const file = outFile(page.path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, render(page));
  }

  mkdirSync(join(root, 'assets'), { recursive: true });
  for (const f of readdirSync(join(root, 'src/assets'))) copyFileSync(join(root, 'src/assets', f), join(root, 'assets', f));

  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(
    join(root, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
      .map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${today}</lastmod></url>`)
      .join('\n')}\n</urlset>\n`,
  );
  writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);
  const host = new URL(site.url).host;
  // CNAME só para domínio próprio; no endereço github.io ele quebraria o site.
  if (!/seudominio|github\.io$/i.test(host)) writeFileSync(join(root, 'CNAME'), host + '\n');
  writeFileSync(join(root, '.nojekyll'), '');

  console.log(`Gerado: ${pages.length} páginas + 404, sitemap.xml, robots.txt`);
  const pending = placeholders.filter(([, isPending]) => isPending()).map(([k]) => k);
  if (pending.length) console.warn(`Pendente em src/config.mjs: ${pending.join(', ')}`);
}

build();

if (process.argv[2] === 'serve') {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.jpg': 'image/jpeg', '.pdf': 'application/pdf', '.vcf': 'text/vcard' };
  createServer((req, res) => {
    let p = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
    if (!existsSync(p)) {
      res.writeHead(404, { 'content-type': types['.html'] });
      return res.end(readFileSync(join(root, '404.html')));
    }
    res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' });
    res.end(readFileSync(p));
  }).listen(8080, () => console.log('http://localhost:8080'));
}
