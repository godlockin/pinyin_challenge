/**
 * 练习渲染组件
 * 根据不同练习模式渲染对应内容
 * 支持智能换行、保留原文格式
 */

import { useMemo } from 'react';
import { ExerciseMode, GridType } from '../../types';
import type { StyleSettings, PinyinPair, GridType as GridTypeT } from '../../types';
import { TianZiGe } from '../grids/TianZiGe';
import { SiXianSanGe } from '../grids/SiXianSanGe';
import { HengXian } from '../grids/HengXian';
import { PinyinDisplay, PinyinOptions, PinyinCorrectionItem } from '../grids/PinyinDisplay';
import { generateWrongPinyin } from '../../services/pinyinService';
import {
  parseText,
  splitIntoFixedGridLines,
  type ParsedChar,
  type ParsedLine,
} from '../../services/textParserService';

// A4 内容区域宽度（595px - 80px padding）
const CONTENT_WIDTH = 515;

interface ExerciseRendererProps {
  mode: ExerciseMode;
  inputText: string;
  style: StyleSettings;
  showAnswer?: boolean;
  className?: string;
  /** 从文件解析的拼音配对（优先使用） */
  pinyinPairs?: PinyinPair[];
  /** 格式类型 */
  gridType?: GridTypeT;
}

export function ExerciseRenderer({
  mode,
  inputText,
  style,
  showAnswer = false,
  className = '',
  pinyinPairs,
  gridType,
}: ExerciseRendererProps) {
  const { fontSize, letterSpacing } = style;

  // 构建拼音映射
  const pinyinMap = useMemo(() => {
    if (!pinyinPairs || pinyinPairs.length === 0) return undefined;
    const map = new Map<string, string>();
    for (const pair of pinyinPairs) {
      map.set(pair.hanzi, pair.pinyin);
    }
    return map;
  }, [pinyinPairs]);

  // 解析文本（传入拼音映射）
  const parsedChars = useMemo(
    () => parseText(inputText, pinyinMap),
    [inputText, pinyinMap]
  );

  // 获取渲染模式
  const renderMode = useMemo(() => {
    switch (mode) {
      case ExerciseMode.PinyinToHanzi:
        return 'pinyin-to-hanzi' as const;
      case ExerciseMode.HanziToPinyin:
        return 'hanzi-to-pinyin' as const;
      case ExerciseMode.Review:
        return 'review' as const;
      default:
        return 'other' as const;
    }
  }, [mode]);

  // 智能分行(固定网格:每行 N 格,空格用隐形占位填满)
  const lines = useMemo(() => {
    return splitIntoFixedGridLines(parsedChars, CONTENT_WIDTH, fontSize, letterSpacing, renderMode);
  }, [parsedChars, fontSize, letterSpacing, renderMode]);

  // 根据模式渲染
  const content = useMemo(() => {
    switch (mode) {
      case ExerciseMode.PinyinToHanzi:
        return <PinyinToHanziRenderer lines={lines} style={style} gridType={gridType} />;
      case ExerciseMode.HanziToPinyin:
        return <HanziToPinyinRenderer lines={lines} style={style} gridType={gridType} />;
      case ExerciseMode.Review:
        return <ReviewRenderer lines={lines} style={style} />;
      case ExerciseMode.PolyphonicChoice:
        return <PolyphonicChoiceRenderer chars={parsedChars} style={style} showAnswer={showAnswer} />;
      case ExerciseMode.PinyinCorrection:
        return <PinyinCorrectionRenderer chars={parsedChars} style={style} showAnswer={showAnswer} />;
      default:
        return <div className="text-gray-400">请选择练习模式</div>;
    }
  }, [mode, lines, parsedChars, style, showAnswer, gridType]);

  if (!inputText || inputText.trim() === '') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg mb-2">请在右侧输入汉字内容</p>
        <p className="text-sm">输入内容后将自动生成拼音练习题</p>
      </div>
    );
  }

  return <div className={`exercise-renderer ${className}`}>{content}</div>;
}

interface LineRendererProps {
  lines: ParsedLine[];
  style: StyleSettings;
  gridType?: GridTypeT;
}

interface CharRendererProps {
  chars: ParsedChar[];
  style: StyleSettings;
  showAnswer?: boolean;
}

