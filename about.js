document.addEventListener('DOMContentLoaded', () => {
  // Animated counters for achievements when in view
  const achievementCounters = document.querySelectorAll('.achievement-number');
  const achievementIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.count || '0');
      const start = 0;
      const duration = 2000;
      const t0 = performance.now();
      
      function tick(t) {
        const p = Math.min(1, (t - t0) / duration);
        const val = Math.floor(start + (end - start) * (1 - Math.pow(1 - p, 3)));
        el.textContent = val.toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      achievementIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  
  achievementCounters.forEach(c => achievementIO.observe(c));

  // Animated counters for hero stats
  const heroStats = document.querySelectorAll('.stat-number');
  const heroStatsIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      const end = parseInt(text.replace(/[^\d]/g, ''));
      const start = 0;
      const duration = 1500;
      const t0 = performance.now();
      
      function tick(t) {
        const p = Math.min(1, (t - t0) / duration);
        const val = Math.floor(start + (end - start) * (1 - Math.pow(1 - p, 3)));
        el.textContent = text.replace(/\d+/, val.toLocaleString());
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      heroStatsIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  
  heroStats.forEach(stat => heroStatsIO.observe(stat));

  // Smooth reveal animations for timeline items
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }
    });
  }, { threshold: 0.3 });
  
  timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
    timelineIO.observe(item);
  });

  // Smooth reveal animations for value cards
  const valueCards = document.querySelectorAll('.value-card');
  const valueCardsIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.2 });
  
  valueCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    valueCardsIO.observe(card);
  });

  // Smooth reveal animations for team members
  const teamMembers = document.querySelectorAll('.team-member');
  const teamMembersIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.3 });
  
  teamMembers.forEach((member, index) => {
    member.style.opacity = '0';
    member.style.transform = 'translateY(40px)';
    member.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
    teamMembersIO.observe(member);
  });

  // Smooth reveal animations for testimonial cards
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialCardsIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.3 });
  
  testimonialCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
    testimonialCardsIO.observe(card);
  });

  // Parallax effect for hero image
  const heroImage = document.querySelector('.about-hero-image');
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      heroImage.style.transform = `translateY(${rate}px)`;
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add hover effects for social links
  document.querySelectorAll('.member-social a').forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1) rotate(0deg)';
    });
  });

  // Add click handlers for CTA buttons
  document.querySelectorAll('.cta-buttons .btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Add a small delay for visual feedback
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });

  // Initialize year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});


