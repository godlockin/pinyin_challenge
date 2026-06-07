/**
 * 拼音挑战应用主组件
 */

import { useEffect, useState } from 'react';
import { Layout, ExportButtons, WorksheetPreview } from './components';
import { RightPanel } from './components/panels/RightPanel';
import { useSettings, usePrint } from './hooks';
import { initPinyinDictionaries, getDictStats } from './services/pinyinService';

function App() {
  const { settings, setSettings } = useSettings();
  const { printRef, handlePrint } = usePrint({
    documentTitle: '拼音练习题',
  });
  const [dictStats, setDictStats] = useState<{ polyphonic: number; poetryPhrases: number } | null>(null);

  useEffect(() => {
    initPinyinDictionaries()
      .then(() => {
        const stats = getDictStats();
        setDictStats(stats);
        console.info(
          `[pinyin] 就绪 - 多音字 ${stats.polyphonic}, 诗词短语 ${stats.poetryPhrases}`
        );
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[pinyin] 初始化失败，使用默认字频:', message);
      });
  }, []);

  return (
    <Layout
      leftContent={
        <div className="flex flex-col h-full">
          {/* 工具栏 */}
          <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between no-print">
            <h1 className="text-lg font-semibold text-gray-800">预览</h1>
            <div className="flex items-center gap-3">
              {dictStats && (
                <span
                  className="text-xs text-gray-400"
                  title="多音字补丁 + 诗词短语字典已加载"
                >
                  字典: {dictStats.polyphonic} 多音字
                </span>
              )}
              <ExportButtons
                targetRef={printRef}
                onPrint={handlePrint}
                filename="pinyin-worksheet"
                showImageExport={false}
              />
            </div>
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