/**
 * 看拼音写汉字
 */
function PinyinToHanziRenderer({ lines, style, gridType }: LineRendererProps) {
  const { fontSize, letterSpacing, lineHeight } = style;
  const gridSize = fontSize * 2;
  const pinyinSize = fontSize * 0.6;
  const cellWidth = gridSize;

  // 根据格式类型渲染格子
  const renderGrid = () => {
    switch (gridType) {
      case GridType.SiXianSanGe:
        return <SiXianSanGe width={gridSize} height={fontSize * 1.2} showReference={false} />;
      case GridType.HorizontalLine:
        return <HengXian width={gridSize} lineHeight={gridSize} rows={1} />;
      case GridType.Blank:
        return <div style={{ width: `${gridSize}px`, height: `${gridSize}px` }} />;
      case GridType.TianZiGe:
      default:
        return <TianZiGe size={gridSize} showReference={false} />;
    }
  };

  return (
    <div className="space-y-2">
      {lines.map((line, lineIndex) => {
        // 判断是否为标题行(首行且后续有空行)
        const isTitle = lineIndex === 0 && lines.length > 1 &&
                       lines[1]?.chars.every(c => c.isNewline || c.isSpace);
        // 判断是否为作者行(第二行且前后有空行)
        const isAuthor = lineIndex === 1 && lines.length > 2 &&
                        lines[2]?.chars.every(c => c.isNewline || c.isSpace);

        return (
          <div
            key={lineIndex}
            className={`flex flex-wrap items-end exercise-row ${isTitle || isAuthor ? 'justify-center' : ''}`}
            style={{
              gap: `${letterSpacing}px`,
              minHeight: `${lineHeight}px`,
              pageBreakInside: 'avoid',
              breakInside: 'avoid',
            }}
          >
            {line.chars.map((char, charIndex) => {
            // 缩进
            if (char.isIndent) {
              return <div key={charIndex} style={{ width: fontSize * 2 }} />;
            }
            // 空格：隐形占位（固定网格用,不渲染格子但保持布局）
            if (char.isSpace && !char.isIndent) {
              return (
                <div
                  key={charIndex}
                  style={{
                    width: `${cellWidth}px`,
                    visibility: 'hidden',
                  }}
                >
                  {/* 隐形占位:不画拼音/格子,只占布局空间 */}
                </div>
              );
            }
            // 标点符号
            if (char.isPunctuation) {
              return (
                <span
                  key={charIndex}
                  className="self-end"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: `${gridSize}px`,
                    width: `${fontSize * 0.6}px`,
                    textAlign: 'center',
                  }}
                >
                  {char.char}
                </span>
              );
            }
            // 汉字：拼音+田字格作为一个整体
            // ⚠️ 不用 flex 布局:html2canvas 截图 SVG 时,flex items-center 会把子项垂直压缩
            // 拼音区域和 SVG 之间必须有真实 padding 间隔 (margin 在某些 html2canvas 渲染下被忽略)
            return (
              <div
                key={charIndex}
                style={{
                  width: `${cellWidth}px`,
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  paddingTop: '6px', // 真实 padding,不是 spacer div
                }}
              >
                <PinyinDisplay
                  pinyin={char.pinyin}
                  fontSize={pinyinSize}
                  centered
                />
                <div style={{ height: '6px', width: '1px', background: '#fff' }} /> {/* 1px 宽白色背景,让 html2canvas 看到 */}
                {renderGrid()}
              </div>
            );
          })}
        </div>
      );
      })}
    </div>
  );
}

/**
 * 看汉字写拼音
 */
