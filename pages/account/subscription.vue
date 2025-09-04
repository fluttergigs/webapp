<template>
  <MainLayout>
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Subscription & Usage</h1>
        <p class="text-gray-600">Manage your subscription and track your mock interview usage</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Subscription Card -->
        <SubscriptionCard
          :subscription="subscriptionInfo"
          :is-loading="isSubscriptionLoading"
          @upgrade="handleUpgrade"
          @manage="handleManageSubscription"
          @refresh="refreshSubscription"
        />

        <!-- Usage Card -->
        <UsageCard
          :usage="usageInfo || currentUsage"
          :is-loading="isUsageLoading"
          @upgrade="handleUpgrade"
          @refresh="refreshUsage"
        />
      </div>

      <!-- Usage History -->
      <div class="mt-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Usage History</h3>
          </template>

          <div v-if="isHistoryLoading" class="space-y-2">
            <USkeleton class="h-4 w-full" v-for="i in 3" :key="i" />
          </div>

          <div v-else-if="history?.length" class="space-y-3">
            <div
              v-for="month in history"
              :key="month.month"
              class="flex justify-between items-center p-3 border rounded-lg"
            >
              <div>
                <span class="font-medium">{{ formatMonth(month.month) }}</span>
                <p class="text-sm text-gray-600">{{ month.count }} interviews used</p>
              </div>
              <UBadge
                :color="month.count >= month.limit ? 'red' : 'green'"
                :label="`${month.count}/${month.limit}`"
              />
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <p>No usage history available</p>
          </div>
        </UCard>
      </div>

      <!-- Upgrade Modal -->
      <UModal v-model="showUpgradeModal">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Upgrade to Pro</h3>
          </template>

          <div class="space-y-6">
            <div class="text-center">
              <h4 class="text-2xl font-bold text-gray-900 mb-2">Pro Plan</h4>
              <p class="text-gray-600">Get more mock interviews and advanced features</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="text-center p-4 border rounded-lg">
                <h5 class="font-semibold text-gray-900 mb-2">Free Plan</h5>
                <p class="text-2xl font-bold text-gray-600 mb-2">3</p>
                <p class="text-sm text-gray-500">interviews/month</p>
              </div>

              <div class="text-center p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                <h5 class="font-semibold text-blue-900 mb-2">Pro Plan</h5>
                <p class="text-2xl font-bold text-blue-600 mb-2">20</p>
                <p class="text-sm text-blue-600">interviews/month</p>
              </div>
            </div>

            <div class="text-center">
              <p class="text-sm text-gray-600 mb-4">
                Ready to upgrade? Contact us to set up your Pro subscription.
              </p>

              <div class="flex justify-center space-x-3">
                <UButton color="gray" variant="ghost" @click="showUpgradeModal = false">
                  Cancel
                </UButton>
                <UButton color="primary" @click="contactForUpgrade"> Contact Us </UButton>
              </div>
            </div>
          </div>
        </UCard>
      </UModal>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
    layout: false,
  });

  // Reactive state
  const showUpgradeModal = ref(false);

  // Use subscription and mock interview composables
  const {
    subscriptionInfo,
    usageInfo,
    history,
    isSubscriptionLoading,
    isUsageLoading,
    isHistoryLoading,
    fetchSubscriptionStatus,
    fetchCurrentUsage,
    fetchUsageHistory,
    refreshAll,
  } = useSubscription();

  // Use existing mock interview composable for compatibility
  const { currentUsage } = useMockInterviews();

  // Event handlers
  const handleUpgrade = () => {
    showUpgradeModal.value = true;
  };

  const handleManageSubscription = () => {
    // This would redirect to your billing portal
    console.log('Manage subscription clicked');
  };

  const refreshSubscription = () => {
    fetchSubscriptionStatus();
  };

  const refreshUsage = () => {
    fetchCurrentUsage();
  };

  const contactForUpgrade = () => {
    // This would open contact form or redirect to contact page
    window.open('mailto:support@fluttergigs.com?subject=Pro Plan Upgrade Request', '_blank');
    showUpgradeModal.value = false;
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Initialize
  onMounted(() => {
    refreshAll();
  });

  // Set page title
  useHead({
    title: 'Subscription & Usage - FlutterGigs',
  });
</script>
