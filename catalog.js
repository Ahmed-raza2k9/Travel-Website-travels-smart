function formatCurrency(amount) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const panels = {
    'by-type': document.getElementById('panel-by-type'),
    'transport': document.getElementById('panel-transport'),
    'stays': document.getElementById('panel-stays'),
    'by-country': document.getElementById('panel-by-country'),
    'by-activity': document.getElementById('panel-by-activity'),
  };
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    Object.values(panels).forEach(p => p.classList.remove('is-active'));
    panels[tab.dataset.tab].classList.add('is-active');
  }));

  const typeChips = document.getElementById('typeChips');
  const types = Array.from(new Set(window.DESTINATIONS.map(d => d.type)));
  ['all', ...types].forEach(t => {
    const b = document.createElement('button');
    b.className = `chip${t === 'all' ? ' is-active' : ''}`;
    b.dataset.filter = t;
    b.textContent = t[0].toUpperCase() + t.slice(1);
    typeChips.appendChild(b);
  });

  const qSearch = document.getElementById('qSearch');
  const qSort = document.getElementById('qSort');
  const qRating = document.getElementById('qRating');
  const qDuration = document.getElementById('qDuration');
  const gridType = document.getElementById('gridType');
  const tpl = document.getElementById('tplCard');
  let activeType = 'all';

  function render(list, grid) {
    grid.innerHTML = '';
    list.forEach(item => {
      const node = tpl.content.cloneNode(true);
      node.querySelector('.card').dataset.id = item.id;
      node.querySelector('img').src = item.image;
      node.querySelector('img').alt = item.title;
      node.querySelector('.rating span').textContent = item.rating.toFixed(1);
      node.querySelector('.title').textContent = item.title;
      node.querySelector('.location').textContent = item.location;
      node.querySelector('.amount').textContent = formatCurrency(item.price);
      const tagWrap = node.querySelector('.tags');
      item.tags.slice(0, 3).forEach(t => { const s = document.createElement('span'); s.className = 'tag'; s.textContent = t; tagWrap.appendChild(s); });
      node.querySelector('[data-compare]').addEventListener('click', () => toggleCompare(item));
      const actions = node.querySelector('.actions');
      const isDestination = typeof item.durationDays !== 'undefined';
      if (actions) {
        const btnBook = actions.querySelector('[data-book]');
        const btnDetails = actions.querySelector('[data-details]');
        if (btnBook) btnBook.addEventListener('click', () => {
          window.location.href = `book.html?id=${item.id}`;
        });
        if (btnDetails) btnDetails.addEventListener('click', () => {
          window.location.href = `detail.html?id=${item.id}`;
        });
      } else if (actions) {
        actions.remove();
      }
      grid.appendChild(node);
    });
  }

  function applyFilters() {
    const budget = Infinity;
    let list = window.DESTINATIONS.filter(d => (activeType === 'all' || d.type === activeType) && d.price <= budget);
    const q = qSearch.value.trim().toLowerCase();
    if (q) list = list.filter(d => d.title.toLowerCase().includes(q) || d.location.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q)));
    const minRating = Number(qRating.value);
    if (minRating) list = list.filter(d => d.rating >= minRating);
    const dur = qDuration.value;
    if (dur !== 'any') list = list.filter(d => (dur === 'short' && d.durationDays <= 3) || (dur === 'medium' && d.durationDays >= 4 && d.durationDays <= 7) || (dur === 'long' && d.durationDays >= 8));
    const collator = new Intl.Collator();
    const sort = qSort.value;
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'alpha') list.sort((a, b) => collator.compare(a.title, b.title));
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    render(list, gridType);
  }

  typeChips.addEventListener('click', (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activeType = chip.dataset.filter;
    typeChips.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c === chip));
    applyFilters();
  });
  ;[qSearch, qSort, qRating, qDuration].forEach(el => { el.addEventListener('input', applyFilters); el.addEventListener('change', applyFilters); });

  // Transport panel
  const gridTransport = document.getElementById('gridTransport');
  const transportCards = window.DESTINATIONS.flatMap(d => d.transport.map(t => ({
    id: `${d.id}-${t.mode}`,
    title: `${t.mode} to ${d.title}`,
    location: `${t.from} → ${t.to}`,
    image: d.image,
    rating: d.rating,
    price: t.price,
    tags: [d.region, d.type]
  })));
  render(transportCards, gridTransport);

  // Stays panel
  const gridStays = document.getElementById('gridStays');
  const stayCards = window.DESTINATIONS.flatMap(d => d.stays.map(s => ({
    id: `${d.id}-${s.name}`,
    title: `${s.name} (${s.type})`,
    location: d.location,
    image: d.image,
    rating: s.rating,
    price: d.price,
    tags: s.amenities
  })));
  render(stayCards, gridStays);

  // Country panel
  const gridCountry = document.getElementById('gridCountry');
  const countries = ['North America', 'South America', 'Africa', 'Europe', 'Asia', 'Antarctica', 'Australia'];
  const countryCards = countries.map(region => {
    const first = window.DESTINATIONS.find(d => d.region === region);
    return first ? {
      id: `region-${region}`,
      title: region,
      location: `${window.DESTINATIONS.filter(d => d.region === region).length} destinations`,
      image: first.image,
      rating: 4.5,
      price: first.price,
      tags: ['Region']
    } : {
      id: `region-${region}`,
      title: region,
      location: 'No listings yet',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
      rating: 0,
      price: 0,
      tags: ['Region']
    };
  });
  render(countryCards, gridCountry);

  // Activity panel
  const activityChips = document.getElementById('activityChips');
  const activities = Array.from(new Set(window.DESTINATIONS.flatMap(d => d.tags)));
  activities.forEach(a => { const b = document.createElement('button'); b.className = 'chip'; b.dataset.filter = a; b.textContent = a; activityChips.appendChild(b); });
  const gridActivity = document.getElementById('gridActivity');
  function renderActivity(activity) {
    const list = window.DESTINATIONS.filter(d => d.tags.includes(activity));
    render(list, gridActivity);
  }
  activityChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activityChips.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c === chip));
    renderActivity(chip.dataset.filter);
  });

  // Compare up to 3
  const compareBar = document.getElementById('compareBar');
  const compareTags = document.getElementById('compareTags');
  const selected = new Map();
  function toggleCompare(item) {
    if (selected.has(item.id)) selected.delete(item.id);
    else if (selected.size < 3) selected.set(item.id, item);
    compareTags.innerHTML = '';
    selected.forEach(v => { const span = document.createElement('span'); span.className = 'compare-tag'; span.textContent = v.title; compareTags.appendChild(span); });
    compareBar.classList.toggle('is-visible', selected.size > 0);
  }
  document.getElementById('btnClearCompare').addEventListener('click', () => { selected.clear(); compareTags.innerHTML = ''; compareBar.classList.remove('is-visible'); });

  // Ensure at least 20 destination cards by duplicating with slight variations if needed
  (function ensureMinimumCards(min = 20) {
    const base = window.DESTINATIONS;
    let i = 0;
    while (base.length < min && i < 200) {
      const src = base[i % Math.max(1, base.length)];
      const clone = { ...src };
      clone.id = `${src.id}-x${i + 1}`;
      clone.title = `${src.title} — Special ${i + 1}`;
      clone.price = Math.round(src.price * (0.9 + ((i % 5) * 0.03)));
      clone.rating = Math.max(4.2, Math.min(5, src.rating - 0.1 + ((i % 3) * 0.05)));
      clone.nextStart = src.nextStart;
      base.push(clone);
      i++;
    }
  })();

  // Modal elements and helpers
  const detailsModal = document.getElementById('detailsModal');
  const detailsImg = document.getElementById('detailsImg');
  const detailsTitle = document.getElementById('detailsTitle');
  const detailsLocation = document.getElementById('detailsLocation');
  const detailsDesc = document.getElementById('detailsDesc');
  const detailsRating = document.getElementById('detailsRating');
  const detailsDuration = document.getElementById('detailsDuration');
  const detailsStart = document.getElementById('detailsStart');
  const detailsPrice = document.getElementById('detailsPrice');
  const detailsTags = document.getElementById('detailsTags');
  const btnCheckWeather = document.getElementById('btnCheckWeather');
  const weatherResult = document.getElementById('weatherResult');
  const detailsBookBtn = document.getElementById('detailsBookBtn');

  const bookModal = document.getElementById('bookModal');
  const bookImg = document.getElementById('bookImg');
  const bookSubtitle = document.getElementById('bookSubtitle');
  const bookForm = document.getElementById('bookForm');
  const bookSuccess = document.getElementById('bookSuccess');
  const travelDate = document.getElementById('travelDate');

  let currentItem = null;

  function closeAnyModal(e) {
    const dlg = e.target.closest('.modal');
    if (dlg && typeof dlg.close === 'function') dlg.close();
  }
  document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeAnyModal));

  function openDetailsModal(item) {
    currentItem = item;
    detailsImg.src = item.image;
    detailsImg.alt = item.title;
    detailsTitle.textContent = item.title;
    detailsLocation.textContent = item.location;
    detailsDesc.textContent = item.desc || '';
    detailsRating.textContent = item.rating.toFixed(1);
    detailsDuration.textContent = `${item.durationDays} days`;
    detailsStart.textContent = item.nextStart ?? '—';
    detailsPrice.textContent = formatCurrency(item.price);
    detailsTags.innerHTML = '';
    item.tags.slice(0, 6).forEach(t => { const li = document.createElement('li'); li.textContent = t; detailsTags.appendChild(li); });
    weatherResult.classList.add('hidden');
    btnCheckWeather.disabled = false;
    btnCheckWeather.innerHTML = '<i class="ri-cloudy-line"></i> Check weather';
    detailsBookBtn.onclick = () => { openBookModal(item); };
    if (typeof detailsModal.showModal === 'function') detailsModal.showModal();
  }

  function openBookModal(item) {
    currentItem = item;
    bookImg.src = item.image;
    bookImg.alt = item.title;
    bookSubtitle.textContent = `${item.title} — ${item.location} • From ${formatCurrency(item.price)}`;
    if (travelDate) {
      const today = new Date().toISOString().slice(0, 10);
      travelDate.min = today;
      travelDate.value = item.nextStart ?? today;
    }
    bookSuccess.classList.add('hidden');
    bookForm.classList.remove('hidden');
    if (typeof bookModal.showModal === 'function') bookModal.showModal();
  }

  async function checkWeatherFor(item) {
    try {
      weatherResult.classList.add('hidden');
      btnCheckWeather.disabled = true;
      btnCheckWeather.innerHTML = '<i class="ri-loader-4-line"></i> Loading...';

      // Use Open-Meteo geocoding API to resolve coordinates from location/city
      const query = encodeURIComponent((item.location || item.title).split(',')[0]);
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1`);
      if (!geoRes.ok) throw new Error('Failed to geocode');
      const geo = await geoRes.json();
      if (!geo.results || !geo.results.length) throw new Error('Location not found');

      const { latitude, longitude, name, country } = geo.results[0];
      const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,visibility,uv_index`);
      if (!wRes.ok) throw new Error('Failed to fetch weather');
      const w = await wRes.json();
      const cw = w.current_weather;
      if (!cw) throw new Error('No current weather data');

      // Update weather display
      document.getElementById('weatherLocation').textContent = `${name}, ${country}`;
      document.getElementById('weatherTemp').textContent = `${cw.temperature}°C`;
      document.getElementById('weatherWind').textContent = `${cw.windspeed} km/h`;

      // Get additional weather data from hourly
      const currentHour = new Date().getHours();
      const hourly = w.hourly;
      if (hourly && hourly.time) {
        const hourIndex = hourly.time.findIndex(time => new Date(time).getHours() === currentHour);
        if (hourIndex !== -1) {
          document.getElementById('weatherHumidity').textContent = `${hourly.relative_humidity_2m[hourIndex]}%`;
          document.getElementById('weatherVisibility').textContent = `${(hourly.visibility[hourIndex] / 1000).toFixed(1)} km`;
          document.getElementById('weatherUV').textContent = hourly.uv_index[hourIndex].toFixed(1);
        }
      }

      // Set weather description based on temperature
      let desc = '';
      if (cw.temperature > 25) desc = 'Warm and sunny - perfect for outdoor activities!';
      else if (cw.temperature > 15) desc = 'Pleasant weather - great for exploring!';
      else if (cw.temperature > 5) desc = 'Cool weather - bring a jacket!';
      else desc = 'Cold weather - bundle up for your adventure!';

      document.getElementById('weatherDesc').textContent = desc;
      weatherResult.classList.remove('hidden');

    } catch (err) {
      weatherResult.classList.remove('hidden');
      document.getElementById('weatherLocation').textContent = 'Error';
      document.getElementById('weatherTemp').textContent = '--°C';
      document.getElementById('weatherDesc').textContent = 'Unable to fetch weather data.';
      document.getElementById('weatherWind').textContent = '-- km/h';
      document.getElementById('weatherHumidity').textContent = '--%';
      document.getElementById('weatherVisibility').textContent = '-- km';
      document.getElementById('weatherUV').textContent = '--';
    } finally {
      btnCheckWeather.disabled = false;
      btnCheckWeather.innerHTML = '<i class="ri-cloudy-line"></i> Check weather';
    }
  }

  if (btnCheckWeather) btnCheckWeather.addEventListener('click', () => { if (currentItem) checkWeatherFor(currentItem); });
  if (bookForm) bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(bookForm);
    // Simulate submit
    bookForm.classList.add('hidden');
    bookSuccess.classList.remove('hidden');
    setTimeout(() => { try { bookModal.close(); } catch { } }, 1400);
  });

  // Initial render
  applyFilters();
});


