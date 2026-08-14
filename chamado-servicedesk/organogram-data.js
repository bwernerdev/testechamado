'use strict';

// Fonte de dados exclusiva do Chamado Service Desk.

globalThis.organogramData = Object.freeze({
  updatedAt: '2026-08-12',
  leadershipMembers: [
    {
      initials: 'AB',
      name: 'Alex Borba',
      role: 'Gerente Regional de CDs',
      image: 'imagens/org-alex.webp',
    },
    {
      initials: 'FL',
      name: 'Fabiano Lechinski',
      role: 'Coordenador Administrativo',
      image: 'imagens/org-fabiano.webp',
    },
  ],
  teamMembers: [
    {
      initials: 'TM',
      name: 'Thayane Morlus',
      order: 2,
      ramal: '47 3241 8564 (8291 - 8564)',
      email: 'thayane.afonso@seara.com.br',
      image: 'imagens/org-thayane.webp',
      centers: [
        '178.692 — Campinas (CD)',
        '178.963 — Ribeirão Preto (CD)',
        '178.697 — São Paulo (CD)',
        '178.892 — SP Anhanguera (CD)',
        '30.901 — Campinas (CD)',
        '30.603 — Duque de Caxias (CD)',
      ],
    },
    {
      initials: 'BW',
      name: 'Bruno Werner',
      order: 4,
      ramal: '47 3241 8515 (8291 - 8515)',
      email: 'bruno.werner@seara.com.br',
      image: 'imagens/org-bruno.webp',
      centers: [
        '30.570 — Itajaí (Armazém)',
        '30.572 — Itajaí (Fatiados)',
        '30.573 — Itajaí (CD)',
        '30.733 — Cambé (CD)',
      ],
    },
    {
      initials: 'SP',
      name: 'Sandro Pereira',
      order: 1,
      ramal: '47 3241 1116 (8291 - 1116)',
      email: 'sandro.pereira@seara.com.br',
      image: 'imagens/org-sandro.webp',
      centers: ['Atendimento e suporte à equipe de Compras.'],
    },
    {
      initials: 'VC',
      name: 'Vitor Cruz',
      order: 3,
      ramal: '47 3241 1174 (8291 - 1174)',
      email: 'vitor.antunes@seara.com.br',
      image: 'imagens/org-vitor.webp',
      compact: true,
      centers: [
        '178.676 — Cabo Santo Agostinho (CD)',
        '178.356 — Aquiraz (CD)',
        '178.675 — Ribeirão das Neves (CD)',
        '30.910 — Salvador (CD)',
        '30.965 — Vitória da Conquista (CD)',
        '30.458 — Nova Santa Rita (CD)',
        '30.943 — Ribeirão Preto (CD)',
        '30.770 — Canoas (ADM)',
      ],
    },
  ],
});
