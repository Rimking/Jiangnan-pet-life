import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { memo, useState } from 'react';
import { PET_UI } from '@/constants/petUi';
import { getReportData, ReportData } from '@/api/data';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

const PetReport = memo(function PetReport() {
  const { params } = useRouter();
  const initialPetId = params.petId || '';
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const loggedIn = isLoggedIn();

  const loadData = (petId?: string) => {
    setLoading(true);
    getReportData(petId)
      .then((res) => setReport(res))
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  };

  useDidShow(() => {
    loadData(initialPetId || undefined);
  });

  const expenseList = Object.entries(report?.expenseByCategory || {}).sort((a, b) => b[1] - a[1]);
  const careList = Object.entries(report?.careByCategory || {}).sort((a, b) => b[1] - a[1]);

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
      navOptions={{ navTitle: '宠物报告', needBack: true }}
    >
      <View className="px-6 pt-4 pb-[110rpx]">
        <View className="mb-4 flex gap-2 flex-wrap">
          {(report?.petOptions || []).map((pet) => (
            <View
              key={pet.petId}
              className="px-4 py-2 rounded-[16rpx]"
              style={{
                backgroundColor: pet.active ? '#FFD93B' : '#f4f4f4',
                border: '2rpx solid #262626',
              }}
              onClick={() => {
                loadData(pet.petId);
                Taro.redirectTo({ url: `/pages/PetReport/index?petId=${pet.petId}` });
              }}
            >
              <Text className="text-[24rpx]">{pet.petName}</Text>
            </View>
          ))}
        </View>

        {!loggedIn ? (
          <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[30rpx] font-semibold text-[#2c2c2c] block">登录后查看专属宠物报告</Text>
            <Text className="text-[22rpx] text-[#666] mt-[10rpx] block leading-[1.7]">
              花销、护理、提醒和日常记录会汇总成阶段报告，方便你回顾最近的照护情况。
            </Text>
            <View
              className="mt-[20rpx] inline-flex px-[24rpx] py-[14rpx] rounded-[999rpx] bg-[#FFD93B]"
              style={{ border: '2rpx solid #262626' }}
              onClick={() => ensureLoggedIn('/pages/PetReport/index')}
            >
              <Text className="text-[24rpx] text-[#2c2c2c]">去微信登录</Text>
            </View>
          </View>
        ) : null}

        {loggedIn && !loading && !report?.petOptions?.length ? (
          <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[30rpx] font-semibold text-[#2c2c2c] block">还没有宠物档案</Text>
            <Text className="text-[22rpx] text-[#666] mt-[10rpx] block leading-[1.7]">
              先添加一只宠物，后面这里会自动生成属于它的报告和阶段总结。
            </Text>
            <View
              className="mt-[20rpx] inline-flex px-[24rpx] py-[14rpx] rounded-[999rpx] bg-[#FFD93B]"
              style={{ border: '2rpx solid #262626' }}
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index' })}
            >
              <Text className="text-[24rpx] text-[#2c2c2c]">去添加宠物</Text>
            </View>
          </View>
        ) : null}

        <View className="rounded-[28rpx] bg-[#FFF7D5] px-5 py-6 mb-5 shadow-[0_16rpx_34rpx_rgba(230,193,82,0.18)]">
          <Text className="text-[34rpx] font-semibold text-[#5D4510] block">
            {report?.activePet?.name || '当前宠物'}的数据小结
          </Text>
          <Text className="text-[22rpx] text-[#7D6532] leading-[1.7] mt-[10rpx] block">
            {loading
              ? '正在整理报告...'
              : `一起生活 ${report?.summary.activeDays || 0} 天，累计记录花销 ¥${Number(report?.summary.totalExpense || 0).toFixed(2)}。`}
          </Text>
        </View>

        <View className="grid grid-cols-2 gap-3 mb-5">
          <View className="rounded-[22rpx] bg-white p-5 shadow-[0_14rpx_26rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[22rpx] text-[#777]">最近 30 天花销</Text>
            <Text className="text-[40rpx] font-semibold text-[#2c2c2c] mt-[8rpx] block">
              ¥{Number(report?.summary.recentExpense || 0).toFixed(2)}
            </Text>
          </View>
          <View className="rounded-[22rpx] bg-white p-5 shadow-[0_14rpx_26rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[22rpx] text-[#777]">待处理提醒</Text>
            <Text className="text-[40rpx] font-semibold text-[#2c2c2c] mt-[8rpx] block">
              {report?.summary.pendingSchedules || 0}
            </Text>
          </View>
          <View className="rounded-[22rpx] bg-white p-5 shadow-[0_14rpx_26rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[22rpx] text-[#777]">护理记录</Text>
            <Text className="text-[40rpx] font-semibold text-[#2c2c2c] mt-[8rpx] block">
              {report?.summary.totalCareRecords || 0}
            </Text>
          </View>
          <View className="rounded-[22rpx] bg-white p-5 shadow-[0_14rpx_26rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[22rpx] text-[#777]">日常记录</Text>
            <Text className="text-[40rpx] font-semibold text-[#2c2c2c] mt-[8rpx] block">
              {report?.summary.totalRecords || 0}
            </Text>
          </View>
          <View className="rounded-[22rpx] bg-white p-5 shadow-[0_14rpx_26rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[22rpx] text-[#777]">食物档案</Text>
            <Text className="text-[40rpx] font-semibold text-[#2c2c2c] mt-[8rpx] block">
              {report?.summary.totalFoods || 0}
            </Text>
          </View>
          <View className="rounded-[22rpx] bg-white p-5 shadow-[0_14rpx_26rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[22rpx] text-[#777]">用药档案</Text>
            <Text className="text-[40rpx] font-semibold text-[#2c2c2c] mt-[8rpx] block">
              {report?.summary.totalMedicines || 0}
            </Text>
          </View>
          <View className="rounded-[22rpx] bg-white p-5 shadow-[0_14rpx_26rpx_rgba(0,0,0,0.06)] col-span-2">
            <Text className="text-[22rpx] text-[#777]">成长里程碑</Text>
            <Text className="text-[40rpx] font-semibold text-[#2c2c2c] mt-[8rpx] block">
              {report?.summary.totalMilestones || 0}
            </Text>
          </View>
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">最近 30 天</Text>
          <View className="grid grid-cols-2 gap-3">
            <View className="rounded-[18rpx] bg-[#EEF4FF] p-4">
              <Text className="text-[22rpx] text-[#6a7ca8]">提醒</Text>
              <Text className="text-[34rpx] font-semibold text-[#2c2c2c] mt-[6rpx]">
                {report?.recent30Days.schedules || 0}
              </Text>
            </View>
            <View className="rounded-[18rpx] bg-[#FFF7E5] p-4">
              <Text className="text-[22rpx] text-[#8a6a2c]">花销</Text>
              <Text className="text-[34rpx] font-semibold text-[#2c2c2c] mt-[6rpx]">
                {report?.recent30Days.expenses || 0}
              </Text>
            </View>
            <View className="rounded-[18rpx] bg-[#F5F0FF] p-4">
              <Text className="text-[22rpx] text-[#7a61a7]">护理</Text>
              <Text className="text-[34rpx] font-semibold text-[#2c2c2c] mt-[6rpx]">
                {report?.recent30Days.careRecords || 0}
              </Text>
            </View>
            <View className="rounded-[18rpx] bg-[#EFFAF4] p-4">
              <Text className="text-[22rpx] text-[#56836a]">日常</Text>
              <Text className="text-[34rpx] font-semibold text-[#2c2c2c] mt-[6rpx]">
                {report?.recent30Days.records || 0}
              </Text>
            </View>
            <View className="rounded-[18rpx] bg-[#FFF0F6] p-4 col-span-2">
              <Text className="text-[22rpx] text-[#8A5374]">里程碑</Text>
              <Text className="text-[34rpx] font-semibold text-[#2c2c2c] mt-[6rpx]">
                {report?.recent30Days.milestones || 0}
              </Text>
            </View>
          </View>
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">亮点总结</Text>
          {(report?.highlights || []).map((item) => (
            <View key={item} className="rounded-[16rpx] bg-[#FFF9E8] p-4 mb-3">
              <Text className="text-[22rpx] text-[#6f5a2b] leading-[1.7]">{item}</Text>
            </View>
          ))}
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">近 7 天趋势</Text>
          {(report?.recent7Days || []).length ? (
            (report?.recent7Days || []).map((item) => (
              <View key={item.date} className="rounded-[18rpx] bg-[#FFF9E8] p-4 mb-3">
                <View className="flex items-center justify-between">
                  <Text className="text-[22rpx] text-[#53411c]">{item.label}</Text>
                  <Text className="text-[20rpx] text-[#8a7442]">花销 ¥{Number(item.expense || 0).toFixed(2)}</Text>
                </View>
                <Text className="text-[20rpx] text-[#766238] mt-[6rpx] block">
                  日常 {item.recordCount} 条 · 护理 {item.careCount} 条
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">最近 7 天还没有可统计的趋势数据</Text>
          )}
        </View>

        <View className="rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">花销构成</Text>
          <Text className="text-[22rpx] text-[#666] mb-4 block">
            当前最高频花销分类：{report?.topExpenseCategory || '未分类'}
          </Text>
          {expenseList.length ? (
            expenseList.map(([name, amount]) => (
              <View key={name} className="mb-3">
                <View className="flex items-center justify-between mb-[6rpx]">
                  <Text className="text-[22rpx] text-[#444]">{name}</Text>
                  <Text className="text-[22rpx] text-[#777]">¥{Number(amount).toFixed(2)}</Text>
                </View>
                <View className="h-[14rpx] rounded-[999rpx] bg-[#F4F4F4] overflow-hidden">
                  <View
                    className="h-full rounded-[999rpx] bg-[#FFC58A]"
                    style={{
                      width: `${Math.min(
                        (Number(amount) /
                          Math.max(...expenseList.map(([, value]) => Number(value)), 1)) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </View>
              </View>
            ))
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">当前还没有花销数据</Text>
          )}
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mt-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">护理分布</Text>
          {careList.length ? (
            careList.map(([name, count]) => (
              <View key={name} className="flex items-center justify-between py-[10rpx] border-b border-[#efefef] last:border-b-0">
                <Text className="text-[22rpx] text-[#444]">{name}</Text>
                <Text className="text-[22rpx] text-[#777]">{count} 次</Text>
              </View>
            ))
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">当前还没有护理分类数据</Text>
          )}
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mt-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">最近动态</Text>
          {(report?.recentMoments || []).length ? (
            (report?.recentMoments || []).map((item) => (
              <View key={item.id} className="rounded-[16rpx] bg-[#F8FAFF] p-4 mb-3">
                <View className="flex items-center justify-between">
                  <Text className="text-[22rpx] text-[#333]">{item.title}</Text>
                  <Text className="text-[18rpx] text-[#8a8a8a]">
                    {item.type === 'milestone' ? '里程碑' : item.type}
                  </Text>
                </View>
                <Text className="text-[20rpx] text-[#7b7b7b] mt-[6rpx] block">
                  {item.date.slice(0, 10)}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">最近还没有新的动态</Text>
          )}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetReport;
