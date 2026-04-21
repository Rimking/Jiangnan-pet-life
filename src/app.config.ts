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
    'pages/PetExpenseStats/index',
    'pages/PetCareStats/index',
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
      },
      {
        pagePath: 'pages/PetSchedule/index',
        text: '日程',
      },
      {
        pagePath: 'pages/PetKnowledge/index',
        text: '知识库',
      },
      {
        pagePath: 'pages/PetOwner/index',
        text: '我的',
      },
    ],
  },
});
