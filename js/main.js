/* ===================================================================
   AFREEN FATIMA — Main JavaScript
   Navigation, Scroll Animations, Portfolio Filters, Lightbox, Form
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ───────────────────── Sticky Header ─────────────────────
  const header = document.querySelector('.header');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // ───────────────────── Mobile Navigation ─────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';

      // Force dark hamburger when menu is open
      if (mobileNav.classList.contains('active')) {
        hamburger.querySelectorAll('span').forEach(span => {
          span.style.backgroundColor = 'var(--color-espresso)';
        });
      } else {
        hamburger.querySelectorAll('span').forEach(span => {
          span.style.backgroundColor = '';
        });
      }
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
        hamburger.querySelectorAll('span').forEach(span => {
          span.style.backgroundColor = '';
        });
      });
    });
  }

  // ───────────────────── Scroll Reveal Animations ─────────────────────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ───────────────────── Portfolio Filters ─────────────────────
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;

        galleryItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = '';
              requestAnimationFrame(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              });
            }, 150);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // ───────────────────── Lightbox ─────────────────────
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = document.querySelector('.lightbox__image');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxPrev = document.querySelector('.lightbox__nav--prev');
  const lightboxNext = document.querySelector('.lightbox__nav--next');
  let currentLightboxIndex = 0;
  let lightboxImages = [];

  // Collect all gallery images for lightbox
  const galleryImgs = document.querySelectorAll('.gallery-item img, .lightbox-trigger img');

  if (lightbox && galleryImgs.length > 0) {
    galleryImgs.forEach((img, index) => {
      lightboxImages.push(img.src);

      img.closest('.gallery-item, .lightbox-trigger').addEventListener('click', () => {
        currentLightboxIndex = index;
        openLightbox(img.src);
      });
    });

    function openLightbox(src) {
      lightboxImage.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        lightboxImage.src = lightboxImages[currentLightboxIndex];
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
        lightboxImage.src = lightboxImages[currentLightboxIndex];
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
      if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
    });
  }

  // ───────────────────── Form Validation ─────────────────────
  const bookingForm = document.getElementById('booking-form');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = bookingForm.querySelector('#name');
      const email = bookingForm.querySelector('#email');
      const service = bookingForm.querySelector('#service');
      const message = bookingForm.querySelector('#message');
      let isValid = true;

      // Reset borders
      bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '';
      });

      // Validate name
      if (!name.value.trim()) {
        name.style.borderColor = '#c57070';
        isValid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value)) {
        email.style.borderColor = '#c57070';
        isValid = false;
      }

      // Validate service
      if (!service.value) {
        service.style.borderColor = '#c57070';
        isValid = false;
      }

      if (isValid) {
        // Show success message
        const successMsg = document.querySelector('.form-message');
        if (successMsg) {
          successMsg.className = 'form-message form-message--success';
          successMsg.textContent = 'Thank you for your inquiry! I\'ll get back to you within 24–48 hours.';
          successMsg.style.display = 'block';
        }

        bookingForm.reset();

        // In production, this would submit to Formspree or similar
        // bookingForm.submit();
      } else {
        const errorMsg = document.querySelector('.form-message');
        if (errorMsg) {
          errorMsg.className = 'form-message form-message--error';
          errorMsg.textContent = 'Please fill in all required fields.';
          errorMsg.style.display = 'block';
        }
      }
    });
  }

  // ───────────────────── Smooth Scroll for Anchor Links ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 20;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ───────────────────── Gallery Item Transitions ─────────────────────
  galleryItems.forEach(item => {
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });

});
