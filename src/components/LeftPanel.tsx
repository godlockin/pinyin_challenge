/**
 * 左侧面板 - 预览区
 * 用于显示生成的拼音挑战内容预览
 */

interface LeftPanelProps {
  children?: React.ReactNode;
}

export function LeftPanel({ children }: LeftPanelProps) {
  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-auto">
      <div className="h-full">
        {children || (
          <div className="flex items-center justify-center h-full text-gray-400">
            预览区域
          </div>
        )}
      </div>
    </div>
  );
}
