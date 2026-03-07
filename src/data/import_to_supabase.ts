import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase Projenizin bilgileri
const supabaseUrl = 'https://yyxmulwqvupmaeeyzazh.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'SUPABASE_KEY_HERE';

if (supabaseKey === 'SUPABASE_KEY_HERE') {
  console.error(
    'Lütfen scripti çalıştırmadan önce SUPABASE_SERVICE_ROLE_KEY ortam değişkenini ayarlayın veya doğrudan koda servis rol anahtarını yapıştırın.'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importData() {
  try {
    const dataPath = path.join(__dirname, 'words_en.json');
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    const wordsData = JSON.parse(fileContent);

    let totalInserted = 0;
    const batchSize = 100; // Supabase'e 100'er 100'er göndereceğiz

    for (const lengthKey in wordsData) {
      const wordsForLength = wordsData[lengthKey];
      console.log(`Uzunluk: ${lengthKey}, Kelime Sayısı: ${wordsForLength.length} işleniyor...`);

      const validWords = wordsForLength.filter((item: any) => item.q && item.a);
      if (validWords.length < wordsForLength.length) {
        console.warn(
          `Uyarı: Uzunluk ${lengthKey} için ${wordsForLength.length - validWords.length} hatalı kelime atlandı.`
        );
      }

      const formattedWords = validWords.map((item: any) => ({
        question: item.q,
        answer: item.a,
        level: item.level || 1,
        word_length: parseInt(lengthKey, 10) || item.a.length,
        lang: 'en',
      }));

      // Toplu Ekleme
      for (let i = 0; i < formattedWords.length; i += batchSize) {
        const batch = formattedWords.slice(i, i + batchSize);
        const { error } = await supabase.from('words').insert(batch);

        if (error) {
          console.error(`Satır ${i} - ${i + batchSize} eklenirken hata:`, error.message);
        } else {
          totalInserted += batch.length;
          console.log(`${totalInserted} kelime başarıyla eklendi...`);
        }
      }
    }

    console.log(`\n🎉 İşlem tamam! Toplam ${totalInserted} kelime Supabase'e başarıyla eklendi.`);
  } catch (error) {
    console.error('Beklenmeyen bir hata oluştu:', error);
  }
}

importData();
