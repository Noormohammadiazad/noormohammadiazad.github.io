/**
 * The home page: one page, five chapters, each a set of windows on a desk.
 *
 *   #intro       the manifesto window, with a stack of windows behind it
 *   #range       the time-scale map: nine kinds of system on one logarithmic
 *                axis from a millisecond to a century, with an inspector
 *   #principles  one window per principle: statement, reasoning, and a
 *                rule / mechanism / how-to-check grid
 *   #process     the pipeline, the budget monitor, the toolbox
 *   #contact     contact and colophon
 *
 * Every window takes part in the scroll choreography (app.js): it glides in
 * from the reading-end side and comes forward as its chapter arrives, then
 * recedes and parks toward the start side as the next one takes over.
 */
import { site, localeMeta } from '../data/site.mjs';
import { stack } from '../data/stack.mjs';
import { budget } from '../data/budget.mjs';
import { scales, axis, place, principles, steps } from '../data/system.mjs';
import { icons } from './icons.mjs';
import { win, secHead } from './parts.mjs';
import { esc, txt, map, digits, index, kb, pct, fill } from './util.mjs';

/** Marks the end of the first screen; build.mjs measures up to here. */
export const CRITICAL = '<!--critical-end-->';

const other = (locale) => (locale === 'en' ? 'fa' : 'en');
const at = (seconds) => place(seconds).toFixed(4);

function hero(locale, t) {
  const h = t.hero;
  const o = other(locale);
  const lang = (code) => localeMeta[code].htmlLang;
  /* Both language names, each in its own language. */
  const both = ['en', 'fa']
    .sort((a, b) => (a === locale ? -1 : b === locale ? 1 : 0))
    .map((c) => `<span lang="${lang(c)}">${esc(localeMeta[c].label)}</span>`)
    .join(' · ');
  const glance = h.glance.map((g) => [esc(g.k), txt(locale, g.v)]).concat([[esc(h.languages), both]]);

  const body = `<div class="hero__body">
<p class="kicker">${txt(locale, h.eyebrow)}</p>
<h1 class="hero__name" id="intro-h">${esc(site.shortName[locale])} <span class="hero__alt" lang="${lang(o)}">${esc(site.shortName[o])}</span></h1>
<p class="hero__thesis">${txt(locale, h.thesis)}</p>
<p class="hero__lead">${txt(locale, h.lead)}</p>
<p class="actions">
<a class="btn btn--primary" href="#range">${esc(h.primaryCta)}${icons.arrowRight}</a>
<a class="btn" href="${esc(site.links.github)}" rel="me noopener">${icons.github}${esc(h.secondaryCta)}</a>
</p>
</div>
<h2 class="sr">${esc(h.glanceLabel)}</h2>
<dl class="glance">${map(glance, ([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>`;

  return `<section class="hero" id="intro" aria-labelledby="intro-h">
<div class="wrap hero__stack" data-depth>
<div class="ghost" data-ghost="2" aria-hidden="true"></div>
<div class="ghost" data-ghost="1" aria-hidden="true"></div>
${win({ title: esc(h.window), glyph: true, cls: 'hero__win', body, depth: false })}
</div>
</section>
${CRITICAL}`;
}

/**
 * The Range map. A scope draws the logarithmic axis with a flag for each
 * time scale; under it, the list of scales and an inspector. The list items
 * are links to their panels, so without JavaScript they are jump links and
 * every panel is visible. app.js turns them into tabs; on capable devices
 * the axis becomes a timeline receding into depth, and selecting a scale
 * dollies the camera along it to that point.
 */
