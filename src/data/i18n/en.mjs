/**
 * English copy. fa.mjs must have exactly the same keys; the build checks.
 * Project content lives in ../projects.mjs, next to the project data.
 */
export default {
  meta: {
    home: {
      title: 'Mohammadali — Computer engineering student & software developer',
      description:
        'Computer engineering student and software developer building privacy tools that run entirely in the browser: Textor, TwoFA, Eleet, Sayso and more.',
    },
    notFound: {
      title: 'Page not found',
      description: 'That page does not exist.',
    },
  },

  nav: {
    projects: 'Projects',
    principles: 'Principles',
    about: 'About',
    contact: 'Contact',
    skipToContent: 'Skip to content',
    primary: 'Primary',
  },

  controls: {
    language: 'Language',
    theme: 'Theme',
    toTheme: { dark: 'Switch to dark theme', light: 'Switch to light theme' },
  },

  // Marquee, status bar, footer badges, visitor counter.
  chrome: {
    marquee: [
      'Welcome to mammadali.ir',
      'Textor is live at textor.ir',
      'TwoFA · Eleet · Textor — no servers, no accounts',
      'Now building: Sayso, a post-quantum drop box',
      'Read this site in English or Persian',
      'Best viewed with any browser',
    ],
    statusReady: 'Document: Done',
    statusLang: 'EN · LTR',
    underConstruction: 'Under construction',
    visits: 'Visits from this browser',
    visitsNote: 'Counted on your device only. Nothing is sent anywhere.',
    badges: [
      ['Best viewed with', 'any browser'],
      ['100% hand-written', 'HTML · CSS · JS'],
      ['No framework', '0 dependencies'],
      ['No trackers', 'no cookies'],
    ],
  },

  hero: {
    prompt: 'whoami',
    lead:
      'I am a computer engineering student and software developer. I build software that runs entirely in your browser — no server to trust, no account to make, nothing sent home — mostly in TypeScript, React and Rust.',
    primaryCta: 'See the projects',
    secondaryCta: 'GitHub',
    specsLabel: 'At a glance',
    specs: [
      { k: 'Role', v: 'CE student · developer' },
      { k: 'Stack', v: 'TypeScript · Rust · React · Svelte' },
      { k: 'Focus', v: 'Software that needs no server' },
      { k: 'Now', v: 'Building Sayso' },
    ],
  },

  // The interactive prompt in the hero.
  term: {
    label: 'Command',
    hint: 'type help',
    help: 'Commands: help · ls · open <name> · whoami · theme · lang · clear',
    whoami: 'Mohammadali — computer engineering student who builds software that needs no server.',
    theme: { dark: 'Theme: dark', light: 'Theme: light' },
    opening: 'Opening',
    noProject: 'No such project:',
    bad: 'Bad command or file name',
    sudo: 'Nice try. This incident will be reported.',
  },

  projects: {
    kicker: 'Projects',
    title: 'Everything I’ve built',
    intro:
      'One rule runs through all of them: if it can run in your browser, it should. Each is explained below — what it believes, how it is built, and its architecture, exploded.',
    dirHead: ['Name', 'Kind', 'Status', 'Year'],
    dirSummary: '{n} projects · 0 backends',
    allRepos: 'All repositories on GitHub',
    philosophy: 'Philosophy',
    architecture: 'Architecture',
    specSheet: 'Spec sheet',
    open: 'Open',
    source: 'Source',
    stackCaption: 'Architecture, top to bottom',
  },

  status: {
    live: 'Live',
    building: 'In development',
    unreleased: 'Unreleased',
    archived: 'Archived',
  },

  principles: {
    kicker: 'Principles',
    title: 'What they have in common',
    intro: 'Different problems, the same convictions. These are the rules every project above is built to.',
    seenIn: 'Seen in',
  },

  about: {
    kicker: 'About',
    title: 'A little context',
    paragraphs: [
      'I am a computer engineering student, and most of what I do outside coursework is building software and putting it on GitHub.',
      'Almost everything I build follows one rule: if it can run in your browser, it should — no server to trust, no account to make, nothing sent home. The rest is care: that it loads fast on a slow connection, reads correctly in both directions, and says honestly what it cannot do.',
      'Right now I am building Sayso, and keeping Textor, TwoFA and Eleet moving.',
    ],
  },

  stack: {
    kicker: 'Toolbox',
    title: 'What I work with',
    head: ['Group', 'Tools'],
    groups: {
      languages: 'Languages',
      web: 'Web platform',
      crypto: 'Crypto & networking',
      tooling: 'Tooling',
    },
  },

  contact: {
    kicker: 'Contact',
    title: 'Get in touch',
    body: 'Open to collaboration on open-source work, and happy to talk about anything on this page.',
    emailCta: 'Send an email',
    githubCta: 'Follow on GitHub',
  },

  footer: {
    builtWith: 'Hand-written HTML, CSS and JavaScript. No framework, no trackers.',
    source: 'Source code',
  },

  notFound: {
    code: '404',
    dialogTitle: 'Error 404',
    title: 'This page does not exist',
    body: 'The link may be out of date, or the page may have moved.',
    cta: 'Go to the homepage',
  },
};
