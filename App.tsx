import { StatusBar } from 'expo-status-bar';
import './global.css';
import { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import PreGameScreen from './src/screens/PreGameScreen';
import CareerPathScreen from './src/screens/CareerPathScreen';
import GameplayScreen from './src/screens/GameplayScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import { TimeMode } from './src/utils/gameLogic';
import './src/utils/i18n'; // Initialize i18n

export type ScreenState = 'CAREER_PATH' | 'PRE_GAME' | 'GAMEPLAY' | 'GAME_OVER';

export interface GameStats {
  score: number;
  maxStreak: number;
  maxLetters: number;
  totalWordsFound: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('CAREER_PATH');
  const [timeMode, setTimeMode] = useState<TimeMode>(60);
  const [currentLevel, setCurrentLevel] = useState<number>(1);

  const [finalStats, setFinalStats] = useState<GameStats>({
    score: 0,
    maxStreak: 0,
    maxLetters: 4,
    totalWordsFound: 0,
  });

  const startGame = (selectedTime: TimeMode) => {
    setTimeMode(selectedTime);
    setCurrentScreen('GAMEPLAY');
  };

  const endGame = (stats: GameStats) => {
    setFinalStats(stats);
    setCurrentScreen('GAME_OVER');
  };

  const playAgain = () => {
    setCurrentScreen('CAREER_PATH');
  };

  const goToPreGame = (level: number) => {
    setCurrentLevel(level);
    setCurrentScreen('PRE_GAME');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#0a0a0a]">
        <StatusBar style="light" />
        {currentScreen === 'CAREER_PATH' && (
          <CareerPathScreen onSelectLevel={goToPreGame} stats={finalStats} />
        )}
        {currentScreen === 'PRE_GAME' && <PreGameScreen onStart={startGame} />}
        {currentScreen === 'GAMEPLAY' && (
          <GameplayScreen
            timeMode={timeMode}
            level={currentLevel}
            onGameOver={endGame}
            onQuit={playAgain}
          />
        )}
        {currentScreen === 'GAME_OVER' && (
          <GameOverScreen stats={finalStats} onPlayAgain={playAgain} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
