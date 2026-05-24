/* ── Mobile nav ─────────────────────────────────────────── */
const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Lightbox (gallery page only) ───────────────────────── */
const gallery  = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');

if (gallery && lightbox) {
  const inner    = document.getElementById('lightbox-inner');
  const caption  = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn  = document.getElementById('lightbox-prev');
  const nextBtn  = document.getElementById('lightbox-next');

  const items = Array.from(gallery.querySelectorAll('.gallery-item'));
  let current = 0;

  function cloneForLightbox(item) {
    const img = item.querySelector('img');
    if (img) {
      const el = document.createElement('img');
      el.src = img.src;
      el.alt = img.alt;
      return el;
    }
    const ph = item.querySelector('.placeholder');
    if (ph) {
      const clone = ph.cloneNode(true);
      clone.style.width  = '340px';
      clone.style.height = 'auto';
      return clone;
    }
    return document.createElement('div');
  }

  function openLightbox(index) {
    current = index;
    inner.innerHTML = '';
    inner.appendChild(cloneForLightbox(items[current]));
    const style  = items[current].dataset.style  || '';
    const medium = items[current].dataset.medium || '';
    caption.textContent = medium ? `${style} · ${medium}` : style;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPrev() {
    current = (current - 1 + items.length) % items.length;
    inner.innerHTML = '';
    inner.appendChild(cloneForLightbox(items[current]));
    const style  = items[current].dataset.style  || '';
    const medium = items[current].dataset.medium || '';
    caption.textContent = medium ? `${style} · ${medium}` : style;
  }

  function showNext() {
    current = (current + 1) % items.length;
    inner.innerHTML = '';
    inner.appendChild(cloneForLightbox(items[current]));
    const style  = items[current].dataset.style  || '';
    const medium = items[current].dataset.medium || '';
    caption.textContent = medium ? `${style} · ${medium}` : style;
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')    closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* touch swipe */
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 40) return;
    delta < 0 ? showNext() : showPrev();
  }, { passive: true });
}
