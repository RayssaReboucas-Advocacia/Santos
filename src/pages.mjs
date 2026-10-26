// Conteúdo das páginas. Todo texto aqui é público e precisa da revisão da advogada
// responsável pela área (Código de Ética art. 44 e Provimento 205/2021): informativo,
// sem preço, sem promessa de resultado, sem "especialista", "o melhor" ou "garantido".
//
// Campos: path (URL), area ('familia' | 'previdencia'; vazio = geral), title, description,
// h1, lead, wa (mensagem pré-preenchida), service (gera JSON-LD Service), body (HTML),
// faq ([pergunta, resposta]). No body, {{rayssa.oab}}, {{graziella.fullName}} etc. vêm de config.

import { site, lawyers } from './config.mjs';

export const areas = {
  familia: {
    path: '/direito-de-familia/',
    name: 'Direito de Família',
    lawyer: 'rayssa',
    services: [
      { path: '/divorcio/', name: 'Divórcio', text: 'Consensual ou litigioso, em cartório ou na Justiça, com partilha de bens quando houver.' },
      { path: '/pensao-alimenticia/', name: 'Pensão alimentícia', text: 'Pedido, revisão, cobrança de atrasados e exoneração de alimentos.' },
      { path: '/guarda/', name: 'Guarda e convivência', text: 'Guarda compartilhada ou unilateral, regime de convivência e mudanças de guarda.' },
      { path: '/uniao-estavel/', name: 'União estável', text: 'Formalização, reconhecimento, dissolução e partilha de bens do casal.' },
      { path: '/inventario/', name: 'Inventário e partilha', text: 'Inventário em cartório ou judicial, partilha entre herdeiros e alvarás.' },
    ],
  },
  previdencia: {
    path: '/direito-previdenciario/',
    name: 'Direito Previdenciário',
    lawyer: 'graziella',
    services: [
      { path: '/aposentadoria/', name: 'Aposentadoria', text: 'Análise do direito, planejamento e pedido de aposentadoria no INSS.' },
      { path: '/beneficio-por-incapacidade/', name: 'Benefícios por incapacidade', text: 'Auxílio-doença, aposentadoria por invalidez e auxílio-acidente.' },
      { path: '/bpc-loas/', name: 'BPC/LOAS', text: 'Benefício assistencial para idosos e pessoas com deficiência de baixa renda.' },
      { path: '/pensao-por-morte/', name: 'Pensão por morte', text: 'Pedido do benefício pelos dependentes de segurado falecido.' },
      { path: '/revisao-e-recurso-inss/', name: 'Revisão e benefício negado', text: 'Revisão de valor, inclusão de períodos e recurso contra indeferimento.' },
    ],
  },
};

const cards = (list) => `
<div class="cards">
  ${list.map((s) => `<a class="card" href="${s.path}"><h3>${s.name}</h3><p>${s.text}</p><span class="card-more">Saiba mais →</span></a>`).join('\n  ')}
</div>`;

// Resumo de cada advogada na home; cada serviço leva direto à página específica.
const profile = (areaKey, id, summary) => `
  <article class="profile">
    <div class="profile-head">
      {{${id}.photoHtml}}
      <div>
        <p class="card-kicker">${areas[areaKey].name}</p>
        <h3><a href="/sobre/#${id}">{{${id}.short}}</a></h3>
        <p class="profile-oab">{{${id}.oab}}</p>
      </div>
    </div>
    <p>${summary}</p>
    <ul class="service-links">
      ${areas[areaKey].services.map((s) => `<li><a href="${s.path}">${s.name}</a></li>`).join('\n      ')}
    </ul>
    <a class="card-more" href="${areas[areaKey].path}">Ver ${areas[areaKey].name} →</a>
  </article>`;

const profiles = `
<div class="profiles">
  ${profile('familia', 'rayssa', 'Atua em Direito de Família, acompanhando divórcios, pensão alimentícia, guarda de filhos, união estável e inventários, com escuta atenta, sigilo e busca de soluções consensuais sempre que possível.')}
  ${profile('previdencia', 'graziella', 'Atua em Direito Previdenciário, analisando o histórico de contribuições de cada segurado e acompanhando pedidos de aposentadoria e benefícios no INSS e, quando necessário, na Justiça Federal.')}
</div>`;

const steps = `
<ol class="steps">
  <li><strong>Contato pelo WhatsApp.</strong> Você conta brevemente a situação, a cidade e o assunto.</li>
  <li><strong>Checagem inicial.</strong> Antes de marcar a consulta, verificamos se não há conflito de interesses.</li>
  <li><strong>Consulta.</strong> Online ou presencial, com hora marcada, com a advogada responsável pela área.</li>
  <li><strong>Proposta por escrito.</strong> Honorários e próximos passos combinados de forma clara antes de começar.</li>
</ol>`;

