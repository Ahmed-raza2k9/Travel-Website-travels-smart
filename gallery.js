// Gallery page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS animations
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });

  // Initialize lightGallery
  const galleryElement = document.getElementById('lightgallery');
  if (galleryElement) {
    lightGallery(galleryElement, {
      selector: '.gallery-item',
      plugins: [lgZoom, lgThumbnail],
      speed: 500,
      download: false,
      counter: true,
      enableDrag: true,
      enableSwipe: true,
      closeOnTap: true,
      mode: 'lg-fade',
      thumbnail: true,
      animateThumb: true,
      zoomFromOrigin: true
    });
  }

  // Filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const searchInput = document.getElementById('gallerySearch');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  
  // Set initial visible items count
  let visibleItems = 12;
  const itemsIncrement = 6;
  
  // Initial display
  updateGalleryDisplay();
  
  // Filter button click handler
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Reset visible items count when changing filters
      visibleItems = 12;
      
      // Update gallery display
      updateGalleryDisplay();
    });
  });
  
  // Search input handler
  searchInput.addEventListener('input', () => {
    // Reset visible items count when searching
    visibleItems = 12;
    updateGalleryDisplay();
  });
  
  // Load more button handler
  loadMoreBtn.addEventListener('click', () => {
    visibleItems += itemsIncrement;
    updateGalleryDisplay();
    
    // Add a subtle animation to newly visible items
    const items = document.querySelectorAll('.gallery-item');
    items.forEach((item, index) => {
      if (index >= visibleItems - itemsIncrement && index < visibleItems) {
        item.classList.add('fade-in');
        setTimeout(() => {
          item.classList.remove('fade-in');
        }, 500);
      }
    });
  });
  
  // Upload button handler
  const uploadBtn = document.querySelector('.upload-btn');
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      alert('Photo upload feature coming soon! Stay tuned for updates.');
    });
  }
  
  // Function to update gallery display based on filters and search
  function updateGalleryDisplay() {
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    const searchTerm = searchInput.value.toLowerCase();
    
    let visibleCount = 0;
    let totalMatchingItems = 0;
    
    galleryItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const title = item.querySelector('h3').textContent.toLowerCase();
      const description = item.getAttribute('data-sub-html')?.toLowerCase() || '';
      
      // Check if item matches both filter and search criteria
      const matchesFilter = activeFilter === 'all' || category === activeFilter;
      const matchesSearch = searchTerm === '' || 
                           title.includes(searchTerm) || 
                           description.includes(searchTerm);
      
      const matches = matchesFilter && matchesSearch;
      
      // Count total matching items for load more button visibility
      if (matches) {
        totalMatchingItems++;
      }
      
      // Show/hide based on matches and visible items count
      if (matches && visibleCount < visibleItems) {
        item.style.display = 'block';
        // Add a subtle animation when items appear
        item.classList.add('item-visible');
        setTimeout(() => {
          item.classList.remove('item-visible');
        }, 300);
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });
    
    // Show/hide load more button
    if (totalMatchingItems <= visibleItems) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-flex';
    }
    
    // Show message if no results
    const noResultsMessage = document.getElementById('noResultsMessage');
    if (totalMatchingItems === 0) {
      if (!noResultsMessage) {
        const message = document.createElement('div');
        message.id = 'noResultsMessage';
        message.className = 'no-results';
        message.innerHTML = `<p>No images found matching "${searchTerm}". Try a different search term.</p>`;
        galleryElement.parentNode.insertBefore(message, galleryElement.nextSibling);
      }
    } else if (noResultsMessage) {
      noResultsMessage.remove();
    }
    
    // Display a message showing which filter is active
    const filterMessage = document.getElementById('filterMessage');
    if (!filterMessage) {
      const message = document.createElement('div');
      message.id = 'filterMessage';
      message.className = 'filter-message';
      document.querySelector('.gallery-filters').appendChild(message);
    }
    
    const filterName = activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);
    document.getElementById('filterMessage').textContent = filterName === 'All' ? 
      `Showing all categories (${totalMatchingItems} items)` : 
      `Showing ${filterName} category (${totalMatchingItems} items)`;
  }
  
  // Add masonry layout effect with different heights
  const items = document.querySelectorAll('.gallery-item');
  items.forEach((item, index) => {
    // Create varied heights for masonry effect
    if (index % 3 === 0) {
      item.style.gridRow = 'span 2';
    } else if (index % 5 === 0) {
      item.style.gridRow = 'span 1.5';
    }
  });
});