/* Krenzer Design — Rezensionswand

   Baut die vier Spalten der Rezensions-Galerie in #rezensionen auf und
   schaltet ihren Loop an, sobald die Section im Bild ist.

   Die Bewegung selbst steckt komplett in styles.css: eine CSS-Animation auf
   dem Track läuft im Compositor, ein rAF-Loop würde bei 3D-Transformationen
   auf 80 Karten sichtbar ruckeln. */

var COLUMNS = 4;

/* Wie oft das Rezensions-Set pro Spalte wiederholt wird. Drei wäre für den
   nahtlosen Rücksprung schon genug, vier gibt der vertikal zentrierten Spalte
   auch am Ende des Zyklus noch Überstand nach unten. Siehe styles.css. */
var SETS = 4;

/* ---------------------------------------------------------------------------
   PLATZHALTER — frei erfundene Beispieltexte, keine echten Kundenstimmen.
   Vor dem Livegang ersetzen. Sollen sie aus Sanity kommen, wird dieses Array
   von cms/render.js überschrieben, bevor initReviews() läuft.
   Anzahl bitte durch COLUMNS teilbar halten, sonst werden die Spalten
   unterschiedlich lang und der Loop bekommt vier verschiedene Taktlängen.
   ------------------------------------------------------------------------ */
export var REVIEWS = [
  { quote: "Die neue Seite lädt schneller als alles, was wir vorher hatten. Und sie sieht aus, als hätte sie jemand wirklich durchdacht.",
    name: "Lena Hoffmann", role: "Geschäftsführerin, Nordlicht Studio", rating: 5 },
  { quote: "Vom ersten Entwurf bis zum Launch keine einzige böse Überraschung. Termine standen, Budget stand.",
    name: "Tobias Reiter", role: "Marketingleiter, Kraftwerk GmbH", rating: 5 },
  { quote: "Wir hatten drei Agenturen angefragt. Nur hier hat jemand zuerst Fragen gestellt statt Folien gezeigt.",
    name: "Miriam Bauer", role: "Gründerin, Feldheim & Co.", rating: 5 },
  { quote: "Unsere Conversion ist im ersten Quartal nach dem Relaunch um 34 % gestiegen.",
    name: "Jonas Wieland", role: "Head of Growth, Palette", rating: 5 },
  { quote: "Das CMS versteht auch unser Team ohne Schulung. Das war mir am wichtigsten.",
    name: "Sabine Ortmann", role: "Redaktionsleitung, Havelbote", rating: 4 },
  { quote: "Redaktionelles Design, das nicht nach Baukasten aussieht. Endlich.",
    name: "Daniel Krug", role: "Creative Director, Studio Anker", rating: 5 },
  { quote: "Die Übergabe war vorbildlich dokumentiert. Wir konnten sofort selbst weiterarbeiten.",
    name: "Anke Sommer", role: "CTO, Löwenzahn Digital", rating: 5 },
  { quote: "Ich hatte Sorge, dass Design und Technik auseinanderlaufen. Ist nicht passiert.",
    name: "Philipp Nowak", role: "Geschäftsführer, Nowak Metallbau", rating: 5 },
  { quote: "Auf dem Handy fühlt sich die Seite an wie eine App. Genau das wollten wir.",
    name: "Carla Winter", role: "Produktmanagerin, Rundfunk Lab", rating: 5 },
  { quote: "Sechs Wochen von Kickoff bis live, inklusive Content-Migration. Ich hätte nicht gedacht, dass das geht.",
    name: "Martin Fuchs", role: "Inhaber, Fuchs Optik", rating: 5 },
  { quote: "Was mich überzeugt hat: Es wurde nachher gemessen, nicht nur vorher versprochen.",
    name: "Nina Beckmann", role: "Leiterin Kommunikation, Stadtwerke Enzberg", rating: 5 },
  { quote: "Klare Sprache, klare Rechnungen, klare Termine. Selten geworden.",
    name: "Robert Hagen", role: "Geschäftsführer, Hagen & Partner", rating: 4 },
  { quote: "Die Typografie trägt die Marke jetzt, statt sie nur zu dekorieren.",
    name: "Elif Yıldırım", role: "Brand Lead, Casa Verde", rating: 5 },
  { quote: "Barrierefreiheit war von Anfang an eingeplant, nicht nachträglich draufgeschraubt.",
    name: "Thomas Merz", role: "Digitalbeauftragter, Landkreis Weißental", rating: 5 },
  { quote: "Wir pflegen die Seite seit einem Jahr selbst. Bisher kein einziger Support-Fall.",
    name: "Julia Steinbach", role: "Office Managerin, Atelier Steinbach", rating: 5 },
  { quote: "Der Prototyp nach zwei Wochen hat mehr geklärt als drei Monate Konzeptphase davor.",
    name: "Sven Albrecht", role: "Produktleiter, Tellur", rating: 5 },
  { quote: "Unsere Absprungrate auf der Startseite hat sich halbiert.",
    name: "Katrin Lohmann", role: "E-Commerce, Bergquell", rating: 4 },
  { quote: "Es wurde uns auch mal widersprochen. Das hat das Ergebnis besser gemacht.",
    name: "Andreas Pohl", role: "Vorstand, Genossenschaft Ährenfeld", rating: 5 },
  { quote: "Die Ladezeiten haben unser SEO-Budget effektiv halbiert.",
    name: "Farah Haddad", role: "SEO Managerin, Vitrum", rating: 5 },
  { quote: "Ein Auftritt, der auch in fünf Jahren noch nicht albern aussieht.",
    name: "Christian Berg", role: "Geschäftsführer, Berg Immobilien", rating: 5 }
];

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map(function (w) {
    return w.charAt(0).toUpperCase();
  }).join("");
}

