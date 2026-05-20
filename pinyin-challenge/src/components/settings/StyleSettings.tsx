/**
 * 样式设置组件
 * 包含字号、间距、每行字数等调整
 */

import type { StyleSettings } from '../../types';

interface StyleSettingsProps {
  /** 当前样式设置 */
  value: StyleSettings;
  /** 设置变化回调 */
  onChange: (settings: StyleSettings) => void;
}

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

function SliderInput({ label, value, min, max, step = 1, unit = '', onChange }: SliderInputProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-3.5
                   [&::-webkit-slider-thumb]:h-3.5
                   [&::-webkit-slider-thumb]:bg-blue-500
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:shadow-sm
                   [&::-webkit-slider-thumb]:hover:bg-blue-600
                   [&::-webkit-slider-thumb]:transition-colors"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export function StyleSettingsPanel({ value, onChange }: StyleSettingsProps) {
  const updateSetting = <K extends keyof StyleSettings>(key: K, newValue: StyleSettings[K]) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        样式调整
      </label>
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <SliderInput
          label="字号大小"
          value={value.fontSize}
          min={16}
          max={48}
          step={2}
          unit="px"
          onChange={(v) => updateSetting('fontSize', v)}
        />
        <SliderInput
          label="字间距"
          value={value.letterSpacing}
          min={0}
          max={16}
          step={1}
          unit="px"
          onChange={(v) => updateSetting('letterSpacing', v)}
        />
        <SliderInput
          label="行间距"
          value={value.lineHeight}
          min={32}
          max={80}
          step={4}
          unit="px"
          onChange={(v) => updateSetting('lineHeight', v)}
        />
        <SliderInput
          label="每行字数"
          value={value.charsPerLine}
          min={5}
          max={20}
          step={1}
          unit="字"
          onChange={(v) => updateSetting('charsPerLine', v)}
        />
      </div>
    </div>
  );
}
