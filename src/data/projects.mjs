/**
 * The portfolio. Every project is shown in full on the home page, in this
 * order: a row in the directory listing, then its own section with the
 * philosophy, the architecture, a spec sheet and an exploded 3D diagram.
 *
 * ── Adding a project ────────────────────────────────────────────────
 * Append an object. Fields:
 *
 *   id        slug; the section is #p-<id>, the terminal opens it by name
 *   ext       "file extension" in the directory listing (default .EXE)
 *   hue       0–360: the project's colour (title bar, diagram, tunnel tint)
 *   status    'live' | 'building' | 'unreleased' | 'archived'
 *   year      shown in Persian digits on /fa/ automatically
 *   hidden    true -> kept here, not rendered anywhere
 *   tags      tech names; deliberately untranslated
 *   links     site, repo — either may be omitted
 *   layers    the architecture, top to bottom: { name, en, fa }. `name` is
 *             a technical label (kept in Latin), en/fa describe it.
 *   en / fa   title, kind, tagline, philosophy, architecture, and
 *             facts: [label, value] pairs for the spec sheet.
 *
 * Persian copy uses ZWNJ (U+200C) in compound words — keep it.
 */

export const projects = [
  {
    id: 'textor',
    hue: 215,
    status: 'live',
    year: '2026',
    tags: ['TypeScript', 'React', 'Nostr', 'WebRTC', 'MLS', 'PWA'],
    links: {
      site: 'https://textor.ir',
      repo: 'https://github.com/Noormohammadiazad/Textor',
    },
    layers: [
      { name: 'React UI', en: 'screens · i18n · RTL', fa: 'صفحه‌ها · دوزبانه · راست‌به‌چپ' },
      { name: 'Zustand store', en: 'a projection for the UI', fa: 'نمایی از وضعیت برای رابط' },
      { name: 'Messenger engine', en: 'receipts · retries · dedup', fa: 'رسید · تلاش دوباره · حذف تکراری' },
      { name: 'Vault', en: 'XChaCha20 · keyslots', fa: 'XChaCha20 · شیارهای کلید' },
      { name: 'Nostr transport', en: 'relay pool · WebRTC', fa: 'مجموعه‌ی رله · WebRTC' },
      { name: 'Public relays', en: 'ciphertext only', fa: 'فقط متن رمزشده' },
    ],
    en: {
      title: 'Textor',
      kind: 'Messenger',
      tagline: 'A private messenger that is nothing but a web page.',
      philosophy:
        'There is no Textor server to compel, breach or shut down, because there isn’t one. Your identity is a key made in your browser and backed up as twelve words; messages are sealed before they touch the network. It also lists its own limits — no forward secrecy for direct messages yet, no push notifications — because a privacy tool that only lists its strengths isn’t being straight with you.',
      architecture:
        'Each message is a NIP-17 private message: sealed with NIP-44, then gift-wrapped (NIP-59) under a one-time key with a fuzzed timestamp and a padded size, and sent to several public Nostr relays that act as dumb encrypted mailboxes. When both people are online, a direct WebRTC channel delivers it instantly. Inside the browser the UI never touches a transport or the database: it goes through the store, the engine and the vault, and the core runs in Node under test.',
      facts: [
        ['Backend', 'none'],
        ['Identity', '12 words (NIP-06)'],
        ['Install', 'under 800 KiB'],
        ['Licence', 'AGPL-3.0'],
      ],
    },
    fa: {
      title: 'Textor',
      kind: 'پیام‌رسان',
      tagline: 'پیام‌رسانی خصوصی که چیزی جز یک صفحه‌ی وب نیست.',
      philosophy:
        'هیچ سرور تکستوری وجود ندارد که بشود مجبورش کرد، به آن نفوذ کرد یا خاموشش کرد، چون اصلاً سروری در کار نیست. هویت شما کلیدی است که در مرورگر خودتان ساخته می‌شود و با دوازده کلمه پشتیبان گرفته می‌شود، و پیام‌ها پیش از رسیدن به شبکه مهر و موم می‌شوند. محدودیت‌هایش را هم صریح می‌گوید — هنوز رازداری پیشرو برای پیام‌های مستقیم و اعلان فوری ندارد — چون ابزار حریم خصوصی‌ای که فقط از نقاط قوتش بگوید، با شما روراست نیست.',
      architecture:
        'هر پیام یک پیام خصوصی NIP-17 است: با NIP-44 مهر می‌شود، بعد زیر کلیدی یک‌بارمصرف کادوپیچ (NIP-59) می‌شود — با زمان مبهم‌شده و اندازه‌ی پرشده — و به چند رله‌ی عمومی Nostr می‌رود که فقط نقش صندوق‌پستی رمزشده را دارند. وقتی هر دو طرف آنلاین باشند، یک کانال مستقیم WebRTC پیام را فوراً می‌رساند. درون مرورگر، رابط کاربری هرگز مستقیم به شبکه یا پایگاه‌داده دست نمی‌زند: از استور، موتور و گاوصندوق می‌گذرد، و هسته زیر آزمون در Node اجرا می‌شود.',
      facts: [
        ['پشت‌صحنه', 'ندارد'],
        ['هویت', '۱۲ کلمه (NIP-06)'],
        ['حجم نصب', 'کمتر از ۸۰۰ کیلوبایت'],
        ['مجوز', 'AGPL-3.0'],
      ],
    },
  },
  {
    id: 'twofa',
    hue: 42,
    status: 'live',
    year: '2026',
    tags: ['TypeScript', 'WebCrypto', 'WebAuthn', 'PWA'],
    links: {
      site: 'https://twofa.ir',
      repo: 'https://github.com/Noormohammadiazad/TwoFA',
    },
    layers: [
      { name: 'Signal UI', en: 'no framework', fa: 'بدون فریم‌ورک' },
      { name: 'Vault', en: 'AES-256-GCM envelope', fa: 'پاکت AES-256-GCM' },
      { name: 'Key wrappers', en: 'PBKDF2 · passkey PRF', fa: 'PBKDF2 · کلید عبور' },
      { name: 'OTP engine', en: 'RFC 4226 / 6238', fa: 'RFC 4226 / 6238' },
      { name: 'QR codec', en: 'Reed–Solomon, in-tree', fa: 'رید–سولومون، درون مخزن' },
      { name: 'Service worker', en: 'offline precache', fa: 'پیش‌ذخیره‌ی آفلاین' },
    ],
    en: {
      title: 'TwoFA',
      kind: 'Authenticator',
      tagline: 'Two-factor codes, to the second and to yourself.',
      philosophy:
        'A zero-knowledge authenticator whose whole case rests on auditability. It makes six claims — secrets never leave the device, only your passphrase or passkey can decrypt, storage reveals nothing, codes are correct, it works offline, there is nothing to trust beyond the repository — and each comes with the mechanism that enforces it and a way to check it yourself. No runtime dependencies, so nothing else can land in the bundle.',
      architecture:
        'Envelope encryption: a random, non-extractable 256-bit key seals the vault with AES-256-GCM, and each unlock method — a passphrase through calibrated PBKDF2, or a passkey through the WebAuthn PRF — wraps that key separately, with every parameter bound into the AAD so storage cannot be downgraded. Codes follow RFC 4226 and 6238 over WebCrypto, checked against all 28 published vectors. Even the QR encoder and decoder are written in-tree.',
      facts: [
        ['Runtime deps', '0'],
        ['Bundle', '≈ 36 kB JS, gzipped'],
        ['Tests', '110'],
        ['Licence', 'MIT'],
      ],
    },
    fa: {
      title: 'TwoFA',
      kind: 'احرازگر',
      tagline: 'کدهای دومرحله‌ای، دقیق تا ثانیه و فقط برای خودتان.',
      philosophy:
        'احرازگری بدون دانش که تمام ادعایش روی حسابرسی‌پذیری بنا شده. شش ادعا دارد — رازها از دستگاه بیرون نمی‌روند، فقط عبارت عبور یا کلید عبور شما رمز را باز می‌کند، فضای ذخیره چیزی لو نمی‌دهد، کدها درست‌اند، بدون اینترنت کار می‌کند، و جز همین مخزن به چیزی نباید اعتماد کرد — و کنار هرکدام سازوکاری که اجرایش می‌کند و راهی برای اینکه خودتان بررسی‌اش کنید آمده. هیچ وابستگی زمان اجرا ندارد، پس چیز دیگری نمی‌تواند وارد بسته شود.',
      architecture:
        'رمزنگاری پاکتی: یک کلید تصادفی ۲۵۶بیتی و غیرقابل‌استخراج گاوصندوق را با AES-256-GCM مهر می‌کند، و هر روش باز کردن — عبارت عبور از راه PBKDF2 تنظیم‌شده، یا کلید عبور از راه PRF در WebAuthn — آن کلید را جداگانه می‌پیچد، و همه‌ی پارامترها در AAD گره خورده‌اند تا نشود فضای ذخیره را به نسخه‌ی ضعیف‌تر برگرداند. کدها طبق RFC 4226 و 6238 روی WebCrypto ساخته می‌شوند و با هر ۲۸ بردار آزمون منتشرشده سنجیده می‌شوند. حتی رمزگذار و رمزگشای QR هم درون خود مخزن نوشته شده‌اند.',
      facts: [
        ['وابستگی زمان اجرا', '۰'],
        ['حجم بسته', '≈ ۳۶ کیلوبایت JS فشرده'],
        ['آزمون‌ها', '۱۱۰'],
        ['مجوز', 'MIT'],
      ],
    },
  },
  {
    id: 'eleet',
    hue: 8,
    status: 'live',
    year: '2026',
    tags: ['TypeScript', 'Svelte 5', 'Web Workers', 'WebCrypto'],
    links: {
      site: 'https://eleet.ir',
      repo: 'https://github.com/Noormohammadiazad/Eleet',
    },
    layers: [
      { name: 'Svelte 5 UI', en: 'forms generated from schemas', fa: 'فرم‌های ساخته‌شده از شِما' },
      { name: 'Sessions + router', en: 'state in the URL fragment', fa: 'وضعیت در بخش # نشانی' },
      { name: 'Engine RPC', en: 'typed · cancellable', fa: 'نوع‌دار · لغوپذیر' },
      { name: 'Web Worker', en: '50 transforms · 4 analyzers', fa: '۵۰ تبدیل · ۴ تحلیلگر' },
      { name: 'Language model', en: 'bigram beam decoder', fa: 'رمزگشای پرتوی دوحرفی' },
      { name: 'Service worker', en: 'offline shell', fa: 'پوسته‌ی آفلاین' },
    ],
    en: {
      title: 'Eleet',
      kind: 'Cipher cabinet',
      tagline: 'A cabinet of secret writing, from the scytale to SHA-3.',
      philosophy:
        'Text tools on the web are either ad-filled pages that post your text to a server, or workbenches with a cliff of a learning curve. Eleet sits between: 55 instruments filed by what they actually do to text — so leet speak sits among the substitution ciphers, a peer of Caesar and Enigma — with illustrated historical dossiers in both languages. Nothing you type ever leaves the browser.',
      architecture:
        'A framework-agnostic engine declares every tool as a typed option schema plus pure functions, and the UI generates its forms from that schema. The engine runs in a module Web Worker behind a typed RPC with cancellation, so the interface never blocks, even during a deep automatic decode. Share links compress their state into the URL fragment, which browsers never send to the host.',
      facts: [
        ['Instruments', '55'],
        ['Dossiers', '14, in two languages'],
        ['Tests', '329'],
        ['Licence', 'MIT'],
      ],
    },
    fa: {
      title: 'Eleet',
      kind: 'گنجه‌ی رمزنویسی',
      tagline: 'گنجه‌ای از نوشتن پنهانی، از اسکیتالی تا SHA-3.',
      philosophy:
        'ابزارهای متنی وب یا صفحه‌هایی پر از تبلیغ‌اند که متن شما را به سرور می‌فرستند، یا میزکارهایی با شیب یادگیری تند. Eleet میان این دو می‌ایستد: ۵۵ ابزار که بر اساس کاری که واقعاً با متن می‌کنند دسته‌بندی شده‌اند — یعنی زبان لیت کنار رمزهای جانشینی، هم‌ردیف سزار و انیگما می‌نشیند — همراه با پرونده‌های تاریخی مصور به هر دو زبان. هر چه بنویسید از مرورگر بیرون نمی‌رود.',
      architecture:
        'موتوری مستقل از فریم‌ورک هر ابزار را به‌شکل یک شِمای گزینه‌ی نوع‌دار به‌اضافه‌ی چند تابع خالص تعریف می‌کند، و رابط کاربری فرم‌هایش را از همان شِما می‌سازد. موتور در یک Web Worker ماژولی، پشت یک RPC نوع‌دار و لغوپذیر اجرا می‌شود، پس رابط هیچ‌وقت قفل نمی‌کند، حتی وسط یک رمزگشایی خودکار عمیق. پیوندهای اشتراک وضعیت را فشرده در بخش # نشانی نگه می‌دارند، که مرورگر هرگز برای میزبان نمی‌فرستد.',
      facts: [
        ['ابزارها', '۵۵'],
        ['پرونده‌ها', '۱۴، به دو زبان'],
        ['آزمون‌ها', '۳۲۹'],
        ['مجوز', 'MIT'],
      ],
    },
  },
  {
    id: 'sayso',
    hue: 285,
    status: 'building',
    year: '2026',
    tags: ['Rust', 'WebAssembly', 'iroh', 'Post-quantum'],
    links: {},
    layers: [
      { name: 'Web page', en: 'sender view · owner dashboard', fa: 'نمای فرستنده · داشبورد مالک' },
      { name: 'sayso-wasm', en: 'the JavaScript-facing API', fa: 'رابط سمت جاوااسکریپت' },
      { name: 'sayso-wire', en: 'the protocol over iroh', fa: 'پروتکل روی iroh' },
      { name: 'sayso-core', en: 'formats · cryptography', fa: 'قالب‌ها · رمزنگاری' },
      { name: 'Three tiers', en: 'live wire · buffer · courier', fa: 'سیم زنده · میانگیر · پیک' },
      { name: 'Data branch', en: 'signed manifest · epochs', fa: 'مانیفست امضاشده · دوره‌ها' },
    ],
    en: {
      title: 'Sayso',
      kind: 'Encrypted drop box',
      tagline: 'Sealed messages and large files to a repository’s owner, from a static page.',
      philosophy:
        'A static page cannot accept writes, and GitHub accepts them only from signed-in accounts. Sayso turns that constraint into the design: anyone can send end-to-end encrypted messages and large files to the owner of a GitHub repository, with no backend, no accounts and no secret in the page. Before you click, it tells you plainly what will be public.',
      architecture:
        'The core is Rust compiled to WebAssembly. Envelopes are sealed with X-Wing — ML-KEM-768 hybridised with X25519 — and ChaCha20-Poly1305, because a sealed envelope may sit in public long enough to meet a quantum adversary. Delivery tries three tiers in order: a live, end-to-end encrypted QUIC connection through iroh, a public store-and-forward buffer, then a GitHub Actions courier that writes ciphertext into a private vault.',
      facts: [
        ['Status', 'milestone 1 of 4'],
        ['Key exchange', 'X-Wing (ML-KEM-768 + X25519)'],
        ['Core', 'Rust → WebAssembly'],
        ['Security review', 'not yet'],
      ],
    },
    fa: {
      title: 'Sayso',
      kind: 'صندوق رمزشده',
      tagline: 'پیام‌های مهرشده و فایل‌های بزرگ برای مالک یک مخزن، از یک صفحه‌ی ایستا.',
      philosophy:
        'یک صفحه‌ی ایستا نمی‌تواند چیزی دریافت و ذخیره کند، و گیت‌هاب فقط از حساب‌های واردشده نوشتن را می‌پذیرد. Sayso همین محدودیت را به طراحی تبدیل می‌کند: هر کسی می‌تواند پیام‌ها و فایل‌های بزرگ رمزشده‌ی سرتاسری را برای مالک یک مخزن گیت‌هاب بفرستد، بدون پشت‌صحنه، بدون حساب کاربری و بدون هیچ رازی در صفحه. پیش از هر کلیک هم صریح می‌گوید چه چیزی عمومی خواهد شد.',
      architecture:
        'هسته با Rust نوشته شده و به WebAssembly ترجمه می‌شود. پاکت‌ها با X-Wing — ترکیب ML-KEM-768 و X25519 — و ChaCha20-Poly1305 مهر می‌شوند، چون یک پاکت مهرشده ممکن است آن‌قدر در فضای عمومی بماند که به مهاجمی کوانتومی برسد. تحویل به‌ترتیب سه لایه را امتحان می‌کند: اتصال زنده‌ی QUIC رمزشده از راه iroh، یک میانگیر عمومیِ ذخیره و ارسال، و در آخر پیکی در GitHub Actions که متن رمزشده را در یک گاوصندوق خصوصی می‌نویسد.',
      facts: [
        ['وضعیت', 'گام ۱ از ۴'],
        ['تبادل کلید', 'X-Wing (ML-KEM-768 + X25519)'],
        ['هسته', 'Rust → WebAssembly'],
        ['بازبینی امنیتی', 'هنوز نه'],
      ],
    },
  },
  {
    id: 'tseq',
    hue: 150,
    status: 'unreleased',
    year: '2026',
    tags: ['JavaScript', 'TensorFlow.js', 'Web Workers', 'IndexedDB'],
    links: {},
    layers: [
      { name: 'Canvas charts', en: 'a hand-written engine', fa: 'موتوری دست‌نویس' },
      { name: 'LinUCB allocator', en: '12 alpha sleeves', fa: '۱۲ سبد آلفا' },
      { name: 'Multi-head net', en: 'TF.js in a Web Worker', fa: 'TF.js در Web Worker' },
      { name: 'Feature panel', en: '~70 per symbol', fa: 'حدود ۷۰ برای هر نماد' },
      { name: 'IndexedDB corpus', en: 'survives reloads', fa: 'با بارگذاری دوباره نمی‌پرد' },
      { name: 'Proxy fabric', en: 'hedged relays', fa: 'رله‌های پشتیبان‌دار' },
    ],
    en: {
      title: 'TSEQ',
      kind: 'Quant system',
      tagline: 'A quantitative trading system for the Tehran Stock Exchange that runs entirely in the browser.',
      philosophy:
        'The “server” is a static file host. Ingestion, feature engineering, training, backtesting and inference all happen client-side — no backend, no build step, no npm — and if its one remote script cannot load, it falls back to classical models instead of breaking. Evaluation is held to a quant’s standard: purged, embargoed walk-forward splits, and early stopping on rank correlation rather than loss.',
      architecture:
        'Market data flows through a hedged proxy fabric into an IndexedDB corpus that survives reloads. About seventy cross-sectional features per symbol feed a pooled multi-head network, trained with TensorFlow.js in a Web Worker on your own GPU, that predicts relative rather than absolute returns, with direction and quantile heads. A LinUCB contextual bandit then reallocates across twelve alpha sleeves, rewarded by what they actually returned.',
      facts: [
        ['Status', 'unreleased'],
        ['Model', 'pooled multi-head, TF.js'],
        ['Features', '~70 per symbol'],
        ['Build step', 'none'],
      ],
    },
    fa: {
      title: 'TSEQ',
      kind: 'سامانه‌ی کمّی',
      tagline: 'سامانه‌ی معاملاتی کمّی برای بورس تهران که تماماً در مرورگر اجرا می‌شود.',
      philosophy:
        '«سرور» فقط میزبان چند فایل ایستاست. دریافت داده، مهندسی ویژگی، آموزش، آزمون گذشته‌نگر و پیش‌بینی همه سمت کاربر انجام می‌شوند — بدون پشت‌صحنه، بدون مرحله‌ی ساخت، بدون npm — و اگر تنها اسکریپت بیرونی‌اش بار نشود، به‌جای از کار افتادن به مدل‌های کلاسیک برمی‌گردد. ارزیابی با معیار یک تحلیلگر کمّی سنجیده می‌شود: تقسیم‌بندی پیش‌رونده‌ی پالایش‌شده با فاصله‌ی ایمنی، و توقف زودهنگام بر پایه‌ی همبستگی رتبه‌ای، نه تابع زیان.',
      architecture:
        'داده‌ی بازار از یک شبکه‌ی پراکسی پشتیبان‌دار وارد پیکره‌ای در IndexedDB می‌شود که با بارگذاری دوباره از بین نمی‌رود. حدود هفتاد ویژگی مقطعی برای هر نماد به یک شبکه‌ی عصبی چندسری مشترک می‌رسد که با TensorFlow.js در یک Web Worker روی GPU خودتان آموزش می‌بیند و بازده نسبی را پیش‌بینی می‌کند، نه مطلق، با سرهایی برای جهت و چندک‌ها. بعد یک راهزن زمینه‌ای LinUCB وزن را میان دوازده سبد آلفا جابه‌جا می‌کند و از بازده واقعی آن‌ها پاداش می‌گیرد.',
      facts: [
        ['وضعیت', 'منتشرنشده'],
        ['مدل', 'چندسری مشترک، TF.js'],
        ['ویژگی‌ها', 'حدود ۷۰ برای هر نماد'],
        ['مرحله‌ی ساخت', 'ندارد'],
      ],
    },
  },
  {
    id: 'papyra',
    hue: 190,
    status: 'unreleased',
    year: '2026',
    tags: ['TypeScript', 'React', 'TipTap', 'RTL'],
    links: {},
    layers: [
      { name: 'React UI', en: 'RTL-first', fa: 'راست‌به‌چپ از پایه' },
      { name: 'TipTap editor', en: 'ProseMirror document model', fa: 'مدل سند ProseMirror' },
      { name: 'Import', en: 'mammoth.js · fidelity report', fa: 'mammoth.js · گزارش وفاداری' },
      { name: 'Export', en: 'real .docx, in the browser', fa: '.docx واقعی، در مرورگر' },
      { name: 'IndexedDB', en: 'JSON backup and restore', fa: 'پشتیبان و بازگردانی JSON' },
    ],
    en: {
      title: 'Papyra',
      kind: 'Word processor',
      tagline: 'Write and export a real .docx in the browser, with right-to-left built in from the ground up.',
      philosophy:
        'Most “write it and export a .docx” jobs need neither a desktop suite nor a cloud account. Papyra is a small, honest tool that does that one thing, with right-to-left text as a first-class citizen rather than a bolted-on afterthought. When it imports a document, it reports exactly what it simplified or dropped instead of failing silently.',
      architecture:
        'A React and TypeScript editor built on TipTap. Documents are generated as genuine .docx files in the browser with the docx library, imported through mammoth.js, and checked for fidelity with docx-preview. Everything is kept in IndexedDB with JSON backup and restore, and the whole app deploys as a static site.',
      facts: [
        ['Status', 'unreleased'],
        ['Output', 'real .docx'],
        ['Storage', 'IndexedDB, on your device'],
        ['Backend', 'none'],
      ],
    },
    fa: {
      title: 'Papyra',
      kind: 'واژه‌پرداز',
      tagline: 'نوشتن و خروجی گرفتن یک .docx واقعی در مرورگر، با راست‌به‌چپی که از پایه در آن ساخته شده.',
      philosophy:
        'بیشتر کارهای «بنویس و .docx بگیر» نه به مجموعه‌ی اداری دسکتاپ نیاز دارند و نه به حساب ابری. Papyra ابزاری کوچک و صادق است که همین یک کار را انجام می‌دهد، و متن راست‌به‌چپ در آن شهروند درجه‌یک است، نه وصله‌ای که بعداً اضافه شده. وقتی سندی را وارد می‌کند، دقیق گزارش می‌دهد چه چیزی را ساده کرد یا کنار گذاشت، به‌جای اینکه بی‌صدا خراب کند.',
      architecture:
        'ویرایشگری با React و TypeScript که روی TipTap ساخته شده. سندها با کتابخانه‌ی docx به‌شکل فایل .docx واقعی در خود مرورگر ساخته می‌شوند، با mammoth.js وارد می‌شوند و با docx-preview از نظر وفاداری سنجیده می‌شوند. همه‌چیز با پشتیبان‌گیری و بازگردانی JSON در IndexedDB نگه داشته می‌شود، و کل برنامه به‌شکل یک سایت ایستا منتشر می‌شود.',
      facts: [
        ['وضعیت', 'منتشرنشده'],
        ['خروجی', '.docx واقعی'],
        ['ذخیره', 'IndexedDB، روی دستگاه شما'],
        ['پشت‌صحنه', 'ندارد'],
      ],
    },
  },
  {
    id: 'mammadali',
    ext: '.HTM',
    hue: 320,
    status: 'live',
    year: '2026',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
    links: {
      site: 'https://mammadali.ir',
      repo: 'https://github.com/Noormohammadiazad/noormohammadiazad.github.io',
    },
    layers: [
      { name: 'Static HTML', en: 'one page per language', fa: 'یک صفحه برای هر زبان' },
      { name: 'Inline CSS', en: 'logical properties · RTL', fa: 'ویژگی‌های منطقی · راست‌به‌چپ' },
      { name: 'CSS 3D', en: 'tunnel · stacks · cube', fa: 'تونل · پشته‌ها · مکعب' },
      { name: 'app.js', en: 'one rAF loop, deferred', fa: 'یک حلقه‌ی rAF، با تأخیر' },
      { name: 'Node build', en: 'zero dependencies', fa: 'بدون وابستگی' },
      { name: 'GitHub Pages', en: 'deployed by Actions', fa: 'انتشار با Actions' },
    ],
    en: {
      title: 'mammadali.ir',
      kind: 'This site',
      tagline: 'A 1997 homepage, rebuilt to modern standards.',
      philosophy:
        'Hand-written, with no framework and no runtime dependencies, under a performance budget the build enforces: the first screen of every page must arrive in the first network round trip. Both languages are done properly — Persian is its own pre-rendered page with real right-to-left layout and typography, not translated strings swapped in by a script.',
      architecture:
        'A dependency-free Node script renders each language to static HTML with its CSS inlined, and GitHub Actions verifies the output and publishes it to Pages. All the 3D is CSS transforms — a wireframe tunnel made of 1px elements, exploded architecture stacks, a cube — driven by one requestAnimationFrame loop that runs only while something is moving.',
      facts: [
        ['Runtime deps', '0'],
        ['First screen', '≤ 14 KB, gzipped'],
        ['3D', 'CSS transforms only'],
        ['Webfonts', 'Persian pages only'],
      ],
    },
    fa: {
      title: 'mammadali.ir',
      kind: 'همین سایت',
      tagline: 'یک صفحه‌ی خانگی سال ۱۹۹۷، بازسازی‌شده با استانداردهای امروز.',
      philosophy:
        'دست‌نویس، بدون فریم‌ورک و بدون وابستگی زمان اجرا، زیر بودجه‌ای از کارایی که مرحله‌ی ساخت اجرایش می‌کند: صفحه‌ی اول هر برگه باید در اولین رفت‌وبرگشت شبکه برسد. هر دو زبان درست انجام شده‌اند — فارسی صفحه‌ی ازپیش‌ساخته‌ی خودش را دارد، با چیدمان و تایپوگرافی واقعی راست‌به‌چپ، نه رشته‌های ترجمه‌شده‌ای که با اسکریپت جابه‌جا شوند.',
      architecture:
        'یک اسکریپت Node بدون وابستگی هر زبان را با CSS درون‌خطی به HTML ایستا تبدیل می‌کند، و GitHub Actions خروجی را بررسی و روی Pages منتشر می‌کند. همه‌ی جلوه‌های سه‌بعدی تبدیل‌های CSS هستند — تونلی سیمی از عنصرهای یک‌پیکسلی، پشته‌های معماری بازشده و یک مکعب — که یک حلقه‌ی requestAnimationFrame آن‌ها را می‌گرداند و فقط وقتی چیزی در حرکت است کار می‌کند.',
      facts: [
        ['وابستگی زمان اجرا', '۰'],
        ['صفحه‌ی اول', 'حداکثر ۱۴ کیلوبایت فشرده'],
        ['سه‌بعدی', 'فقط تبدیل‌های CSS'],
        ['فونت وب', 'فقط صفحه‌های فارسی'],
      ],
    },
  },
];

/** What the page renders: everything not explicitly hidden. */
export const shown = projects.filter((p) => !p.hidden);
