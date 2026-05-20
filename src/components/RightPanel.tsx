/**
 * 右侧面板 - 输入区
 * 用于输入和配置拼音挑战参数
 */

interface RightPanelProps {
  children?: React.ReactNode;
}

export function RightPanel({ children }: RightPanelProps) {
  return (
    <div className="w-[400px] bg-white border-l border-gray-200 p-8 overflow-auto">
      <div className="h-full">
        {children || (
          <div className="flex items-center justify-center h-full text-gray-400">
            输入区域
          </div>
        )}
      </div>
    </div>
  );
}
