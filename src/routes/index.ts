/** 路由配置 */

const routeConfigList: any = [
  // 宠物档案
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
  // 铲屎官
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
];

export default routeConfigList;