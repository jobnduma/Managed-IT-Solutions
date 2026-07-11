// Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 350);
});

// Sticky header
const header = document.getElementById('siteHeader');
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 600);
});

// Mobile nav
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  }));
}

// Scroll to top
if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
}, { threshold: .15 });
revealEls.forEach((el) => revealObserver.observe(el));

// ===== Contact channel modal (Gmail / WhatsApp) =====
const CONTACT_EMAIL = 'ndirangungu@gmail.com';
const WHATSAPP_NUMBER = '254720532905'; // +254 720 532905, international format for wa.me

function buildGmailUrl(subject, body) {
  return 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(CONTACT_EMAIL) +
    '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}
function buildWhatsAppUrl(text) {
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
}

const contactModalOverlay = document.getElementById('contactModalOverlay');
const contactModalSubtitle = document.getElementById('contactModalSubtitle');
const contactModalGmailBtn = document.getElementById('contactModalGmail');
const contactModalWhatsappBtn = document.getElementById('contactModalWhatsapp');
const contactModalClose = document.getElementById('contactModalClose');

let pendingSubject = '';
let pendingBody = '';
let pendingOnSent = null;

function openContactModal({ subject, body, subtitle, onSent }) {
  pendingSubject = subject;
  pendingBody = body;
  pendingOnSent = onSent || null;
  if (contactModalSubtitle) contactModalSubtitle.textContent = subtitle || "Choose how you'd like to start the conversation.";
  if (contactModalOverlay) {
    contactModalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}
function closeContactModal() {
  if (!contactModalOverlay) return;
  contactModalOverlay.classList.remove('show');
  document.body.style.overflow = '';
}
if (contactModalClose) contactModalClose.addEventListener('click', closeContactModal);
if (contactModalOverlay) {
  contactModalOverlay.addEventListener('click', (e) => { if (e.target === contactModalOverlay) closeContactModal(); });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModalOverlay && contactModalOverlay.classList.contains('show')) closeContactModal();
});
if (contactModalGmailBtn) {
  contactModalGmailBtn.addEventListener('click', () => {
    window.open(buildGmailUrl(pendingSubject, pendingBody), '_blank', 'noopener');
    if (pendingOnSent) pendingOnSent();
    closeContactModal();
  });
}
if (contactModalWhatsappBtn) {
  contactModalWhatsappBtn.addEventListener('click', () => {
    window.open(buildWhatsAppUrl(pendingSubject + '\n\n' + pendingBody), '_blank', 'noopener');
    if (pendingOnSent) pendingOnSent();
    closeContactModal();
  });
}

// Generic + per-service "Request/Enquire" triggers
document.querySelectorAll('[data-consult-trigger]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const service = btn.dataset.service;
    if (service) {
      openContactModal({
        subject: 'Consultation Request: ' + service,
        body: 'Hi Managed IT Solutions team,\n\nI\'m interested in your ' + service + ' service and would like to book a free consultation.\n\nPlease let me know the next available time to discuss my requirements.\n\nThank you.',
        subtitle: "We'll tailor the conversation around " + service + '.'
      });
    } else {
      openContactModal({
        subject: 'Free Consultation Request',
        body: 'Hi Managed IT Solutions team,\n\nI\'d like to book a free consultation to discuss my IT and security needs.\n\nPlease let me know the next available time.\n\nThank you.',
        subtitle: "Choose how you'd like to start the conversation."
      });
    }
  });
});
