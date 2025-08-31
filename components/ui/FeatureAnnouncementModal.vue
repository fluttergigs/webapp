<script lang="ts" setup>
import type { FeatureAnnouncementConfig } from '~/features/announcements/announcements.types';

const props = defineProps<{
  isOpen: boolean;
  config: FeatureAnnouncementConfig;
}>();

const emit = defineEmits<{
  close: [];
  action: [];
}>();

const handleAction = () => {
  emit('action');
  emit('close');
};
</script>

<template>
  <UModal :model-value="isOpen" @update:model-value="emit('close')" :prevent-close="false">
    <UCard class="max-w-md mx-auto">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div 
              :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl',
                config.gradient || 'bg-gradient-to-r from-blue-500 to-purple-600'
              ]"
            >
              {{ config.icon || '🎉' }}
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                New Feature!
              </h3>
              <p class="text-sm text-gray-500">{{ config.title }}</p>
            </div>
          </div>
          <UButton 
            icon="i-heroicons-x-mark-20-solid" 
            color="gray" 
            variant="ghost" 
            size="sm"
            @click="emit('close')"
          />
        </div>
      </template>

      <div class="space-y-4">
        <div>
          <p class="text-gray-600 leading-relaxed">
            {{ config.description }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <UButton 
            :to="config.actionRoute"
            color="primary"
            size="md"
            class="flex-1 justify-center"
            @click="handleAction"
          >
            {{ config.actionText }}
          </UButton>
          <UButton 
            color="gray" 
            variant="outline" 
            size="md"
            class="flex-1 justify-center"
            @click="emit('close')"
          >
            Maybe Later
          </UButton>
        </div>

        <div class="text-center">
          <p class="text-xs text-gray-400">
            This announcement will only show once
          </p>
        </div>
      </div>
    </UCard>
  </UModal>
</template>