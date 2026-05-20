/**
 * 拼音相关类型定义
 */

/** 拼音格式选项 */
export type ToneType = 'symbol' | 'num' | 'none';

/** 单个汉字的拼音信息 */
export interface CharacterInfo {
  /** 汉字 */
  char: string;
  /** 默认拼音（带声调） */
  pinyin: string;
  /** 多音字的所有读音选项 */
  pinyinOptions?: string[];
  /** 是否为多音字 */
  isPolyphonic: boolean;
}

/** 拼音转换结果 */
export interface PinyinResult {
  /** 原始文本 */
  text: string;
  /** 转换后的拼音（空格分隔） */
  pinyin: string;
  /** 每个字符的详细信息 */
  characters: CharacterInfo[];
}

/** 拼音转换配置选项 */
export interface PinyinOptions {
  /** 声调类型: symbol(符号) | num(数字) | none(无声调) */
  toneType?: ToneType;
  /** 是否返回多音字的所有读音 */
  multiple?: boolean;
  /** 非汉字字符的处理方式 */
  nonZh?: 'spaced' | 'consecutive' | 'removed';
}

/** 批量转换的单项输入 */
export interface BatchPinyinInput {
  id: string | number;
  text: string;
}

/** 批量转换的单项结果 */
export interface BatchPinyinResult extends PinyinResult {
  id: string | number;
}
