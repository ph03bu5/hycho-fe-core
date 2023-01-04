const 한글자음 = ['r', 'R', 's', 'e', 'E', 'f', 'a', 'q', 'Q', 't', 'T', 'd', 'w', 'W', 'c', 'z', 'x', 'v', 'g']; // ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ
const 한글모음 = ['k', 'o', 'i', 'O', 'j', 'p', 'u', 'P', 'h', 'hk', 'ho', 'hl', 'y', 'n', 'nj', 'np', 'nl', 'b', 'm', 'ml', 'l']; // ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ
const 한글받침 = ['', 'r', 'R', 'rt', 's', 'sw', 'sg', 'e', 'f', 'fr', 'fa', 'fq', 'ft', 'fx', 'fv', 'fg', 'a', 'q', 'qt', 't', 'T', 'd', 'w', 'c', 'z', 'x', 'v', 'g']; // 아악앆앇안앉않앋알앍앎앏앐앑앒앓암압앖앗았앙앚앛앜앝앞앟

const koreanCharToKey = {};
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

const convertToKeyInput =
  (keyword) =>
    (keyword || '')
      .split('')
      .reduce((prv, cur, idx) => (prv + (koreanCharToKey[cur] ?? cur)), '');

function isStartingWith(source, keyword) {
  const src = convertToKeyInput(source);
  const key = convertToKeyInput(keyword);
  console.log(src, key);
  return src.startsWith(key);
}

isStartingWith('대한민국', '대하');