function renderStars(rating) {
  var el = document.createElement("div");
  el.className = "rev-card__stars";
  el.setAttribute("aria-label", rating + " von 5 Sternen");

  for (var i = 1; i <= 5; i++) {
    var s = document.createElement("span");
    s.className = "rev-card__star" + (i <= rating ? " is-on" : "");
    s.textContent = "★";
    s.setAttribute("aria-hidden", "true");
    el.appendChild(s);
  }
  return el;
}

/* Eine Rezensionskarte. Die Höhe ist in CSS fest gesetzt und der Inhalt wird
   abgeschnitten — der Loop rechnet mit exakt gleich hohen Karten. */
function renderCard(review) {
  var card = document.createElement("article");
  card.className = "rev-card";

  var quote = document.createElement("blockquote");
  quote.className = "rev-card__quote";
  quote.textContent = review.quote;

  var author = document.createElement("footer");
  author.className = "rev-card__author";

  var avatar = document.createElement("span");
  avatar.className = "rev-card__avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = initials(review.name);

  var meta = document.createElement("span");
  meta.className = "rev-card__meta";

  var name = document.createElement("span");
  name.className = "rev-card__name";
  name.textContent = review.name;

  var role = document.createElement("span");
  role.className = "rev-card__role";
  role.textContent = review.role;

  meta.appendChild(name);
  meta.appendChild(role);
  author.appendChild(avatar);
  author.appendChild(meta);

  card.appendChild(renderStars(review.rating));
  card.appendChild(quote);
  card.appendChild(author);
  return card;
}

export function initReviews(reviews) {
  var data = Array.isArray(reviews) && reviews.length ? reviews : REVIEWS;

  var matrix = document.getElementById("reviewsMatrix");
  if (!matrix) return;

  var cols = matrix.querySelectorAll(".reviews__col");
  if (!cols.length) return;

  Array.prototype.forEach.call(cols, function (col, colIndex) {
    var mine = data.filter(function (_, i) { return i % COLUMNS === colIndex; });
    if (!mine.length) return;

    var track = document.createElement("div");
    track.className = "reviews__track";

    /* Die Verschiebung der Keyframes ist genau ein Set. Der Wert wird hier
       gesetzt, damit ein geändertes SETS nicht aus dem Tritt gerät. */
    track.style.setProperty("--shift", (-100 / SETS) + "%");

    for (var pass = 0; pass < SETS; pass++) {
      mine.forEach(function (review) {
        var card = renderCard(review);
        /* Nur das erste Set ist für Screenreader da — der Rest ist optische
           Wiederholung und würde die Zitate sonst viermal vorlesen. */
        if (pass > 0) card.setAttribute("aria-hidden", "true");
        track.appendChild(card);
      });
    }

    col.appendChild(track);
  });

  /* Der Loop läuft nur, solange die Section im Bild ist. Ohne das würden
     vier 3D-Ebenen dauerhaft neu gerastert, auch wenn man ganz woanders auf
     der Seite steht. Nicht unobserve: die Section wird wieder verlassen. */
  var section = document.getElementById("rezensionen");
  if (!section) return;

  if (!("IntersectionObserver" in window)) {
    section.classList.add("is-playing");
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    section.classList.toggle("is-playing", entries[0].isIntersecting);
  }, { rootMargin: "10% 0px" });

  io.observe(section);
}
