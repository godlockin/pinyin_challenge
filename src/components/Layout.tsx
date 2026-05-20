/**
 * 主布局组件
 * 左右分栏布局：左侧预览区 + 右侧输入区
 */

import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';

interface LayoutProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export function Layout({ leftContent, rightContent }: LayoutProps) {
  return (
    <div className="flex h-screen">
      <LeftPanel>{leftContent}</LeftPanel>
      <RightPanel>{rightContent}</RightPanel>
    </div>
  );
}
