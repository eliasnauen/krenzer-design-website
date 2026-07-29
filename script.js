/* Krenzer Design — Interaktionen
   Scroll-Fortschritt, Cursor-Spotlight, Stack-Tabs, Case-Hover,
   Scroll-Reveal, aktive Navigation. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Scroll-Fortschrittsbalken ---------------------------------------- */
  var bar = document.getElementById("progressBar");

  function onScroll() {
    var el = document.scrollingElement || document.documentElement;
    var max = el.scrollHeight - el.clientHeight;
    bar.style.width = (max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0) + "%";
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* --- Cursor-Spotlight -------------------------------------------------- */
  var page = document.getElementById("page");
  var spotlight = document.getElementById("spotlight");

  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var raf = null;
    var mx = 50;
    var my = 18;

    page.addEventListener("mousemove", function (e) {
      var r = page.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 100;
      my = ((e.clientY - r.top) / r.height) * 100;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        spotlight.style.background =
          "radial-gradient(680px circle at " + mx.toFixed(2) + "% " + my.toFixed(2) +
          "%, rgba(150,175,235,0.09), transparent 62%)";
      });
    });
  }

  /* --- Metrik-Balken nach dem Mount füllen -------------------------------- */
  setTimeout(function () {
    document.body.classList.add("is-mounted");
  }, 260);

  /* --- Stack-Tabs -------------------------------------------------------- */
  var meta = {
    tokens:  { fileName: "styles/tokens.css",              fileMeta: "auto-generiert · 04:12" },
    content: { fileName: "schemas/caseStudy.ts",           fileMeta: "Headless CMS" },
    perf:    { fileName: ".github/workflows/budget.yml",   fileMeta: "CI · 14 Checks" }
  };

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var panes = Array.prototype.slice.call(document.querySelectorAll(".viewer__pane"));
  var fileName = document.getElementById("fileName");
  var fileMeta = document.getElementById("fileMeta");

  function selectTab(key) {
    tabs.forEach(function (t) {
      var on = t.dataset.tab === key;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });

    panes.forEach(function (p) {
      var on = p.dataset.pane === key;
      p.classList.toggle("is-active", on);
      // Tipp-Animation beim Wechsel neu starten
      if (on && !reduceMotion) {
        var code = p.querySelector(".code");
        code.style.animation = "none";
        void code.offsetWidth;
        code.style.animation = "";
      }
    });

    fileName.textContent = meta[key].fileName;
    fileMeta.textContent = meta[key].fileMeta;
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () { selectTab(t.dataset.tab); });
  });

  /* --- Case-Liste: nicht gehoverte Zeilen abdunkeln ---------------------- */
  var cases = document.getElementById("cases");
  cases.addEventListener("mouseenter", function () { cases.classList.add("is-hovered"); });
  cases.addEventListener("mouseleave", function () { cases.classList.remove("is-hovered"); });

  /* --- Scroll-Reveal ----------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  }

  /* --- Aktiver Navigationspunkt ------------------------------------------ */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { navIo.observe(s); });
  }
})();
