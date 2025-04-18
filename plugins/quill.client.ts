//@ts-ignore
import { quillEditor } from 'vue3-quill';
import 'vue3-quill/lib/vue3-quill.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('QuillEditor', quillEditor);
});
