// 关键多音字验证脚本
// 1. 不注入字典：记录 pinyin-pro 默认行为
// 2. 注入字典：记录升级后行为
// 3. 对比差异，量化升级价值
import { pinyin, customPinyin, addDict } from 'pinyin-pro';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DICT = join(__dirname, '..', 'public', 'dict');

const polyphonicMap = JSON.parse(readFileSync(join(PUBLIC_DICT, 'polyphone-default.json'), 'utf8'));
const phraseDict = JSON.parse(readFileSync(join(PUBLIC_DICT, 'poetry-phrase.json'), 'utf8'));

// 期望的"正确"读音（基于小学语文教材使用频率）
const cases = [
  { char: '还', expected: 'huán', note: '诗中 huán (归还)' },
  { char: '行', expected: 'xíng', note: '行走' },
  { char: '长', expected: 'chánɡ', note: '长度' },
  { char: '为', expected: 'wéi', note: '成为' },
  { char: '调', expected: 'tiáo', note: '调节' },
  { char: '种', expected: 'zhǒng', note: '种子' },
  { char: '应', expected: 'yīng', note: '应该' },
  { char: '便', expected: 'biàn', note: '方便' },
  { char: '得', expected: 'dé', note: '得到' },
  { char: '的', expected: 'de', note: '助词' },
  { char: '了', expected: 'le', note: '完成' },
  { text: '白毛浮绿水', expected: 'bái máo fú lǜ shuǐ' },
  { text: '曲项向天歌', expected: 'qū xiàng xiàng tiān gē' },
  { text: '红掌拨清波', expected: 'hóng zhǎng bō qīng bō' },
  { text: '春眠不觉晓', expected: 'chūn mián bù jué xiǎo' },
];

console.log('\n========== 阶段 1: pinyin-pro 默认（不注入字典） ==========');
let defaultPass = 0;
for (const c of cases) {
  const input = c.char || c.text;
  const result = pinyin(input, { type: 'string' });
  const ok = result === c.expected;
  if (ok) defaultPass++;
  console.log(`${ok ? '✅' : '❌'} ${input}: 预期 ${c.expected} | 实际 ${result}`);
}

// 注入字典
customPinyin(polyphonicMap, { polyphonic: 'replace' });
addDict(phraseDict);

console.log('\n========== 阶段 2: 注入 chinese-dictionary + 诗词短语字典 ==========');
let enhancedPass = 0;
for (const c of cases) {
  const input = c.char || c.text;
  const result = pinyin(input, { type: 'string' });
  const ok = result === c.expected;
  if (ok) enhancedPass++;
  console.log(`${ok ? '✅' : '❌'} ${input}: 预期 ${c.expected} | 实际 ${result}`);
}

console.log('\n========== 升级效果 ==========');
console.log(`默认准确率: ${defaultPass}/${cases.length} = ${(defaultPass/cases.length*100).toFixed(0)}%`);
console.log(`升级准确率: ${enhancedPass}/${cases.length} = ${(enhancedPass/cases.length*100).toFixed(0)}%`);
console.log(`提升: +${enhancedPass - defaultPass} 个 case 修复`);

process.exit(enhancedPass < cases.length ? 1 : 0);
