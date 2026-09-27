// FOAM concept: live open/closed status (Cairo time) and menu tabs.
(function () {
  var HOURS = { 1: [8, 18] }; // Monday 8am–6pm
  var DEFAULT = [8, 21];      // every other day 8am–9pm

  function cairoNow() {
    // ?at=<day 0-6>-<hour> previews a given moment (used for screenshots)
    var at = /[?&]at=(\d)-(\d+(?:\.\d+)?)/.exec(location.search);
    if (at) return { day: +at[1], hour: +at[2] };
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Cairo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[map.weekday], hour: parseInt(map.hour, 10) + parseInt(map.minute, 10) / 60 };
  }

  function fmt(h) { return h === 12 ? '12pm' : h > 12 ? (h - 12) + 'pm' : h + 'am'; }

  function updateStatus() {
    var now = cairoNow();
    var today = HOURS[now.day] || DEFAULT;
    var pill = document.querySelector('.js-status');
    var text = document.querySelector('.js-status-text');
    if (pill && text) {
      if (now.hour >= today[0] && now.hour < today[1]) {
        pill.classList.add('is-open'); pill.classList.remove('is-closed');
        text.textContent = 'Open now · until ' + fmt(today[1]);
      } else {
        var opensToday = now.hour < today[0];
        pill.classList.add('is-closed'); pill.classList.remove('is-open');
        text.textContent = 'Closed · opens ' + (opensToday ? '' : 'tomorrow ') + fmt(8);
      }
    }
    document.querySelectorAll('.js-hours tr').forEach(function (tr) {
      tr.classList.toggle('is-today', parseInt(tr.getAttribute('data-day'), 10) === now.day);
    });
  }

  function initTabs() {
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute('data-tab');
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        document.querySelectorAll('.menu-panel').forEach(function (p) {
          var on = p.getAttribute('data-panel') === key;
          p.classList.toggle('is-active', on);
          p.hidden = !on;
        });
      });
    });
  }

  function initMap() {
    var btn = document.querySelector('.js-live-map');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var card = document.querySelector('.js-map');
      var f = document.createElement('iframe');
      f.title = 'Map to FOAM in Zamalek';
      f.src = 'https://www.google.com/maps?q=FOAM%20Brunch%20%26%20Brews%2C%203%20Al%20Sheikh%20Al%20Marsafi%2C%20Zamalek&output=embed';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      card.appendChild(f);
      card.querySelector('.map-actions').remove();
    });
  }

  updateStatus();
  initMap();
  setInterval(updateStatus, 60000);
  initTabs();
})();
