import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import { memo, useMemo, useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { KNOWLEDGE_ARTICLES, KNOWLEDGE_CATEGORIES } from './data';
import { getFavoriteArticleIds, isArticleFavorited } from '@/utils/knowledgeState';

const PetKnowledge = memo(function PetKnowledge() {
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('feed');
  const [onlyFavorite, setOnlyFavorite] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useDidShow(() => {
    setRefreshKey((prev) => prev + 1);
  });

  const filteredArticles = useMemo(() => {
    const favorites = new Set(getFavoriteArticleIds());

    return KNOWLEDGE_ARTICLES.filter((item) => {
      if (item.category !== activeCategory) {
        return false;
      }
      if (onlyFavorite && !favorites.has(item.id)) {
        return false;
      }
      if (!keyword.trim()) {
        return true;
      }
      return item.title.includes(keyword) || item.desc.includes(keyword);
    });
  }, [activeCategory, keyword, onlyFavorite, refreshKey]);

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{ background: 'linear-gradient(180deg, #FFE68D 0%, #FFFCE0 100%)', minHeight: '100vh' }}
      navOptions={{ navTitle: '知识库', needBack: false }}
    >
      <View className="px-[24rpx] pt-[16rpx] pb-[120rpx]">
        <View className="bg-white rounded-[18rpx] border-[2rpx] border-solid border-[#262626] px-[14rpx] py-[10rpx] mb-[14rpx]">
          <Input
            placeholder="搜索：如 软便、挑食、驱虫"
            value={keyword}
            onInput={(event) => setKeyword(event.detail.value)}
            className="text-[24rpx]"
          />
        </View>

        <View className="grid grid-cols-2 gap-[10rpx] mb-[14rpx]">
          {KNOWLEDGE_CATEGORIES.map((item) => (
            <View
              key={item.key}
              className="rounded-[16rpx] border-[2rpx] border-solid border-[#262626] p-[12rpx]"
              style={{ backgroundColor: item.color, opacity: activeCategory === item.key ? 1 : 0.75 }}
              onClick={() => setActiveCategory(item.key)}
            >
              <Text className="text-[24rpx] font-semibold text-[#303030]">{item.label}</Text>
            </View>
          ))}
        </View>

        <View className="mb-[10rpx] flex justify-end">
          <View
            className="px-[12rpx] py-[8rpx] rounded-[14rpx] border-[2rpx] border-solid border-[#262626]"
            style={{ backgroundColor: onlyFavorite ? '#FFD93B' : '#F4F4F4' }}
            onClick={() => setOnlyFavorite((prev) => !prev)}
          >
            <Text className="text-[22rpx] text-[#333]">{onlyFavorite ? '仅看收藏中' : '仅看收藏'}</Text>
          </View>
        </View>

        <View className="bg-white rounded-[18rpx] border-[2rpx] border-solid border-[#262626] p-[12rpx] mb-[14rpx]">
          <Text className="text-[26rpx] font-bold text-[#262626] mb-[8rpx] block">推荐文章</Text>
          {!filteredArticles.length ? (
            <Text className="text-[22rpx] text-[#888] py-[10rpx] block">当前条件下暂无文章</Text>
          ) : (
            filteredArticles.map((item) => (
              <View
                key={item.id}
                className="py-[10rpx] border-b border-[#efefef] last:border-b-0"
                onClick={() => Taro.navigateTo({ url: `/pages/PetArticleDetail/index?id=${item.id}` })}
              >
                <View className="flex items-center justify-between">
                  <Text className="text-[24rpx] text-[#222] block">{item.title}</Text>
                  <Text className="text-[22rpx]">{isArticleFavorited(item.id) ? '★' : '☆'}</Text>
                </View>
                <Text className="text-[20rpx] text-[#777] mt-[4rpx] block">{item.desc}</Text>
              </View>
            ))
          )}
        </View>

        <View
          className="bg-[#2B8BFF] rounded-[20rpx] p-[12rpx]"
          onClick={() => Taro.navigateTo({ url: '/pages/PetQa/index' })}
        >
          <Text className="text-[24rpx] text-white font-semibold block">AI 宠物问答</Text>
          <Text className="text-[20rpx] text-[#dbeaff] mt-[4rpx] block">输入你的问题，后续接后端接口生成答案。</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetKnowledge;
