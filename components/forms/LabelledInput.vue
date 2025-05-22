<script lang="ts" setup>
  //@ts-ignore
  import { useField, useForm } from 'vee-validate';

  const props = defineProps({
    label: {
      type: String,
    },
    insideText: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: 'placeholder',
    },
    validationErrors: {
      type: Object,
      default: () => ({}),
    },
    dependencies: {
      type: Array,
      default: () => [],
    },
  });

  const errorMessage = computed(() => {
    if (props.validationErrors && props.name) {
      return props.validationErrors[props.name];
    }
    return '';
  });

  const emits = defineEmits(['insideTextClicked', 'update:value']);

  const { values: formValues } = useForm();

  // Set up watchers for dependencies
  if (props.dependencies?.length > 0) {
    props.dependencies.forEach((dependency) => {
      watch(
        () => formValues[dependency],
        () => {
          // Trigger validation for this field by emitting an event
          // that the parent can listen to
          emits('validate', props.name);
        },
        { deep: true },
      );
    });
  }
</script>

<template>
  <client-only>
    <div class="relative">
      <div class="flex flex-col gap-1.5">
        <slot name="label">
          <p class="text-sm font-medium">{{ label }}</p>
        </slot>

        <slot></slot>

        <slot name="insideText">
          <div class="absolute bottom-0.5 right-4 -translate-y-1/2 transform">
            <a
              class="cursor-pointer text-[12px] font-medium text-indigo-600 hover:text-indigo-700"
              @click="$emit('insideTextClicked')"
              >{{ insideText }}</a
            >
          </div>
        </slot>

        <p v-if="errorMessage" class="text-red-600 text-start text-sm capitalize">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </client-only>
</template>

<style scoped></style>
