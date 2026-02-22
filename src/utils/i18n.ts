import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      careerPath: {
        title: 'Career Path',
        rank: 'Rank {{rank}}',
        nextRank: 'Next Rank',
        goal: 'Goal: {{count}} Words',
        currentRank: 'Current Rank',
        wordsCollected: 'Words Collected',
        continueJourney: 'CONTINUE JOURNEY',
        globalRank: 'Global Rank',
        viewLeaderboard: 'View Leaderboard',
      },
      preGame: {
        selectDuration: 'SELECT DURATION',
        chooseYourPace: 'Choose Your Pace',
        timeLimitDesc: 'Select a time limit for this session',
        blitz: 'Blitz',
        blitzDesc: 'Fast-paced frenzy',
        classic: 'Classic',
        classicDesc: 'The standard challenge',
        marathon: 'Marathon',
        marathonDesc: 'Test your endurance',
        startGame: 'START GAME',
      },
      gameplay: {
        streak: 'STREAK: ',
        reveal: 'REVEAL',
        bomb: 'BOMB',
        skip: 'SKIP',
        quitTitle: 'Quit Game',
        quitMessage: 'Are you sure you want to quit? Your current progress and score will be lost.',
      },
      common: {
        cancel: 'Cancel',
        quit: 'Quit',
      },
      gameOver: {
        timesUp: "TIME'S UP!",
        levelComplete: 'Level Complete',
        totalWordsFound: 'TOTAL WORDS FOUND',
        bestStreak: 'BEST STREAK',
        maxReach: 'MAX REACH',
        letters: 'Letters',
        levelUp: 'LEVEL UP',
        coinsEarned: 'COINS EARNED',
        playAgain: 'PLAY AGAIN',
      },
    },
  },
  tr: {
    translation: {
      careerPath: {
        title: 'Kariyer Yolu',
        rank: 'Rank {{rank}}', // Or Rütbe {{rank}} if preferred
        nextRank: 'Sonraki Rütbe',
        goal: 'Hedef: {{count}} Kelime',
        currentRank: 'Mevcut Rütbe',
        wordsCollected: 'Toplanan Kelime',
        continueJourney: 'YOLCULUĞA DEVAM ET',
        globalRank: 'Küresel Sıralama',
        viewLeaderboard: 'Liderlik Tablosu',
      },
      preGame: {
        selectDuration: 'SÜRE SEÇİMİ',
        chooseYourPace: 'Temponuzu Seçin',
        timeLimitDesc: 'Bu oyun için bir süre sınırı seç',
        blitz: 'Blitz',
        blitzDesc: 'Hızlı çılgınlık',
        classic: 'Klasik',
        classicDesc: 'Standart zorluk',
        marathon: 'Marathon',
        marathonDesc: 'Dayanıklılığını test et',
        startGame: 'OYUNA BAŞLA',
      },
      gameplay: {
        streak: 'SERİ: ',
        reveal: 'GÖSTER',
        bomb: 'BOMBA',
        skip: 'GEÇ',
        quitTitle: 'Oyundan Çık',
        quitMessage: 'Gerçekten çıkmak istiyor musun? Mevcut ilerlemen ve puanın silinecek.',
      },
      common: {
        cancel: 'İptal',
        quit: 'Çık',
      },
      gameOver: {
        timesUp: 'SÜRE BİTTİ!',
        levelComplete: 'Seviye Tamamlandı',
        totalWordsFound: 'TOPLAM BULUNAN KELİME',
        bestStreak: 'EN İYİ SERİ',
        maxReach: 'MAKS UZUNLUK',
        letters: 'Harf',
        levelUp: 'SEVİYE ATLADIN',
        coinsEarned: 'KAZANILAN ALTIN',
        playAgain: 'TEKRAR OYNA',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'tr', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
