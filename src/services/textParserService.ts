/**
 * 文本解析服务
 * 处理段落、换行、标点符号，保留原文格式
 */

import { convertTextToPinyin, isChinese } from './pinyinService';
import type { CharacterInfo } from '../types/pinyin';

// 标点符号正则
const PUNCTUATION_REGEX = /[，。！？、；：""''（）【】《》—…·,.!?;:"'()\[\]\-\/@#$%^&*+=]/;

// 不能出现在行首的标点正则
const NO_LINE_START_REGEX = /[，。！？、；："'）】》,.!?;:"'\)]/;

// 不能出现在行尾的标点正则（暂未使用，保留以备将来扩展）
// const NO_LINE_END_REGEX = /["'（【《"'\(\[]/;

export interface ParsedChar {
  char: string;
  pinyin: string;
  pinyinOptions?: string[];
  isPolyphonic: boolean;
  isPunctuation: boolean;
  isNewline: boolean;
  isSpace: boolean;
  isIndent: boolean; // 段首缩进
}

export interface ParsedParagraph {
  chars: ParsedChar[];
  isNewParagraph: boolean;
}

export interface ParsedLine {
  chars: ParsedChar[];
  isFirstLineOfParagraph: boolean;
}

/**
 * 判断是否为标点符号
 */
export function isPunctuation(char: string): boolean {
  return PUNCTUATION_REGEX.test(char);
}

/**
 * 判断是否为空白字符
 */
export function isWhitespace(char: string): boolean {
  return /\s/.test(char);
}

/**
 * 解析文本为字符数组，保留格式信息
 * @param text 输入文本
 * @param pinyinMap 可选的拼音映射（从文件解析获得，优先使用）
 */
export function parseText(
  text: string,
  pinyinMap?: Map<string, string>
): ParsedChar[] {
  if (!text) return [];

  const result: ParsedChar[] = [];
  const chars = text.split('');

  let i = 0;
  while (i < chars.length) {
    const char = chars[i];

    // 处理换行
    if (char === '\n') {
      result.push({
        char: '\n',
        pinyin: '',
        isPolyphonic: false,
        isPunctuation: false,
        isNewline: true,
        isSpace: false,
        isIndent: false,
      });
      i++;
      continue;
    }

    // 处理空格（检测段首缩进：连续2个或以上空格）
    if (isWhitespace(char)) {
      let spaceCount = 0;
      let j = i;
      while (j < chars.length && isWhitespace(chars[j]) && chars[j] !== '\n') {
        spaceCount++;
        j++;
      }

      // 检查是否为段首（前面是换行或开头）
      const isAtStart = i === 0 || (result.length > 0 && result[result.length - 1].isNewline);
      const isIndent = isAtStart && spaceCount >= 2;

      if (isIndent) {
        result.push({
          char: '　　', // 两个全角空格表示缩进
          pinyin: '',
          isPolyphonic: false,
          isPunctuation: false,
          isNewline: false,
          isSpace: true,
          isIndent: true,
        });
      }

      i = j;
      continue;
    }

    // 处理标点符号
    if (isPunctuation(char)) {
      result.push({
        char,
        pinyin: '',
        isPolyphonic: false,
        isPunctuation: true,
        isNewline: false,
        isSpace: false,
        isIndent: false,
      });
      i++;
      continue;
    }

    // 处理汉字
    if (isChinese(char)) {
      // 优先使用传入的拼音映射（来自文件解析）
      const mappedPinyin = pinyinMap?.get(char);

      if (mappedPinyin) {
        // 使用文件中的原始拼音
        result.push({
          char,
          pinyin: mappedPinyin,
          isPolyphonic: false,
          isPunctuation: false,
          isNewline: false,
          isSpace: false,
          isIndent: false,
        });
      } else {
        // 使用 pinyin-pro 生成拼音
        const pinyinResult = convertTextToPinyin(char);
        const charInfo = pinyinResult.characters[0];
        result.push({
          char,
          pinyin: charInfo?.pinyin || '',
          pinyinOptions: charInfo?.pinyinOptions,
          isPolyphonic: charInfo?.isPolyphonic || false,
          isPunctuation: false,
          isNewline: false,
          isSpace: false,
          isIndent: false,
        });
      }
      i++;
      continue;
    }

    // 其他字符（数字、字母等）
    result.push({
      char,
      pinyin: char,
      isPolyphonic: false,
      isPunctuation: false,
      isNewline: false,
      isSpace: false,
      isIndent: false,
    });
    i++;
  }

  return result;
}

/**
 * 计算单个字符的显示宽度（像素）
 * 宽度基于格子/汉字大小，拼音居中显示不影响宽度
 */
export function getCharWidth(
  char: ParsedChar,
  fontSize: number,
  mode: 'pinyin-to-hanzi' | 'hanzi-to-pinyin' | 'review' | 'other'
): number {
  if (char.isNewline) return 0;
  if (char.isIndent) return fontSize * 2;

  // 标点符号宽度
  if (char.isPunctuation) {
    return fontSize * 0.6;
  }

  // 根据模式计算宽度（基于格子/汉字大小）
  switch (mode) {
    case 'pinyin-to-hanzi':
      // 田字格宽度 = fontSize * 2
      return fontSize * 2;
    case 'hanzi-to-pinyin':
      // 四线三格宽度 = fontSize * 3
      return fontSize * 3;
    case 'review':
      // 汉字宽度 = fontSize * 1.5
      return fontSize * 1.5;
    default:
      return fontSize;
  }
}

/**
 * 智能分行 - 考虑宽度、换行符、标点规则
 */
export function splitIntoLines(
  chars: ParsedChar[],
  containerWidth: number,
  fontSize: number,
  letterSpacing: number,
  mode: 'pinyin-to-hanzi' | 'hanzi-to-pinyin' | 'review' | 'other'
): ParsedLine[] {
  const lines: ParsedLine[] = [];
  let currentLine: ParsedChar[] = [];
  let currentWidth = 0;
  let isFirstLineOfParagraph = true;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    // 遇到换行符，结束当前行
    if (char.isNewline) {
      if (currentLine.length > 0) {
        lines.push({ chars: currentLine, isFirstLineOfParagraph });
      }
      currentLine = [];
      currentWidth = 0;
      isFirstLineOfParagraph = true;
      continue;
    }

    const charWidth = getCharWidth(char, fontSize, mode) + letterSpacing;

    // 检查是否需要换行
    if (currentWidth + charWidth > containerWidth && currentLine.length > 0) {
      // 检查标点规则
      if (NO_LINE_START_REGEX.test(char.char) && currentLine.length > 0) {
        // 标点不能在行首，把前一个字符移到下一行
        const lastChar = currentLine.pop()!;
        lines.push({ chars: currentLine, isFirstLineOfParagraph });
        currentLine = [lastChar, char];
        currentWidth = getCharWidth(lastChar, fontSize, mode) + charWidth + letterSpacing;
      } else {
        lines.push({ chars: currentLine, isFirstLineOfParagraph });
        currentLine = [char];
        currentWidth = charWidth;
      }
      isFirstLineOfParagraph = false;
    } else {
      currentLine.push(char);
      currentWidth += charWidth;
    }
  }

  // 处理最后一行
  if (currentLine.length > 0) {
    lines.push({ chars: currentLine, isFirstLineOfParagraph });
  }

  return lines;
}

/**
 * 分页 - 确保内容不被截断
 */
export function splitIntoPages(
  lines: ParsedLine[],
  pageHeight: number,
  lineHeight: number,
  headerHeight: number = 120, // 标题+姓名日期区域
  footerHeight: number = 40,
): ParsedLine[][] {
  const pages: ParsedLine[][] = [];
  let currentPage: ParsedLine[] = [];
  let currentHeight = headerHeight; // 首页有标题区域
  const contentHeight = pageHeight - footerHeight;

  for (const line of lines) {
    if (currentHeight + lineHeight > contentHeight) {
      // 当前页已满，开始新页
      if (currentPage.length > 0) {
        pages.push(currentPage);
      }
      currentPage = [line];
      currentHeight = lineHeight; // 新页没有标题区域
    } else {
      currentPage.push(line);
      currentHeight += lineHeight;
    }
  }

  // 处理最后一页
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

/**
 * 将 ParsedChar 转换为 CharacterInfo（兼容现有组件）
 */
export function toCharacterInfo(char: ParsedChar): CharacterInfo {
  return {
    char: char.char,
    pinyin: char.pinyin,
    pinyinOptions: char.pinyinOptions,
    isPolyphonic: char.isPolyphonic,
  };
}
