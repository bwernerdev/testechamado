'use strict';

const {
  updatedAt: organogramUpdatedAt,
  leadershipMembers,
  teamMembers,
} = globalThis.organogramData;

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
