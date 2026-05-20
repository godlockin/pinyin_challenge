/**
 * 拼音挑战应用主组件
 */

import { Layout, ExportButtons, WorksheetPreview } from './components';
import { RightPanel } from './components/panels/RightPanel';
import { useSettings, usePrint } from './hooks';

function App() {
  const { settings, setSettings } = useSettings();
  const { printRef, handlePrint } = usePrint({
    documentTitle: '拼音练习题',
  });

  return (
    <Layout
      leftContent={
        <div className="flex flex-col h-full">
          {/* 工具栏 */}
          <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between no-print">
            <h1 className="text-lg font-semibold text-gray-800">预览</h1>
            <ExportButtons
              targetRef={printRef}
              onPrint={handlePrint}
              filename="pinyin-worksheet"
              showImageExport={false}
            />
          </div>
          {/* 预览区域 */}
          <div className="flex-1 overflow-auto bg-gray-100 p-6">
            <div className="flex justify-center">
              <WorksheetPreview
                settings={settings}
                showAnswer={false}
                previewRef={printRef}
              />
            </div>
          </div>
        </div>
      }
      rightContent={
        <RightPanel
          settings={settings}
          onSettingsChange={setSettings}
        />
      }
    />
  );
}

export default App;
