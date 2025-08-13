document.addEventListener('DOMContentLoaded', () => {
  // Initialize elements
  const reviewForm = document.getElementById('reviewForm');
  const reviewList = document.getElementById('reviewList');
  const revDestination = document.getElementById('revDestination');
  const histogram = document.getElementById('histogram');
  const starRatingContainer = document.getElementById('starRatingContainer');
  const starRatingText = document.getElementById('starRatingText');
  const stars = document.querySelectorAll('.star');
  const videoModal = document.getElementById('videoModal');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoPlayer = document.getElementById('videoPlayer');
  const playButtons = document.querySelectorAll('.play-button');
  const filterButtons = document.querySelectorAll('.filter-button');
  const sortSelect = document.getElementById('sortReviews');
  
  // Sample review data
  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      destinationId: 'dubai',
      destinationName: 'Dubai Adventure',
      rating: 5,
      when: '2023-06',
      text: 'Absolutely amazing experience! The tour guide was knowledgeable and friendly. The itinerary was perfectly balanced with activities and free time. Would highly recommend to anyone looking for an unforgettable adventure.',
      tags: ['Family-friendly', 'Cultural'],
      helpful: 24,
      at: Date.now() - 1000000,
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Michael Chen',
      destinationId: 'bali',
      destinationName: 'Bali Retreat',
      rating: 4,
      when: '2023-08',
      text: 'Great experience overall. Beautiful locations and well-organized tours. The only downside was that some of the accommodations weren\'t as luxurious as advertised, but still comfortable. The local cuisine experiences were the highlight!',
      tags: ['Relaxation', 'Nature'],
      helpful: 18,
      at: Date.now() - 2000000,
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      destinationId: 'paris',
      destinationName: 'Paris Explorer',
      rating: 5,
      when: '2023-07',
      text: 'Paris was everything I dreamed of and more! Our guide Marie was exceptional - her knowledge of art and history made the Louvre and other museums come alive. The evening Seine cruise was magical. Every detail was perfectly arranged.',
      tags: ['Cultural', 'Romantic'],
      helpful: 32,
      at: Date.now() - 3000000,
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'David Wilson',
      destinationId: 'tokyo',
      destinationName: 'Tokyo Discovery',
      rating: 3,
      when: '2023-05',
      text: 'Mixed feelings about this tour. The cultural experiences and food were outstanding, but there were some communication issues with coordination. Some days felt rushed while others had too much free time. The hotel was centrally located which was convenient.',
      tags: ['Adventure', 'Cultural'],
      helpful: 15,
      at: Date.now() - 4000000,
      avatar: 'DW'
    },
    {
      id: 5,
      name: 'Olivia Thompson',
      destinationId: 'rome',
      destinationName: 'Rome Getaway',
      rating: 5,
      when: '2023-09',
      text: 'Rome exceeded all expectations! Our guide Marco was passionate about Roman history and showed us hidden gems we would never have found on our own. The small group size made it personal, and the pace was perfect. The pasta making class was a highlight!',
      tags: ['Food & Wine', 'Historical'],
      helpful: 29,
      at: Date.now() - 1500000,
      avatar: 'OT'
    },
    {
      id: 6,
      name: 'James Lee',
      destinationId: 'egypt',
      destinationName: 'Egypt Explorer',
      rating: 4,
      when: '2023-04',
      text: 'Fascinating journey through ancient Egypt. The pyramids and temples were breathtaking. Our Egyptologist guide was incredibly knowledgeable. The Nile cruise portion was relaxing and beautiful. Only suggestion would be better air conditioning in some of the vehicles.',
      tags: ['Historical', 'Educational'],
      helpful: 22,
      at: Date.now() - 5000000,
      avatar: 'JL'
    }
  ];
  
  // Populate destination dropdown
  window.DESTINATIONS.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = `${d.title} — ${d.location}`;
    revDestination.appendChild(opt);
  });
  
  // Initialize star rating
  let currentRating = 0;
  
  function updateStars(rating) {
    stars.forEach((star, index) => {
      star.classList.toggle('active', index < rating);
    });
  }
  
  function updateRatingText(rating) {
    const texts = [
      '',
      'Poor - Not recommended',
      'Fair - Below expectations',
      'Good - Met expectations',
      'Very Good - Above expectations',
      'Excellent - Highly recommended'
    ];
    starRatingText.textContent = texts[rating];
  }
  
  if (starRatingContainer) {
    stars.forEach((star, index) => {
      const ratingValue = index + 1;
      
      star.addEventListener('mouseover', () => {
        updateStars(ratingValue);
        updateRatingText(ratingValue);
      });
      
      star.addEventListener('mouseleave', () => {
        updateStars(currentRating);
        updateRatingText(currentRating);
      });
      
      star.addEventListener('click', () => {
        currentRating = ratingValue;
        document.getElementById('revRating').value = currentRating;
        updateStars(currentRating);
        updateRatingText(currentRating);
      });
    });
  }
  
  // Render histogram
  function renderHistogram(container, items) {
    const counts = [0, 0, 0, 0, 0];
    items.forEach(r => counts[r.rating - 1]++);
    const total = items.length || 1;
    container.innerHTML = '';
    
    // Calculate average rating
    let sum = 0;
    items.forEach(r => sum += r.rating);
    const average = (sum / total).toFixed(1);
    
    // Create histogram rows
    for (let i = 5; i >= 1; i--) {
      const row = document.createElement('div');
      row.className = 'row';
      
      const label = document.createElement('span');
      label.textContent = i;
      
      const bar = document.createElement('div');
      bar.className = 'bar';
      
      const fill = document.createElement('span');
      fill.style.width = `${Math.round((counts[i - 1] / total) * 100)}%`;
      bar.appendChild(fill);
      
      const count = document.createElement('span');
      count.textContent = counts[i - 1];
      
      row.append(label, bar, count);
      container.appendChild(row);
      
      // Animate the bars after a short delay
      setTimeout(() => {
        fill.style.width = `${Math.round((counts[i - 1] / total) * 100)}%`;
      }, 100 * (5 - i + 1));
    }
    
    // Add summary section with average rating and total reviews
    const summary = document.createElement('div');
    summary.className = 'histogram-summary';
    
    const averageRating = document.createElement('div');
    averageRating.className = 'average-rating';
    
    const averageValue = document.createElement('div');
    averageValue.className = 'average-rating-value';
    averageValue.textContent = average;
    
    const stars = document.createElement('div');
    stars.className = 'average-rating-stars';
    
    // Create stars based on average rating
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('i');
      if (i <= Math.round(average)) {
        star.className = 'ri-star-fill';
      } else if (i - 0.5 <= average) {
        star.className = 'ri-star-half-fill';
      } else {
        star.className = 'ri-star-line';
      }
      stars.appendChild(star);
    }
    
    const totalReviews = document.createElement('div');
    totalReviews.className = 'total-reviews';
    
    const totalValue = document.createElement('div');
    totalValue.className = 'total-reviews-value';
    totalValue.textContent = total;
    
    const totalLabel = document.createElement('div');
    totalLabel.className = 'total-reviews-label';
    totalLabel.textContent = total === 1 ? 'Review' : 'Reviews';
    
    averageRating.appendChild(averageValue);
    averageRating.appendChild(stars);
    
    totalReviews.appendChild(totalValue);
    totalReviews.appendChild(totalLabel);
    
    summary.appendChild(averageRating);
    summary.appendChild(totalReviews);
    
    container.appendChild(summary);
  }
  
  // Render reviews
  function renderReviews(reviewsToRender = reviews) {
    reviewList.innerHTML = '';
    
    if (reviewsToRender.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-reviews';
      emptyMessage.innerHTML = `
        <i class="ri-emotion-sad-line"></i>
        <h3>No reviews found</h3>
        <p>Be the first to share your experience!</p>
      `;
      reviewList.appendChild(emptyMessage);
      return;
    }
    
    reviewsToRender.forEach((review, index) => {
      const reviewElement = document.createElement('div');
      reviewElement.className = 'review';
      reviewElement.setAttribute('data-rating', review.rating);
      reviewElement.setAttribute('data-id', review.id);
      reviewElement.style.animationDelay = `${index * 0.1}s`;
      
      // Create rating stars HTML
      let starsHTML = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= review.rating) {
          starsHTML += '<i class="ri-star-fill"></i>';
        } else {
          starsHTML += '<i class="ri-star-line"></i>';
        }
      }
      
      // Format date
      const formattedDate = review.when ? new Date(review.when).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Not specified';
      
      // Create tags HTML
      let tagsHTML = '';
      if (review.tags && review.tags.length > 0) {
        review.tags.forEach(tag => {
          tagsHTML += `<span class="review-tag">${tag}</span>`;
        });
      }
      
      reviewElement.innerHTML = `
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">${review.avatar || review.name.charAt(0)}</div>
            <div>
              <div class="reviewer-name">${review.name}</div>
              <div class="review-destination">
                <i class="ri-map-pin-line"></i> ${review.destinationName}
              </div>
            </div>
          </div>
          <div class="review-rating">
            <div class="rating-stars">${starsHTML}</div>
            <div class="review-date">${formattedDate}</div>
          </div>
        </div>
        <div class="review-content">${review.text}</div>
        <div class="review-footer">
          <div class="review-tags">${tagsHTML}</div>
          <div class="review-actions">
            <div class="review-action" data-action="helpful" data-id="${review.id}">
              <i class="ri-thumb-up-line"></i> Helpful (${review.helpful || 0})
            </div>
            <div class="review-action" data-action="share" data-id="${review.id}">
              <i class="ri-share-line"></i> Share
            </div>
          </div>
        </div>
      `;
      
      reviewList.appendChild(reviewElement);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.review-action[data-action="helpful"]').forEach(button => {
      button.addEventListener('click', function() {
        const reviewId = parseInt(this.getAttribute('data-id'));
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);
        
        if (reviewIndex !== -1) {
          reviews[reviewIndex].helpful = (reviews[reviewIndex].helpful || 0) + 1;
          this.innerHTML = `<i class="ri-thumb-up-fill"></i> Helpful (${reviews[reviewIndex].helpful})`;
          this.classList.add('active');
          this.style.pointerEvents = 'none';
        }
      });
    });
    
    document.querySelectorAll('.review-action[data-action="share"]').forEach(button => {
      button.addEventListener('click', function() {
        const reviewId = parseInt(this.getAttribute('data-id'));
        alert('Share functionality would be implemented here. This would typically open a share dialog for social media platforms.');
      });
    });
  }
  
  // Filter reviews
  function filterReviews(rating = 0) {
    if (rating === 0) {
      renderReviews();
    } else {
      const filtered = reviews.filter(review => review.rating === rating);
      renderReviews(filtered);
    }
  }
  
  // Sort reviews
  function sortReviews(sortBy = 'newest') {
    let sorted = [...reviews];
    
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => b.at - a.at);
        break;
      case 'oldest':
        sorted.sort((a, b) => a.at - b.at);
        break;
      case 'highest':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        sorted.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
    }
    
    renderReviews(sorted);
  }
  
  // Initialize filter buttons
  if (filterButtons) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const rating = parseInt(this.getAttribute('data-rating') || 0);
        
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        filterReviews(rating);
      });
    });
  }
  
  // Initialize sort select
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      sortReviews(this.value);
    });
  }
  
  // Handle form submission
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('revName').value.trim();
      const destinationId = revDestination.value;
      const destinationName = revDestination.options[revDestination.selectedIndex].text;
      const rating = Number(document.getElementById('revRating').value);
      const when = document.getElementById('revWhen').value;
      const text = document.getElementById('revText').value.trim();
      
      if (!name || !destinationId || !text) {
        showFormError('Please fill out all required fields');
        return;
      }
      
      // Create new review
      const newReview = {
        id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
        name,
        destinationId,
        destinationName,
        rating,
        when,
        text,
        helpful: 0,
        at: Date.now(),
        avatar: name.charAt(0) + (name.split(' ')[1] ? name.split(' ')[1].charAt(0) : '')
      };
      
      // Add to reviews array
      reviews.unshift(newReview);
      
      // Re-render reviews and histogram
      renderReviews();
      renderHistogram(histogram, reviews);
      
      // Show success message
      showFormSuccess('Your review has been submitted successfully!');
      
      // Reset form
      reviewForm.reset();
      currentRating = 0;
      updateStars(currentRating);
      updateRatingText(currentRating);
    });
  }
  
  // Video modal functionality
  if (playButtons.length > 0 && videoModal) {
    playButtons.forEach(button => {
      button.addEventListener('click', function() {
        const videoSrc = this.getAttribute('data-video-src');
        if (videoSrc && videoPlayer) {
          videoPlayer.src = videoSrc;
          videoModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    
    if (videoModalClose) {
      videoModalClose.addEventListener('click', function() {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        if (videoPlayer) {
          videoPlayer.pause();
        }
      });
    }
    
    // Close modal when clicking outside content
    videoModal.addEventListener('click', function(e) {
      if (e.target === videoModal) {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        if (videoPlayer) {
          videoPlayer.pause();
        }
      }
    });
  }
  
  // Form validation helpers
  function showFormError(message) {
    const errorElement = document.getElementById('formError');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      errorElement.classList.add('shake');
      
      setTimeout(() => {
        errorElement.classList.remove('shake');
      }, 500);
    }
  }
  
  function showFormSuccess(message) {
    const successElement = document.getElementById('formSuccess');
    if (successElement) {
      successElement.textContent = message;
      successElement.style.display = 'block';
      
      setTimeout(() => {
        successElement.style.display = 'none';
      }, 5000);
    }
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Scroll animations
  function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 100) {
        element.classList.add('animated');
      }
    });
  }
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Initial check
  
  // Initialize the page
  renderHistogram(histogram, reviews);
  renderReviews();
});