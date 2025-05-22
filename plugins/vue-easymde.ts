//@ts-ignore
import 'easymde/dist/easymde.min.css';

import VueEasymde from 'vue3-easymde';





export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueEasymde);
});
