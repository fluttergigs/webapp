// components/QuillEditor.client.vue
<template>
  <ClientOnly>
    <QuillEditor
      v-model:value="content"
      :options="editorOptions"
      contentType="html"
      theme="snow"
      toolbar="full"
      @blur="onEditorBlur"
      @focus="onEditorFocus"
      @ready="onEditorReady"
    />
  </ClientOnly>
</template>

<script setup>
  import { ref, watch } from 'vue';

  //define props for placeholder

  //define props for placeholder

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Write something awesome...',
    },
  });

  const emit = defineEmits(['update:modelValue', 'ready', 'blur', 'focus']);

  const content = ref(props.modelValue);

  // Watch for content changes and emit them
  watch(content, (newValue) => {
    emit('update:modelValue', newValue);
  });

  // Watch for external value changes
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue !== content.value) {
        content.value = newValue;
      }
    },
  );

  const editorOptions = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image', 'video'],
      ],
    },
    placeholder: props.placeholder,
  };

  const onEditorReady = (quill) => {
    emit('ready', quill);
  };

  const onEditorBlur = (quill) => {
    emit('blur', quill);
  };

  const onEditorFocus = (quill) => {
    emit('focus', quill);
  };
</script>

<style>
  .ql-editor {
    min-height: 200px;
  }
</style>
