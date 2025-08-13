const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const THEME_KEY = 'travelsmart-theme';

function getStoredTheme() {
  try { return localStorage.getItem(THEME_KEY); } catch { return null; }
}
function setStoredTheme(theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch { }
}
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
  } else {
    root.removeAttribute('data-theme');
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

const destinations = [
  {
    id: 'capri-italy',
    title: 'Capri Cliffs Escape',
    location: 'Capri, Italy',
    type: 'beach',
    image: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=1600&auto=format&fit=crop',
    price: 1280,
    rating: 4.9,
    tags: ['Sunsets', 'Boat tour'],
    desc: 'Limestone cliffs, azure grottos, and lemon groves with scenic hikes.',
    durationDays: 4,
    nextStart: '2025-09-05',
    discountPct: 10,
    gallery: [
      'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529927050400-4f7749260a00?q=80&w=1200&auto=format&fit=crop'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    stays: [
      { name: 'Cliffside Suites', type: 'Hotel', rating: 4.6, amenities: ['Pool', 'Breakfast', 'Sea view'] },
      { name: 'Lemon Grove BnB', type: 'BnB', rating: 4.4, amenities: ['Garden', 'Local hosts'] }
    ],
    transport: [
      { mode: 'Flight', from: 'Rome (FCO)', to: 'Naples (NAP)', time: '1h', price: 120 },
      { mode: 'Ferry', from: 'Naples', to: 'Capri', time: '50m', price: 30 }
    ]
  },
  {
    id: 'banff',
    title: 'Banff Alpine Lakes',
    location: 'Alberta, Canada',
    type: 'mountain',
    image: 'https://images.unsplash.com/photo-1500043357865-c6b8827edf39?q=80&w=1600&auto=format&fit=crop',
    price: 990,
    rating: 4.8,
    tags: ['Hiking', 'Glaciers'],
    desc: 'Turquoise lakes and rugged peaks in the Canadian Rockies.',
    durationDays: 6,
    nextStart: '2025-10-01',
    discountPct: 0,
    gallery: [
      'https://images.unsplash.com/photo-1500043357865-c6b8827edf39?q=80&w=1200&auto=format&fit=crop'
    ],
    video: '',
    stays: [
      { name: 'Lakeside Lodge', type: 'Resort', rating: 4.7, amenities: ['Spa', 'Kayaks'] }
    ],
    transport: [
      { mode: 'Flight', from: 'Calgary (YYC)', to: 'Banff', time: '2h drive', price: 60 }
    ]
  },
  {
    id: 'tokyo',
    title: 'Neon Nights Tokyo',
    location: 'Tokyo, Japan',
    type: 'city',
    image: 'https://images.unsplash.com/photo-1491884662610-dfcd28f30cfb?q=80&w=1600&auto=format&fit=crop',
    price: 1380,
    rating: 4.7,
    tags: ['Food', 'Museums'],
    desc: 'Futuristic cityscapes, Michelin ramen, and serene gardens.',
    durationDays: 5,
    nextStart: '2025-08-20',
    discountPct: 5,
    gallery: [
      'https://images.unsplash.com/photo-1491884662610-dfcd28f30cfb?q=80&w=1200&auto=format&fit=crop'
    ],
    video: '',
    stays: [
      { name: 'Shinjuku Tower', type: 'Hotel', rating: 4.5, amenities: ['Metro access', 'Wi‑Fi'] }
    ],
    transport: [
      { mode: 'Flight', from: 'Your city', to: 'Tokyo (NRT/HND)', time: '12h+', price: 900 }
    ]
  },
  {
    id: 'bali',
    title: 'Bali Ocean Villas',
    location: 'Bali, Indonesia',
    type: 'beach',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1600&auto=format&fit=crop',
    price: 860,
    rating: 4.6,
    tags: ['Surf', 'Wellness'],
    desc: 'Lush rice terraces, surf breaks, and sunrise yoga.',
    durationDays: 7,
    nextStart: '2025-07-10',
    discountPct: 12,
    gallery: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop'
    ],
    video: '',
    stays: [{ name: 'Ubud Retreat', type: 'Resort', rating: 4.6, amenities: ['Yoga', 'Spa', 'Breakfast'] }],
    transport: [{ mode: 'Flight', from: 'Your city', to: 'Denpasar (DPS)', time: '10h+', price: 700 }]
  },
  {
    id: 'marrakech',
    title: 'Marrakech Medina',
    location: 'Marrakech, Morocco',
    type: 'cultural',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop',
    price: 920,
    rating: 4.6,
    tags: ['Souks', 'Riads'],
    desc: 'Colorful souks, spice markets, and ornate riads in the red city.',
    durationDays: 4,
    nextStart: '2025-05-22',
    discountPct: 0,
    gallery: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop'],
    video: '',
    stays: [{ name: 'Riad Zellige', type: 'Riad', rating: 4.7, amenities: ['Courtyard', 'Mint tea'] }],
    transport: [{ mode: 'Flight', from: 'Your city', to: 'RAK', time: '4h+', price: 350 }]
  },
  {
    id: 'serengeti',
    title: 'Serengeti Big Five',
    location: 'Serengeti, Tanzania',
    type: 'safari',
    image: 'https://images.unsplash.com/photo-1548095115-45697e51363e?q=80&w=1600&auto=format&fit=crop',
    price: 2450,
    rating: 4.9,
    tags: ['Game drives', 'Guided'],
    desc: 'Witness the great migration and spot the big five with experts.',
    durationDays: 6,
    nextStart: '2025-08-01',
    discountPct: 15,
    gallery: ['https://images.unsplash.com/photo-1548095115-45697e51363e?q=80&w=1200&auto=format&fit=crop'],
    video: '',
    stays: [{ name: 'Savanna Tented Camp', type: 'Camp', rating: 4.8, amenities: ['Guides', 'All meals'] }],
    transport: [{ mode: 'Flight', from: 'Arusha', to: 'Serengeti', time: '1h', price: 140 }]
  },
  {
    id: 'paris',
    title: 'Paris Art Walk',
    location: 'Paris, France',
    type: 'city',
    image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1600&auto=format&fit=crop',
    price: 1190,
    rating: 4.7,
    tags: ['Galleries', 'Cafés'],
    desc: 'Boulevards, impressionist galleries, and croissant mornings.',
    durationDays: 4,
    nextStart: '2025-06-15',
    discountPct: 0,
    gallery: ['https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1200&auto=format&fit=crop'],
    video: '',
    stays: [{ name: 'Left Bank Boutique', type: 'Hotel', rating: 4.5, amenities: ['Breakfast', 'River walk'] }],
    transport: [{ mode: 'Flight', from: 'Your city', to: 'CDG/ORY', time: '7h+', price: 600 }]
  },
  {
    id: 'patagonia',
    title: 'Patagonia Frontier',
    location: 'El Chaltén, Argentina',
    type: 'mountain',
    image: 'https://images.unsplash.com/photo-1523419409543-3139482d7810?q=80&w=1600&auto=format&fit=crop',
    price: 1680,
    rating: 4.8,
    tags: ['Trekking', 'Glaciers'],
    desc: 'Jagged peaks, hanging glaciers, and otherworldly winds.',
    durationDays: 8,
    nextStart: '2025-11-02',
    discountPct: 0,
    gallery: ['https://images.unsplash.com/photo-1523419409543-3139482d7810?q=80&w=1200&auto=format&fit=crop'],
    video: '',
    stays: [{ name: 'Fitz Roy Refugio', type: 'Hostel', rating: 4.4, amenities: ['Trails', 'Kitchen'] }],
    transport: [{ mode: 'Flight', from: 'Buenos Aires', to: 'El Calafate', time: '3h', price: 180 }]
  },
  {
    id: 'santorini',
    title: 'Santorini Blue Domes',
    location: 'Santorini, Greece',
    type: 'beach',
    image: 'https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=1600&auto=format&fit=crop',
    price: 980,
    rating: 4.6,
    tags: ['Sunsets', 'Caves'],
    desc: 'Caldera views, cliffside suites, and volcanic beaches.',
    durationDays: 4,
    nextStart: '2025-07-01',
    discountPct: 8,
    gallery: ['https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=1200&auto=format&fit=crop'],
    video: '',
    stays: [{ name: 'Oia Cave Suites', type: 'Hotel', rating: 4.7, amenities: ['Infinity pool', 'Breakfast'] }],
    transport: [{ mode: 'Flight', from: 'ATH', to: 'JTR', time: '40m', price: 80 }]
  },
  {
    id: 'kyoto',
    title: 'Kyoto Temples',
    location: 'Kyoto, Japan',
    type: 'cultural',
    image: 'https://images.unsplash.com/photo-1505066836043-7dcd4d4d9c05?q=80&w=1600&auto=format&fit=crop',
    price: 1480,
    rating: 4.8,
    tags: ['Tea', 'Shrines'],
    desc: 'Torii paths, tea ceremonies, and maple foliage.',
    durationDays: 5,
    nextStart: '2025-10-12',
    discountPct: 0,
    gallery: ['https://images.unsplash.com/photo-1505066836043-7dcd4d4d9c05?q=80&w=1200&auto=format&fit=crop'],
    video: '',
    stays: [{ name: 'Machiya House', type: 'Inn', rating: 4.6, amenities: ['Garden', 'Tea'] }],
    transport: [{ mode: 'Train', from: 'Tokyo', to: 'Kyoto', time: '2h 15m', price: 120 }]
  },
  {
    id: 'dubai',
    title: 'Dubai Skyline',
    location: 'Dubai, UAE',
    type: 'city',
    image: 'https://images.unsplash.com/photo-1531761535209-180857e96343?q=80&w=1600&auto=format&fit=crop',
    price: 1320,
    rating: 4.5,
    tags: ['Skyscrapers', 'Desert'],
    desc: 'Futuristic architecture and golden dunes adventure.',
    durationDays: 4,
    nextStart: '2025-05-30',
    discountPct: 0,
    gallery: ['https://images.unsplash.com/photo-1531761535209-180857e96343?q=80&w=1200&auto=format&fit=crop'],
    video: '',
    stays: [{ name: 'Marina View', type: 'Hotel', rating: 4.4, amenities: ['Pool', 'Wi‑Fi'] }],
    transport: [{ mode: 'Flight', from: 'Your city', to: 'DXB', time: '7h+', price: 550 }]
  },
  {
    id: 'queenstown',
    title: 'Queenstown Thrills',
    location: 'Queenstown, New Zealand',
    type: 'mountain',
    image: 'https://images.unsplash.com/photo-1502781252888-1aa96244ed1d?q=80&w=1600&auto=format&fit=crop',
    price: 1520,
    rating: 4.7,
    tags: ['Bungee', 'Lakes'],
    desc: 'Adventure capital with pristine lakes and alpine air.',
    durationDays: 6,
    nextStart: '2025-12-01',
    discountPct: 0,
    gallery: ['https://images.unsplash.com/photo-1502781252888-1aa96244ed1d?q=80&w=1200&auto=format&fit=crop'],
    video: '',
    stays: [{ name: 'Remarkables Lodge', type: 'Resort', rating: 4.6, amenities: ['Lakeside', 'Spa'] }],
    transport: [{ mode: 'Flight', from: 'Auckland', to: 'Queenstown', time: '1h 50m', price: 90 }]
  }
];

function renderCards(list) {
  const grid = document.getElementById('cardGrid');
  const countEl = document.getElementById('resultsCount');
  const tpl = document.getElementById('cardTemplate');
  grid.innerHTML = '';
  list.forEach(item => {
    const node = tpl.content.cloneNode(true);
    const article = node.querySelector('.card');
    article.dataset.type = item.type;
    node.querySelector('img').src = item.image;
    node.querySelector('img').alt = item.title;
    node.querySelector('.rating span').textContent = item.rating.toFixed(1);
    node.querySelector('.title').textContent = item.title;
    node.querySelector('.location').textContent = item.location;
    const tags = node.querySelector('.tags');
    item.tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      tags.appendChild(span);
    });
    node.querySelector('.amount').textContent = formatCurrency(item.price);
    node.querySelector('[data-quickview]').addEventListener('click', () => openQuickView(item));
    grid.appendChild(node);
  });
  countEl.textContent = `Showing ${list.length} result${list.length !== 1 ? 's' : ''}`;
}

