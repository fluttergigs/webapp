<script lang="ts" setup>
import type { FeatureAnnouncementConfig } from "~/features/announcements/announcements.types";
import { AnalyticsEvent } from "~/services/analytics/events";

import { useAnalytics } from "~/composables/useAnalytics";
import { on } from "ws";

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    config: FeatureAnnouncementConfig;
  }>(),
  {
    isOpen: false,
  }
);

const emit = defineEmits<{
  close: [];
  action: [];
  "update:isOpen": [boolean];
}>();

const visible = computed({
  get: () => props.isOpen,
  set: (val) => {
    if (val) {
      useAnalytics().capture(AnalyticsEvent.featureAnnouncementModalOpened);
    } else {
      useAnalytics().capture(AnalyticsEvent.featureAnnouncementModalClosed);
      emit("close");
    }
    emit("update:isOpen", val);
  },
});

const handleAction = () => {
  emit("action");
  emit("close");
};
</script>

<template>
  <UModal v-model:open="visible" :dismissible="false" size="2xl">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center space-x-3">
          <div :class="[
            'w-10 h-10 rounded-lg flex items-center justify-center text-white text-2xl',
            config.gradient || 'bg-gradient-to-r from-indigo-400 to-indigo-900',
          ]">
            {{ config.icon || "🎉" }}
          </div>
          <div>
            <h3 class="text-xl">New Feature!</h3>
            <p class="text-lg text-gray-900 font-semibold">{{ config.title }}</p>
          </div>
        </div>
        <UButton icon="i-heroicons-x-mark-20-solid" color="gray" variant="ghost" size="xl" @click="emit('close')" />
      </div>
    </template>
    <template #body>
      <div class="max-w-md mx-auto" variant="subtle">
        <div class="space-y-4">
          <div class="flex justify-center items-center" v-if="false">
            <UIcon name="i-heroicons-chat-bubble-left-right-solid" class="text-primary-500 text-6xl" />
          </div>

          <div>
            <p class="text-gray-600 leading-relaxed">
              {{ config.description }}
            </p>
          </div>

          <div class="flex flex-col gap-3">
            <UButton :to="config.actionRoute" color="primary" size="xl" class="flex-1 justify-center"
              @click="handleAction">
              {{ config.actionText }}
            </UButton>
            <UButton color="neutral" variant="link" size="md" class="flex-1 justify-center" @click="emit('close')">
              Maybe Later
            </UButton>
          </div>

          <div class="text-center">
            <p class="text-xs text-gray-400">This announcement will only show once</p>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
