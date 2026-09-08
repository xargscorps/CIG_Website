/* CloudInfra Global — site behaviour. No dependencies. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Branded first-load reveal (once per browsing session) ---- */
  if (!reduceMotion) {
    var showIntro = true;
    try {
      showIntro = sessionStorage.getItem('cig-motion-intro') !== 'seen';
      sessionStorage.setItem('cig-motion-intro', 'seen');
    } catch (error) {}
    if (showIntro) {
      var intro = document.createElement('div');
      intro.className = 'motion-intro';
      intro.setAttribute('aria-hidden', 'true');
      intro.innerHTML = '<div class="motion-intro__inner"><span class="motion-intro__mark"><img src="/assets/images/cloudinfra-global-logo.png" alt=""></span><strong class="motion-intro__name">CloudInfra Global</strong><span class="motion-intro__line"><i></i></span></div>';
      document.body.appendChild(intro);
      window.setTimeout(function () { intro.classList.add('is-leaving'); }, 560);
      window.setTimeout(function () { intro.remove(); }, 1000);
    }
  }

  /* ---- Sticky header shadow ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.setAttribute('data-open', String(!open));
      document.body.style.overflow = !open && window.innerWidth <= 960 ? 'hidden' : '';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && window.innerWidth <= 960) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---- Nav dropdown (hover on desktop, click everywhere) ---- */
  document.querySelectorAll('.nav-group').forEach(function (group) {
    var btn = group.querySelector('.nav-group__btn');
    if (!btn) return;
    var open = function (state) {
      group.setAttribute('data-open', String(state));
      btn.setAttribute('aria-expanded', String(state));
    };
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      open(group.getAttribute('data-open') !== 'true');
    });
    if (window.matchMedia('(min-width: 961px)').matches) {
      group.addEventListener('mouseenter', function () { open(true); });
      group.addEventListener('mouseleave', function () { open(false); });
    }
    group.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { open(false); btn.focus(); }
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.nav-group[data-open="true"]').forEach(function (g) {
      if (!g.contains(e.target)) {
        g.setAttribute('data-open', 'false');
        var b = g.querySelector('.nav-group__btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---- Reveal on scroll ---- */
  var revealables = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = parseInt(entry.target.getAttribute('data-reveal-delay') || '0', 10);
        setTimeout(function () { entry.target.classList.add('is-in'); }, delay);
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---- Reading progress ---- */
  if (!reduceMotion) {
    var meter = document.createElement('div');
    meter.className = 'scroll-meter';
    meter.setAttribute('aria-hidden', 'true');
    document.body.appendChild(meter);
    var updateMeter = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      meter.style.transform = 'scaleX(' + progress + ')';
    };
    updateMeter();
    window.addEventListener('scroll', updateMeter, { passive: true });
    window.addEventListener('resize', updateMeter, { passive: true });
  }

  /* ---- Layered parallax scroll, tuned separately for mobile ---- */
  if (!reduceMotion) {
    var parallaxItems = [];
    var registerParallax = function (selector, speed, limit) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.classList.add('parallax-layer');
        parallaxItems.push({ el: el, speed: speed, limit: limit });
      });
    };

    registerParallax('.hero__grid > div:first-child', -0.032, 18);
    registerParallax('.hero__art', 0.105, 50);
    registerParallax('.global-globe', 0.045, 24);
    registerParallax('.chapter-dark .split > div:last-child', 0.055, 30);
    registerParallax('.lifecycle', 0.028, 16);
    registerParallax('.logo-wall--5', 0.024, 14);
    registerParallax('.contact-grid', 0.024, 14);

    var parallaxSections = Array.prototype.slice.call(document.querySelectorAll('.chapter-dark'));
    parallaxSections.forEach(function (section) { section.classList.add('parallax-section'); });
    var lifecycleTrack = document.querySelector('.lifecycle');

    var parallaxTicking = false;
    var updateParallax = function () {
      var viewportHeight = window.innerHeight;
      var mobileFactor = window.innerWidth <= 700 ? .58 : 1;

      parallaxItems.forEach(function (item) {
        var rect = item.el.getBoundingClientRect();
        if (rect.bottom < -160 || rect.top > viewportHeight + 160) return;
        var distance = viewportHeight * .5 - (rect.top + rect.height * .5);
        var limit = item.limit * mobileFactor;
        var offset = Math.max(-limit, Math.min(limit, distance * item.speed * mobileFactor));
        item.el.style.setProperty('--parallax-y', offset.toFixed(2) + 'px');
      });

      parallaxSections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewportHeight) return;
        var progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        var range = window.innerWidth <= 700 ? 18 : 34;
        section.style.setProperty('--parallax-bg', ((progress - .5) * range).toFixed(2) + 'px');
      });

      if (lifecycleTrack) {
        var lifecycleRect = lifecycleTrack.getBoundingClientRect();
        var journey = Math.max(0, Math.min(1, (viewportHeight * .78 - lifecycleRect.top) / Math.max(lifecycleRect.height * .85, 1)));
        lifecycleTrack.style.setProperty('--journey-progress', journey.toFixed(3));
      }

      parallaxTicking = false;
    };
    var requestParallax = function () {
      if (parallaxTicking) return;
      parallaxTicking = true;
      window.requestAnimationFrame(updateParallax);
    };
    updateParallax();
    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax, { passive: true });
  }

  /* ---- Cinematic staggered entrances for repeated content ---- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.body.classList.add('motion-ready');
    var motionItems = document.querySelectorAll('.stage,.logo-cell,.industry,.contact-card');
    motionItems.forEach(function (el, index) {
      el.classList.add('motion-item');
      el.style.setProperty('--motion-delay', ((index % 5) * 65) + 'ms');
    });
    var motionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-in');
        motionObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: .08 });
    motionItems.forEach(function (el) { motionObserver.observe(el); });
  }

  /* ---- Touch-safe press and ripple feedback ---- */
  var interactive = document.querySelectorAll('.btn,.card,.industry,.contact-card,.logo-cell,.hero__tags li');
  interactive.forEach(function (el) {
    el.classList.add('micro-interactive');
    el.addEventListener('pointerdown', function (event) {
      el.classList.add('is-touching');
      if (reduceMotion) return;
      var rect = el.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'micro-ripple';
      ripple.style.left = (event.clientX - rect.left) + 'px';
      ripple.style.top = (event.clientY - rect.top) + 'px';
      el.appendChild(ripple);
      window.setTimeout(function () { ripple.remove(); }, 700);
    });
    ['pointerup','pointercancel','pointerleave'].forEach(function (name) {
      el.addEventListener(name, function () { el.classList.remove('is-touching'); });
    });
  });

  /* ---- Fine-pointer card tilt; touch devices retain tap feedback ---- */
  if (!reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.card,.industry,.contact-card').forEach(function (el) {
      el.classList.add('tilt-ready');
      el.addEventListener('pointermove', function (event) {
        var rect = el.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - .5;
        var y = (event.clientY - rect.top) / rect.height - .5;
        el.classList.add('motion-spotlight');
        el.style.setProperty('--spot-x', ((x + .5) * 100) + '%');
        el.style.setProperty('--spot-y', ((y + .5) * 100) + '%');
        el.style.setProperty('--tilt-x', (y * -3.5) + 'deg');
        el.style.setProperty('--tilt-y', (x * 4.5) + 'deg');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
      });
    });

    document.querySelectorAll('.btn').forEach(function (button) {
      button.classList.add('magnetic');
      button.addEventListener('pointermove', function (event) {
        var rect = button.getBoundingClientRect();
        var x = event.clientX - (rect.left + rect.width * .5);
        var y = event.clientY - (rect.top + rect.height * .5);
        button.style.setProperty('--mag-x', (x * .12) + 'px');
        button.style.setProperty('--mag-y', (y * .16) + 'px');
      });
      button.addEventListener('pointerleave', function () {
        button.style.setProperty('--mag-x', '0px');
        button.style.setProperty('--mag-y', '0px');
      });
    });
  }

  /* ---- Hero network responds to cursor and tap ---- */
  var heroArt = document.querySelector('.hero__art');
  if (heroArt && !reduceMotion) {
    heroArt.addEventListener('pointermove', function (event) {
      if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
      var rect = heroArt.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - .5;
      var y = (event.clientY - rect.top) / rect.height - .5;
      heroArt.style.setProperty('--hero-rx', (y * -4) + 'deg');
      heroArt.style.setProperty('--hero-ry', (x * 5) + 'deg');
    });
    heroArt.addEventListener('pointerleave', function () {
      heroArt.style.setProperty('--hero-rx', '0deg');
      heroArt.style.setProperty('--hero-ry', '0deg');
      heroArt.classList.remove('is-touching');
    });
    heroArt.addEventListener('pointerdown', function () { heroArt.classList.add('is-touching'); });
    heroArt.addEventListener('pointerup', function () { heroArt.classList.remove('is-touching'); });
    heroArt.addEventListener('pointercancel', function () { heroArt.classList.remove('is-touching'); });
  }

  /* ---- Active section feedback in desktop and mobile navigation ---- */
  if ('IntersectionObserver' in window) {
    var navLinks = document.querySelectorAll('.nav a[href^="#"]');
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-current', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-28% 0px -58% 0px', threshold: 0 });
    document.querySelectorAll('section[id]').forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---- Stat count-up ----
     Real values live in the HTML (data-count + visible text), so the page is
     correct with JavaScript disabled and for crawlers. The animation only
     ever counts up TO the number already written in the markup. */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        countObserver.unobserve(el);

        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        if (isNaN(target)) return;

        var duration = 1200;
        var start = null;
        var step = function (ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + (p === 1 ? suffix : '');
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---- Current year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
