import { sortStr } from '@/utils/sort';

const whisperLanguages = [
  { name: 'Afrikaans', code: 'af' },
  { name: 'Albanian', code: 'sq' },
  { name: 'Amharic', code: 'am' },
  { name: 'Arabic', code: 'ar' },
  { name: 'Assamese', code: 'as' },
  { name: 'Azerbaijani', code: 'az' },
  { name: 'Bashkir', code: 'ba' },
  { name: 'Belarusian', code: 'be' },
  { name: 'Bengali', code: 'bn' },
  { name: 'Bosnian', code: 'bs' },
  { name: 'Breton', code: 'br' },
  { name: 'Bulgarian', code: 'bg' },
  { name: 'Burmese', code: 'my' },
  { name: 'Catalan', code: 'ca' },
  { name: 'Czech', code: 'cs' },
  { name: 'Welsh', code: 'cy' },
  { name: 'Danish', code: 'da' },
  { name: 'German', code: 'de' },
  { name: 'Greek', code: 'el' },
  { name: 'English', code: 'en' },
  { name: 'Spanish', code: 'es' },
  { name: 'Estonian', code: 'et' },
  { name: 'Basque', code: 'eu' },
  { name: 'Persian', code: 'fa' },
  { name: 'Finnish', code: 'fi' },
  { name: 'Faroese', code: 'fo' },
  { name: 'French', code: 'fr' },
  { name: 'Galician', code: 'gl' },
  { name: 'Gujarati', code: 'gu' },
  { name: 'Hausa', code: 'ha' },
  { name: 'Hawaiian', code: 'haw' },
  { name: 'Hebrew', code: 'he' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Croatian', code: 'hr' },
  { name: 'Haitian', code: 'ht' },
  { name: 'Hungarian', code: 'hu' },
  { name: 'Armenian', code: 'hy' },
  { name: 'Indonesian', code: 'id' },
  { name: 'Icelandic', code: 'is' },
  { name: 'Italian', code: 'it' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Javanese', code: 'jw' },
  { name: 'Georgian', code: 'ka' },
  { name: 'Kazakh', code: 'kk' },
  { name: 'Khmer', code: 'km' },
  { name: 'Kannada', code: 'kn' },
  { name: 'Korean', code: 'ko' },
  { name: 'Latin', code: 'la' },
  { name: 'Luxembourgish', code: 'lb' },
  { name: 'Lingala', code: 'ln' },
  { name: 'Laotian', code: 'lo' },
  { name: 'Lithuanian', code: 'lt' },
  { name: 'Latvian', code: 'lv' },
  { name: 'Malagasy', code: 'mg' },
  { name: 'Maori', code: 'mi' },
  { name: 'Macedonian', code: 'mk' },
  { name: 'Malayalam', code: 'ml' },
  { name: 'Mongolian', code: 'mn' },
  { name: 'Marathi', code: 'mr' },
  { name: 'Malay', code: 'ms' },
  { name: 'Maltese', code: 'mt' },
  { name: 'Nepali', code: 'ne' },
  { name: 'Dutch', code: 'nl' },
  { name: 'Norwegian', code: 'no' },
  { name: 'Occitan', code: 'oc' },
  { name: 'Panjabi', code: 'pa' },
  { name: 'Polish', code: 'pl' },
  { name: 'Pashto', code: 'ps' },
  { name: 'Portuguese', code: 'pt' },
  { name: 'Romanian', code: 'ro' },
  { name: 'Russian', code: 'ru' },
  { name: 'Sanskrit', code: 'sa' },
  { name: 'Sindhi', code: 'sd' },
  { name: 'Sinhala', code: 'si' },
  { name: 'Slovak', code: 'sk' },
  { name: 'Slovenian', code: 'sl' },
  { name: 'Shona', code: 'sn' },
  { name: 'Somali', code: 'so' },
  { name: 'Serbian', code: 'sr' },
  { name: 'Sundanese', code: 'su' },
  { name: 'Swedish', code: 'sv' },
  { name: 'Swahili', code: 'sw' },
  { name: 'Tamil', code: 'ta' },
  { name: 'Telugu', code: 'te' },
  { name: 'Tajik', code: 'tg' },
  { name: 'Thai', code: 'th' },
  { name: 'Turkmen', code: 'tk' },
  { name: 'Tagalog', code: 'tl' },
  { name: 'Turkish', code: 'tr' },
  { name: 'Tatar', code: 'tt' },
  { name: 'Ukrainian', code: 'uk' },
  { name: 'Urdu', code: 'ur' },
  { name: 'Uzbek', code: 'uz' },
  { name: 'Vietnamese', code: 'vi' },
  { name: 'Yiddish', code: 'yi' },
  { name: 'Yoruba', code: 'yo' },
  { name: 'Yue', code: 'yue' },
  { name: 'Chinese', code: 'zh' },
];

export const GetWhisperLanguages = () => {
  let langs = [...whisperLanguages];
  langs.sort(sortStr('name'));
  return langs;
};
