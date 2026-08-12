'use strict';

const organogramUpdatedAt = '12/08/2026';

const leadershipMembers = [
  { initials: 'AB', name: 'Alex Borba', role: 'Gerente Regional de CDs', image: 'imagens/org-alex.webp' },
  {
    initials: 'FL',
    name: 'Fabiano Lechinski',
    role: 'Coordenador Administrativo',
    image: 'imagens/org-fabiano.webp',
  },
];

const teamMembers = [
  {
    initials: 'TM',
    name: 'Thayane Morlus',
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
    ramal: '47 3241 8515 (8291 - 8515)',
    email: 'bruno.werner@seara.com.br',
    image: 'imagens/org-bruno.webp',
    centers: [
      '30.570 — Itajaí Armazém',
      '30.572 — Itajaí Fatiados',
      '30.573 — Itajaí (CD)',
      '30.733 — Cambé (CD)',
    ],
  },
  {
    initials: 'SP',
    name: 'Sandro Pereira',
    ramal: '47 3241 1116 (8291 - 1116)',
    email: 'sandro.pereira@seara.com.br',
    image: 'imagens/org-sandro.webp',
    centers: ['Atendimento e suporte à equipe de Compras.'],
  },
  {
    initials: 'VC',
    name: 'Vitor Cruz',
    ramal: '47 3241 1174 (8291 - 1174)',
    email: 'vitor.antunes@seara.com.br',
    image: 'imagens/org-vitor.webp',
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
];

const teamDisplayOrder = ['Sandro Pereira', 'Thayane Morlus', 'Vitor Cruz', 'Bruno Werner'];

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
        <div class="avatar" aria-hidden="true">${member.image
          ? `<img src="${escapeHtml(member.image)}" alt="" width="64" height="64" loading="lazy" decoding="async" />`
          : escapeHtml(member.initials)}</div>
        <h3>${escapeHtml(member.name)}</h3>
        <p>${escapeHtml(member.role)}</p>
      </article>`
    )
    .join('');
}

function renderOrganogram() {
  const container = document.querySelector('.organogram');
  if (!container) return;

  container.innerHTML = [...teamMembers]
    .sort((first, second) => teamDisplayOrder.indexOf(first.name) - teamDisplayOrder.indexOf(second.name))
    .map((member, index) => {
      const centers = member.centers
        .map((center) => `<li>${escapeHtml(center)}</li>`)
        .join('');
      const compactClass = member.centers.length >= 8 ? ' team-member--compact' : '';
      const unitsId = `unidades-${index + 1}`;
      return `
      <article class="team-member${compactClass}" role="listitem">
        <div class="team-member-content">
          <div class="team-member-front" aria-hidden="false">
            <div class="avatar" aria-hidden="true">${member.image
              ? `<img src="${escapeHtml(member.image)}" alt="" width="64" height="64" loading="lazy" decoding="async" />`
              : escapeHtml(member.initials)}</div>
            <h3>${escapeHtml(member.name)}</h3>
            <div class="contact-details">
              <p>Ramal: ${escapeHtml(member.ramal)}</p>
              <a href="mailto:${escapeHtml(member.email)}">${escapeHtml(member.email)}</a>
            </div>
          </div>
          <div class="team-member-back" id="${unitsId}" aria-hidden="true" aria-live="polite" inert>
            <h3>${escapeHtml(member.name)}</h3>
            <p class="team-member-back-label">Unidades atendidas</p>
            <ul class="distribution-centers">${centers}</ul>
          </div>
        </div>
        <button class="flip-hint" type="button" data-team-toggle aria-expanded="false" aria-controls="${unitsId}">
          <span>Ver unidades atendidas</span>
        </button>
      </article>`;
    })
    .join('');
}

const organogramDialog = document.querySelector('#organogram-dialog');
const openOrganogramButton = document.querySelector('[data-organogram-open]');
const closeOrganogramButton = document.querySelector('[data-organogram-close]');
const organogramUpdatedText = document.querySelector('[data-organogram-updated]');

if (organogramUpdatedText) {
  const [day, month, year] = organogramUpdatedAt.split('/');
  organogramUpdatedText.dateTime = `${year}-${month}-${day}`;
  organogramUpdatedText.textContent = organogramUpdatedAt;
}

document.querySelectorAll('main > section').forEach((section) => {
  const details = section.querySelector('.content-toggle');
  const summary = details?.querySelector('summary');
  if (!details || !summary) return;

  const toggleDetails = () => {
    details.open = !details.open;
  };

  section.addEventListener('click', (event) => {
    if (event.target.closest('summary, a, button, input, select, textarea')) return;

    toggleDetails();
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
    resetTeamMembers();
  });

  organogramDialog.addEventListener('click', (event) => {
    if (event.target === organogramDialog) {
      if (typeof organogramDialog.close === 'function') {
        organogramDialog.close();
      } else {
        organogramDialog.removeAttribute('open');
        resetTeamMembers();
      }
    }
  });
}

const organogram = document.querySelector('.organogram');

function resetTeamMembers() {
  organogram?.querySelectorAll('.team-member.is-showing-units').forEach((card) => {
    toggleTeamMember(card);
  });
}

function toggleTeamMember(card) {
  if (card) {
    card.classList.toggle('is-showing-units');
    const isShowingUnits = card.classList.contains('is-showing-units');
    const front = card.querySelector('.team-member-front');
    const back = card.querySelector('.team-member-back');
    const toggleButton = card.querySelector('[data-team-toggle]');

    front.setAttribute('aria-hidden', String(isShowingUnits));
    back.setAttribute('aria-hidden', String(!isShowingUnits));
    front.inert = isShowingUnits;
    back.inert = !isShowingUnits;
    toggleButton.setAttribute('aria-expanded', String(isShowingUnits));
    toggleButton.querySelector('span').textContent = isShowingUnits
      ? 'Voltar aos contatos'
      : 'Ver unidades atendidas';
  }
}

organogram?.addEventListener('click', (event) => {
  if (event.target.closest('a')) return;
  toggleTeamMember(event.target.closest('.team-member'));
});

organogramDialog?.addEventListener('close', resetTeamMembers);

renderLeadership();
renderOrganogram();
