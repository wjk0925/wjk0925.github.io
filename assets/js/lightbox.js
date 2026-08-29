// Full-screen viewer for the photography page.
//
// Replaces medium-zoom here so the overlay can sit above the fixed navbar,
// carry a caption, and support keyboard paging between photos.
(function () {
  const box = document.getElementById('lightbox');
  if (!box) return;

  const tiles = Array.from(document.querySelectorAll('.photo'));
  const img = box.querySelector('.lightbox-img');
  const meta = box.querySelector('.lightbox-meta');
  let index = -1;
  let lastFocus = null;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  function prettyDate(iso) {
    const parts = (iso || '').split('-');
    if (parts.length !== 3) return iso || '';
    return monthNames[parseInt(parts[1], 10) - 1] + ' ' +
      parseInt(parts[2], 10) + ', ' + parts[0];
  }

  function show(i) {
    if (i < 0 || i >= tiles.length) return;
    index = i;
    const t = tiles[i];
    img.src = t.dataset.full;
    img.alt = t.querySelector('img').alt;
    meta.textContent = [t.dataset.location, t.dataset.device, prettyDate(t.dataset.date)]
      .filter(Boolean).join('  ·  ');
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => box.classList.add('is-open'));
    box.querySelector('.lightbox-close').focus();
  }

  function close() {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    // Wait for the fade before hiding, so the transition is visible.
    setTimeout(() => { box.hidden = true; img.removeAttribute('src'); }, 200);
    if (lastFocus) lastFocus.focus();
  }

  tiles.forEach((t, i) => t.addEventListener('click', () => open(i)));

  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.querySelector('.lightbox-prev').addEventListener('click', (e) => {
    e.stopPropagation(); show((index - 1 + tiles.length) % tiles.length);
  });
  box.querySelector('.lightbox-next').addEventListener('click', (e) => {
    e.stopPropagation(); show((index + 1) % tiles.length);
  });

  // Clicking the backdrop closes; clicking the photo itself does not.
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  box.querySelector('.lightbox-figure').addEventListener('click', (e) => {
    if (e.target !== img) close();
  });

  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show((index - 1 + tiles.length) % tiles.length);
    if (e.key === 'ArrowRight') show((index + 1) % tiles.length);
  });
})();
