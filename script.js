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

  /* --- Tiefenebenen ------------------------------------------------------ */
  /* Alles mit data-depth ist Licht hinter der Seite und bewegt sich langsamer
     als sie — je größer der Faktor, desto näher wirkt die Ebene. Gesetzt wird
     nur --py; wohin das im Element wandert, steht im CSS (bei .cards etwa in
     das ::before, nicht in die Karten selbst).

     Der Versatz wird begrenzt: sonst zöge das große Glow oben über die ganze
     Seitenlänge mit nach unten, statt oben zu bleiben. Solange eine Ebene im
     Bild ist, liegt sie ohnehin unter dieser Grenze. */
  var depthLayers = Array.prototype.slice.call(document.querySelectorAll("[data-depth]"));

  if (depthLayers.length && !reduceMotion) {
    var depthItems = [];
    var depthRaf = null;

    function measureDepth() {
      // Erst zurücksetzen, sonst misst man die eigene Verschiebung mit.
      depthLayers.forEach(function (el) { el.style.setProperty("--py", "0px"); });

      depthItems = depthLayers.map(function (el) {
        var rect = el.getBoundingClientRect();
        return {
          el: el,
          rate: parseFloat(el.getAttribute("data-depth")) || 0,
          center: rect.top + window.scrollY + rect.height / 2,
        };
      });
    }

    function paintDepth() {
      depthRaf = null;
      var mid = window.scrollY + window.innerHeight / 2;
      var limit = window.innerHeight * 0.45;

      depthItems.forEach(function (item) {
        var offset = (mid - item.center) * item.rate;
        offset = Math.max(-limit, Math.min(limit, offset));
        item.el.style.setProperty("--py", offset.toFixed(1) + "px");
      });
    }

    function onDepthScroll() {
      if (!depthRaf) depthRaf = requestAnimationFrame(paintDepth);
    }

    measureDepth();
    paintDepth();
    window.addEventListener("scroll", onDepthScroll, { passive: true });
    window.addEventListener("resize", function () { measureDepth(); onDepthScroll(); });
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

  /* --- Schluss-Section: Zeilen fahren zusammen --------------------------- */
  /* Die Überschrift kommt als eine Zeile mit <br> aus dem CMS. Hier wird sie
     in Zeilen zerlegt, die einzeln fahren können — abwechselnd von links und
     von rechts.

     Kein Scroll-Wert wird durchgereicht: JavaScript schaltet nur is-in um,
     sobald die Überschrift die Schwelle passiert, und wieder ab, wenn man
     darüber zurückscrollt. Den Weg dazwischen läuft der CSS-Übergang von
     selbst und immer ganz. Läuft dieser Block nicht, steht die Überschrift
     ohne Umweg an ihrem Platz. */
  var ctaHeading = document.querySelector("#kontakt .h2");

  if (ctaHeading && !reduceMotion) {
    var lines = ctaHeading.innerHTML.split(/<br\s*\/?>/i)
      .map(function (part) { return part.trim(); })
      .filter(Boolean);

    // Keine Zeilenumbrüche gepflegt? Dann in der Mitte der Wörter trennen.
    if (lines.length < 2) {
      var words = lines.join(" ").split(/\s+/);
      var half = Math.ceil(words.length / 2);
      lines = [words.slice(0, half).join(" "), words.slice(half).join(" ")];
    }

    ctaHeading.innerHTML = lines
      .map(function (line) {
        return '<span class="cta__line"><span class="cta__line-inner">' + line + "</span></span>";
      })
      .join("");

    // Ab hier tragen die Zeilen den Verlauf, nicht mehr die Überschrift.
    ctaHeading.classList.add("is-split");

    /* Die Schwelle liegt bei 84 % der Bildhöhe: die Überschrift ist unten
       schon ein Stück hereingekommen, bevor die Zeilen loslaufen — aber noch
       früh genug, dass sie steht, wenn die Section dran ist.
       Nicht unobserve: der Weg zurück gehört zur Sache. */
    if ("IntersectionObserver" in window) {
      var lineIo = new IntersectionObserver(function (entries) {
        ctaHeading.classList.toggle("is-in", entries[0].isIntersecting);
      }, { rootMargin: "0px 0px -16% 0px" });

      lineIo.observe(ctaHeading);
    } else {
      ctaHeading.classList.add("is-in");
    }
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
