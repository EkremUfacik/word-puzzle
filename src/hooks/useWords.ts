import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';
import { setWordData } from '../utils/gameLogic';
import defaultWordsTr from '../data/words_tr.json';
import defaultWordsEn from '../data/words_en.json';

const CACHE_KEY = '@words_data_cache';

export function useWords() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadWords() {
      try {
        // 1. Load from AsyncStorage first for immediate use
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        let currentWords = { tr: defaultWordsTr, en: defaultWordsEn };

        if (cachedData) {
          const parsedCache = JSON.parse(cachedData);
          if (parsedCache.tr && parsedCache.en) {
            currentWords = parsedCache;
          }
        }

        // Feed initial words (from cache or local file)
        setWordData(currentWords);

        // 2. Fetch fresh from Supabase
        const { data, error } = await supabase
          .from('words')
          .select('id, question, answer, level, word_length, lang');

        if (error) {
          console.error('Error fetching words from Supabase:', error);
          setIsReady(true);
          return;
        }

        if (data && data.length > 0) {
          const fetchedWordsTr: any = {};
          const fetchedWordsEn: any = {};

          data.forEach((item) => {
            const length = item.word_length || item.answer.length;
            const lenKey = length.toString();
            const targetDict = item.lang === 'en' ? fetchedWordsEn : fetchedWordsTr;

            if (!targetDict[lenKey]) {
              targetDict[lenKey] = [];
            }
            targetDict[lenKey].push({
              q: item.question,
              a: item.answer,
              level: item.level || 1,
            });
          });

          // Supabase'den gelen kelimeler tamamen ana veri kaynağımızdır.
          // Fallback (defaultWords) ile birleştirmeye gerek yok, doğrudan üzerlerine yazıyoruz.
          const newWordData = { tr: fetchedWordsTr, en: fetchedWordsEn };

          setWordData(newWordData);
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newWordData));
        }
      } catch (err) {
        console.error('Failed to load words:', err);
      } finally {
        setIsReady(true); // Proceed to app
      }
    }

    loadWords();
  }, []);

  return isReady;
}
