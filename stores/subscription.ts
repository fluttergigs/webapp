import { defineStore } from 'pinia';
import { logDev } from '~/core/helpers/log';
import type { HttpClient } from '~/core/network/http_client';
import { Wrapper } from '~/core/wrapper';

interface SubscriptionStatus {
  subscriptionStatus: 'free' | 'paid';
  subscriptionId: string | null;
  isPaid: boolean;
}

interface CurrentUsage {
  currentUsage: number;
  monthlyLimit: number;
  subscriptionTier: 'free' | 'paid';
  canUseInterview: boolean;
  resetDate: string;
}

interface UsageHistory {
  month: string;
  count: number;
  limit: number;
  sessions: number;
}

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    subscriptionStatus: new Wrapper<SubscriptionStatus>().toInitial(),
    currentUsage: new Wrapper<CurrentUsage>().toInitial(),
    usageHistory: new Wrapper<UsageHistory[]>().toInitial(),
  }),

  actions: {
    async fetchSubscriptionStatus(): Promise<SubscriptionStatus | null> {
      this.subscriptionStatus = new Wrapper<SubscriptionStatus>().toLoading();

      try {
        const authStore = useAuthStore();
        if (!authStore.authUser?.id) {
          throw new Error('User not authenticated');
        }

        const { $http } = useNuxtApp();
        const response = await ($http as HttpClient).get<{
          data: SubscriptionStatus;
        }>('/api/subscription-status');

        this.subscriptionStatus = this.subscriptionStatus.toSuccess(response.data);
        return response.data;
      } catch (error) {
        logDev('Error fetching subscription status:', error);
        this.subscriptionStatus = this.subscriptionStatus.toFailed(
          'Unable to fetch subscription status',
        );
        return null;
      }
    },

    async updateSubscriptionStatus(data: {
      subscriptionStatus: 'free' | 'paid';
      subscriptionId?: string;
    }): Promise<SubscriptionStatus | null> {
      try {
        const authStore = useAuthStore();
        if (!authStore.authUser?.id) {
          throw new Error('User not authenticated');
        }

        const { $http } = useNuxtApp();
        const response = await ($http as HttpClient).put<{
          data: SubscriptionStatus;
        }>('/api/subscription-status', { data });

        this.subscriptionStatus = this.subscriptionStatus.toSuccess(response.data);
        return response.data;
      } catch (error) {
        logDev('Error updating subscription status:', error);
        this.subscriptionStatus = this.subscriptionStatus.toFailed(
          'Unable to update subscription status',
        );
        return null;
      }
    },

    async fetchCurrentUsage(): Promise<CurrentUsage | null> {
      this.currentUsage = new Wrapper<CurrentUsage>().toLoading();

      try {
        const authStore = useAuthStore();
        if (!authStore.authUser?.id) {
          throw new Error('User not authenticated');
        }

        const { $http } = useNuxtApp();
        const response = await ($http as HttpClient).get<{
          data: CurrentUsage;
        }>('/api/interview-usage/current');

        this.currentUsage = this.currentUsage.toSuccess(response.data);
        return response.data;
      } catch (error) {
        logDev('Error fetching current usage:', error);
        this.currentUsage = this.currentUsage.toFailed('Unable to fetch usage data');
        return null;
      }
    },

    async incrementUsage(): Promise<CurrentUsage | null> {
      try {
        const authStore = useAuthStore();
        if (!authStore.authUser?.id) {
          throw new Error('User not authenticated');
        }

        const { $http } = useNuxtApp();
        const response = await ($http as HttpClient).post<{
          data: CurrentUsage;
        }>('/api/interview-usage/increment');

        this.currentUsage = this.currentUsage.toSuccess(response.data);
        return response.data;
      } catch (error) {
        logDev('Error incrementing usage:', error);
        return null;
      }
    },

    async fetchUsageHistory(): Promise<UsageHistory[] | null> {
      this.usageHistory = new Wrapper<UsageHistory[]>().toLoading();

      try {
        const authStore = useAuthStore();
        if (!authStore.authUser?.id) {
          throw new Error('User not authenticated');
        }

        const { $http } = useNuxtApp();
        const response = await ($http as HttpClient).get<{
          data: UsageHistory[];
        }>('/api/interview-usages');

        this.usageHistory = this.usageHistory.toSuccess(response.data);
        return response.data;
      } catch (error) {
        logDev('Error fetching usage history:', error);
        this.usageHistory = this.usageHistory.toFailed('Unable to fetch usage history');
        return null;
      }
    },

    resetState() {
      this.subscriptionStatus = new Wrapper<SubscriptionStatus>().toInitial();
      this.currentUsage = new Wrapper<CurrentUsage>().toInitial();
      this.usageHistory = new Wrapper<UsageHistory[]>().toInitial();
    },
  },

  getters: {
    subscription: (state) => state.subscriptionStatus?.value,
    isSubscriptionLoading: (state) => state.subscriptionStatus?.isLoading ?? false,
    subscriptionError: (state) => state.subscriptionStatus?.message,

    usage: (state) => state.currentUsage?.value,
    isUsageLoading: (state) => state.currentUsage?.isLoading ?? false,
    usageError: (state) => state.currentUsage?.message,

    history: (state) => state.usageHistory?.value ?? [],
    isHistoryLoading: (state) => state.usageHistory?.isLoading ?? false,
    historyError: (state) => state.usageHistory?.message,

    isPaidUser: (state) => state.subscriptionStatus?.value?.isPaid ?? false,
    canUseInterview: (state) => state.currentUsage?.value?.canUseInterview ?? false,
  },

  persist: {
    paths: ['subscriptionStatus'],
    storage: persistedState.localStorage,
    debug: import.meta.env.MODE === 'development',
  },
});
