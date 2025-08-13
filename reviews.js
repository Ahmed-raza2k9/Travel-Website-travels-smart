function renderHistogram(container, items) {
  const counts = [0,0,0,0,0];
  items.forEach(r => counts[r.rating-1]++);
  const total = items.length || 1;
  container.innerHTML = '';
  for (let i = 5; i >= 1; i--) {
    const row = document.createElement('div'); row.className = 'row';
    const label = document.createElement('span'); label.textContent = i;
    const bar = document.createElement('div'); bar.className = 'bar';
    const fill = document.createElement('span'); fill.style.width = `${Math.round((counts[i-1]/total)*100)}%`; bar.appendChild(fill);
    const count = document.createElement('span'); count.textContent = counts[i-1];
    row.append(label, bar, count); container.appendChild(row);
  }
}

function updateStarDisplay(rating) {
  const starDisplay = document.getElementById('starDisplay');
  const starIcons = document.getElementById('starIcons');
  if (starDisplay) {
    starDisplay.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const icon = document.createElement('i');
      icon.className = i <= rating ? 'ri-star-fill' : 'ri-star-line';
      starDisplay.appendChild(icon);
    }
  }
  if (starIcons) {
    starIcons.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const icon = document.createElement('i');
      icon.className = i <= rating ? 'ri-star-fill' : 'ri-star-line';
      starIcons.appendChild(icon);
    }
  }
}

function renderFeaturedDestinations() {
  const container = document.getElementById('featuredDestinations');
  if (!container) return;
  
  // Sort destinations by rating (highest first)
  const topDestinations = [...window.DESTINATIONS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3); // Get top 3
  
  container.innerHTML = '';
  topDestinations.forEach((dest, index) => {
    const card = document.createElement('div');
    card.className = 'featured-card animate-on-scroll';
    card.style.animationDelay = `${index * 0.2}s`;
    
    const stars = Array(5).fill('').map((_, i) => 
      i < Math.floor(dest.rating) ? '<i class="ri-star-fill"></i>' : 
      i === Math.floor(dest.rating) && dest.rating % 1 > 0 ? '<i class="ri-star-half-fill"></i>' : 
      '<i class="ri-star-line"></i>'
    ).join('');
    
    card.innerHTML = `
      <img src="${dest.image}" alt="${dest.title}" />
      <div class="featured-card-content">
        <h3>${dest.title}</h3>
        <div class="featured-card-rating">
          ${stars}
          <span>${dest.rating.toFixed(1)}</span>
        </div>
        <p>${dest.desc}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function initScrollAnimation() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  function checkScroll() {
    animatedElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 150;
      if (elementTop < window.innerHeight - elementVisible) {
        el.classList.add('visible');
      }
    });
  }
  
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Check on initial load
}

document.addEventListener('DOMContentLoaded', () => {
  const reviewForm = document.getElementById('reviewForm');
  const reviewList = document.getElementById('reviewList');
  const revDestination = document.getElementById('revDestination');
  const revRating = document.getElementById('revRating');
  const histogram = document.getElementById('histogram');

  window.DESTINATIONS.forEach(d => { const opt = document.createElement('option'); opt.value = d.id; opt.textContent = `${d.title} — ${d.location}`; revDestination.appendChild(opt); });
  const reviews = [];

  function renderReviews() {
    reviewList.innerHTML = '';
    reviews.forEach(r => {
      const div = document.createElement('div'); div.className = 'review animate-on-scroll';
      const title = window.DESTINATIONS.find(d => d.id === r.destinationId)?.title || 'Trip';
      const stars = Array(5).fill('').map((_, i) => 
        i < r.rating ? '<i class="ri-star-fill"></i>' : '<i class="ri-star-line"></i>'
      ).join('');
      
      div.innerHTML = `
        <strong>${r.name}</strong> rated <strong>${title}</strong>
        <div class="review-rating">${stars} <span>${r.rating}/5</span></div>
        <span class="meta">• ${r.when || '—'}</span>
        <p class="muted">${r.text}</p>
      `;
      reviewList.appendChild(div);
    });
    renderHistogram(histogram, reviews);
  }

  // Initialize with some sample reviews
  const sampleReviews = [
    { name: "John D.", destinationId: "banff", rating: 5, when: "2023-06", text: "Absolutely breathtaking views! The hiking trails were well-maintained and the lakes were even more beautiful in person.", at: Date.now() - 1000000 },
    { name: "Maria S.", destinationId: "capri-italy", rating: 4, when: "2023-08", text: "The Blue Grotto was magical! Only giving 4 stars because some restaurants were overpriced, but overall an amazing experience.", at: Date.now() - 2000000 },
    { name: "Alex T.", destinationId: "banff", rating: 5, when: "2023-07", text: "Best family vacation we've ever had. The kids loved the wildlife and the scenery was picture-perfect.", at: Date.now() - 3000000 }
  ];
  reviews.push(...sampleReviews);
  renderReviews();

  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('revName').value.trim();
    const destinationId = revDestination.value;
    const rating = Number(document.getElementById('revRating').value);
    const when = document.getElementById('revWhen').value;
    const text = document.getElementById('revText').value.trim();
    if (!name || !destinationId || !text) return;
    reviews.unshift({ name, destinationId, rating, when, text, at: Date.now() });
    renderReviews();
    reviewForm.reset();
    updateStarDisplay(3); // Reset to default
  });

  // Star rating functionality
  if (revRating) {
    revRating.addEventListener('change', () => {
      updateStarDisplay(Number(revRating.value));
    });
    updateStarDisplay(Number(revRating.value)); // Initialize
  }

  const starLabel = document.getElementById('starLabel');
  const starRange = document.getElementById('starRange');
  const starBtn = document.getElementById('starBtn');
  if (starRange) {
    starRange.addEventListener('input', () => {
      const rating = Number(starRange.value);
      starLabel.textContent = `Rate: ${rating}`;
      updateStarDisplay(rating);
    });
  }
  if (starBtn) {
    starBtn.addEventListener('click', () => {
      const rating = Number(starRange.value);
      starLabel.textContent = `Rating set to ${rating}`;
    });
  }

  // Initialize featured destinations
  renderFeaturedDestinations();
  
  // Initialize scroll animations
  initScrollAnimation();
});



