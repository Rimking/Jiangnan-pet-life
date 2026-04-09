/** 路由配置 */

const routeConfigList: any = [
  // 宠物档案（首页）
  {
    path: '/pages/PetProfile/index',
    title: '宠物档案',
    isTabBar: true,
  },
  // 宠物日程
  {
    path: '/pages/PetSchedule/index',
    title: '宠物日程',
    isTabBar: true,
  },
  // 日程发布
  {
    path: '/pages/SendPetSchedule/index',
    title: '日程发布',
    isTabBar: true,
  },
  // 知识库
  {
    path: '/pages/PetKnowledge/index',
    title: '知识库',
    isTabBar: true,
  },
  // 铲屎官（我的）
  {
    path: '/pages/PetOwner/index',
    title: '铲屎官',
    isTabBar: true,
  },
  // 宠物详情
  {
    path: '/pages/PetDetailPage/index',
    title: '宠物详情',
    isTabBar: false,
  },
  // 宠物列表
  {
    path: '/pages/PetList/index',
    title: '我的宠物',
    isTabBar: false,
  },
  // 添加/编辑宠物
  {
    path: '/pages/AddPet/index',
    title: '添加宠物',
    isTabBar: false,
  },
  // 花销记录
  {
    path: '/pages/ExpenseRecord/index',
    title: '花销记录',
    isTabBar: false,
  },
  // 护理记录
  {
    path: '/pages/CareRecord/index',
    title: '护理记录',
    isTabBar: false,
  },
  // 数据统计
  {
    path: '/pages/DataStatistics/index',
    title: '数据统计',
    isTabBar: false,
  },
  // 成长时光
  {
    path: '/pages/Timeline/index',
    title: '成长时光',
    isTabBar: false,
  },
  // 成长相册
  {
    path: '/pages/PhotoAlbum/index',
    title: '成长相册',
    isTabBar: false,
  },
  // 年龄换算器
  {
    path: '/pages/AgeCalculator/index',
    title: '年龄换算器',
    isTabBar: false,
  },
  // 知识库文章详情
  {
    path: '/pages/KnowledgeDetail/index',
    title: '文章详情',
    isTabBar: false,
  },
  // AI对话
  {
    path: '/pages/AIConversation/index',
    title: 'AI养宠顾问',
    isTabBar: false,
  },
];

export default routeConfigList;