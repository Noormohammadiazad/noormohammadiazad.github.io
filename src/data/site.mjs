/**
 * Site-wide identity and configuration.
 *
 * This is the one place to edit personal details. Everything else
 * (pages, metadata, structured data, the sitemap) reads from here.
 */

export const site = {
  /** Canonical origin. No trailing slash. */
  origin: 'https://mammadali.ir',

  /** Short display name — used for the big hero heading. */
  shortName: {
    en: 'Mohammadali',
    fa: 'محمدعلی',
  },

  /** Full legal-ish name — used in <title>, metadata and structured data. */
  fullName: {
    en: 'Mohammadali Noormohammadi Azad',
    fa: 'محمدعلی نورمحمدی‌آزاد',
  },

  /** Monogram shown in the header mark. */
  monogram: {
    en: 'M',
    fa: 'م',
  },

  /** Contact + social. Set a value to null to hide it everywhere. */
  links: {
    github: 'https://github.com/Noormohammadiazad',
    /**
     * Contact email. Off by default so nothing personal is published until
     * you decide to. To show the "Send an email" button, replace `null`
     * with the commented-out object below (it is split into two parts so
     * the address is assembled in the browser rather than sitting in the
     * page source for scrapers).
     *
     *   email: { user: 'your.name', domain: 'example.com' },
     */
    email: null,
  },
};

/** The two supported locales. `en` is the default and lives at the site root. */
export const locales = ['en', 'fa'];

export const localeMeta = {
  en: { dir: 'ltr', htmlLang: 'en', base: '/', label: 'English', short: 'EN' },
  fa: { dir: 'rtl', htmlLang: 'fa', base: '/fa/', label: 'فارسی', short: 'فا' },
};

/** The root-relative URL of the home page in a given locale. */
export function urlFor(locale) {
  return localeMeta[locale].base;
}
