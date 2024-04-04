<template>
  <QuillEditor :options="options" theme="snow"/>
</template>


<script setup lang="ts">
import {QuillEditor} from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';


const options = ref({
  editorData: '',
  options: {
    theme: "snow",
    placeholder: "Write here"
  }
})


</script>