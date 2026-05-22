/**
 * 四线三格组件
 * 用于拼音书写练习，使用 SVG 绘制
 *
 * 结构说明:
 * - 上格: 用于书写 b, d, f, h, k, l, t 等上伸字母的上半部分
 * - 中格: 主要书写区域，所有字母的基础部分
 * - 下格: 用于书写 g, p, q, y 等下伸字母的下半部分
 */

interface SiXianSanGeProps {
  /** 格子宽度（像素） */
  width?: number;
  /** 格子高度（像素） */
  height?: number;
  /** 要显示的拼音（作为参考） */
  pinyin?: string;
  /** 是否显示参考拼音 */
  showReference?: boolean;
  /** 参考拼音透明度 (0-1) */
  referenceOpacity?: number;
  /** 线条颜色 */
  lineColor?: string;
  /** 边框颜色(用于空格等特殊渲染) */
  borderColor?: string;
  /** 中间线颜色（用于区分主要书写区） */
  middleLineColor?: string;
  /** 参考文字颜色 */
  referenceColor?: string;
  /** 自定义类名 */
  className?: string;
}

export function SiXianSanGe({
  width = 80,
  height = 48,
  pinyin,
  showReference = false,
  referenceOpacity = 0.3,
  lineColor = '#333333',
  borderColor,
  middleLineColor = '#999999',
  referenceColor = '#666666',
  className = '',
}: SiXianSanGeProps) {
  const strokeWidth = 1;
  const actualLineColor = borderColor || lineColor;

  // 计算各层高度（上:中:下 = 1:2:1）
  const unitHeight = height / 4;
  const topZone = unitHeight;          // 上格高度
  const middleZone = unitHeight * 2;   // 中格高度

  // 四条线的 Y 坐标
  const line1Y = 0;                           // 顶线
  const line2Y = topZone;                     // 上中分界线
  const line3Y = topZone + middleZone;        // 中下分界线
  const line4Y = height;                      // 底线

  return (
    <div className={`inline-block ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="print:border-black"
      >
        {/* 第一条线（顶线）- 实线 */}
        <line
          x1={0}
          y1={line1Y + strokeWidth / 2}
          x2={width}
          y2={line1Y + strokeWidth / 2}
          stroke={actualLineColor}
          strokeWidth={strokeWidth}
        />

        {/* 第二条线（上中分界）- 虚线 */}
        <line
          x1={0}
          y1={line2Y}
          x2={width}
          y2={line2Y}
          stroke={middleLineColor}
          strokeWidth={strokeWidth}
          strokeDasharray="4,4"
        />

        {/* 第三条线（中下分界）- 虚线 */}
        <line
          x1={0}
          y1={line3Y}
          x2={width}
          y2={line3Y}
          stroke={middleLineColor}
          strokeWidth={strokeWidth}
          strokeDasharray="4,4"
        />

        {/* 第四条线（底线）- 实线 */}
        <line
          x1={0}
          y1={line4Y - strokeWidth / 2}
          x2={width}
          y2={line4Y - strokeWidth / 2}
          stroke={actualLineColor}
          strokeWidth={strokeWidth}
        />

        {/* 参考拼音 */}
        {showReference && pinyin && (
          <text
            x={width / 2}
            y={line2Y + middleZone / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={middleZone * 0.9}
            fill={referenceColor}
            opacity={referenceOpacity}
            fontFamily="Times New Roman, serif"
          >
            {pinyin}
          </text>
        )}
      </svg>
    </div>
  );
}

/**
 * 四线三格行组件
 * 用于一行多个拼音格
 */
interface SiXianSanGeRowProps {
  /** 拼音数组 */
  pinyinList: string[];
  /** 单个格子宽度 */
  width?: number;
  /** 格子高度 */
  height?: number;
  /** 是否显示参考拼音 */
  showReference?: boolean;
  /** 参考拼音透明度 */
  referenceOpacity?: number;
  /** 格子间距 */
  gap?: number;
  /** 自定义类名 */
  className?: string;
}

export function SiXianSanGeRow({
  pinyinList,
  width = 80,
  height = 48,
  showReference = false,
  referenceOpacity = 0.3,
  gap = 4,
  className = '',
}: SiXianSanGeRowProps) {
  return (
    <div
      className={`flex flex-wrap items-center ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {pinyinList.map((pinyin, index) => (
        <SiXianSanGe
          key={index}
          width={width}
          height={height}
          pinyin={pinyin}
          showReference={showReference}
          referenceOpacity={referenceOpacity}
        />
      ))}
    </div>
  );
}

/**
 * 连续四线三格（用于整行书写）
 */
interface SiXianSanGeContinuousProps {
  /** 总宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 参考文本 */
  text?: string;
  /** 是否显示参考文本 */
  showReference?: boolean;
  /** 线条颜色 */
  lineColor?: string;
  /** 中间线颜色 */
  middleLineColor?: string;
  /** 自定义类名 */
  className?: string;
}

export function SiXianSanGeContinuous({
  width = 400,
  height = 48,
  text,
  showReference = false,
  lineColor = '#333333',
  middleLineColor = '#999999',
  className = '',
}: SiXianSanGeContinuousProps) {
  const strokeWidth = 1;
  const unitHeight = height / 4;
  const topZone = unitHeight;
  const middleZone = unitHeight * 2;

  const line1Y = 0;
  const line2Y = topZone;
  const line3Y = topZone + middleZone;
  const line4Y = height;

  return (
    <div className={`inline-block ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="print:border-black"
      >
        {/* 四条横线 */}
        <line
          x1={0}
          y1={line1Y + strokeWidth / 2}
          x2={width}
          y2={line1Y + strokeWidth / 2}
          stroke={lineColor}
          strokeWidth={strokeWidth}
        />
        <line
          x1={0}
          y1={line2Y}
          x2={width}
          y2={line2Y}
          stroke={middleLineColor}
          strokeWidth={strokeWidth}
          strokeDasharray="4,4"
        />
        <line
          x1={0}
          y1={line3Y}
          x2={width}
          y2={line3Y}
          stroke={middleLineColor}
          strokeWidth={strokeWidth}
          strokeDasharray="4,4"
        />
        <line
          x1={0}
          y1={line4Y - strokeWidth / 2}
          x2={width}
          y2={line4Y - strokeWidth / 2}
          stroke={lineColor}
          strokeWidth={strokeWidth}
        />

        {/* 参考文本 */}
        {showReference && text && (
          <text
            x={10}
            y={line2Y + middleZone / 2}
            dominantBaseline="central"
            fontSize={middleZone * 0.8}
            fill="#999"
            opacity={0.3}
            fontFamily="Times New Roman, serif"
            letterSpacing="0.5em"
          >
            {text}
          </text>
        )}
      </svg>
    </div>
  );
}

export default SiXianSanGe;
