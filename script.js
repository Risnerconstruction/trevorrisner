const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
  }));
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('project-form');
if (form) {
  const submitButton = form.querySelector('.button-submit');
  const submitLabel = form.querySelector('.submit-label');
  const successMessage = form.querySelector('.form-success');
  const errorMessage = form.querySelector('.form-error');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    successMessage.hidden = true;
    errorMessage.hidden = true;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Invisible honeypot field for basic bot filtering.
    if (form.elements['_honey'] && form.elements['_honey'].value) return;

    submitButton.disabled = true;
    submitLabel.textContent = 'Sending…';

    try {
      const response = await fetch('https://formsubmit.co/ajax/trisnerconstruction@gmail.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error('Form submission failed');
      }

      form.reset();
      successMessage.hidden = false;
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      console.error(error);
      errorMessage.hidden = false;
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = 'Send Project Details';
    }
  });
}

// Gallery lightbox
const galleryLightbox = document.getElementById('gallery-lightbox');
if (galleryLightbox) {
  const lightboxImage = galleryLightbox.querySelector('img');
  const closeGallery = () => {
    galleryLightbox.classList.remove('open');
    galleryLightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.gallery-open').forEach((button) => {
    button.addEventListener('click', () => {
      const img = button.querySelector('img');
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      galleryLightbox.classList.add('open');
      galleryLightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });
  galleryLightbox.querySelector('.gallery-close').addEventListener('click', closeGallery);
  galleryLightbox.addEventListener('click', (e) => {
    if (e.target === galleryLightbox) closeGallery();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && galleryLightbox.classList.contains('open')) closeGallery();
  });
}
