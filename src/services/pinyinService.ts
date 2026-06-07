/**
 * 拼音处理服务
 * 基于 pinyin-pro 提供汉字拼音转换功能
 *
 * 准确率增强（v2）：
 * 1. 多音字补丁字典（chinese-dictionary polyphone） - 修正字频误判
 * 2. 诗词短语字典（addDict） - 长匹配优先，覆盖诗词场景上下文读音
 */

import { pinyin, customPinyin, addDict } from 'pinyin-pro';
import type { CharacterInfo, PinyinResult, ToneType } from '../types';

const DICT_BASE = '/dict';

interface PolyphonicDict {
  [char: string]: string;
}

interface PoetryPhraseDict {
  [phrase: string]: string;
}

let initPromise: Promise<void> | null = null;
let polyphonicMap: PolyphonicDict = {};
let polyphonicOptionsCache: Map<string, string[]> = new Map();
let poetryPhraseCount = 0;

/**
 * 初始化拼音字典（幂等）
 * - 加载多音字补丁并通过 customPinyin(replace) 强制覆盖默认读音
 * - 加载诗词短语并通过 addDict 注入（最长匹配优先）
 * - 并发安全：多次调用共享同一 Promise
 */
export async function initPinyinDictionaries(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const [polyRes, phraseRes, optionsRes] = await Promise.all([
        fetch(`${DICT_BASE}/polyphone-default.json`),
        fetch(`${DICT_BASE}/poetry-phrase.json`),
        fetch(`${DICT_BASE}/polyphone-options.json`),
      ]);

      if (!polyRes.ok || !phraseRes.ok) {
        console.warn('[pinyin] 字典加载失败，使用 pinyin-pro 默认字频');
        return;
      }

      polyphonicMap = await polyRes.json() as PolyphonicDict;
      const phraseDict = await phraseRes.json() as PoetryPhraseDict;
      poetryPhraseCount = Object.keys(phraseDict).length;
      if (optionsRes.ok) {
        polyphonicOptionsCache = new Map(
          Object.entries(await optionsRes.json() as Record<string, string[]>)
        );
      }

      // 1. 多音字补丁 - 强制覆盖默认（polyphonic: 'replace'）
      customPinyin(polyphonicMap, { polyphonic: 'replace' });

      // 2. 诗词短语 - 整句绑定（addDict 优先级最高）
      addDict(phraseDict);

      // 调试: 暴露到 window (仅开发环境)
      if (import.meta.env.DEV && typeof window !== 'undefined') {
        (window as unknown as Record<string, unknown>).__pinyin = pinyin;
        (window as unknown as Record<string, unknown>).__convertToPinyin = convertToPinyin;
        (window as unknown as Record<string, unknown>).__polyphonicMap = polyphonicMap;
      }

      console.log(
        `[pinyin] 字典已加载: 多音字 ${Object.keys(polyphonicMap).length} 个, ` +
        `诗词短语 ${Object.keys(phraseDict).length} 条`
      );
    } catch (err) {
      console.error('[pinyin] 字典初始化异常:', err);
    }
  })();

  return initPromise;
}

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
 * 优先使用 chinese-dictionary 提供的候选列表
 * 注: customPinyin 的 replace 模式会改默认读音，但不会动 multiple 列表顺序
 *     因此 getCharacterInfo 取的 [0] 仍是字典原序，对常见字会出现"候选首项≠默认音"
 *     修复方案: 如果默认音 polyphonicMap[char] 不在 [0]，把默认音挪到第一位
 */
export function getAllPinyinReadings(char: string, toneType: ToneType = 'symbol'): string[] {
  if (!isChinese(char)) return [];

  // 优先从缓存取（教学场景：笔画、部首、结构信息更全）
  if (polyphonicOptionsCache.has(char)) {
    const options = polyphonicOptionsCache.get(char)!;
    // 同步默认音到第一位（保证 getCharacterInfo 取得的是 polyphonicMap 中的值）
    const preferred = polyphonicMap[char];
    if (preferred && options[0] !== preferred && options.includes(preferred)) {
      const reordered = [preferred, ...options.filter(p => p !== preferred)];
      return applyToneType(reordered, toneType);
    }
    return applyToneType(options, toneType);
  }

  const options = {
    multiple: true,
    type: 'array' as const,
    toneType: toneType === 'symbol' ? 'symbol' as const :
              toneType === 'num' ? 'num' as const : 'none' as const,
  };

  return pinyin(char, options) as string[];
}

function applyToneType(readings: string[], toneType: ToneType): string[] {
  if (toneType === 'none') {
    return readings.map(removeToneLocal);
  }
  if (toneType === 'num') {
    return readings.map(symbolToNum);
  }
  return readings;
}

const TONE_MAP: Record<string, [string, number]> = {
  'ā': ['a', 1], 'á': ['a', 2], 'ǎ': ['a', 3], 'à': ['a', 4],
  'ē': ['e', 1], 'é': ['e', 2], 'ě': ['e', 3], 'è': ['e', 4],
  'ī': ['i', 1], 'í': ['i', 2], 'ǐ': ['i', 3], 'ì': ['i', 4],
  'ō': ['o', 1], 'ó': ['o', 2], 'ǒ': ['o', 3], 'ò': ['o', 4],
  'ū': ['u', 1], 'ú': ['u', 2], 'ǔ': ['u', 3], 'ù': ['u', 4],
  'ǖ': ['ü', 1], 'ǘ': ['ü', 2], 'ǚ': ['ü', 3], 'ǜ': ['ü', 4],
};

function removeToneLocal(s: string): string {
  return s.split('').map(c => TONE_MAP[c as keyof typeof TONE_MAP]?.[0] ?? c).join('');
}

function symbolToNum(s: string): string {
  let result = '';
  for (const c of s) {
    const mapped = TONE_MAP[c as keyof typeof TONE_MAP];
    if (mapped) result += mapped[0] + mapped[1];
    else result += c;
  }
  return result;
}

/**
 * 汉字转拼音
 * 已在初始化阶段注入多音字补丁与诗词短语字典
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
  return pinyinStr.split('').map(c => TONE_MAP[c as keyof typeof TONE_MAP]?.[0] ?? c).join('');
}

/**
 * 生成错误拼音（用于纠错练习）
 */
export function generateWrongPinyin(correctPinyin: string): string {
  const vowelPairs: Array<[string, string]> = [
    ['a', 'e'], ['e', 'i'], ['i', 'u'], ['o', 'u'],
    ['ai', 'ei'], ['ao', 'ou'], ['an', 'en'], ['ang', 'eng'],
    ['in', 'un'], ['ing', 'ong'],
  ];

  const consonantPairs: Array<[string, string]> = [
    ['b', 'p'], ['d', 't'], ['g', 'k'],
    ['z', 'c'], ['zh', 'ch'], ['s', 'sh'],
    ['j', 'q'], ['l', 'n'], ['f', 'h'],
  ];

  let result = correctPinyin.toLowerCase();

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

/**
 * 获取当前已加载的多音字数量（用于调试与可观测性）
 */
export function getDictStats(): { polyphonic: number; poetryPhrases: number } {
  return {
    polyphonic: Object.keys(polyphonicMap).length,
    poetryPhrases: poetryPhraseCount,
  };
}

export { customPinyin };
