import { site } from '../data/site.mjs';
import { shown as projects } from '../data/projects.mjs';
import { principles } from '../data/principles.mjs';
import { stack } from '../data/stack.mjs';
import { icons } from './icons.mjs';
import { esc, map, digits, index } from './util.mjs';
import { win, secHead, cube } from './parts.mjs';

/** "TEXTOR.EXE": how a project appears as a file in the retro chrome. */
const file = (p) => p.id.toUpperCase() + (p.ext || '.EXE');

const badge = (p, t) => `<span class="badge badge--${p.status}">${esc(t.status[p.status])}</span>`;

const hazard = (t) =>
  `<div class="hazard" aria-hidden="true"><span>${icons.warn}${esc(t.chrome.underConstruction)}${icons.warn}</span></div>`;

const tags = (list) => `<ul class="tags">${map(list, (tag) => `<li><span class="lat">${esc(tag)}</span></li>`)}</ul>`;

/* ── Hero ──────────────────────────────────────────────────────────────── */

/* The hero is a window. With the full motion budget on a large screen it
   becomes a "dive": the section grows taller, the window pins, and
   scrolling flies you through the screen into the tunnel (see app.js). */
function hero(locale, t) {
  const alt = locale === 'en' ? site.shortName.fa : site.shortName.en;
  const altLang = locale === 'en' ? 'fa' : 'en';
  const altDir = locale === 'en' ? 'rtl' : 'ltr';

  const specs = map(
    t.hero.specs,
    (row, i) => `<tr><th scope="row">${esc(row.k)}</th><td>${
      i === t.hero.specs.length - 1 ? '<i class="dot dot--blink" aria-hidden="true"></i>' : ''
    }${esc(row.v)}</td></tr>`
  );

  /* A real prompt. It is hidden until app.js wires it up, so without
     JavaScript there is no dead input on the page. */
  const term = `<form class="term" data-term="${esc(JSON.stringify(t.term))}" hidden>
      <div class="term__out" data-term-out aria-live="polite"></div>
      <label class="term__line" dir="ltr"><span class="code term__ps" aria-hidden="true">C:\\&gt;</span><input class="term__in" name="cmd" dir="auto" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="send" placeholder="${esc(t.term.hint)}" aria-label="${esc(t.term.label)}"></label>
    </form>`;

  return `<section class="hero" id="intro" data-dive>
  <div class="wrap hero__stage">
    ${win({
      title: 'C:\\MAMMADALI\\INDEX.HTM',
      cls: 'hero__win',
      attrs: ' data-depth',
      body: `<div class="win__body hero__body">
    <p class="hero__prompt" aria-hidden="true"><span class="code"><span class="hero__ps">C:\\&gt;</span> ${esc(t.hero.prompt)}<span class="cursor"></span></span></p>
    ${cube(['M', 'م', '&lt;/&gt;', icons.star, '', ''])}
    <h1 class="hero__name" data-scramble>${esc(site.shortName[locale])}</h1>
    <p class="hero__alt"><span lang="${altLang}" dir="${altDir}">${esc(alt)}</span></p>
    <p class="hero__lead">${esc(t.hero.lead)}</p>
    <div class="actions hero__actions">
      <a class="btn btn--primary" href="#projects">${esc(t.hero.primaryCta)}${icons.arrowRight}</a>
      <a class="btn" href="${site.links.github}" rel="me noopener">${icons.github}${esc(t.hero.secondaryCta)}</a>
    </div>
    <table class="table specs">
      <caption>${esc(t.hero.specsLabel)}</caption>
      <tbody>${specs}</tbody>
    </table>
    ${term}
  </div>`,
    })}
  </div>
</section>`;
}

/* ── Projects ──────────────────────────────────────────────────────────── */

