import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { GameStats } from '../../App';
import { useTranslation } from 'react-i18next';

interface Props {
  onSelectLevel: (level: number) => void;
  stats?: GameStats; // We might use this later to determine current level
}

const COLORS = {
  primary: '#06e073',
  bgDark: '#000000',
  surfaceDark: '#1a2e25',
};

export default function CareerPathScreen({ onSelectLevel, stats }: Props) {
  const { t, i18n } = useTranslation();

  const totalWords = stats?.totalWordsFound || 0;
  let currentLevel = 1;
  let currentRankName = 'ROOKIE';
  let nextRankName = 'WORD SMITH';
  let currentProgress = totalWords;
  let goal = 500;

  if (totalWords >= 1500) {
    currentLevel = 4;
    currentRankName = 'LEXICON LEGEND';
    nextRankName = 'MAX RANK';
    goal = 1500;
  } else if (totalWords >= 1000) {
    currentLevel = 3;
    currentRankName = 'PUZZLE MASTER';
    nextRankName = 'LEXICON LEGEND';
    goal = 1500;
    currentProgress = totalWords - 1000;
  } else if (totalWords >= 500) {
    currentLevel = 2;
    currentRankName = 'WORD SMITH';
    nextRankName = 'PUZZLE MASTER';
    goal = 1000;
    currentProgress = totalWords - 500;
  } else {
    currentLevel = 1;
    currentRankName = 'ROOKIE';
    nextRankName = 'WORD SMITH';
    goal = 500;
    currentProgress = totalWords;
  }

  const progressPercent = Math.min(
    100,
    (currentProgress / (goal - (currentLevel === 1 ? 0 : currentLevel === 2 ? 500 : 1000))) * 100
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between border-b border-white/20 bg-black px-4 py-3">
        <TouchableOpacity
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
          onPress={() => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}>
          <Text className="font-bold text-white">{i18n.language.toUpperCase()}</Text>
        </TouchableOpacity>

        <Text className="text-lg font-bold uppercase tracking-widest text-white">
          {t('careerPath.title')}
        </Text>

        <View className="flex-row items-center gap-1.5 rounded-full border border-white/10 bg-[#1a2e25] px-3 py-1.5">
          <MaterialIcons name="emoji-events" size={18} color={COLORS.primary} />
          <Text className="text-xs font-bold text-white">
            {t('careerPath.rank', { rank: currentLevel })}
          </Text>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100, paddingTop: 24 }}>
        <View className="w-full flex-col-reverse px-6">
          {/* Top Most Spacer */}
          <View className="ml-[25px] h-10 border-l-2 border-slate-300/20" />

          {/* Level 4: LEXICON LEGEND */}
          <View className="relative flex-row opacity-40">
            <View className="z-10 mr-6 flex-col items-center">
              <View className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-black bg-[#1a2e25]">
                <MaterialIcons name="lock" size={20} color="#94a3b8" />
              </View>
            </View>
            <View className="flex-1 justify-center pb-2">
              <View className="rounded-xl border border-white/5 bg-[#1a2e25]/40 p-4">
                <Text className="text-base font-bold text-slate-400">LEXICON LEGEND</Text>
              </View>
            </View>
          </View>

          {/* Connector Spacer */}
          <View className="ml-[25px] h-12 border-l-2 border-slate-300/30" />

          {/* Level 3: PUZZLE MASTER */}
          <View className="relative flex-row opacity-60">
            <View className="z-10 mr-6 flex-col items-center">
              <View className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-black bg-[#1a2e25]">
                <MaterialIcons name="lock" size={20} color="#94a3b8" />
              </View>
            </View>
            <View className="flex-1 justify-center pb-2">
              <View className="rounded-xl border border-white/5 bg-[#1a2e25]/40 p-4">
                <Text className="text-base font-bold text-slate-400">PUZZLE MASTER</Text>
              </View>
            </View>
          </View>

          {/* Connector Spacer */}
          <View className="ml-[25px] h-12 border-l-2 border-slate-300/30" />

          {/* Level 2: WORD SMITH */}
          <View className="relative flex-row opacity-90">
            <View className="z-10 mr-6 flex-col items-center">
              <View className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/20 bg-[#1a2e25]">
                <MaterialIcons name="lock" size={24} color="#94a3b8" />
              </View>
            </View>
            <View className="flex-1 pb-2">
              <View className="rounded-2xl border border-white/10 bg-[#1a2e25]/60 p-5">
                <Text className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t('careerPath.nextRank')}
                </Text>
                <Text className="text-lg font-bold text-slate-300">{nextRankName}</Text>
                <View className="mt-2 flex-row items-center gap-2 self-start rounded-lg bg-black/20 p-2">
                  <MaterialCommunityIcons name="target" size={18} color="#94a3b8" />
                  <Text className="text-xs font-medium text-slate-400">
                    {t('careerPath.goal', { count: goal })}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Connector Spacer */}
          <View className="ml-[25px] h-12 border-l-2 border-slate-300/30" />

          {/* Current Rank Node (Active) */}
          <View className="relative flex-row">
            {/* Timeline Line (Vertical) underneath */}
            <View className="absolute bottom-10 left-[25px] top-[-30px] -z-10 w-0.5 bg-[#06e073]" />

            <View className="z-10 mr-6 flex-col items-center">
              <View className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-black bg-[#06e073]">
                <MaterialIcons name="star" size={28} color="black" />
              </View>
            </View>

            <View className="flex-1 pb-10">
              <View className="overflow-hidden rounded-2xl border border-[#06e073] bg-[#1a2e25] p-5">
                <View className="mb-2 flex-row items-start justify-between">
                  <View>
                    <Text className="mb-1 text-xs font-bold uppercase tracking-wider text-[#06e073]">
                      {t('careerPath.currentRank')}
                    </Text>
                    <Text className="text-xl font-bold text-white">{currentRankName}</Text>
                  </View>
                  <MaterialIcons name="verified" size={24} color="#06e073" />
                </View>

                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-xs text-slate-400">{t('careerPath.wordsCollected')}</Text>
                  <Text className="text-xs font-bold text-white">
                    {totalWords}/{goal}
                  </Text>
                </View>

                <View className="mb-4 h-3 w-full overflow-hidden rounded-full bg-black/40">
                  <View className="h-full bg-[#06e073]" style={{ width: `${progressPercent}%` }} />
                </View>

                <TouchableOpacity
                  className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#06e073] py-3"
                  onPress={() => onSelectLevel(currentLevel)}>
                  <MaterialIcons name="play-arrow" size={20} color="black" />
                  <Text className="text-sm font-bold text-black">
                    {t('careerPath.continueJourney')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Bottom (Global stats) */}
      <View className="absolute bottom-0 z-20 w-full bg-black/80 px-6 pb-6 pt-12">
        <View className="flex-row items-center justify-between rounded-2xl border border-white/10 bg-[#1a2e25] p-4">
          <View className="flex-row items-center gap-3">
            <View className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06e073]/20">
              <MaterialIcons name="leaderboard" size={20} color="#06e073" />
            </View>
            <View>
              <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('careerPath.globalRank')}
              </Text>
              <Text className="text-sm font-bold text-white">Top 15%</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text className="text-[10px] font-bold uppercase tracking-wider text-[#06e073]">
              {t('careerPath.viewLeaderboard')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
