/* ================================================================
   app.js — Asesoras Avalian
   Menú mobile · Formulario con validación · Modal · WA float
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── MENÚ HAMBURGUESA ── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.setAttribute('aria-hidden', String(isOpen));
    });

    // Cerrar al hacer click en cualquier link del menú mobile
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });
  }


  /* ── HEADER: sombra al hacer scroll ── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 24px rgba(0,0,0,0.10)'
        : '0 2px 12px rgba(0,0,0,0.06)';
    }, { passive: true });
  }


  /* ── WHATSAPP FLOTANTE: mostrar tras scroll ── */
  const waFloat = document.getElementById('waFloat');
  if (waFloat) {
    waFloat.style.opacity = '0';
    waFloat.style.transform = 'scale(0.8)';
    waFloat.style.transition = 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.2s ease';

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        waFloat.style.opacity = '1';
        waFloat.style.transform = 'scale(1)';
      } else {
        waFloat.style.opacity = '0';
        waFloat.style.transform = 'scale(0.8)';
      }
    }, { passive: true });
  }


  /* ── FORMULARIO: grupo familiar condicional ── */
  const paraQuienSelect = document.getElementById('para-quien');
  const grupoGroup      = document.getElementById('grupo-group');

  function actualizarGrupo() {
    if (!paraQuienSelect || !grupoGroup) return;
    const val = paraQuienSelect.value;
    const esIndividual = val === 'yo' || val === 'adolescente';
    grupoGroup.style.display = esIndividual ? 'none' : '';
  }

  if (paraQuienSelect) {
    paraQuienSelect.addEventListener('change', actualizarGrupo);
    actualizarGrupo();
  }


  /* ── FORMULARIO ── */
  const form      = document.getElementById('contactForm');
  const success   = document.getElementById('formSuccess');

  if (!form) return;

  // Validaciones por campo
  const validators = {
    nombre: (v) => v.trim().length >= 2
      ? null
      : 'Ingresá tu nombre completo.',
    telefono: (v) => /^[\d\s\-\+\(\)]{6,20}$/.test(v.trim())
      ? null
      : 'Ingresá un teléfono válido.',
    localidad: (v) => v.trim().length >= 2
      ? null
      : 'Ingresá tu localidad o zona.',
    'para-quien': (v) => v !== ''
      ? null
      : 'Seleccioná una opción.',
  };

  // Mostrar error en campo
  function showError(name, msg) {
    const field = form.querySelector(`[name="${name}"]`);
    const errorEl = document.getElementById(`${name}-error`);
    if (field) field.classList.add('error');
    if (errorEl) errorEl.textContent = msg;
  }

  // Limpiar error en campo
  function clearError(name) {
    const field = form.querySelector(`[name="${name}"]`);
    const errorEl = document.getElementById(`${name}-error`);
    if (field) field.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  }

  // Validar en tiempo real al salir de cada campo
  Object.keys(validators).forEach(name => {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;
    field.addEventListener('blur', () => {
      const error = validators[name](field.value);
      error ? showError(name, error) : clearError(name);
    });
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        const error = validators[name](field.value);
        error ? showError(name, error) : clearError(name);
      }
    });
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot: si está relleno, ignorar silenciosamente
    const honeypot = form.querySelector('[name="website_url"]');
    if (honeypot && honeypot.value.trim() !== '') return;

    // Validar todos los campos requeridos
    let valid = true;
    Object.keys(validators).forEach(name => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return;
      const error = validators[name](field.value);
      if (error) {
        showError(name, error);
        valid = false;
      } else {
        clearError(name);
      }
    });

    if (!valid) {
      // Scroll al primer error
      const firstError = form.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Deshabilitar botón y mostrar carga
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando…';
    submitBtn.style.opacity = '0.75';

    // Simular envío (reemplazar con fetch a tu backend o Formspree)
    setTimeout(() => {
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Restaurar por si el usuario vuelve atrás
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      submitBtn.style.opacity = '1';

      // Tracking: lead generado
      if (typeof gtag === 'function') {
        const paraQuienVal = form.querySelector('[name="para-quien"]')?.value || '';
        const modalidadVal = form.querySelector('[name="modalidad"]')?.value || '';
        const contactoVal  = form.querySelector('[name="contacto"]')?.value || '';
        // GA4
        gtag('event', 'generate_lead', {
          para_quien: paraQuienVal,
          modalidad:  modalidadVal,
          contacto:   contactoVal,
        });
        // Google Ads — conversión formulario
        gtag('event', 'conversion', {
          send_to:  'AW-18090554003/TBIOCP7ynpwcEJPln7JD',
          value:    1.0,
          currency: 'ARS',
        });
      }
    }, 900);
  });


  /* ── MODAL DE PRIVACIDAD ── */
  const privacyBtn  = document.getElementById('privacyBtn');
  const privacyModal = document.getElementById('privacyModal');
  const modalClose  = document.getElementById('modalClose');

  function openModal() {
    privacyModal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    privacyModal.hidden = true;
    document.body.style.overflow = '';
    privacyBtn.focus();
  }

  if (privacyBtn && privacyModal && modalClose) {
    privacyBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);

    // Cerrar al hacer click fuera del box
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closeModal();
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !privacyModal.hidden) closeModal();
    });
  }


  /* ── TRACKING: clicks en WhatsApp ── */
  document.addEventListener('click', (e) => {
    const waBtn = e.target.closest('[data-wa-location]');
    if (!waBtn) return;
    const location = waBtn.dataset.waLocation || 'desconocido';
    if (typeof gtag === 'function') {
      // GA4
      gtag('event', 'whatsapp_click', { location });
      // Google Ads — conversión WhatsApp
      gtag('event', 'conversion', {
        send_to:  'AW-18090554003/TSdhCIHznpwcEJPln7JD',
        value:    1.0,
        currency: 'ARS',
      });
    }
  });


  /* ── FAQ: animar arrow ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      const arrow = item.querySelector('.faq-arrow');
      if (arrow) {
        arrow.style.transform = item.open ? 'rotate(180deg)' : 'rotate(0deg)';
        arrow.style.transition = 'transform 0.25s ease';
      }
    });
  });

});
