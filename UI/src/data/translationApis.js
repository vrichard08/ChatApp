import { TranslationApi } from '@/enums/TranslationApi';

export const getTranslationApis = () => {
  return [
    { id: TranslationApi.MorphoLogic, name: 'MorphoLogic' },
    { id: TranslationApi.NLLB, name: 'NLLB' },
  ];
};
