/* =====================================================
   script.js — Amazon Finds India Landing Page
   Mobile-Optimized Version
   ===================================================== */

(function () {
  'use strict';

  /* ---------- MOBILE DETECTION ---------- */
  const isMobile = () => window.innerWidth <= 768;
  const isSmallMobile = () => window.innerWidth <= 600;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- NAVBAR SCROLL EFFECT ---------- */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ---------- MOBILE NAV TOGGLE ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Helper function to close menu
  const closeMenu = () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  };

  // Helper function to open menu
  const openMenu = () => {
    navLinks.classList.add('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  };

  // Toggle menu on button click
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  });

  // Close menu on outside click (but not on navbar)
  document.addEventListener('click', (e) => {
    const isClickInsideNav = navbar.contains(e.target);
    if (!isClickInsideNav && navLinks.classList.contains('open')) {
      closeMenu();
    }
  }, true);

  /* ---------- SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- SCROLL TO TOP ---------- */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- INTERSECTION OBSERVER (FADE IN) ---------- */
  const fadeElements = document.querySelectorAll(
    '.product-card, .cat-card, .trust-card, .section-header, .hero-content, .hero-image-wrap'
  );

  fadeElements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Reduced stagger delay on mobile for faster loading perception
          const siblings = Array.from(entry.target.parentElement.children);
          const index = siblings.indexOf(entry.target);
          const delay = isMobile() ? index * 40 : index * 80;
          
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, prefersReducedMotion ? 0 : delay);
          
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeElements.forEach(el => observer.observe(el));

  /* ---------- STICKY CTA HIDE ON FOOTER ---------- */
  const stickyCta = document.getElementById('stickyCta');
  const footer = document.querySelector('.footer');

  if (stickyCta && footer) {
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        stickyCta.style.opacity = entry.isIntersecting ? '0' : '';
        stickyCta.style.pointerEvents = entry.isIntersecting ? 'none' : '';
      },
      { threshold: 0.1 }
    );
    footerObserver.observe(footer);
  }

  /* ---------- AMAZON BUTTON CLICK TRACKING ---------- */
  document.querySelectorAll('.btn-amazon').forEach(btn => {
    btn.addEventListener('click', function () {
      // Visual feedback on click (reduced duration on mobile)
      const original = this.innerHTML;
      this.innerHTML = '✓ Opening Amazon...';
      this.style.background = '#3D7A5C';
      this.style.color = '#fff';
      const duration = isMobile() ? 1200 : 1800;
      setTimeout(() => {
        this.innerHTML = original;
        this.style.background = '';
        this.style.color = '';
      }, duration);
    });
  });

  /* ---------- CATEGORY CARD ACTIVE STATE ---------- */
  const catCards = document.querySelectorAll('.cat-card');
  const sections = ['outfits', 'study', 'desk', 'gadgets'];

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const catId = 'cat-' + id;
          catCards.forEach(c => c.style.outline = '');
          const activeCard = document.getElementById(catId);
          if (activeCard) {
            activeCard.style.outline = '2px solid var(--accent)';
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  /* ---------- LAZY IMAGE POLYFILL (NATIVE FALLBACK) ---------- */
  if ('loading' in HTMLImageElement.prototype === false) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.src = entry.target.dataset.src || entry.target.src;
          imgObserver.unobserve(entry.target);
        }
      });
    });
    lazyImgs.forEach(img => imgObserver.observe(img));
  }

  /* ---------- HERO PARALLAX (SUBTLE - DISABLED ON MOBILE) ---------- */
  if (!isMobile() && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const hero = document.querySelector('.hero-img-card img');
      if (!hero) return;
      const scrolled = window.scrollY;
      if (scrolled < 600) {
        hero.style.transform = `scale(1) translateY(${scrolled * 0.04}px)`;
      }
    }, { passive: true });
  }

})();
