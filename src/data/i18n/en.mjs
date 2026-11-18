/**
 * English copy. fa.mjs must have exactly the same keys, and the same number
 * of entries in every list; the build checks. Time scales, principles and
 * steps are keyed by the ids in ../system.mjs, which also sets their order.
 */
export default {
  meta: {
    home: {
      title: 'Mohammadali — Engineering under constraints',
      description:
        'How Mohammadali, software engineer and computer engineering student, builds across simulation, real-time audio, cryptography, data, media and platforms: name the constraint, model it before writing code, and make every claim checkable.',
    },
    notFound: {
      title: 'Page not found',
      description: 'That page does not exist.',
    },
  },

  nav: {
    range: 'Range',
    principles: 'Principles',
    process: 'Process',
    contact: 'Contact',
    skipToContent: 'Skip to content',
    primary: 'Chapters',
  },

  controls: {
    language: 'Language',
    theme: 'Theme',
    toTheme: { dark: 'Switch to dark theme', light: 'Switch to light theme' },
  },

  hero: {
    window: 'Manifesto',
    eyebrow: 'Software engineer · Computer engineering student',
    thesis: 'Software that keeps its promises under hard constraints: a frame, an audio buffer, a key, a byte.',
    lead:
      'My work runs from simulated paper and real-time audio to encrypted protocols, quantitative models, media pipelines and full-stack platforms. Different problems, one method: name the constraint, model it before writing code, and make every claim something you can check.',
    primaryCta: 'See the range',
    secondaryCta: 'GitHub',
    glanceLabel: 'At a glance',
    glance: [
      { k: 'Range', v: 'Twelve orders of magnitude' },
      { k: 'Tightest deadline', v: '2.7 ms, one audio buffer' },
      { k: 'Default', v: 'Runs on your device' },
    ],
    languages: 'Languages',
  },

  range: {
    kicker: 'Range',
    title: 'Twelve orders of magnitude of deadlines',
    intro:
      'Every system I build answers to a clock. An audio callback has milliseconds; a secret has decades. Pick a time scale to see what a miss looks like there, and how I design against it.',
    window: 'Time scales',
    accessory: '9 domains · 1 ms to 100 years',
    listLabel: 'Time scales',
    domain: 'Domain',
    miss: 'A miss looks like',
    method: 'How I design for it',
    check: 'How I check',
    ticks: { ms: '1 ms', s: '1 s', min: '1 min', h: '1 h', day: '1 day', yr: '1 yr', dec: '10 yr', cen: '100 yr' },
    items: {
      audio: {
        name: 'One audio buffer',
        value: '2.7 ms',
        domain: 'Real-time audio',
        miss: 'An audible click, every time the callback runs late.',
        method: 'Nothing in the audio callback allocates, locks or waits on I/O. Filters and models are prepared ahead of time; the callback only computes.',
        check: 'Run at the smallest buffer size under load and count the dropouts. The answer must be zero.',
      },
      frame: {
        name: 'One frame',
        value: '16.7 ms',
        domain: 'Simulation and 3D',
        miss: 'A stutter you feel in your hand before you see it.',
        method: 'A fixed physics step, closed-form solutions where the mathematics allows them, and no allocation inside the frame loop.',
        check: 'A frame-time trace on a mid-range phone stays under budget, and the simulation matches the analytic case.',
      },
      input: {
        name: 'A response that feels instant',
        value: '100 ms',
        domain: 'Interfaces',
        miss: 'An interface that seems to be thinking.',
        method: 'Answer the input first, then do the work: heavy jobs in workers, and nothing on the input path waiting for the network.',
        check: 'Measure input to next paint with the CPU throttled.',
      },
      otp: {
        name: 'One code window',
        value: '30 s',
        domain: 'Authentication',
        miss: 'A valid code rejected, or an expired one accepted.',
        method: 'Time from a clock you can trust, a tolerance of exactly one step either side, and constant-time comparison.',
        check: 'The published test vectors pass, including at the edges of each window.',
      },
      render: {
        name: 'One video render',
        value: '≈ 10 min',
        domain: 'Media pipelines',
        miss: 'Voice, captions and animation drifting apart.',
        method: 'Every stage is deterministic and cached, and all timing comes from the aligned audio rather than from estimates.',
        check: 'Render twice from scratch; the outputs must be identical.',
      },
      session: {
        name: 'One trading day',
        value: '1 day',
        domain: 'Quantitative models',
        miss: 'Look-ahead bias: a model that quietly knew tomorrow.',
        method: 'Features computed only from the past, and walk-forward validation with purged, embargoed splits.',
        check: 'Shuffle the labels; the model must fall to chance.',
      },
      platform: {
        name: 'The life of a platform',
        value: '≈ 5 years',
        domain: 'Full-stack systems',
        miss: 'A migration that strands data, or a second language bolted on too late.',
        method: 'Explicit schemas and versioned migrations, translation from the first template, and dependencies chosen for being boring.',
        check: 'Restore an old backup into a fresh deployment and run the test suite.',
      },
      secrecy: {
        name: 'How long a secret must hold',
        value: 'decades',
        domain: 'Cryptography',
        miss: 'Harvest now, decrypt later: today’s traffic read in twenty years.',
        method: 'Hybrid post-quantum key exchange, forward secrecy, and keys that never leave the device.',
        check: 'The session key depends on both the classical and the post-quantum exchange.',
      },
      print: {
        name: 'A printed page',
        value: 'for good',
        domain: 'Documents and typesetting',
        miss: 'An error preserved in ink, with no update to ship.',
        method: 'Typesetting from reproducible source, fonts embedded, and preflight before anything goes to press.',
        check: 'Preflight passes, and the proof rebuilds identically from its source.',
      },
    },
  },

  principles: {
    kicker: 'Principles',
    title: 'Six rules I build to',
    intro:
      'Each one comes with the mechanism that enforces it and a way to check it yourself. A rule you can’t check is a slogan.',
    of: '{i} / {n}',
    cols: { rule: 'Rule', how: 'Mechanism', check: 'How to check' },
    items: {
      model: {
        name: 'Model before code',
        statement: 'Derive the model first. The code is its implementation, not its discovery.',
        body:
          'Whether it is the bending of a sheet of paper, a wire protocol or a trading signal, the expensive mistakes are made before the first line of code. So the mathematics, the format or the threat model is written down first, and the implementation follows it.',
        rows: [
          ['Invariants on paper', 'Conservation laws, state machines and lists of what must never happen, written before the code', 'Every invariant has a test that fails if it breaks'],
          ['Closed forms where they exist', 'Analytic solutions first, numerical methods only where the mathematics runs out', 'The numerical solver reproduces the analytic case'],
          ['Formats before parsers', 'File formats and wire protocols specified as documents, with test vectors', 'A second implementation could be written from the spec alone'],
          ['Name the adversary', 'A threat model for every system that holds someone else’s data', 'Each defence points to the threat it answers'],
        ],
      },
      deadlines: {
        name: 'Deadlines are inputs',
        statement: 'Know which clock you answer to, and design to it from the start.',
        body:
          'Performance cannot be bolted on at the end. The frame, the buffer, the round trip and the size of the first screen are requirements like any other: set before the design, and enforced by the build.',
        rows: [
          ['A budget per frame and per buffer', 'No allocation, locks or I/O inside real-time loops', 'Traces at the smallest buffer, on the slowest target device'],
          ['First screen in one round trip', 'Critical HTML and CSS inline, at most 14 KB compressed', 'The build measures it and fails the deploy if it grows'],
          ['Work off the critical path', 'Workers, precomputation, and a cache for anything deterministic', 'The main thread stays free during heavy jobs'],
          ['Motion that stands down', 'Animation loops that sleep when idle, with reduced-motion and low-end fallbacks', 'Turn on reduced motion: nothing moves'],
        ],
      },
      placement: {
        name: 'Computation where it belongs',
        statement: 'On your device by default; on a server only when the problem needs one.',
        body:
          'Personal data is safest where it already is. Some problems are shared by nature — many users, one catalogue, one source of truth — and there a server earns its place. The skill is telling the two apart, and precomputing everything that never needed to run live.',
        rows: [
          ['On the device', 'Private data, interactive tools, anything that should keep working offline', 'Go offline: it still works'],
          ['At build time', 'Anything that can be computed once: pages, typesetting, indexes, video', 'What ships is files, not processes'],
          ['On a server', 'Shared state, authority across many users, media delivered at scale', 'The server holds only what sharing requires'],
          ['Nowhere', 'Data the system does not need, and secrets it does not have to know', 'There is no field for it in the schema'],
        ],
      },
      crypto: {
        name: 'Cryptography as engineering',
        statement: 'Seal data before it leaves, with keys that never do.',
        body:
          'When data has to travel, or rest somewhere I don’t control, it goes sealed — with the platform’s audited primitives, never home-made ciphers. Knowing exactly how the classical ciphers fell is the best argument for respecting the modern ones.',
        rows: [
          ['Seal at the edge', 'Authenticated encryption before storage or transport', 'Every byte that leaves is ciphertext'],
          ['Keys stay put', 'Non-extractable keys, and passkeys where they fit', 'Exporting a key fails by design'],
          ['Derive, don’t store', 'A slow derivation for passphrases, HKDF for sub-keys', 'No secret is ever written down in the clear'],
          ['Plan for tomorrow’s attacker', 'Hybrid key exchange with a post-quantum KEM', 'Breaking one exchange is not enough'],
        ],
      },
      verify: {
        name: 'Verifiable and reproducible',
        statement: 'Don’t ask for trust. Show how to check.',
        body:
          'Every claim — fast, private, accurate, offline — needs a check that doesn’t depend on my word. And a result that can’t be reproduced, whether a build, a backtest or a rendered video, isn’t a result yet.',
        rows: [
          ['Reproducible outputs', 'Pinned toolchains, deterministic stages, content-hashed files', 'Rebuild from scratch and compare the hashes'],
          ['Honest evaluation', 'Held-out data, walk-forward splits, and controls that ought to fail', 'A shuffled control performs at chance'],
          ['Claims as tests', 'Budgets, translation parity and protocol vectors run in CI', 'A broken promise fails the deploy'],
          ['Honest limits', 'Every tool says what it cannot do', 'The limits are written next to the claims'],
        ],
      },
      rtl: {
        name: 'Persian, natively',
        statement: 'Persian is a first language here, on screen and on paper.',
        body:
          'Right-to-left is not a mirror flipped at the end. Layout, type, numbers and mixed-direction text are designed for both directions from the start, from an interface down to a typeset page.',
        rows: [
          ['Direction from the first byte', 'Separate pages with the right lang and dir, and logical CSS properties throughout', 'No flash and no reflow on load'],
          ['Type that respects the script', 'Proper Persian faces, no letter-spacing or case transforms, the zero-width non-joiner kept', 'Letters stay joined and compounds stay whole'],
          ['Mixed text in order', 'Latin runs, code and numbers isolated from the bidi algorithm', 'Function names and versions never scramble'],
          ['Local numbers', 'Persian digits and decimal separator wherever a number is shown', 'Sizes read ۹٫۸, not 9.8'],
        ],
      },
    },
  },

  process: {
    kicker: 'Process',
    title: 'From constraint to shipped artifact',
    intro:
      'The same five steps whatever the domain. The deadline and the budget come before the design, and every claim becomes a check before anything ships.',
    pipeline: {
      window: 'Pipeline',
      output: 'Output',
      steps: {
        constraints: {
          name: 'Constraints',
          body: 'Name the clock, the budget and the adversary: what has to happen in time, in how many bytes, and against whom.',
          output: 'A written list of limits',
        },
        model: {
          name: 'Model',
          body: 'Derive the mathematics, the format or the protocol, with the invariants it has to keep.',
          output: 'A spec with test vectors',
        },
        core: {
          name: 'Core',
          body: 'Build the pure core and test it in isolation. Storage, network, audio and interface come later, as adapters.',
          output: 'Logic with no side effects',
        },
        verify: {
          name: 'Verify',
          body: 'Turn every claim into a check: analytic cases, test vectors, held-out data, budgets.',
          output: 'A red build when a promise breaks',
        },
        ship: {
          name: 'Ship',
          body: 'Release the right artifact — static files, a plugin, a container, a rendered video — reproducibly.',
          output: 'Something anyone can rebuild',
        },
      },
    },
    budget: {
      window: 'Budget monitor',
      status: 'Within budget',
      cols: { measure: 'Measure', limit: 'Limit', actual: 'This page' },
      rows: {
        first: 'First screen: HTML and CSS',
        doc: 'Whole page',
        script: 'Deferred script',
        fonts: 'Web fonts',
        deps: 'Runtime dependencies',
        blocking: 'Render-blocking requests',
        thirdParty: 'Third-party requests',
      },
      fontsLimit: 'Persian pages only',
      fontsNone: 'None loaded',
      fontName: 'Vazirmatn',
      unit: 'KB',
      caption:
        'This page, measured by the build. If any line goes over its limit the deploy fails, so these numbers can’t drift from the truth.',
      note: 'Gzipped · 1 KB = 1,024 bytes',
    },
    toolbox: {
      window: 'Toolbox',
      groups: {
        languages: 'Languages',
        graphics: 'Graphics and simulation',
        crypto: 'Cryptography',
        media: 'Audio and media',
        data: 'Data and models',
        platforms: 'Platforms',
        tooling: 'Tooling',
      },
    },
  },

  contact: {
    kicker: 'Contact',
    title: 'Hard problems welcome',
    window: 'Contact',
    heading: 'Work together',
    body: 'Open to collaboration on open-source work and on hard technical problems, and happy to argue about anything on this page.',
    emailCta: 'Send an email',
    githubCta: 'Follow on GitHub',
    colophon: {
      window: 'Colophon',
      paragraphs: [
        'This page is hand-written HTML, CSS and JavaScript, rendered ahead of time in English and Persian by a build script with no dependencies.',
        'Its windows move on a single animation loop that sleeps when nothing changes, and stay still if your system asks for reduced motion.',
        'The build measures the finished page, prints the numbers into the budget monitor, and refuses to deploy if any of them is over.',
      ],
    },
  },

  footer: {
    builtWith: 'Written by hand, measured on every build.',
    source: 'Source',
    notes: ['No framework', '0 dependencies', 'Under budget'],
  },

  notFound: {
    code: '404',
    label: 'Error 404',
    title: 'This page does not exist',
    body: 'The link may be out of date, or the page may have moved.',
    cta: 'Go to the homepage',
  },
};
