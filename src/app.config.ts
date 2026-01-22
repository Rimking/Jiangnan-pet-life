export default defineAppConfig({
  pages: [
    'pages/PetSchedule/index',

    'pages/PetProfile/index',
    'pages/PetOwner/index',
    'pages/PetKnowledge/index',
    'pages/SendPetSchedule/index',
    'pages/Login/index',
    'pages/PetDetailPage/index',
    'pages/AddPetReminder/index',
    'pages/AddPetRecord/index',
  ],

  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom',
  },

  tabBar: {
    custom: true,
    color: '#666',
    selectedColor: '#165DFF',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/PetProfile/index',
        text: '宠物档案',
        // iconPath: 'cosmic-icon',
        // selectedIconPath: 'cosmic-normal-icon'
      },
      {
        pagePath: 'pages/PetSchedule/index',
        text: '日程',
        // iconPath: 'schedule-icon',
        // selectedIconPath: 'schedule-normal-icon'
      },
      {
        pagePath: 'pages/PetKnowledge/index',
        text: '知识库',
        // iconPath: 'add-plan',
        // selectedIconPath: 'add-plan'
      },
      {
        pagePath: 'pages/PetOwner/index',
        text: '我的',
        // iconPath: 'focus-icon',
        // selectedIconPath: 'focus-normal-icon'
      },
    ],
  },
});
