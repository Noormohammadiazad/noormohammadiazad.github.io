/* Inlined at the end of <body>, so it runs before first paint. If you just
   switched language, it puts you back in the same section, the same
   distance through it — the other language's page has different heights,
   so a raw scroll offset would land in the wrong place. app.js records the
   position when you click the switcher. */
(function () {
  var w = window, d = document.documentElement, pos = null, y = -1;
  try {
    pos = JSON.parse(sessionStorage.getItem("pos"));
    sessionStorage.removeItem("pos");
  } catch (e) {}
  if (!pos || location.hash) return;
  var el = document.getElementById(pos.id);
  function go() {
    if (!el) return;
    y = Math.round(el.getBoundingClientRect().top + w.scrollY + pos.f * el.offsetHeight);
    d.style.scrollBehavior = "auto";
    w.scrollTo(0, y);
    d.style.scrollBehavior = "";
  }
  go();
  /* A late webfont changes heights; re-apply if the visitor has not
     scrolled since. */
  if (document.fonts) document.fonts.ready.then(function () { if (Math.abs(w.scrollY - y) < 2) go(); });
})();
