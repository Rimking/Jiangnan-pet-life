import BasicLayout from '@/layout/basicLayout';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import { memo, useState } from 'react';
import Taro from '@tarojs/taro';
import { theme, gradients, shadows, borderRadius, typography } from '@/styles/theme';

const PetKnowledge = memo(function PetKnowledge() {
  const [searchText, setSearchText] = useState('');

  const categories = [
    { id: '1', name: '喂养知识', icon: '🍖', count: 24, color: '#FF6B6B' },
    { id: '2', name: '健康护理', icon: '🏥', count: 18, color: '#4ECDC4' },
    { id: '3', name: '行为训练', icon: '🎾', count: 15, color: '#FFE66D' },
    { id: '4', name: '品种百科', icon: '📚', count: 32, color: '#45B7D1' },
    { id: '5', name: '心理沟通', icon: '💬', count: 12, color: '#96CEB4' },
    { id: '6', name: '应急处理', icon: '🚑', count: 8, color: '#FF6F61' },
  ];

  const hotArticles = [
    { id: '1', title: '狗狗每天需要喝多少水？', category: '喂养知识', views: 2345, emoji: '💧' },
    { id: '2', title: '猫咪掉毛严重怎么办？', category: '健康护理', views: 1892, emoji: '🐱' },
    { id: '3', title: '如何训练狗狗坐下？', category: '行为训练', views: 1654, emoji: '🐶' },
    { id: '4', title: '新手养狗必看指南', category: '喂养知识', views: 3210, emoji: '📖' },
  ];

  const aiFeatures = [
    { title: 'AI 养宠顾问', description: '7×24小时在线解答', icon: '🤖' },
    { title: '智能问答', description: '快速获取专业解答', icon: '💡' },
  ];

  const handleCategoryClick = (category: any) => {
    Taro.showToast({ title: `进入${category.name}`, icon: 'none' });
  };

  const handleArticleClick = (article: any) => {
    Taro.navigateTo({ url: '/pages/KnowledgeDetail/index' });
  };

  const handleAIConversation = () => {
    Taro.navigateTo({ url: '/pages/AIConversation/index' });
  };

  return (
    <BasicLayout
      navOptions={{
        navTitle: '知识库',
        needBack: false,
      }}
    >
      <ScrollView
        style={{
          paddingTop: '96px',
          paddingBottom: '140px',
          height: '100vh',
        }}
        scrollY
      >
        {/* 搜索框 */}
        <View
          className="mx-6 mb-6"
          style={{
            background: theme.background.card,
            borderRadius: borderRadius.full,
            padding: '12px 20px',
            boxShadow: shadows.soft,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: '20px', marginRight: '12px' }}>🔍</Text>
          <Input
            style={{
              flex: 1,
              fontSize: typography.fontSize.md,
              color: theme.text.primary,
            }}
            placeholder="搜索养宠知识..."
            placeholderTextColor={theme.text.tertiary}
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>

        {/* AI 顾问 */}
        <View
          className="mx-6 mb-6"
          style={{
            background: gradients.primary,
            borderRadius: borderRadius.xl,
            padding: '24px',
            boxShadow: shadows.card,
          }}
          onClick={handleAIConversation}
        >
          <View className="flex items-center justify-between">
            <View>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: '#FFFFFF',
                  marginBottom: '8px',
                }}
              >
                AI 养宠顾问
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                有问题？问问AI小助手
              </Text>
            </View>
            <Text style={{ fontSize: '48px' }}>🤖</Text>
          </View>
        </View>

        {/* 分类入口 */}
        <View className="mx-6 mb-6">
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: theme.text.primary,
              marginBottom: '16px',
            }}
          >
            知识分类
          </Text>
          <View
            className="grid grid-cols-3 gap-4"
          >
            {categories.map((category) => (
              <View
                key={category.id}
                style={{
                  background: theme.background.card,
                  borderRadius: borderRadius.lg,
                  padding: '20px 12px',
                  boxShadow: shadows.soft,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
                onClick={() => handleCategoryClick(category)}
              >
                <Text
                  style={{
                    fontSize: '36px',
                    marginBottom: '12px',
                  }}
                >
                  {category.icon}
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: theme.text.primary,
                    marginBottom: '4px',
                    textAlign: 'center',
                  }}
                >
                  {category.name}
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: theme.text.tertiary,
                  }}
                >
                  {category.count} 篇
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 热门文章 */}
        <View className="mx-6 mb-6">
          <View className="flex items-center justify-between mb-4">
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: theme.text.primary,
              }}
            >
              🔥 热门文章
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: theme.primary.main,
              }}
            >
              查看更多 ›
            </Text>
          </View>

          {hotArticles.map((article) => (
            <View
              key={article.id}
              style={{
                background: theme.background.card,
                borderRadius: borderRadius.lg,
                padding: '16px',
                boxShadow: shadows.soft,
                marginBottom: '12px',
              }}
              onClick={() => handleArticleClick(article)}
            >
              <View className="flex items-start">
                <Text
                  style={{
                    fontSize: '32px',
                    marginRight: '12px',
                    marginTop: '2px',
                  }}
                >
                  {article.emoji}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.md,
                      fontWeight: typography.fontWeight.medium,
                      color: theme.text.primary,
                      marginBottom: '8px',
                    }}
                  >
                    {article.title}
                  </Text>
                  <View className="flex items-center">
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: theme.primary.main,
                        background: `${theme.primary.main}10`,
                        padding: '4px 12px',
                        borderRadius: borderRadius.full,
                        marginRight: '12px',
                      }}
                    >
                      {article.category}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: theme.text.tertiary,
                      }}
                    >
                      👁 {article.views}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: '20px',
                    color: theme.text.tertiary,
                    marginLeft: '8px',
                  }}
                >
                  ›
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </BasicLayout>
  );
});

export default PetKnowledge;
