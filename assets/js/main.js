document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.primary-nav');
  var scrim = document.querySelector('.nav-scrim');
  function setNav(open) {
    if (!nav) return;
    nav.classList.toggle('open', open);
    scrim && scrim.classList.toggle('open', open);
    if (toggle) {
      toggle.innerHTML = open ? '&#10005;' : '&#9776;';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    }
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('open'));
    });
  }
  scrim && scrim.addEventListener('click', function () { setNav(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNav(false);
  });

  // Mobile dropdown accordions (tap to open submenu instead of hover)
  document.querySelectorAll('nav.primary-nav > ul > li').forEach(function (li) {
    var link = li.querySelector(':scope > button.nav-toggle');
    if (!link) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      li.classList.toggle('open');
    });
  });

  // Two-step estimate forms (.est-form): step 1 = contact + address (required),
  // step 2 = optional fence details, then Submit.
  // Both steps share one grid cell (so the form keeps the taller step's height); only the
  // active one is visible and interactive.
  function showStep(form, n) {
    form.querySelectorAll('.est-step').forEach(function (step) {
      var active = step.getAttribute('data-step') === String(n);
      step.classList.toggle('is-active', active);
      step.inert = !active;
      step.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
  }
  window.estimateStep = showStep;
  document.querySelectorAll('.est-form').forEach(function (form) {
    var step1 = form.querySelector('.est-step[data-step="1"]');
    var step2 = form.querySelector('.est-step[data-step="2"]');
    function step1Valid() {
      var fields = step1.querySelectorAll('input, select, textarea');
      for (var i = 0; i < fields.length; i++) {
        if (!fields[i].checkValidity()) { fields[i].reportValidity(); return false; }
      }
      return true;
    }
    function goNext() {
      if (!step1Valid()) return;
      showStep(form, 2);
      var first = step2.querySelector('input, select');
      if (first) first.focus({ preventScroll: true });
      if (form.getBoundingClientRect().top < 80) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    form.querySelector('.est-next').addEventListener('click', goNext);
    form.querySelector('.est-back').addEventListener('click', function () { showStep(form, 1); });
    // Enter on step 1 moves to step 2 instead of submitting (capture runs before the Formspree handler)
    form.addEventListener('submit', function (e) {
      if (step1.classList.contains('is-active')) { e.preventDefault(); e.stopImmediatePropagation(); goNext(); }
    }, true);
  });

  // Estimate pop-up: any button that links to the contact page opens the form in place
  // (full-screen on phones). Plain links (menu, footer) still navigate to the page.
  var modal = document.getElementById('estimate-modal');
  if (modal) {
    var lastFocus = null;
    var openModal = function () {
      lastFocus = document.activeElement;
      setNav(false);
      // start fresh: clear a previous submission's thank-you or error message
      modal.querySelectorAll('[data-fs-active]').forEach(function (el) { el.removeAttribute('data-fs-active'); });
      modal.hidden = false;
      document.documentElement.classList.add('modal-open');
      // focus during the tap itself so phones open the keyboard (and their AutoFill bar) right away
      var first = modal.querySelector('.est-step.is-active input');
      if (first) first.focus();
    };
    var closeModal = function () {
      modal.hidden = true;
      document.documentElement.classList.remove('modal-open');
      if (lastFocus) lastFocus.focus();
    };
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a.btn, a.header-quote');
      if (!link) return;
      var href = link.getAttribute('href') || '';
      if (/\/contact-us\/?$/.test(href.split('#')[0])) { e.preventDefault(); openModal(); }
    });
    modal.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', closeModal); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    q && q.addEventListener('click', function () {
      item.classList.toggle('open');
    });
  });
});
