import { TranslationApi } from '@/enums/TranslationApi';
import { appFunctions } from '@/functions/AppFunctions';
import { konasoftService } from '@/services/konasoftService';
import { morphoLogicService } from '@/services/morphoLogicService';

class TranslateFunctions {
  constructor() {}
  async TranslateWithApi(text, sourceLang, targetLang) {
    var translation = null;
    switch (appFunctions.translationApi.value.id) {
      case TranslationApi.MorphoLogic:
        translation = await morphoLogicService.Translate(
          text,
          sourceLang.code,
          targetLang.code
        );
        break;
      case TranslationApi.NLLB:
        translation = await konasoftService.Translate(
          text,
          sourceLang.flores_code,
          targetLang.flores_code
        );
        break;

      default:
        throw 'Not implemented';
    }
    return translation;
  }
}

export const translateFunctions = new TranslateFunctions();
