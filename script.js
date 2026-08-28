(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var heroNav = document.getElementById("heroNav");
  if (heroNav) {
    function onNavScroll() {
      if (window.scrollY > 60) heroNav.classList.add("is-scrolled");
      else heroNav.classList.remove("is-scrolled");
    }
    window.addEventListener("scroll", onNavScroll, { passive: true });
    onNavScroll();
  }

  var revealSections = document.querySelectorAll(".rich-section");
  if (revealSections.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealSections.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      }, { threshold: 0.18 });
      revealSections.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  var countEls = document.querySelectorAll(".num[data-count-to]");
  function formatCount(n) { return n.toLocaleString("en-US"); }
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count-to"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var startTime = null;
    if (el._countRAF) cancelAnimationFrame(el._countRAF);
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(Math.round(target * eased)) + suffix;
      if (progress < 1) {
        el._countRAF = requestAnimationFrame(step);
      } else {
        el._countRAF = null;
      }
    }
    el._countRAF = requestAnimationFrame(step);
  }
  if (countEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      countEls.forEach(function (el) {
        el.textContent = formatCount(parseInt(el.getAttribute("data-count-to"), 10)) + (el.getAttribute("data-suffix") || "");
      });
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
          } else {
            if (entry.target._countRAF) cancelAnimationFrame(entry.target._countRAF);
            entry.target.textContent = "0";
          }
        });
      }, { threshold: 0.4 });
      countEls.forEach(function (el) { countObserver.observe(el); });
    }
  }

  var video = document.getElementById("bgVideo");
  var videoToggle = document.getElementById("videoToggle");
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var isSlowConnection = !!(conn && (conn.saveData || /2g/.test(conn.effectiveType || "")));
  if (video) {
    if (isSlowConnection) {
      video.remove();
      if (videoToggle) videoToggle.remove();
    } else {
      if (reduceMotion) {
        video.pause();
      }
      if (videoToggle) {
        function syncToggle() {
          var paused = video.paused;
          videoToggle.classList.toggle("is-paused", paused);
          videoToggle.setAttribute("aria-pressed", String(paused));
          videoToggle.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
        }
        videoToggle.addEventListener("click", function () {
          if (video.paused) { video.play(); } else { video.pause(); }
        });
        video.addEventListener("play", syncToggle);
        video.addEventListener("pause", syncToggle);
        syncToggle();
      }
    }
  } else if (videoToggle) {
    videoToggle.remove();
  }

  var phrases = [
    "worry.",
    "not washing clothes.",
    "anger.",
    "shame.",
    "not washing hands.",
    "not enough to drink.",
    "going to sleep thirsty.",
    "interrupted plans."
  ];
  var phraseIdx = 0;
  var el = document.getElementById("rotator");
  if (reduceMotion) {
    el.textContent = phrases[0];
  } else {
    setInterval(function () {
      el.classList.add("leaving");
      setTimeout(function () {
        phraseIdx = (phraseIdx + 1) % phrases.length;
        el.textContent = phrases[phraseIdx];
        el.classList.remove("leaving");
        el.classList.add("entering");
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { el.classList.remove("entering"); });
        });
      }, 380);
    }, 3800);
  }

  var slideshows = document.querySelectorAll(".explainer-slideshow");
  if (slideshows.length && !reduceMotion) {
    slideshows.forEach(function (slideshow) {
      var slides = Array.prototype.slice.call(slideshow.querySelectorAll("img"));
      if (slides.length < 2) return;
      var idx = 0;
      setInterval(function () {
        slides[idx].classList.remove("is-active");
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add("is-active");
      }, 4500);
    });
  }

  var flipCards = document.querySelectorAll(".flip-card");
  flipCards.forEach(function (card) {
    card.addEventListener("click", function () {
      card.classList.toggle("is-flipped");
    });
  });
})();
