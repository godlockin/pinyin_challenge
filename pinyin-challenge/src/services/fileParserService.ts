/**
 * 文件解析服务
 * 支持 txt、pdf、word 文件的文本提取
 * 支持识别拼音+汉字组合
 */

import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url';

// 设置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export type SupportedFileType = 'txt' | 'pdf' | 'docx' | 'doc';

// 拼音+汉字组合
export interface PinyinHanziPair {
  hanzi: string;
  pinyin: string;
}

export interface ParseResult {
  success: boolean;
  text: string;
  error?: string;
  fileType: SupportedFileType | 'unknown';
  charCount: number;
  chineseCount: number;
  pinyinPairs?: PinyinHanziPair[];
  hasPinyinAnnotation?: boolean;
}

// 拼音正则（包含声调符号和 ɡ ŋ 等特殊字符）
const PINYIN_REGEX = /^[a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüɡŋ]+$/;

/**
 * 判断是否为拼音
 */
function isPinyin(str: string): boolean {
  if (!str || str.length > 10) return false;
  return PINYIN_REGEX.test(str);
}

/**
 * 判断是否为汉字
 */
function isHanzi(char: string): boolean {
  return /^[一-鿿]$/.test(char);
}

/**
 * 检测文件类型
 */
export function detectFileType(file: File): SupportedFileType | 'unknown' {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const mimeType = file.type;

  if (ext === 'txt' || mimeType === 'text/plain') return 'txt';
  if (ext === 'pdf' || mimeType === 'application/pdf') return 'pdf';
  if (ext === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
  if (ext === 'doc' || mimeType === 'application/msword') return 'doc';

  return 'unknown';
}

/**
 * 统计汉字数量
 */
function countChinese(text: string): number {
  const matches = text.match(/[一-鿿]/g);
  return matches ? matches.length : 0;
}

/**
 * 解析 TXT 文件
 */
async function parseTxt(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = () => reject(new Error('读取 TXT 文件失败'));
    reader.readAsText(file, 'UTF-8');
  });
}

interface TextItem {
  str: string;
  x: number;
  y: number;
  width?: number;
}

/**
 * 解析 PDF 文件，识别拼音标注
 * 策略：找到垂直方向上 x 坐标接近的拼音-汉字配对
 * 拼音在上（y 值大），汉字在下（y 值小）
 */
