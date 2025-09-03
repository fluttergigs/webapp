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
          :subscription="currentSubscription"
          :is-loading="isSubscriptionLoading"
          @upgrade="handleUpgrade"
          @manage="handleManageSubscription"
          @refresh="refreshSubscription"
        />

        <!-- Usage Card -->
        <UsageCard
          :usage="currentUsage"
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

          <div v-if="isUsageLoading" class="space-y-2">
            <USkeleton class="h-4 w-full" v-for="i in 3" :key="i" />
          </div>

          <div v-else-if="usageHistory?.length" class="space-y-3">
            <div 
              v-for="month in usageHistory" 
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
                <UButton color="primary" @click="contactForUpgrade">
                  Contact Us
                </UButton>
              </div>
            </div>
          </div>
        </UCard>
      </UModal>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import type { UserSubscription, UsageCheckResult } from '~/features/mockInterview/mockInterview.types';

definePageMeta({
  middleware: 'auth',
  layout: false,
});

// Reactive state
const currentSubscription = ref<UserSubscription | null>(null);
const currentUsage = ref<UsageCheckResult | null>(null);
const usageHistory = ref<any[]>([]);
const isSubscriptionLoading = ref(false);
const isUsageLoading = ref(false);
const showUpgradeModal = ref(false);

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

// Fetch usage history
const fetchUsageHistory = async () => {
  if (!authStore.authUser?.id) return;
  
  try {
    const { $http } = useNuxtApp();
    const response = await ($http as any).get(`/api/interview-usage/history?userId=${authStore.authUser.id}`);
    usageHistory.value = response.data || [];
  } catch (error) {
    console.error('Error fetching usage history:', error);
    usageHistory.value = [];
  }
};

// Event handlers
const handleUpgrade = () => {
  showUpgradeModal.value = true;
};

const handleManageSubscription = () => {
  // This would redirect to your billing portal
  console.log('Manage subscription clicked');
};

const refreshSubscription = () => {
  fetchSubscription();
};

const refreshUsage = () => {
  fetchUsage();
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
  fetchSubscription();
  fetchUsage();
  fetchUsageHistory();
});

// Set page title
useHead({
  title: 'Subscription & Usage - FlutterGigs',
});
</script>