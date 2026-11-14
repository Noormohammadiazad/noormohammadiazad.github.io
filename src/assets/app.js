/* Progressive enhancement only. With JavaScript disabled the page still
   renders, navigates and reads correctly. Loaded with `defer` from a
   content-hashed URL, so it never blocks rendering and is fetched once per
   session.

   It adds: the theme toggle, language memory, the visitor counter, the
   terminal, and the motion layer. Everything that moves is driven by one
   requestAnimationFrame loop that runs only while something is changing,
   reads layout only in measure(), and writes nothing but transforms,
   opacity and a few custom properties — compositor work, not layout. */
(function () {
  var d = document.documentElement, doc = document, w = window;
  var fa = d.lang === "fa", rtl = d.dir === "rtl";
  var FA = "۰۱۲۳۴۵۶۷۸۹";

  function num(s) { s = String(s); return fa ? s.replace(/\d/g, function (c) { return FA[c]; }) : s; }
  function get(area, k) { try { return w[area].getItem(k); } catch (e) { return null; } }
  function put(area, k, v) { try { w[area].setItem(k, v); return true; } catch (e) { return false; } }
  function $(s, root) { return (root || doc).querySelector(s); }
  function $$(s) { return doc.querySelectorAll(s); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(a, b, x) { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); }
  /* Layout position, ignoring transforms, so effects never feed back. */
  function pos(el) { var y = 0, x = 0; while (el) { y += el.offsetTop; x += el.offsetLeft; el = el.offsetParent; } return [y, x]; }

  var reduce = w.matchMedia("(prefers-reduced-motion: reduce)");
  var fine = w.matchMedia("(hover: hover) and (pointer: fine)");
  var full = d.classList.contains("fx3d");   /* tunnel, dive, depth, stacks (head.js decides) */
  var motion = !reduce.matches;               /* tilt and scramble: cheap, so lite devices keep them */

  /* ── Theme ─────────────────────────────────────────────────────────── */
  var dark = w.matchMedia("(prefers-color-scheme: dark)");
  var toggle = $("[data-theme-toggle]");

  function resolved() { return d.getAttribute("data-theme") || (dark.matches ? "dark" : "light"); }

  function syncToggle() {
    if (toggle) toggle.setAttribute("aria-label", toggle.getAttribute("data-label-" + (resolved() === "dark" ? "light" : "dark")));
  }

  function toggleTheme() {
    var mode = resolved() === "dark" ? "light" : "dark";
    d.setAttribute("data-theme", mode);
    put("localStorage", "theme", mode);
    /* One explicit theme-color, so mobile browser chrome follows the choice. */
    var metas = $$('meta[name="theme-color"]');
    for (var i = 1; i < metas.length; i++) metas[i].remove();
    if (metas[0]) { metas[0].removeAttribute("media"); metas[0].content = mode === "dark" ? "#000022" : "#f2eee3"; }
    syncToggle();
    return mode;
  }

  if (toggle) {
    syncToggle();
    toggle.addEventListener("click", toggleTheme);
    if (dark.addEventListener) dark.addEventListener("change", syncToggle);
  }

  /* ── Language: remember the choice, and keep your place ────────────── */
  /* The two versions differ in height (Persian has taller lines), so we
     note which section you are in and how far through it; restore.js puts
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

  /* ── Header gets a hard shadow once the page scrolls ────────────────── */
  var header = $(".site-header"), sentinel = $("[data-header-sentinel]");
  if (header && sentinel && "IntersectionObserver" in w) {
    new IntersectionObserver(function (en) { header.setAttribute("data-stuck", String(!en[0].isIntersecting)); }).observe(sentinel);
  }

  /* ── Email: assembled here, so the address is never whole in the HTML ─ */
  var mail = $("[data-mail-user]");
  if (mail) mail.href = "mailto:" + mail.getAttribute("data-mail-user") + "@" + mail.getAttribute("data-mail-domain");

  /* ── Visitor counter ───────────────────────────────────────────────── */
  /* A static site has nowhere to keep a global count, and a fake number
     would be a lie. This counts *your* visits, in your browser, once per
     session, and never sends it anywhere. */
  var counter = $("[data-visits]");
  if (counter) {
    var visits = parseInt(get("localStorage", "visits"), 10) || 0;
    if (!get("sessionStorage", "counted") && put("localStorage", "visits", visits + 1)) {
      visits++;
      put("sessionStorage", "counted", "1");
    }
    if (visits > 0) {
      var dg = ("000000" + Math.min(visits, 999999)).slice(-6), cells = "";
      for (var di = 0; di < 6; di++) cells += "<b>" + num(dg[di]) + "</b>";
      $("[data-visits-digits]", counter).innerHTML = cells;
      counter.hidden = false;
    }
  }

  /* ── Terminal ──────────────────────────────────────────────────────── */
  var term = $("[data-term]");
  if (term) {
    var T = JSON.parse(term.getAttribute("data-term"));
    var tin = $("input", term), tout = $("[data-term-out]", term);
    var ALIAS = { "?": "help", "راهنما": "help", dir: "ls", "فهرست": "ls", cd: "open", "باز": "open", cls: "clear", "پاک": "clear", en: "lang", fa: "lang", "زبان": "lang", "پوسته": "theme" };

    var say = function (text) {
      var line = doc.createElement("div");
      line.dir = "auto";
      line.textContent = text;
      tout.appendChild(line);
      while (tout.childNodes.length > 12) tout.removeChild(tout.firstChild);
      tout.scrollTop = tout.scrollHeight;
    };

    /* Projects come from the page itself, so the terminal never drifts
       from the data file. */
    var files = function () {
      var out = {}, n = $$("[data-project]");
      for (var i = 0; i < n.length; i++) out[n[i].getAttribute("data-project")] = n[i].getAttribute("data-path").split("\\").pop();
      return out;
    };

    var open = function (name, list) {
      var key = (name || "").replace(/\.(exe|htm)$/, "");
      if (!list[key]) return say(T.noProject + " " + (name || "?"));
      say(T.opening + " " + list[key] + "…");
      doc.getElementById("p-" + key).scrollIntoView({ behavior: motion ? "smooth" : "auto" });
    };

    term.hidden = false;
    term.addEventListener("submit", function (e) {
      e.preventDefault();
      var raw = tin.value.trim();
      tin.value = "";
      if (!raw) return;
      say("C:\\> " + raw);
      var words = raw.toLowerCase().split(/\s+/), cmd = ALIAS[words[0]] || words[0], list = files();
      if (cmd === "help") say(T.help);
      else if (cmd === "ls") say(Object.keys(list).map(function (k) { return list[k]; }).join("  "));
      else if (cmd === "open") open(words[1], list);
      else if (cmd === "whoami") say(T.whoami);
      else if (cmd === "theme") say(T.theme[toggleTheme()]);
      else if (cmd === "lang") { var other = $(".seg__item:not([aria-current])"); if (other) other.click(); }
      else if (cmd === "clear") tout.textContent = "";
      else if (cmd === "sudo") say(T.sudo);
      else if (list[cmd.replace(/\.(exe|htm)$/, "")]) open(cmd, list);
      else say(T.bad);
    });
  }

  /* ── Motion ────────────────────────────────────────────────────────── */
  var vw = w.innerWidth, vh = w.innerHeight, docH = 1;
  var ticking = false, lastY = w.scrollY, fov = 420, lastFov = "";
  var px = 0, py = 0, tpx = 0, tpy = 0, hovered = null, hoverStack = null, lastScr = null;

  /* Status bar: progress, and the "path" of the section you are in. */
  var mask = $("[data-meter]"), pctEl = $("[data-pct]"), lastPct = -1;
  var pathOut = $("[data-path-out]"), ready = pathOut ? pathOut.textContent : "", lastPath = 0, lastHue = 0;

  /* The wireframe tunnel. Built here rather than shipped in the HTML: it is
     pure decoration, and only exists when the device gets the full budget. */
  var RINGS = 12, GAP = 240, tunnel = null, rig = null, rings = null;

  function buildTunnel() {
    var h = '<div class="tunnel__rig"><div class="tunnel__rings">', i, x;
    for (i = 0; i < RINGS; i++) h += '<i class="tunnel__ring" style="transform:translateZ(' + -i * GAP + 'px)"></i>';
    h += "</div>";
    for (i = 0; i <= 6; i++) {
      x = (i * 100 / 6).toFixed(3);
      h += '<i class="tunnel__line tunnel__line--f" style="left:' + x + '%"></i><i class="tunnel__line tunnel__line--c" style="left:' + x + '%"></i>';
    }
    for (i = 1; i <= 3; i++) {
      h += '<i class="tunnel__line tunnel__line--l" style="top:' + i * 25 + '%"></i><i class="tunnel__line tunnel__line--r" style="top:' + i * 25 + '%"></i>';
    }
    tunnel = doc.createElement("div");
    tunnel.className = "tunnel";
    tunnel.setAttribute("aria-hidden", "true");
    tunnel.innerHTML = h + '</div><div class="tunnel__fog"></div>';
    doc.body.insertBefore(tunnel, doc.body.firstChild);
    rig = tunnel.firstChild;
    rings = rig.firstChild;
    w.requestAnimationFrame(function () { tunnel.className += " is-on"; });
  }

  /* Everything the loop animates, with cached layout positions. */
  function collect(sel, key, make) {
    var out = [], n = $$(sel);
    for (var i = 0; i < n.length; i++) { var o = make(n[i]); o.el = n[i]; if (key) n[i][key] = o; out.push(o); }
    return out;
  }
  var items = collect("[data-depth], [data-tilt]", "_fx", function (el) {
    return { depth: el.hasAttribute("data-depth"), top: 0, h: 1, cx: 0, amp: 1, hx: 0, hy: 0, tx: 0, ty: 0, last: "" };
  });
  var stacks = collect("[data-stack]", "_st", function () { return { top: 0, h: 1, spin: 0, tspin: 0, last: "", g: "" }; });
  var scrams = collect("[data-scramble]", "_sc", function (el) { return { text: el.textContent, top: 0, h: 1, start: 0, done: false }; });
  var marks = collect("[data-path]", "", function (el) { return { path: el.getAttribute("data-path"), hue: el.getAttribute("data-hue"), top: 0 }; });

  /* The dive: the hero's window pins, then flies at you as you scroll. */
  var hero = $("[data-dive]"), stage = hero && $(".hero__stage", hero), heroWin = stage && $(".hero__win", stage);
  var dive = null, diveLast = "";

  var cube = $("[data-cube]");
  var track = $(".marquee__track"), marquee = null, rate = 1, sentRate = 1;
  if (track && track.getAnimations && motion) marquee = track.getAnimations()[0] || null;

  /* Size the dive to the window (see home.css): the section is the window
     plus 70% of a screen of scroll, and the window pins below the header —
     or, if it is taller than the screen, with its bottom on the bottom edge,
     so all of it is read before it flies. Only writes when a value changes,
     so the resize it causes settles at once. */
  var stageH = "", stageTop = "";
  function fitDive() {
    if (!hero || !full) return;
    var rem = parseFloat(getComputedStyle(d).fontSize), h = stage.offsetHeight;
    var sh = Math.round(h + parseFloat(getComputedStyle(hero).paddingTop)) + "px";
    /* 2.5rem keeps the window's bottom edge clear of the status bar. */
    var top = Math.round(Math.min(5.5 * rem, w.innerHeight - h - 2.5 * rem)) + "px";
    if (sh !== stageH) { stageH = sh; hero.style.setProperty("--stage-h", sh); }
    if (top !== stageTop) { stageTop = top; hero.style.setProperty("--stage-top", top); }
  }

  function measure() {
    fitDive();
    vw = w.innerWidth;
    vh = w.innerHeight;
    docH = Math.max(1, d.scrollHeight - vh);
    dive = null;
    if (full && hero && getComputedStyle(stage).position === "sticky") {
      var pad = parseFloat(getComputedStyle(hero).paddingTop);
      dive = {
        start: pos(hero)[0] + pad - parseFloat(getComputedStyle(stage).top),
        len: Math.max(1, hero.offsetHeight - pad - stage.offsetHeight)
      };
    }
    var i, o, p;
    for (i = 0; i < items.length; i++) {
      o = items[i];
      p = pos(o.el);
      o.top = p[0];
      o.h = o.el.offsetHeight || 1;
      o.cx = clamp((p[1] + o.el.offsetWidth / 2) / vw * 2 - 1, -1, 1);
      o.amp = Math.min(1, 560 / o.h);          /* tall blocks tilt less */
      o.skip = !!dive && o.el === heroWin;      /* the dive drives that one */
    }
    for (i = 0; i < stacks.length; i++) { o = stacks[i]; o.top = pos(o.el.parentNode)[0]; o.h = o.el.parentNode.offsetHeight || 1; }
    for (i = 0; i < scrams.length; i++) { o = scrams[i]; o.top = pos(o.el)[0]; o.h = o.el.offsetHeight || 1; }
    for (i = 0; i < marks.length; i++) marks[i].top = pos(marks[i].el)[0];
    request();
  }

  function request() {
    if (!ticking) { ticking = true; w.requestAnimationFrame(frame); }
  }

  /* Decryption effect: characters resolve left to right out of noise. */
  var LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@<>/\\=+*";
  var PERSIAN = "ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی۰۱۲۳۴۵۶۷۸۹";
  function scramble(text, t) {
    var set = /[\u0600-\u06ff]/.test(text) ? PERSIAN : LATIN, out = "", n = text.length;
    for (var i = 0; i < n; i++) {
      var c = text[i];
      out += /[\s\u200c.\-–—·]/.test(c) || i / n < t * 1.25 - 0.25 ? c : set[(Math.random() * set.length) | 0];
    }
    return out;
  }

  function frame() {
    ticking = false;
    var y = w.scrollY, again = false, i, o, tf, now = performance.now();
    var vel = y - lastY;
    lastY = y;

    /* Status bar: progress meter, percentage, section path. */
    var p = clamp(y / docH, 0, 1), pct = Math.round(p * 100);
    if (mask) mask.style.transform = "translateX(" + (rtl ? -p : p) * 100 + "%)";
    if (pctEl && pct !== lastPct) { lastPct = pct; pctEl.textContent = fa ? num(pct) + "٪" : pct + "%"; }
    var cur = null;
    for (i = 0; i < marks.length; i++) if (marks[i].top <= y + vh * 0.4) cur = marks[i];
    var path = cur ? "C:\\MAMMADALI\\" + cur.path : ready;
    if (pathOut && path !== lastPath) { lastPath = path; pathOut.textContent = path; pathOut.dir = cur ? "ltr" : ""; }

    /* Pointer, eased. */
    px += (tpx - px) * 0.08;
    py += (tpy - py) * 0.08;
    if (Math.abs(tpx - px) > 0.001 || Math.abs(tpy - py) > 0.001) again = true;

    /* The dive. Ease-in on depth, so it starts gently and then rushes. */
    var dp = 0;
    if (dive) {
      dp = clamp((y - dive.start) / dive.len, 0, 1);
      tf = dp ? "perspective(900px) translateZ(" + (dp * dp * 640).toFixed(1) + "px) rotateX(" + (dp * -9).toFixed(2) + "deg)" : "";
      if (tf !== diveLast) {
        diveLast = tf;
        heroWin.style.transform = tf;
        heroWin.style.opacity = dp > 0.5 ? (1 - smooth(0.5, 0.95, dp)).toFixed(3) : "";
        heroWin.style.visibility = dp >= 1 ? "hidden" : "";
      }
    }

    if (full && rings) {
      /* Fly forward: rings advance with scroll and wrap every GAP, which
         reads as an endless tunnel. The dive adds a burst of speed; fast
         scrolling widens the field of view, like a warp. */
      rings.style.transform = "translateZ(" + ((y * 0.45 + dp * 6 * GAP) % GAP).toFixed(1) + "px)";
      rig.style.transform = "rotateX(" + (py * -4).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg)";
      var goal = 420 - Math.min(Math.abs(vel), 60) * 2 - Math.sin(dp * Math.PI) * 150;
      fov += (goal - fov) * 0.12;
      if (Math.abs(goal - fov) > 0.5) again = true;
      var fv = fov.toFixed(0) + "px";
      if (fv !== lastFov) { lastFov = fv; tunnel.style.perspective = fv; }
      /* Tint: the colour of the project you are reading. */
      var hue = cur && cur.hue ? cur.hue : "145";
      if (hue !== lastHue) { lastHue = hue; tunnel.style.setProperty("--hue", hue); }
    }

    if (full && cube) {
      cube.style.transform = "rotateX(" + (-24 - py * 16).toFixed(1) + "deg) rotateY(" + (-36 + px * 40 + y * 0.15).toFixed(1) + "deg)";
    }

    /* Marquee speeds up while you scroll, then settles. */
    if (marquee) {
      rate += (1 + Math.min(Math.abs(vel) / 8, 5) - rate) * 0.15;
      if (rate - 1 > 0.01) again = true; else rate = 1;
      if (Math.abs(rate - sentRate) > 0.05 || (rate === 1 && sentRate !== 1)) {
        if (marquee.updatePlaybackRate) marquee.updatePlaybackRate(rate); else marquee.playbackRate = rate;
        sentRate = rate;
      }
    }

    /* Depth on scroll + hover tilt. Flat in the middle of the screen, so
       text is crisp while you read; lying back as a block enters from
       below and curling away as it leaves — pages on a drum. */
    for (i = 0; i < items.length; i++) {
      o = items[i];
      if (o.skip) continue;
      var rx = 0, ry = 0, z = 0;
      if (full && o.depth) {
        var c = (o.top + o.h / 2 - y - vh / 2) / (vh / 2 + o.h / 2);
        if ((c < -1.15 || c > 1.15) && o !== hovered && !o.hx && !o.hy) continue;
        c = clamp(c, -1, 1);
        var q = smooth(0.3, 1, Math.abs(c));
        rx = (c < 0 ? -q : q) * 18 * o.amp;
        ry = -o.cx * q * 10 * o.amp;   /* turn toward the centre, like the tunnel walls */
        z = -q * 160;
      }
      if (motion) {
        o.hx += (o.tx - o.hx) * 0.14;
        o.hy += (o.ty - o.hy) * 0.14;
        if (Math.abs(o.tx - o.hx) > 0.02 || Math.abs(o.ty - o.hy) > 0.02) again = true;
        else { o.hx = o.tx; o.hy = o.ty; }
        rx += o.hx;
        ry += o.hy;
      }
      tf = rx || ry || z ? "perspective(1000px) translateZ(" + z.toFixed(1) + "px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)" : "";
      if (tf !== o.last) { o.el.style.transform = tf; o.last = tf; }
    }

    /* Architecture stacks open as they reach the middle of the screen,
       turn as you scroll past, and follow the pointer when you hover. */
    if (full) {
      for (i = 0; i < stacks.length; i++) {
        o = stacks[i];
        var s = (o.top + o.h / 2 - y - vh / 2) / (vh / 2 + o.h / 2);
        o.spin += (o.tspin - o.spin) * 0.1;
        if (Math.abs(o.tspin - o.spin) > 0.05) again = true;
        if (s < -1.2 || s > 1.2) continue;
        var e = 1 - smooth(0.15, 0.9, Math.abs(s));
        tf = "rotateX(" + (58 - 6 * e).toFixed(2) + "deg) rotateZ(" + (-36 + clamp(s, -1, 1) * 28 + o.spin).toFixed(2) + "deg)";
        if (tf !== o.last) { o.el.style.transform = tf; o.last = tf; }
        var g = (8 + 44 * e).toFixed(1);
        if (g !== o.g) { o.el.style.setProperty("--gap", g + "px"); o.g = g; }
      }
    }

    /* Titles decrypt when they first scroll into view. */
    if (motion) {
      for (i = 0; i < scrams.length; i++) {
        o = scrams[i];
        if (o.done) continue;
        if (!o.start) {
          if (o.top < y + vh * 0.88 && o.top + o.h > y) o.start = now; else continue;
        }
        var t = (now - o.start) / 700;
        if (t >= 1) { o.el.textContent = o.text; o.done = true; }
        else { o.el.textContent = scramble(o.text, t); again = true; }
      }
    }

    if (again) request();
  }

  w.addEventListener("scroll", request, { passive: true });
  w.addEventListener("resize", measure);
  if ("ResizeObserver" in w) new ResizeObserver(measure).observe(doc.body);
  w.addEventListener("load", measure);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(measure);

  if (motion && fine.matches) {
    doc.addEventListener("pointermove", function (e) {
      tpx = e.clientX / vw - 0.5;
      tpy = e.clientY / vh - 0.5;
      var tg = e.target, r;

      /* Cards press in under the pointer, like the buttons do. */
      var t = tg.closest ? tg.closest("[data-tilt]") : null, it = t && t._fx;
      if (hovered && hovered !== it) { hovered.tx = hovered.ty = 0; hovered = null; }
      if (it) {
        r = t.getBoundingClientRect();
        it.tx = ((e.clientY - r.top) / r.height - 0.5) * -8;
        it.ty = ((e.clientX - r.left) / r.width - 0.5) * 10;
        hovered = it;
      }

      /* Stacks turn to follow the pointer across their figure. */
      var f = tg.closest ? tg.closest("[data-arch]") : null, st = f && $("[data-stack]", f)._st;
      if (hoverStack && hoverStack !== st) hoverStack.tspin = 0;
      if (st) { r = f.getBoundingClientRect(); st.tspin = ((e.clientX - r.left) / r.width - 0.5) * 70; }
      hoverStack = st;

      /* Hovering a title decrypts it again. */
      var sc = tg.closest ? tg.closest("[data-scramble]") : null;
      if (sc && sc !== lastScr && sc._sc.done) { sc._sc.done = false; sc._sc.start = performance.now(); }
      lastScr = sc;

      request();
    }, { passive: true });

    d.addEventListener("mouseleave", function () {
      tpx = tpy = 0;
      if (hovered) { hovered.tx = hovered.ty = 0; hovered = null; }
      if (hoverStack) { hoverStack.tspin = 0; hoverStack = null; }
      request();
    });
  }

  /* Reduced motion switched on mid-visit: stand everything down. */
  function standDown() {
    full = motion = false;
    d.classList.remove("fx3d");
    if (tunnel) { tunnel.remove(); tunnel = rig = rings = null; }
    if (cube) cube.style.transform = "";
    if (heroWin) heroWin.style.cssText = "";
    dive = null;
    var all = items.concat(stacks), i;
    for (i = 0; i < all.length; i++) { all[i].el.style.transform = ""; all[i].last = ""; }
    for (i = 0; i < stacks.length; i++) { stacks[i].el.style.removeProperty("--gap"); stacks[i].g = ""; }
    for (i = 0; i < scrams.length; i++) { scrams[i].el.textContent = scrams[i].text; scrams[i].done = true; }
    if (marquee) { if (marquee.updatePlaybackRate) marquee.updatePlaybackRate(1); marquee = null; }
    measure();
  }
  if (reduce.addEventListener) reduce.addEventListener("change", function () { if (reduce.matches) standDown(); });

  if (full) buildTunnel();
  measure();
  /* Titles already on screen at load are left alone: they were painted
     before this script ran, and scrambling them now would just flicker. */
  for (var si = 0; si < scrams.length; si++) {
    var so = scrams[si];
    if (so.top < w.scrollY + vh && so.top + so.h > w.scrollY) so.done = true;
  }
})();
