/**
 * 工作表预览组件
 * 整合所有渲染组件，响应设置变化实时预览，适配打印布局
 */

import { useRef, useMemo, useEffect, useState } from 'react';
import type { Settings } from '../../types';
import { ExerciseModeInfo } from '../../types';
import { ExerciseRenderer } from './ExerciseRenderer';
import { parseText } from '../../services/textParserService';

interface WorksheetPreviewProps {
  settings: Settings;
  showAnswer?: boolean;
  previewRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export function WorksheetPreview({
  settings,
  showAnswer = false,
  previewRef,
  className = '',
}: WorksheetPreviewProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = previewRef || internalRef;
  const [scale, setScale] = useState(1);

  // 统计汉字数量
  const charCount = useMemo(() => {
    const parsed = parseText(settings.inputText);
    return parsed.filter((c) => !c.isPunctuation && !c.isNewline && !c.isSpace && !c.isIndent).length;
  }, [settings.inputText]);

  const modeInfo = ExerciseModeInfo[settings.exerciseMode];

  useEffect(() => {
    const container = containerRef.current?.parentElement;
    if (!container) return;

    const updateScale = () => {
      const containerWidth = container.clientWidth - 48;
      const contentWidth = 595;
      setScale(containerWidth < contentWidth ? containerWidth / contentWidth : 1);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [containerRef]);

  return (
    <div className={`worksheet-preview-container ${className}`}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-4 print:hidden no-print">
        <div className="flex items-center gap-2">
          <span className="text-lg">{modeInfo.icon}</span>
          <span className="font-medium text-gray-700">{modeInfo.label}</span>
        </div>
        <div className="text-sm text-gray-500">共 {charCount} 个汉字</div>
      </div>

      {/* 预览区域 */}
      <div
        className="overflow-auto bg-gray-100 rounded-lg p-4 print:p-0 print:bg-white print:overflow-visible"
        style={{ minHeight: '400px' }}
      >
        <div
          ref={containerRef}
          className="worksheet-preview bg-white shadow-lg print:shadow-none mx-auto"
          style={{
            width: '595px',
            minHeight: '842px',
            padding: '40px',
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            boxSizing: 'border-box',
          }}
        >
          {/* 标题区域 */}
          <div className="text-center mb-8 print:mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">拼音练习</h1>
            <p className="text-sm text-gray-500">
              {modeInfo.label} - {modeInfo.description}
            </p>
          </div>

          {/* 姓名和日期行 */}
          <div className="flex justify-between mb-8 print:mb-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">姓名:</span>
              <span className="border-b border-gray-400 w-24 inline-block">&nbsp;</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">日期:</span>
              <span className="border-b border-gray-400 w-24 inline-block">&nbsp;</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">得分:</span>
              <span className="border-b border-gray-400 w-16 inline-block">&nbsp;</span>
            </div>
          </div>

          <hr className="border-gray-300 mb-6" />

          {/* 练习内容 */}
          <ExerciseRenderer
            mode={settings.exerciseMode}
            inputText={settings.inputText}
            style={settings.style}
            showAnswer={showAnswer}
            pinyinPairs={settings.pinyinPairs}
            gridType={settings.gridType}
          />
        </div>
      </div>
    </div>
  );
}

export default WorksheetPreview;
