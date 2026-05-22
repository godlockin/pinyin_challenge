/**
 * 右侧面板组件
 * 整合所有设置组件，包含文字输入、模式选择、格式选择、样式设置
 */

import type { Settings, PinyinPair } from '../../types';
import { TextInput, ModeSelector, GridSelector, StyleSettingsPanel, PoetrySearch, VocabularySearch } from '../settings';

interface RightPanelProps {
  /** 当前设置 */
  settings: Settings;
  /** 设置变化回调 */
  onSettingsChange: (settings: Settings) => void;
  /** 生成按钮点击回调 */
  onGenerate?: () => void;
}

export function RightPanel({ settings, onSettingsChange, onGenerate }: RightPanelProps) {
  const updateSettings = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleTextChange = (value: string, pinyinPairs?: PinyinPair[]) => {
    onSettingsChange({
      ...settings,
      inputText: value,
      pinyinPairs: pinyinPairs,
    });
  };

  const hasContent = settings.inputText.trim().length > 0;

  return (
    <div className="bg-white border-l border-gray-200 flex flex-col h-full">
      {/* 头部 */}
      <div className="px-8 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">设置</h2>
        <p className="text-xs text-gray-500 mt-0.5">配置拼音练习参数</p>
      </div>

      {/* 滚动内容区 */}
      <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6">
        {/* 文字输入 */}
        <TextInput
          value={settings.inputText}
          onChange={handleTextChange}
        />

        {/* 古诗词库 */}
        <PoetrySearch
          onSelect={(content) => handleTextChange(content, undefined)}
        />

        {/* 字词句练习 */}
        <VocabularySearch
          onSelect={(content) => handleTextChange(content, undefined)}
        />

        {/* 分隔线 */}
        <div className="border-t border-gray-100" />

        {/* 练习模式选择 */}
        <ModeSelector
          value={settings.exerciseMode}
          onChange={(mode) => updateSettings('exerciseMode', mode)}
        />

        {/* 分隔线 */}
        <div className="border-t border-gray-100" />

        {/* 格式选择 */}
        <GridSelector
          value={settings.gridType}
          onChange={(gridType) => updateSettings('gridType', gridType)}
        />

        {/* 分隔线 */}
        <div className="border-t border-gray-100" />

        {/* 样式设置 */}
        <StyleSettingsPanel
          value={settings.style}
          onChange={(style) => updateSettings('style', style)}
        />
      </div>

      {/* 底部操作区 */}
      <div className="px-8 py-4 border-t border-gray-100 bg-gray-50">
        <button
          type="button"
          onClick={onGenerate}
          disabled={!hasContent}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all
                     flex items-center justify-center gap-2
                     ${hasContent
                       ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-sm'
                       : 'bg-gray-300 cursor-not-allowed'
                     }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          生成练习
        </button>
      </div>
    </div>
  );
}
