export type KnowledgeCategory = {
  key: string;
  label: string;
  color: string;
};

export type KnowledgeArticle = {
  id: string;
  category: string;
  title: string;
  desc: string;
  content: string[];
};

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  { key: 'feed', label: '喂养常识', color: '#FFF1C8' },
  { key: 'health', label: '疾病预防', color: '#E7F7FF' },
  { key: 'behavior', label: '行为纠正', color: '#F3EEFF' },
  { key: 'breed', label: '品种特点', color: '#EAFBEF' },
];

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'soft-stool',
    category: 'health',
    title: '猫咪软便怎么处理',
    desc: '先观察精神状态，再调整饮食与补水。',
    content: [
      '第一步先看精神状态。如果精神食欲都正常，多数是轻微肠胃波动。',
      '把主粮稳定在单一配方，暂停新零食和新罐头，连续观察 2-3 天。',
      '少量多次补水，保持猫砂盆清洁，便于观察频率和性状变化。',
      '如果连续 48 小时未改善，或出现呕吐、便血、发热，建议及时就医。',
    ],
  },
  {
    id: 'dog-picky',
    category: 'behavior',
    title: '幼犬挑食纠正指南',
    desc: '固定喂食时段，减少零食干扰。',
    content: [
      '建立固定喂食窗口，建议每餐 15-20 分钟，超时收走。',
      '在纠正阶段减少零食和人食，避免狗狗形成“等更好吃”的预期。',
      '先排除身体不适和口腔问题，再进行行为纠正更稳妥。',
      '进食时保持环境安静，减少干扰，提升专注度和进食效率。',
    ],
  },
  {
    id: 'deworming',
    category: 'health',
    title: '换季驱虫提醒清单',
    desc: '体内外驱虫频率和注意事项一览。',
    content: [
      '体外驱虫一般每月一次，体内驱虫按产品建议周期执行。',
      '驱虫前后记录体重，确保剂量匹配，避免过量或不足。',
      '驱虫后 24 小时观察精神、食欲和排便，如异常及时联系医生。',
      '家中多宠建议统一周期处理，降低交叉感染风险。',
    ],
  },
  {
    id: 'senior-care',
    category: 'feed',
    title: '老年宠物护理重点',
    desc: '关节、牙齿和体重管理的日常建议。',
    content: [
      '老年宠物建议每年 1-2 次体检，重点关注肾脏、心脏和关节。',
      '体重变化是重要信号，建议每周固定时间称重并记录趋势。',
      '日常增加低冲击运动和关节护理，避免突然高强度活动。',
      '饮食上选择更易消化、蛋白质质量更高的配方，降低肠胃负担。',
    ],
  },
];

export const findKnowledgeArticle = (id: string) => {
  return KNOWLEDGE_ARTICLES.find((item) => item.id === id);
};

export const findArticleIndex = (id: string) => {
  return KNOWLEDGE_ARTICLES.findIndex((item) => item.id === id);
};
