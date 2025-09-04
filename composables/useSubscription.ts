import { storeToRefs } from 'pinia';
import { useSubscriptionStore } from '~/stores/subscription';

import { computed } from 'vue';

export function useSubscription() {
  const subscriptionStore = useSubscriptionStore();

  // Store refs
  const {
    subscription,
    isSubscriptionLoading,
    subscriptionError,
    usage,
    isUsageLoading,
    usageError,
    history,
    isHistoryLoading,
    historyError,
    isPaidUser,
    canUseInterview,
  } = storeToRefs(subscriptionStore);

  // Computed properties for easier access
  const subscriptionTier = computed(() => usage.value?.subscriptionTier || 'free');
  const currentUsage = computed(() => usage.value?.currentUsage || 0);
  const monthlyLimit = computed(() => usage.value?.monthlyLimit || 3);
  const remaining = computed(() => monthlyLimit.value - currentUsage.value);
  const usagePercentage = computed(() => (currentUsage.value / monthlyLimit.value) * 100);
  const resetDate = computed(() => usage.value?.resetDate);

  // Usage information formatted for display
  const usageInfo = computed(() => {
    if (!usage.value) return null;

    return {
      current: usage.value.currentUsage,
      limit: usage.value.monthlyLimit,
      remaining: remaining.value,
      percentage: usagePercentage.value,
      tier: usage.value.subscriptionTier,
      canUse: usage.value.canUseInterview,
      resetDate: usage.value.resetDate,
    };
  });

  // Subscription status formatted for display
  const subscriptionInfo = computed(() => {
    if (!subscription.value) return null;

    return {
      status: subscription.value.subscriptionStatus,
      subscriptionId: subscription.value.subscriptionId,
      isPaid: subscription.value.isPaid,
      isActive: subscription.value.subscriptionStatus === 'paid',
    };
  });

  // Methods
  const fetchSubscriptionStatus = async () => {
    return await subscriptionStore.fetchSubscriptionStatus();
  };

  const updateSubscriptionStatus = async (data: {
    subscriptionStatus: 'free' | 'paid';
    subscriptionId?: string;
  }) => {
    return await subscriptionStore.updateSubscriptionStatus(data);
  };

  const fetchCurrentUsage = async () => {
    return await subscriptionStore.fetchCurrentUsage();
  };

  const incrementUsage = async () => {
    return await subscriptionStore.incrementUsage();
  };

  const fetchUsageHistory = async () => {
    return await subscriptionStore.fetchUsageHistory();
  };

  const refreshAll = async () => {
    await Promise.all([fetchSubscriptionStatus(), fetchCurrentUsage(), fetchUsageHistory()]);
  };

  const resetState = () => {
    subscriptionStore.resetState();
  };

  return {
    // Store refs
    subscription,
    isSubscriptionLoading,
    subscriptionError,
    usage,
    isUsageLoading,
    usageError,
    history,
    isHistoryLoading,
    historyError,
    isPaidUser,
    canUseInterview,

    // Computed properties
    subscriptionTier,
    currentUsage,
    monthlyLimit,
    remaining,
    usagePercentage,
    resetDate,
    usageInfo,
    subscriptionInfo,

    // Methods
    fetchSubscriptionStatus,
    updateSubscriptionStatus,
    fetchCurrentUsage,
    incrementUsage,
    fetchUsageHistory,
    refreshAll,
    resetState,
  };
}
