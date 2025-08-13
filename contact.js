// contact.js — Minimal version: only modals for form submit & location actions
(function () {
  // ---------- Modal System ----------
  function injectModalStyles() {
    if (document.getElementById('ts-modal-style')) return;
    const css = `
    .ts-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);
      display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;pointer-events:none;
      transition:opacity .4s ease}
    .ts-modal-backdrop.active{opacity:1;pointer-events:auto}
    .ts-modal{width:min(92vw,420px);background:rgba(255,255,255,.08);
      border:1px solid rgba(255,255,255,.16);color:var(--text,#fff);
      border-radius:18px;padding:24px 22px;box-shadow:0 20px 60px rgba(0,0,0,.45);
      transform:translateX(120%);transition:transform .45s ease}
    .ts-modal-backdrop.active .ts-modal{transform:translateX(0)}
    .ts-modal__icon{font-size:42px;line-height:1;margin-bottom:10px}
    .ts-modal__icon.success{color:var(--success,#35d686)}
    .ts-modal__icon.info{color:var(--accent,#5b8cff)}
    .ts-modal h3{margin:0 0 6px;font-size:1.35rem}
    .ts-modal p{margin:0;color:var(--muted,#c9d1ea)}
    .ts-modal__actions{display:flex;gap:10px;justify-content:center;margin-top:18px}
    .ts-btn{padding:10px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.08);color:inherit;cursor:pointer}
    .ts-btn.primary{background:linear-gradient(135deg,var(--success,#35d686),#4ad98d);
      color:#0b1512;border:none}
    `;
    const style = document.createElement('style');
    style.id = 'ts-modal-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function showModal({ kind = 'success', title = 'Success', message = '', okText = 'Close' }) {
    injectModalStyles();
    const backdrop = document.createElement('div');
    backdrop.className = 'ts-modal-backdrop';
    backdrop.innerHTML = `
      <div class="ts-modal" role="dialog" aria-modal="true">
        <div class="ts-modal__icon ${kind}">${kind === 'success' ? '✅' : 'ℹ️'}</div>
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="ts-modal__actions">
          <button class="ts-btn primary" data-close>${okText}</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    requestAnimationFrame(() => backdrop.classList.add('active'));

    function close() {
      backdrop.classList.remove('active');
      setTimeout(() => backdrop.remove(), 300);
    }

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop || e.target.hasAttribute('data-close')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  // ---------- Form submit ----------
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.reset();
    showModal({
      kind: 'success',
      title: 'Message Sent',
      message: 'Thanks! We’ll get back to you shortly.',
      okText: 'Close'
    });
  });

  // ---------- Location fetch ----------
  const btnLocate = document.getElementById('btnLocate');
  const locText = document.getElementById('locText');
  const mapFrame = document.getElementById('mapFrame');

  btnLocate?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showModal({
        kind: 'info',
        title: 'Geolocation Not Supported',
        message: 'Your browser does not support location access.',
        okText: 'Okay'
      });
      return;
    }
    if (locText) locText.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { latitude, longitude } = coords;
      if (locText) locText.textContent = `Your location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      if (mapFrame) mapFrame.src = `https://www.google.com/maps?q=${latitude},${longitude}&hl=auto&z=13&output=embed`;
      showModal({
        kind: 'info',
        title: 'Location Detected',
        message: `We found your location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}.`,
        okText: 'Nice'
      });
    }, (err) => {
      if (locText) locText.textContent = 'Share your location to get directions.';
      showModal({
        kind: 'info',
        title: 'Location Error',
        message: err.message || 'Unable to retrieve location.',
        okText: 'Close'
      });
    });
  });

  // ---------- Location send ----------
  const btnSubscribe = document.getElementById('btnSubscribe');
  btnSubscribe?.addEventListener('click', () => {
    showModal({
      kind: 'success',
      title: 'Location Sent',
      message: 'We have sent your location/directions successfully.',
      okText: 'Done'
    });
  });

})();
