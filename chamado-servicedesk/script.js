'use strict';

/* ----------------------------------------------------------------
   Dados do organograma — edite aqui quando o time ou os CDs mudarem.
   ---------------------------------------------------------------- */

const leadershipMembers = [
  { initials: 'AB', name: 'Alex Borba', role: "Gerente Regional CD's" },
  { initials: 'FL', name: 'Fabiano Lechinski', role: 'Coordenador Administrativo' },
];

const teamMembers = [
  {
    initials: 'TM',
    name: 'Thayane Morlus',
    ramal: '47 3241 8564 (8291 - 8564)',
    email: 'thayane.afonso@seara.com.br',
    centers: [
      '178.692 — Campinas - CD',
      '178.963 — Ribeirão Preto - CD',
      '178.697 — São Paulo - CD',
      '178.892 — SP Anhanguera - CD',
      '30.901 — Campinas - CD',
      '30.603 — Duque de Caxias - CD',
    ],
  },
  {
    initials: 'BW',
    name: 'Bruno Wener',
    ramal: '47 3241 8515 (8291 - 8515)',
    email: 'bruno.werner@seara.com.br',
    centers: [
      '30.570 — Itajaí Armazém',
      '30.572 — Itajaí Fatiados',
      '30.573 — Itajaí - CD',
      '30.733 — Cambé - CD',
    ],
  },
  {
    initials: 'SP',
    name: 'Sandro Pereira',
    ramal: '47 3241 1116 (8291 - 1116)',
    email: 'sandro.pereira@seara.com.br',
    centers: ['Atendimento e suporte à equipe de Compras.'],
  },
  {
    initials: 'VC',
    name: 'Vitor Cruz',
    ramal: '47 3241 1174 (8291 - 1174)',
    email: 'vitor.antunes@seara.com.br',
    centers: [
      '178.676 — Cabo Santo Agostinho - CD',
      '178.356 — Aquiraz - CD',
      '178.675 — Ribeirão das Neves - CD',
      '30.910 — Salvador - CD',
      '30.965 — Vitória da Conquista - CD',
      '30.458 — Nova Santa Rita - CD',
      '30.943 — Ribeirão Preto - CD',
      '30.770 — Canoas - ADM',
    ],
  },
];

/* ----------------------------------------------------------------
   Renderização do organograma
   ---------------------------------------------------------------- */

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}

function renderLeadership() {
  const container = document.querySelector('.leadership');
  container.innerHTML = leadershipMembers
    .map(
      (member) => `
      <article class="team-member leadership-member" role="listitem">
        <div class="avatar" aria-hidden="true">${escapeHtml(member.initials)}</div>
        <h3>${escapeHtml(member.name)}</h3>
        <p>${escapeHtml(member.role)}</p>
      </article>`
    )
    .join('');
}

function renderOrganogram() {
  const container = document.querySelector('.organogram');
  container.innerHTML = teamMembers
    .map((member) => {
      const centers = member.centers
        .map((center) => `<li>${escapeHtml(center)}</li>`)
        .join('');
      return `
      <article class="team-member" role="listitem">
        <div class="team-member-content">
          <div class="team-member-front">
            <div class="avatar" aria-hidden="true">${escapeHtml(member.initials)}</div>
            <h3>${escapeHtml(member.name)}</h3>
            <div class="contact-details">
              <p>Ramal: ${escapeHtml(member.ramal)}</p>
              <a href="mailto:${escapeHtml(member.email)}">${escapeHtml(member.email)}</a>
            </div>
          </div>
          <div class="team-member-back">
            <h3>Unidades atendidas</h3>
            <ul class="distribution-centers">${centers}</ul>
          </div>
        </div>
      </article>`;
    })
    .join('');
}

/* ----------------------------------------------------------------
   Interações da página
   ---------------------------------------------------------------- */

const organogramDialog = document.querySelector('#organogram-dialog');
const openOrganogramButton = document.querySelector('[data-organogram-open]');
const closeOrganogramButton = document.querySelector('[data-organogram-close]');

openOrganogramButton.addEventListener('click', () => {
  organogramDialog.showModal();
});

closeOrganogramButton.addEventListener('click', () => {
  organogramDialog.close();
});

// Fecha o diálogo ao clicar no backdrop (área escura ao redor).
organogramDialog.addEventListener('click', (event) => {
  if (event.target === organogramDialog) {
    organogramDialog.close();
  }
});

document.querySelector('.organogram').addEventListener('click', (event) => {
  if (event.target.closest('a')) return;

  const card = event.target.closest('.team-member');
  if (card) {
    card.classList.toggle('is-flipped');
  }
});

renderLeadership();
renderOrganogram();
