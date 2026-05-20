/**
 * 横线组件
 * 简单的横线书写格，可配置行数
 */

interface HengXianProps {
  /** 总宽度（像素） */
  width?: number;
  /** 单行高度（像素） */
  lineHeight?: number;
  /** 行数 */
  rows?: number;
  /** 线条颜色 */
  lineColor?: string;
  /** 线条粗细 */
  strokeWidth?: number;
  /** 是否虚线 */
  dashed?: boolean;
  /** 自定义类名 */
  className?: string;
}

export function HengXian({
  width = 400,
  lineHeight = 40,
  rows = 1,
  lineColor = '#333333',
  strokeWidth = 1,
  dashed = false,
  className = '',
}: HengXianProps) {
  const totalHeight = lineHeight * rows;

  return (
    <div className={`inline-block ${className}`}>
      <svg
        width={width}
        height={totalHeight}
        viewBox={`0 0 ${width} ${totalHeight}`}
        className="print:border-black"
      >
        {Array.from({ length: rows }).map((_, index) => (
          <line
            key={index}
            x1={0}
            y1={(index + 1) * lineHeight - strokeWidth / 2}
            x2={width}
            y2={(index + 1) * lineHeight - strokeWidth / 2}
            stroke={lineColor}
            strokeWidth={strokeWidth}
            strokeDasharray={dashed ? '6,4' : undefined}
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * 带标签的横线组件
 * 左侧显示汉字或拼音，右侧横线书写
 */
interface HengXianWithLabelProps {
  /** 标签内容（汉字或拼音） */
  label: string;
  /** 标签宽度 */
  labelWidth?: number;
  /** 横线宽度 */
  lineWidth?: number;
  /** 行高 */
  lineHeight?: number;
  /** 标签字体大小 */
  labelFontSize?: number;
  /** 线条颜色 */
  lineColor?: string;
  /** 是否虚线 */
  dashed?: boolean;
  /** 自定义类名 */
  className?: string;
}

export function HengXianWithLabel({
  label,
  labelWidth = 60,
  lineWidth = 200,
  lineHeight = 40,
  labelFontSize = 20,
  lineColor = '#333333',
  dashed = false,
  className = '',
}: HengXianWithLabelProps) {
  return (
    <div
      className={`flex items-end ${className}`}
      style={{ height: lineHeight }}
    >
      {/* 标签区域 */}
      <div
        className="flex items-center justify-center font-serif"
        style={{
          width: labelWidth,
          height: lineHeight,
          fontSize: labelFontSize,
        }}
      >
        {label}
      </div>

      {/* 横线区域 */}
      <svg
        width={lineWidth}
        height={lineHeight}
        viewBox={`0 0 ${lineWidth} ${lineHeight}`}
      >
        <line
          x1={0}
          y1={lineHeight - 1}
          x2={lineWidth}
          y2={lineHeight - 1}
          stroke={lineColor}
          strokeWidth={1}
          strokeDasharray={dashed ? '6,4' : undefined}
        />
      </svg>
    </div>
  );
}

/**
 * 横线行组件
 * 一行多个带标签的横线
 */
interface HengXianRowProps {
  /** 标签数组 */
  labels: string[];
  /** 标签宽度 */
  labelWidth?: number;
  /** 每个横线宽度 */
  lineWidth?: number;
  /** 行高 */
  lineHeight?: number;
  /** 标签字体大小 */
  labelFontSize?: number;
  /** 间距 */
  gap?: number;
  /** 自定义类名 */
  className?: string;
}

export function HengXianRow({
  labels,
  labelWidth = 50,
  lineWidth = 100,
  lineHeight = 40,
  labelFontSize = 18,
  gap = 20,
  className = '',
}: HengXianRowProps) {
  return (
    <div
      className={`flex flex-wrap ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {labels.map((label, index) => (
        <HengXianWithLabel
          key={index}
          label={label}
          labelWidth={labelWidth}
          lineWidth={lineWidth}
          lineHeight={lineHeight}
          labelFontSize={labelFontSize}
        />
      ))}
    </div>
  );
}

export default HengXian;
