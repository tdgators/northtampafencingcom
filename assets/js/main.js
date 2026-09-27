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

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    q && q.addEventListener('click', function () {
      item.classList.toggle('open');
    });
  });
});
