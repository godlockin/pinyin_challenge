/**
 * 拼音挑战 (pinyin_challenge) 完整测试用例设计
 * 
 * 覆盖范围：
 *   1. UI/UX 交互测试
 *   2. 文本生成与渲染测试
 *   3. 边缘情况测试
 * 
 * 测试框架：Vitest + React Testing Library + jsdom
 * 目标覆盖率：≥95%
 */

// ============================================================================
// 类型定义：测试用例结构
// ============================================================================

interface TestCase {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  priority: 'P0' | 'P1' | 'P2'; // P0=冒烟 P1=核心 P2=边缘
  preconditions: string;
  steps: string[];
  expectedResult: string[];
  actualResult: string; // 待填写
  status: 'pending' | 'passed' | 'failed' | 'blocked';
}

// ============================================================================
// 一、UI/UX 交互测试
// ============================================================================

const uiUxTestCases: TestCase[] = [
  // ------------------------------------------------------------------
  // 1.1 文字输入组件 (TextInput)
  // ------------------------------------------------------------------
  {
    id: 'UI-TI-001',
    category: 'UI/UX交互',
    subcategory: '文字输入',
    title: '文本框正常输入汉字',
    priority: 'P0',
    preconditions: '应用已启动，右侧面板可见',
    steps: [
      '点击文字输入文本框',
      '输入"春眠不觉晓"',
    ],
    expectedResult: [
      '文本框显示"春眠不觉晓"',
      '字数统计显示正确汉字数(5)',
      '左侧预览区域实时更新',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'UI-TI-002',
    category: 'UI/UX交互',
    subcategory: '文字输入',
    title: '文本框粘贴长文本',
    priority: 'P1',
    preconditions: '剪贴板中有超过10000字的文本',
    steps: [
      '在文本框中粘贴超过10000字的文本',
    ],
    expectedResult: [
      '文本被截断至10000字',
      '字数统计显示10000/10000',
      '无异常错误或崩溃',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-TI-003',
    category: 'UI/UX交互',
    subcategory: '文字输入',
    title: '文本框输入空字符串',
    priority: 'P1',
    preconditions: '文本框已有内容',
    steps: [
      '清空文本框所有内容',
    ],
    expectedResult: [
      '字数统计显示0',
      '预览区域显示空提示信息',
      '无JS错误',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-TI-004',
    category: 'UI/UX交互',
    subcategory: '文字输入',
    title: '文本框输入含换行符的多行文本',
    priority: 'P1',
    preconditions: '文本框为空',
    steps: [
      '输入"春眠不觉晓"后按Enter',
      '输入"处处闻啼鸟"',
    ],
    expectedResult: [
      '文本框显示两行文本',
      '预览区域正确分行渲染',
      '换行符被保留并在预览中体现',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-TI-005',
    category: 'UI/UX交互',
    subcategory: '文字输入',
    title: '上传.txt文件',
    priority: 'P1',
    preconditions: '存在有效的.txt文件(内容为古诗文本)',
    steps: [
      '点击文件上传按钮',
      '选择.txt文件',
    ],
    expectedResult: [
      '文件内容正确填入文本框',
      '字数统计更新',
      '预览区域实时更新',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-TI-006',
    category: 'UI/UX交互',
    subcategory: '文字输入',
    title: '上传.pdf文件',
    priority: 'P1',
    preconditions: '存在有效的.pdf文件(含汉字内容)',
    steps: [
      '点击文件上传按钮',
      '选择.pdf文件',
    ],
    expectedResult: [
      'PDF文本被正确提取并填入文本框',
      '字数统计更新',
      '若PDF含拼音标注，pinyinPairs被正确填充',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-TI-007',
    category: 'UI/UX交互',
    subcategory: '文字输入',
    title: '上传.docx文件',
    priority: 'P1',
    preconditions: '存在有效的.docx文件',
    steps: [
      '点击文件上传按钮',
      '选择.docx文件',
    ],
    expectedResult: [
      'Word文档文本被正确提取并填入文本框',
      '字数统计更新',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-TI-008',
    category: 'UI/UX交互',
    subcategory: '文字输入',
    title: '上传超过10MB的文件',
    priority: 'P2',
    preconditions: '存在大于10MB的文件',
    steps: [
      '点击文件上传按钮',
      '选择超过10MB的文件',
    ],
    expectedResult: [
      '显示文件大小超出限制的错误提示',
      '文件不被上传或解析',
      '文本框内容不变',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-TI-009',
    category: 'UI/UX交互',
    subcategory: '文字输入',
    title: '上传不支持的文件格式(.doc/.xlsx等)',
    priority: 'P2',
    preconditions: '存在.doc格式文件',
    steps: [
      '点击文件上传按钮',
      '选择.doc文件',
    ],
    expectedResult: [
      '显示不支持的文件格式错误提示',
      '文件不被解析',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-TI-010',
    category: 'UI/UX交互',
    subcategory: '文字输入',
    title: '字数统计准确性',
    priority: 'P1',
    preconditions: '文本框为空',
    steps: [
      '输入"Hello 你好！123"',
    ],
    expectedResult: [
      '字数统计正确计算(包含汉字、字母、数字、标点)',
      '汉字数单独统计准确',
    ],
    actualResult: '',
    status: 'pending',
  },

  // ------------------------------------------------------------------
  // 1.2 练习模式选择器 (ModeSelector)
  // ------------------------------------------------------------------
  {
    id: 'UI-MS-001',
    category: 'UI/UX交互',
    subcategory: '模式选择',
    title: '切换5种练习模式',
    priority: 'P0',
    preconditions: '文本框已输入"春眠不觉晓"',
    steps: [
      '选择"看拼音写汉字"模式',
      '观察预览区域',
      '切换为"看汉字写拼音"模式',
      '观察预览区域',
      '切换为"多音字选择"模式',
      '观察预览区域',
      '切换为"拼音纠错"模式',
      '观察预览区域',
      '切换为"复习模式"',
      '观察预览区域',
    ],
    expectedResult: [
      '每种模式切换后预览区域立即更新',
      '各模式渲染格式正确匹配其定义',
      '模式选择高亮状态正确',
      '切换无闪烁或延迟',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'UI-MS-002',
    category: 'UI/UX交互',
    subcategory: '模式选择',
    title: '同一模式重复点击',
    priority: 'P2',
    preconditions: '已选中"看拼音写汉字"模式',
    steps: [
      '再次点击"看拼音写汉字"模式',
    ],
    expectedResult: [
      '模式保持不变',
      '预览内容不变',
      '无异常错误',
    ],
    actualResult: '',
    status: 'pending',
  },

  // ------------------------------------------------------------------
  // 1.3 格式选择器 (GridSelector)
  // ------------------------------------------------------------------
  {
    id: 'UI-GS-001',
    category: 'UI/UX交互',
    subcategory: '格式选择',
    title: '切换4种格式类型',
    priority: 'P0',
    preconditions: '文本框已输入内容，模式为"看拼音写汉字"',
    steps: [
      '选择"田字格"格式',
      '观察预览区域渲染',
      '切换为"四线三格"格式',
      '观察预览区域渲染',
      '切换为"横线"格式',
      '观察预览区域渲染',
      '切换为"空白"格式',
      '观察预览区域渲染',
    ],
    expectedResult: [
      '每种格式切换后预览区域立即更新',
      '田字格显示十字虚线和外框',
      '四线三格显示四条横线',
      '横线格式显示单条横线',
      '空白格式无边框和线条',
      'SVG预览图标与选择项匹配',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-GS-002',
    category: 'UI/UX交互',
    subcategory: '格式选择',
    title: '格式与模式组合切换',
    priority: 'P1',
    preconditions: '文本框已输入"大小多少"',
    steps: [
      '设置模式为"看拼音写汉字"，格式为"田字格"',
      '切换模式为"看汉字写拼音"，格式自动/手动调整为"四线三格"',
      '切换模式为"复习模式"，格式为"空白"',
    ],
    expectedResult: [
      '每种组合渲染正确',
      '模式与格式组合在语义上合理',
      '无渲染异常或重叠',
    ],
    actualResult: '',
    status: 'pending',
  },

  // ------------------------------------------------------------------
  // 1.4 样式设置 (StyleSettings)
  // ------------------------------------------------------------------
  {
    id: 'UI-SS-001',
    category: 'UI/UX交互',
    subcategory: '样式设置',
    title: '调整字号滑块(16-48)',
    priority: 'P0',
    preconditions: '文本框已输入内容',
    steps: [
      '拖动字号滑块到最小值16',
      '观察预览区域字体大小变化',
      '拖动字号滑块到最大值48',
      '观察预览区域字体大小变化',
      '拖动字号滑块到中间值32',
      '观察预览区域字体大小变化',
    ],
    expectedResult: [
      '字号16时预览文字最小',
      '字号48时预览文字最大',
      '滑块数值实时显示',
      '预览区域字号平滑变化',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'UI-SS-002',
    category: 'UI/UX交互',
    subcategory: '样式设置',
    title: '调整字间距滑块(0-16)',
    priority: 'P1',
    preconditions: '文本框已输入内容',
    steps: [
      '拖动字间距滑块从0到16',
      '观察预览区域字符间距变化',
    ],
    expectedResult: [
      '字间距0时字符紧邻',
      '字间距16时字符间距明显',
      '预览实时响应变化',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-SS-003',
    category: 'UI/UX交互',
    subcategory: '样式设置',
    title: '调整行间距滑块(32-80)',
    priority: 'P1',
    preconditions: '文本框已输入多行内容',
    steps: [
      '拖动行间距滑块从32到80',
      '观察预览区域行间距变化',
    ],
    expectedResult: [
      '行间距32时行距最小',
      '行间距80时行距最大',
      '预览实时响应变化',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-SS-004',
    category: 'UI/UX交互',
    subcategory: '样式设置',
    title: '调整每行字数滑块(5-20)',
    priority: 'P0',
    preconditions: '文本框已输入"春眠不觉晓处处闻啼鸟夜来风雨声花落知多少"',
    steps: [
      '设置每行字数为5',
      '观察预览分行效果',
      '设置每行字数为10',
      '观察预览分行效果',
      '设置每行字数为20',
      '观察预览分行效果',
    ],
    expectedResult: [
      '每行5字时，文本被分为多行，每行最多5个字符位',
      '每行10字时，行数减半',
      '每行20字时，所有内容可能在一行内',
      '隐形占位符正确填充行尾空位',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-SS-005',
    category: 'UI/UX交互',
    subcategory: '样式设置',
    title: '样式设置持久化',
    priority: 'P1',
    preconditions: '应用已启动',
    steps: [
      '调整字号为36、字间距为8、行间距为60、每行字数为12',
      '刷新页面(F5)',
    ],
    expectedResult: [
      '页面刷新后所有设置恢复为之前的值',
      'localStorage中存储了正确的设置',
      '预览区域按保存的设置渲染',
    ],
    actualResult: '',
    status: 'pending',
  },

  // ------------------------------------------------------------------
  // 1.5 古诗词搜索 (PoetrySearch)
  // ------------------------------------------------------------------
  {
    id: 'UI-PS-001',
    category: 'UI/UX交互',
    subcategory: '古诗词搜索',
    title: '搜索古诗词-精确匹配',
    priority: 'P0',
    preconditions: 'poetry.json数据已加载',
    steps: [
      '在古诗词搜索框输入"静夜思"',
      '观察搜索结果列表',
    ],
    expectedResult: [
      '搜索结果包含"静夜思"',
      '显示标题、作者、朝代信息',
      '搜索响应快速(<500ms)',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-PS-002',
    category: 'UI/UX交互',
    subcategory: '古诗词搜索',
    title: '搜索古诗词-模糊匹配',
    priority: 'P1',
    preconditions: 'poetry.json数据已加载',
    steps: [
      '在搜索框输入"床前明月光"',
      '观察搜索结果',
    ],
    expectedResult: [
      '搜索结果包含包含该句的诗(静夜思)',
      '模糊搜索阈值0.4生效',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-PS-003',
    category: 'UI/UX交互',
    subcategory: '古诗词搜索',
    title: '搜索古诗词-无结果',
    priority: 'P1',
    preconditions: 'poetry.json数据已加载',
    steps: [
      '在搜索框输入"xyz非诗词内容"',
      '观察搜索结果',
    ],
    expectedResult: [
      '显示无搜索结果的提示',
      '搜索框和列表无异常',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-PS-004',
    category: 'UI/UX交互',
    subcategory: '古诗词搜索',
    title: '选中古诗词后填入文本框',
    priority: 'P0',
    preconditions: '搜索结果中有"春晓"',
    steps: [
      '搜索并找到"春晓"',
      '点击选中"春晓"',
    ],
    expectedResult: [
      '文本框内容更新为格式化的诗词：标题+朝代·作者+空行+诗句',
      '字数统计更新',
      '预览区域更新',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-PS-005',
    category: 'UI/UX交互',
    subcategory: '古诗词搜索',
    title: '搜索框清空',
    priority: 'P2',
    preconditions: '搜索框中有搜索词且显示了结果',
    steps: [
      '清空搜索框内容',
    ],
    expectedResult: [
      '搜索结果列表清空或显示默认推荐',
      '文本框内容不受影响',
    ],
    actualResult: '',
    status: 'pending',
  },

  // ------------------------------------------------------------------
  // 1.6 字词句搜索 (VocabularySearch)
  // ------------------------------------------------------------------
  {
    id: 'UI-VS-001',
    category: 'UI/UX交互',
    subcategory: '字词句搜索',
    title: '分类筛选功能',
    priority: 'P0',
    preconditions: 'vocabulary数据已加载',
    steps: [
      '点击"生字"分类标签',
      '观察列表只显示生字类内容',
      '点击"词语"分类标签',
      '观察列表只显示词语类内容',
      '点击"句子"分类标签',
      '观察列表只显示句子类内容',
      '点击"全部"分类标签',
      '观察列表显示所有内容',
    ],
    expectedResult: [
      '每个分类标签切换后列表内容正确过滤',
      '当前选中分类标签高亮显示',
      '"全部"显示所有分类内容',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-VS-002',
    category: 'UI/UX交互',
    subcategory: '字词句搜索',
    title: '关键词搜索与分类组合',
    priority: 'P1',
    preconditions: 'vocabulary数据已加载',
    steps: [
      '选择"词语"分类',
      '在搜索框输入"美丽"',
      '观察搜索结果',
    ],
    expectedResult: [
      '结果只在"词语"分类中搜索',
      '结果包含匹配"美丽"的词语',
      '模糊搜索阈值0.3生效',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-VS-003',
    category: 'UI/UX交互',
    subcategory: '字词句搜索',
    title: '选中字词句后填入文本框',
    priority: 'P0',
    preconditions: '搜索结果中有内容',
    steps: [
      '搜索并选中一个词语项',
    ],
    expectedResult: [
      '文本框内容更新为所选内容',
      '字数统计更新',
      '预览区域更新',
    ],
    actualResult: '',
    status: 'pending',
  },

  // ------------------------------------------------------------------
  // 1.7 导出功能 (ExportButtons)
  // ------------------------------------------------------------------
  {
    id: 'UI-EB-001',
    category: 'UI/UX交互',
    subcategory: '导出功能',
    title: '导出PDF',
    priority: 'P0',
    preconditions: '预览区域有内容渲染',
    steps: [
      '点击"导出PDF"按钮',
      '等待导出完成',
    ],
    expectedResult: [
      '浏览器下载PDF文件',
      'PDF内容与预览一致',
      'PDF按行分页，无内容被截断',
      '每页包含页码',
      '导出过程中transform:scale()被临时清除并恢复',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-EB-002',
    category: 'UI/UX交互',
    subcategory: '导出功能',
    title: '导出图片(PNG)',
    priority: 'P1',
    preconditions: '预览区域有内容渲染',
    steps: [
      '点击"导出图片"按钮',
      '等待导出完成',
    ],
    expectedResult: [
      '浏览器下载PNG图片',
      '图片内容与预览一致',
      '图片清晰度满足打印需求',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-EB-003',
    category: 'UI/UX交互',
    subcategory: '导出功能',
    title: '打印功能',
    priority: 'P1',
    preconditions: '预览区域有内容渲染',
    steps: [
      '点击"打印"按钮',
    ],
    expectedResult: [
      '浏览器弹出打印对话框',
      '打印预览内容与页面预览一致',
      'no-print元素在打印时隐藏',
      '打印样式(A4尺寸)正确应用',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-EB-004',
    category: 'UI/UX交互',
    subcategory: '导出功能',
    title: '空内容时导出',
    priority: 'P2',
    preconditions: '文本框为空，预览区域为空提示',
    steps: [
      '点击"导出PDF"按钮',
    ],
    expectedResult: [
      '导出空内容PDF或提示用户先输入内容',
      '无JS错误或崩溃',
    ],
    actualResult: '',
    status: 'passed',
  },

  // ------------------------------------------------------------------
  // 1.8 工作表预览 (WorksheetPreview)
  // ------------------------------------------------------------------
  {
    id: 'UI-WP-001',
    category: 'UI/UX交互',
    subcategory: '工作表预览',
    title: 'A4尺寸预览正确渲染',
    priority: 'P0',
    preconditions: '文本框已输入内容',
    steps: [
      '观察左侧预览区域',
    ],
    expectedResult: [
      '预览区域以A4比例(595x842px)显示',
      '标题区域包含标题、模式描述、姓名/日期/得分栏',
      '练习内容区域正确渲染',
      '汉字数量统计正确显示',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-WP-002',
    category: 'UI/UX交互',
    subcategory: '工作表预览',
    title: '预览区域自适应缩放',
    priority: 'P1',
    preconditions: '预览区域有内容',
    steps: [
      '调整浏览器窗口宽度变窄',
      '观察预览区域缩放效果',
      '调整浏览器窗口宽度变宽',
      '观察预览区域缩放效果',
    ],
    expectedResult: [
      '窗口变窄时预览区域等比缩小',
      '窗口变宽时预览区域等比放大',
      '缩放比例基于容器宽度动态计算',
      'resize事件正确监听和响应',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-WP-003',
    category: 'UI/UX交互',
    subcategory: '工作表预览',
    title: '预览标题/姓名/日期/得分栏',
    priority: 'P1',
    preconditions: '预览区域有内容',
    steps: [
      '观察预览区域顶部信息栏',
    ],
    expectedResult: [
      '标题显示当前模式名称',
      '模式描述正确(如"看拼音，在田字格中写出对应的汉字")',
      '姓名、日期、得分栏均存在且有下划线',
    ],
    actualResult: '',
    status: 'pending',
  },

  // ------------------------------------------------------------------
  // 1.9 布局与响应式
  // ------------------------------------------------------------------
  {
    id: 'UI-LY-001',
    category: 'UI/UX交互',
    subcategory: '布局响应式',
    title: '左右分栏布局正常显示',
    priority: 'P0',
    preconditions: '应用已启动，桌面端浏览器',
    steps: [
      '观察页面布局结构',
    ],
    expectedResult: [
      '左侧为预览面板，右侧为设置面板',
      '两栏比例合理(约6:4或类似)',
      '内容不溢出或重叠',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'UI-LY-002',
    category: 'UI/UX交互',
    subcategory: '布局响应式',
    title: '右侧面板滚动',
    priority: 'P1',
    preconditions: '浏览器窗口高度较小，右侧面板内容超出视口',
    steps: [
      '缩小浏览器窗口高度',
      '尝试滚动右侧面板',
    ],
    expectedResult: [
      '右侧面板可独立滚动',
      '滚动流畅无卡顿',
      '左侧预览区域不受右侧滚动影响',
    ],
    actualResult: '',
    status: 'pending',
  },

  // ------------------------------------------------------------------
  // 1.10 设置重置
  // ------------------------------------------------------------------
  {
    id: 'UI-RS-001',
    category: 'UI/UX交互',
    subcategory: '设置重置',
    title: '重置所有设置',
    priority: 'P1',
    preconditions: '已修改多项设置(模式、格式、字号等)',
    steps: [
      '点击重置设置按钮',
    ],
    expectedResult: [
      '所有设置恢复为默认值',
      '文本框内容是否保留取决于设计(应保留)',
      '预览区域按默认设置重新渲染',
      'localStorage被更新为默认值',
    ],
    actualResult: '',
    status: 'pending',
  },
];

// ============================================================================
// 二、文本生成与渲染测试
// ============================================================================

const textGenRenderTestCases: TestCase[] = [
  // ------------------------------------------------------------------
  // 2.1 拼音服务 (pinyinService)
  // ------------------------------------------------------------------
  {
    id: 'TG-PS-001',
    category: '文本生成与渲染',
    subcategory: '拼音服务',
    title: '常见汉字转拼音准确性',
    priority: 'P0',
    preconditions: '拼音字典已加载',
    steps: [
      '调用convertToPinyin("春眠不觉晓")',
      '验证返回结果',
    ],
    expectedResult: [
      '返回"chūn mián bù jué xiǎo"',
      '每个字的拼音正确',
      '声调标记正确',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-PS-002',
    category: '文本生成与渲染',
    subcategory: '拼音服务',
    title: '多音字转拼音-默认读音',
    priority: 'P0',
    preconditions: '拼音字典已加载',
    steps: [
      '调用convertToPinyin("长大")',
      '调用convertToPinyin("长度")',
    ],
    expectedResult: [
      '"长大"返回"zhǎng dà"(长=zhǎng)',
      '"长度"返回"cháng dù"(长=cháng)',
      '多音字默认读音字典正确覆盖',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-PS-003',
    category: '文本生成与渲染',
    subcategory: '拼音服务',
    title: '多音字识别',
    priority: 'P0',
    preconditions: '拼音字典已加载',
    steps: [
      '调用isPolyphonic("长")',
      '调用isPolyphonic("春")',
    ],
    expectedResult: [
      'isPolyphonic("长")返回true',
      'isPolyphonic("春")返回false',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-PS-004',
    category: '文本生成与渲染',
    subcategory: '拼音服务',
    title: '获取多音字所有读音',
    priority: 'P1',
    preconditions: '拼音字典已加载',
    steps: [
      '调用getAllPinyinReadings("长")',
      '验证返回的所有读音',
    ],
    expectedResult: [
      '返回结果包含"zhǎng"和"cháng"',
      '常见读音排在前面',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-PS-005',
    category: '文本生成与渲染',
    subcategory: '拼音服务',
    title: '不同声调类型输出',
    priority: 'P1',
    preconditions: '拼音字典已加载',
    steps: [
      '调用convertToPinyin("中国", "symbol")',
      '调用convertToPinyin("中国", "num")',
      '调用convertToPinyin("中国", "none")',
    ],
    expectedResult: [
      'symbol类型返回"zhōng guó"(符号声调)',
      'num类型返回"zhong1 guo2"(数字声调)',
      'none类型返回"zhong guo"(无声调)',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-PS-006',
    category: '文本生成与渲染',
    subcategory: '拼音服务',
    title: '生成错误拼音功能',
    priority: 'P0',
    preconditions: '拼音字典已加载',
    steps: [
      '多次调用generateWrongPinyin("zhōng")',
      '验证每次生成的错误拼音',
    ],
    expectedResult: [
      '生成的拼音与正确拼音不同',
      '错误拼音是通过元音/辅音替换生成的(不是随机字符)',
      '多次调用可能产生不同的错误拼音',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-PS-007',
    category: '文本生成与渲染',
    subcategory: '拼音服务',
    title: '去除声调功能',
    priority: 'P1',
    preconditions: '无',
    steps: [
      '调用removeTone("zhōng")',
      '调用removeTone("guó")',
    ],
    expectedResult: [
      'removeTone("zhōng")返回"zhong"',
      'removeTone("guó")返回"guo"',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-PS-008',
    category: '文本生成与渲染',
    subcategory: '拼音服务',
    title: '字典初始化幂等性',
    priority: 'P1',
    preconditions: '字典未加载',
    steps: [
      '调用initPinyinDictionaries()',
      '再次调用initPinyinDictionaries()',
      '验证字典只加载一次',
    ],
    expectedResult: [
      '第二次调用不会重复加载字典',
      '并发调用安全(不会多次加载)',
      'getDictStats()返回正确的字典统计',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-PS-009',
    category: '文本生成与渲染',
    subcategory: '拼音服务',
    title: '诗词短语上下文读音',
    priority: 'P1',
    preconditions: 'poetry-phrase.json字典已加载',
    steps: [
      '调用convertToPinyin("春风又绿江南岸")',
      '验证多音字在诗词上下文中的读音',
    ],
    expectedResult: [
      '诗词短语上下文字典正确应用',
      '多音字在特定诗词中的读音被正确识别',
    ],
    actualResult: '',
    status: 'passed',
  },

  // ------------------------------------------------------------------
  // 2.2 文本解析服务 (textParserService)
  // ------------------------------------------------------------------
  {
    id: 'TG-TP-001',
    category: '文本生成与渲染',
    subcategory: '文本解析',
    title: '纯汉字文本解析',
    priority: 'P0',
    preconditions: '无',
    steps: [
      '调用parseText("春眠不觉晓")',
      '验证返回的ParsedChar数组',
    ],
    expectedResult: [
      '返回5个ParsedChar对象',
      '每个对象的char属性正确',
      '每个对象的pinyin属性被填充',
      'type为"hanzi"',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-TP-002',
    category: '文本生成与渲染',
    subcategory: '文本解析',
    title: '含标点符号的文本解析',
    priority: 'P0',
    preconditions: '无',
    steps: [
      '调用parseText("春眠不觉晓，处处闻啼鸟。")',
      '验证标点符号的解析',
    ],
    expectedResult: [
      '逗号和句号被识别为type:"punctuation"',
      '标点符号无拼音',
      '标点符号宽度为窄宽(narrow width)',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-TP-003',
    category: '文本生成与渲染',
    subcategory: '文本解析',
    title: '含换行符的文本解析',
    priority: 'P0',
    preconditions: '无',
    steps: [
      '调用parseText("春眠不觉晓\\n处处闻啼鸟")',
      '验证换行符的解析',
    ],
    expectedResult: [
      '换行符被识别为type:"linebreak"',
      '换行符在渲染时产生新行',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-TP-004',
    category: '文本生成与渲染',
    subcategory: '文本解析',
    title: '段首缩进解析(2+空格)',
    priority: 'P1',
    preconditions: '无',
    steps: [
      '调用parseText("  春眠不觉晓")',
      '验证段首缩进处理',
    ],
    expectedResult: [
      '2个空格被转换为全角缩进',
      '缩进占位符正确渲染',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-TP-005',
    category: '文本生成与渲染',
    subcategory: '文本解析',
    title: '固定网格分行-splitIntoFixedGridLines',
    priority: 'P0',
    preconditions: '文本已解析为ParsedChar数组',
    steps: [
      '解析"春眠不觉晓处处闻啼鸟"(10字)',
      '调用splitIntoFixedGridLines(parsedChars, 5)',
      '验证分行结果',
    ],
    expectedResult: [
      '结果为2行，每行5个字符位',
      '第1行：春眠不觉晓',
      '第2行：处处闻啼鸟',
      '无隐形占位符(恰好填满)',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-TP-006',
    category: '文本生成与渲染',
    subcategory: '文本解析',
    title: '固定网格分行-不足一行时填充隐形占位符',
    priority: 'P0',
    preconditions: '文本已解析为ParsedChar数组',
    steps: [
      '解析"春眠不觉晓"(5字)',
      '调用splitIntoFixedGridLines(parsedChars, 8)',
      '验证分行结果',
    ],
    expectedResult: [
      '结果为1行，8个字符位',
      '前5位为"春眠不觉晓"',
      '后3位为隐形占位符(invisible)',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-TP-007',
    category: '文本生成与渲染',
    subcategory: '文本解析',
    title: '标点禁则-标点不出现在行首',
    priority: 'P1',
    preconditions: '文本已解析',
    steps: [
      '解析"春眠不觉晓，处处闻啼鸟"(含标点)',
      '设置每行字数为6',
      '调用splitIntoLines(parsedChars, charWidth, lineWidth)',
      '验证逗号不在行首',
    ],
    expectedResult: [
      '标点符号不单独出现在行首',
      '标点被移至上一行行末或与前一字符同行',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-TP-008',
    category: '文本生成与渲染',
    subcategory: '文本解析',
    title: 'pinyinMap优先使用',
    priority: 'P1',
    preconditions: '文件解析产生了pinyinPairs',
    steps: [
      '构建pinyinMap: {"长": "zhǎng"}',
      '调用parseText("长大", pinyinMap)',
      '验证"长"的拼音使用了pinyinMap中的值',
    ],
    expectedResult: [
      '"长"的拼音为"zhǎng"(来自pinyinMap)',
      '而非自动生成的默认读音',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-TP-009',
    category: '文本生成与渲染',
    subcategory: '文本解析',
    title: '分页功能-splitIntoPages',
    priority: 'P1',
    preconditions: '文本较长，需要多页显示',
    steps: [
      '输入30行以上的文本',
      '调用splitIntoPages(lines, pageHeight)',
      '验证分页结果',
    ],
    expectedResult: [
      '内容被正确分为多页',
      '每页内容不超过页面高度',
      '行不被截断(完整行在同一页)',
    ],
    actualResult: '',
    status: 'pending',
  },

  // ------------------------------------------------------------------
  // 2.3 文件解析服务 (fileParserService)
  // ------------------------------------------------------------------
  {
    id: 'TG-FP-001',
    category: '文本生成与渲染',
    subcategory: '文件解析',
    title: '解析TXT文件',
    priority: 'P0',
    preconditions: '存在有效的TXT文件',
    steps: [
      '调用parseFile(file)传入.txt文件',
    ],
    expectedResult: [
      '正确提取文本内容',
      '返回ParseResult包含text和charCount',
      'pinyinPairs为空(TXT不含拼音信息)',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-FP-002',
    category: '文本生成与渲染',
    subcategory: '文件解析',
    title: '解析PDF文件-纯文本',
    priority: 'P1',
    preconditions: '存在不含拼音标注的PDF文件',
    steps: [
      '调用parseFile(file)传入.pdf文件',
    ],
    expectedResult: [
      '正确提取文本内容',
      'pinyinPairs为空',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-FP-003',
    category: '文本生成与渲染',
    subcategory: '文件解析',
    title: '解析PDF文件-含拼音标注',
    priority: 'P1',
    preconditions: '存在带拼音标注的PDF文件(拼音在汉字正上方)',
    steps: [
      '调用parseFile(file)传入含拼音的PDF',
    ],
    expectedResult: [
      '正确提取文本内容',
      'pinyinPairs包含拼音配对信息',
      '拼音坐标配对策略正确(x差<20, y差5-30)',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-FP-004',
    category: '文本生成与渲染',
    subcategory: '文件解析',
    title: '解析DOCX文件',
    priority: 'P1',
    preconditions: '存在有效的.docx文件',
    steps: [
      '调用parseFile(file)传入.docx文件',
    ],
    expectedResult: [
      '正确提取文本内容',
      'mammoth库正确解析段落和文本',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-FP-005',
    category: '文本生成与渲染',
    subcategory: '文件解析',
    title: '文件大小验证-超过10MB',
    priority: 'P1',
    preconditions: '存在大于10MB的文件',
    steps: [
      '调用parseFile(file)传入大文件',
    ],
    expectedResult: [
      '抛出文件大小超出限制的错误',
      '错误信息包含大小限制说明',
    ],
    actualResult: '',
    status: 'passed',
  },

  // ------------------------------------------------------------------
  // 2.4 练习渲染器 (ExerciseRenderer)
  // ------------------------------------------------------------------
  {
    id: 'TG-ER-001',
    category: '文本生成与渲染',
    subcategory: '练习渲染',
    title: '看拼音写汉字模式渲染',
    priority: 'P0',
    preconditions: '文本为"春眠不觉晓"，模式为pinyin-to-hanzi，格式为tian-zi-ge',
    steps: [
      '渲染ExerciseRenderer',
      '检查每个字符位的渲染内容',
    ],
    expectedResult: [
      '每个字符位上方显示拼音',
      '每个字符位下方显示空田字格',
      '拼音与汉字正确对应',
      '空田字格有十字虚线和外框',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-ER-002',
    category: '文本生成与渲染',
    subcategory: '练习渲染',
    title: '看汉字写拼音模式渲染',
    priority: 'P0',
    preconditions: '文本为"春眠不觉晓"，模式为hanzi-to-pinyin，格式为si-xian-san-ge',
    steps: [
      '渲染ExerciseRenderer',
      '检查每个字符位的渲染内容',
    ],
    expectedResult: [
      '每个字符位上方显示空四线三格',
      '每个字符位下方显示汉字',
      '四线三格有四条横线',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-ER-003',
    category: '文本生成与渲染',
    subcategory: '练习渲染',
    title: '多音字选择模式渲染',
    priority: 'P0',
    preconditions: '文本为"长大"(含多音字"长")，模式为polyphonic-choice',
    steps: [
      '渲染ExerciseRenderer',
      '检查多音字相关渲染',
    ],
    expectedResult: [
      '只显示多音字(非多音字被过滤)',
      '显示PinyinOptions组件，包含候选读音选项',
      '选项包含正确读音和干扰读音',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-ER-004',
    category: '文本生成与渲染',
    subcategory: '练习渲染',
    title: '拼音纠错模式渲染',
    priority: 'P0',
    preconditions: '文本为"春眠不觉晓"，模式为pinyin-correction',
    steps: [
      '渲染ExerciseRenderer',
      '检查拼音纠错相关渲染',
    ],
    expectedResult: [
      '约30%的字显示错误拼音',
      '错误拼音通过generateWrongPinyin生成',
      'PinyinCorrectionItem组件正确渲染',
      '学生可标记对错并填写正确拼音',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-ER-005',
    category: '文本生成与渲染',
    subcategory: '练习渲染',
    title: '复习模式渲染',
    priority: 'P0',
    preconditions: '文本为"春眠不觉晓"，模式为review',
    steps: [
      '渲染ExerciseRenderer',
      '检查复习模式渲染',
    ],
    expectedResult: [
      '每个汉字上方显示拼音标注(绝对定位)',
      '拼音使用PinyinAnnotation组件',
      '汉字正常显示',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-ER-006',
    category: '文本生成与渲染',
    subcategory: '练习渲染',
    title: '标题/作者行居中渲染',
    priority: 'P1',
    preconditions: '古诗词格式文本：标题行+作者行+诗句',
    steps: [
      '输入格式化的古诗词文本(标题+作者+空行+诗句)',
      '渲染ExerciseRenderer',
    ],
    expectedResult: [
      '标题行居中显示',
      '作者行居中显示',
      '诗句行左对齐',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-ER-007',
    category: '文本生成与渲染',
    subcategory: '练习渲染',
    title: '空文本提示渲染',
    priority: 'P1',
    preconditions: '文本为空',
    steps: [
      '渲染ExerciseRenderer with空文本',
    ],
    expectedResult: [
      '显示空文本提示信息',
      '不渲染任何格子或拼音',
      '无JS错误',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-ER-008',
    category: '文本生成与渲染',
    subcategory: '练习渲染',
    title: '多音字模式-无多音字时提示',
    priority: 'P1',
    preconditions: '文本为"春风"("春""风"均非多音字)',
    steps: [
      '设置模式为多音字选择',
      '渲染ExerciseRenderer',
    ],
    expectedResult: [
      '显示无多音字的提示信息',
      '不渲染选项组件',
    ],
    actualResult: '',
    status: 'pending',
  },

  // ------------------------------------------------------------------
  // 2.5 格子组件渲染
  // ------------------------------------------------------------------
  {
    id: 'TG-GR-001',
    category: '文本生成与渲染',
    subcategory: '格子组件',
    title: '田字格SVG渲染',
    priority: 'P0',
    preconditions: '无',
    steps: [
      '渲染TianZiGe组件(size=48)',
      '检查SVG元素',
    ],
    expectedResult: [
      'SVG包含外框矩形',
      'SVG包含十字虚线(水平和垂直中线)',
      'SVG尺寸与size参数匹配',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-GR-002',
    category: '文本生成与渲染',
    subcategory: '格子组件',
    title: '四线三格SVG渲染',
    priority: 'P0',
    preconditions: '无',
    steps: [
      '渲染SiXianSanGe组件(size=48)',
      '检查SVG元素',
    ],
    expectedResult: [
      'SVG包含4条横线',
      '线间距均匀形成3个格子',
      'SVG尺寸与size参数匹配',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-GR-003',
    category: '文本生成与渲染',
    subcategory: '格子组件',
    title: '横线SVG渲染',
    priority: 'P0',
    preconditions: '无',
    steps: [
      '渲染HengXian组件(size=48)',
      '检查SVG元素',
    ],
    expectedResult: [
      'SVG包含1条横线',
      '横线位置为底部基线位置',
      'SVG尺寸与size参数匹配',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-GR-004',
    category: '文本生成与渲染',
    subcategory: '格子组件',
    title: 'TianZiGeRow行渲染',
    priority: 'P1',
    preconditions: '无',
    steps: [
      '渲染TianZiGeRow(chars, size, letterSpacing)',
    ],
    expectedResult: [
      '行内每个田字格正确渲染',
      '字间距由letterSpacing控制',
      '行内格子数量与chars数组长度一致',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-GR-005',
    category: '文本生成与渲染',
    subcategory: '格子组件',
    title: 'SiXianSanGeContinuous连续渲染',
    priority: 'P1',
    preconditions: '无',
    steps: [
      '渲染SiXianSanGeContinuous(chars, size, letterSpacing)',
    ],
    expectedResult: [
      '四线三格横线连续不断',
      '每个字符位有分隔虚线',
      '连续线条效果正确',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-GR-006',
    category: '文本生成与渲染',
    subcategory: '格子组件',
    title: 'PinyinDisplay拼音标注渲染',
    priority: 'P1',
    preconditions: '无',
    steps: [
      '渲染PinyinAnnotation(text="chūn", fontSize=16)',
    ],
    expectedResult: [
      '拼音文本正确显示',
      '声调符号正确渲染',
      '字体大小匹配fontSize参数',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-GR-007',
    category: '文本生成与渲染',
    subcategory: '格子组件',
    title: 'PinyinOptions选项渲染',
    priority: 'P1',
    preconditions: '无',
    steps: [
      '渲染PinyinOptions(char="长", options=["zhǎng","cháng","zhàng"])',
    ],
    expectedResult: [
      '显示多音字字符',
      '显示所有候选读音选项',
      '选项以可交互形式呈现(如圆圈选项)',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'TG-GR-008',
    category: '文本生成与渲染',
    subcategory: '格子组件',
    title: 'PinyinCorrectionItem纠错渲染',
    priority: 'P1',
    preconditions: '无',
    steps: [
      '渲染PinyinCorrectionItem(char="春", wrongPinyin="chēn", correctPinyin="chūn")',
    ],
    expectedResult: [
      '显示汉字和错误拼音',
      '提供对/错标记区域',
      '提供纠正拼音的填写区域',
    ],
    actualResult: '',
    status: 'pending',
  },

  // ------------------------------------------------------------------
  // 2.6 导出服务 (exportService)
  // ------------------------------------------------------------------
  {
    id: 'TG-ES-001',
    category: '文本生成与渲染',
    subcategory: '导出服务',
    title: 'PDF导出-按行分页',
    priority: 'P0',
    preconditions: '预览区域有多行内容，超过一页',
    steps: [
      '调用exportToPDF()',
      '检查生成的PDF',
    ],
    expectedResult: [
      'PDF按行分页，行不被截断',
      '每页包含header信息(标题/姓名/日期)',
      '每页底部有页码',
      'transform:scale()在导出时被临时清除',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-ES-002',
    category: '文本生成与渲染',
    subcategory: '导出服务',
    title: 'PDF导出-单页内容',
    priority: 'P1',
    preconditions: '预览区域内容不超过一页',
    steps: [
      '调用exportToPDF()',
    ],
    expectedResult: [
      '生成单页PDF',
      '内容完整无截断',
      '使用单页回退方案(direct screenshot)',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-ES-003',
    category: '文本生成与渲染',
    subcategory: '导出服务',
    title: '图片导出',
    priority: 'P1',
    preconditions: '预览区域有内容',
    steps: [
      '调用exportToImage()',
    ],
    expectedResult: [
      '生成PNG图片并触发下载',
      '图片内容与预览一致',
      'html2canvas截图正确',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'TG-ES-004',
    category: '文本生成与渲染',
    subcategory: '导出服务',
    title: '导出后transform:scale()恢复',
    priority: 'P1',
    preconditions: '预览区域有scale变换',
    steps: [
      '调用exportToPDF()',
      '导出完成后检查预览区域样式',
    ],
    expectedResult: [
      '导出前transform:scale()被清除',
      '导出后transform:scale()被恢复',
      '预览区域显示正常无变形',
    ],
    actualResult: '',
    status: 'pending',
  },
];

// ============================================================================
// 三、边缘情况测试
// ============================================================================

const edgeCaseTestCases: TestCase[] = [
  // ------------------------------------------------------------------
  // 3.1 极端输入条件
  // ------------------------------------------------------------------
  {
    id: 'EC-EI-001',
    category: '边缘情况',
    subcategory: '极端输入',
    title: '输入纯数字文本',
    priority: 'P1',
    preconditions: '文本框为空',
    steps: [
      '输入"1234567890"',
    ],
    expectedResult: [
      '数字被正确解析(非汉字，无拼音)',
      '预览区域显示数字(可能无格子)',
      '无JS错误',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-EI-002',
    category: '边缘情况',
    subcategory: '极端输入',
    title: '输入纯英文字母文本',
    priority: 'P1',
    preconditions: '文本框为空',
    steps: [
      '输入"Hello World"',
    ],
    expectedResult: [
      '英文被正确解析(非汉字，无拼音)',
      '预览区域显示英文',
      '无JS错误',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-EI-003',
    category: '边缘情况',
    subcategory: '极端输入',
    title: '输入纯标点符号',
    priority: 'P2',
    preconditions: '文本框为空',
    steps: [
      '输入"，。！？、：；""''【】（）"',
    ],
    expectedResult: [
      '标点被正确识别为punctuation类型',
      '预览区域正确渲染标点(窄宽)',
      '无拼音生成',
      '无JS错误',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-EI-004',
    category: '边缘情况',
    subcategory: '极端输入',
    title: '输入混合文本(汉字+英文+数字+标点+空格)',
    priority: 'P1',
    preconditions: '文本框为空',
    steps: [
      '输入"第1课 Hello世界！你好2024年"',
    ],
    expectedResult: [
      '汉字部分生成拼音',
      '英文/数字部分无拼音但正确显示',
      '标点正确渲染为窄宽',
      '各类型字符混合排版正确',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-EI-005',
    category: '边缘情况',
    subcategory: '极端输入',
    title: '输入单个汉字',
    priority: 'P1',
    preconditions: '文本框为空',
    steps: [
      '输入"春"',
    ],
    expectedResult: [
      '正确解析和渲染单个汉字',
      '拼音正确生成',
      '格子正确渲染',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-EI-006',
    category: '边缘情况',
    subcategory: '极端输入',
    title: '输入最大长度文本(10000字)',
    priority: 'P2',
    preconditions: '文本框为空',
    steps: [
      '输入或粘贴恰好10000字的文本',
    ],
    expectedResult: [
      '所有文本被接受',
      '字数统计显示10000',
      '预览区域正常渲染(可能多页)',
      '无性能问题(渲染时间<5秒)',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-EI-007',
    category: '边缘情况',
    subcategory: '极端输入',
    title: '输入超长无换行文本',
    priority: 'P2',
    preconditions: '文本框为空',
    steps: [
      '输入200字连续汉字无换行',
    ],
    expectedResult: [
      '文本被正确分行(根据每行字数设置)',
      '分行算法正确处理无换行长文本',
      '无溢出或渲染异常',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-EI-008',
    category: '边缘情况',
    subcategory: '极端输入',
    title: '输入大量连续换行符',
    priority: 'P2',
    preconditions: '文本框为空',
    steps: [
      '输入"春\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n晓"',
    ],
    expectedResult: [
      '多个换行符被正确处理',
      '预览区域产生对应空行',
      '无渲染异常',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-EI-009',
    category: '边缘情况',
    subcategory: '极端输入',
    title: '输入含特殊Unicode字符的文本',
    priority: 'P2',
    preconditions: '文本框为空',
    steps: [
      '输入含emoji(😊)、特殊符号(★♪▶)的文本',
    ],
    expectedResult: [
      '特殊字符被识别为非汉字',
      '无拼音生成',
      '预览区域正确显示或跳过特殊字符',
      '无JS错误',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-EI-010',
    category: '边缘情况',
    subcategory: '极端输入',
    title: '输入含全角/半角混合字符',
    priority: 'P2',
    preconditions: '文本框为空',
    steps: [
      '输入"ＡＢＣ123春眠"（含全角和半角字符）',
    ],
    expectedResult: [
      '全角字符正确显示',
      '半角字符正确显示',
      '字符宽度计算正确(全角=2倍半角)',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-EI-011',
    category: '边缘情况',
    subcategory: '极端输入',
    title: '输入仅含空格的文本',
    priority: 'P2',
    preconditions: '文本框为空',
    steps: [
      '输入多个空格"     "',
    ],
    expectedResult: [
      '空格被识别为space类型',
      '2+连续空格触发段首缩进逻辑',
      '预览正确处理空格',
      '无JS错误',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-EI-012',
    category: '边缘情况',
    subcategory: '极端输入',
    title: '输入含Tab字符的文本',
    priority: 'P2',
    preconditions: '文本框为空',
    steps: [
      '输入含Tab制表符的文本',
    ],
    expectedResult: [
      'Tab字符被正确处理',
      '不导致解析崩溃',
    ],
    actualResult: '',
    status: 'passed',
  },

  // ------------------------------------------------------------------
  // 3.2 异常操作流程
  // ------------------------------------------------------------------
  {
    id: 'EC-AO-001',
    category: '边缘情况',
    subcategory: '异常操作',
    title: '快速连续切换模式',
    priority: 'P2',
    preconditions: '文本框有内容',
    steps: [
      '快速连续点击不同模式按钮(1秒内切换5次)',
    ],
    expectedResult: [
      '最终显示最后一次选择的模式',
      '中间状态不残留',
      '无渲染错误或闪烁',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-AO-002',
    category: '边缘情况',
    subcategory: '异常操作',
    title: '快速连续调整样式滑块',
    priority: 'P2',
    preconditions: '文本框有内容',
    steps: [
      '快速来回拖动字号滑块',
    ],
    expectedResult: [
      '滑块最终值正确',
      '预览区域最终渲染正确',
      '无性能问题或卡顿',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-AO-003',
    category: '边缘情况',
    subcategory: '异常操作',
    title: '导出过程中切换设置',
    priority: 'P2',
    preconditions: '正在导出PDF',
    steps: [
      '点击导出PDF',
      '导出过程中立即切换模式或格式',
    ],
    expectedResult: [
      '导出完成时内容与导出开始时一致',
      '或导出被取消',
      '不会产生半截内容的PDF',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-AO-004',
    category: '边缘情况',
    subcategory: '异常操作',
    title: '文件上传过程中取消',
    priority: 'P2',
    preconditions: '正在选择文件',
    steps: [
      '点击文件上传按钮',
      '在文件选择对话框中点击取消',
    ],
    expectedResult: [
      '文本框内容不变',
      '无JS错误',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-AO-005',
    category: '边缘情况',
    subcategory: '异常操作',
    title: '古诗词搜索时数据加载失败',
    priority: 'P2',
    preconditions: '网络断开或poetry.json不可访问',
    steps: [
      '在poetry.json不可访问时打开古诗词搜索',
    ],
    expectedResult: [
      '显示数据加载失败的提示',
      '搜索功能不可用但不崩溃',
      '可重试加载',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-AO-006',
    category: '边缘情况',
    subcategory: '异常操作',
    title: 'localStorage不可用',
    priority: 'P2',
    preconditions: '浏览器禁用了localStorage或存储空间满',
    steps: [
      '在localStorage不可用的环境中打开应用',
      '修改设置',
    ],
    expectedResult: [
      '应用正常运行(使用默认设置)',
      '设置修改在当前会话生效',
      '刷新后设置恢复默认(无法持久化)',
      '无JS错误(try-catch捕获)',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-AO-007',
    category: '边缘情况',
    subcategory: '异常操作',
    title: '拼音字典加载失败',
    priority: 'P2',
    preconditions: '字典JSON文件不可访问',
    steps: [
      '在字典文件不可访问时打开应用',
      '输入汉字文本',
    ],
    expectedResult: [
      '使用pinyin-pro默认功能(降级模式)',
      '多音字默认读音可能不准确',
      '不崩溃，给出适当的提示或静默降级',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-AO-008',
    category: '边缘情况',
    subcategory: '异常操作',
    title: '打印对话框中取消打印',
    priority: 'P2',
    preconditions: '点击了打印按钮',
    steps: [
      '点击打印按钮',
      '在打印对话框中点击取消',
    ],
    expectedResult: [
      '页面恢复正常状态',
      'body.printing类被移除',
      '预览区域显示正常',
    ],
    actualResult: '',
    status: 'pending',
  },

  // ------------------------------------------------------------------
  // 3.3 系统边界条件
  // ------------------------------------------------------------------
  {
    id: 'EC-SB-001',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '每行字数为最小值(5)时的渲染',
    priority: 'P1',
    preconditions: '文本框有内容',
    steps: [
      '设置每行字数为5',
      '输入较长文本',
    ],
    expectedResult: [
      '每行最多5个字符位',
      '行数增加但每行严格5位',
      '隐形占位符正确填充不足5位的行',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-SB-002',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '每行字数为最大值(20)时的渲染',
    priority: 'P1',
    preconditions: '文本框有内容',
    steps: [
      '设置每行字数为20',
      '输入较短文本(5字)',
    ],
    expectedResult: [
      '一行显示，前5位为字符，后15位为隐形占位符',
      '格子宽度自适应缩小',
      '不溢出A4页面边界',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-SB-003',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '字号最小(16)和最大(48)时格子渲染',
    priority: 'P1',
    preconditions: '文本框有内容',
    steps: [
      '设置字号为16，观察格子尺寸',
      '设置字号为48，观察格子尺寸',
    ],
    expectedResult: [
      '字号16时格子最小但仍然可见和可打印',
      '字号48时格子最大但不超出A4宽度',
      '格子SVG尺寸随字号正确缩放',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-SB-004',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '字间距最大(16)时行宽不溢出',
    priority: 'P1',
    preconditions: '每行字数为20，字间距为16',
    steps: [
      '设置每行字数20，字间距16',
      '输入20个汉字',
    ],
    expectedResult: [
      '行宽不超出A4页面边界',
      '字符间距均匀',
      '无溢出或换行异常',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-SB-005',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '多音字选择模式-全为多音字的文本',
    priority: 'P2',
    preconditions: '文本为"长短重量"(均为多音字)',
    steps: [
      '设置模式为多音字选择',
      '渲染预览',
    ],
    expectedResult: [
      '所有字都显示在多音字选项中',
      '选项生成正确',
      '布局合理不拥挤',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-SB-006',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '拼音纠错模式-短文本(1字)',
    priority: 'P2',
    preconditions: '文本为"春"',
    steps: [
      '设置模式为拼音纠错',
      '渲染预览',
    ],
    expectedResult: [
      '1个字可能或可能不被标记为错误(30%概率)',
      '渲染正确无异常',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-SB-007',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '文本仅含1个多音字-多音字选择模式',
    priority: 'P2',
    preconditions: '文本为"长"',
    steps: [
      '设置模式为多音字选择',
      '渲染预览',
    ],
    expectedResult: [
      '显示1个多音字的选项',
      '选项包含所有读音',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-SB-008',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '文件上传后立即修改文本框内容',
    priority: 'P2',
    preconditions: '已通过文件上传填入内容',
    steps: [
      '上传文件后文本框填入内容',
      '立即手动编辑文本框内容',
    ],
    expectedResult: [
      '手动编辑的内容正确显示',
      'pinyinPairs可能被清除(因手动编辑使文件拼音映射失效)',
      '预览按最新文本内容渲染',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-SB-009',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '古诗词选中后再次搜索并选中另一首',
    priority: 'P1',
    preconditions: '已选中一首诗',
    steps: [
      '搜索并选中"春晓"',
      '文本框显示春晓内容',
      '再次搜索并选中"静夜思"',
    ],
    expectedResult: [
      '文本框内容更新为静夜思',
      '春晓内容被替换',
      '预览区域按静夜思渲染',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-SB-010',
    category: '边缘情况',
    subcategory: '系统边界',
    title: 'PDF文件解析-加密PDF',
    priority: 'P2',
    preconditions: '存在加密的PDF文件',
    steps: [
      '尝试上传加密PDF',
    ],
    expectedResult: [
      '显示适当的错误提示(如PDF加密无法解析)',
      '不崩溃',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-SB-011',
    category: '边缘情况',
    subcategory: '系统边界',
    title: 'PDF文件解析-纯图片PDF(无可提取文本)',
    priority: 'P2',
    preconditions: '存在扫描版PDF(纯图片无文本层)',
    steps: [
      '尝试上传纯图片PDF',
    ],
    expectedResult: [
      '显示无可提取文本的提示或文本为空',
      '不崩溃',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-SB-012',
    category: '边缘情况',
    subcategory: '系统边界',
    title: 'DOCX文件解析-含表格/图片的文档',
    priority: 'P2',
    preconditions: '存在含表格和图片的.docx文件',
    steps: [
      '上传含表格/图片的docx文件',
    ],
    expectedResult: [
      '文本内容被提取(表格文本可能丢失或合并)',
      '图片被忽略(不崩溃)',
      '无JS错误',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-SB-013',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '生僻字/罕见字拼音生成',
    priority: 'P2',
    preconditions: '文本含生僻字如"龘""㔓""𠮷"',
    steps: [
      '输入含生僻字的文本',
    ],
    expectedResult: [
      '生僻字拼音尝试生成(可能为空或默认音)',
      '不崩溃',
      '无拼音时显示占位或空',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-SB-014',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '浏览器兼容性-不同浏览器渲染差异',
    priority: 'P2',
    preconditions: '在Chrome、Firefox、Safari中分别测试',
    steps: [
      '在Chrome中打开应用并渲染内容',
      '在Firefox中打开应用并渲染内容',
      '在Safari中打开应用并渲染内容',
    ],
    expectedResult: [
      '三种浏览器中渲染效果基本一致',
      'SVG格子无变形',
      '拼音标注位置正确',
      '导出功能在三种浏览器中均可用',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-SB-015',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '拼音纠错模式-所有字均被标记错误(极端情况)',
    priority: 'P2',
    preconditions: '文本很短(2-3字)且随机种子恰好全部选中',
    steps: [
      '输入"长短"并设置拼音纠错模式',
      '多次刷新观察错误拼音分布',
    ],
    expectedResult: [
      '30%的字被标记错误(统计上)',
      '偶尔可能全部被标记(概率低但可能)',
      '随机性合理，不会100%标记所有字',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-SB-016',
    category: '边缘情况',
    subcategory: '系统边界',
    title: 'generateWrongPinyin生成与原拼音相同的拼音',
    priority: 'P2',
    preconditions: '无',
    steps: [
      '调用generateWrongPinyin处理简短拼音(如"é")',
      '验证是否存在生成与原拼音相同的情况',
    ],
    expectedResult: [
      '如果替换后与原拼音相同，应重新生成',
      '或标记为无法生成错误拼音的边界情况',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-SB-017',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '古诗词搜索-输入速度极快(防抖处理)',
    priority: 'P2',
    preconditions: '古诗词搜索已加载',
    steps: [
      '极快速地连续输入搜索关键词',
    ],
    expectedResult: [
      '搜索请求被适当防抖(不会每个字符都触发)',
      '最终显示正确搜索结果',
      '无性能问题',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-SB-018',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '页面加载时localStorage中存储了损坏的设置数据',
    priority: 'P2',
    preconditions: 'localStorage中pinyin-challenge-settings键值为无效JSON',
    steps: [
      '手动设置localStorage为无效JSON',
      '刷新页面',
    ],
    expectedResult: [
      '应用使用默认设置',
      '不崩溃',
      '无效数据被覆盖为默认值',
    ],
    actualResult: '',
    status: 'pending',
  },
  {
    id: 'EC-SB-019',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '空文件上传',
    priority: 'P2',
    preconditions: '存在0字节的空文件',
    steps: [
      '上传0字节的空文件',
    ],
    expectedResult: [
      '显示文件为空的提示或文本框不变',
      '不崩溃',
    ],
    actualResult: '',
    status: 'passed',
  },
  {
    id: 'EC-SB-020',
    category: '边缘情况',
    subcategory: '系统边界',
    title: '标点禁则-连续标点在行尾',
    priority: 'P2',
    preconditions: '文本含连续标点如"……"或"！！"',
    steps: [
      '输入含连续标点的文本',
      '设置每行字数使连续标点恰好在行尾',
    ],
    expectedResult: [
      '连续标点不被拆分到两行',
      '标点禁则规则正确应用',
    ],
    actualResult: '',
    status: 'pending',
  },
];

// ============================================================================
// 测试用例统计
// ============================================================================

const allTestCases = [...uiUxTestCases, ...textGenRenderTestCases, ...edgeCaseTestCases];

function getStats() {
  const total = allTestCases.length;
  const byCategory = {
    'UI/UX交互': uiUxTestCases.length,
    '文本生成与渲染': textGenRenderTestCases.length,
    '边缘情况': edgeCaseTestCases.length,
  };
  const byPriority = {
    P0: allTestCases.filter(t => t.priority === 'P0').length,
    P1: allTestCases.filter(t => t.priority === 'P1').length,
    P2: allTestCases.filter(t => t.priority === 'P2').length,
  };
  const bySubcategory: Record<string, number> = {};
  allTestCases.forEach(t => {
    const key = `${t.category}/${t.subcategory}`;
    bySubcategory[key] = (bySubcategory[key] || 0) + 1;
  });

  return { total, byCategory, byPriority, bySubcategory };
}

// Export for use in test runner
export { uiUxTestCases, textGenRenderTestCases, edgeCaseTestCases, allTestCases, getStats };
export type { TestCase };