function range(locale, t) {
  const r = t.range;

  const ticks = map(
    axis.ticks,
    (k) => `<span class="tick" style="--p:${at(k.seconds)}"><span class="tick__label">${esc(r.ticks[k.id])}</span></span>`
  );
  const flags = map(scales, (s, i) => {
    const it = r.items[s.id];
    return `<span class="flag${i === 0 ? ' is-on' : ''}" style="--p:${at(s.seconds)};--lv:${i % 3}" data-flag="${i}"><i class="flag__dot"></i><i class="flag__stem"></i><span class="flag__card"><b class="flag__n">${index(
      locale,
      i
    )}</b><span class="flag__name">${esc(it.name)}</span><span class="flag__value">${txt(locale, it.value)}</span></span></span>`;
  });

  const list = map(scales, (s, i) => {
    const it = r.items[s.id];
    return `<a class="scale${i === 0 ? ' is-on' : ''}" href="#t-${s.id}" data-pos="${at(s.seconds)}"><span class="scale__n">${index(
      locale,
      i
    )}</span><span class="scale__name">${esc(it.name)}</span><span class="scale__v">${txt(locale, it.value)}</span></a>`;
  });

  const panels = map(scales, (s, i) => {
    const it = r.items[s.id];
    return `<section class="panel${i === 0 ? ' is-on' : ''}" id="t-${s.id}" aria-labelledby="t-${s.id}-h">
<p class="zone">${esc(it.domain)}</p>
<h3 id="t-${s.id}-h">${esc(it.name)} <span class="panel__v">${txt(locale, it.value)}</span></h3>
<dl class="facts">
<div><dt>${esc(r.miss)}</dt><dd>${txt(locale, it.miss)}</dd></div>
<div><dt>${esc(r.method)}</dt><dd>${txt(locale, it.method)}</dd></div>
<div><dt>${esc(r.check)}</dt><dd>${txt(locale, it.check)}</dd></div>
</dl>
</section>`;
  });

  const body = `<div class="scope" data-scope aria-hidden="true">
<div class="track" data-track>
<i class="axis"></i>
${ticks}
${flags}
</div>
</div>
<div class="range">
<div class="scales" data-tabs data-label="${esc(r.listLabel)}">
${list}
</div>
<div class="inspector">
${panels}
</div>
</div>`;

  return `<section class="sec" id="range" aria-labelledby="range-h">
<div class="wrap">
${secHead({ id: 'range-h', kicker: r.kicker, title: txt(locale, r.title), intro: txt(locale, r.intro) })}
${win({ title: esc(r.window), acc: esc(r.accessory), cls: 'win--range', body })}
</div>
</section>`;
}

function principlesSection(locale, t) {
  const p = t.principles;
  const last = index(locale, principles.length - 1);

  const windows = principles.map((id, i) => {
    const it = p.items[id];
    const rows = map(
      it.rows,
      ([rule, how, check]) => `<li class="rule"><p class="rule__k">${txt(locale, rule)}</p><p class="rule__m"><span class="lbl">${esc(p.cols.how)}</span> ${txt(
        locale,
        how
      )}</p><p class="rule__c"><span class="lbl">${esc(p.cols.check)}</span> ${txt(locale, check)}</p></li>`
    );
    return win({
      id: `p-${id}`,
      cls: 'pr',
      tag: 'h3',
      title: txt(locale, it.name),
      acc: esc(fill(p.of, { i: index(locale, i), n: last })),
      body: `<div class="pr__body">
<p class="pr__statement">${txt(locale, it.statement)}</p>
<p class="pr__why">${txt(locale, it.body)}</p>
<div class="rules">
<div class="rules__head" aria-hidden="true"><span>${esc(p.cols.rule)}</span><span>${esc(p.cols.how)}</span><span>${esc(p.cols.check)}</span></div>
<ol class="rules__list">
${rows}
</ol>
</div>
</div>`,
    });
  });

  return `<section class="sec" id="principles" aria-labelledby="principles-h">
<div class="wrap">
${secHead({ id: 'principles-h', kicker: p.kicker, title: txt(locale, p.title), intro: txt(locale, p.intro) })}
<div class="pr-list">
${windows.join('\n')}
</div>
</div>
</section>`;
}

/**
 * The process chapter. The budget monitor prints the limits from
 * src/data/budget.mjs next to the sizes build.mjs measured for this very
 * page (`sizes`, in gzipped bytes). The build renders the page until the
 * printed sizes match the measured ones, then checks that they do.
 */
