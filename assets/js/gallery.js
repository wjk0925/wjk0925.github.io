// Justified rows, the layout Flickr popularised: photos in a row share one
// height, widths follow their aspect ratios, and the row fills the width
// exactly. Row breaks are chosen by looking ahead, which is the part CSS
// alone cannot do — flex-wrap breaks on the first item that does not fit
// rather than on the break that lands closest to the target height.
(function () {
  const TARGET = 250;   // preferred row height
  const MIN    = 165;   // never squash below this
  const MAX     = 340;  // never enlarge past this — beyond it the 1400px
                        // source starts to look soft
  const GAP    = 8;

  function rowsFor(items, width) {
    const rows = [];
    let row = [];
    for (const it of items) {
      row.push(it);
      const sum = row.reduce((a, b) => a + b.ar, 0);
      const h = (width - GAP * (row.length - 1)) / sum;
      if (h <= TARGET) {
        // Would stopping one earlier have landed closer to the target?
        if (row.length > 1) {
          const prevSum = sum - it.ar;
          const prevH = (width - GAP * (row.length - 2)) / prevSum;
          if (Math.abs(prevH - TARGET) < Math.abs(h - TARGET)) {
            row.pop();
            rows.push({ items: row, h: prevH });
            row = [it];
            continue;
          }
        }
        rows.push({ items: row, h });
        row = [];
      }
    }
    if (row.length) {
      const sum = row.reduce((a, b) => a + b.ar, 0);
      const h = (width - GAP * (row.length - 1)) / sum;
      // A short final row keeps the target height rather than stretching
      // its photos up to fill the width.
      rows.push({ items: row, h: Math.min(h, MAX) });
    }
    return rows;
  }

  function layout(grid) {
    const width = grid.clientWidth;
    if (!width) return;
    const tiles = Array.from(grid.children);
    tiles.forEach(t => { t.dataset.arNum = t.dataset.arNum || t.dataset.ar; });
    const items = tiles.map(t => ({ el: t, ar: parseFloat(t.dataset.ar) || 1.5 }));
    for (const row of rowsFor(items, width)) {
      const h = Math.max(MIN, Math.min(MAX, row.h));
      for (const it of row.items) {
        it.el.style.height = h + 'px';
        it.el.style.width = Math.floor(h * it.ar) + 'px';
      }
    }
  }

  function layoutAll() {
    document.querySelectorAll('.photo-grid').forEach(layout);
  }

  layoutAll();
  document.documentElement.classList.add('js-justified');
  window.addEventListener('resize', () => {
    clearTimeout(window.__galleryT);
    window.__galleryT = setTimeout(layoutAll, 100);
  });
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => layoutAll());
    document.querySelectorAll('.photo-grid').forEach(g => ro.observe(g));
  }
})();

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