function applyFilter(type, maxBudget, query = '', minRating = 0, duration = 'any', sort = 'popularity') {
  let list = destinations.filter(d => (type === 'all' || d.type === type) && d.price <= maxBudget);
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(d => d.title.toLowerCase().includes(q) || d.location.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q)));
  }
  if (minRating > 0) list = list.filter(d => d.rating >= minRating);
  if (duration !== 'any') {
    list = list.filter(d => {
      if (duration === 'short') return d.durationDays <= 3;
      if (duration === 'medium') return d.durationDays >= 4 && d.durationDays <= 7;
      if (duration === 'long') return d.durationDays >= 8;
      return true;
    });
  }
  const collator = new Intl.Collator();
  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (sort === 'alpha') list.sort((a, b) => collator.compare(a.title, b.title));
  else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
  renderCards(list);
}

function openQuickView(item) {
  const modal = document.getElementById('quickModal');
  modal.querySelector('.modal-img').src = item.image;
  modal.querySelector('.modal-title').textContent = item.title;
  modal.querySelector('.modal-location').textContent = item.location;
  modal.querySelector('.modal-desc').textContent = item.desc;
  const gal = modal.querySelector('#modalGallery');
  gal.innerHTML = '';
  item.gallery?.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = item.title;
    gal.appendChild(img);
  });
  const vidWrap = modal.querySelector('#modalVideoWrap');
  vidWrap.innerHTML = '';
  if (item.video) {
    const iframe = document.createElement('iframe');
    iframe.src = item.video;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    vidWrap.appendChild(iframe);
  }
  modal.querySelector('#modalDuration').textContent = `${item.durationDays} days`;
  modal.querySelector('#modalStart').textContent = new Date(item.nextStart).toLocaleDateString();
  const discountEl = modal.querySelector('#modalDiscount');
  discountEl.textContent = item.discountPct ? `Early booking: -${item.discountPct}%` : 'No current discount';
  const staysEl = modal.querySelector('#modalStays');
  staysEl.innerHTML = '';
  item.stays?.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.name} — ${s.type} • ${s.rating.toFixed(1)}★ • ${s.amenities.join(', ')}`;
    staysEl.appendChild(li);
  });
  const transportEl = modal.querySelector('#modalTransport');
  transportEl.innerHTML = '';
  item.transport?.forEach(t => {
    const li = document.createElement('li');
    li.textContent = `${t.mode}: ${t.from} → ${t.to} • ${t.time} • ${formatCurrency(t.price)}`;
    transportEl.appendChild(li);
  });
  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
}

function closeQuickView() {
  const modal = document.getElementById('quickModal');
  if (modal.open && typeof modal.close === 'function') modal.close();
  modal.removeAttribute('open');
}

document.addEventListener('DOMContentLoaded', () => {
  const storedTheme = getStoredTheme();
  applyTheme(storedTheme ?? (prefersDark ? 'dark' : 'light'));

  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  function refreshThemeIcon() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    themeIcon.className = isLight ? 'ri-moon-line' : 'ri-sun-line';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  }
  refreshThemeIcon();
  themeToggle?.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    setStoredTheme(next);
    refreshThemeIcon();
  });

  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  navToggle?.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  primaryNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    primaryNav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  const budget = document.getElementById('qBudget');
  const budgetOut = document.getElementById('budgetOut');
  const chips = Array.from(document.querySelectorAll('.chip'));
  const searchForm = document.getElementById('search');
  const exploreBtn = document.getElementById('btnExplore');
  const qSearch = document.getElementById('qSearch');
  const qSort = document.getElementById('qSort');
  const qRating = document.getElementById('qRating');
  const qDuration = document.getElementById('qDuration');

  function updateBudgetLabel() {
    budgetOut.textContent = formatCurrency(Number(budget.value));
  }
  budget?.addEventListener('input', updateBudgetLabel);
  updateBudgetLabel();

  renderCards(destinations);

  let activeFilter = 'all';
  chips.forEach(chip => chip.addEventListener('click', () => {
    activeFilter = chip.dataset.filter;
    chips.forEach(c => c.classList.toggle('is-active', c === chip));
    applyFilter(activeFilter, Number(budget.value), qSearch.value, Number(qRating.value), qDuration.value, qSort.value);
  }));

  searchForm?.addEventListener('submit', e => {
    e.preventDefault();
    applyFilter(activeFilter, Number(budget.value), qSearch.value, Number(qRating.value), qDuration.value, qSort.value);
    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
  });

  [qSearch, qSort, qRating, qDuration].forEach(el => {
    el?.addEventListener('input', () => applyFilter(activeFilter, Number(budget.value), qSearch.value, Number(qRating.value), qDuration.value, qSort.value));
    el?.addEventListener('change', () => applyFilter(activeFilter, Number(budget.value), qSearch.value, Number(qRating.value), qDuration.value, qSort.value));
  });

  exploreBtn?.addEventListener('click', () => {
    window.location.href = 'catalog.html';
  });

  // Add event listeners for all Explore buttons in category cards and experience cards
  document.querySelectorAll('.category-card .btn.secondary, .experience-card .btn.secondary').forEach(button => {
    button.addEventListener('click', () => {
      window.location.href = 'catalog.html';
    });
  });

  const expCarousel = document.getElementById('expCarousel');
  document.querySelector('[data-carousel-prev]')?.addEventListener('click', () => {
    expCarousel.scrollBy({ left: -expCarousel.clientWidth * 0.9, behavior: 'smooth' });
  });
  document.querySelector('[data-carousel-next]')?.addEventListener('click', () => {
    expCarousel.scrollBy({ left: expCarousel.clientWidth * 0.9, behavior: 'smooth' });
  });

  const storyTrack = document.getElementById('storyTrack');
  document.querySelector('[data-story-prev]')?.addEventListener('click', () => {
    storyTrack.scrollBy({ left: -storyTrack.clientWidth * 0.9, behavior: 'smooth' });
  });
  document.querySelector('[data-story-next]')?.addEventListener('click', () => {
    storyTrack.scrollBy({ left: storyTrack.clientWidth * 0.9, behavior: 'smooth' });
  });

  document.querySelector('[data-close-modal]')?.addEventListener('click', closeQuickView);
  document.getElementById('quickModal')?.addEventListener('click', (e) => {
    const dlg = e.currentTarget;
    const rect = dlg.querySelector('.modal-body').getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) closeQuickView();
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const subscribeForm = document.getElementById('subscribeForm');
  subscribeForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const button = subscribeForm.querySelector('button');
    const original = button.textContent;
    button.disabled = true;
    button.textContent = 'Subscribed!';
    setTimeout(() => { button.disabled = false; button.textContent = original; subscribeForm.reset(); }, 1400);
  });

  // Reviews
  const reviewForm = document.getElementById('reviewForm');
  const reviewList = document.getElementById('reviewList');
  const revDestination = document.getElementById('revDestination');
  if (revDestination) {
    destinations.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = `${d.title} — ${d.location}`;
      revDestination.appendChild(opt);
    });
  }
  const reviews = [];
  function renderReviews() {
    if (!reviewList) return;
    reviewList.innerHTML = '';
    reviews.forEach(r => {
      const div = document.createElement('div');
      div.className = 'review';
      const title = destinations.find(d => d.id === r.destinationId)?.title || 'Trip';
      div.innerHTML = `<strong>${r.name}</strong> rated <strong>${title}</strong> ${r.rating}/5 <span class="meta">• ${r.when || '—'}</span><p class="muted">${r.text}</p>`;
      reviewList.appendChild(div);
    });
  }
  reviewForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('revName').value.trim();
    const destinationId = revDestination?.value;
    const rating = Number(document.getElementById('revRating').value);
    const when = document.getElementById('revWhen').value;
    const text = document.getElementById('revText').value.trim();
    if (!name || !destinationId || !text) return;
    reviews.unshift({ name, destinationId, rating, when, text, at: Date.now() });
    renderReviews();
    reviewForm.reset();
  });

  // Feedback
  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackNote = document.getElementById('feedbackNote');
  feedbackForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fbName').value.trim();
    const email = document.getElementById('fbEmail').value.trim();
    const rating = document.getElementById('fbRating').value;
    const topic = document.getElementById('fbTopic').value.trim();
    const comments = document.getElementById('fbComments').value.trim();
    feedbackNote.textContent = `Thanks ${name}! We appreciate your ${rating}/5 feedback${topic ? ' on ' + topic : ''}. (Not stored.)`;
    feedbackForm.reset();
  });

  // Contact / Geolocation + map
  const locateBtn = document.getElementById('btnLocate');
  const locText = document.getElementById('locText');
  const mapFrame = document.getElementById('mapFrame');
  locateBtn?.addEventListener('click', async () => {
    if (!navigator.geolocation) {
      locText.textContent = 'Geolocation is not supported by your browser.';
      return;
    }
    locText.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      locText.textContent = `Your location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      const url = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
      if (mapFrame) mapFrame.src = url;
    }, (err) => {
      locText.textContent = `Unable to retrieve your location (${err.code})`;
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
  });

  // All buttons redirect to trip catalog (except form submit buttons)
  const allButtons = document.querySelectorAll('button');
  allButtons.forEach(button => {
    // Skip form submit buttons and the theme toggle
    if (button.type === 'submit' || button.id === 'themeToggle' || button.id === 'navToggle') {
      return;
    }

    // Check if button text contains explore, book, read more, or similar action words
    const buttonText = button.textContent.toLowerCase();
    const actionWords = ['explore', 'book', 'read more', 'subscribe', 'contact'];

    if (actionWords.some(word => buttonText.includes(word))) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'catalog.html';
      });
    }
  });

  // Also handle anchor tags that look like buttons
  const buttonLinks = document.querySelectorAll('a.btn');
  buttonLinks.forEach(link => {
    const linkText = link.textContent.toLowerCase();
    const actionWords = ['explore', 'book', 'read more', 'subscribe', 'contact'];

    if (actionWords.some(word => linkText.includes(word))) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'catalog.html';
      });
    }
  });

  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const button = newsletterForm.querySelector('button');
    const original = button.textContent;
    button.disabled = true;
    button.textContent = 'Subscribed!';
    setTimeout(() => { button.disabled = false; button.textContent = original; newsletterForm.reset(); }, 1400);
  });

  // Premium section animations
  const premiumCards = document.querySelectorAll('.premium-card');
  const premiumObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 200);
      }
    });
  }, { threshold: 0.1 });

  premiumCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    premiumObserver.observe(card);
  });
});




