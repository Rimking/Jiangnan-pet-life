import PetFastSendIcon from '@/assets/tabbar/pet-fast-send.svg';
import PetProfileNormalIcon from '@/assets/tabbar/pet-archival-normal.svg';
import PetProfileIcon from '@/assets/tabbar/pet-archival.svg';
import PetScheduleNormalIcon from '@/assets/tabbar/pet-schedule-normal.svg';
import PetScheduleIcon from '@/assets/tabbar/pet-schedule.svg';
import PetKnowledgeNormalIcon from '@/assets/tabbar/pet-knowledge-normal.svg';
import PetKnowledgeIcon from '@/assets/tabbar/pet-knowledge.svg';
import PetHomeNormalIcon from '@/assets/tabbar/pet-home-normal.svg';
import PetHomeIcon from '@/assets/tabbar/pet-home.svg';

import { TabBarItem } from './typing';

const PET_PROFILE_BAR: TabBarItem = {
  name: '宠物档案',
  icon: PetProfileNormalIcon,
  activeIcon: PetProfileIcon,
  isAdd: false,
  path: '/pages/PetProfile/index',
  specialBackgroundColor: 'rgb(254,249,215)',
};

const PET_SCHEDULE_BAR: TabBarItem = {
  name: '宠物日程',
  icon: PetScheduleNormalIcon,
  activeIcon: PetScheduleIcon,
  isAdd: false,
  path: '/pages/PetSchedule/index',
  specialBackgroundColor: 'rgb(254,249,215)',
};

const SEND_PET_SCHEDULE_BAR: TabBarItem = {
  name: '日程发布',
  icon: PetFastSendIcon,
  activeIcon: PetFastSendIcon,
  isAdd: true,
  path: '/pages/SendPetSchedule/index',
  specialBackgroundColor: 'rgb(254,249,215)',
};

const PET_KNOWLEDGE_BAR: TabBarItem = {
  name: '知识库',
  icon: PetKnowledgeNormalIcon,
  activeIcon: PetKnowledgeIcon,
  isAdd: false,
  path: '/pages/PetKnowledge/index',
  specialBackgroundColor: 'rgb(254,249,215)',
};

const PET_OWNER_BAR: TabBarItem = {
  name: '我的',
  icon: PetHomeNormalIcon,
  activeIcon: PetHomeIcon,
  isAdd: false,
  path: '/pages/PetOwner/index',
  specialBackgroundColor: 'rgb(254,249,215)',
};

export const DEFAULT_TAB_LIST = [
  PET_PROFILE_BAR,
  PET_SCHEDULE_BAR,
  SEND_PET_SCHEDULE_BAR,
  PET_KNOWLEDGE_BAR,
  PET_OWNER_BAR,
];
