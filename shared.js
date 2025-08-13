// Shared utilities across pages (theme, nav, footer year)
const THEME_KEY = 'travelsmart-theme';

function getStoredTheme() { try { return localStorage.getItem(THEME_KEY); } catch { return null; } }
function setStoredTheme(theme) { try { localStorage.setItem(THEME_KEY, theme); } catch {} }
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light') root.setAttribute('data-theme', 'light');
  else root.removeAttribute('data-theme');
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(getStoredTheme() ?? (prefersDark ? 'dark' : 'light'));

  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  function refreshThemeIcon() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (themeIcon) themeIcon.className = isLight ? 'ri-moon-line' : 'ri-sun-line';
    themeToggle?.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  }
  refreshThemeIcon();
  themeToggle?.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    setStoredTheme(next);
    refreshThemeIcon();
  });
  
  // Create menu backdrop
  const menuBackdrop = document.createElement('div');
  menuBackdrop.className = 'menu-backdrop';
  document.body.appendChild(menuBackdrop);

  // Mobile nav
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  
  // Toggle mobile menu
  navToggle?.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    
    // Toggle backdrop and prevent scrolling when menu is open
    menuBackdrop.classList.toggle('is-active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  
  // Close menu when clicking on backdrop
  menuBackdrop.addEventListener('click', () => {
    primaryNav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    menuBackdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  });
  
  // Close menu when clicking a link
  primaryNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    primaryNav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    menuBackdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }));
  
  // Set active class for current page
  if (primaryNav) {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    primaryNav.querySelectorAll('a').forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath === currentPage || 
          (currentPage === 'index.html' && linkPath === '#top')) {
        link.classList.add('active');
      }
    });
  }

  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});