async function parsePdf(file: File): Promise<{ text: string; pairs: PinyinHanziPair[] }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const allItems: TextItem[] = [];

  // 收集所有文本项
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    for (const item of textContent.items) {
      if ('str' in item && item.str.trim()) {
        const transform = item.transform;
        allItems.push({
          str: item.str.trim(),
          x: transform[4],
          y: transform[5],
          width: 'width' in item ? (item.width as number) : undefined,
        });
      }
    }
  }

  // 分离拼音项和汉字项
  const pinyinItems: TextItem[] = [];
  const hanziItems: TextItem[] = [];
  const otherItems: TextItem[] = [];

  for (const item of allItems) {
    if (isPinyin(item.str)) {
      pinyinItems.push(item);
    } else if (item.str.length === 1 && isHanzi(item.str)) {
      hanziItems.push(item);
    } else {
      // 处理多字符混合文本
      otherItems.push(item);
    }
  }

  const pairs: PinyinHanziPair[] = [];
  const pairedPinyinIndices = new Set<number>();
  const pairedHanziIndices = new Set<number>();

  // 配对策略：对于每个汉字，找正上方最近的拼音
  const xThreshold = 20; // x 坐标差异阈值
  const yMin = 5;        // 拼音至少要在汉字上方 5 个单位
  const yMax = 30;       // 拼音和汉字 y 差距最大值

  for (let hi = 0; hi < hanziItems.length; hi++) {
    const hanzi = hanziItems[hi];
    let bestPinyinIdx = -1;
    let bestYDiff = Infinity;

    for (let pi = 0; pi < pinyinItems.length; pi++) {
      if (pairedPinyinIndices.has(pi)) continue;

      const pinyin = pinyinItems[pi];

      // 拼音必须在汉字上方 (y 值更大)
      const yDiff = pinyin.y - hanzi.y;
      if (yDiff < yMin || yDiff > yMax) continue;

      // x 坐标需要接近（拼音可能居中于汉字上方）
      const xDiff = Math.abs(pinyin.x - hanzi.x);
      if (xDiff > xThreshold) continue;

      // 选择 y 差距最合适的（最近的上方拼音）
      if (yDiff < bestYDiff) {
        bestYDiff = yDiff;
        bestPinyinIdx = pi;
      }
    }

    if (bestPinyinIdx >= 0) {
      pairs.push({
        hanzi: hanzi.str,
        pinyin: pinyinItems[bestPinyinIdx].str.toLowerCase(),
      });
      pairedPinyinIndices.add(bestPinyinIdx);
      pairedHanziIndices.add(hi);
    }
  }

  // 构建最终文本：包含未配对的汉字和其他文本
  // 按 y 坐标分组成行
  const yGroupThreshold = 8;
  const allTextItems = [
    ...hanziItems,
    ...otherItems,
  ];

  // 按 y 坐标分组
  const rows = new Map<number, TextItem[]>();
  for (const item of allTextItems) {
    let foundY: number | null = null;
    for (const y of rows.keys()) {
      if (Math.abs(y - item.y) < yGroupThreshold) {
        foundY = y;
        break;
      }
    }
    if (foundY !== null) {
      rows.get(foundY)!.push(item);
    } else {
      rows.set(item.y, [item]);
    }
  }

  // 按 y 从大到小排序（PDF 坐标系 y 向上），然后每行按 x 排序
  const sortedYs = Array.from(rows.keys()).sort((a, b) => b - a);
  const textLines: string[] = [];

  for (const y of sortedYs) {
    const rowItems = rows.get(y)!.sort((a, b) => a.x - b.x);
    const line = rowItems.map(item => item.str).join('');
    if (line.trim()) {
      textLines.push(line);
    }
  }

  const text = textLines.join('\n');

  return { text, pairs };
}

/**
 * 解析 Word 文件 (docx)
 */
async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * 解析文件并提取文本
 */
export async function parseFile(file: File): Promise<ParseResult> {
  const fileType = detectFileType(file);

  if (fileType === 'unknown') {
    return {
      success: false,
      text: '',
      error: '不支持的文件格式。请上传 txt、pdf 或 docx 文件。',
      fileType: 'unknown',
      charCount: 0,
      chineseCount: 0,
    };
  }

  if (fileType === 'doc') {
    return {
      success: false,
      text: '',
      error: '暂不支持旧版 .doc 格式，请转换为 .docx 后重新上传。',
      fileType: 'doc',
      charCount: 0,
      chineseCount: 0,
    };
  }

  try {
    let text = '';
    let pairs: PinyinHanziPair[] = [];

    switch (fileType) {
      case 'txt':
        text = await parseTxt(file);
        break;
      case 'pdf': {
        const pdfResult = await parsePdf(file);
        text = pdfResult.text;
        pairs = pdfResult.pairs;
        break;
      }
      case 'docx':
        text = await parseDocx(file);
        break;
    }

    // 清理文本
    text = text.trim();

    return {
      success: true,
      text,
      fileType,
      charCount: text.length,
      chineseCount: countChinese(text),
      pinyinPairs: pairs.length > 0 ? pairs : undefined,
      hasPinyinAnnotation: pairs.length > 0,
    };
  } catch (error) {
    return {
      success: false,
      text: '',
      error: error instanceof Error ? error.message : '文件解析失败',
      fileType,
      charCount: 0,
      chineseCount: 0,
    };
  }
}

/**
 * 验证文件大小
 */
export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}

/**
 * 获取支持的文件类型描述
 */
export function getSupportedFileTypes(): string {
  return '.txt, .pdf, .docx';
}

/**
 * 获取支持的 MIME 类型
 */
export function getSupportedMimeTypes(): string {
  return 'text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
}