function HanziToPinyinRenderer({ lines, style, gridType }: LineRendererProps) {
  const { fontSize, letterSpacing, lineHeight } = style;
  const charSize = fontSize * 1.5;
  const gridWidth = fontSize * 3;
  const gridHeight = fontSize * 1.2;
  const cellWidth = gridWidth;

  // 根据格式类型渲染书写格
  const renderWritingGrid = () => {
    switch (gridType) {
      case GridType.TianZiGe:
        return <TianZiGe size={gridHeight} showReference={false} />;
      case GridType.HorizontalLine:
        return <HengXian width={gridWidth} lineHeight={gridHeight} rows={1} />;
      case GridType.Blank:
        return <div style={{ width: `${gridWidth}px`, height: `${gridHeight}px` }} />;
      case GridType.SiXianSanGe:
      default:
        return <SiXianSanGe width={gridWidth} height={gridHeight} showReference={false} />;
    }
  };

  return (
    <div className="space-y-2">
      {lines.map((line, lineIndex) => {
        const isTitle = lineIndex === 0 && lines.length > 1 &&
                       lines[1]?.chars.every(c => c.isNewline || c.isSpace);
        const isAuthor = lineIndex === 1 && lines.length > 2 &&
                        lines[2]?.chars.every(c => c.isNewline || c.isSpace);

        return (
          <div
            key={lineIndex}
            className={`flex flex-wrap items-end exercise-row ${isTitle || isAuthor ? 'justify-center' : ''}`}
            style={{
              gap: `${letterSpacing}px`,
              minHeight: `${lineHeight}px`,
              pageBreakInside: 'avoid',
              breakInside: 'avoid',
            }}
          >
          {line.chars.map((char, charIndex) => {
            if (char.isIndent) {
              return <div key={charIndex} style={{ width: fontSize * 2 }} />;
            }
            // 空格:隐形占位 (固定网格)
            if (char.isSpace && !char.isIndent) {
              return (
                <div
                  key={charIndex}
                  style={{
                    width: `${cellWidth}px`,
                    visibility: 'hidden',
                  }}
                />
              );
            }
            if (char.isPunctuation) {
              return (
                <span
                  key={charIndex}
                  className="self-end"
                  style={{
                    fontSize: `${charSize}px`,
                    width: `${fontSize * 0.6}px`,
                    textAlign: 'center',
                  }}
                >
                  {char.char}
                </span>
              );
            }
            return (
              <div
                key={charIndex}
                className="flex flex-col items-center"
                style={{
                  width: `${cellWidth}px`,
                  boxSizing: 'border-box',
                }}
              >
                {renderWritingGrid()}
                <span
                  className="font-serif text-center"
                  style={{
                    fontSize: `${charSize}px`,
                    lineHeight: `${charSize}px`,
                    fontFamily: 'KaiTi, STKaiti, SimKai, serif',
                    width: `${cellWidth}px`,
                  }}
                >
                  {char.char}
                </span>
              </div>
            );
          })}
        </div>
      );
      })}
    </div>
  );
}

/**
 * 复习模式
 */
function ReviewRenderer({ lines, style }: LineRendererProps) {
  const { fontSize, letterSpacing, lineHeight } = style;
  const charSize = fontSize * 1.5;
  const pinyinSize = fontSize * 0.6;
  const cellWidth = charSize;

  return (
    <div className="space-y-4">
      {lines.map((line, lineIndex) => {
        const isTitle = lineIndex === 0 && lines.length > 1 &&
                       lines[1]?.chars.every(c => c.isNewline || c.isSpace);
        const isAuthor = lineIndex === 1 && lines.length > 2 &&
                        lines[2]?.chars.every(c => c.isNewline || c.isSpace);

        return (
          <div
            key={lineIndex}
            className={`flex flex-wrap items-end exercise-row ${isTitle || isAuthor ? 'justify-center' : ''}`}
            style={{
              gap: `${letterSpacing}px`,
              minHeight: `${lineHeight}px`,
              pageBreakInside: 'avoid',
              breakInside: 'avoid',
            }}
          >
          {line.chars.map((char, charIndex) => {
            if (char.isIndent) {
              return <div key={charIndex} style={{ width: fontSize * 2 }} />;
            }
            // 空格：不渲染格子,仅占位
            if (char.isSpace && !char.isIndent) {
              return <div key={charIndex} style={{ width: `${cellWidth}px` }} />;
            }
            if (char.isPunctuation) {
              return (
                <span
                  key={charIndex}
                  className="self-end"
                  style={{
                    fontSize: `${charSize}px`,
                    width: `${fontSize * 0.6}px`,
                    textAlign: 'center',
                  }}
                >
                  {char.char}
                </span>
              );
            }
            return (
              <div
                key={charIndex}
                style={{
                  width: `${cellWidth}px`,
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  paddingTop: `${pinyinSize + 4}px`,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: 0,
                    right: 0,
                    height: `${pinyinSize + 4}px`,
                  }}
                >
                  <PinyinDisplay pinyin={char.pinyin} fontSize={pinyinSize} centered />
                </div>
                <span
                  className="font-serif text-center"
                  style={{
                    fontSize: `${charSize}px`,
                    lineHeight: `${charSize}px`,
                    fontFamily: 'KaiTi, STKaiti, SimKai, serif',
                    width: `${cellWidth}px`,
                  }}
                >
                  {char.char}
                </span>
              </div>
            );
          })}
        </div>
      );
      })}
    </div>
  );
}

