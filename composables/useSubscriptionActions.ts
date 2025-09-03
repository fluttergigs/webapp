import { logDev } from '~/core/helpers/log';
import type { UserSubscription, SubscriptionTier } from '~/features/mockInterview/mockInterview.types';
import { BaseToast } from '~/core/ui/base_toast';
//@ts-ignore
import type { Notification } from '#ui/types';

export default function useSubscriptionActions() {
  const { $toast } = useNuxtApp();
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const mockInterviewStore = useMockInterviewStore();

  const handleSubscriptionUpdate = async (data: any) => {
    logDev('Subscription webhook data received:', data);
    
    const userId = authStore.authUser?.id;
    if (!userId || data.userId !== userId) {
      return; // Not for current user
    }

    // Show notification to user
    if (data.tier === 'paid') {
      ($toast as BaseToast<Notification>).success(
        'Your subscription has been upgraded! You now have access to more mock interviews.'
      );
    } else if (data.tier === 'free') {
      ($toast as BaseToast<Notification>).info(
        'Your subscription status has been updated.'
      );
    }

    // Refresh usage limits
    try {
      await mockInterviewStore.checkUsageLimit();
    } catch (error) {
      logDev('Error refreshing usage limits:', error);
    }

    // You can also refresh user data if needed
    try {
      await useUser().getUser();
    } catch (error) {
      logDev('Error refreshing user data:', error);
    }
  };

  const handleInterviewUsageUpdate = async (data: any) => {
    logDev('Interview usage update received:', data);
    
    const userId = authStore.authUser?.id;
    if (!userId || data.userId !== userId) {
      return; // Not for current user
    }

    // Refresh usage limits in the store
    try {
      await mockInterviewStore.checkUsageLimit();
    } catch (error) {
      logDev('Error refreshing usage after update:', error);
    }
  };

  return {
    handleSubscriptionUpdate,
    handleInterviewUsageUpdate,
  };
}