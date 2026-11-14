/* Runs before first paint. Keeps the page from flashing the wrong theme or
   the wrong language, and decides how much motion this device gets.
   Deliberately tiny and dependency-free. */
(function () {
  var d = document.documentElement;
  var cls = " js";

  /* Motion budget. "fx3d" turns on the scroll-driven 3D layer (tunnel and
     depth). It is withheld when the visitor asks for reduced motion, and on
     devices that signal they are constrained: Save-Data, ≤2 GB of memory or
     ≤2 CPU cores. Those visitors get the same design, flat and still. */
  try {
    var n = navigator, c = n.connection;
    var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var lite = (c && c.saveData) || (n.deviceMemory && n.deviceMemory <= 2) ||
      (n.hardwareConcurrency && n.hardwareConcurrency <= 2);
    if (!still && !lite) cls += " fx3d";
  } catch (e) {}
  d.className += cls;

  /* Theme: an explicit choice wins; otherwise the stylesheet falls back to
     the operating system preference on its own. */
  try {
    var t = localStorage.getItem("theme");
    if (t === "dark" || t === "light") d.setAttribute("data-theme", t);
  } catch (e) {}

  /* Language: return visitors land in the language they last chose. Only
     ever rewrites between the two known bases, and never on the 404 page
     (GitHub Pages serves one 404 for every unmatched path, so there is no
     localised variant to redirect to). */
  if (d.getAttribute("data-lang-redirect") !== "off") {
    try {
      var want = localStorage.getItem("lang");
      var here = d.lang === "fa" ? "fa" : "en";
      if ((want === "fa" || want === "en") && want !== here) {
        var p = location.pathname;
        var to = want === "fa" ? "/fa" + p : p.replace(/^\/fa(?=\/|$)/, "") || "/";
        if (to !== p) location.replace(to + location.search + location.hash);
      }
    } catch (e) {}
  }
})();
