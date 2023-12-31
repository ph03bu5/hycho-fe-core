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

/* 0~9, A~Z, a~z 의 은(false) / 는(true) 구분 맵 */
const NUM_CONSONANT_MAP = [false, false, true, false, true, true, false, false, false, true];
const ALPHA_CONSONANT_MAP = 'lmnrLMNR'; // 조사 '은'을 사용하는 알파벳

export function isKoreanEndWithConsonant(word: string) {
  const finalChr = word.charAt(word.length - 1);
  if (finalChr >= '가' && finalChr <= '힣') {
    const finalChrCode = word.charCodeAt(word.length - 1);
    return (finalChrCode - 44032) % 28 !== 0;
  } else if (finalChr >= 'ㄱ' && finalChr <= 'ㅎ') {
    return false;
  } else if (finalChr >= 'A' && finalChr <= 'z') {
    return ALPHA_CONSONANT_MAP.includes(finalChr);
  } else if (finalChr >= '0' && finalChr <= '9') {
    return NUM_CONSONANT_MAP[parseInt(finalChr)];
  } else {
    return true;
  }
}

export function useI18n(prefix: string = '') {
  const { t, i18n, ready } = useTranslation();
  const pref = !!prefix ? `${prefix}.` : '';

  // t : prefix 앞에 붙여주는 t 함수
  const nt = (key: string, arg1?: any, arg2?: any) => `${t(`${pref}${key}`, arg1, arg2)}`;

  // l : 언어 지정 t 함수
  const at = (lang: string, key: string, arg1?: any, arg2?: any) => `${i18n.getFixedT(lang, 'translation')(`${pref}${key}`, arg1, arg2)}`;

  // o : 레이블 오브젝트에서 현재 언어의 필드값
  const ot = (obj: any) => !!obj ? obj[(i18n.resolvedLanguage || '').replaceAll('-', '')] : undefined;

  // g : 기존 t 함수
  return { t: nt, l: at, o: ot, g: t, i18n, ready };
}

export const getPostposition = (str: string) => {
  const conso = isKoreanEndWithConsonant(str);
  return {
    은: conso ? '은' : '는',
    을: conso ? '을' : '를',
    이: conso ? '이' : '가',
  };
};
