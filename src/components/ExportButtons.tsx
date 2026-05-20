import { useState, useCallback } from 'react';
import type { ExportOptions } from '../services/exportService';
import { exportToPDF, exportToImage } from '../services/exportService';

interface ExportButtonsProps {
  targetRef: React.RefObject<HTMLElement | null>;
  onPrint?: () => void;
  filename?: string;
  showImageExport?: boolean;
  className?: string;
}

type ExportStatus = 'idle' | 'exporting-pdf' | 'exporting-image' | 'success' | 'error';

/**
 * 导出按钮组件
 */
export function ExportButtons({
  targetRef,
  onPrint,
  filename = 'pinyin-worksheet',
  showImageExport = false,
  className = '',
}: ExportButtonsProps) {
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 导出 PDF
  const handleExportPDF = useCallback(async () => {
    if (!targetRef.current) {
      setErrorMessage('找不到要导出的内容');
      setStatus('error');
      return;
    }

    setStatus('exporting-pdf');
    setErrorMessage('');

    try {
      const options: ExportOptions = {
        filename,
        scale: 2,
        orientation: 'portrait',
        quality: 0.95,
      };
      await exportToPDF(targetRef.current, options);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '导出失败');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [targetRef, filename]);

  // 导出图片
  const handleExportImage = useCallback(async () => {
    if (!targetRef.current) {
      setErrorMessage('找不到要导出的内容');
      setStatus('error');
      return;
    }

    setStatus('exporting-image');
    setErrorMessage('');

    try {
      await exportToImage(targetRef.current, filename);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '导出失败');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [targetRef, filename]);

  // 打印
  const handlePrint = useCallback(() => {
    if (onPrint) {
      onPrint();
    }
  }, [onPrint]);

  // 按钮样式
  const baseButtonStyle = `
    px-4 py-2 rounded-lg font-medium text-sm
    transition-all duration-200
    flex items-center gap-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const primaryButtonStyle = `
    ${baseButtonStyle}
    bg-blue-600 text-white
    hover:bg-blue-700 active:bg-blue-800
  `;

  const secondaryButtonStyle = `
    ${baseButtonStyle}
    bg-gray-100 text-gray-700 border border-gray-300
    hover:bg-gray-200 active:bg-gray-300
  `;

  const isExporting = status === 'exporting-pdf' || status === 'exporting-image';

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* 导出 PDF 按钮 */}
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        className={primaryButtonStyle}
        title="导出为 PDF 文件"
      >
        {status === 'exporting-pdf' ? (
          <>
            <LoadingSpinner />
            <span>正在导出...</span>
          </>
        ) : (
          <>
            <PDFIcon />
            <span>导出 PDF</span>
          </>
        )}
      </button>

      {/* 打印按钮 */}
      {onPrint && (
        <button
          onClick={handlePrint}
          disabled={isExporting}
          className={secondaryButtonStyle}
          title="打印练习题"
        >
          <PrintIcon />
          <span>打印</span>
        </button>
      )}

      {/* 导出图片按钮 (可选) */}
      {showImageExport && (
        <button
          onClick={handleExportImage}
          disabled={isExporting}
          className={secondaryButtonStyle}
          title="导出为图片"
        >
          {status === 'exporting-image' ? (
            <>
              <LoadingSpinner />
              <span>正在导出...</span>
            </>
          ) : (
            <>
              <ImageIcon />
              <span>导出图片</span>
            </>
          )}
        </button>
      )}

      {/* 状态提示 */}
      {status === 'success' && (
        <span className="text-green-600 text-sm flex items-center gap-1">
          <SuccessIcon />
          导出成功
        </span>
      )}
      {status === 'error' && (
        <span className="text-red-600 text-sm flex items-center gap-1">
          <ErrorIcon />
          {errorMessage}
        </span>
      )}
    </div>
  );
}

// 图标组件
function PDFIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 13h6m-6 4h4"
      />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export default ExportButtons;
