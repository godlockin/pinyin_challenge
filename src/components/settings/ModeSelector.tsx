/**
 * 练习模式选择器组件
 * 单选方式选择练习模式
 */

import { ExerciseMode, ExerciseModeInfo } from '../../types';

interface ModeSelectorProps {
  /** 当前选中的模式 */
  value: ExerciseMode;
  /** 模式变化回调 */
  onChange: (mode: ExerciseMode) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  const modes = Object.values(ExerciseMode);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        练习模式
      </label>
      <div className="space-y-2">
        {modes.map((mode) => {
          const info = ExerciseModeInfo[mode];
          const isSelected = value === mode;

          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChange(mode)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                         text-left hover:bg-gray-50
                         ${isSelected
                           ? 'border-blue-500 bg-blue-50'
                           : 'border-gray-200 bg-white'
                         }`}
            >
              <span className="text-xl flex-shrink-0" role="img" aria-label={info.label}>
                {info.icon}
              </span>
              <div className="min-w-0">
                <div className={`font-medium text-sm ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                  {info.label}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {info.description}
                </div>
              </div>
              {isSelected && (
                <div className="ml-auto flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
