<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Current Subscription -->
      <SubscriptionCard
        :subscription="subscriptionInfo"
        :is-loading="isSubscriptionLoading"
        @upgrade="handleUpgrade"
        @manage="handleManageSubscription"
        @refresh="refreshSubscription"
      />

      <!-- Interview Usage -->
      <UsageCard
        :usage="usageInfo || currentUsage"
        :is-loading="isUsageLoading"
        @upgrade="handleUpgrade"
        @refresh="refreshUsage"
      />
    </div>

    <!-- Quick Actions -->
    <UCard>
      <template #header>
        <h4 class="text-md font-semibold">Quick Actions</h4>
      </template>

      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">View Detailed Usage</p>
            <p class="text-sm text-gray-600">See complete usage history and analytics</p>
          </div>
          <UButton color="gray" variant="outline" @click="navigateTo('/account/subscription')">
            View Details
          </UButton>
        </div>

        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">Mock Interviews</p>
            <p class="text-sm text-gray-600">Practice with AI-generated interview questions</p>
          </div>
          <UButton color="primary" @click="navigateTo('/mock-interview')">
            Start Interview
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
  // Use the subscription and mock interview composables
  const {
    subscriptionInfo,
    usageInfo,
    isSubscriptionLoading,
    isUsageLoading,
    fetchSubscriptionStatus,
    fetchCurrentUsage,
  } = useSubscription();

  // Use existing mock interview composable for usage data
  const { currentUsage } = useMockInterviews();

  // Event handlers
  const handleUpgrade = () => {
    navigateTo('/account/subscription');
  };

  const handleManageSubscription = () => {
    navigateTo('/account/subscription');
  };

  const refreshSubscription = () => {
    fetchSubscriptionStatus();
  };

  const refreshUsage = () => {
    fetchCurrentUsage();
  };

  // Initialize
  onMounted(() => {
    refreshSubscription();
    refreshUsage();
  });
</script>