// Cartão de contato de cada advogada (página /contato/). PDF e .vcf são gerados por cards.mjs.
const contactCard = (areaKey, wa) => {
  const a = areas[areaKey];
  const id = a.lawyer;
  const l = lawyers[id];
  const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  return `
      <article class="contact-card">
        {{${id}.photoHtml}}
        <h2>{{${id}.short}}</h2>
        <p class="card-kicker">${a.name}</p>
        <p class="profile-oab">{{${id}.oab}}</p>
        <div class="contact-actions">
          <a class="cbtn cbtn-wa" href="https://wa.me/${site.whatsapp}?text=${encodeURIComponent(wa)}" data-wa="${wa}" data-wa-location="contato" target="_blank" rel="noopener">${icon('M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z')}WhatsApp</a>
          ${l.linkedin ? `<a class="cbtn cbtn-in" href="${l.linkedin}" target="_blank" rel="noopener" data-track="linkedin_click" data-lawyer="${id}">${icon('M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z')}LinkedIn</a>` : ''}
          <a class="cbtn cbtn-out" href="/assets/cartao-${id}.pdf" download data-track="card_download" data-lawyer="${id}">${icon('M12 3v11m0 0-4-4m4 4 4-4M5 20h14')}Baixar cartão (PDF)</a>
          <a class="cbtn cbtn-out" href="/assets/${id}.vcf" download data-track="vcard_download" data-lawyer="${id}">${icon('M16 11a4 4 0 1 0-8 0M4 20c0-3 3.6-5 8-5s8 2 8 5')}Salvar na agenda</a>
        </div>
      </article>`;
};

const waGeral = 'Olá. Gostaria de orientação jurídica.';
const waFamilia = (assunto) => `Olá, Dra. Rayssa. Gostaria de orientação sobre ${assunto}.`;
const waPrev = (assunto) => `Olá, Dra. Graziella. Gostaria de orientação sobre ${assunto}.`;

