# Site – Rayssa Rebouças Advocacia

Site das advogadas Rayssa Rebouças (Família) e Graziella Matos (Previdenciário). Site estático gerado por `build.mjs` (Node 18+, sem dependências).

- Conteúdo: `src/pages.mjs` · Dados (OAB, WhatsApp, domínio, GTM): `src/config.mjs` · Estilo/JS: `src/assets/`
- `node build.mjs` gera os `.html`, `sitemap.xml` e `robots.txt` na raiz (servidos pelo GitHub Pages).
- `node build.mjs serve` gera e abre em http://localhost:8080
- `node cards.mjs` regera os cartões digitais (PDF com links clicáveis e .vcf) em `src/assets/`; rode antes do build sempre que mudar nome, OAB, foto, WhatsApp ou LinkedIn. Usa o Edge/Chrome instalado (variável `CHROME` para outro caminho).
- Não edite os `.html` gerados; edite `src/` e rode o build.
- Todo texto público passa pela revisão da advogada antes de publicar (Provimento OAB 205/2021).

## Rastreamento
Cliques em qualquer botão do WhatsApp disparam `whatsapp_click` no `dataLayer`
(parâmetros `area` (familia/previdencia/geral), `wa_location`, `page_type`, `service`, `lead_ref`). No GTM: gatilho de evento
personalizado `whatsapp_click` → evento GA4 + conversão do Google Ads.
Visitas com `gclid`/`gbraid`/`wbraid` guardam o clique por 90 dias e acrescentam
"(Cód. XXXXXX)" à mensagem do WhatsApp; anote o código no CRM para a conversão offline.
Se `leadEndpoint` estiver preenchido, o par código ↔ gclid é enviado para lá a cada clique.
