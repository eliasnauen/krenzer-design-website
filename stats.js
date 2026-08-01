/* Krenzer Design — Zahlen hochzählen

   Die Werte stehen als fertige Zeichenketten im Markup ("+118%", "0,8 s",
   "6 Wo.") und kommen genauso aus dem CMS. Deshalb liest dieses Modul den
   Zielwert aus dem Text, statt ein zusätzliches Datenfeld zu verlangen — an
   der Pflege im Studio ändert sich dadurch nichts.

   Angenommen wird ein Dezimaltrennzeichen (Komma oder Punkt), kein
   Tausendertrennzeichen: "1.200" würde als 1,2 gelesen. Bei Bedarf müsste
   der Zielwert dann doch am Element stehen. */

/* Erste Zahl im Text, mit optionalem Vorzeichen. Das Minus deckt sowohl den
   Bindestrich als auch das typografische Minus (U+2212) ab. */
var NUMBER = /[-−+]?\d+(?:[.,]\d+)?/;

var DURATION = 1200;
var STAGGER = 90;

function parse(text) {
  var m = String(text).match(NUMBER);
  if (!m) return null;

  var raw = m[0];
  var sign = /^[-−+]/.test(raw) ? raw.charAt(0) : "";
  var digits = sign ? raw.slice(1) : raw;
  var sepAt = digits.search(/[.,]/);

  return {
    /* Das Vorzeichen wandert in den Vorspann: gezählt wird der Betrag von 0
       aufwärts, angezeigt bleibt es durchgehend "−64 %". */
    prefix: text.slice(0, m.index) + sign,
    suffix: text.slice(m.index + raw.length),
    target: parseFloat(digits.replace(",", ".")),
    decimals: sepAt === -1 ? 0 : digits.length - sepAt - 1,
    sep: sepAt === -1 ? "," : digits.charAt(sepAt)
  };
}

function format(p, value) {
  var s = value.toFixed(p.decimals);
  if (p.decimals) s = s.replace(".", p.sep);
  return p.prefix + s + p.suffix;
}

export function initStats() {
  var nodes = document.querySelectorAll(".kpi__value");
  if (!nodes.length) return;

  var items = [];

  Array.prototype.forEach.call(nodes, function (el) {
    var parts = parse(el.textContent);
    if (!parts) return;   // Wert ohne Zahl bleibt unangetastet stehen

    /* Vorlesen soll immer der Endwert, nicht der Zwischenstand. Ohne das
       liest ein Screenreader je nach Zeitpunkt "+0 %". */
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", el.textContent.trim());

    items.push({ el: el, parts: parts });
  });

  if (!items.length) return;

  /* Ohne Beobachter oder bei reduzierter Bewegung bleibt der Endwert einfach
     stehen — die Zahlen sind Inhalt, die Animation ist Zugabe. */
  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  items.forEach(function (item) {
    item.el.textContent = format(item.parts, 0);
  });

  function run(item, index) {
    var start = null;
    var delay = index * STAGGER;

    function frame(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start - delay) / DURATION);

      if (t < 0) { requestAnimationFrame(frame); return; }

      // easeOutCubic: schneller Anlauf, weiches Einlaufen auf den Endwert
      var eased = 1 - Math.pow(1 - t, 3);
      item.el.textContent = format(item.parts, item.parts.target * eased);

      if (t < 1) requestAnimationFrame(frame);
      else item.el.textContent = format(item.parts, item.parts.target);
    }

    requestAnimationFrame(frame);
  }

  var band = items[0].el.closest(".metrics-band") || items[0].el;

  var io = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    io.disconnect();               // einmal zählen, nicht bei jedem Vorbeiscrollen
    items.forEach(run);
  }, { rootMargin: "0px 0px -15% 0px", threshold: 0.25 });

  io.observe(band);
}
