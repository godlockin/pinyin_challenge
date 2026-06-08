import fs from 'fs';
import https from 'https';

// 小学75首必背清单
const primaryPoems = [
  { title: '咏鹅', author: '骆宾王' },
  { title: '江南', author: '汉乐府' },
  { title: '春晓', author: '孟浩然' },
  { title: '静夜思', author: '李白' },
  { title: '登鹳雀楼', author: '王之涣' },
  { title: '悯农', author: '李绅' },
  { title: '古朗月行', author: '李白' },
  { title: '风', author: '李峤' },
  { title: '咏柳', author: '贺知章' },
  { title: '凉州词', author: '王之涣' },
  { title: '出塞', author: '王昌龄' },
  { title: '芙蓉楼送辛渐', author: '王昌龄' },
  { title: '鹿柴', author: '王维' },
  { title: '送元二使安西', author: '王维' },
  { title: '九月九日忆山东兄弟', author: '王维' },
  { title: '早发白帝城', author: '李白' },
  { title: '望庐山瀑布', author: '李白' },
  { title: '赠汪伦', author: '李白' },
  { title: '黄鹤楼送孟浩然之广陵', author: '李白' },
  { title: '独坐敬亭山', author: '李白' },
  { title: '望天门山', author: '李白' },
  { title: '别董大', author: '高适' },
  { title: '绝句', author: '杜甫', keywords: ['两个黄鹂'] },
  { title: '春夜喜雨', author: '杜甫' },
  { title: '绝句', author: '杜甫', keywords: ['迟日江山'] },
  { title: '江畔独步寻花', author: '杜甫' },
  { title: '枫桥夜泊', author: '张继' },
  { title: '滁州西涧', author: '韦应物' },
  { title: '游子吟', author: '孟郊' },
  { title: '早春呈水部张十八员外', author: '韩愈' },
  { title: '渔歌子', author: '张志和' },
  { title: '塞下曲', author: '卢纶' },
  { title: '望洞庭', author: '刘禹锡' },
  { title: '浪淘沙', author: '刘禹锡' },
  { title: '赋得古原草送别', author: '白居易' },
  { title: '池上', author: '白居易' },
  { title: '忆江南', author: '白居易' },
  { title: '小儿垂钓', author: '胡令能' },
  { title: '山行', author: '杜牧' },
  { title: '清明', author: '杜牧' },
  { title: '江南春', author: '杜牧' },
  { title: '秋夕', author: '杜牧' },
  { title: '乐游原', author: '李商隐' },
  { title: '蜂', author: '罗隐' },
  { title: '江上渔者', author: '范仲淹' },
  { title: '元日', author: '王安石' },
  { title: '泊船瓜洲', author: '王安石' },
  { title: '书湖阴先生壁', author: '王安石' },
  { title: '六月二十七日望湖楼醉书', author: '苏轼' },
  { title: '饮湖上初晴后雨', author: '苏轼' },
  { title: '惠崇春江晚景', author: '苏轼' },
  { title: '题西林壁', author: '苏轼' },
  { title: '夏日绝句', author: '李清照' },
  { title: '三衢道中', author: '曾几' },
  { title: '示儿', author: '陆游' },
  { title: '秋夜将晓出篱门迎凉有感', author: '陆游' },
  { title: '四时田园杂兴', author: '范成大' },
  { title: '小池', author: '杨万里' },
  { title: '晓出净慈寺送林子方', author: '杨万里' },
  { title: '春日', author: '朱熹' },
  { title: '题临安邸', author: '林升' },
  { title: '游园不值', author: '叶绍翁' },
  { title: '乡村四月', author: '翁卷' },
  { title: '村居', author: '高鼎' },
  { title: '墨梅', author: '王冕' },
  { title: '石灰吟', author: '于谦' },
  { title: '竹石', author: '郑燮' },
  { title: '所见', author: '袁枚' },
  { title: '己亥杂诗', author: '龚自珍' },
  { title: '七步诗', author: '曹植' },
  { title: '敕勒歌', author: '北朝民歌' },
  { title: '长歌行', author: '汉乐府' },
  { title: '回乡偶书', author: '贺知章' },
  { title: '凉州词', author: '王翰' }
];

