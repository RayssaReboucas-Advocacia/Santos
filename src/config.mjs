// Dados únicos do site. Tudo que aparece em várias páginas sai daqui.
// Campos marcados com TODO precisam ser preenchidos antes de publicar;
// o build avisa enquanto algum placeholder continuar aqui.
//
// Rayssa e Graziella são advogadas autônomas (sem sociedade registrada na OAB):
// o site não pode usar nome de escritório conjunto, só o nome de cada uma.

export const lawyers = {
  rayssa: {
    short: 'Dra. Rayssa Rebouças',
    fullName: 'Rayssa Rebouças Lima Sandim',
    oab: 'OAB/SP nº 472.462',
    area: 'Direito de Família',
    linkedin: 'https://www.linkedin.com/in/rayssa-rebou%C3%A7as-949396167/',
  },
  graziella: {
    short: 'Dra. Graziella Matos',
    fullName: 'Graziella Matos',
    oab: 'OAB/SP nº 493.818',
    area: 'Direito Previdenciário',
    linkedin: '', // TODO, opcional
  },
};

export const site = {
  // Nome do site: os nomes das duas, sem sugerir sociedade.
  brand: 'Rayssa Rebouças e Graziella Matos · Advogadas',
  logo: ['Rayssa Rebouças', 'Graziella Matos'],

  // Endereço atual no GitHub Pages; trocar pelo domínio próprio quando existir (gera o CNAME).
  url: 'https://rayssareboucas-advocacia.github.io/Santos',

  // Um número só para as duas; a mensagem pré-preenchida indica a área para a triagem.
  // TODO: trocar pelo número exclusivo do WhatsApp Business (Fase 1)
  whatsapp: '5513981956857',
  whatsappDisplay: '(13) 98195-6857',

  email: '', // TODO: e-mail profissional no domínio
  instagram: '', // TODO: https://www.instagram.com/...

  // Rastreamento: deixe vazio até ter os IDs; o site funciona sem eles.
  gtmId: '', // ex.: GTM-XXXXXXX
  // Opcional: URL (ex.: Apps Script) que recebe {ref, gclid, página} a cada clique no WhatsApp.
  leadEndpoint: '',

  cities: ['Praia Grande', 'São Vicente', 'Santos', 'Guarujá', 'Cubatão'],
};

const todo = (s) => /000\.000|SOBRENOME|NOME COMPLETO|SEUDOMINIO/.test(s);

export const placeholders = [
  ['OAB da Rayssa', () => todo(lawyers.rayssa.oab)],
  ['OAB da Graziella', () => todo(lawyers.graziella.fullName + lawyers.graziella.short + lawyers.graziella.oab + site.brand + site.logo.join())],
  ['url (domínio próprio)', () => todo(site.url) || /github.io/.test(site.url)],
  ['email', () => !site.email],
  ['instagram', () => !site.instagram],
  ['gtmId', () => !site.gtmId],
];
