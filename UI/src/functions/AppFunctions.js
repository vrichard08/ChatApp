import { getTranslationApis } from '@/data/translationApis';
import { ref } from 'vue';

class AppFunctions {
  constructor() {
    this.languages = ref([
      { code: 'hu', name: 'Magyar', flores_code: 'hun_Latn' },
      { code: 'en', name: 'Angol', flores_code: 'eng_Latn' },
      { code: 'bg', name: 'Bolgár ', flores_code: 'bul_Cyrl' },
      { code: 'fr', name: 'Francia ', flores_code: 'fra_Latn' },
      { code: 'fa', name: 'Perzsa ', flores_code: 'pes_Arab' },
      { code: 'pt', name: 'Portugál ', flores_code: 'por_Latn' },
      { code: 'es', name: 'Spanyol', flores_code: 'spa_Latn' },
      { code: 'sk', name: 'Szlovák ', flores_code: 'slk_Latn' },
      { code: 'zh', name: 'Kínai ', flores_code: 'zho_Hans' },
      { code: 'pl', name: 'Lengyel', flores_code: 'pol_Latn' },
      { code: 'de', name: 'Német', flores_code: 'deu_Latn' },
      { code: 'it', name: 'Olasz', flores_code: 'ita_Latn' },
      { code: 'ru', name: 'Orosz', flores_code: 'rus_Cyrl' },
    ]);
    this.voices = ref([]);
    this.translationApi = ref(getTranslationApis()[0]);
  }
}

export const appFunctions = new AppFunctions();
