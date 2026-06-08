/**
 * 田字格组件
 * 用于汉字书写练习，使用 SVG 绘制
 */

interface TianZiGeProps {
  /** 格子大小（像素） */
  size?: number;
  /** 要显示的汉字（作为参考） */
  character?: string;
  /** 是否显示参考字 */
  showReference?: boolean;
  /** 参考字透明度 (0-1) */
  referenceOpacity?: number;
  /** 拼音标注 */
  pinyin?: string;
  /** 是否显示拼音 */
  showPinyin?: boolean;
  /** 边框颜色 */
  borderColor?: string;
  /** 辅助线颜色 */
  guideColor?: string;
  /** 参考字颜色 */
  referenceColor?: string;
  /** 自定义类名 */
  className?: string;
}

export function TianZiGe({
  size = 60,
  character,
  showReference = false,
  referenceOpacity = 0.2,
  pinyin,
  showPinyin = false,
  borderColor = '#333333',
  guideColor = '#cccccc',
  referenceColor = '#999999',
  className = '',
}: TianZiGeProps) {
  const strokeWidth = 1;
  const pinyinHeight = showPinyin && pinyin ? 20 : 0;

  return (
    <div className={className} style={{ display: 'block', textAlign: 'center' }}>
      {/* 拼音标注 */}
      {showPinyin && pinyin && (
        <div
          className="text-center font-serif"
          style={{
            height: pinyinHeight,
            fontSize: size * 0.25,
            lineHeight: `${pinyinHeight}px`,
            color: '#333',
          }}
        >
          {pinyin}
        </div>
      )}

      {/* 田字格 SVG */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="print:border-black"
      >
        {/* 外框 */}
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={size - strokeWidth}
          height={size - strokeWidth}
          fill="none"
          stroke={borderColor}
          strokeWidth={strokeWidth}
        />

        {/* 横向辅助线（虚线） */}
        <line
          x1={0}
          y1={size / 2}
          x2={size}
          y2={size / 2}
          stroke={guideColor}
          strokeWidth={strokeWidth}
          strokeDasharray="4,4"
        />

        {/* 纵向辅助线（虚线） */}
        <line
          x1={size / 2}
          y1={0}
          x2={size / 2}
          y2={size}
          stroke={guideColor}
          strokeWidth={strokeWidth}
          strokeDasharray="4,4"
        />

        {/* 参考汉字 */}
        {showReference && character && (
          <text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size * 0.7}
            fill={referenceColor}
            opacity={referenceOpacity}
            fontFamily="KaiTi, STKaiti, SimKai, serif"
          >
            {character}
          </text>
        )}
      </svg>
    </div>
  );
}

/**
 * 田字格行组件
 * 用于一行多个田字格
 */
interface TianZiGeRowProps {
  /** 字符数组 */
  characters: Array<{
    char: string;
    pinyin?: string;
  }>;
  /** 格子大小 */
  size?: number;
  /** 是否显示参考字 */
  showReference?: boolean;
  /** 参考字透明度 */
  referenceOpacity?: number;
  /** 是否显示拼音 */
  showPinyin?: boolean;
  /** 格子间距 */
  gap?: number;
  /** 自定义类名 */
  className?: string;
}

export function TianZiGeRow({
  characters,
  size = 60,
  showReference = false,
  referenceOpacity = 0.2,
  showPinyin = false,
  gap = 4,
  className = '',
}: TianZiGeRowProps) {
  return (
    <div
      className={`flex flex-wrap items-end ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {characters.map((item, index) => (
        <TianZiGe
          key={index}
          size={size}
          character={item.char}
          pinyin={item.pinyin}
          showReference={showReference}
          referenceOpacity={referenceOpacity}
          showPinyin={showPinyin}
        />
      ))}
    </div>
  );
}

export default TianZiGe;
