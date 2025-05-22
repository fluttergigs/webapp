import en from '~/i18n/locales/en.json';
import fr from '~/i18n/locales/fr.json';

import { createI18n } from 'vue-i18n';

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: {
    en,
    fr,
  },
});
