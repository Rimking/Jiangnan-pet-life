import BasicLayout from '@/layout/basicLayout';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import { memo, useState } from 'react';
import Taro from '@tarojs/taro';
import { borderRadius, gradients, shadows, theme, typography } from '@/styles/theme';

const PetKnowledge = memo(function PetKnowledge() {
  const [searchText, setSearchText] = useState('');

  const categories = [
    { id: '1', name: '喂养知识', icon: '🍖', count: 24 },
    { id: '2', name: '健康护理', icon: '🩺', count: 18 },
    { id: '3', name: '行为训练', icon: '🎯', count: 15 },
    { id: '4', name: '品种百科', icon: '📚', count: 32 },
    { id: '5', name: '心理沟通', icon: '💬', count: 12 },
    { id: '6', name: '应急处理', icon: '🚨', count: 8 },
  ];

  const hotArticles = [
    { id: '1', title: '狗狗每天需要喝多少水？', category: '喂养知识', views: 2345, emoji: '💧' },
    { id: '2', title: '猫咪掉毛严重怎么办？', category: '健康护理', views: 1892, emoji: '🐱' },
    { id: '3', title: '如何训练狗狗坐下？', category: '行为训练', views: 1654, emoji: '🐶' },
    { id: '4', title: '新手养宠避坑指南', category: '喂养知识', views: 3210, emoji: '📌' },
  ];

  return (
    <BasicLayout navOptions={{ navTitle: '知识库', needBack: false }}>
      <ScrollView style={{ paddingTop: '96px', paddingBottom: '140px', height: '100vh' }} scrollY>
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
          <Text style={{ fontSize: '20px', marginRight: '12px' }}>🔎</Text>
          <Input
            style={{ flex: 1, fontSize: typography.fontSize.md, color: theme.text.primary }}
            placeholder="搜索养宠知识..."
            placeholderTextColor={theme.text.tertiary}
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>

        <View
          className="mx-6 mb-6"
          style={{ background: gradients.primary, borderRadius: borderRadius.xl, padding: '24px', boxShadow: shadows.card }}
          onClick={() => Taro.navigateTo({ url: '/pages/AIConversation/index' })}
        >
          <Text style={{ fontSize: typography.fontSize.lg, color: '#fff' }}>AI 养宠顾问</Text>
          <Text style={{ fontSize: typography.fontSize.sm, color: 'rgba(255,255,255,0.9)' }}>有问题就问 AI</Text>
        </View>

        <View className="mx-6 mb-6">
          <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: theme.text.primary, marginBottom: '16px' }}>
            知识分类
          </Text>
          <View className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <View
                key={category.id}
                style={{ background: theme.background.card, borderRadius: borderRadius.large, padding: '20px 12px', boxShadow: shadows.soft, alignItems: 'center' }}
              >
                <Text style={{ fontSize: '36px', marginBottom: '12px' }}>{category.icon}</Text>
                <Text style={{ fontSize: typography.fontSize.sm, color: theme.text.primary }}>{category.name}</Text>
                <Text style={{ fontSize: typography.fontSize.xs, color: theme.text.tertiary }}>{category.count} 篇</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mx-6 mb-6">
          <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: theme.text.primary, marginBottom: '12px' }}>
            热门文章
          </Text>
          {hotArticles.map((article) => (
            <View
              key={article.id}
              style={{ background: theme.background.card, borderRadius: borderRadius.large, padding: '16px', boxShadow: shadows.soft, marginBottom: '12px' }}
              onClick={() => Taro.navigateTo({ url: '/pages/KnowledgeDetail/index' })}
            >
              <Text>{article.emoji} {article.title}</Text>
              <Text style={{ fontSize: typography.fontSize.xs, color: theme.text.tertiary }}>
                {article.category} · {article.views} 阅读
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </BasicLayout>
  );
});

export default PetKnowledge;
