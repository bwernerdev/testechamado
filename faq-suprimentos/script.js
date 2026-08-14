'use strict';

const faqItems = [
  {
    title: 'Loren ipsun 01',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo eget magna fermentum iaculis. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'Loren ipsun 02',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    title: 'Loren ipsun 03',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  {
    title: 'Loren ipsun 04',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    title: 'Loren ipsun 05',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas accumsan lacus vel facilisis volutpat est velit egestas dui id ornare arcu odio ut sem.',
  },
  {
    title: 'Loren ipsun 06',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus.',
  },
  {
    title: 'Loren ipsun 07',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pulvinar pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
  },
  {
    title: 'Loren ipsun 08',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget nunc scelerisque viverra mauris in aliquam sem fringilla ut morbi tincidunt augue interdum velit.',
  },
  {
    title: 'Loren ipsun 09',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim nulla aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat semper viverra nam.',
  },
  {
    title: 'Loren ipsun 10',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus aenean.',
  },
];

const organogramUpdatedAt = '2026-08-12';

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

function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const faqList = document.querySelector('[data-faq-list]');
const faqSearch = document.querySelector('[data-faq-search]');
const searchStatus = document.querySelector('[data-search-status]');
const emptyState = document.querySelector('[data-empty-state]');
const expandAllButton = document.querySelector('[data-expand-all]');
let allowMultipleOpen = false;

function renderFaq() {
  if (!faqList) return;

  faqList.innerHTML = faqItems
    .map((item, index) => {
      const headingId = `faq-item-${index + 1}`;
      return `
        <section class="faq-card" aria-labelledby="${headingId}">
          <details class="content-toggle">
            <summary>
              <h2 id="${headingId}">
                <span class="question-title">${escapeHtml(item.title)}</span>
                <span class="toggle-icon" aria-hidden="true"></span>
              </h2>
            </summary>
            <div class="toggle-content">
              <p>${escapeHtml(item.content)}</p>
            </div>
          </details>
        </section>`;
    })
    .join('');
}

function visibleCards() {
  return [...(faqList?.querySelectorAll('.faq-card') ?? [])].filter((card) => !card.hidden);
}

function updateExpandButton() {
  if (!expandAllButton) return;

  const cards = visibleCards();
  const areAllOpen = cards.length > 0 && cards.every((card) => card.querySelector('details').open);
  expandAllButton.textContent = areAllOpen ? 'Recolher todas' : 'Expandir todas';
  expandAllButton.setAttribute('aria-pressed', String(areAllOpen));
  expandAllButton.disabled = cards.length === 0;
}

function filterFaq() {
  if (!faqList || !faqSearch) return;

  const query = normalizeText(faqSearch.value);
  let matches = 0;

  faqList.querySelectorAll('.faq-card').forEach((card, index) => {
    const item = faqItems[index];
    const searchableText = normalizeText(`${item.title} ${item.content}`);
    const isMatch = !query || searchableText.includes(query);
    card.hidden = !isMatch;
    if (isMatch) matches += 1;
  });

  if (emptyState) emptyState.hidden = matches !== 0;
  if (searchStatus) {
    searchStatus.textContent = query
      ? `${matches} ${matches === 1 ? 'pergunta encontrada' : 'perguntas encontradas'}.`
      : `${faqItems.length} perguntas disponíveis.`;
  }
  updateExpandButton();
}

renderFaq();

faqList?.addEventListener('toggle', (event) => {
  const details = event.target;
  if (!(details instanceof HTMLDetailsElement) || !details.open || allowMultipleOpen) {
    updateExpandButton();
    return;
  }

  faqList.querySelectorAll('details[open]').forEach((otherDetails) => {
    if (otherDetails !== details) otherDetails.open = false;
  });
  updateExpandButton();
}, true);

faqList?.addEventListener('click', (event) => {
  const card = event.target.closest('.faq-card');
  if (!card) return;
  const details = card.querySelector('details');

  if (event.target.closest('summary')) {
    allowMultipleOpen = false;
    faqList.querySelectorAll('details[open]').forEach((otherDetails) => {
      if (otherDetails !== details) otherDetails.open = false;
    });
    return;
  }

  if (event.target.closest('a, button, input, select, textarea')) return;
  allowMultipleOpen = false;
  faqList.querySelectorAll('details[open]').forEach((otherDetails) => {
    if (otherDetails !== details) otherDetails.open = false;
  });
  details.open = !details.open;
});

faqSearch?.addEventListener('input', filterFaq);

expandAllButton?.addEventListener('click', () => {
  const cards = visibleCards();
  const shouldOpen = !cards.every((card) => card.querySelector('details').open);
  allowMultipleOpen = shouldOpen;
  cards.forEach((card) => {
    card.querySelector('details').open = shouldOpen;
  });
  updateExpandButton();
});

filterFaq();

function renderAvatar(member) {
  const initials = escapeHtml(member.initials);
  if (!member.image) return initials;

  return `
    <img
      src="${escapeHtml(member.image)}"
      alt=""
      width="64"
      height="64"
      loading="lazy"
      decoding="async"
      data-avatar-image
    />
    <span data-avatar-fallback hidden>${initials}</span>`;
}

function enableAvatarFallbacks(container) {
  container.querySelectorAll('[data-avatar-image]').forEach((image) => {
    const showFallback = () => {
      image.hidden = true;
      image.nextElementSibling.hidden = false;
    };

    image.addEventListener('error', showFallback, { once: true });

    if (image.complete && image.naturalWidth === 0) {
      showFallback();
    }
  });
}

function renderLeadership() {
  const container = document.querySelector('.leadership');
  if (!container) return;

  container.innerHTML = leadershipMembers
    .map(
      (member) => `
      <article class="team-member leadership-member" role="listitem">
        <div class="avatar" aria-hidden="true">${renderAvatar(member)}</div>
        <h3>${escapeHtml(member.name)}</h3>
        <p>${escapeHtml(member.role)}</p>
      </article>`
    )
    .join('');

  enableAvatarFallbacks(container);
}

function renderOrganogram() {
  const container = document.querySelector('.organogram');
  if (!container) return;

  container.innerHTML = [...teamMembers]
    .sort((first, second) => first.order - second.order)
    .map((member) => {
      const centers = member.centers
        .map((center) => `<li>${escapeHtml(center)}</li>`)
        .join('');
      const compactClass = member.compact ? ' team-member--compact' : '';
      const unitsId = `unidades-${slugify(member.name)}`;
      return `
      <article class="team-member${compactClass}" role="listitem">
        <div class="team-member-content">
          <div class="team-member-front" aria-hidden="false">
            <div class="avatar" aria-hidden="true">${renderAvatar(member)}</div>
            <h3>${escapeHtml(member.name)}</h3>
            <div class="contact-details">
              <p>Ramal: ${escapeHtml(member.ramal)}</p>
              <a href="mailto:${escapeHtml(member.email)}">${escapeHtml(member.email)}</a>
            </div>
          </div>
          <div class="team-member-back" id="${unitsId}" aria-hidden="true" inert>
            <h3>${escapeHtml(member.name)}</h3>
            <p class="team-member-back-label">Unidades atendidas</p>
            <ul class="distribution-centers">${centers}</ul>
          </div>
        </div>
        <button class="flip-hint" type="button" data-team-toggle aria-expanded="false" aria-controls="${unitsId}">
          <span>Ver unidades atendidas</span>
        </button>
        <span class="visually-hidden" data-team-status aria-live="polite"></span>
      </article>`;
    })
    .join('');

  enableAvatarFallbacks(container);
}

const organogramDialog = document.querySelector('#organogram-dialog');
const openOrganogramButton = document.querySelector('[data-organogram-open]');
const closeOrganogramButton = document.querySelector('[data-organogram-close]');
const organogramUpdatedText = document.querySelector('[data-organogram-updated]');

if (organogramUpdatedText) {
  const [year, month, day] = organogramUpdatedAt.split('-');
  organogramUpdatedText.dateTime = organogramUpdatedAt;
  organogramUpdatedText.textContent = `${day}/${month}/${year}`;
}

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
    toggleTeamMember(card, false);
  });
}

