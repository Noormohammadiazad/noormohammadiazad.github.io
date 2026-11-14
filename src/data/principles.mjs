/**
 * The principles that run through every project, shown in the Principles
 * section. `seen` lists the project ids (from projects.mjs) where each one
 * shows; links to hidden projects are dropped automatically.
 */

export const principles = [
  {
    seen: ['textor', 'twofa', 'eleet', 'sayso', 'tseq', 'papyra'],
    en: {
      title: 'No server to trust',
      body: 'Each project runs entirely in your browser. The backend is a static file host, or public infrastructure anyone can run — never a server of mine you have to take on faith.',
    },
    fa: {
      title: 'سروری برای اعتماد نیست',
      body: 'هر پروژه تماماً در مرورگر شما اجرا می‌شود. پشت‌صحنه یا میزبان چند فایل ایستاست یا زیرساختی عمومی که هر کسی می‌تواند راه بیندازد — هرگز سروری از من که مجبور باشید چشم‌بسته به آن اعتماد کنید.',
    },
  },
  {
    seen: ['textor', 'twofa', 'sayso'],
    en: {
      title: 'Your keys stay with you',
      body: 'Identities and secrets are made on your device and stay there: twelve words, a passkey, an envelope key. There is no password reset, because nobody else holds a copy.',
    },
    fa: {
      title: 'کلیدها پیش خودتان می‌ماند',
      body: 'هویت و رازها روی دستگاه شما ساخته می‌شوند و همان‌جا می‌مانند: دوازده کلمه، یک کلید عبور، یک کلید پاکت. بازیابی رمز عبور وجود ندارد، چون هیچ‌کس دیگری نسخه‌ای از آن ندارد.',
    },
  },
  {
    seen: ['twofa', 'textor', 'eleet'],
    en: {
      title: 'Claims you can check',
      body: 'Every guarantee names the mechanism that enforces it and how to verify it yourself: published test vectors run in CI, a strict Content-Security-Policy, threat models written to be falsifiable.',
    },
    fa: {
      title: 'ادعاهایی که می‌شود سنجید',
      body: 'هر تضمین سازوکاری را که اجرایش می‌کند و راه بررسی‌اش را نام می‌برد: بردارهای آزمون منتشرشده که در CI اجرا می‌شوند، سیاست امنیت محتوای سخت‌گیر، و مدل‌های تهدیدی که طوری نوشته شده‌اند که بشود ردشان کرد.',
    },
  },
  {
    seen: ['textor', 'sayso', 'twofa'],
    en: {
      title: 'Limits, said out loud',
      body: 'Each one states up front what it cannot do: no forward secrecy yet, no push notifications, no security review yet. A tool that only lists its strengths is not being straight with you.',
    },
    fa: {
      title: 'محدودیت‌ها، با صدای بلند',
      body: 'هرکدام از اول می‌گوید چه کاری از دستش برنمی‌آید: هنوز رازداری پیشرو ندارد، اعلان فوری ندارد، هنوز بازبینی امنیتی نشده. ابزاری که فقط از نقاط قوتش بگوید، با شما روراست نیست.',
    },
  },
  {
    seen: ['textor', 'eleet', 'papyra', 'mammadali'],
    en: {
      title: 'Persian is first-class',
      body: 'Right-to-left layout and Persian typography are designed in from the start, not translated in at the end — down to Persian digits, Finglish and fixing text typed on the wrong keyboard layout.',
    },
    fa: {
      title: 'فارسی درجه‌یک است',
      body: 'چیدمان راست‌به‌چپ و تایپوگرافی فارسی از همان آغاز در طراحی هستند، نه اینکه آخر کار ترجمه شوند — تا جزئیاتی مثل ارقام فارسی، فینگلیش و درست کردن متنی که با چیدمان اشتباه صفحه‌کلید تایپ شده.',
    },
  },
  {
    seen: ['twofa', 'textor', 'mammadali'],
    en: {
      title: 'Small on purpose',
      body: 'Few or no dependencies, and budgets the build enforces: Textor installs in under 800 KiB, TwoFA ships about 36 kB of JavaScript, and this page paints from its first 14 KB.',
    },
    fa: {
      title: 'کوچک، از روی عمد',
      body: 'وابستگی کم یا هیچ، و بودجه‌هایی که مرحله‌ی ساخت اجرایشان می‌کند: Textor با کمتر از ۸۰۰ کیلوبایت نصب می‌شود، TwoFA حدود ۳۶ کیلوبایت جاوااسکریپت دارد، و همین صفحه از ۱۴ کیلوبایت اولش نمایش داده می‌شود.',
    },
  },
];
