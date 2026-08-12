'use strict';

const organogramUpdatedAt = '12/08/2026';

const leadershipMembers = [
  { initials: 'AB', name: 'Alex Borba', role: 'Gerente Regional de CDs' },
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
    name: 'Bruno Werner',
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
  if (!container) return;

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
  if (!container) return;

  container.innerHTML = teamMembers
    .map((member) => {
      const centers = member.centers
        .map((center) => `<li>${escapeHtml(center)}</li>`)
        .join('');
      return `
      <article class="team-member" role="listitem" tabindex="0" aria-expanded="false" aria-label="${escapeHtml(member.name)}: mostrar unidades atendidas">
        <div class="team-member-content">
          <div class="team-member-front">
            <div class="avatar" aria-hidden="true">${escapeHtml(member.initials)}</div>
            <h3>${escapeHtml(member.name)}</h3>
            <div class="contact-details">
              <p>Ramal: ${escapeHtml(member.ramal)}</p>
              <a href="mailto:${escapeHtml(member.email)}">${escapeHtml(member.email)}</a>
            </div>
            <span class="flip-hint" aria-hidden="true">Clique para ver as unidades</span>
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

const organogramDialog = document.querySelector('#organogram-dialog');
const openOrganogramButton = document.querySelector('[data-organogram-open]');
const closeOrganogramButton = document.querySelector('[data-organogram-close]');
const organogramUpdatedText = document.querySelector('[data-organogram-updated]');

if (organogramUpdatedText) {
  organogramUpdatedText.textContent = `Dados atualizados em ${organogramUpdatedAt}`;
}

document.querySelectorAll('main > section').forEach((section) => {
  const details = section.querySelector('.content-toggle');
  const summary = details?.querySelector('summary');
  if (!details || !summary) return;

  section.tabIndex = 0;
  section.setAttribute('role', 'button');
  section.setAttribute('aria-expanded', String(details.open));

  const toggleDetails = () => {
    details.open = !details.open;
    section.setAttribute('aria-expanded', String(details.open));
  };

  section.addEventListener('click', (event) => {
    if (event.target.closest('summary, a, button, input, select, textarea')) return;

    toggleDetails();
  });

  section.addEventListener('keydown', (event) => {
    if (event.target !== section || (event.key !== 'Enter' && event.key !== ' ')) return;

    event.preventDefault();
    toggleDetails();
  });

  details.addEventListener('toggle', () => {
    section.setAttribute('aria-expanded', String(details.open));
  });
});

if (organogramDialog && openOrganogramButton && closeOrganogramButton) {
  openOrganogramButton.addEventListener('click', () => {
    if (typeof organogramDialog.showModal === 'function') {
      organogramDialog.showModal();
      return;
    }

    organogramDialog.setAttribute('open', '');
    organogramDialog.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  closeOrganogramButton.addEventListener('click', () => {
    if (typeof organogramDialog.close === 'function') {
      organogramDialog.close();
      return;
    }

    organogramDialog.removeAttribute('open');
  });

  organogramDialog.addEventListener('click', (event) => {
    if (event.target === organogramDialog) {
      if (typeof organogramDialog.close === 'function') {
        organogramDialog.close();
      } else {
        organogramDialog.removeAttribute('open');
      }
    }
  });
}

const organogram = document.querySelector('.organogram');

function toggleTeamMember(card) {
  if (card) {
    card.classList.toggle('is-flipped');
    const isFlipped = card.classList.contains('is-flipped');
    const name = card.querySelector('.team-member-front h3')?.textContent || 'Comprador';

    card.setAttribute('aria-expanded', String(isFlipped));
    card.setAttribute('aria-label', `${name}: ${isFlipped ? 'ocultar' : 'mostrar'} unidades atendidas`);
  }
}

organogram?.addEventListener('click', (event) => {
  if (event.target.closest('a')) return;
  toggleTeamMember(event.target.closest('.team-member'));
});

organogram?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;

  const card = event.target.closest('.team-member');
  if (!card || event.target !== card) return;

  event.preventDefault();
  toggleTeamMember(card);
});

renderLeadership();
renderOrganogram();
