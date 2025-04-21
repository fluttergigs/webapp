import i18n from '~/core/helpers/i18n';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(i18n);
});
