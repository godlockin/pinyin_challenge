# 拼音练习生成器 (Pinyin Challenge)

一个面向小学语文教学的拼音练习题生成工具，支持多种练习模式、格式化排版和打印导出。

## 功能特性

### 五种练习模式
- **看拼音写汉字** — 根据拼音在田字格中书写汉字
- **看汉字写拼音** — 为汉字标注正确拼音（四线三格）
- **多音字选择** — 选择多音字的正确读音
- **拼音纠错** — 找出并纠正错误拼音标注
- **复习模式** — 同时显示汉字和拼音对照

### 四种格子格式
- 田字格、四线三格、横线、空白

### 文本输入
- 手动输入/粘贴汉字
- 文件上传（.txt / .pdf / .docx）
- 古诗词库搜索（内置诗词数据库）
- 字词句库搜索

### 排版与导出
- A4 页面排版，固定网格分行
- 标点禁则处理
- PDF 导出（html2canvas 逐行截图 + jsPDF 分页）
- 打印支持（react-to-print）
- 图片导出（PNG）

### 拼音引擎
- 基于 [pinyin-pro](https://github.com/zh-lx/pinyin-pro) 核心
- 多音字补丁字典（修正字频误判）
- 诗词短语上下文字典（长匹配优先）
- 错误拼音生成（元音/辅音替换策略）

## 技术栈

- **框架**: React 19 + TypeScript
- **构建**: Vite
- **样式**: Tailwind CSS v4
- **测试**: Vitest + React Testing Library
- **依赖**: pinyin-pro, html2canvas, jsPDF, mammoth, pdfjs-dist, fuse.js

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 测试

```bash
npm test           # 运行测试
npm run test:watch # 监听模式
npm run test:coverage # 覆盖率
```
