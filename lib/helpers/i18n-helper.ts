import axios from 'axios';
import { i18n } from 'i18next';
import { useTranslation } from 'react-i18next';

const 한글자음 = ['r', 'R', 's', 'e', 'E', 'f', 'a', 'q', 'Q', 't', 'T', 'd', 'w', 'W', 'c', 'z', 'x', 'v', 'g']; // ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ
const 한글모음 = ['k', 'o', 'i', 'O', 'j', 'p', 'u', 'P', 'h', 'hk', 'ho', 'hl', 'y', 'n', 'nj', 'np', 'nl', 'b', 'm', 'ml', 'l']; // ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ
const 한글받침 = ['', 'r', 'R', 'rt', 's', 'sw', 'sg', 'e', 'f', 'fr', 'fa', 'fq', 'ft', 'fx', 'fv', 'fg', 'a', 'q', 'qt', 't', 'T', 'd', 'w', 'c', 'z', 'x', 'v', 'g']; // 아악앆앇안앉않앋알앍앎앏앐앑앒앓암압앖앗았앙앚앛앜앝앞앟

const koreanCharToKey: {[ch: string]: string} = {};
let num = 44032;

한글자음.forEach(j => {
  한글모음.forEach(m => {
    한글받침.forEach(b => {
      const ch = String.fromCharCode(num++);
      const key = `${j}${m}${b}`;
      koreanCharToKey[ch] = key;
    });
  });
});

const 한글조사 = {
  '을': ['을', '를'],
  '은': ['은', '는'],
  '이': ['이', '가'],
};

const SUPPORTED_LOCALES = [
  'ko-KR',
  'en-US',
];

export function detachLocaleString(locale: string) {
  const loc = SUPPORTED_LOCALES.indexOf(locale || '') >= 0 ? locale : 'ko-KR'
  const s = loc.split('-');
  return { country: s[1], language: s[0] };
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

const convertToKeyInput =
  (keyword: string) =>
    (keyword || '')
      .split('')
      .reduce((prv, cur, idx) => (prv + (koreanCharToKey[cur] ?? cur)), '');

export function isStartingWith(source: string, keyword: string) {
  const src = convertToKeyInput(source);
  const key = convertToKeyInput(keyword);
  console.log(src, key);
}

export function setupLanguageDatas(i18next: i18n, data: {[locale: string]: any}) {
  Object.keys(data).forEach(key => {
    i18next.addResourceBundle(key, 'translation', data[key]);
  });
}

export function isKoreanEndWithConsonant(word: string) {
  const finalChrCode = word.charCodeAt(word.length - 1);
  const finalConsonantCode = (finalChrCode - 44032) % 28;
  return finalConsonantCode !== 0;
}

export function useI18n(prefix: string = '') {
  const { t, i18n, ready } = useTranslation();
  const nt = (key: string, arg1?: any, arg2?: any) => `${t(`${!!prefix ? (prefix + '.') : ''}${key}`, arg1, arg2)}`;
  return { t: nt, l: nt, g: t, i18n, ready };
}
