import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TimeMode } from '../utils/gameLogic';

interface Props {
  onStart: (time: TimeMode) => void;
}

export default function PreGameScreen({ onStart }: Props) {
  const { t, i18n } = useTranslation();
  const [selectedTime, setSelectedTime] = React.useState<TimeMode>(60);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr');
  };

  const timeOptions = [
    {
      value: 30,
      title: t('preGame.blitz'),
      desc: t('preGame.blitzDesc'),
    },
    {
      value: 60,
      title: t('preGame.classic'),
      desc: t('preGame.classicDesc'),
    },
    {
      value: 120,
      title: t('preGame.marathon'),
      desc: t('preGame.marathonDesc'),
    },
  ];

  return (
    <View className="flex-1 bg-black">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full bg-[#121212]"
          onPress={toggleLanguage}>
          <Text className="font-bold text-[#00e677]">{i18n.language.toUpperCase()}</Text>
        </TouchableOpacity>
        <Text className="text-base font-bold tracking-widest text-white">
          {t('preGame.selectDuration')}
        </Text>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#121212]" />
      </View>

      <View className="flex-1 px-5 pb-10 pt-5">
        {/* Hero Text */}
        <View className="mb-10 items-center">
          <Text className="mb-2 text-3xl font-bold text-white">{t('preGame.chooseYourPace')}</Text>
          <Text className="text-sm text-slate-400">{t('preGame.timeLimitDesc')}</Text>
        </View>

        {/* Cards Container */}
        <View className="flex-1 gap-4">
          {timeOptions.map((opt) => {
            const isSelected = selectedTime === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                className={`flex-row items-center justify-between rounded-2xl border-2 bg-[#121212] p-5 ${
                  isSelected ? 'border-[#00e677]' : 'border-transparent'
                }`}
                onPress={() => setSelectedTime(opt.value as TimeMode)}
                activeOpacity={0.8}>
                <View className="flex-row items-center gap-4">
                  <View
                    className={`h-12 w-12 items-center justify-center rounded-xl ${
                      isSelected ? 'bg-[#00e677]' : 'bg-black'
                    }`}>
                    <Text
                      className={`text-lg font-bold ${isSelected ? 'text-black' : 'text-slate-400'}`}>
                      {opt.value}s
                    </Text>
                  </View>
                  <View className="flex-col">
                    <Text
                      className={`text-base font-bold uppercase tracking-widest ${isSelected ? 'text-[#00e677]' : 'text-white'}`}>
                      {opt.title}
                    </Text>
                    <Text className="mt-0.5 text-[13px] text-slate-400">{opt.desc}</Text>
                  </View>
                </View>

                {/* Radio Circle */}
                {isSelected ? (
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-[#00e677]">
                    <MaterialIcons name="check" size={16} color="black" />
                  </View>
                ) : (
                  <View className="h-6 w-6 rounded-full border-2 border-slate-700" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom Action */}
        <View className="mt-auto pt-5">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-xl bg-[#00e677] py-4"
            onPress={() => onStart(selectedTime)}
            activeOpacity={0.8}>
            <Text className="text-lg font-bold tracking-widest text-black">
              {t('preGame.startGame')}
            </Text>
            <MaterialIcons name="play-arrow" size={24} color="black" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
