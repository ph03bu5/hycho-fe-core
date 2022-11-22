import axios from 'axios';
import { i18n } from 'i18next';

const SUPPORTED_LOCALES = [
  'ko-KR',
  'en-US',
];

export function detachLocaleString(locale: string) {
  const loc = SUPPORTED_LOCALES.indexOf(locale || '') >= 0 ? locale : 'ko-KR'
  const s = loc.split('-');
  return {country: s[1], language: s[0]};
}

export function attachLocaleString(country: string, language: string) {
  const locale = `${(language || 'ko').toLowerCase()}-${(country || 'KR').toUpperCase()}`;
  return SUPPORTED_LOCALES.indexOf(locale) >= 0 ? locale : SUPPORTED_LOCALES[0];
}

export function getI18nData(locale: string) {
  const i18nPath = `./i18n-data/${locale}.json`;  // `${import.meta.env.VITE_API_ROOT}/api/i18n/${locale}.json`;
  return axios.get(i18nPath, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
  }).then(res => res.data);
}

export async function changeLang(i18next: i18n, locale: string, callbackFunc?: (param: any) => void) {
  const data = await getI18nData(locale);
  if (callbackFunc !== undefined) i18next.store.on('added', callbackFunc);
  i18next.addResourceBundle(locale, 'translation', data);
  await i18next.changeLanguage(locale);
}