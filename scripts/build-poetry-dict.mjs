// 从诗词库生成短语拼音字典
// 用 pinyin-pro 默认字频切分整句，作为 addDict 注入（最长匹配优先）
import { pinyin } from 'pinyin-pro';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(__dirname, '..', 'public', 'dict');

mkdirSync(PUBLIC_DIR, { recursive: true });

// 标点符号（不进入字典 key）
const PUNCT_RE = /[，。！？、；：""''「」『』《》（）()…—·\s\n,.!?;:'"()\-—]/g;

function extractPhrases(content) {
  // 按标点和换行切分，过滤空段、纯单字
  const segments = content.split(/[\n，。！？、；：,.!?;:\s]+/);
  const phrases = new Set();
  for (const seg of segments) {
    const clean = seg.replace(PUNCT_RE, '').trim();
    if (clean.length >= 2) phrases.add(clean);
  }
  return [...phrases];
}

const poetry = JSON.parse(
  readFileSync(join(__dirname, '..', 'public', 'poetry.json'), 'utf8')
);

console.log(`[poetry-dict] 加载 ${poetry.length} 首诗`);

const phraseMap = new Map();  // phrase -> { pinyin, source }

let dupCount = 0;
for (const poem of poetry) {
  const phrases = extractPhrases(poem.content);
  for (const phrase of phrases) {
    if (phraseMap.has(phrase)) {
      dupCount++;
      continue;
    }
    // pinyin-pro 默认字频切分
    const pinyinStr = pinyin(phrase, { type: 'string', toneType: 'symbol' });
    phraseMap.set(phrase, {
      pinyin: pinyinStr,
      source: `${poem.id}#${poem.title}`,
    });
  }
}

const dict = {};
const metadata = {
  total_phrases: phraseMap.size,
  duplicates_skipped: dupCount,
  source: 'public/poetry.json',
  generated_at: new Date().toISOString(),
};

for (const [phrase, info] of phraseMap) {
  dict[phrase] = info.pinyin;
}

// 写入主字典
const dictPath = join(PUBLIC_DIR, 'poetry-phrase.json');
writeFileSync(dictPath, JSON.stringify(dict), 'utf8');

// 写入元信息（供 UI 展示）
const metaPath = join(PUBLIC_DIR, 'poetry-phrase.meta.json');
writeFileSync(metaPath, JSON.stringify(metadata, null, 2), 'utf8');

console.log(`[poetry-dict] 生成 ${phraseMap.size} 个短语（去重 ${dupCount}）`);
console.log(`[poetry-dict] 输出: ${dictPath}`);
