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

const faqUpdatedAt = '2026-08-14';

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

function normalizeText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const faqList = document.querySelector('[data-faq-list]');
const faqSearch = document.querySelector('[data-faq-search]');
const searchStatus = document.querySelector('[data-search-status]');
const faqUpdatedText = document.querySelector('[data-faq-updated]');
const emptyState = document.querySelector('[data-empty-state]');
const expandAllButton = document.querySelector('[data-expand-all]');
const backToTopButton = document.querySelector('[data-back-to-top]');
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

function highlightText(element, text, query) {
  element.textContent = '';
  if (!query) {
    element.textContent = text;
    return;
  }

  let normalizedText = '';
  const sourceIndexes = [];
  [...text].forEach((character, sourceIndex) => {
    const normalizedCharacter = normalizeText(character);
    normalizedText += normalizedCharacter;
    sourceIndexes.push(...Array(normalizedCharacter.length).fill(sourceIndex));
  });

  const normalizedQuery = normalizeText(query);
  const ranges = [];
  let searchFrom = 0;
  let matchIndex = normalizedText.indexOf(normalizedQuery, searchFrom);

  while (matchIndex !== -1) {
    const start = sourceIndexes[matchIndex];
    const end = sourceIndexes[matchIndex + normalizedQuery.length - 1] + 1;
    ranges.push([start, end]);
    searchFrom = matchIndex + normalizedQuery.length;
    matchIndex = normalizedText.indexOf(normalizedQuery, searchFrom);
  }

  if (ranges.length === 0) {
    element.textContent = text;
    return;
  }

  const fragment = document.createDocumentFragment();
  let cursor = 0;
  ranges.forEach(([start, end]) => {
    fragment.append(document.createTextNode(text.slice(cursor, start)));
    const mark = document.createElement('mark');
    mark.textContent = text.slice(start, end);
    fragment.append(mark);
    cursor = end;
  });
  fragment.append(document.createTextNode(text.slice(cursor)));
  element.append(fragment);
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

  const query = normalizeText(faqSearch.value).trim();
  let matches = 0;

  faqList.querySelectorAll('.faq-card').forEach((card, index) => {
    const item = faqItems[index];
    const searchableText = normalizeText(`${item.title} ${item.content}`);
    const isMatch = !query || searchableText.includes(query);
    card.hidden = !isMatch;
    highlightText(card.querySelector('.question-title'), item.title, query);
    highlightText(card.querySelector('.toggle-content p'), item.content, query);
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

if (faqUpdatedText) {
  const [year, month, day] = faqUpdatedAt.split('-');
  faqUpdatedText.dateTime = faqUpdatedAt;
  faqUpdatedText.textContent = `${day}/${month}/${year}`;
}

function updateBackToTopButton() {
  backToTopButton?.classList.toggle('is-visible', window.scrollY > 500);
}

window.addEventListener('scroll', updateBackToTopButton, { passive: true });
backToTopButton?.addEventListener('click', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});
updateBackToTopButton();

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
const helpDialog = document.querySelector('#help-dialog');
const openHelpButton = document.querySelector('[data-help-open]');
const closeHelpButton = document.querySelector('[data-help-close]');

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

if (helpDialog && openHelpButton && closeHelpButton) {
  openHelpButton.addEventListener('click', () => {
    if (typeof helpDialog.showModal === 'function') {
      helpDialog.showModal();
      return;
    }

    helpDialog.setAttribute('open', '');
    helpDialog.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  closeHelpButton.addEventListener('click', () => {
    if (typeof helpDialog.close === 'function') {
      helpDialog.close();
      return;
    }

    helpDialog.removeAttribute('open');
  });

  helpDialog.addEventListener('click', (event) => {
    if (event.target !== helpDialog) return;

    if (typeof helpDialog.close === 'function') {
      helpDialog.close();
    } else {
      helpDialog.removeAttribute('open');
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