export const pages = [
  {
    path: '/',
    title: 'Advogadas em Praia Grande | Direito de Família e Previdenciário',
    description: 'Advogadas em Praia Grande e Baixada Santista: Direito de Família (divórcio, pensão, guarda, inventário) e Direito Previdenciário (aposentadoria, INSS, BPC/LOAS).',
    h1: 'Direito de Família e Previdenciário com <em>acolhimento</em> e técnica',
    lead: 'Duas advogadas, cada uma dedicada à sua área, atendendo Praia Grande e a Baixada Santista. Atendimento sigiloso, online ou presencial com hora marcada.',
    wa: waGeral,
    body: `
<section class="section">
  <div class="container">
    <h2>As advogadas</h2>
    <p class="section-intro">Escolha o assunto para ver como cada uma pode ajudar.</p>
    ${profiles}
  </div>
</section>
<section class="section section-alt">
  <div class="container narrow">
    <h2>Como funciona o atendimento</h2>
    ${steps}
  </div>
</section>
<section class="section">
  <div class="container narrow">
    <h2>Onde atendemos</h2>
    <p>Clientes de <a href="/praia-grande/">Praia Grande</a>, São Vicente, Santos, Guarujá e Cubatão. Consultas online para quem prefere resolver sem sair de casa e presenciais com hora marcada.</p>
  </div>
</section>`,
  },

  // ---------- Direito de Família (Dra. Rayssa) ----------

  {
    path: '/direito-de-familia/',
    area: 'familia',
    title: 'Direito de Família em Praia Grande | Dra. Rayssa Rebouças',
    description: 'Advogada de família em Praia Grande e Baixada Santista: divórcio, pensão alimentícia, guarda, união estável e inventário.',
    h1: 'Direito de <em>Família</em>',
    lead: 'Divórcio, pensão, guarda, união estável e inventário, com escuta atenta e defesa técnica. Atendimento com a {{rayssa.short}}.',
    wa: 'Olá, Dra. Rayssa. Gostaria de orientação em Direito de Família.',
    body: `
<section class="section">
  <div class="container">
    <h2>Em que posso ajudar</h2>
    ${cards(areas.familia.services)}
  </div>
</section>
<section class="section section-alt">
  <div class="container narrow">
    <h2>Quando procurar orientação</h2>
    <p>Questões de família costumam chegar em momentos de mudança: uma separação, a necessidade de rever a pensão, uma dúvida sobre a guarda dos filhos ou a partilha de bens depois do falecimento de alguém próximo. Ter orientação jurídica cedo ajuda a evitar decisões precipitadas e a escolher o caminho mais adequado para cada família, inclusive por acordo, quando possível.</p>
  </div>
</section>`,
  },

  {
    path: '/divorcio/',
    area: 'familia',
    service: 'Divórcio',
    title: 'Advogada para Divórcio em Praia Grande | Dra. Rayssa Rebouças',
    description: 'Divórcio consensual ou litigioso, em cartório ou judicial, em Praia Grande e Baixada Santista. Orientação sobre partilha, guarda e pensão.',
    h1: 'Divórcio',
    lead: 'Orientação e condução do divórcio de forma respeitosa, consensual ou litigioso, em cartório ou na Justiça, cuidando também da partilha, da guarda e da pensão quando necessário.',
    wa: waFamilia('divórcio'),
    body: `
<section class="section">
  <div class="container narrow">
    <h2>Os caminhos possíveis</h2>
    <h3>Divórcio consensual</h3>
    <p>Quando o casal concorda com o divórcio e com as condições (partilha de bens, pensão, guarda), o processo tende a ser mais rápido. Em muitos casos pode ser feito em cartório, por escritura pública, sempre com a participação de advogado.</p>
    <h3>Divórcio litigioso</h3>
    <p>Quando não há acordo sobre o divórcio ou sobre alguma das condições, o pedido é feito na Justiça. Mesmo assim, é possível buscar acordos parciais ao longo do processo.</p>
    <h3>Questões que costumam vir junto</h3>
    <ul class="check">
      <li>Partilha de bens, conforme o regime de bens do casamento</li>
      <li>Guarda e convivência com os filhos</li>
      <li>Pensão alimentícia para os filhos e, em situações específicas, para o ex-cônjuge</li>
      <li>Retorno ao nome de solteiro(a)</li>
    </ul>
  </div>
</section>`,
    faq: [
      ['É preciso esperar algum prazo para pedir o divórcio?', 'Não. Desde a Emenda Constitucional 66/2010, o divórcio pode ser pedido a qualquer tempo, sem prazo mínimo de casamento ou de separação.'],
      ['Quando o divórcio pode ser feito em cartório?', 'Em regra, quando há acordo entre o casal e não há filhos menores ou incapazes, ou quando as questões relativas a eles já foram resolvidas na Justiça. A presença de advogado é obrigatória também no cartório. Cada caso precisa ser avaliado.'],
      ['Meu ex-cônjuge não quer assinar o divórcio. E agora?', 'O divórcio não depende da concordância do outro. Ele pode ser pedido na Justiça, e as demais questões (bens, filhos, pensão) são discutidas no processo.'],
      ['A partilha de bens precisa ser feita junto com o divórcio?', 'Não necessariamente. É possível se divorciar e fazer a partilha depois, embora resolver tudo de uma vez costume evitar pendências futuras.'],
    ],
  },

  {
    path: '/pensao-alimenticia/',
    area: 'familia',
    service: 'Pensão alimentícia',
    title: 'Advogada de Pensão Alimentícia em Praia Grande | Dra. Rayssa Rebouças',
    description: 'Pedido, revisão, cobrança e exoneração de pensão alimentícia em Praia Grande e Baixada Santista. Orientação sobre seus direitos e deveres.',
    h1: 'Pensão alimentícia',
    lead: 'Pedido, revisão, cobrança de atrasados e exoneração de alimentos, com atenção às necessidades de quem recebe e às possibilidades de quem paga.',
    wa: waFamilia('pensão alimentícia'),
    body: `
<section class="section">
  <div class="container narrow">
    <h2>Em que situações posso ajudar</h2>
    <h3>Pedido de pensão</h3>
    <p>Para filhos, gestantes (alimentos gravídicos) e, em situações específicas, ex-cônjuge ou ex-companheiro(a). O valor considera a necessidade de quem recebe e a possibilidade de quem paga.</p>
    <h3>Revisão</h3>
    <p>Quando a situação de uma das partes muda de forma relevante, como perda de emprego, aumento de renda ou novas despesas da criança, é possível pedir a revisão do valor, para mais ou para menos.</p>
    <h3>Cobrança de pensão atrasada</h3>
    <p>Quando a pensão fixada não é paga, a lei prevê meios de cobrança, como penhora de bens e salário e, para as parcelas mais recentes, até a prisão civil do devedor.</p>
    <h3>Exoneração</h3>
    <p>O fim da obrigação não é automático, nem mesmo com a maioridade do filho: em regra, precisa ser pedido e decidido.</p>
    <p class="muted">Procurando pensão paga pelo INSS aos dependentes de quem faleceu? Veja <a href="/pensao-por-morte/">pensão por morte</a>.</p>
  </div>
</section>`,
    faq: [
      ['Existe um valor fixo de pensão, como 30% do salário?', 'Não há percentual fixo na lei. O valor é definido caso a caso, considerando a necessidade de quem recebe e a possibilidade de quem paga.'],
      ['A pensão acaba quando o filho faz 18 anos?', 'Não automaticamente. A exoneração precisa ser pedida, e a obrigação pode continuar, por exemplo, enquanto o filho estiver estudando, conforme o caso.'],
      ['O que acontece se a pensão não for paga?', 'A pensão em atraso pode ser cobrada na Justiça. Dependendo do período da dívida, a cobrança pode levar à penhora de bens ou à prisão civil do devedor.'],
      ['Perdi o emprego. Posso parar de pagar a pensão?', 'Não. O valor continua devido até que seja revisado na Justiça ou por acordo homologado. O caminho é pedir a revisão o quanto antes.'],
    ],
  },

  {
    path: '/guarda/',
    area: 'familia',
    service: 'Guarda e convivência',
    title: 'Advogada de Guarda de Filhos em Praia Grande | Dra. Rayssa Rebouças',
    description: 'Guarda compartilhada ou unilateral, regime de convivência e alteração de guarda em Praia Grande e Baixada Santista, sempre pelo melhor interesse da criança.',
    h1: 'Guarda e convivência',
    lead: 'Defesa do melhor interesse das crianças, com acordos claros sobre guarda, convivência e rotina, e atuação na Justiça quando o acordo não é possível.',
    wa: waFamilia('guarda de filhos'),
    body: `
<section class="section">
  <div class="container narrow">
    <h2>Entenda as possibilidades</h2>
    <h3>Guarda compartilhada</h3>
    <p>É a regra na lei brasileira: os dois responsáveis participam das decisões importantes sobre a vida da criança, como escola, saúde e mudanças de cidade. Guarda compartilhada não significa, necessariamente, metade do tempo em cada casa.</p>
    <h3>Guarda unilateral</h3>
    <p>Aplicada quando a guarda compartilhada não atende ao melhor interesse da criança, por exemplo, quando um dos responsáveis declara que não deseja a guarda ou em situações de risco.</p>
    <h3>Regime de convivência</h3>
    <p>Define como a criança convive com cada responsável: dias da semana, fins de semana, férias, feriados e datas comemorativas. Quanto mais claro o acordo, menos conflitos no dia a dia.</p>
    <h3>Alteração de guarda ou de convivência</h3>
    <p>Mudanças na rotina da família, de cidade ou nas condições de um dos responsáveis podem justificar a revisão do que foi combinado.</p>
  </div>
</section>`,
    faq: [
      ['Guarda compartilhada significa que a criança mora metade do tempo com cada um?', 'Não necessariamente. Na guarda compartilhada as decisões são tomadas em conjunto; a criança pode ter uma residência principal e um regime de convivência com o outro responsável.'],
      ['Quem tem a guarda compartilhada paga pensão?', 'Pode pagar, sim. A guarda e a pensão são questões diferentes: a pensão depende das necessidades da criança e das possibilidades de cada responsável.'],
      ['Posso mudar de cidade com meu filho?', 'Mudanças de cidade que afetam a convivência devem ser combinadas com o outro responsável ou, sem acordo, levadas à Justiça. Vale buscar orientação antes da mudança.'],
    ],
  },

  {
    path: '/uniao-estavel/',
    area: 'familia',
    service: 'União estável',
    title: 'Advogada de União Estável em Praia Grande | Dra. Rayssa Rebouças',
    description: 'Formalização, reconhecimento e dissolução de união estável em Praia Grande e Baixada Santista, com orientação sobre regime de bens e partilha.',
    h1: 'União estável',
    lead: 'Formalização, reconhecimento e dissolução de união estável, com orientação sobre regime de bens, partilha e direitos de cada um.',
    wa: waFamilia('união estável'),
    body: `
<section class="section">
  <div class="container narrow">
    <h2>Em que situações posso ajudar</h2>
    <h3>Formalização</h3>
    <p>A união estável pode ser registrada em cartório, o que facilita a comprovação perante bancos, planos de saúde, INSS e outros órgãos. Na formalização, o casal também pode escolher o regime de bens.</p>
    <h3>Reconhecimento</h3>
    <p>Quando a união não foi formalizada e é preciso comprová-la, por exemplo, para fins de partilha ou herança, o reconhecimento pode ser pedido na Justiça. Para <a href="/pensao-por-morte/">pensão por morte no INSS</a>, a comprovação da união também é feita no próprio pedido do benefício.</p>
    <h3>Dissolução e partilha</h3>
    <p>No fim da união, é preciso tratar da partilha de bens e, se houver filhos, de guarda, convivência e pensão. Havendo acordo, em muitos casos a dissolução pode ser feita em cartório.</p>
  </div>
</section>`,
    faq: [
      ['Quanto tempo de convivência é preciso para ter união estável?', 'A lei não fixa um prazo mínimo. O que caracteriza a união estável é a convivência pública, contínua e duradoura, com o objetivo de constituir família.'],
      ['Qual é o regime de bens na união estável?', 'Se o casal não escolher outro por escrito, aplica-se, em regra, a comunhão parcial de bens: o que foi adquirido durante a união é, em princípio, dividido.'],
      ['Morar em casas separadas impede a união estável?', 'Não necessariamente. Morar junto não é requisito obrigatório; os demais elementos da relação são avaliados em conjunto.'],
    ],
  },

  {
    path: '/inventario/',
    area: 'familia',
    service: 'Inventário e partilha',
    title: 'Advogada de Inventário em Praia Grande | Dra. Rayssa Rebouças',
    description: 'Inventário em cartório ou judicial e partilha de bens em Praia Grande e Baixada Santista, com organização e transparência entre os herdeiros.',
    h1: 'Inventário e partilha',
    lead: 'Condução do inventário de forma organizada, em cartório ou na Justiça, buscando reduzir conflitos entre os herdeiros e regularizar o patrimônio da família.',
    wa: waFamilia('inventário'),
    body: `
<section class="section">
  <div class="container narrow">
    <h2>Como funciona</h2>
    <h3>Inventário em cartório (extrajudicial)</h3>
    <p>Em regra, é possível quando todos os herdeiros são maiores e capazes e estão de acordo com a divisão dos bens. Costuma ser o caminho mais rápido, sempre com a participação de advogado.</p>
    <h3>Inventário judicial</h3>
    <p>Necessário quando não há acordo entre os herdeiros ou em outras situações previstas em lei. O processo segue na Justiça até a partilha.</p>
    <h3>Outras situações</h3>
    <ul class="check">
      <li>Alvará para levantamento de valores deixados em banco, FGTS ou PIS</li>
      <li>Sobrepartilha de bens descobertos depois do inventário</li>
      <li>Orientação sobre o ITCMD, o imposto sobre a herança</li>
    </ul>
  </div>
</section>`,
    faq: [
      ['Existe prazo para abrir o inventário?', 'Sim. A lei prevê a abertura em até dois meses após o falecimento. No Estado de São Paulo, o atraso pode gerar multa sobre o ITCMD.'],
      ['É possível fazer o inventário se houver herdeiro menor de idade?', 'Em regra, o inventário com herdeiro menor ou incapaz é feito na Justiça, embora existam hipóteses em que o cartório é admitido. Cada caso precisa ser avaliado.'],
      ['Os herdeiros não se entendem. O que fazer?', 'Sem acordo, o inventário segue na Justiça, e o juiz decide as questões em disputa. Mesmo assim, é possível buscar acordos ao longo do processo.'],
    ],
  },

  // ---------- Direito Previdenciário (Dra. Graziella) ----------

  {
    path: '/direito-previdenciario/',
    area: 'previdencia',
    title: 'Advogada Previdenciária em Praia Grande | INSS e Aposentadoria',
    description: 'Advogada previdenciária em Praia Grande e Baixada Santista: aposentadoria, auxílio-doença, BPC/LOAS, pensão por morte, revisão e benefício negado pelo INSS.',
    h1: 'Direito <em>Previdenciário</em>',
    lead: 'Aposentadoria, benefícios por incapacidade, BPC/LOAS, pensão por morte e revisões, no INSS ou na Justiça. Atendimento com a {{graziella.short}}.',
    wa: 'Olá, Dra. Graziella. Gostaria de orientação sobre INSS.',
    body: `
<section class="section">
  <div class="container">
    <h2>Em que posso ajudar</h2>
    ${cards(areas.previdencia.services)}
  </div>
</section>
<section class="section section-alt">
  <div class="container narrow">
    <h2>Por que analisar antes de pedir</h2>
    <p>Depois da Reforma da Previdência (Emenda Constitucional 103/2019), passaram a existir várias regras de transição, e a escolha da regra muda o momento e o valor do benefício. Conferir o histórico de contribuições (CNIS) antes do pedido evita indeferimentos por falta de documentos e períodos esquecidos, como trabalho rural, atividade especial ou vínculos antigos sem registro no sistema.</p>
  </div>
</section>`,
  },

  {
    path: '/aposentadoria/',
    area: 'previdencia',
    service: 'Aposentadoria',
    title: 'Advogada de Aposentadoria em Praia Grande | INSS',
    description: 'Análise do direito, planejamento e pedido de aposentadoria no INSS em Praia Grande e Baixada Santista: por idade, tempo de contribuição (transição), especial e da pessoa com deficiência.',
    h1: 'Aposentadoria',
    lead: 'Análise do histórico de contribuições, escolha da regra aplicável e acompanhamento do pedido de aposentadoria no INSS e, se necessário, na Justiça.',
    wa: waPrev('aposentadoria'),
    body: `
<section class="section">
  <div class="container narrow">
    <h2>Tipos de aposentadoria</h2>
    <h3>Aposentadoria por idade (programada)</h3>
    <p>Após a Reforma da Previdência, a regra geral exige idade mínima de 62 anos para mulheres e 65 para homens, além de tempo mínimo de contribuição. Quem já contribuía antes de novembro de 2019 pode ter regras de transição.</p>
    <h3>Regras de transição por tempo de contribuição</h3>
    <p>Para quem já estava no sistema antes da reforma, existem regras como pontos, idade mínima progressiva e pedágios. Cada uma leva a um resultado diferente, por isso a comparação é feita caso a caso.</p>
    <h3>Aposentadoria especial</h3>
    <p>Para quem trabalhou exposto a agentes nocivos à saúde, como ruído, agentes químicos ou biológicos, comprovados por documentos como o PPP.</p>
    <h3>Aposentadoria da pessoa com deficiência e rural</h3>
    <p>Possuem requisitos próprios de idade e de tempo, mais favoráveis em determinadas situações.</p>
    <h3>Planejamento previdenciário</h3>
    <p>Estudo do histórico de contribuições para identificar a regra mais vantajosa, o momento adequado para o pedido e pendências a corrigir no CNIS.</p>
  </div>
</section>`,
    faq: [
      ['Como sei quanto tempo de contribuição eu tenho?', 'O extrato do CNIS, disponível no Meu INSS, mostra os vínculos e contribuições registrados. Muitas vezes há períodos faltando ou com dados incorretos, que podem ser corrigidos com documentos.'],
      ['Trabalhei com carteira assinada há muitos anos e o vínculo não aparece. O que fazer?', 'É possível pedir a inclusão do período com documentos como a carteira de trabalho, holerites, ficha de registro ou termo de rescisão.'],
      ['Vale a pena esperar para me aposentar?', 'Depende. Em algumas situações, esperar aumenta o valor; em outras, não muda ou até prejudica. Essa é justamente a análise feita no planejamento.'],
    ],
  },

  {
    path: '/beneficio-por-incapacidade/',
    area: 'previdencia',
    service: 'Benefícios por incapacidade',
    title: 'Advogada de Auxílio-Doença e Aposentadoria por Invalidez em Praia Grande',
    description: 'Auxílio por incapacidade temporária (auxílio-doença), aposentadoria por incapacidade permanente (invalidez) e auxílio-acidente em Praia Grande e Baixada Santista.',
    h1: 'Benefícios por incapacidade',
    lead: 'Orientação sobre auxílio-doença, aposentadoria por invalidez e auxílio-acidente, desde a preparação para a perícia até o recurso quando o benefício é negado ou cortado.',
    wa: waPrev('auxílio-doença'),
    body: `
<section class="section">
  <div class="container narrow">
    <h2>Os benefícios</h2>
    <h3>Auxílio por incapacidade temporária (antigo auxílio-doença)</h3>
    <p>Para o segurado que fica temporariamente incapaz para o trabalho por doença ou acidente. Em regra, exige qualidade de segurado e um número mínimo de contribuições, com exceções previstas em lei.</p>
    <h3>Aposentadoria por incapacidade permanente (antiga aposentadoria por invalidez)</h3>
    <p>Quando a incapacidade é permanente e não há possibilidade de reabilitação para outra atividade.</p>
    <h3>Auxílio-acidente</h3>
    <p>Indenização para quem ficou com sequela que reduz a capacidade para o trabalho habitual, mesmo podendo continuar trabalhando.</p>
    <h3>Perícia, negativa e corte do benefício</h3>
    <p>Laudos, exames e relatórios médicos bem organizados fazem diferença na perícia. Se o benefício for negado ou cessado, cabe recurso administrativo ou ação judicial, com nova perícia.</p>
  </div>
</section>`,
    faq: [
      ['O INSS negou meu auxílio-doença. Ainda dá para conseguir?', 'É possível recorrer administrativamente ou entrar com ação na Justiça, onde é feita uma nova perícia. O resultado depende das provas médicas e da situação de cada segurado.'],
      ['Quais documentos levar para a perícia?', 'Laudos e relatórios médicos recentes com o diagnóstico (CID), o tratamento e as limitações para o trabalho, além de exames e receitas.'],
      ['Posso trabalhar recebendo auxílio-acidente?', 'Sim. O auxílio-acidente é uma indenização e, em regra, pode ser recebido junto com o salário.'],
    ],
  },

  {
    path: '/bpc-loas/',
    area: 'previdencia',
    service: 'BPC/LOAS',
    title: 'Advogada de BPC/LOAS em Praia Grande | Benefício Assistencial',
    description: 'BPC/LOAS para idosos a partir de 65 anos e pessoas com deficiência de baixa renda em Praia Grande e Baixada Santista. Pedido, recurso e ação judicial.',
    h1: 'BPC/LOAS',
    lead: 'Orientação sobre o Benefício de Prestação Continuada, pago pelo INSS a idosos e pessoas com deficiência em situação de baixa renda, mesmo sem contribuição.',
    wa: waPrev('BPC/LOAS'),
    body: `
<section class="section">
  <div class="container narrow">
    <h2>Como funciona</h2>
    <p>O BPC garante um salário mínimo por mês a quem não tem meios de prover o próprio sustento nem de tê-lo provido pela família. Não exige contribuição ao INSS.</p>
    <h3>Quem pode ter direito</h3>
    <ul class="check">
      <li>Pessoa idosa, a partir de 65 anos</li>
      <li>Pessoa com deficiência de qualquer idade, com impedimento de longo prazo</li>
      <li>Em ambos os casos, com renda familiar baixa, avaliada pelo INSS</li>
    </ul>
    <h3>Requisitos práticos</h3>
    <p>É preciso estar inscrito e com dados atualizados no CadÚnico. A análise de renda considera a composição da família e, conforme o caso, despesas como medicamentos e tratamentos.</p>
    <h3>Quando o pedido é negado</h3>
    <p>Indeferimentos por renda ou pela avaliação da deficiência podem ser contestados em recurso ou na Justiça, com nova avaliação.</p>
  </div>
</section>`,
    faq: [
      ['O BPC é uma aposentadoria?', 'Não. É um benefício assistencial: não exige contribuição, não paga 13º e não gera pensão por morte.'],
      ['Se alguém da família trabalha, perco o direito?', 'Não necessariamente. A renda da família é avaliada como um todo, e há situações em que valores e despesas são desconsiderados. Cada caso precisa ser analisado.'],
      ['Preciso estar no CadÚnico?', 'Sim. A inscrição no CadÚnico atualizada é requisito para pedir e manter o benefício.'],
    ],
  },

  {
    path: '/pensao-por-morte/',
    area: 'previdencia',
    service: 'Pensão por morte',
    title: 'Advogada de Pensão por Morte em Praia Grande | INSS',
    description: 'Pensão por morte do INSS para cônjuge, companheiro(a), filhos e outros dependentes em Praia Grande e Baixada Santista. Pedido, comprovação de união e recurso.',
    h1: 'Pensão por morte',
    lead: 'Orientação aos dependentes de segurado falecido para pedir a pensão por morte no INSS, incluindo a comprovação de união estável e o recurso em caso de negativa.',
    wa: waPrev('pensão por morte'),
    body: `
<section class="section">
  <div class="container narrow">
    <h2>Como funciona</h2>
    <h3>Quem são os dependentes</h3>
    <p>Cônjuge ou companheiro(a), filhos menores de 21 anos ou inválidos ou com deficiência e, na falta deles, pais e irmãos, desde que comprovem dependência econômica.</p>
    <h3>Requisitos</h3>
    <p>Em regra, a pessoa falecida precisava ter qualidade de segurado na data do óbito ou já ter direito a aposentadoria.</p>
    <h3>Duração e valor</h3>
    <p>Para cônjuge ou companheiro(a), a duração varia conforme a idade do dependente, o tempo de união e o número de contribuições. Após a Reforma da Previdência, o valor é calculado por cotas, conforme o número de dependentes.</p>
    <h3>Prazo para pedir</h3>
    <p>O momento do pedido influencia a data a partir da qual o benefício é pago. Por isso, o ideal é pedir o quanto antes após o falecimento.</p>
    <p class="muted">Procurando pensão alimentícia entre pais e filhos? Veja <a href="/pensao-alimenticia/">pensão alimentícia</a>.</p>
  </div>
</section>`,
    faq: [
      ['Vivíamos em união estável sem papel passado. Tenho direito?', 'Pode ter. A união estável pode ser comprovada no próprio pedido ao INSS, com documentos como comprovantes de mesmo endereço, conta conjunta ou dependência em plano de saúde.'],
      ['A pensão por morte é vitalícia?', 'Depende. Para cônjuge ou companheiro(a), a duração varia conforme a idade na data do óbito, o tempo de união e as contribuições do falecido.'],
      ['Posso receber pensão por morte e aposentadoria juntas?', 'Em regra sim, mas, após a Reforma da Previdência, um dos benefícios pode ser pago com redução, conforme faixas de valor.'],
    ],
  },

  {
    path: '/revisao-e-recurso-inss/',
    area: 'previdencia',
    service: 'Revisão e recurso no INSS',
    title: 'Benefício Negado ou Revisão do INSS em Praia Grande | Advogada Previdenciária',
    description: 'Recurso contra benefício negado pelo INSS e revisão de aposentadoria e outros benefícios em Praia Grande e Baixada Santista.',
    h1: 'Revisão e benefício negado',
    lead: 'Análise de benefícios negados, cortados ou calculados com erro, com recurso administrativo ou ação judicial quando for o caso.',
    wa: waPrev('benefício negado ou revisão'),
    body: `
<section class="section">
  <div class="container narrow">
    <h2>Em que situações posso ajudar</h2>
    <h3>Benefício negado</h3>
    <p>O indeferimento pode ocorrer por falta de documentos, períodos não reconhecidos ou divergência na perícia. A carta de indeferimento indica o motivo e orienta o melhor caminho: novo pedido, recurso administrativo ou ação judicial.</p>
    <h3>Benefício cortado</h3>
    <p>Benefícios por incapacidade e o BPC podem ser cessados após revisão do INSS. Em muitos casos é possível contestar a decisão.</p>
    <h3>Revisão de valor</h3>
    <p>Períodos não computados, salários lançados de forma incorreta ou atividade especial não reconhecida podem justificar a revisão do benefício já concedido.</p>
  </div>
</section>`,
    faq: [
      ['Qual o prazo para recorrer de uma decisão do INSS?', 'O recurso administrativo tem prazo de 30 dias, contados da ciência da decisão. Fora desse prazo, ainda pode haver outros caminhos, como novo pedido ou ação judicial.'],
      ['Existe prazo para pedir revisão da aposentadoria?', 'Em regra, a revisão do ato de concessão deve ser pedida em até 10 anos. Há particularidades, por isso o caso precisa ser analisado.'],
      ['Preciso recorrer no INSS antes de ir à Justiça?', 'Em regra, é preciso ter feito o pedido ao INSS antes da ação judicial, mas não é obrigatório esgotar os recursos administrativos.'],
    ],
  },

  // ---------- Geral ----------

  {
    path: '/praia-grande/',
    title: 'Advogadas em Praia Grande | Direito de Família e Previdenciário',
    description: 'Advogadas em Praia Grande (SP): divórcio, pensão, guarda, inventário, aposentadoria, auxílio-doença, BPC/LOAS e pensão por morte. Atendimento online ou com hora marcada.',
    h1: 'Advogadas em <em>Praia Grande</em>',
    lead: 'Atendimento a moradores de Praia Grande em Direito de Família e Direito Previdenciário, com consulta online ou presencial com hora marcada.',
    wa: 'Olá. Moro em Praia Grande e gostaria de orientação jurídica.',
    body: `
<section class="section">
  <div class="container narrow">
    <h2>Atendimento em Praia Grande</h2>
    <p>Os processos de família de quem mora em Praia Grande, em regra, tramitam na própria Comarca de Praia Grande, e muitos casos podem ser resolvidos por acordo, inclusive em cartório. Já os pedidos de benefício são feitos ao INSS, em grande parte de forma digital, e as ações previdenciárias seguem na Justiça Federal.</p>
  </div>
</section>
<section class="section section-alt">
  <div class="container">
    <h2>Direito de Família · {{rayssa.short}}</h2>
    ${cards(areas.familia.services)}
    <h2 class="mt">Direito Previdenciário · {{graziella.short}}</h2>
    ${cards(areas.previdencia.services)}
  </div>
</section>
<section class="section">
  <div class="container narrow">
    <h2>Como funciona o atendimento</h2>
    ${steps}
  </div>
</section>`,
    faq: [
      ['Preciso ir até um escritório para a consulta?', 'Não necessariamente. A consulta pode ser online, por vídeo, ou presencial com hora marcada. Os documentos podem ser enviados digitalmente.'],
      ['Atendem também outras cidades da Baixada Santista?', 'Sim. Além de Praia Grande, atendemos clientes de São Vicente, Santos, Guarujá e Cubatão.'],
      ['O que levar para a primeira conversa?', 'Um resumo da situação e os documentos que tiver, como certidões, decisões anteriores, cartas do INSS ou o extrato do CNIS. Se não tiver tudo, não tem problema: a consulta também serve para orientar o que será necessário.'],
    ],
  },

  {
    path: '/sobre/',
    title: 'Sobre as advogadas | Rayssa Rebouças e Graziella Matos',
    description: 'Conheça as advogadas Rayssa Rebouças (Direito de Família) e Graziella Matos (Direito Previdenciário), que atendem em Praia Grande e na Baixada Santista.',
    h1: 'Sobre as advogadas',
    lead: 'Duas advogadas autônomas, cada uma responsável pela sua área, que compartilham o atendimento a clientes de Praia Grande e da Baixada Santista.',
    wa: waGeral,
    person: true,
    body: `
<section class="section" id="rayssa">
  <div class="container narrow">
    <!-- TODO (Rayssa): revisar e completar com formação e trajetória, sem autopromoção. -->
    <h2>{{rayssa.short}}</h2>
    <p class="muted">Direito de Família · {{rayssa.oab}}</p>
    <p><strong>{{rayssa.fullName}}</strong> atua em Direito de Família na Baixada Santista, em divórcio, pensão alimentícia, guarda, união estável e inventário.</p>
    <p>Integrou a diretoria da Associação dos Advogados de Santos (AAS), como 2ª Secretária, na gestão 2024/2025.</p>
    <p>O trabalho é pautado na escuta atenta, no sigilo e na defesa técnica dos interesses de cada cliente. Questões de família envolvem pessoas, não só processos: cada história é tratada com a seriedade e o cuidado que merece.</p>
    <p><a href="/direito-de-familia/">Áreas atendidas</a>{{rayssa.linkedinLink}}</p>
  </div>
</section>
<section class="section section-alt" id="graziella">
  <div class="container narrow">
    <!-- TODO (Graziella): revisar e completar com formação e trajetória, sem autopromoção. -->
    <h2>{{graziella.short}}</h2>
    <p class="muted">Direito Previdenciário · {{graziella.oab}}</p>
    <p><strong>{{graziella.fullName}}</strong> atua em Direito Previdenciário na Baixada Santista, em aposentadorias, benefícios por incapacidade, BPC/LOAS, pensão por morte e revisões junto ao INSS e à Justiça Federal.</p>
    <p>O trabalho parte da análise cuidadosa do histórico de cada segurado, com explicações claras sobre as regras aplicáveis e os caminhos possíveis.</p>
    <p><a href="/direito-previdenciario/">Áreas atendidas</a>{{graziella.linkedinLink}}</p>
  </div>
</section>
<section class="section">
  <div class="container narrow">
    <h2>Compromissos do atendimento</h2>
    <ul class="check">
      <li>Sigilo sobre tudo o que for compartilhado</li>
      <li>Explicações claras sobre os caminhos possíveis e seus riscos</li>
      <li>Proposta de honorários por escrito antes de começar</li>
      <li>Busca de soluções consensuais sempre que forem possíveis</li>
    </ul>
    <p class="muted">Cada advogada atua de forma autônoma e é responsável pelos casos da sua área. Não se trata de sociedade de advogados.</p>
  </div>
</section>`,
  },

  {
    path: '/contato/',
    title: 'Contato e cartão de visita | Rayssa Rebouças e Graziella Matos',
    description: 'Fale pelo WhatsApp, acesse o LinkedIn ou baixe o cartão de visita digital (PDF) das advogadas Rayssa Rebouças e Graziella Matos.',
    h1: 'Contato',
    lead: 'Fale direto pelo WhatsApp, conecte-se no LinkedIn ou baixe o cartão de visita digital de cada advogada para ter o contato sempre à mão.',
    wa: waGeral,
    noCta: true,
    body: `
<section class="section">
  <div class="container">
    <div class="contact-cards">
      ${contactCard('familia', waFamilia('Direito de Família'))}
      ${contactCard('previdencia', waPrev('Direito Previdenciário'))}
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="container narrow">
    <h2>Sobre o cartão digital</h2>
    <ul class="check">
      <li><strong>PDF:</strong> os botões do cartão são clicáveis e abrem o WhatsApp, o LinkedIn e o site. Dá para encaminhar o arquivo para quem precisar de orientação.</li>
      <li><strong>Salvar na agenda:</strong> adiciona nome, telefone, site e foto direto nos contatos do celular.</li>
      <li>Atendimento em ${site.cities.join(', ')}, online ou presencial com hora marcada.</li>
    </ul>
  </div>
</section>`,
  },

  {
    path: '/politica-de-privacidade/',
    title: 'Política de Privacidade',
    description: 'Como este site trata dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
    h1: 'Política de Privacidade',
    lead: 'Como este site trata dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).',
    noCta: true,
    body: `
<section class="section">
  <div class="container narrow prose">
    <h2>Quem são as controladoras</h2>
    <p>Este site é mantido pelas advogadas {{rayssa.fullName}} ({{rayssa.oab}}) e {{graziella.fullName}} ({{graziella.oab}}), que atuam de forma autônoma. Cada uma é controladora dos dados dos atendimentos da sua área. Contato para assuntos de privacidade: {{privacyContact}}.</p>

    <h2>Quais dados são tratados</h2>
    <p><strong>Navegação:</strong> páginas visitadas, tipo de dispositivo, cidade aproximada e origem da visita (por exemplo, se veio de um anúncio do Google), coletados por cookies e ferramentas de medição como o Google Analytics e o Google Tag Manager.</p>
    <p><strong>Contato:</strong> ao clicar no botão do WhatsApp, você inicia uma conversa no aplicativo. O site não recebe o conteúdo dessa conversa. Quando a visita vem de um anúncio, a mensagem pode incluir um código de atendimento, usado apenas para saber qual anúncio gerou o contato.</p>

    <h2>Para que os dados são usados</h2>
    <ul>
      <li>Responder ao seu contato e encaminhá-lo à advogada responsável pela área;</li>
      <li>Medir o desempenho do site e dos anúncios, de forma agregada;</li>
      <li>Cumprir obrigações legais e éticas da advocacia.</li>
    </ul>

    <h2>Compartilhamento</h2>
    <p>Dados de navegação são processados pelo Google (Analytics, Tag Manager e Ads) e o contato acontece pelo WhatsApp (Meta), conforme as políticas desses serviços. Informações sobre o seu caso, incluindo dados de saúde em pedidos de benefício, não são compartilhadas com ferramentas de publicidade ou medição e permanecem protegidas pelo sigilo profissional.</p>

    <h2>Por quanto tempo</h2>
    <p>Dados de navegação são mantidos pelo prazo configurado nas ferramentas de medição. Dados de atendimento são mantidos pelo tempo necessário à prestação do serviço e ao cumprimento de obrigações legais.</p>

    <h2>Seus direitos</h2>
    <p>Você pode pedir confirmação, acesso, correção, anonimização ou eliminação dos seus dados, além de informações sobre o compartilhamento, pelo contato indicado acima. Também pode bloquear ou apagar cookies nas configurações do navegador.</p>

    <p class="muted">Última atualização: {{updated}}.</p>
  </div>
</section>`,
  },
];

export const notFound = {
  path: '/404.html',
  title: 'Página não encontrada',
  description: 'Página não encontrada.',
  h1: 'Página não encontrada',
  lead: 'O endereço pode ter mudado. Use o menu acima ou fale direto pelo WhatsApp.',
  wa: waGeral,
  noindex: true,
  body: '',
};
