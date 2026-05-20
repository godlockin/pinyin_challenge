/**
 * 左侧面板组件
 * 用于显示工作表预览
 */

import { useRef } from 'react';
import type { Settings } from '../../types';
import { WorksheetPreview } from '../preview';

interface LeftPanelProps {
  /** 当前设置 */
  settings: Settings;
  /** 是否显示答案 */
  showAnswer?: boolean;
}

export function LeftPanel({ settings, showAnswer = false }: LeftPanelProps) {
  const previewRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-auto" id="preview-container">
      <WorksheetPreview
        settings={settings}
        showAnswer={showAnswer}
        previewRef={previewRef}
      />
    </div>
  );
}

export default LeftPanel;