/**
 * 多音字选择
 */
function PolyphonicChoiceRenderer({ chars, style, showAnswer }: CharRendererProps) {
  const { fontSize, letterSpacing } = style;

  // 过滤出多音字
  const polyphonicChars = chars.filter(
    (char) => char.isPolyphonic && char.pinyinOptions && char.pinyinOptions.length > 1
  );

  if (polyphonicChars.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">
        输入内容中没有多音字，请尝试其他内容
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500 mb-4">请选择下列多音字的正确读音:</div>
      <div className="flex flex-wrap" style={{ gap: `${letterSpacing * 2}px` }}>
        {polyphonicChars.map((char, index) => (
          <PinyinOptions
            key={index}
            character={char.char}
            options={char.pinyinOptions || [char.pinyin]}
            correctIndex={0}
            showAnswer={showAnswer}
            charFontSize={fontSize * 1.2}
            pinyinFontSize={fontSize * 0.6}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * 简单确定性哈希：对字符串生成一个 0~1 之间的数值
 */
function deterministicHash(str: string, index: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  hash = ((hash << 5) - hash + index) | 0;
  return (Math.abs(hash) % 1000) / 1000;
}

/**
 * 拼音纠错
 */
function PinyinCorrectionRenderer({ chars, style, showAnswer }: CharRendererProps) {
  const { fontSize, letterSpacing, charsPerLine } = style;

  // 生成带有确定性错误的数据（基于文本内容哈希）
  const correctionItems = useMemo(() => {
    const filtered = chars.filter(
      (char) => !char.isPunctuation && !char.isNewline && !char.isSpace && !char.isIndent
    );
    return filtered.map((char, idx) => {
      const hashVal = deterministicHash(char.char + char.pinyin, idx);
      const shouldBeWrong = hashVal < 0.3;
      let displayPinyin = char.pinyin;

      if (shouldBeWrong) {
        // 优先从多音字候选中取错误拼音，否则使用 generateWrongPinyin
        if (char.pinyinOptions && char.pinyinOptions.length > 1) {
          const otherOptions = char.pinyinOptions.filter((p) => p !== char.pinyin);
          if (otherOptions.length > 0) {
            const wrongIdx = Math.floor(deterministicHash(char.char, idx + 100) * otherOptions.length);
            displayPinyin = otherOptions[wrongIdx];
          }
        } else {
          const wrong = generateWrongPinyin(char.pinyin);
          if (wrong !== char.pinyin) {
            displayPinyin = wrong;
          }
        }
      }

      return { ...char, displayPinyin, isWrong: displayPinyin !== char.pinyin };
    });
  }, [chars]);

  // 分行
  const rows = useMemo(() => {
    const result: typeof correctionItems[] = [];
    for (let i = 0; i < correctionItems.length; i += charsPerLine) {
      result.push(correctionItems.slice(i, i + charsPerLine));
    }
    return result;
  }, [correctionItems, charsPerLine]);

  if (correctionItems.length === 0) {
    return <div className="text-gray-400 text-center py-8">请输入汉字内容</div>;
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-4">请找出下列拼音标注中的错误，并改正:</div>
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-wrap exercise-row"
          style={{
            gap: `${letterSpacing}px`,
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
          }}
        >
          {row.map((item, charIndex) => (
            <PinyinCorrectionItem
              key={charIndex}
              character={item.char}
              displayPinyin={item.displayPinyin}
              correctPinyin={item.pinyin}
              showAnswer={showAnswer}
              charFontSize={fontSize}
              pinyinFontSize={fontSize * 0.6}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default ExerciseRenderer;
