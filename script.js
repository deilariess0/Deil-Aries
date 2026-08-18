// ===== THEME TOGGLE (FIXED FOR TAILWIND DARK MODE) =====
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement; // Target the <html> tag, not the body

// 1. Check for saved preference in localStorage
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  htmlElement.classList.add('dark');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Show sun icon in dark mode
} else if (savedTheme === 'light') {
  htmlElement.classList.remove('dark');
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Show moon icon in light mode
} else {
  // If no preference, check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    htmlElement.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

// 2. Toggle on button click
themeToggle.addEventListener('click', () => {
  if (htmlElement.classList.contains('dark')) {
    // Switch to Light Mode
    htmlElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; 
  } else {
    // Switch to Dark Mode
    htmlElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
});

// ===== SMOOTH SCROLL FOR INTERNAL LINKS (No pop/pulse) =====
document.querySelectorAll('a[href*="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Only run for internal links starting with #
    if (!href || !href.startsWith('#')) return;

    // Prevent the default instant jump
    e.preventDefault(); 

    // Find the target element
    const targetElement = document.querySelector(href);
    if (targetElement) {
      // Smoothly scroll to it
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== HAMBURGER MENU (FIXED) =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  // Toggle the "open" class on the hamburger button itself (for the CSS animation)
  hamburger.classList.toggle('open');
  
  // Toggle the "open" class on the menu list
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    // When a link is clicked, close the menu and remove the X animation
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 80;
    if (window.scrollY >= top) current = section.id;
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');

function handleScroll() {
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  // Safety check so the nav update doesn't break if sections are missing
  if (sections.length > 0 && links.length > 0) {
    updateActiveLink();
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ===== INTERSECTION OBSERVER (fade-in) =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.skill-card, .timeline-card, .project-card, .cert-card, .about-text, .contact-form, .contact-info')
  .forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('✅ Message sent! I\'ll get back to you soon.');
    contactForm.reset();
  });
}

function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================
// ===== PROJECTS CAROUSEL SLIDER =====
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  const slider = document.getElementById('projectSlider');
  const prevBtn = document.getElementById('prevProject');
  const nextBtn = document.getElementById('nextProject');
  const dotsContainer = document.getElementById('projectDots');

  // Safety check: only run if the slider exists on the page
  if (slider && prevBtn && nextBtn && dotsContainer) {
    const slides = slider.querySelectorAll('.min-w-full');
    let currentIndex = 0;
    const totalSlides = slides.length;

    // Create Pagination Dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-purple-light w-6' : 'bg-border hover:bg-purple-light/50'}`;
      dot.dataset.index = i;
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('button');

    function updateDots(index) {
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.className = 'w-6 h-2.5 rounded-full bg-purple-light transition-all duration-300';
        } else {
          dot.className = 'w-2.5 h-2.5 rounded-full bg-border hover:bg-purple-light/50 transition-all duration-300';
        }
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      const offset = currentIndex * 100; // 1 card = 100% width
      slider.style.transform = `translateX(-${offset}%)`;
      updateDots(currentIndex);
    }

    function nextSlide() {
      if (currentIndex >= totalSlides - 1) {
        goToSlide(0);
      } else {
        goToSlide(currentIndex + 1);
      }
    }

    function prevSlide() {
      if (currentIndex <= 0) {
        goToSlide(totalSlides - 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Touch/Swipe support for mobile
    let startX = 0;
    let isDragging = false;

    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    slider.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      isDragging = false;
    });

    // Auto-play: Only starts on screens wider than 768px (desktop)
    let autoSlide;
    if (window.innerWidth > 768) {
      autoSlide = setInterval(nextSlide, 5000);
    }

    // Pause auto-play on hover (only if autoSlide exists)
    const sliderWrapper = document.querySelector('#projects .relative.overflow-hidden');
    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseenter', () => {
        if (autoSlide) clearInterval(autoSlide);
      });
      sliderWrapper.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
          autoSlide = setInterval(nextSlide, 5000);
        }
      });
    }
    
    // Handle window resize to stop/start autoplay
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        if (autoSlide) { clearInterval(autoSlide); autoSlide = null; }
      } else {
        if (!autoSlide) { autoSlide = setInterval(nextSlide, 5000); }
      }
    });
  }
});
