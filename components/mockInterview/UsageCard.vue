<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">Interview Usage</h3>
    </template>

    <div class="space-y-4">
      <div v-if="isLoading" class="text-center py-4">
        <USkeleton class="h-4 w-full mb-2" />
        <USkeleton class="h-4 w-3/4" />
      </div>

      <div v-else-if="usage" class="space-y-4">
        <!-- Usage Progress -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="font-medium text-gray-600">This Month</span>
            <span>{{ usage.currentCount }} / {{ usage.limit }}</span>
          </div>
          
          <UProgress 
            :value="(usage.currentCount / usage.limit) * 100"
            :color="isNearLimit ? 'red' : 'primary'"
          />
          
          <div class="text-xs text-gray-500">
            {{ usage.limit - usage.currentCount }} interviews remaining
          </div>
        </div>

        <!-- Tier Information -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-600">Plan</span>
          <UBadge 
            :color="usage.tier === 'paid' ? 'green' : 'gray'"
            :label="usage.tier === 'paid' ? 'Pro' : 'Free'"
          />
        </div>

        <!-- Message -->
        <div v-if="usage.message" class="p-3 rounded-lg bg-blue-50 text-blue-800 text-sm">
          {{ usage.message }}
        </div>

        <!-- Limit Warning -->
        <div v-if="!usage.canUse" class="p-3 rounded-lg bg-red-50 text-red-800 text-sm">
          <p class="font-medium">Usage limit reached</p>
          <p class="text-xs mt-1">Upgrade to Pro for more interviews this month</p>
        </div>
      </div>

      <div v-else class="text-center py-4 text-gray-500">
        <p>No usage data available</p>
      </div>
    </div>

    <template #footer v-if="!isLoading">
      <div class="flex justify-between">
        <UButton 
          v-if="!usage?.canUse && usage?.tier === 'free'"
          color="primary"
          @click="$emit('upgrade')"
        >
          Upgrade to Pro
        </UButton>
        
        <UButton 
          color="gray"
          variant="ghost"
          @click="$emit('refresh')"
        >
          Refresh
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { UsageCheckResult } from '~/features/mockInterview/mockInterview.types';

interface Props {
  usage?: UsageCheckResult | null;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const emit = defineEmits<{
  upgrade: [];
  refresh: [];
}>();

const isNearLimit = computed(() => {
  if (!props.usage) return false;
  const percentage = props.usage.currentCount / props.usage.limit;
  return percentage >= 0.8; // 80% or more
});
</script>