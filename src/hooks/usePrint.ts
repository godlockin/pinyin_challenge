import { useCallback, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

export interface UsePrintOptions {
  documentTitle?: string;
  onBeforePrint?: () => Promise<void> | void;
  onAfterPrint?: () => void;
  onPrintError?: (error: Error) => void;
}

export interface UsePrintReturn {
  printRef: React.RefObject<HTMLDivElement | null>;
  handlePrint: () => void;
  isPrinting: boolean;
}

/**
 * 封装打印逻辑的自定义 Hook
 * @param options 打印配置
 */
export function usePrint(options: UsePrintOptions = {}): UsePrintReturn {
  const {
    documentTitle = `拼音练习_${new Date().toISOString().slice(0, 10)}`,
    onBeforePrint,
    onAfterPrint,
    onPrintError,
  } = options;

  const printRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // 打印前预处理
  const handleBeforePrint = useCallback(async () => {
    setIsPrinting(true);

    // 添加打印样式类
    document.body.classList.add('printing');

    // 调用自定义的打印前回调
    if (onBeforePrint) {
      await onBeforePrint();
    }
  }, [onBeforePrint]);

  // 打印后处理
  const handleAfterPrint = useCallback(() => {
    setIsPrinting(false);

    // 移除打印样式类
    document.body.classList.remove('printing');

    // 调用自定义的打印后回调
    if (onAfterPrint) {
      onAfterPrint();
    }
  }, [onAfterPrint]);

  // 打印错误处理
  const handlePrintError = useCallback(
    (errorLocation: 'onBeforePrint' | 'print', error: Error) => {
      setIsPrinting(false);
      document.body.classList.remove('printing');

      console.error(`打印错误 (${errorLocation}):`, error);
      if (onPrintError) {
        onPrintError(error);
      }
    },
    [onPrintError]
  );

  // 使用 react-to-print
  const reactToPrintFn = useReactToPrint({
    contentRef: printRef,
    documentTitle,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    onPrintError: handlePrintError,
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
        .print-only {
          display: block !important;
        }
      }
    `,
  });

  const handlePrint = useCallback(() => {
    if (printRef.current) {
      reactToPrintFn();
    }
  }, [reactToPrintFn]);

  return {
    printRef,
    handlePrint,
    isPrinting,
  };
}

export default usePrint;
