// FOAM preview site: mobile menu, menu chips, language note.
(function () {
  var body = document.body;
  var burger = document.querySelector('.burger');
  var mnav = document.getElementById('mnav');
  function setMenu(open) {
    if (!burger || !mnav) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    body.classList.toggle('nav-open', open);
    mnav.hidden = !open;
  }
  if (burger && mnav) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.matchMedia('(min-width: 1101px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  // Arabic toggle: the preview is English only
  document.querySelectorAll('.js-ar').forEach(function (b) {
    b.addEventListener('click', function () { toast('النسخة العربية جاية مع الموقع الكامل · Arabic comes with the full site'); });
  });

  // Menu page: chips jump to a section and follow the scroll
  var jump = document.querySelector('.js-jump');
  if (jump) {
    var chips = Array.prototype.slice.call(jump.querySelectorAll('.chip'));
    function mark(id) {
      chips.forEach(function (c) {
        var on = c.getAttribute('href') === '#' + id;
        c.classList.toggle('on', on);
        if (on) { c.setAttribute('aria-current', 'true'); } else { c.removeAttribute('aria-current'); }
      });
    }
    var lock = 0;
    jump.addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      lock = Date.now() + 1200;
      mark(c.getAttribute('href').slice(1));
      c.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    });
    var secs = chips.map(function (c) { return document.querySelector(c.getAttribute('href')); }).filter(Boolean);
    function spy() {
      if (Date.now() < lock) return;
      var cur = secs[0];
      secs.forEach(function (sec) { if (sec.getBoundingClientRect().top <= 160) cur = sec; });
      if (cur) mark(cur.id);
    }
    window.addEventListener('scroll', spy, { passive: true });
  }
})();
