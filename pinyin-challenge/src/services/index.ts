/**
 * 服务模块导出入口
 */

export {
  exportToPDF,
  exportToImage,
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  A4_WIDTH_PT,
  A4_HEIGHT_PT,
} from './exportService';
export type { ExportOptions } from './exportService';

export {
  isChinese,
  isPolyphonic,
  getAllPinyinReadings,
  convertToPinyin,
  getCharacterInfo,
  convertTextToPinyin,
  removeTone,
  generateWrongPinyin,
  customPinyin,
} from './pinyinService';

export {
  parseFile,
  detectFileType,
  validateFileSize,
  getSupportedFileTypes,
  getSupportedMimeTypes,
} from './fileParserService';
export type { ParseResult, SupportedFileType } from './fileParserService';

export {
  parseText,
  splitIntoLines,
  splitIntoPages,
  isPunctuation,
  isWhitespace,
  getCharWidth,
  toCharacterInfo,
} from './textParserService';
export type { ParsedChar, ParsedParagraph, ParsedLine } from './textParserService';
