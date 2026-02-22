import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { GameStats } from '../../App';
import { useTranslation } from 'react-i18next';

interface Props {
  stats: GameStats;
  onPlayAgain: () => void;
}

const COLORS = {
  primary: '#0bda73',
  orange400: '#fb923c',
  blue400: '#60a5fa',
  purple400: '#c084fc',
  yellow400: '#facc15',
};

export default function GameOverScreen({ stats, onPlayAgain }: Props) {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 px-5 pb-5 pt-10">
        {/* Header Section */}
        <View className="mb-7 items-center">
          <MaterialIcons name="timer-off" size={60} color={COLORS.primary} className="mb-2.5" />
          <Text
            className="text-4xl font-bold tracking-widest text-white"
            style={{
              textShadowColor: 'rgba(11,218,115,0.4)',
              textShadowRadius: 15,
              textShadowOffset: { width: 0, height: 0 },
            }}>
            {t('gameOver.timesUp')}
          </Text>
          <Text className="mt-1 text-sm font-semibold uppercase tracking-widest text-slate-400">
            {t('gameOver.levelComplete')}
          </Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Main Stats Card */}
          <View className="mb-5 overflow-hidden rounded-2xl border border-white/5 bg-[#1a2c24]">
            <View className="items-center border-b border-white/5 bg-[#1e3228]/50 py-6">
              <Text className="text-[48px] font-bold text-[#0bda73]">{stats.totalWordsFound}</Text>
              <Text className="mt-1 text-xs font-bold tracking-widest text-slate-400">
                {t('gameOver.totalWordsFound')}
              </Text>
            </View>
            <View className="flex-row">
              <View className="flex-1 items-center justify-center py-5">
                <View className="mb-1 flex-row items-center gap-1.5">
                  <MaterialIcons name="local-fire-department" size={18} color={COLORS.orange400} />
                  <Text className="text-[11px] font-bold tracking-wide text-slate-400">
                    {t('gameOver.bestStreak')}
                  </Text>
                </View>
                <Text className="text-2xl font-bold text-white">{stats.maxStreak}</Text>
              </View>
              <View className="w-[1px] bg-white/5" />
              <View className="flex-1 items-center justify-center py-5">
                <View className="mb-1 flex-row items-center gap-1.5">
                  <MaterialIcons name="star" size={18} color={COLORS.blue400} />
                  <Text className="text-[11px] font-bold tracking-wide text-slate-400">
                    {t('gameOver.maxReach')}
                  </Text>
                </View>
                <Text className="text-2xl font-bold text-white">
                  {stats.maxLetters}{' '}
                  <Text className="text-sm font-normal text-slate-400">
                    {t('gameOver.letters')}
                  </Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Rewards Section (Mocked for visual match) */}
          <View className="mb-5 flex-row gap-4">
            <View className="flex-1 items-center rounded-2xl border border-white/5 bg-[#1a2c24] p-5">
              <View
                className="mb-2.5 h-10 w-10 items-center justify-center rounded-[20px] border"
                style={{
                  backgroundColor: 'rgba(192,132,252,0.2)',
                  borderColor: 'rgba(192,132,252,0.3)',
                }}>
                <MaterialIcons name="bolt" size={24} color={COLORS.purple400} />
              </View>
              <Text className="text-xl font-bold text-white">+150 XP</Text>
              <Text className="mt-1 text-[10px] font-bold tracking-wide text-slate-400">
                {t('gameOver.levelUp')}
              </Text>
            </View>
            <View className="flex-1 items-center rounded-2xl border border-white/5 bg-[#1a2c24] p-5">
              <View
                className="mb-2.5 h-10 w-10 items-center justify-center rounded-[20px] border"
                style={{
                  backgroundColor: 'rgba(250,204,21,0.2)',
                  borderColor: 'rgba(250,204,21,0.3)',
                }}>
                <MaterialIcons name="monetization-on" size={24} color={COLORS.yellow400} />
              </View>
              <Text className="text-xl font-bold text-white">+50</Text>
              <Text className="mt-1 text-[10px] font-bold tracking-wide text-slate-400">
                {t('gameOver.coinsEarned')}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View className="mt-auto pt-2.5">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-xl bg-[#0bda73] py-4"
            onPress={onPlayAgain}
            activeOpacity={0.8}>
            <MaterialIcons name="replay" size={24} color="black" className="mr-2" />
            <Text className="text-lg font-bold tracking-wide text-black">
              {t('gameOver.playAgain')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