// 繁简转换映射(常用字)
const t2s = {
  '詩':'诗','綺':'绮','壯':'壮','離':'离','餘':'余','連':'连','遙':'遥','飛':'飞',
  '觀':'观','雲':'云','隱':'隐','閣':'阁','煙':'烟','綺':'绮','巖':'岩','廊':'廊',
  '務':'务','聊':'聊','輦':'辇','匣':'匣','啓':'启','龍':'龙','圖':'图','繩':'绳',
  '鳳':'凤','篆':'篆','韋':'韦','編':'编','斷':'断','續':'续','縹':'缥','帙':'帙',
  '舒':'舒','還':'还','卷':'卷','對':'对','淹':'淹','留':'留','欹':'欹','墳':'坟',
  '測':'测','測':'测','測':'测'
};

function toSimplified(text) {
  return text.split('').map(c => t2s[c] || c).join('');
}

// 生成 ID
function generateId(title, author) {
  const pinyin = {
    '咏':'yong','鹅':'e','江':'jiang','南':'nan','春':'chun','晓':'xiao',
    '静':'jing','夜':'ye','思':'si','登':'deng','鹳':'guan','雀':'que',
    '楼':'lou','悯':'min','农':'nong','古':'gu','朗':'lang','月':'yue',
    '行':'xing','风':'feng','柳':'liu','凉':'liang','州':'zhou','词':'ci'
  };
  const titlePy = title.split('').map(c => pinyin[c] || c).join('');
  return titlePy.toLowerCase().replace(/[^a-z]/g, '');
}

// Fetch JSON
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 匹配诗歌
function matchPoem(poem, sourcePoems) {
  const { title, author, keywords } = poem;

  for (const src of sourcePoems) {
    const srcTitle = toSimplified(src.title);
    const srcAuthor = toSimplified(src.author);

    // 标题匹配
    if (srcTitle.includes(title) || title.includes(srcTitle)) {
      if (srcAuthor === author) {
        // 关键字匹配(处理同名诗)
        if (keywords) {
          const content = src.paragraphs.join('');
          if (keywords.some(kw => content.includes(kw))) {
            return src;
          }
        } else {
          return src;
        }
      }
    }
  }
  return null;
}

// 格式化内容
function formatContent(paragraphs) {
  return paragraphs.map(p => toSimplified(p)).join('\n');
}

async function main() {
  console.log('开始抓取唐诗数据...');

  const allTangPoems = [];

  // Fetch 唐诗文件 (0, 1000, 2000, ..., 56000)
  for (let i = 0; i <= 56000; i += 1000) {
    try {
      const url = `https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/全唐诗/poet.tang.${i}.json`;
      console.log(`Fetching ${url}...`);
      const poems = await fetchJson(url);
      allTangPoems.push(...poems);

      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (e) {
      console.error(`Failed to fetch file ${i}:`, e.message);
    }
  }

  console.log(`共获取 ${allTangPoems.length} 首唐诗`);

  // 匹配必背诗
  const result = [];
  const notFound = [];

  for (const poem of primaryPoems) {
    const matched = matchPoem(poem, allTangPoems);
    if (matched) {
      result.push({
        id: generateId(poem.title, poem.author),
        title: toSimplified(matched.title),
        author: toSimplified(matched.author),
        dynasty: '唐',
        content: formatContent(matched.paragraphs),
        grade: '小学',
        category: '必背'
      });
      console.log(`✓ ${poem.title} - ${poem.author}`);
    } else {
      notFound.push(poem);
      console.log(`✗ ${poem.title} - ${poem.author}`);
    }
  }

  // 保存结果
  const outputPath = '/Users/chenchen/working/sourcecode/tools/education/pinyin_challenge/public/poetry.json';
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');

  console.log(`\n已保存 ${result.length} 首诗到 ${outputPath}`);
  console.log(`\n未找到 ${notFound.length} 首:`);
  notFound.forEach(p => console.log(`  - ${p.title} (${p.author})`));
}

main().catch(console.error);
