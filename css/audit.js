/* ============================================================
   AUDIT.JS — Gaurav Web Consulting · audit page system
   Reads each .score-card's data-count (0-100) and handles
   everything: ring fill, ring color, tag text/colour, count-up.
   Also stamps the date and runs scroll-reveal on .card elements.
   The HTML only needs to supply the two score numbers.
   ============================================================ */
(function () {
  var C = 245; // circumference: 2 * PI * r(39)

  function tagFor(s) {
    if (s < 50) return ['bad', 'Needs Work'];
    if (s < 90) return ['avg', 'Average'];
    return ['good', 'Strong'];
  }
  function colorFor(s) {
    if (s < 50) return '#ef4444';
    if (s < 90) return '#f59e0b';
    return '#22c98a';
  }

  function init() {
    // Date badge — only fill if left empty in the HTML
    var d = document.querySelector('.badge-date');
    if (d && !d.textContent.trim()) {
      d.textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    // Score rings
    document.querySelectorAll('.score-card').forEach(function (card) {
      var num = card.querySelector('.ring-num');
      var ring = card.querySelector('.ring-fg');
      var tagEl = card.querySelector('.score-tag');
      if (!num) return;

      var s = parseInt(num.getAttribute('data-count'), 10);
      if (isNaN(s)) s = 0;
      s = Math.max(0, Math.min(100, s));

      if (ring) {
        ring.setAttribute('stroke', colorFor(s));
        ring.setAttribute('stroke-dasharray', C);
        ring.style.strokeDashoffset = C; // start empty
      }
      if (tagEl && !tagEl.textContent.trim()) {
        var t = tagFor(s);
        tagEl.className = 'score-tag ' + t[0];
        tagEl.textContent = t[1];
      }

      // Animate ring fill
      requestAnimationFrame(function () {
        if (ring) ring.style.strokeDashoffset = Math.round(C * (1 - s / 100));
      });

      // Count-up number
      var t0 = null, dur = 1500;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        num.textContent = Math.round(s * e);
        if (p < 1) requestAnimationFrame(step);
      }
      setTimeout(function () { requestAnimationFrame(step); }, 500);
    });

    // Scroll reveal for cards
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.card').forEach(function (c, i) {
      c.style.transitionDelay = (i % 3 * 80) + 'ms';
      io.observe(c);
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
