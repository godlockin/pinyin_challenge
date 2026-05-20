import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// A4 尺寸常量 (mm)
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// A4 尺寸 (pt, 72dpi)
const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;

// 页边距 (mm)
const MARGIN_TOP = 15;
const MARGIN_BOTTOM = 15;
const MARGIN_LEFT = 10;
const MARGIN_RIGHT = 10;

// 导出配置接口
export interface ExportOptions {
  filename?: string;
  scale?: number;
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  title?: string;
}

// 默认配置
const defaultOptions: Required<ExportOptions> = {
  filename: 'pinyin-worksheet',
  scale: 2,
  orientation: 'portrait',
  quality: 0.92,
  title: '拼音练习',
};

/**
 * 将 HTML 元素导出为 PDF（按行分页，避免截断）
 */
export async function exportToPDF(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const config = { ...defaultOptions, ...options };

  try {
    // 找到所有练习行
    const rows = element.querySelectorAll('.exercise-row');

    if (rows.length === 0) {
      // 没有练习行，直接导出整个元素
      await exportSinglePage(element, config);
      return;
    }

    // 创建 PDF
    const pdf = new jsPDF({
      orientation: config.orientation,
      unit: 'mm',
      format: 'a4',
    });

    const isLandscape = config.orientation === 'landscape';
    const pageWidth = isLandscape ? A4_HEIGHT_MM : A4_WIDTH_MM;
    const pageHeight = isLandscape ? A4_WIDTH_MM : A4_HEIGHT_MM;
    const contentWidth = pageWidth - MARGIN_LEFT - MARGIN_RIGHT;
    const contentStartY = MARGIN_TOP;
    const contentEndY = pageHeight - MARGIN_BOTTOM;
    const availableHeight = contentEndY - contentStartY;

    // 获取标题区域（练习内容之前的部分）
    const headerElement = element.querySelector('.worksheet-preview');
    let headerCanvas: HTMLCanvasElement | null = null;
    let headerHeight = 0;

    if (headerElement) {
      // 克隆并只保留标题部分
      const headerClone = headerElement.cloneNode(true) as HTMLElement;
      const exerciseRenderer = headerClone.querySelector('.exercise-renderer');
      if (exerciseRenderer) {
        exerciseRenderer.innerHTML = '';
      }

      document.body.appendChild(headerClone);
      headerClone.style.position = 'absolute';
      headerClone.style.left = '-9999px';
      headerClone.style.width = '595px';

      headerCanvas = await html2canvas(headerClone, {
        scale: config.scale,
        backgroundColor: '#ffffff',
        logging: false,
      });

      document.body.removeChild(headerClone);

      // 计算标题区域在 PDF 中的高度
      const ratio = contentWidth / headerCanvas.width;
      headerHeight = headerCanvas.height * ratio;
    }

    // 计算每行的高度并分页
    const rowHeights: number[] = [];
    for (const row of rows) {
      const rect = row.getBoundingClientRect();
      const ratio = contentWidth / 515; // 515 是内容区域宽度
      rowHeights.push(rect.height * ratio);
    }

    // 分页：确保每行完整显示
    const pages: number[][] = [];
    let currentPage: number[] = [];
    let currentHeight = headerHeight;

    for (let i = 0; i < rowHeights.length; i++) {
      const rowHeight = rowHeights[i];

      if (currentHeight + rowHeight > availableHeight && currentPage.length > 0) {
        // 当前页满了，开始新页
        pages.push(currentPage);
        currentPage = [i];
        currentHeight = rowHeight;
      } else {
        currentPage.push(i);
        currentHeight += rowHeight;
      }
    }

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    // 渲染每一页
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      const pageRows = pages[pageIndex];
      let currentY = contentStartY;

      // 第一页添加标题
      if (pageIndex === 0 && headerCanvas) {
        const ratio = contentWidth / headerCanvas.width;
        const imgHeight = headerCanvas.height * ratio;

        pdf.addImage(
          headerCanvas.toDataURL('image/jpeg', config.quality),
          'JPEG',
          MARGIN_LEFT,
          currentY,
          contentWidth,
          imgHeight
        );
        currentY += imgHeight;
      }

      // 渲染当前页的行
      for (const rowIndex of pageRows) {
        const row = rows[rowIndex] as HTMLElement;

        const rowCanvas = await html2canvas(row, {
          scale: config.scale,
          backgroundColor: '#ffffff',
          logging: false,
        });

        const ratio = contentWidth / rowCanvas.width;
        const imgHeight = rowCanvas.height * ratio;

        pdf.addImage(
          rowCanvas.toDataURL('image/jpeg', config.quality),
          'JPEG',
          MARGIN_LEFT,
          currentY,
          contentWidth,
          imgHeight
        );

        currentY += imgHeight;
      }

      // 添加页脚（页码）- 使用图片方式避免字体问题
      const footerCanvas = createTextCanvas(
        `${pageIndex + 1} / ${pages.length}`,
        12,
        '#999999'
      );
      const footerRatio = 30 / footerCanvas.width;
      pdf.addImage(
        footerCanvas.toDataURL('image/png'),
        'PNG',
        pageWidth / 2 - 15,
        pageHeight - MARGIN_BOTTOM + 2,
        30,
        footerCanvas.height * footerRatio
      );
    }

    // 保存文件
    const dateStr = new Date().toISOString().slice(0, 10);
    pdf.save(`${config.filename}_${dateStr}.pdf`);
  } catch (error) {
    console.error('PDF 导出失败:', error);
    throw new Error(`PDF 导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 创建文本 Canvas（用于页码等，避免字体问题）
 */
function createTextCanvas(text: string, fontSize: number, color: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  ctx.font = `${fontSize}px Arial, sans-serif`;
  const metrics = ctx.measureText(text);

  canvas.width = Math.ceil(metrics.width) + 4;
  canvas.height = fontSize + 4;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas;
}

/**
 * 单页导出（无练习行时的回退方案）
 */
async function exportSinglePage(
  element: HTMLElement,
  config: Required<ExportOptions>
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: config.scale,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const pdf = new jsPDF({
    orientation: config.orientation,
    unit: 'mm',
    format: 'a4',
  });

  const isLandscape = config.orientation === 'landscape';
  const pageWidth = isLandscape ? A4_HEIGHT_MM : A4_WIDTH_MM;
  const contentWidth = pageWidth - MARGIN_LEFT - MARGIN_RIGHT;

  const ratio = contentWidth / canvas.width;
  const imgHeight = canvas.height * ratio;

  pdf.addImage(
    canvas.toDataURL('image/jpeg', config.quality),
    'JPEG',
    MARGIN_LEFT,
    MARGIN_TOP,
    contentWidth,
    imgHeight
  );

  const dateStr = new Date().toISOString().slice(0, 10);
  pdf.save(`${config.filename}_${dateStr}.pdf`);
}

/**
 * 将 HTML 元素导出为图片
 * @param element 要导出的 HTML 元素
 * @param filename 文件名
 */
export async function exportToImage(
  element: HTMLElement,
  filename: string = 'pinyin-worksheet'
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    // 创建下载链接
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `${filename}_${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('图片导出失败:', error);
    throw new Error('图片导出失败，请重试');
  }
}

export { A4_WIDTH_MM, A4_HEIGHT_MM, A4_WIDTH_PT, A4_HEIGHT_PT };
