import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { TimeMode, Question, getQuestion, generateLetterBank } from '../utils/gameLogic';
import { useTranslation } from 'react-i18next';
import QuitModal from '../components/QuitModal';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  timeMode: TimeMode;
  level: number;
  onGameOver: (stats: {
    score: number;
    maxStreak: number;
    maxLetters: number;
    totalWordsFound: number;
  }) => void;
  onQuit: () => void;
}

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#00e673', // Neon Teal
  secondary: '#FF9100', // Energetic Orange
};

const LetterTile = ({
  char,
  index,
  isDisabled,
  isBombed,
  bombAnim,
  onPress,
  size,
}: {
  char: string;
  index: number;
  isDisabled: boolean;
  isBombed: boolean;
  bombAnim: any;
  onPress: (char: string, index: number) => void;
  size: number;
}) => {
  const animatedContainerStyle = useAnimatedStyle(() => {
    if (!isBombed || bombAnim.value === 0) {
      return {
        transform: [{ scale: 1 }, { rotate: '0deg' }],
      };
    }

    const scale = 1 + bombAnim.value * 0.2;
    const rotate = `${Math.sin(bombAnim.value * Math.PI * 6) * 15}deg`;

    return {
      transform: [{ scale }, { rotate }],
    };
  });

  const animatedOverlayStyle = useAnimatedStyle(() => {
    if (!isBombed || bombAnim.value === 0) return { opacity: 0 };
    return {
      opacity: bombAnim.value * 0.5,
      backgroundColor: '#ef4444', // red-500
    };
  });

  return (
    <Animated.View style={[{ width: size, aspectRatio: 1 }, animatedContainerStyle]}>
      <TouchableOpacity
        className={`h-full w-full items-center justify-center overflow-hidden rounded-lg border ${
          isDisabled ? 'border-white/5 bg-zinc-800/30' : 'border-white/10 bg-[#1E1E1E]'
        }`}
        onPress={() => onPress(char, index)}
        disabled={isDisabled}>
        <Animated.View
          style={[
            { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
            animatedOverlayStyle,
          ]}
        />
        <Text
          className={`mb-0.5 text-lg font-bold ${isDisabled ? 'text-white/20' : 'text-white'}`}
          style={{ includeFontPadding: false, zIndex: 10 }}>
          {char}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function GameplayScreen({ timeMode, level, onGameOver, onQuit }: Props) {
  const { t, i18n } = useTranslation();
  // Game Stats
  const [timeLeft, setTimeLeft] = useState<number>(timeMode);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [totalWordsFound, setTotalWordsFound] = useState<number>(0);

  // Current Level State
  const [currentLength, setCurrentLength] = useState<number>(4);
  const [maxLetters, setMaxLetters] = useState<number>(4);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Board State
  const [letterBank, setLetterBank] = useState<string[]>([]);
  const [disabledBankIndices, setDisabledBankIndices] = useState<number[]>([]);
  const [bombedIndices, setBombedIndices] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState<{ char: string; index: number }[]>([]);

  // Animation state
  const successScale = useSharedValue(1);
  const successColor = useSharedValue(0); // 0 to 1 for color transition
  const bombAnim = useSharedValue(0);

  // Pause & Modal States
  const [isPaused, setIsPaused] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);

  useEffect(() => {
    loadNextQuestion(currentLength);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onGameOver({ score, maxStreak, maxLetters, totalWordsFound });
      return;
    }
    if (isPaused || showQuitModal) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaused, showQuitModal, onGameOver]);

  const loadNextQuestion = useCallback(
    (length: number) => {
      // Ensure animations are reset when loading a new level/question
      successScale.value = 1;
      successColor.value = 0;

      const lang = i18n.language as 'tr' | 'en';
      const q = getQuestion(lang, length, level);
      setCurrentQuestion(q);

      const bank = generateLetterBank(q.word, lang);

      setLetterBank(bank);
      setDisabledBankIndices([]);
      setBombedIndices([]);
      setUserAnswer(Array(q.word.length).fill({ char: '', index: -1 }));
    },
    [i18n.language, successScale, successColor, level]
  );

  const handleLetterPress = (char: string, bankIndex: number) => {
    if (disabledBankIndices.includes(bankIndex)) return;
    const firstEmptyIndex = userAnswer.findIndex((slot) => slot.char === '');
    if (firstEmptyIndex !== -1) {
      const newAnswer = [...userAnswer];
      newAnswer[firstEmptyIndex] = { char, index: bankIndex };
      setUserAnswer(newAnswer);
      setDisabledBankIndices((prev) => [...prev, bankIndex]);

      if (firstEmptyIndex === userAnswer.length - 1 && currentQuestion) {
        checkAnswer(newAnswer, currentQuestion.word);
      }
    }
  };

  const handleAnswerSlotPress = (slotIndex: number) => {
    const slot = userAnswer[slotIndex];
    if (slot.char !== '') {
      setDisabledBankIndices((prev) => prev.filter((i) => i !== slot.index));
      const newAnswer = [...userAnswer];
      newAnswer[slotIndex] = { char: '', index: -1 };
      setUserAnswer(newAnswer);
    }
  };

  const checkAnswer = (
    answerSlots: { char: string; index: number }[],
    targetWord: string,
    isSkipped: boolean = false
  ) => {
    const currentStr = answerSlots.map((s) => s.char).join('');
    if (currentStr === targetWord) {
      // Trigger success animation
      successScale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
      successColor.value = withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(0, { duration: 300 })
      );

      let newLength = currentLength;

      if (!isSkipped) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        setMaxStreak(Math.max(maxStreak, newStreak));

        const newTotalWordsFound = totalWordsFound + 1;
        setTotalWordsFound(newTotalWordsFound);

        // Advance to next letter length every 5 words found, regardless of streak
        if (newTotalWordsFound % 5 === 0) {
          newLength++;
          setCurrentLength(newLength);
          setMaxLetters(Math.max(maxLetters, newLength));
        }

        setScore((prev) => prev + 10 * newLength);
        setTimeLeft((prev) => prev + 2);
      }

      // Delay loading next question to allow animation to finish
      setTimeout(() => {
        loadNextQuestion(newLength);
      }, 600);
    } else {
      setStreak(0);
      setDisabledBankIndices([]);
      setUserAnswer(Array(targetWord.length).fill({ char: '', index: -1 }));
    }
  };

  const handleHintPress = () => {
    if (!currentQuestion) return;
    setTimeLeft((prev) => Math.max(prev - 2, 0));

    let distractorsFound = 0;
    const newDisabled = [...disabledBankIndices];
    const newBombed: number[] = [];
    const neededLetters = currentQuestion.word.split('');
    userAnswer.forEach((slot) => {
      if (slot.char) {
        const idx = neededLetters.indexOf(slot.char);
        if (idx !== -1) neededLetters.splice(idx, 1);
      }
    });

    for (let i = 0; i < letterBank.length && distractorsFound < 5; i++) {
      if (!newDisabled.includes(i)) {
        const char = letterBank[i];
        const neededIdx = neededLetters.indexOf(char);
        if (neededIdx === -1) {
          newDisabled.push(i);
          newBombed.push(i);
          distractorsFound++;
        } else {
          neededLetters.splice(neededIdx, 1);
        }
      }
    }
    setDisabledBankIndices(newDisabled);
    setBombedIndices(newBombed);

    // Trigger bomb animation
    bombAnim.value = withSequence(
      withTiming(1, { duration: 250 }),
      withTiming(0, { duration: 350 })
    );
  };

  const handleSkipPress = () => {
    if (!currentQuestion) return;
    setStreak(0); // Reset streak

    // Auto-fill the entire word
    const targetWord = currentQuestion.word;
    const newAnswer = targetWord.split('').map((char) => ({ char, index: -1 }));
    setUserAnswer(newAnswer);

    // Call checkAnswer with isSkipped=true to trigger success animation without score/time bonus
    checkAnswer(newAnswer, targetWord, true);
  };

  const timerPercentage = Math.max(0, (timeLeft / timeMode) * 100);

  const animatedSlotStyle = useAnimatedStyle(() => {
    // Determine active state strictly. Due to float precision, check > 0.01 instead of > 0
    const isActive = successColor.value > 0.01;
    return {
      transform: [{ scale: successScale.value }],
      borderColor: isActive ? '#00e673' : 'transparent',
      backgroundColor: 'transparent',
    };
  });

  if (!currentQuestion) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pb-1 pt-2.5">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full"
            onPress={() => setShowQuitModal(true)}>
            <MaterialIcons name="close" size={28} color="#ef4444" />
          </TouchableOpacity>
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full"
            onPress={() => setIsPaused(!isPaused)}>
            <MaterialIcons name={isPaused ? 'play-arrow' : 'pause'} size={28} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <View className="items-center">
          <Text
            className="text-base font-bold tracking-widest text-[#00e673]"
            style={{
              textShadowColor: 'rgba(0,230,115,0.6)',
              textShadowRadius: 8,
              textShadowOffset: { width: 0, height: 0 },
            }}>
            {t('gameplay.streak')}
            {streak}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Text className="text-xs font-bold tracking-widest text-[#00e673]">PTS</Text>
          <Text className="text-lg font-bold text-[#00e673]">{score}</Text>
        </View>
      </View>

      {/* Timer Bar */}
      <View className="flex-row items-center gap-4 px-5 py-2.5">
        <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1E1E1E]">
          <View
            className="h-full rounded-full bg-[#00e673]"
            style={{ width: `${timerPercentage}%` }}
          />
        </View>
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="timer" size={14} color={COLORS.primary} className="mr-0.5" />
          <Text className="font-[Courier] text-base font-bold text-white">
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </Text>
        </View>
      </View>

      <View className="flex-1 items-center px-5 pt-2.5">
        {/* Question Card */}
        <View className="mb-8 w-full overflow-hidden rounded-2xl border border-white/5 bg-[#161616]">
          <ImageBackground
            source={require('../../assets/images/space_bg.webp')}
            style={{ width: '100%' }}
            imageStyle={{ opacity: 0.15 }}>
            <View className="px-6 pb-5 pt-6">
              <View className="mb-5 flex-row justify-between">
                <View className="rounded-md bg-[rgba(0,230,115,0.1)] px-2.5 py-1.5">
                  <Text className="text-[11px] font-extrabold tracking-wide text-[#00e673]">
                    ASTRONOMY
                  </Text>
                </View>
                <View className="rounded-md bg-[rgba(255,145,0,0.08)] px-2.5 py-1.5">
                  <Text className="text-[11px] font-extrabold tracking-wide text-[#FF9100]">
                    DOUBLE POINTS
                  </Text>
                </View>
              </View>

              <Text className="mb-8 text-2xl font-bold leading-8 tracking-tighter text-white">
                {currentQuestion.question}
              </Text>

              <View className="flex-row justify-end">
                <TouchableOpacity className="flex-row items-center gap-1">
                  <MaterialIcons name="lightbulb" size={14} color="#a1a1aa" />
                  <Text className="text-[13px] font-medium text-zinc-400">Get Hint (20pts)</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Gradient Line */}
            <LinearGradient
              colors={['#00e673', '#FF9100']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 4, width: '100%' }}
            />
          </ImageBackground>
        </View>

        {/* Answer Slots */}
        <View className="mb-10 flex-row justify-center gap-2">
          {userAnswer.map((slot, idx) => {
            const isFilled = slot.char !== '';
            // Calculate dynamic size
            const gap = 8;
            const availableWidth = width - 40 - (userAnswer.length - 1) * gap;
            const calculatedWidth = availableWidth / Math.max(1, userAnswer.length);
            const slotWidth = Math.min(60, calculatedWidth);
            const slotHeight = Math.min(50, slotWidth * (50 / 60));

            return (
              <Animated.View key={idx} style={animatedSlotStyle}>
                <TouchableOpacity
                  className={`items-center justify-center rounded-xl border-2 ${
                    isFilled ? 'mt-0.5 border-[#00e673]' : 'border-b-4 border-white/15'
                  }`}
                  style={{
                    width: slotWidth,
                    height: slotHeight,
                    backgroundColor: isFilled ? '#1E293B' : 'transparent', // Slate-800
                  }}
                  onPress={() => handleAnswerSlotPress(idx)}>
                  <Text
                    className="font-bold text-white"
                    style={{ fontSize: Math.min(26, slotWidth * 0.45) }}>
                    {slot.char}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View className="flex-1" />

        {/* Letter Bank Grid */}
        <View className="mb-2.5 w-full flex-row flex-wrap justify-center gap-2">
          {letterBank.map((char, index) => (
            <LetterTile
              key={index}
              char={char}
              index={index}
              isDisabled={disabledBankIndices.includes(index)}
              isBombed={bombedIndices.includes(index)}
              bombAnim={bombAnim}
              onPress={handleLetterPress}
              size={(width - 40 - 6 * 8) / 7}
            />
          ))}
        </View>
      </View>

      {/* Bottom Actions */}
      <View
        className="flex-row items-center justify-center gap-6 py-5 pb-8"
        pointerEvents={isPaused ? 'none' : 'auto'}
        style={{ opacity: isPaused ? 0.3 : 1 }}>
        <View className="items-center gap-2">
          <TouchableOpacity
            className="h-[60px] w-[60px] items-center justify-center rounded-full border border-white/5 bg-white/5"
            onPress={handleHintPress}>
            <View className="rounded-[20px] bg-orange-500/20 p-2">
              <MaterialIcons name="local-fire-department" size={24} color={COLORS.secondary} />
            </View>
            <View className="absolute -right-1 -top-1 rounded-full border border-[#1E1E1E] bg-red-500 px-1.5 py-0.5">
              <Text className="text-[9px] font-bold text-white">-2s</Text>
            </View>
          </TouchableOpacity>
          <Text className="mt-1 text-[10px] font-bold tracking-wide text-slate-400">
            {t('gameplay.bomb')}
          </Text>
        </View>

        <View className="items-center gap-2">
          <TouchableOpacity
            className="h-[60px] w-[60px] items-center justify-center rounded-full border border-white/5 bg-white/5"
            onPress={handleSkipPress}>
            <View className="rounded-[20px] bg-purple-500/20 p-2">
              <MaterialIcons name="skip-next" size={24} color="#a855f7" />
            </View>
          </TouchableOpacity>
          <Text className="mt-1 text-[10px] font-bold tracking-wide text-slate-400">
            {t('gameplay.skip')}
          </Text>
        </View>
      </View>

      {/* Pause Overlay Layer */}
      {isPaused && !showQuitModal && (
        <View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center bg-black/80">
          <MaterialIcons name="pause-circle-outline" size={80} color={COLORS.primary} />
          <Text className="mt-4 text-2xl font-bold tracking-widest text-white">PAUSED</Text>
          <TouchableOpacity
            className="mt-8 rounded-full border border-[#00e673] px-8 py-3"
            onPress={() => setIsPaused(false)}>
            <Text className="text-lg font-bold text-[#00e673]">RESUME</Text>
          </TouchableOpacity>
        </View>
      )}

      <QuitModal
        isVisible={showQuitModal}
        onCancel={() => setShowQuitModal(false)}
        onQuit={onQuit}
      />
    </SafeAreaView>
  );
}
