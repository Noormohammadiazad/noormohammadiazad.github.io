/* Progressive enhancement only. With JavaScript disabled the page still
   renders, navigates and reads correctly. Loaded with `defer` from a
   content-hashed URL, so it never blocks rendering.

   It adds the theme toggle, language memory, the Range map's tabs and
   camera, window focus, and the scroll choreography. Everything that moves
   runs in one requestAnimationFrame loop that sleeps whenever nothing is
   changing. Layout is read only in measure() (on load, resize and content
   changes); each frame writes nothing but transforms, opacity, classes and
   a few custom properties — compositor work, never layout. Motion maps
   straight to the scroll position, so it never lags behind your finger. */
(function () {
  var d = document.documentElement, doc = document, w = window;
  var rtl = d.dir === "rtl";
  var dir = rtl ? -1 : 1;   /* +1 when the reading direction runs to the right */

  function put(area, k, v) { try { w[area].setItem(k, v); return true; } catch (e) { return false; } }
  function $(s, root) { return (root || doc).querySelector(s); }
  function $$(s, root) { return (root || doc).querySelectorAll(s); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(a, b, x) { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); }
  /* Layout position, ignoring transforms, so effects never feed back. */
  function top(el) { var y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; }

  var reduce = w.matchMedia("(prefers-reduced-motion: reduce)");
  var full = d.classList.contains("fx3d");   /* choreography and the 3D timeline (head.js decides) */

  /* ── Theme ─────────────────────────────────────────────────────────── */
  var dark = w.matchMedia("(prefers-color-scheme: dark)");
  var toggle = $("[data-theme-toggle]");

  function resolved() { return d.getAttribute("data-theme") || (dark.matches ? "dark" : "light"); }

  function syncToggle() {
    if (toggle) toggle.setAttribute("aria-label", toggle.getAttribute("data-label-" + (resolved() === "dark" ? "light" : "dark")));
  }

  if (toggle) {
    syncToggle();
    toggle.addEventListener("click", function () {
      var mode = resolved() === "dark" ? "light" : "dark";
      d.setAttribute("data-theme", mode);
      put("localStorage", "theme", mode);
      /* One explicit theme-color, so mobile browser chrome follows the choice. */
      var metas = $$('meta[name="theme-color"]');
      for (var i = 1; i < metas.length; i++) metas[i].remove();
      if (metas[0]) { metas[0].removeAttribute("media"); metas[0].content = mode === "dark" ? "#161618" : "#f2eee3"; }
      syncToggle();
    });
    if (dark.addEventListener) dark.addEventListener("change", syncToggle);
  }

  /* ── Language: remember the choice, and keep your place ────────────── */
  /* The two versions differ in height (Persian has taller lines), so we
     note which chapter you are in and how far through it; restore.js puts
     you back there on the other side. */
  var sections = $$("main > section[id]");
  for (var li = 0, links = $$("[data-lang]"); li < links.length; li++) {
    links[li].addEventListener("click", function () {
      put("localStorage", "lang", this.getAttribute("data-lang"));
      var at = null;
      for (var i = 0; i < sections.length; i++) {
        var r = sections[i].getBoundingClientRect();
        if (r.top <= w.innerHeight * 0.3) at = { id: sections[i].id, f: Math.max(0, -r.top) / Math.max(1, r.height) };
      }
      if (at && w.scrollY > 0) put("sessionStorage", "pos", JSON.stringify(at));
    });
  }

  /* ── Email: assembled here, so the address is never whole in the HTML ─ */
  var mail = $("[data-mail-user]");
  if (mail) mail.href = "mailto:" + mail.getAttribute("data-mail-user") + "@" + mail.getAttribute("data-mail-domain");

  /* ── Range: the list of time scales becomes tabs ───────────────────── */
  var tabs = $("[data-tabs]"), scope = $("[data-scope]"), track = $("[data-track]");
  var flags = $$("[data-flag]"), items = [], panels = [];

  function select(i, focus) {
    for (var j = 0; j < items.length; j++) {
      var on = j === i;
      items[j].classList.toggle("is-on", on);
      items[j].setAttribute("aria-selected", on ? "true" : "false");
      items[j].tabIndex = on ? 0 : -1;
      panels[j].classList.toggle("is-on", on);
      if (flags[j]) flags[j].classList.toggle("is-on", on);
    }
    /* The camera dollies along the axis to the chosen scale (a CSS
       transition on --f does the travelling). */
    if (scope) scope.style.setProperty("--f", items[i].getAttribute("data-pos"));
    if (focus) items[i].focus();
  }

  if (tabs) {
    items = $$("a", tabs);
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-orientation", "vertical");
    tabs.setAttribute("aria-label", tabs.getAttribute("data-label"));
    var first = 0;
    for (var ti = 0; ti < items.length; ti++) {
      var item = items[ti], id = item.getAttribute("href").slice(1), panel = doc.getElementById(id);
      panels.push(panel);
      item.id = "tab-" + id;
      item.setAttribute("role", "tab");
      item.setAttribute("aria-controls", id);
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", item.id);
      if (location.hash === "#" + id) first = ti;
      item.addEventListener("click", function (e) {
        e.preventDefault();
        for (var i = 0; i < items.length; i++) if (items[i] === this) select(i);
      });
    }
    /* Arrow keys move between scales (either axis, in reading order),
       Home and End jump to the ends. */
    tabs.addEventListener("keydown", function (e) {
      var k = e.key, n = items.length, cur = 0, next;
      for (var i = 0; i < n; i++) if (items[i].classList.contains("is-on")) cur = i;
      if (k === "ArrowDown" || k === (rtl ? "ArrowLeft" : "ArrowRight")) next = cur + 1;
      else if (k === "ArrowUp" || k === (rtl ? "ArrowRight" : "ArrowLeft")) next = cur - 1;
      else if (k === "Home") next = 0;
      else if (k === "End") next = n - 1;
      else return;
      e.preventDefault();
      select((next + n) % n, true);
    });
    /* The flags on the timeline are a pointer shortcut to the same tabs. */
    for (var fi = 0; fi < flags.length; fi++) {
      flags[fi].addEventListener("click", function () { select(+this.getAttribute("data-flag")); });
    }
    select(first);
  }

  /* ── Focus and choreography ────────────────────────────────────────── */
  d.classList.add("has-focus");

  var wins = $$("[data-win]"), movers = $$("[data-depth]"), navs = $$("[data-nav]"), ghosts = $$("[data-ghost]");
  var hero = $(".hero"), meters = $("[data-budget]");
  var vw = 0, vh = 0, focusable = [], moving = [], secs = [], heroH = 1, scopeTop = 0, scopeH = 1, metersTop = 0;
  var active = null, current = null, ghostKey = "", scopeKey = "";
  var raf = 0;

  function measure() {
    vw = d.clientWidth;
    vh = w.innerHeight;
    var i;
    focusable = [];
    for (i = 0; i < wins.length; i++) focusable.push({ el: wins[i], top: top(wins[i]), h: wins[i].offsetHeight });
    moving = [];
    for (i = 0; i < movers.length; i++) moving.push({ el: movers[i], top: top(movers[i]), h: movers[i].offsetHeight, k: movers[i].k || "" });
    secs = [];
    for (i = 0; i < navs.length; i++) {
      var s = doc.getElementById(navs[i].getAttribute("data-nav"));
      if (s) secs.push({ a: navs[i], top: top(s) });
    }
    heroH = hero ? Math.max(1, hero.offsetHeight) : 1;
    if (scope) { scopeTop = top(scope); scopeH = scope.offsetHeight; }
    if (meters) metersTop = top(meters);
    kick();
  }

  function kick() { if (!raf) raf = w.requestAnimationFrame(frame); }

  function frame() {
    raf = 0;
    var y = w.scrollY, i, it;

    /* The active window is the one under the reading line, else the
       nearest. */
    var line = y + vh * 0.38, best = null, bestDist = Infinity;
    for (i = 0; i < focusable.length; i++) {
      it = focusable[i];
      var dist = line < it.top ? it.top - line : line > it.top + it.h ? line - it.top - it.h : 0;
      if (dist < bestDist) { bestDist = dist; best = it.el; }
    }
    if (best !== active) {
      if (active) active.classList.remove("is-active");
      active = best;
      if (best) best.classList.add("is-active");
    }

    /* The menu item for the chapter you are reading. */
    var cur = null;
    for (i = 0; i < secs.length; i++) if (secs[i].top <= y + vh * 0.35) cur = secs[i].a;
    if (cur !== current) {
      if (current) current.removeAttribute("aria-current");
      current = cur;
      if (cur) cur.setAttribute("aria-current", "location");
    }

    /* The budget meters fill the first time the monitor comes into view. */
    if (meters && metersTop < y + vh * 0.85) { meters.classList.add("is-seen"); meters = null; }

    if (full) {
      /* The spatial desk. A window arriving from below glides in from the
         reading-end side, set back in depth and turned toward the middle,
         and comes forward as its chapter arrives. Once you have read past
         it, it recedes and parks toward the start side as the next takes
         over — past to one side, future to the other. Anything spanning
         the middle of the screen is perfectly flat, so text stays crisp
         while you read. */
      var X = clamp(vw * 0.11, 36, 170);
      for (i = 0; i < moving.length; i++) {
        it = moving[i];
        var t = it.top - y, b = t + it.h;
        var e = smooth(vh * 0.5, vh * 1.05, t), l = smooth(vh * 0.42, -vh * 0.2, b);
        var k = e || l
          ? "perspective(1600px) translate3d(" + (dir * (e - 0.9 * l) * X).toFixed(1) + "px," + (e * 36 - l * 10).toFixed(1) + "px," +
            (-(e * 240 + l * 200)).toFixed(1) + "px) rotateY(" + (dir * (e * 9 - l * 7)).toFixed(2) + "deg)"
          : "";
        if (k !== it.k) {
          it.k = it.el.k = k;
          it.el.style.transform = k;
          it.el.style.opacity = k ? (1 - 0.3 * Math.max(e, l)).toFixed(3) : "";
        }
      }

      /* The windows stacked behind the manifesto fan out as you leave it. */
      var g = clamp(y / heroH, 0, 1).toFixed(3);
      if (g !== ghostKey) {
        ghostKey = g;
        for (i = 0; i < ghosts.length; i++) {
          var n = +ghosts[i].getAttribute("data-ghost");
          ghosts[i].style.transform = "translate3d(0," + (-(12 + g * 26) * n).toFixed(1) + "px,0) scale(" + (1 - g * 0.025 * n).toFixed(4) + ")";
        }
      }

      /* The timeline: as its window rises into view the camera pulls in
         along the axis toward the chosen scale, and the axis swings a few
         degrees as you scroll past. */
      if (scope && track) {
        var rel = scopeTop - y;
        var pull = (-0.14 * smooth(vh * 0.35, vh * 1.0, rel)).toFixed(4);
        var swing = (55 + 6 * clamp((rel + scopeH / 2 - vh / 2) / vh, -1, 1)).toFixed(2);
        var key = pull + "|" + swing;
        if (key !== scopeKey) {
          scopeKey = key;
          scope.style.setProperty("--g", pull);
          track.style.setProperty("--ry", swing + "deg");
        }
      }
    }
  }

  /* Reduced motion switched on mid-visit: everything stands down at once. */
  function standDown() {
    full = false;
    d.classList.remove("fx3d");
    for (var i = 0; i < moving.length; i++) { moving[i].el.style.transform = moving[i].el.style.opacity = ""; moving[i].k = moving[i].el.k = ""; }
    for (i = 0; i < ghosts.length; i++) ghosts[i].style.transform = "";
    if (track) track.style.removeProperty("--ry");
    if (scope) scope.style.removeProperty("--g");
    measure();
  }
  if (reduce.addEventListener) reduce.addEventListener("change", function () { if (reduce.matches && full) standDown(); });

  w.addEventListener("scroll", kick, { passive: true });
  w.addEventListener("resize", measure);
  w.addEventListener("load", measure);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(measure);
  /* Content can change height without a resize (a late font, a narrower
     scrollbar); re-measure whenever the page does. */
  if ("ResizeObserver" in w) new ResizeObserver(measure).observe(doc.body);
  measure();
})();
