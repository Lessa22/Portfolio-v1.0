
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Ferme le menu mobile en cliquant un lien
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active link au scroll
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.classList.remove('active-link');
    if (a.getAttribute('href') === `#${current}`) {
      a.classList.add('active-link');
    }
  });
});

// ============================================================
// 2. TYPEWRITER — animation texte hero
// ============================================================
const phrases = [
  'Développeur Full Stack',
  'Développeur React',
  'Développeur Node.js',
  'Amoureux du Clean Code',
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
const typeEl    = document.getElementById('typewriter');

function type() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typeEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typeEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(type, delay);
}

type();

// ============================================================
// 3. PHOTO — affichage avec fallback initiales
// ============================================================
const photo        = document.getElementById('profilePhoto');
const fallback     = document.getElementById('imageFallback');

if (photo) {
  photo.addEventListener('load', () => {
    photo.classList.add('loaded');
    if (fallback) fallback.style.display = 'none';
  });
  photo.addEventListener('error', () => {
    // Si photo.jpg absent → affiche les initiales
    photo.style.display = 'none';
    if (fallback) fallback.style.display = 'flex';
  });
  // Déclenche l'erreur si la source est absente
  if (!photo.complete || photo.naturalWidth === 0) {
    photo.dispatchEvent(new Event('error'));
  }
}

// ============================================================
// 4. INTERSECTION OBSERVER — animations entrée
// ============================================================
const fadeEls = document.querySelectorAll(
  '.project-card, .skill-category, .about-grid, .contact-grid, .stat, .tag'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach(el => observer.observe(el));

// ============================================================
// 5. SKILL BARS — animation au scroll
// ============================================================
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
        skillObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.3 }
);

skillFills.forEach(fill => skillObserver.observe(fill));

// ============================================================
// 6. PROJECTS FILTER
// ============================================================
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    // Active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show / hide cards
    projectCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.classList.remove('hidden');
        // Re-trigger fade animation
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ============================================================
// 7. CONTACT FORM — validation + simulation envoi
// ============================================================
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(fieldId, msg) {
  const el = document.getElementById(fieldId + 'Error');
  if (el) el.textContent = msg;
}
function clearError(fieldId) {
  const el = document.getElementById(fieldId + 'Error');
  if (el) el.textContent = '';
}

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  let valid = true;

  clearError('name');
  clearError('email');
  clearError('message');

  if (!name) {
    showError('name', '← Votre nom est requis');
    valid = false;
  }
  if (!email || !validateEmail(email)) {
    showError('email', '← Email invalide');
    valid = false;
  }
  if (!message) {
    showError('message', '← Écrivez votre message');
    valid = false;
  }

  if (!valid) return;

  // Simulation envoi (remplacer par votre API / EmailJS / Formspree)
  submitBtn.textContent = 'Envoi en cours...';
  submitBtn.disabled = true;

  await new Promise(resolve => setTimeout(resolve, 1500));

  submitBtn.textContent = 'Envoyer le message →';
  submitBtn.disabled = false;
  contactForm.reset();
  formSuccess.style.display = 'block';

  setTimeout(() => {
    formSuccess.style.display = 'none';
  }, 5000);
});

// ============================================================
// 8. SMOOTH REVEAL — hero animation au chargement
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const heroText = document.querySelector('.hero-text');
  const heroImg  = document.querySelector('.hero-image');

  if (heroText) {
    heroText.style.opacity = '0';
    heroText.style.transform = 'translateY(20px)';
    heroText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    setTimeout(() => {
      heroText.style.opacity = '1';
      heroText.style.transform = 'translateY(0)';
    }, 200);
  }

  if (heroImg) {
    heroImg.style.opacity = '0';
    heroImg.style.transform = 'translateY(20px)';
    heroImg.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';
    setTimeout(() => {
      heroImg.style.opacity = '1';
      heroImg.style.transform = 'translateY(0)';
    }, 500);
  }
});

// ============================================================
// 9. EASTER EGG CONSOLE
// ============================================================
console.log(
  `%c
  ╔════════════════════════════════════════╗
  ║  👋  Bonjour, curieux !                ║
  ║  Mon portfolio est open source.        ║
  ║  github.com/votrepseudo/portfolio      ║
  ╚════════════════════════════════════════╝
  `,
  'color: #39ff8a; font-family: monospace; font-size: 12px;'
);