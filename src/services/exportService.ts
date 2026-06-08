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
 * 实现策略:
 *   1. 清除 worksheet-preview 的 transform: scale(),避免 html2canvas SVG 坐标错位
 *   2. 截取 header (清空 exercise-renderer)
 *   3. 逐行克隆截图(避免 transform 污染)
 *   4. 按行累积高度分页
 */
export async function exportToPDF(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const config = { ...defaultOptions, ...options };

  let worksheetEl: HTMLElement | null = null;
  let originalTransform = '';
  let originalTransformOrigin = '';

  try {
    const rows = element.querySelectorAll('.exercise-row');

    if (rows.length === 0) {
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
    const availableHeight = pageHeight - MARGIN_TOP - MARGIN_BOTTOM;

    // 清除 worksheet-preview 的 transform: scale()
    worksheetEl = (element.classList.contains('worksheet-preview')
      ? element
      : element.querySelector('.worksheet-preview')) as HTMLElement | null;
    originalTransform = worksheetEl?.style.transform || '';
    originalTransformOrigin = worksheetEl?.style.transformOrigin || '';
    if (worksheetEl) {
      worksheetEl.style.transform = 'none';
      worksheetEl.style.transformOrigin = 'top left';
    }

    // 截取 header（克隆 + 清空 exercise-renderer + 移除 min-height）
    let headerCanvas: HTMLCanvasElement | null = null;
    if (worksheetEl) {
      const headerClone = worksheetEl.cloneNode(true) as HTMLElement;
      const ex = headerClone.querySelector('.exercise-renderer');
      if (ex) ex.innerHTML = '';
      headerClone.style.minHeight = '0';
      headerClone.style.height = 'auto';
      document.body.appendChild(headerClone);
      headerClone.style.position = 'absolute';
      headerClone.style.left = '-9999px';
      headerClone.style.width = `${worksheetEl.offsetWidth}px`;
      headerClone.style.transform = 'none';
      headerCanvas = await html2canvas(headerClone, {
        scale: config.scale,
        backgroundColor: '#ffffff',
        logging: false,
      });
      document.body.removeChild(headerClone);
    }
    const headerHeight = headerCanvas ? headerCanvas.height * (contentWidth / headerCanvas.width) : 0;

    // 逐行克隆截图
    const rowImages: Array<{ canvas: HTMLCanvasElement; heightMm: number }> = [];
    for (const row of Array.from(rows)) {
      const rowClone = row.cloneNode(true) as HTMLElement;
      document.body.appendChild(rowClone);
      rowClone.style.position = 'absolute';
      rowClone.style.left = '-9999px';
      rowClone.style.transform = 'none';
      const rowWidth = row.getBoundingClientRect().width || 515;
      rowClone.style.width = `${rowWidth}px`;

      const rowCanvas = await html2canvas(rowClone, {
        scale: config.scale,
        backgroundColor: '#ffffff',
        logging: false,
        width: rowWidth,
        windowWidth: rowWidth,
      });
      document.body.removeChild(rowClone);

      rowImages.push({
        canvas: rowCanvas,
        heightMm: rowCanvas.height * (contentWidth / rowCanvas.width),
      });
    }

    // 分页:每页累积 header + 行,超过 availableHeight 则换页
    type Page = { rowIndices: number[]; };
    const pages: Page[] = [];
    let currentPage: Page = { rowIndices: [] };
    let currentHeight = headerHeight;
    for (let i = 0; i < rowImages.length; i++) {
      const h = rowImages[i].heightMm;
      if (currentHeight + h > availableHeight && currentPage.rowIndices.length > 0) {
        pages.push(currentPage);
        currentPage = { rowIndices: [i] };
        currentHeight = h;
      } else {
        currentPage.rowIndices.push(i);
        currentHeight += h;
      }
    }
    if (currentPage.rowIndices.length > 0) pages.push(currentPage);

    // 渲染每页
    for (let p = 0; p < pages.length; p++) {
      if (p > 0) pdf.addPage();
      let y = contentStartY;

      // 第一页加 header
      if (p === 0 && headerCanvas) {
        const ratio = contentWidth / headerCanvas.width;
        const h = headerCanvas.height * ratio;
        pdf.addImage(
          headerCanvas.toDataURL('image/png'),
          'PNG',
          MARGIN_LEFT,
          y,
          contentWidth,
          h,
          undefined,
          'FAST'
        );
        y += h;
      }

      // 渲染当前页的所有行
      for (const idx of pages[p].rowIndices) {
        const img = rowImages[idx];
        pdf.addImage(
          img.canvas.toDataURL('image/png'),
          'PNG',
          MARGIN_LEFT,
          y,
          contentWidth,
          img.heightMm,
          undefined,
          'FAST'
        );
        y += img.heightMm;
      }

      // 页脚
      const footerCanvas = createTextCanvas(
        `${p + 1} / ${pages.length}`,
        12,
        '#999999'
      );
      pdf.addImage(
        footerCanvas.toDataURL('image/png'),
        'PNG',
        pageWidth / 2 - 15,
        pageHeight - MARGIN_BOTTOM + 2,
        30,
        footerCanvas.height * (30 / footerCanvas.width)
      );
    }

    // 恢复 transform
    if (worksheetEl) {
      worksheetEl.style.transform = originalTransform || '';
      worksheetEl.style.transformOrigin = originalTransformOrigin || '';
    }

    // 保存
    const dateStr = new Date().toISOString().slice(0, 10);
    pdf.save(`${config.filename}_${dateStr}.pdf`);
  } catch (error) {
    console.error('PDF 导出失败:', error);
    if (worksheetEl) {
      worksheetEl.style.transform = originalTransform || '';
      worksheetEl.style.transformOrigin = originalTransformOrigin || '';
    }
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