/** The directory listing: every project on one screen, linked to its file. */
function dir(locale, t) {
  const rows = map(
    projects,
    (p) => `<tr><td><a class="code" href="#p-${p.id}">${file(p)}</a></td><td>${esc(p[locale].kind)}</td><td>${badge(p, t)}</td><td>${esc(digits(locale, p.year))}</td></tr>`
  );

  return win({
    cls: 'dir',
    attrs: ' data-depth',
    title: 'C:\\PROJECTS',
    body: `<div class="win__body">
    <p class="dir__cmd code" aria-hidden="true">C:\\PROJECTS&gt; dir</p>
    <table class="table dir__table">
      <thead><tr>${t.projects.dirHead.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="dir__sum"><span class="code">${esc(t.projects.dirSummary.replace('{n}', digits(locale, projects.length)))}</span><a href="${site.links.github}" rel="noopener">${icons.github}${esc(t.projects.allRepos)}${icons.arrowRight}</a></p>
  </div>`,
  });
}

/**
 * One project, in full. The architecture is an ordered list, top layer
 * first, so it reads correctly as plain text; CSS turns it into an exploded
 * 3D stack when the device has the motion budget for it, and a flat layer
 * diagram when it does not.
 */
function caseFile(locale, t, p) {
  const c = p[locale];
  const n = p.layers.length;
  const layers = p.layers
    .map((l, i) => `<li style="--z:${n - 1 - i}"><b class="code">${esc(l.name)}</b><span>${esc(l[locale])}</span></li>`)
    .join('');
  const facts = c.facts.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');

  const links = [
    p.links.site &&
      `<a class="btn btn--primary" href="${esc(p.links.site)}" rel="noopener">${esc(t.projects.open)} <span class="lat">${esc(new URL(p.links.site).host)}</span>${icons.external}</a>`,
    p.links.repo && `<a class="btn" href="${esc(p.links.repo)}" rel="noopener">${icons.github}${esc(t.projects.source)}</a>`,
  ].filter(Boolean);

  return win({
    tag: 'article',
    cls: 'case',
    title: `C:\\PROJECTS\\${file(p)}`,
    attrs: ` id="p-${p.id}" data-project="${p.id}" data-hue="${p.hue}" data-path="PROJECTS\\${file(p)}" data-depth style="--hue:${p.hue}"`,
    body: `${p.status === 'building' ? hazard(t) : ''}
  <div class="win__body case__body">
    <header class="case__head">
      <p class="case__meta"><span class="label">${esc(c.kind)}</span>${badge(p, t)}<span class="case__year">${esc(digits(locale, p.year))}</span></p>
      <h3 class="case__title"><span class="lat" data-scramble>${esc(c.title)}</span></h3>
      <p class="case__tagline">${esc(c.tagline)}</p>
    </header>
    <div class="case__grid">
      <div class="case__text">
        <h4>${esc(t.projects.philosophy)}</h4>
        <p>${esc(c.philosophy)}</p>
        <h4>${esc(t.projects.architecture)}</h4>
        <p>${esc(c.architecture)}</p>
        <table class="table case__facts"><caption>${esc(t.projects.specSheet)}</caption><tbody>${facts}</tbody></table>
        ${tags(p.tags)}
        ${links.length ? `<div class="actions">${links.join('')}</div>` : ''}
      </div>
      <figure class="arch" data-arch>
        <ol class="arch__stack" data-stack>${layers}</ol>
        <figcaption>${esc(t.projects.stackCaption)}</figcaption>
      </figure>
    </div>
  </div>`,
  });
}

function projectsSection(locale, t) {
  return `<section class="sec" id="projects" data-path="PROJECTS">
  <div class="wrap">
    ${secHead(locale, 0, t.projects.kicker, t.projects.title)}
    <p class="sec-intro">${esc(t.projects.intro)}</p>
    ${dir(locale, t)}
    <div class="cases">
    ${projects.map((p) => caseFile(locale, t, p)).join('\n')}
    </div>
  </div>
</section>`;
}

