<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Current Subscription -->
      <SubscriptionCard
        :subscription="currentSubscription"
        :is-loading="isSubscriptionLoading"
        @upgrade="handleUpgrade"
        @manage="handleManageSubscription"
        @refresh="refreshSubscription"
      />

      <!-- Interview Usage -->
      <UsageCard
        :usage="currentUsage"
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
          <UButton 
            color="gray" 
            variant="outline"
            @click="navigateTo('/account/subscription')"
          >
            View Details
          </UButton>
        </div>

        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">Mock Interviews</p>
            <p class="text-sm text-gray-600">Practice with AI-generated interview questions</p>
          </div>
          <UButton 
            color="primary"
            @click="navigateTo('/mock-interview')"
          >
            Start Interview
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { UserSubscription, UsageCheckResult } from '~/features/mockInterview/mockInterview.types';

// Reactive state
const currentSubscription = ref<UserSubscription | null>(null);
const currentUsage = ref<UsageCheckResult | null>(null);
const isSubscriptionLoading = ref(false);
const isUsageLoading = ref(false);

// Get stores
const mockInterviewStore = useMockInterviewStore();
const authStore = useAuthStore();

// Fetch subscription data
const fetchSubscription = async () => {
  if (!authStore.authUser?.id) return;
  
  isSubscriptionLoading.value = true;
  try {
    const { $http } = useNuxtApp();
    const response = await ($http as any).get(`/api/user-subscriptions?userId=${authStore.authUser.id}`);
    currentSubscription.value = response.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching subscription:', error);
  } finally {
    isSubscriptionLoading.value = false;
  }
};

// Fetch usage data
const fetchUsage = async () => {
  isUsageLoading.value = true;
  try {
    const usage = await mockInterviewStore.checkUsageLimit();
    currentUsage.value = usage;
  } catch (error) {
    console.error('Error fetching usage:', error);
  } finally {
    isUsageLoading.value = false;
  }
};

// Event handlers
const handleUpgrade = () => {
  navigateTo('/account/subscription');
};

const handleManageSubscription = () => {
  navigateTo('/account/subscription');
};

const refreshSubscription = () => {
  fetchSubscription();
};

const refreshUsage = () => {
  fetchUsage();
};

// Initialize
onMounted(() => {
  fetchSubscription();
  fetchUsage();
});
</script>