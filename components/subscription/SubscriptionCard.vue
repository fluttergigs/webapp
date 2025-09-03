<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">Current Subscription</h3>
    </template>

    <div class="space-y-4">
      <div v-if="isLoading" class="text-center py-4">
        <USkeleton class="h-4 w-full mb-2" />
        <USkeleton class="h-4 w-3/4" />
      </div>

      <div v-else-if="subscription" class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-600">Plan</span>
          <UBadge 
            :color="subscription.tier === 'paid' ? 'green' : 'gray'"
            :label="subscription.tier === 'paid' ? 'Pro Plan' : 'Free Plan'"
          />
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-600">Status</span>
          <UBadge 
            :color="subscription.status === 'active' ? 'green' : 'red'"
            :label="subscription.status"
          />
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-600">Monthly Interviews</span>
          <span class="text-sm">{{ subscription.limits?.monthlyInterviews || 3 }}</span>
        </div>

        <div v-if="subscription.currentPeriodEnd" class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-600">Next billing</span>
          <span class="text-sm">{{ formatDate(subscription.currentPeriodEnd) }}</span>
        </div>
      </div>

      <div v-else class="text-center py-4 text-gray-500">
        <p>No subscription information available</p>
        <p class="text-xs mt-1">You're on the free plan by default</p>
      </div>
    </div>

    <template #footer v-if="!isLoading">
      <div class="flex justify-between">
        <UButton 
          v-if="!subscription || subscription.tier === 'free'"
          color="primary"
          @click="$emit('upgrade')"
        >
          Upgrade to Pro
        </UButton>
        
        <UButton 
          v-if="subscription && subscription.tier === 'paid'"
          color="gray"
          variant="ghost"
          @click="$emit('manage')"
        >
          Manage Subscription
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
import type { UserSubscription } from '~/features/mockInterview/mockInterview.types';

interface Props {
  subscription?: UserSubscription | null;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const emit = defineEmits<{
  upgrade: [];
  manage: [];
  refresh: [];
}>();

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script>