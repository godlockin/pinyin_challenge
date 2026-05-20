/**
 * 拼音处理服务
 * 基于 pinyin-pro 提供汉字拼音转换功能
 */

import { pinyin, customPinyin } from 'pinyin-pro';
import type { CharacterInfo, PinyinResult, ToneType } from '../types';

/**
 * 判断字符是否为汉字
 */
export function isChinese(char: string): boolean {
  return /[一-鿿]/.test(char);
}

/**
 * 判断是否多音字
 */
export function isPolyphonic(char: string): boolean {
  if (!isChinese(char)) return false;
  const result = pinyin(char, { multiple: true, type: 'array' });
  return result.length > 1;
}

/**
 * 获取多音字的所有读音
 */
export function getAllPinyinReadings(char: string, toneType: ToneType = 'symbol'): string[] {
  if (!isChinese(char)) return [];

  const options = {
    multiple: true,
    type: 'array' as const,
    toneType: toneType === 'symbol' ? 'symbol' as const :
              toneType === 'num' ? 'num' as const : 'none' as const,
  };

  return pinyin(char, options) as string[];
}

/**
 * 汉字转拼音
 */
export function convertToPinyin(text: string, toneType: ToneType = 'symbol'): string {
  const options = {
    toneType: toneType === 'symbol' ? 'symbol' as const :
              toneType === 'num' ? 'num' as const : 'none' as const,
    type: 'string' as const,
  };

  return pinyin(text, options);
}

/**
 * 获取单个字符的详细信息
 */
export function getCharacterInfo(char: string, toneType: ToneType = 'symbol'): CharacterInfo {
  if (!isChinese(char)) {
    return {
      char,
      pinyin: char,
      isPolyphonic: false,
    };
  }

  const pinyinOptions = getAllPinyinReadings(char, toneType);
  const defaultPinyin = pinyinOptions[0] || '';

  return {
    char,
    pinyin: defaultPinyin,
    pinyinOptions: pinyinOptions.length > 1 ? pinyinOptions : undefined,
    isPolyphonic: pinyinOptions.length > 1,
  };
}

/**
 * 文本转换为拼音结果
 */
export function convertTextToPinyin(
  text: string,
  options: { toneType?: ToneType } = {}
): PinyinResult {
  const { toneType = 'symbol' } = options;
  const characters: CharacterInfo[] = [];

  for (const char of text) {
    characters.push(getCharacterInfo(char, toneType));
  }

  const pinyinStr = convertToPinyin(text, toneType);

  return {
    text,
    pinyin: pinyinStr,
    characters,
  };
}

/**
 * 移除声调
 */
export function removeTone(pinyinStr: string): string {
  const toneMap: Record<string, string> = {
    'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
    'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
    'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
    'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
    'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
    'ǖ': 'ü', 'ǘ': 'ü', 'ǚ': 'ü', 'ǜ': 'ü',
  };

  return pinyinStr.split('').map(char => toneMap[char] || char).join('');
}

/**
 * 生成错误拼音（用于纠错练习）
 */
export function generateWrongPinyin(correctPinyin: string): string {
  const vowelPairs = [
    ['a', 'e'], ['e', 'i'], ['i', 'u'], ['o', 'u'],
    ['ai', 'ei'], ['ao', 'ou'], ['an', 'en'], ['ang', 'eng'],
    ['in', 'un'], ['ing', 'ong'],
  ];

  const consonantPairs = [
    ['b', 'p'], ['d', 't'], ['g', 'k'],
    ['z', 'c'], ['zh', 'ch'], ['s', 'sh'],
    ['j', 'q'], ['l', 'n'], ['f', 'h'],
  ];

  let result = correctPinyin.toLowerCase();

  // 随机选择替换元音或声母
  const useVowel = Math.random() > 0.5;
  const pairs = useVowel ? vowelPairs : consonantPairs;

  for (const [a, b] of pairs) {
    if (result.includes(a)) {
      result = result.replace(a, b);
      break;
    }
    if (result.includes(b)) {
      result = result.replace(b, a);
      break;
    }
  }

  return result;
}

export { customPinyin };
