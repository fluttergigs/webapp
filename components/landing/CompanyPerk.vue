<script lang="ts" setup>
  //@ts-ignore
  import { ArrowRightIcon, PaperAirplaneIcon } from '@heroicons/vue/24/solid';

  //@ts-ignore
  defineProps({
    icon: {
      type: Function,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    ctaText: {
      type: String,
    },
  });

  //@ts-ignore
  const emits = defineEmits(['ctaClicked']);
</script>

<template>
  <div
    class="px-9 py-8 text-white bg-blueGray-900 rounded-4xl shadow-sm transition-all ease-in-out duration-200 hover:-translate-y-2 hover:shadow-lg"
  >
    <div class="flex flex-col h-full justify-between">
      <slot name="icon">
        <component :is="icon" class="w-9 mb-5" />
      </slot>

      <slot name="title">
        <h2 class="text-4xl mb-9 font-bold leading-snug">{{ title }}</h2>
      </slot>

      <slot name="description">
        <p class="text-md font-medium mb-24">
          {{ description }}
        </p>
      </slot>

      <slot name="cta">
        <div class="flex gap-3 cursor-pointer" @click="emits('ctaClicked')">
          <p class="font-bold">{{ ctaText }}</p>
          <ArrowRightIcon class="w-4" />
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped></style>
