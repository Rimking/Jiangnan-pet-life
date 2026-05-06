import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import { memo, useCallback, useMemo, useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import {
  deleteKnowledgeFavoriteData,
  createKnowledgeFavoriteData,
  getKnowledgeArticlesData,
  getKnowledgeOverviewData,
  KnowledgeArticleItem,
  KnowledgeCategoryItem,
} from '@/api/data';
import { ensureLoggedIn } from '@/utils/authState';

const PetKnowledge = memo(function PetKnowledge() {
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('feed');
  const [onlyFavorite, setOnlyFavorite] = useState(false);
  const [categories, setCategories] = useState<KnowledgeCategoryItem[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticleItem[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOverview = useCallback((category?: string, nextKeyword?: string) => {
    setLoading(true);
    getKnowledgeOverviewData({
      category,
      keyword: nextKeyword?.trim() || undefined,
    })
      .then(async (result) => {
        const categoryList = result.categories || [];
        const resolvedCategory = result.activeCategory || '';
        const categoryCount =
          categoryList.find((item) => item.key === resolvedCategory)?.count || 0;
        const articleList =
          !result.articles?.length && resolvedCategory && categoryCount > 0
            ? await getKnowledgeArticlesData({
                category: resolvedCategory,
                keyword: nextKeyword?.trim() || undefined,
              }).catch(() => [])
            : result.articles || [];

        setCategories(result.categories || []);
        setActiveCategory(resolvedCategory);
        setLoggedIn(Boolean(result.loggedIn));
        setFavoriteIds(result.favoriteArticleIds || []);
        setArticles(articleList);
      })
      .catch(() => {
        setCategories([]);
        setLoggedIn(false);
        setFavoriteIds([]);
        setArticles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useDidShow(() => {
    loadOverview(activeCategory, keyword);
  });

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    loadOverview(activeCategory, value);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    loadOverview(category, keyword);
  };

  const filteredArticles = useMemo(() => {
    const favorites = new Set(favoriteIds);
    return articles.filter((item) => {
      if (onlyFavorite && !favorites.has(item.id)) {
        return false;
      }
      return true;
    });
  }, [onlyFavorite, articles, favoriteIds]);

  const handleToggleFavorite = async (articleId: string) => {
    if (!ensureLoggedIn('/pages/PetKnowledge/index')) {
      return;
    }

    const favorited = favoriteIds.includes(articleId);
    try {
      if (favorited) {
        await deleteKnowledgeFavoriteData({ articleId });
        setFavoriteIds((prev) => prev.filter((item) => item !== articleId));
      } else {
        await createKnowledgeFavoriteData({ articleId });
        setFavoriteIds((prev) => [...prev, articleId]);
      }
      setLoggedIn(true);
    } catch (error: any) {
      Taro.showToast({
        title: error?.message || '收藏状态更新失败',
        icon: 'none',
      });
    }
  };

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        background: 'linear-gradient(180deg, #FFE68D 0%, #FFFCE0 100%)',
        minHeight: '100vh',
      }}
      navOptions={{ navTitle: '知识库', needBack: false }}
    >
      <View className="px-[24rpx] pt-[16rpx] pb-[120rpx]">
        <View className="bg-white rounded-[18rpx] border-[2rpx] border-solid border-[#262626] px-[14rpx] py-[10rpx] mb-[14rpx]">
          <Input
            placeholder="搜索：如 软便、挑食、驱虫"
            value={keyword}
            onInput={(event) => handleKeywordChange(event.detail.value)}
            className="text-[24rpx]"
          />
        </View>

        <View className="grid grid-cols-2 gap-[10rpx] mb-[14rpx]">
          {categories.map((item) => (
            <View
              key={item.key}
              className="rounded-[16rpx] border-[2rpx] border-solid border-[#262626] p-[12rpx]"
              style={{
                backgroundColor: item.color,
                opacity: activeCategory === item.key ? 1 : 0.75,
              }}
              onClick={() => handleCategoryChange(item.key)}
            >
              <Text className="text-[24rpx] font-semibold text-[#303030]">
                {item.label}
              </Text>
              <Text className="text-[18rpx] text-[#666] mt-[4rpx] block">
                {item.count || 0} 篇
              </Text>
            </View>
          ))}
        </View>

        <View className="mb-[10rpx] flex justify-end">
          <View
            className="px-[12rpx] py-[8rpx] rounded-[14rpx] border-[2rpx] border-solid border-[#262626]"
            style={{ backgroundColor: onlyFavorite ? '#FFD93B' : '#F4F4F4' }}
            onClick={() => setOnlyFavorite((prev) => !prev)}
          >
            <Text className="text-[22rpx] text-[#333]">
              {onlyFavorite ? '仅看收藏中' : '仅看收藏'}
            </Text>
          </View>
        </View>

        {!loggedIn ? (
          <Text className="text-[20rpx] text-[#7a6f52] mb-[10rpx] block">
            收藏、同步知识偏好等操作需要先完成微信登录。
          </Text>
        ) : null}

        <View className="bg-white rounded-[18rpx] border-[2rpx] border-solid border-[#262626] p-[12rpx] mb-[14rpx]">
          <Text className="text-[26rpx] font-bold text-[#262626] mb-[8rpx] block">
            推荐文章
          </Text>
          {loading ? (
            <Text className="text-[22rpx] text-[#888] py-[10rpx] block">
              正在加载文章...
            </Text>
          ) : !filteredArticles.length ? (
            <View className="py-[10rpx]">
              <Text className="text-[22rpx] text-[#888] block">当前条件下暂无文章</Text>
              <View className="flex gap-[10rpx] mt-[10rpx]">
                <View
                  className="flex-1 h-[56rpx] rounded-[28rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
                  onClick={() => Taro.navigateTo({ url: '/pages/PetQa/index' })}
                >
                  <Text className="text-[20rpx] font-semibold text-[#333]">去问答</Text>
                </View>
              </View>
            </View>
          ) : (
            filteredArticles.map((item) => (
              <View
                key={item.id}
                className="py-[10rpx] border-b border-[#efefef] last:border-b-0"
                onClick={() =>
                  Taro.navigateTo({ url: `/pages/PetArticleDetail/index?id=${item.id}` })
                }
              >
                <View className="flex items-center justify-between">
                  <Text className="text-[24rpx] text-[#222] block">{item.title}</Text>
                  <Text
                    className="text-[22rpx]"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleToggleFavorite(item.id);
                    }}
                  >
                    {favoriteIds.includes(item.id) ? '★' : '☆'}
                  </Text>
                </View>
                <Text className="text-[20rpx] text-[#777] mt-[4rpx] block leading-[1.6]">
                  {item.desc}
                </Text>
                {item.sourceName ? (
                  <Text className="text-[18rpx] text-[#9a9a9a] mt-[4rpx] block">
                    来源：{item.sourceName}
                  </Text>
                ) : null}
              </View>
            ))
          )}
        </View>

        <View
          className="bg-[#2B8BFF] rounded-[20rpx] p-[12rpx]"
          onClick={() => Taro.navigateTo({ url: '/pages/PetQa/index' })}
        >
          <Text className="text-[24rpx] text-white font-semibold block">知识问答</Text>
          <Text className="text-[20rpx] text-[#dbeaff] mt-[4rpx] block leading-[1.6]">
            可以直接输入常见养护问题，系统会基于当前知识库内容给出建议。
          </Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetKnowledge;
