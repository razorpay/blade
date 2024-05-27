const dayjs_locales = [
  'af',
  'ar',
  'ar-dz',
  'ar-kw',
  'ar-ly',
  'ar-ma',
  'ar-sa',
  'ar-tn',
  'az',
  'be',
  'bg',
  'bm',
  'bn',
  'bo',
  'br',
  'bs',
  'ca',
  'cs',
  'cv',
  'cy',
  'da',
  'de',
  'de-at',
  'de-ch',
  'dv',
  'el',
  'en',
  'en-au',
  'en-ca',
  'en-gb',
  'en-ie',
  'en-il',
  'en-nz',
  'en-SG',
  'eo',
  'es',
  'es-do',
  'es-us',
  'et',
  'eu',
  'fa',
  'fi',
  'fo',
  'fr',
  'fr-ca',
  'fr-ch',
  'fy',
  'ga',
  'gd',
  'gl',
  'gom-latn',
  'gu',
  'he',
  'hi',
  'hr',
  'hu',
  'hy-am',
  'id',
  'is',
  'it',
  'it-ch',
  'ja',
  'jv',
  'ka',
  'kk',
  'km',
  'kn',
  'ko',
  'ku',
  'ky',
  'lb',
  'lo',
  'lt',
  'lv',
  'me',
  'mi',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'ms-my',
  'mt',
  'my',
  'nb',
  'ne',
  'nl',
  'nl-be',
  'nn',
  'oc-lnc',
  'pa-in',
  'pl',
  'pt',
  'pt-br',
  'ro',
  'ru',
  'sd',
  'se',
  'si',
  'sk',
  'sl',
  'sq',
  'sr',
  'sr-cyrl',
  'ss',
  'sv',
  'sw',
  'ta',
  'te',
  'tet',
  'tg',
  'th',
  'tl-ph',
  'tlh',
  'tr',
  'tzl',
  'tzm',
  'tzm-latn',
  'ug-cn',
  'uk',
  'ur',
  'uz',
  'uz-latn',
  'vi',
  'x-pseudo',
  'yo',
  'zh-cn',
  'zh-hk',
  'zh-tw',
];

// https://github.com/iamkun/dayjs/issues/732#issuecomment-554383261
function patchLocale(locale: string): string | boolean {
  if (['en', 'en-us'].includes(locale)) return 'en';
  if (locale === 'zn') return 'zh-cn';
  if (locale === 'no') return 'nb';
  if (dayjs_locales.includes(locale)) return locale;
  return false;
}

function convertIntlToDayjsLocale(lang: string): string {
  lang = lang.toLowerCase();
  const locale = patchLocale(lang) || (lang.includes('-') && patchLocale(lang.split('-')[0]));
  if (!locale) return 'en';

  return `${locale}`;
}

function isScriptLoaded(src: string): boolean {
  return Boolean(document.querySelector(`script[src="${src}"]`));
}

/**
 * Used to dynamically load a script
 */
function loadScript(src: string, callback?: () => void): void {
  if (isScriptLoaded(src)) {
    callback?.();
    return;
  }
  const localeScript = document.createElement('script');
  localeScript.async = true;
  localeScript.src = src;
  localeScript.onload = () => callback?.();
  document.head.appendChild(localeScript);
}

export { convertIntlToDayjsLocale, loadScript };
