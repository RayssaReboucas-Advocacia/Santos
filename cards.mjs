// Gera os cartões de visita virtuais de cada advogada em src/assets/:
//   cartao-<id>.pdf  PDF com links clicáveis (WhatsApp, LinkedIn, site)
//   <id>.vcf         contato para salvar na agenda do celular (com foto)
// Uso: node cards.mjs && node build.mjs
// O PDF é impresso pelo Edge/Chrome em modo headless, que mantém os links do HTML.
// Defina CHROME com o caminho do navegador se ele não estiver no local padrão.

import { writeFileSync, readFileSync, existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { site, lawyers } from './src/config.mjs';
import { areas } from './src/pages.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const assets = join(root, 'src/assets');

const browsers = [
  process.env.CHROME,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);
const browser = browsers.find((b) => existsSync(b));
if (!browser) throw new Error('Edge/Chrome não encontrado; defina CHROME=/caminho/do/navegador');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const waHref = (text) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

const icons = {
  wa: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-1-.3-1.7-.6-2.9-1.3-4.8-4.3-4.9-4.5-.1-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.8 1.9.8 2 .1.1.1.3 0 .5-.1.2-.2.3-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.4.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.3.1.5.2.5.3.1.2.1.7-.1 1.4Z"/></svg>',
  in: '<svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>',
  web: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-2.9a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8ZM12 4c.8 1.2 1.5 2.5 1.9 4h-3.8c.4-1.5 1.1-2.8 1.9-4ZM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4H4.3Zm.8 2h2.9c.3 1.3.8 2.5 1.4 3.6A8 8 0 0 1 5.1 16ZM8 8H5.1a8 8 0 0 1 4.3-3.6C8.8 5.5 8.3 6.7 8 8Zm4 12c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 2.8-1.9 4Zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4Zm.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.9a8 8 0 0 1-4.3 3.6Zm1.7-5.6a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4h-3.4Z"/></svg>',
};

function cardHtml(id, area) {
  const l = lawyers[id];
  const wa = waHref(`Olá, ${l.short.split(' ').slice(0, 2).join(' ')}. Vi seu cartão e gostaria de orientação em ${area.name}.`);
  const siteUrl = site.url + area.path;
  const photo = l.photo ? pathToFileURL(join(assets, l.photo)).href : '';
  const button = (href, icon, label, detail, cls) =>
    `<a class="btn ${cls}" href="${esc(href)}">${icons[icon]}<span><strong>${label}</strong><small>${esc(detail)}</small></span></a>`;

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Cartão – ${esc(l.short)} · ${esc(area.name)}</title>
<style>
  @page { size: 85mm 150mm; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 85mm; height: 150mm; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #1a2a3a; color: #fff;
         font-family: Georgia, 'Times New Roman', serif; display: flex; flex-direction: column; align-items: center;
         padding: 9mm 7mm 6mm; position: relative; overflow: hidden; }
  body::before { content: ""; position: absolute; inset: 3mm; border: .3mm solid rgba(201,168,106,.45); }
  .photo { width: 30mm; height: 30mm; border-radius: 50%; object-fit: cover; border: .9mm solid #fff; box-shadow: 0 0 0 .5mm #c9a86a; }
  .initials { width: 30mm; height: 30mm; border-radius: 50%; display: flex; align-items: center; justify-content: center;
              border: .5mm solid #c9a86a; color: #c9a86a; font-size: 12mm; }
  h1 { font-size: 6.2mm; font-weight: normal; margin-top: 5mm; letter-spacing: .2mm; text-align: center; }
  .role { color: #c9a86a; font-size: 3mm; letter-spacing: .7mm; text-transform: uppercase; margin-top: 1.6mm; text-align: center; line-height: 1.5; }
  .oab { color: #c5ccd3; font-family: Arial, sans-serif; font-size: 2.9mm; margin-top: 1.4mm; }
  .rule { width: 18mm; height: .3mm; background: #c9a86a; margin: 5mm 0 5mm; }
  .btn { display: flex; align-items: center; gap: 3mm; width: 100%; text-decoration: none; color: #fff;
         border-radius: 3mm; padding: 2.6mm 3.6mm; margin-bottom: 2.6mm; font-family: Arial, sans-serif; }
  .btn svg { width: 6mm; height: 6mm; fill: currentColor; flex: none; }
  .btn span { display: flex; flex-direction: column; }
  .btn strong { font-size: 3.4mm; }
  .btn small { font-size: 2.5mm; opacity: .85; margin-top: .4mm; }
  .wa { background: #1fae55; }
  .in { background: #0a66c2; }
  .web { background: transparent; border: .3mm solid #c9a86a; color: #e9dcc2; }
  .foot { margin-top: auto; text-align: center; font-family: Arial, sans-serif; font-size: 2.3mm; color: #9aa6b2; line-height: 1.5; }
  .foot b { color: #c9a86a; font-weight: normal; letter-spacing: .5mm; }
</style></head><body>
  ${photo ? `<img class="photo" src="${photo}" alt="">` : `<div class="initials">${esc(l.short.replace(/^Dra\.\s*/, '')[0])}</div>`}
  <h1>${esc(l.short)}</h1>
  <p class="role">Advogada<br>${esc(area.name)}</p>
  <p class="oab">${esc(l.oab)}</p>
  <div class="rule"></div>
  ${button(wa, 'wa', 'WhatsApp', site.whatsappDisplay, 'wa')}
  ${l.linkedin ? button(l.linkedin, 'in', 'LinkedIn', 'Ver perfil profissional', 'in') : ''}
  ${button(siteUrl, 'web', 'Site', 'Áreas de atuação e dúvidas frequentes', 'web')}
  <p class="foot"><b>${esc(site.cities[0].toUpperCase())} E BAIXADA SANTISTA</b><br>Atendimento online ou presencial com hora marcada</p>
</body></html>`;
}

// vCard 3.0, com linhas dobradas em 75 caracteres como pede a especificação.
function vcard(id, area) {
  const l = lawyers[id];
  const fold = (line) => line.match(/.{1,74}/g).join('\r\n ');
  const v = (s) => String(s).replace(/([,;\\])/g, '\\$1');
  const parts = l.fullName.split(' ');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${v(parts.slice(1).join(' '))};${v(parts[0])};;Dra.;`,
    `FN:${v(l.short)}`,
    `TITLE:${v(`Advogada – ${area.name}`)}`,
    `TEL;TYPE=CELL,VOICE:+${site.whatsapp}`,
    ...(site.email ? [`EMAIL;TYPE=WORK:${site.email}`] : []),
    `URL:${site.url}${area.path}`,
    ...(l.linkedin ? [`X-SOCIALPROFILE;TYPE=linkedin:${l.linkedin}`] : []),
    `NOTE:${v(`${l.oab}. Atendimento em ${site.cities.join(', ')}.`)}`,
    ...(l.photo ? [`PHOTO;ENCODING=b;TYPE=JPEG:${readFileSync(join(assets, l.photo)).toString('base64')}`] : []),
    'END:VCARD',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

// No Windows o msedge.exe pode retornar antes de o processo filho terminar o PDF.
function waitForFile(file, timeoutMs = 30000) {
  const end = Date.now() + timeoutMs;
  let last = -1;
  while (Date.now() < end) {
    const size = existsSync(file) ? statSync(file).size : -1;
    if (size > 0 && size === last) return;
    last = size;
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
  }
  throw new Error(`PDF não foi gerado: ${file}`);
}

const tmp = mkdtempSync(join(tmpdir(), 'cartoes-'));
try {
  for (const area of Object.values(areas)) {
    const id = area.lawyer;
    const html = join(tmp, `${id}.html`);
    const pdf = join(assets, `cartao-${id}.pdf`);
    writeFileSync(html, cardHtml(id, area));
    rmSync(pdf, { force: true });
    execFileSync(browser, [
      '--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--user-data-dir=${join(tmp, 'profile')}`,
      `--print-to-pdf=${pdf}`, pathToFileURL(html).href,
    ], { stdio: 'ignore' });
    waitForFile(pdf);
    writeFileSync(join(assets, `${id}.vcf`), vcard(id, area));
    console.log(`cartao-${id}.pdf e ${id}.vcf gerados`);
  }
} finally {
  // O perfil temporário do navegador pode ficar travado por alguns instantes; não é fatal.
  try { rmSync(tmp, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 }); } catch {}
}
