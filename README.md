# mammadali.ir

Personal homepage of Mohammadali — computer engineering student and software
developer. Live at **[mammadali.ir](https://mammadali.ir)**, in English and
[Persian](https://mammadali.ir/fa/).

The site is an engineering manifesto rather than a portfolio: it describes how
I build software, not what I have built, and names no individual project. The
work it draws on runs from physics simulation and real-time audio to
cryptographic protocols, quantitative models, media pipelines, full-stack
platforms and typesetting, so the page is organised around what those share:
every system answers to a clock and a budget.

One page, five chapters: the thesis; **Range**, an interactive map of nine
time scales from a 2.7 ms audio buffer to the decades a secret must hold;
six principles, each with the mechanism that enforces it and a way to check
it; the process, with a budget monitor showing this page's own measured
sizes; and contact.

The design is a **desk with windows on it**. Light mode is warm paper and ink;
dark mode is graphite: charcoal surfaces, soft hairlines, warm greys and one
quiet blue. Every block of content is a desktop window with sculpted corners,
a title bar, window controls and layered elevation, under a translucent menu
bar. As you scroll, the windows hand over from chapter to chapter across the
desk.

It is a static site with **no framework and no dependencies**. A small Node
script pre-renders the page in both languages, and GitHub Actions publishes it
to GitHub Pages.

---

## Quick start

Requires Node 18 or newer. There is nothing to install.

```bash
npm run dev
```

Builds the site, serves it at <http://localhost:4173>, and rebuilds whenever
anything in `src/` changes.

```bash
npm run build
```

Writes the deployable site to `dist/` and prints a size report. The build
**fails** if the two languages don't match, a page goes over the performance
budget, or the Budget monitor would print a number that isn't true (all below).

```bash
npm run verify
```

Everything CI checks, in one command: the build (with its budget and
translation checks), the output files, the workflow file and the git history
rules described under [Shipping](#shipping).

---

## Editing content

Everything you are likely to change lives in `src/data/`.

| What | Where |
| --- | --- |
| Name, links, canonical origin | `site.mjs` |
| The time scales (and where each sits on the axis), principles and pipeline steps | `system.mjs` |
| The performance budget (enforced, and printed on the page) | `budget.mjs` |
| The toolbox | `stack.mjs` |
| Every word on the page | `i18n/en.mjs`, `i18n/fa.mjs` |

### Edit text or translations

`en.mjs` and `fa.mjs` must have exactly the same keys, with the same number of
entries in every list. Time scales, axis ticks, principles and steps are keyed
by the ids in `system.mjs`, which also sets their order. **The build checks all of this** and
names anything missing.

In Persian, keep the zero-width non-joiner (U+200C) in compound words
(`توسعه‌دهنده`, `می‌سازم`). Numbers the templates print — indexes, sizes,
percentages — come out in Persian digits, with the Persian decimal separator,
on `/fa/` automatically. Latin terms inside Persian text (`WebCrypto`,
`exportKey()`) are wrapped in `<bdi>` automatically, so they can't be
reordered by the bidi algorithm.

### Add a time scale, principle or step

Add its id to the list in `src/data/system.mjs`, then its text under the same
id in both translation files.

- A **time scale** has `seconds`, which places it on the logarithmic axis
  (1 ms to about a century), and text for its name, its value as shown, the
  domain, what a miss looks like, how it is designed for, and how it is
  checked. Keep the list sorted, shortest first.
- A **principle** has a name, a one-sentence statement, a paragraph of
  reasoning, and rows of `[rule, mechanism, how to check]`.

The page names no individual project, and that is deliberate: describe the
kind of system and its constraint, not the product.

### Show an email button

The contact window links to GitHub only, so nothing personal is published by
default. To add a "Send an email" button, replace `email: null` in
`src/data/site.mjs` with the commented-out object above it. The address is
assembled in the browser, so it never appears whole in the HTML.

---

## How it works

```
build.mjs                 the static site generator (Node standard library only)
src/
  data/                   site config, time scales and structure, budget, toolbox, translations
  templates/              layout, the home page, the 404, windows, icons
  assets/
    css/                  base.css + home.css or error.css + motion.css
    head.js               runs before first paint: theme, language, render budget
    restore.js            keeps your place when you switch language
    app.js                the interactive layer (deferred, content-hashed)
    fonts/                Vazirmatn subset for Persian + its licence
tools/
  serve.mjs               dev server with rebuild-on-change
  verify.mjs              npm run verify: everything CI checks
  rotate-workflow.mjs     npm run rotate:workflow: fresh workflow file name
  workflow.mjs            the naming rules both of those share
  make-images.sh          regenerates og.jpg and apple-touch-icon.png (macOS)
.github/workflows/
  <slug>-<stamp>.yml      the only workflow: verify → deploy to GitHub Pages
```

### Two languages, rendered properly

Each language is its own pre-rendered page (`/` and `/fa/`), not text swapped
in by JavaScript. So each page has the right `lang`/`dir` from the first byte,
search engines see both (with `hreflang` links and a bilingual sitemap), and
nothing flickers.

- **RTL is not an override layer.** All layout uses CSS logical properties, so
  the Persian page is the same rules, mirrored — window controls included, as
  on a Mac set to a right-to-left language.
- **Persian typography.** Vazirmatn (SIL OFL), cut down to the 400–700 weight
  range and to Persian and Latin glyphs: 33 KB, loaded only on Persian pages.
  Arabic script is never letter-spaced and has no case transforms, and roles
  that use a monospace face in English use Vazirmatn in Persian (no monospace
  face has Persian letters).
- **The switch.** EN | فا is two plain links, so it works without JavaScript.
  With JavaScript, your choice is remembered, and switching lands you in the
  same section, the same distance through it.
- **One 404 for both.** GitHub Pages serves a single `404.html` for every
  missing path, so it carries both languages and picks one from the URL or your
  saved preference.

### Windows

- **Anatomy.** Each window has a title bar (the three window controls, a
  centred title, sometimes an accessory such as a status), then its body.
- **Curvature.** Corners are sculpted rather than boxed: a 24px radius, and
  where the browser supports `corner-shape`, a continuous squircle curve whose
  visible radius lands in the same 22–28px range. Controls, tables and the
  404 alert follow the same family of curves.
- **Elevation** is layered: a hairline rim, a contact shadow and two soft
  ambient shadows, warm-tinted on paper and deeper on graphite, where a light
  inner rim separates the window from the dark desk.
- **Focus.** The window under your reading line is the active one: coloured
  controls and the deeper shadow. The others go grey and settle back, as
  inactive windows do. The menu bar marks the section you are in. Without
  JavaScript every window is active.
- **Tables are grids, not decoration.** Principles use a rule / mechanism /
  how-to-check grid that stacks into labelled rows on narrow screens; the
  budget monitor is a real `<table>`.

### Motion and 3D

No WebGL and no libraries: CSS 3D transforms driven by one
`requestAnimationFrame` loop that sleeps whenever nothing is changing. Layout
is read only when the page is measured (on load, resize and content changes);
each frame writes nothing but transforms, opacity, classes and a few custom
properties, so scrolling never triggers layout.

- **Chapter choreography.** The page reads as one continuous movement across a
  spatial desk, like windows handing over in Stage Manager. A window arriving
  from below glides in from the reading-end side, set back in depth and turned
  toward the middle, and comes forward to full size as its chapter arrives.
  Once you have read past it, it recedes along the Z axis and parks toward the
  start side as the next takes over: past to one side, future to the other.
  The direction mirrors on the Persian page. Anything spanning the middle of
  the screen is perfectly flat, so text stays crisp while you read. Motion
  maps straight to the scroll position, so it never lags behind your finger.
- **The Range timeline.** Flat, the map is a strip chart: a logarithmic axis,
  decade ticks, and a numbered flag per time scale, staggered so neighbours
  never collide. In 3D the axis becomes a timeline receding into depth —
  longer time is further away — with every flag turned back to face you.
  Selecting a scale dollies the camera along the axis to it (a transition on a
  registered custom property): what came before slides past and fades, what
  comes after draws closer. The camera also pulls in as the window rises into
  view, and the axis swings a few degrees as you scroll past. Under it is a
  list of links and panels: without JavaScript every panel is shown, and with
  it they are proper tabs with arrow-key navigation; the flags are a pointer
  shortcut to the same tabs.
- **The window stack.** The manifesto window has two windows stacked behind
  it, which fan out as it recedes.

**Render budget.** `head.js` decides before the first paint:

| Visitor | What they get |
| --- | --- |
| Default | Everything above |
| `prefers-reduced-motion: reduce` | Nothing moves: windows stay put, the Range map is the flat strip chart, meters don't animate, no page transition. Turning the setting on mid-visit stands everything down at once. |
| Constrained device (Save-Data, ≤ 2 GB RAM or ≤ 2 CPU cores) | No 3D layer, and a solid menu bar instead of live blur. |
| `prefers-reduced-transparency` | A solid menu bar. |
| No JavaScript | Fully readable and navigable: every window, every time-scale panel, working language links. |

### Performance budget

- **Everything needed to paint is inline:** CSS, the tiny pre-paint script, the
  markup. Each document ships only the CSS it uses, and there are no
  render-blocking requests.
- **The interactive layer is one external script,** `app.<hash>.js`, loaded
  with `defer`. It downloads in parallel and is shared by both languages and
  the 404. The hash in its name means a deploy can never pair new HTML with a
  stale cached copy.
- **English pages download no fonts.**

The build enforces three limits, gzipped, and fails if any is broken:

| Budget | Limit | Why |
| --- | --- | --- |
| First screen: head, CSS, menu bar, hero | **14 KB** | Fits in the first TCP round trip (initial window of 10 packets), so a cold visit paints without waiting on a second trip |
| Whole document | **28 KB** | |
| `app.js` | **6 KB** | |

**The page prints its own sizes.** The Budget monitor shows these limits next
to the sizes the build measured for that very page. Printing a number changes
the page's size, so the build renders, measures and renders again until the
printed numbers (to 0.1 KB) are the real ones, then reads them back out of the
finished HTML and fails if any differs. Right at a rounding boundary the two
can chase each other forever (print 17.9 and the page is 17.950 KB; print
18.0 and it is 17.949), so the build may add a few newlines after `</html>`
to move the page off the boundary. `npm run build` prints the same numbers.

### Deployment

The repository has exactly one workflow in `.github/workflows/`. Its file
name changes on every push (see Shipping). It runs on every push to `main`,
in two jobs:

1. **verify** runs `npm run verify`. There is no install step, because there
   are no dependencies. If it passes, it uploads `dist/`.
2. **deploy** publishes that artifact with the official GitHub Pages actions.

Two settings live in the repository's **Settings → Pages**, not in code:

- **Source: GitHub Actions.** With "Deploy from a branch" instead, GitHub
  would publish the raw repository, which has no `index.html` at its root.
- **Custom domain: `mammadali.ir`.** Deployments from Actions take the domain
  from this setting, not from the `CNAME` file. `CNAME` stays in the repository
  as the written record (`verify` checks it), but if the repository is ever
  recreated, enter the domain here again, then tick **Enforce HTTPS** once
  GitHub has issued the certificate.

### Shipping

`main` always holds exactly **one** commit, a root commit with no parents:

- message: `Initial commit: mammadali.ir`
- author and committer: `Noormohammadiazad <Noormohammadiazad@users.noreply.github.com>`
- no trailers or extra metadata in the message, and no other branches

Each release replaces that commit, and the workflow file gets a fresh name so
that every push starts again at run #1:

```bash
npm run rotate:workflow   # rename the workflow to <slug>-<UTC date>-<UTC time>.yml
git checkout --orphan next && git add -A
git commit -m "Initial commit: mammadali.ir"
git branch -D main && git branch -m main
npm run verify            # build, budgets, parity, workflow, history
git reflog expire --expire=now --expire-unreachable=now --all && git gc --prune=now --quiet
git push --force-with-lease origin main
```

`npm run verify` refuses a history with more than one commit, a different
message, any other identity, other local branches or `refs/original/*`
backups. CI runs the same check on every push.

### Images

`og.jpg` (the social card) and `apple-touch-icon.png` are generated from the
SVGs next to them by `tools/make-images.sh`, which uses tools that ship with
macOS (`qlmanage`, `sips`). The outputs are committed, so the build and CI never
rasterise anything. Run it only after you edit one of those SVGs.

The mark — in the menu bar, the favicon, the app icon and the social card — is
a **Reuleaux triangle** with its centre point: a curve of constant width, which
measures the same from whichever direction you take it. It is a precise,
abstract shape rather than an initial.

---

## Credits

- [Vazirmatn](https://github.com/rastikerdar/vazirmatn) by Saber Rastikerdar,
  under the SIL Open Font License 1.1. The licence ships with the site at
  `/assets/vazirmatn-OFL.txt`.
- Everything else is hand-written for this site.
