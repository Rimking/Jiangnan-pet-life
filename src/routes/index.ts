/** 路由配置 */
const routeConfigList: Array<{ path: string; title: string; isTabBar: boolean }> = [
  { path: '/pages/PetProfile/index', title: '宠物档案', isTabBar: true },
  { path: '/pages/PetSchedule/index', title: '宠物日程', isTabBar: true },
  { path: '/pages/SendPetSchedule/index', title: '日程发布', isTabBar: true },
  { path: '/pages/PetKnowledge/index', title: '知识库', isTabBar: true },
  { path: '/pages/PetOwner/index', title: '我的', isTabBar: true },
  { path: '/pages/PetDetailPage/index', title: '宠物详情', isTabBar: false },
  { path: '/pages/PetList/index', title: '我的宠物', isTabBar: false },
  { path: '/pages/AddPet/index', title: '添加宠物', isTabBar: false },
  { path: '/pages/ExpenseRecord/index', title: '花销记录', isTabBar: false },
  { path: '/pages/CareRecord/index', title: '护理记录', isTabBar: false },
  { path: '/pages/DataStatistics/index', title: '数据统计', isTabBar: false },
  { path: '/pages/Timeline/index', title: '成长时光', isTabBar: false },
  { path: '/pages/PhotoAlbum/index', title: '成长相册', isTabBar: false },
  { path: '/pages/AgeCalculator/index', title: '年龄换算器', isTabBar: false },
  { path: '/pages/KnowledgeDetail/index', title: '文章详情', isTabBar: false },
  { path: '/pages/AIConversation/index', title: 'AI养宠顾问', isTabBar: false },
];

export default routeConfigList;
