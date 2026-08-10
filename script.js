const organogramDialog = document.querySelector('#organogram-dialog');
const openOrganogramButton = document.querySelector('[data-organogram-open]');
const closeOrganogramButton = document.querySelector('[data-organogram-close]');

openOrganogramButton.addEventListener('click', () => {
  organogramDialog.showModal();
});

closeOrganogramButton.addEventListener('click', () => {
  organogramDialog.close();
});

document.querySelectorAll('main > section').forEach((section) => {
  const contentToggle = section.querySelector('.content-toggle');

  section.addEventListener('click', (event) => {
    if (event.target.closest('summary, a, button')) {
      return;
    }

    contentToggle.open = !contentToggle.open;
  });
});