function processSection(locale, t, sizes) {
  const pr = t.process;
  const pl = pr.pipeline;
  const b = pr.budget;
  const zero = digits(locale, 0);

  const stepList = map(steps, (id, i) => {
    const s = pl.steps[id];
    return `<li class="step"><p class="step__n">${index(locale, i)}</p><div><h3>${esc(s.name)}</h3><p>${txt(locale, s.body)}</p><p class="step__out"><span>${esc(
      pl.output
    )}</span> ${txt(locale, s.output)}</p></div></li>`;
  });

  const metered = [
    ['first', budget.firstScreen, sizes.first],
    ['doc', budget.document, sizes.doc],
    ['script', budget.script, sizes.script],
  ].map(
    ([key, max, v]) => `<tr><th scope="row">${txt(locale, b.rows[key])}</th><td class="num">${digits(locale, max / 1024)}&nbsp;${esc(
      b.unit
    )}</td><td><span class="num" data-measured="${key}">${kb(locale, v, esc(b.unit))}</span> <span class="pct">${pct(locale, v / max)}</span><span class="meter" aria-hidden="true"><i style="--v:${(v / max).toFixed(3)}"></i></span></td></tr>`
  );
  const fonts = locale === 'fa' ? `${esc(b.fontName)}، ${kb(locale, sizes.font, esc(b.unit))}` : esc(b.fontsNone);
  const fixed = [
    [b.rows.fonts, esc(b.fontsLimit), fonts],
    [b.rows.deps, zero, zero],
    [b.rows.blocking, zero, zero],
    [b.rows.thirdParty, zero, zero],
  ].map(([label, limit, v]) => `<tr><th scope="row">${txt(locale, label)}</th><td class="num">${limit}</td><td class="num">${v}</td></tr>`);

  const monitor = `<div class="budget" data-budget>
<table>
<caption>${txt(locale, b.caption)}</caption>
<thead><tr><th scope="col">${esc(b.cols.measure)}</th><th scope="col">${esc(b.cols.limit)}</th><th scope="col">${esc(b.cols.actual)}</th></tr></thead>
<tbody>
${metered.concat(fixed).join('\n')}
</tbody>
</table>
<p class="budget__note">${esc(b.note)}</p>
</div>`;

  const toolbox = `<dl class="toolbox">${map(
    stack,
    (g) => `<div><dt>${esc(pr.toolbox.groups[g.id])}</dt><dd>${map(g.items, (x) => `<span class="tag" dir="ltr">${esc(x)}</span>`)}</dd></div>`
  )}</dl>`;

  return `<section class="sec" id="process" aria-labelledby="process-h">
<div class="wrap">
${secHead({ id: 'process-h', kicker: pr.kicker, title: txt(locale, pr.title), intro: txt(locale, pr.intro) })}
${win({ title: esc(pl.window), acc: digits(locale, steps.length), cls: 'win--pipe', body: `<ol class="steps">\n${stepList}\n</ol>` })}
<div class="duo duo--process">
${win({ title: esc(b.window), acc: `<span class="ok">${esc(b.status)}</span>`, cls: 'win--budget', body: monitor })}
${win({ title: esc(pr.toolbox.window), cls: 'win--tools', body: toolbox })}
</div>
</div>
</section>`;
}

function contactSection(locale, t) {
  const c = t.contact;
  const email = site.links.email;
  const mail = email
    ? `<a class="btn btn--primary" href="#" data-mail-user="${esc(email.user)}" data-mail-domain="${esc(email.domain)}">${icons.mail}${esc(c.emailCta)}</a>\n`
    : '';

  return `<section class="sec" id="contact" aria-labelledby="contact-h">
<div class="wrap">
${secHead({ id: 'contact-h', kicker: c.kicker, title: txt(locale, c.title) })}
<div class="duo">
${win({
  title: esc(c.window),
  cls: 'win--contact',
  body: `<div class="contact">
<h3>${esc(c.heading)}</h3>
<p>${txt(locale, c.body)}</p>
<p class="actions">
${mail}<a class="btn${email ? '' : ' btn--primary'}" href="${esc(site.links.github)}" rel="me noopener">${icons.github}${esc(c.githubCta)}</a>
</p>
</div>`,
})}
${win({ title: esc(c.colophon.window), cls: 'win--colophon', body: `<div class="prose">\n${map(c.colophon.paragraphs, (p) => `<p>${txt(locale, p)}</p>`)}\n</div>` })}
</div>
</div>
</section>`;
}

/** `sizes`: this page's measured sizes, from build.mjs. */
export function home(locale, t, sizes) {
  return [hero(locale, t), range(locale, t), principlesSection(locale, t), processSection(locale, t, sizes), contactSection(locale, t)].join('\n');
}