function toggleTeamMember(card, announce = true) {
  if (card) {
    card.classList.toggle('is-showing-units');
    const isShowingUnits = card.classList.contains('is-showing-units');
    const front = card.querySelector('.team-member-front');
    const back = card.querySelector('.team-member-back');
    const toggleButton = card.querySelector('[data-team-toggle]');
    const status = card.querySelector('[data-team-status]');
    const memberName = card.querySelector('.team-member-front h3').textContent;

    front.setAttribute('aria-hidden', String(isShowingUnits));
    back.setAttribute('aria-hidden', String(!isShowingUnits));
    front.inert = isShowingUnits;
    back.inert = !isShowingUnits;
    toggleButton.setAttribute('aria-expanded', String(isShowingUnits));
    toggleButton.querySelector('span').textContent = isShowingUnits
      ? 'Voltar aos contatos'
      : 'Ver unidades atendidas';
    status.textContent = announce
      ? isShowingUnits
        ? `${memberName}: unidades atendidas exibidas.`
        : `${memberName}: contatos exibidos.`
      : '';
  }
}

organogram?.addEventListener('click', (event) => {
  const toggleButton = event.target.closest('[data-team-toggle]');
  if (!toggleButton) return;

  toggleTeamMember(toggleButton.closest('.team-member'));
});

organogramDialog?.addEventListener('close', resetTeamMembers);

renderLeadership();
renderOrganogram();
