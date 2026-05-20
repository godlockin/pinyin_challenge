/**
 * 格式选择器组件
 * 选择田字格/四线三格/横线/空白格式
 */

import { GridType, GridTypeInfo } from '../../types';

interface GridSelectorProps {
  /** 当前选中的格式 */
  value: GridType;
  /** 格式变化回调 */
  onChange: (gridType: GridType) => void;
}

/** 格式预览图标组件 */
function GridPreview({ type, isSelected }: { type: GridType; isSelected: boolean }) {
  const baseClass = `w-10 h-10 rounded border-2 ${isSelected ? 'border-blue-500' : 'border-gray-300'}`;

  switch (type) {
    case GridType.TianZiGe:
      // 田字格预览
      return (
        <div className={`${baseClass} relative bg-white`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-red-400 opacity-60" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-px h-full bg-red-400 opacity-60" />
          </div>
          <div className="absolute inset-0 border border-gray-800" />
        </div>
      );

    case GridType.SiXianSanGe:
      // 四线三格预览
      return (
        <div className={`${baseClass} flex flex-col justify-evenly bg-white p-1`}>
          <div className="w-full h-px bg-gray-400" />
          <div className="w-full h-px bg-red-400" />
          <div className="w-full h-px bg-gray-400" />
          <div className="w-full h-px bg-gray-400" />
        </div>
      );

    case GridType.HorizontalLine:
      // 横线预览
      return (
        <div className={`${baseClass} flex flex-col justify-evenly bg-white p-1`}>
          <div className="w-full h-px bg-gray-400" />
          <div className="w-full h-px bg-gray-400" />
          <div className="w-full h-px bg-gray-400" />
        </div>
      );

    case GridType.Blank:
      // 空白预览
      return (
        <div className={`${baseClass} bg-white flex items-center justify-center`}>
          <span className="text-xs text-gray-400">无</span>
        </div>
      );

    default:
      return null;
  }
}

export function GridSelector({ value, onChange }: GridSelectorProps) {
  const gridTypes = Object.values(GridType);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        格式样式
      </label>
      <div className="grid grid-cols-2 gap-2">
        {gridTypes.map((type) => {
          const info = GridTypeInfo[type];
          const isSelected = value === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
                         hover:bg-gray-50
                         ${isSelected
                           ? 'border-blue-500 bg-blue-50'
                           : 'border-gray-200 bg-white'
                         }`}
            >
              <GridPreview type={type} isSelected={isSelected} />
              <span className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                {info.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
