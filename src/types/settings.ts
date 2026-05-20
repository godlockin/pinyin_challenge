/**
 * 设置相关类型定义
 */

/** 练习模式类型 */
export const ExerciseMode = {
  /** 看拼音写汉字 */
  PinyinToHanzi: 'pinyin-to-hanzi',
  /** 看汉字写拼音 */
  HanziToPinyin: 'hanzi-to-pinyin',
  /** 多音字选择 */
  PolyphonicChoice: 'polyphonic-choice',
  /** 拼音纠错 */
  PinyinCorrection: 'pinyin-correction',
  /** 复习模式 */
  Review: 'review',
} as const;

export type ExerciseMode = typeof ExerciseMode[keyof typeof ExerciseMode];

/** 练习模式元数据 */
export const ExerciseModeInfo: Record<ExerciseMode, { label: string; description: string; icon: string }> = {
  [ExerciseMode.PinyinToHanzi]: {
    label: '看拼音写汉字',
    description: '根据拼音写出对应汉字',
    icon: '📝',
  },
  [ExerciseMode.HanziToPinyin]: {
    label: '看汉字写拼音',
    description: '为汉字标注正确拼音',
    icon: '🔤',
  },
  [ExerciseMode.PolyphonicChoice]: {
    label: '多音字选择',
    description: '选择多音字的正确读音',
    icon: '🔀',
  },
  [ExerciseMode.PinyinCorrection]: {
    label: '拼音纠错',
    description: '找出并纠正错误拼音',
    icon: '✏️',
  },
  [ExerciseMode.Review]: {
    label: '复习模式',
    description: '同时显示汉字和拼音',
    icon: '📖',
  },
};

/** 格式类型 */
export const GridType = {
  /** 田字格 */
  TianZiGe: 'tian-zi-ge',
  /** 四线三格（拼音格） */
  SiXianSanGe: 'si-xian-san-ge',
  /** 横线（普通书写线） */
  HorizontalLine: 'horizontal-line',
  /** 空白（无格子） */
  Blank: 'blank',
} as const;

export type GridType = typeof GridType[keyof typeof GridType];

/** 格式类型元数据 */
export const GridTypeInfo: Record<GridType, { label: string; description: string }> = {
  [GridType.TianZiGe]: {
    label: '田字格',
    description: '传统汉字书写格',
  },
  [GridType.SiXianSanGe]: {
    label: '四线三格',
    description: '拼音书写格式',
  },
  [GridType.HorizontalLine]: {
    label: '横线',
    description: '普通书写线',
  },
  [GridType.Blank]: {
    label: '空白',
    description: '无格式约束',
  },
};

/** 样式设置接口 */
export interface StyleSettings {
  /** 字号（像素） */
  fontSize: number;
  /** 字间距（像素） */
  letterSpacing: number;
  /** 行间距（像素） */
  lineHeight: number;
  /** 每行字数 */
  charsPerLine: number;
}

/** 拼音配对（从文件解析获得的原始拼音） */
export interface PinyinPair {
  hanzi: string;
  pinyin: string;
}

/** 设置接口 */
export interface Settings {
  /** 输入文本 */
  inputText: string;
  /** 练习模式 */
  exerciseMode: ExerciseMode;
  /** 格式类型 */
  gridType: GridType;
  /** 样式设置 */
  style: StyleSettings;
  /** 从文件解析的拼音配对（作为正确答案） */
  pinyinPairs?: PinyinPair[];
}

/** 默认设置 */
export const defaultSettings: Settings = {
  inputText: '',
  exerciseMode: ExerciseMode.PinyinToHanzi,
  gridType: GridType.TianZiGe,
  style: {
    fontSize: 24,
    letterSpacing: 4,
    lineHeight: 48,
    charsPerLine: 10,
  },
  pinyinPairs: undefined,
};
