import { ref } from 'vue';

class AppFunctions {
  constructor() {
    this.languages = ref([
      { code: 'hu', name: 'Magyar', flores_code: 'hun_Latn' },
      { code: 'en', name: 'Angol', flores_code: 'eng_Latn' },
    ]);
  }
}

export const appFunctions = new AppFunctions();
