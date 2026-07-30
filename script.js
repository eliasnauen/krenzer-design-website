/* Krenzer Design — Interaktionen
   Scroll-Fortschritt, Cursor-Spotlight, Stack-Tabs, Case-Hover,
   Scroll-Reveal, aktive Navigation.

   Wird von main.js aufgerufen, nachdem die Inhalte aus dem CMS im DOM stehen —
   sonst würden die Event-Listener an Elementen hängen, die es nicht mehr gibt. */

export function initInteractions() {
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
  /* Dateiname und Zusatz stehen am jeweiligen Pane (data-file-name / data-file-meta),
     gesetzt aus dem CMS — deshalb hier keine fest verdrahtete Zuordnung mehr. */
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
      if (!on) return;

      // Tipp-Animation beim Wechsel neu starten
      if (!reduceMotion) {
        var code = p.querySelector(".code");
        code.style.animation = "none";
        void code.offsetWidth;
        code.style.animation = "";
      }

      fileName.textContent = p.dataset.fileName || "";
      fileMeta.textContent = p.dataset.fileMeta || "";
    });
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () { selectTab(t.dataset.tab); });
  });

  /* --- Liquid Glass: Reflex folgt dem Zeiger ----------------------------- */
  /* Delegiert an der Seite, nicht an den Flächen selbst: Karten und Tags
     werden aus dem CMS neu geschrieben, die Seite bleibt stehen.
     Das Gegenstück steht in styles.css als ::after auf denselben Klassen. */
  var GLASS_SELECTOR = ".card, .kpi, .btn--ghost, .tag";

  if (page && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var glassRaf = null;
    var glassEl = null;
    var glassX = 50;
    var glassY = 0;

    page.addEventListener("mousemove", function (e) {
      var el = e.target.closest(GLASS_SELECTOR);
      if (!el) return;

      var r = el.getBoundingClientRect();
      glassEl = el;
      glassX = ((e.clientX - r.left) / r.width) * 100;
      glassY = ((e.clientY - r.top) / r.height) * 100;

      if (glassRaf) return;
      glassRaf = requestAnimationFrame(function () {
        glassRaf = null;
        glassEl.style.setProperty("--mx", glassX.toFixed(1) + "%");
        glassEl.style.setProperty("--my", glassY.toFixed(1) + "%");
      });
    });
  }

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
    .map(function (a) {
      var href = a.getAttribute("href");
      return href && href.charAt(0) === "#" ? document.querySelector(href) : null;
    })
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
}