/* ── Principles ────────────────────────────────────────────────────────── */

function principlesSection(locale, t) {
  const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
  const rules = principles.map((r, i) => {
    const seen = r.seen
      .filter((id) => byId[id])
      .map((id) => `<a class="lat" href="#p-${id}">${esc(byId[id][locale].title)}</a>`)
      .join(' · ');
    return `<article class="rule" data-depth data-tilt>
      <p class="rule__num" aria-hidden="true">${index(locale, i)}</p>
      <h3>${esc(r[locale].title)}</h3>
      <p>${esc(r[locale].body)}</p>
      <p class="rule__seen"><span>${esc(t.principles.seenIn)}</span> ${seen}</p>
    </article>`;
  });

  return `<section class="sec" id="principles" data-path="PRINCIPLES.TXT">
  <div class="wrap">
    ${secHead(locale, 1, t.principles.kicker, t.principles.title)}
    <p class="sec-intro">${esc(t.principles.intro)}</p>
    <div class="rules">${rules.join('\n')}</div>
  </div>
</section>`;
}

/* ── About + stack ─────────────────────────────────────────────────────── */

function about(locale, t) {
  const rows = map(
    stack,
    (g) => `<tr><th scope="row">${esc(t.stack.groups[g.id])}</th><td><ul class="inline-list">${map(
      g.items,
      (item) => `<li><span class="lat">${esc(item)}</span></li>`
    )}</ul></td></tr>`
  );

  return `<section class="sec" id="about" data-path="ABOUT.TXT">
  <div class="wrap">
    ${secHead(locale, 2, t.about.kicker, t.about.title)}
    <div class="about-grid">
      ${win({
        title: 'ABOUT.TXT',
        cls: 'about__prose',
        attrs: ' data-depth',
        body: `<div class="win__body prose">${map(t.about.paragraphs, (para) => `<p>${esc(para)}</p>`)}</div>`,
      })}
      ${win({
        title: 'STACK.TBL',
        cls: 'about__stack',
        attrs: ' data-depth data-tilt',
        body: `<div class="win__body">
        <p class="label">${esc(t.stack.kicker)}</p>
        <h3 class="stack-title">${esc(t.stack.title)}</h3>
        <table class="table">
          <thead><tr><th scope="col">${esc(t.stack.head[0])}</th><th scope="col">${esc(t.stack.head[1])}</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`,
      })}
    </div>
  </div>
</section>`;
}

/* ── Contact ───────────────────────────────────────────────────────────── */

function contact(locale, t) {
  const email = site.links.email;
  const emailBtn = email
    ? `<a class="btn btn--primary" href="#" data-mail-user="${esc(email.user)}" data-mail-domain="${esc(email.domain)}">${icons.mail}${esc(t.contact.emailCta)}</a>`
    : '';

  return `<section class="sec" id="contact" data-path="CONTACT.HTM">
  <div class="wrap">
    ${secHead(locale, 3, t.contact.kicker, t.contact.title)}
    ${win({
      title: 'CONTACT.HTM',
      cls: 'contact',
      attrs: ' data-depth',
      body: `<div class="win__body contact__body">
      <p class="contact__lead">${esc(t.contact.body)}</p>
      <div class="actions">
        ${emailBtn}
        <a class="btn ${email ? '' : 'btn--primary'}" href="${site.links.github}" rel="me noopener">${icons.github}${esc(t.contact.githubCta)}${icons.arrowRight}</a>
      </div>
    </div>`,
    })}
  </div>
</section>`;
}

/* The build measures everything up to CRITICAL against the first-round-trip
   budget, then removes the marker. */
export const CRITICAL = '<!--critical-end-->';

export function home(locale, t) {
  return [
    hero(locale, t),
    CRITICAL,
    projectsSection(locale, t),
    principlesSection(locale, t),
    about(locale, t),
    contact(locale, t),
  ].join('\n');
}
