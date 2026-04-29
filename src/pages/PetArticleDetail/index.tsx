import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { memo, useMemo, useState } from 'react';
import {
  createKnowledgeFavoriteData,
  deleteKnowledgeFavoriteData,
  getKnowledgeArticleDetailData,
  getKnowledgeArticlesData,
  getKnowledgeOverviewData,
  KnowledgeArticleItem,
} from '@/api/data';
import { ensureLoggedIn } from '@/utils/authState';

const PetArticleDetail = memo(function PetArticleDetail() {
  const { params } = useRouter();
  const [article, setArticle] = useState<KnowledgeArticleItem | null>(null);
  const [articles, setArticles] = useState<KnowledgeArticleItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useDidShow(() => {
    if (!params.id) {
      setArticle(null);
      return;
    }
    getKnowledgeArticleDetailData(params.id)
      .then((res) => setArticle(res))
      .catch(() => setArticle(null));
    getKnowledgeArticlesData({})
      .then((res) => setArticles(res))
      .catch(() => setArticles([]));
    getKnowledgeOverviewData({})
      .then((res) => {
        setFavoriteIds(res.favoriteArticleIds || []);
      })
      .catch(() => {
        setFavoriteIds([]);
      });
  });

  const articleIndex = useMemo(() => {
    return articles.findIndex((item) => item.id === params.id);
  }, [articles, params.id]);

  const prevArticle = articleIndex > 0 ? articles[articleIndex - 1] : undefined;
  const nextArticle =
    articleIndex >= 0 && articleIndex < articles.length - 1
      ? articles[articleIndex + 1]
      : undefined;

  if (!article) {
    return (
      <BasicLayout
        wrapClassName="w-full h-full"
        wrapStyle={{ background: 'linear-gradient(180deg, #FFE68D 0%, #FFFCE0 100%)', minHeight: '100vh' }}
        navOptions={{ navTitle: '文章详情', needBack: true }}
      >
        <View className="px-[24rpx] pt-[16rpx]">
          <View className="bg-white rounded-[18rpx] border-[2rpx] border-solid border-[#262626] p-[20rpx]">
            <Text className="text-[24rpx] text-[#666]">未找到文章内容</Text>
          </View>
        </View>
      </BasicLayout>
    );
  }

  const favorite = favoriteIds.includes(article.id);

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{ background: 'linear-gradient(180deg, #FFE68D 0%, #FFFCE0 100%)', minHeight: '100vh' }}
      navOptions={{ navTitle: '文章详情', needBack: true }}
    >
      <View className="px-[24rpx] pt-[16rpx] pb-[120rpx]">
        <View className="bg-white rounded-[18rpx] border-[2rpx] border-solid border-[#262626] p-[18rpx] mb-[14rpx]">
          <Text className="text-[30rpx] font-bold text-[#222] block">{article.title}</Text>
          <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">{article.desc}</Text>
          {article.sourceName ? (
            <Text className="text-[20rpx] text-[#8a8a8a] mt-[8rpx] block">
              来源：{article.sourceName}
            </Text>
          ) : null}
        </View>

        <View className="mb-[14rpx] flex justify-end">
          <View
            className="px-[14rpx] py-[8rpx] rounded-[14rpx] border-[2rpx] border-solid border-[#262626]"
            style={{ backgroundColor: favorite ? '#FFD93B' : '#F4F4F4' }}
            onClick={async () => {
              if (!ensureLoggedIn(`/pages/PetArticleDetail/index?id=${article.id}`)) {
                return;
              }
              try {
                if (favorite) {
                  await deleteKnowledgeFavoriteData({ articleId: article.id });
                  setFavoriteIds((prev) => prev.filter((item) => item !== article.id));
                } else {
                  await createKnowledgeFavoriteData({ articleId: article.id });
                  setFavoriteIds((prev) => [...prev, article.id]);
                }
              } catch (error: any) {
                Taro.showToast({
                  title: error?.message || '收藏状态更新失败',
                  icon: 'none',
                });
              }
            }}
          >
            <Text className="text-[22rpx] text-[#333]">{favorite ? '已收藏 ★' : '加入收藏 ☆'}</Text>
          </View>
        </View>

        <View className="bg-white rounded-[18rpx] border-[2rpx] border-solid border-[#262626] p-[18rpx] mb-[14rpx]">
          {article.content.map((line) => (
            <Text key={line} className="text-[24rpx] leading-[38rpx] text-[#444] block mb-[10rpx]">
              {line}
            </Text>
          ))}
          {article.sourceUrl ? (
            <Text className="text-[20rpx] text-[#6b7fd3] mt-[6rpx] block">参考链接：{article.sourceUrl}</Text>
          ) : null}
        </View>

        <View className="flex gap-[10rpx] mb-[14rpx]">
          <View
            className="flex-1 h-[80rpx] rounded-[40rpx] border-[2rpx] border-solid flex items-center justify-center"
            style={{
              backgroundColor: prevArticle ? '#FFF6CE' : '#F3F3F3',
              borderColor: prevArticle ? '#262626' : '#d8d8d8',
              opacity: prevArticle ? 1 : 0.6,
            }}
            onClick={() =>
              prevArticle &&
              Taro.redirectTo({
                url: `/pages/PetArticleDetail/index?id=${prevArticle.id}`,
              })
            }
          >
            <Text className="text-[24rpx] text-[#333]">上一篇</Text>
          </View>

          <View
            className="flex-1 h-[80rpx] rounded-[40rpx] border-[2rpx] border-solid flex items-center justify-center"
            style={{
              backgroundColor: nextArticle ? '#E9F4FF' : '#F3F3F3',
              borderColor: nextArticle ? '#262626' : '#d8d8d8',
              opacity: nextArticle ? 1 : 0.6,
            }}
            onClick={() =>
              nextArticle &&
              Taro.redirectTo({
                url: `/pages/PetArticleDetail/index?id=${nextArticle.id}`,
              })
            }
          >
            <Text className="text-[24rpx] text-[#333]">下一篇</Text>
          </View>
        </View>

        <View
          className="h-[88rpx] rounded-[44rpx] bg-[#FFD93B] border-[3rpx] border-solid border-[#262626] flex items-center justify-center"
          onClick={() => Taro.switchTab({ url: '/pages/PetKnowledge/index' })}
        >
          <Text className="text-[28rpx] font-semibold">返回知识库</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetArticleDetail;
