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
            :color="subscription.isPaid ? 'green' : 'gray'"
            :label="subscription.isPaid ? 'Pro Plan' : 'Free Plan'"
          />
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-600">Status</span>
          <UBadge
            :color="subscription.isActive ? 'green' : 'red'"
            :label="subscription.isActive ? 'Active' : 'Inactive'"
          />
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-600">Monthly Interviews</span>
          <span class="text-sm">{{ subscription.isPaid ? '20' : '3' }}</span>
        </div>

        <div v-if="subscription.subscriptionId" class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-600">Subscription ID</span>
          <span class="text-xs font-mono"
            >{{ subscription.subscriptionId.substring(0, 8) }}...</span
          >
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
          v-if="!subscription || !subscription.isPaid"
          color="primary"
          @click="$emit('upgrade')"
        >
          Upgrade to Pro
        </UButton>

        <UButton
          v-if="subscription && subscription.isPaid"
          color="gray"
          variant="ghost"
          @click="$emit('manage')"
        >
          Manage Subscription
        </UButton>

        <UButton color="gray" variant="ghost" @click="$emit('refresh')"> Refresh </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
  interface SubscriptionInfo {
    status?: 'free' | 'paid';
    subscriptionId?: string | null;
    isPaid?: boolean;
    isActive?: boolean;
  }

  interface Props {
    subscription?: SubscriptionInfo | null;
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
