import axios from 'axios';
import { i18n } from 'i18next';
import { useTranslation } from 'react-i18next';

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

export function setupLanguageDatas(i18next: i18n, data: {[locale: string]: any}) {
  Object.keys(data).forEach(key => {
    i18next.addResourceBundle(key, 'translation', data[key]);
  });
}

export function useI18n(prefix: string = '') {
  const {t, i18n, ready} = useTranslation();
  const nt = (key: string, ...args: any[]) => `${t(`${!!prefix ? (prefix + '.') : ''}${key}`, ...args)}`;
  return { t: nt, l: nt, g: t, i18n, ready };
}
