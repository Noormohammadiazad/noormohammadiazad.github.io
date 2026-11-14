# mammadali.ir

Personal homepage and portfolio of Mohammadali — computer engineering student
and software developer. Live at **[mammadali.ir](https://mammadali.ir)**, in
English and [Persian](https://mammadali.ir/fa/).

One page holds everything: every project explained in full (its philosophy,
its architecture, a spec sheet and an exploded 3D diagram), the principles they
share, and a little about me.

The look is **Web 1.0 × neo-brutalism**: exposed table grids, hard 2px borders,
offset shadows, a marquee, a status bar, a visitor counter and a working DOS
prompt — the soul of a 1997 homepage — in modern type, with a CSS‑3D wireframe
tunnel you fly through as you scroll. Dark mode is a CRT terminal; light mode is
paper and ink.

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
**fails** if the two languages don't match or a page goes over the performance
budget (both below).

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
| Name, links, monogram, canonical origin | `site.mjs` |
| The projects, in both languages | `projects.mjs` |
| The principles they share | `principles.mjs` |
| The toolbox table | `stack.mjs` |
| Every other word on the page | `i18n/en.mjs`, `i18n/fa.mjs` |

### Add, change or hide a project

Each project is one object in `src/data/projects.mjs`. Its order in the file
is its order on the page and in the directory listing. The comment at the top
of the file documents every field. In short:

```js
{
  id: 'my-project',          // section #p-my-project; `open my-project` in the terminal
  hue: 200,                  // its colour: title bar, diagram, tunnel tint
  status: 'live',            // 'live' | 'building' | 'unreleased' | 'archived'
  year: '2026',
  tags: ['TypeScript', 'React'],
  links: { site: 'https://…', repo: 'https://github.com/…' },   // both optional
  layers: [                  // the architecture, top to bottom
    { name: 'UI', en: 'what it does', fa: 'کاری که می‌کند' },
    // …
  ],
  en: { title, kind, tagline, philosophy, architecture, facts: [['Label', 'value'], …] },
  fa: { title, kind, tagline, philosophy, architecture, facts: [['برچسب', 'مقدار'], …] },
}
```

To take a project off the page without deleting what was written about it,
add `hidden: true`. Links to it from the principles disappear by themselves.

`building` adds the under-construction tape. When something you've marked
`unreleased` goes public, set its status and add its `links`.

### Edit text or translations

`en.mjs` and `fa.mjs` must have exactly the same keys, and every project and
principle must be written in both languages. **The build checks this** and
names anything missing. In Persian, keep the zero-width non-joiner (U+200C) in
compound words (`توسعه‌دهنده`, `می‌سازم`). Numbers the templates print —
section indexes, years, the visitor counter, the scroll percentage — come out
in Persian digits on `/fa/` automatically.

### Show an email button

The contact section links to GitHub only, so nothing personal is published by
default. To add a "Send an email" button, replace `email: null` in
`src/data/site.mjs` with the commented-out object above it. The address is
assembled in the browser, so it never appears whole in the HTML.

---

## How it works

```
build.mjs                 the static site generator (Node standard library only)
src/
  data/                   site config, projects, principles, stack, translations
  templates/              layout, the home page, the 404, shared parts, icons
  assets/
    css/                  base.css + home.css or error.css + motion.css
    head.js               runs before first paint: theme, language, motion budget
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
  the Persian page is the same rules, mirrored. Even the hard shadows flip
  sides, through a single `--sx` variable.
- **Persian typography.** Vazirmatn (SIL OFL), cut down to the 400–700 weight
  range and to Persian and Latin glyphs: 33 KB, loaded only on Persian pages.
  Arabic script is never letter-spaced or set in a Latin monospace face. Latin
  runs (project names, tech terms) are bidi-isolated so they can't scramble.
- **The switch.** EN | فا is two plain links, so it works without JavaScript.
  With JavaScript, your choice is remembered, and switching lands you in the
  same section, the same distance through it.
- **One 404 for both.** GitHub Pages serves a single `404.html` for every
  missing path, so it carries both languages and picks one from the URL or your
  saved preference.

### The 3D layer

No WebGL and no libraries: CSS 3D transforms (`perspective`, `preserve-3d`,
`translateZ`, `rotateX/Y/Z`) driven by one `requestAnimationFrame` loop. The
loop runs only while something is changing. It reads layout only when the page
is measured (on load and on resize). Each frame it writes nothing but
transforms, opacity and a few custom properties, so it never forces a layout.

- **The dive.** The hero is a window. Scroll, and it pins, rushes toward you
  and dissolves, and you come out in the tunnel with the projects ahead. This
  only happens on screens tall enough to hold the whole window; elsewhere the
  hero is an ordinary section.
- **The tunnel** is a fixed wireframe of 12 rings and 20 lines. Scrolling
  carries you through it, fast scrolling widens the field of view like a warp,
  and the pointer tilts it. Its colour follows the project you're reading. It
  is built from 1px-thin elements rather than textured planes, because a
  viewport-sized plane would cost tens of megabytes of GPU memory.
- **Exploded architecture.** Each project's layer list becomes an isometric
  stack that opens as it reaches the middle of the screen, turns as you scroll
  past, follows the pointer, and lifts the layer you hover. It's an `<ol>`
  underneath, so it reads correctly as plain text and prints flat.
- **Depth on scroll.** Windows and cards lie back as they enter and curl away as
  they leave. They are perfectly flat in the middle of the screen, so text stays
  crisp while you read.
- **Small things.** Titles decrypt out of noise as they appear (hover to replay).
  Cards press in under the pointer. The marquee speeds up while you scroll.
  The cube spins. The status bar shows the path of the section you're in
  (`C:\MAMMADALI\PROJECTS\TEXTOR.EXE`).
- **The prompt.** The hero has a working DOS prompt: `help`, `ls`,
  `open <project>`, `whoami`, `theme`, `lang`, `clear` — and the error message
  everyone remembers.

**Motion budget.** `head.js` decides how much motion a device gets, before the
first paint:

| Visitor | What they get |
| --- | --- |
| Default | Everything above |
| `prefers-reduced-motion: reduce` | Nothing moves. The tunnel becomes flat graph paper, the stacks become flat layer diagrams, the marquee becomes a static strip, the cube stops, titles don't scramble. Turning the setting on mid-visit stands everything down immediately. |
| Constrained device (Save-Data, ≤ 2 GB RAM or ≤ 2 CPU cores) | No tunnel, dive, depth or 3D stacks. The cheap effects stay: CSS animations, hover tilt, title decryption. |
| No JavaScript | Fully readable and navigable: flat grid, flat diagrams, working language links. No terminal and no counter. |

### Performance budget

- **Everything needed to paint is inline:** CSS, the tiny pre-paint script, the
  markup. Each document ships only the CSS it uses, and there are no
  render-blocking requests.
- **The interactive layer is one external script,** `app.<hash>.js`, loaded
  with `defer`. It downloads in parallel and is shared by both languages and
  the 404. The hash in its name means a deploy can never pair new HTML with a
  stale cached copy.
- **English pages download no fonts.** They use the system's own grotesque and
  monospace (SF / Segoe / Roboto, and SF Mono / Cascadia / Consolas / Menlo).

The build enforces three limits, gzipped, and fails if any is broken:

| Budget | Limit | Why |
| --- | --- | --- |
| First screen: head, CSS, header, hero | **14 KB** | Fits in the first TCP round trip (initial window of 10 packets), so a cold visit paints without waiting on a second trip |
| Whole document, every project included | **28 KB** | |
| `app.js` | **6 KB** | |

`npm run build` prints the current numbers.

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
git push --force origin main
```

`npm run verify` refuses a history with more than one commit, a different
message, any other identity, other local branches or `refs/original/*`
backups. CI runs the same check on every push.

### Images

`og.jpg` (the social card) and `apple-touch-icon.png` are generated from the
SVGs next to them by `tools/make-images.sh`, which uses tools that ship with
macOS (`qlmanage`, `sips`). The outputs are committed, so the build and CI never
rasterise anything. Run it only after you edit one of those SVGs.

---

## Credits

- [Vazirmatn](https://github.com/rastikerdar/vazirmatn) by Saber Rastikerdar,
  under the SIL Open Font License 1.1. The licence ships with the site at
  `/assets/vazirmatn-OFL.txt`.
- Everything else is hand-written for this site.
