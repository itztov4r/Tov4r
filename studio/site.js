'use strict';
(() => {
  const menuButton = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  const search = document.getElementById('product-search');
  const cards = [...document.querySelectorAll('.product')];
  const filters = [...document.querySelectorAll('.filter')];
  const noResults = document.getElementById('no-results');
  const modal = document.getElementById('detail-dialog');
  const details = {
    'death-note': {
      type: 'DISCORD THEME',
      title: 'TOV4R Death Note',
      desc: 'A fan-inspired ink-black and crimson CSS theme with notebook motifs. The public download deliberately does not bundle anime artwork or include official endorsement. Works as a desktop CSS theme, but Discord updates can affect selectors.',
      href: '/themes/TOV4R-DeathNote.theme.css'
    },
    crimson: {
      type: 'DISCORD THEME',
      title: 'Crimson Ledger',
      desc: 'A fully artwork-free, minimalist dark crimson theme with readable surfaces and subtle focus states. Download the CSS, add it to a compatible desktop client Themes folder, and enable it.',
      href: '/themes/Crimson-Ledger.theme.css'
    }
  };
  let active = 'all';

  function updateCatalog() {
    const term = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const categoryMatch = active === 'all' || card.dataset.type === active;
      const text = (card.dataset.search + ' ' + card.querySelector('h3').textContent).toLocaleLowerCase();
      const shown = categoryMatch && text.includes(term);
      card.hidden = !shown;
      if (shown) visible++;
    });
    noResults.hidden = visible !== 0;
    filters.forEach(button => {
      const selected = button.dataset.filter === active;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  filters.forEach(button => button.addEventListener('click', () => {
    active = button.dataset.filter;
    updateCatalog();
  }));
  search.addEventListener('input', updateCatalog);
  document.querySelectorAll('[data-filter-link]').forEach(link => {
    link.addEventListener('click', () => {
      active = link.dataset.filterLink;
      search.value = '';
      updateCatalog();
    });
  });
  if (menuButton) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open', !expanded);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
  document.querySelectorAll('[data-detail]').forEach(button => {
    button.addEventListener('click', () => {
      const item = details[button.dataset.detail];
      if (!item) return;
      document.getElementById('dialog-type').textContent = item.type;
      document.getElementById('dialog-title').textContent = item.title;
      document.getElementById('dialog-description').textContent = item.desc;
      document.getElementById('dialog-download').href = item.href;
      if (typeof modal.showModal === 'function') modal.showModal();
    });
  });
  document.getElementById('close-dialog').addEventListener('click', () => modal.close());
  document.getElementById('dialog-guide').addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => {
    if (event.target === modal) modal.close();
  });
  document.getElementById('year').textContent = new Date().getFullYear();

  // This updates a previously installed TOV4R gaming service worker as well.
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    }, { once: true });
  }
  updateCatalog();
})();