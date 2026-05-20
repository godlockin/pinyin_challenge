/**
 * 练习渲染组件
 * 根据不同练习模式渲染对应内容
 * 支持智能换行、保留原文格式
 */

import { useMemo } from 'react';
import { ExerciseMode } from '../../types';
import type { StyleSettings, PinyinPair } from '../../types';
import { TianZiGe } from '../grids/TianZiGe';
import { SiXianSanGe } from '../grids/SiXianSanGe';
import { PinyinDisplay, PinyinOptions, PinyinCorrectionItem } from '../grids/PinyinDisplay';
import {
  parseText,
  splitIntoLines,
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
}

export function ExerciseRenderer({
  mode,
  inputText,
  style,
  showAnswer = false,
  className = '',
  pinyinPairs,
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

  // 智能分行
  const lines = useMemo(() => {
    return splitIntoLines(parsedChars, CONTENT_WIDTH, fontSize, letterSpacing, renderMode);
  }, [parsedChars, fontSize, letterSpacing, renderMode]);

  // 根据模式渲染
  const content = useMemo(() => {
    switch (mode) {
      case ExerciseMode.PinyinToHanzi:
        return <PinyinToHanziRenderer lines={lines} style={style} />;
      case ExerciseMode.HanziToPinyin:
        return <HanziToPinyinRenderer lines={lines} style={style} />;
      case ExerciseMode.Review:
        return <ReviewRenderer lines={lines} style={style} />;
      case ExerciseMode.PolyphonicChoice:
        return <PolyphonicChoiceRenderer chars={parsedChars} style={style} showAnswer={showAnswer} />;
      case ExerciseMode.PinyinCorrection:
        return <PinyinCorrectionRenderer chars={parsedChars} style={style} showAnswer={showAnswer} />;
      default:
        return <div className="text-gray-400">请选择练习模式</div>;
    }
  }, [mode, lines, parsedChars, style, showAnswer]);

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
}

interface CharRendererProps {
  chars: ParsedChar[];
  style: StyleSettings;
  showAnswer?: boolean;
}

/**
 * 看拼音写汉字
 */
function PinyinToHanziRenderer({ lines, style }: LineRendererProps) {
  const { fontSize, letterSpacing, lineHeight } = style;
  const gridSize = fontSize * 2;
  const pinyinSize = fontSize * 0.6;
  // 每个字符单元的宽度 = 田字格宽度（拼音居中显示在上方）
  const cellWidth = gridSize;

  return (
    <div className="space-y-2">
      {lines.map((line, lineIndex) => (
        <div
          key={lineIndex}
          className="flex flex-wrap items-end exercise-row"
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
            return (
              <div
                key={charIndex}
                className="flex flex-col items-center"
                style={{ width: `${cellWidth}px` }}
              >
                <PinyinDisplay
                  pinyin={char.pinyin}
                  fontSize={pinyinSize}
                  centered
                />
                <TianZiGe size={gridSize} showReference={false} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/**
 * 看汉字写拼音
 */
function HanziToPinyinRenderer({ lines, style }: LineRendererProps) {
  const { fontSize, letterSpacing, lineHeight } = style;
  const charSize = fontSize * 1.5;
  const gridWidth = fontSize * 3;
  const gridHeight = fontSize * 1.2;
  const cellWidth = gridWidth;

  return (
    <div className="space-y-2">
      {lines.map((line, lineIndex) => (
        <div
          key={lineIndex}
          className="flex flex-wrap items-end exercise-row"
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
                style={{ width: `${cellWidth}px` }}
              >
                <SiXianSanGe width={gridWidth} height={gridHeight} showReference={false} />
                <span
                  className="font-serif text-center"
                  style={{
                    fontSize: `${charSize}px`,
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
      ))}
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
      {lines.map((line, lineIndex) => (
        <div
          key={lineIndex}
          className="flex flex-wrap items-end exercise-row"
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
                style={{ width: `${cellWidth}px` }}
              >
                <PinyinDisplay pinyin={char.pinyin} fontSize={pinyinSize} centered />
                <span
                  className="font-serif text-center"
                  style={{
                    fontSize: `${charSize}px`,
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
      ))}
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
 * 拼音纠错
 */
function PinyinCorrectionRenderer({ chars, style, showAnswer }: CharRendererProps) {
  const { fontSize, letterSpacing, charsPerLine } = style;

  // 生成带有随机错误的数据
  const correctionItems = useMemo(() => {
    return chars
      .filter((char) => !char.isPunctuation && !char.isNewline && !char.isSpace && !char.isIndent)
      .map((char) => {
        const shouldBeWrong = Math.random() < 0.3;
        let displayPinyin = char.pinyin;

        if (shouldBeWrong && char.pinyinOptions && char.pinyinOptions.length > 1) {
          const otherOptions = char.pinyinOptions.filter((p) => p !== char.pinyin);
          if (otherOptions.length > 0) {
            displayPinyin = otherOptions[0];
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
