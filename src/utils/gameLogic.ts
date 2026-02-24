import wordsTr from '../data/words_tr.json';
import wordsEn from '../data/words_en.json';

const wordData = {
  tr: wordsTr,
  en: wordsEn,
};

export type TimeMode = 30 | 60 | 120 | 300; // in seconds

export interface Question {
  a: string;
  q: string;
  level?: number;
}

const ALPHABET_TR = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
const ALPHABET_EN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Shuffle an array in place
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Generate the 20-letter bank for a given word
export function generateLetterBank(word: string, lang: 'tr' | 'en'): string[] {
  const letters = word.toUpperCase().split('');
  const alphabet = lang === 'tr' ? ALPHABET_TR : ALPHABET_EN;

  // Fill the rest with random letters
  while (letters.length < 21) {
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    letters.push(randomLetter);
  }

  return shuffleArray(letters);
}

// Get a random question based on current length, language, and difficulty level
export function getQuestion(lang: 'tr' | 'en', length: number, level: number = 1): Question {
  const data = wordData[lang] as any;
  let availableLengths: number[] = [];
  let wordsOfLength: Question[] = [];

  if (Array.isArray(data)) {
    // Handling new flat array format
    availableLengths = Array.from(new Set(data.map((w: any) => String(w.a).length))).sort(
      (a, b) => a - b
    );
    let targetLength = length;

    if (!availableLengths.includes(targetLength)) {
      targetLength =
        availableLengths.length > 0 ? availableLengths[availableLengths.length - 1] : length;
    }

    wordsOfLength = data.filter((w: any) => String(w.a).length === targetLength);
  } else {
    // Handling legacy length-keyed object format
    availableLengths = Object.keys(data)
      .map(Number)
      .sort((a, b) => a - b);
    let targetLength = length;

    if (!availableLengths.includes(targetLength)) {
      targetLength =
        availableLengths.length > 0 ? availableLengths[availableLengths.length - 1] : length;
    }

    wordsOfLength = data[targetLength.toString()] || [];
  }

  // Filter by difficulty level
  const filteredWords = wordsOfLength.filter((w) => w.level === level);
  const pool = filteredWords.length > 0 ? filteredWords : wordsOfLength;

  if (pool.length === 0) {
    return { a: 'HATA', q: 'Soru bulunamadı.', level: 1 };
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

// Calculate how many distractors to remove
// If returning a number > 0, we can remove it. Else, we return 0.
export function getRemovableDistractorsCount(currentBank: string[], correctWord: string): number {
  // A naive implementation: Just count how many slots are active
  // The actual implementation in the UI will disable buttons.
  return 5;
}
