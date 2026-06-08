/**
 * 拼音显示组件
 * 支持声调符号显示和可配置字号
 */

interface PinyinDisplayProps {
  /** 拼音文本（带声调符号） */
  pinyin: string;
  /** 字体大小（像素） */
  fontSize?: number;
  /** 文字颜色 */
  color?: string;
  /** 字体粗细 */
  fontWeight?: 'normal' | 'bold' | 'light';
  /** 是否居中 */
  centered?: boolean;
  /** 字间距 */
  letterSpacing?: number;
  /** 自定义类名 */
  className?: string;
}

export function PinyinDisplay({
  pinyin,
  fontSize = 16,
  color = '#333333',
  fontWeight = 'normal',
  centered = true,
  letterSpacing = 0,
  className = '',
}: PinyinDisplayProps) {
  return (
    <div className={className}>
      <div
        className={`font-serif ${centered ? 'text-center' : ''}`}
        style={{
          fontSize: `${fontSize}px`,
          color,
          fontWeight,
          letterSpacing: `${letterSpacing}px`,
          lineHeight: `${fontSize}px`,
          height: `${fontSize}px`,
          paddingBottom: '4px',
          background: '#fff',
          fontFamily: 'Times New Roman, STSong, SimSun, serif',
          boxSizing: 'border-box',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {pinyin}
      </div>
    </div>
  );
}

/**
 * 拼音标注组件
 * 显示汉字上方的拼音标注
 */
interface PinyinAnnotationProps {
  /** 汉字 */
  character: string;
  /** 拼音 */
  pinyin: string;
  /** 汉字字号 */
  charFontSize?: number;
  /** 拼音字号 */
  pinyinFontSize?: number;
  /** 汉字颜色 */
  charColor?: string;
  /** 拼音颜色 */
  pinyinColor?: string;
  /** 是否高亮（用于多音字选择等场景） */
  highlighted?: boolean;
  /** 高亮颜色 */
  highlightColor?: string;
  /** 自定义类名 */
  className?: string;
}

export function PinyinAnnotation({
  character,
  pinyin,
  charFontSize = 24,
  pinyinFontSize = 14,
  charColor = '#333333',
  pinyinColor = '#666666',
  highlighted = false,
  highlightColor = '#ff6b6b',
  className = '',
}: PinyinAnnotationProps) {
  return (
    <div
      className={className}
      style={{
        minWidth: `${charFontSize}px`,
        display: 'block',
        textAlign: 'center',
      }}
    >
      {/* 拼音 */}
      <PinyinDisplay
        pinyin={pinyin}
        fontSize={pinyinFontSize}
        color={highlighted ? highlightColor : pinyinColor}
        centered
      />

      {/* 汉字 */}
      <span
        className="font-serif"
        style={{
          fontSize: `${charFontSize}px`,
          color: highlighted ? highlightColor : charColor,
          fontFamily: 'KaiTi, STKaiti, SimKai, serif',
        }}
      >
        {character}
      </span>
    </div>
  );
}

/**
 * 多拼音选项组件
 * 用于多音字选择练习
 */
interface PinyinOptionsProps {
  /** 汉字 */
  character: string;
  /** 拼音选项列表 */
  options: string[];
  /** 正确答案索引 */
  correctIndex?: number;
  /** 是否显示答案 */
  showAnswer?: boolean;
  /** 汉字字号 */
  charFontSize?: number;
  /** 拼音字号 */
  pinyinFontSize?: number;
  /** 自定义类名 */
  className?: string;
}

export function PinyinOptions({
  character,
  options,
  correctIndex,
  showAnswer = false,
  charFontSize = 28,
  pinyinFontSize = 14,
  className = '',
}: PinyinOptionsProps) {
  return (
    <div
      className={`inline-flex flex-col items-center gap-2 p-2 border border-gray-200 rounded ${className}`}
    >
      {/* 汉字 */}
      <span
        className="font-serif"
        style={{
          fontSize: `${charFontSize}px`,
          fontFamily: 'KaiTi, STKaiti, SimKai, serif',
        }}
      >
        {character}
      </span>

      {/* 拼音选项 */}
      <div className="flex gap-3">
        {options.map((option, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded text-sm border ${
              showAnswer && index === correctIndex
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-300 text-gray-600'
            }`}
            style={{
              fontSize: `${pinyinFontSize}px`,
              fontFamily: 'Times New Roman, serif',
            }}
          >
            {String.fromCharCode(65 + index)}. {option}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * 拼音纠错组件
 * 显示可能错误的拼音，让学生判断
 */
interface PinyinCorrectionItemProps {
  /** 汉字 */
  character: string;
  /** 显示的拼音（可能是错误的） */
  displayPinyin: string;
  /** 正确的拼音 */
  correctPinyin: string;
  /** 是否显示答案 */
  showAnswer?: boolean;
  /** 汉字字号 */
  charFontSize?: number;
  /** 拼音字号 */
  pinyinFontSize?: number;
  /** 自定义类名 */
  className?: string;
}

export function PinyinCorrectionItem({
  character,
  displayPinyin,
  correctPinyin,
  showAnswer = false,
  charFontSize = 24,
  pinyinFontSize = 14,
  className = '',
}: PinyinCorrectionItemProps) {
  const isWrong = displayPinyin !== correctPinyin;

  return (
    <div
      className={`inline-flex flex-col items-center gap-1 ${className}`}
    >
      {/* 拼音（带错误标记） */}
      <div className="relative">
        <PinyinDisplay
          pinyin={displayPinyin}
          fontSize={pinyinFontSize}
          color={showAnswer && isWrong ? '#ef4444' : '#333'}
          centered
        />
        {showAnswer && isWrong && (
          <div
            className="absolute left-0 right-0 border-t-2 border-red-500"
            style={{
              top: '50%',
              transform: 'rotate(-10deg)',
            }}
          />
        )}
      </div>

      {/* 汉字 */}
      <span
        className="font-serif"
        style={{
          fontSize: `${charFontSize}px`,
          fontFamily: 'KaiTi, STKaiti, SimKai, serif',
        }}
      >
        {character}
      </span>

      {/* 正确答案（如果显示） */}
      {showAnswer && isWrong && (
        <PinyinDisplay
          pinyin={correctPinyin}
          fontSize={pinyinFontSize}
          color="#22c55e"
          centered
        />
      )}
    </div>
  );
}

export default PinyinDisplay;
