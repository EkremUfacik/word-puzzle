import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface Props {
  isVisible: boolean;
  onCancel: () => void;
  onQuit: () => void;
}

export default function QuitModal({ isVisible, onCancel, onQuit }: Props) {
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center bg-black/80 px-5">
      <View className="w-full items-center rounded-3xl border border-white/10 bg-[#1a1a1a] p-8">
        <MaterialIcons name="exit-to-app" size={64} color="#ef4444" className="mb-4" />
        <Text className="mb-2 text-center text-2xl font-bold text-white">
          {t('gameplay.quitTitle', 'Oyundan Çık')}
        </Text>
        <Text className="mb-8 text-center text-base text-slate-400">
          {t(
            'gameplay.quitMessage',
            'Gerçekten çıkmak istiyor musun? Mevcut ilerlemen ve puanın silinecek.'
          )}
        </Text>

        <View className="w-full flex-row gap-4">
          <TouchableOpacity
            className="flex-1 items-center rounded-xl bg-white/10 py-4"
            onPress={onCancel}>
            <Text className="text-base font-bold text-white">{t('common.cancel', 'İptal')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 items-center rounded-xl bg-red-500 py-4"
            onPress={onQuit}>
            <Text className="text-base font-bold text-white">{t('common.quit', 'Çık')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
