import type { 
  UserSubscription, 
  InterviewUsage, 
  SubscriptionTier, 
  UsageCheckResult,
  SubscriptionLimits 
} from '~/features/mockInterview/mockInterview.types';

// Subscription limits configuration
export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  'free': {
    monthlyInterviews: 3,
    tier: 'free',
  },
  'paid': {
    monthlyInterviews: 20,
    tier: 'paid',
  },
};

/**
 * Get current month string in YYYY-MM format
 */
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Get user's current subscription from Strapi
 */
export async function getUserSubscription(userId: number): Promise<UserSubscription | null> {
  try {
    const config = useRuntimeConfig();
    const strapiUrl = config.strapi?.url || 'http://localhost:1337';
    
    const response = await $fetch<{ data: UserSubscription[] }>(`${strapiUrl}/api/user-subscriptions`, {
      params: {
        'filters[userId][$eq]': userId,
        'sort[0]': 'createdAt:desc',
        'pagination[limit]': 1,
      },
    });

    return response.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }
}

/**
 * Get or create interview usage record for current month
 */
export async function getOrCreateInterviewUsage(userId: number): Promise<InterviewUsage> {
  try {
    const config = useRuntimeConfig();
    const strapiUrl = config.strapi?.url || 'http://localhost:1337';
    const currentMonth = getCurrentMonth();

    // Try to get existing usage for current month
    const existingResponse = await $fetch<{ data: InterviewUsage[] }>(`${strapiUrl}/api/interview-usages`, {
      params: {
        'filters[userId][$eq]': userId,
        'filters[month][$eq]': currentMonth,
      },
    });

    if (existingResponse.data?.length > 0) {
      return existingResponse.data[0];
    }

    // Create new usage record if none exists
    const newUsage: Partial<InterviewUsage> = {
      userId,
      month: currentMonth,
      count: 0,
      lastUsed: new Date(),
      sessions: [],
    };

    const createResponse = await $fetch<{ data: InterviewUsage }>(`${strapiUrl}/api/interview-usages`, {
      method: 'POST',
      body: { data: newUsage },
    });

    return createResponse.data;
  } catch (error) {
    console.error('Error getting/creating interview usage:', error);
    // Return default usage if API fails
    return {
      id: 'default',
      userId,
      month: getCurrentMonth(),
      count: 0,
      lastUsed: new Date(),
      sessions: [],
    };
  }
}

/**
 * Check if user can use mock interview feature
 */
export async function checkInterviewUsage(userId: number): Promise<UsageCheckResult> {
  try {
    const subscription = await getUserSubscription(userId);
    const usage = await getOrCreateInterviewUsage(userId);

    // Default to free tier if no subscription
    const tier = subscription?.tier || 'free';
    const limits = SUBSCRIPTION_LIMITS[tier];

    const canUse = usage.count < limits.monthlyInterviews;
    
    return {
      canUse,
      currentCount: usage.count,
      limit: limits.monthlyInterviews,
      tier,
      message: canUse 
        ? `You have ${limits.monthlyInterviews - usage.count} interviews remaining this month.`
        : `You've reached your monthly limit of ${limits.monthlyInterviews} interviews. Upgrade to increase your limit.`,
    };
  } catch (error) {
    console.error('Error checking interview usage:', error);
    // Default to allowing usage with free tier limits
    return {
      canUse: true,
      currentCount: 0,
      limit: SUBSCRIPTION_LIMITS['free'].monthlyInterviews,
      tier: 'free',
      message: 'Usage check failed, defaulting to free tier limits.',
    };
  }
}

/**
 * Increment interview usage count
 */
export async function incrementInterviewUsage(userId: number, sessionId: string): Promise<void> {
  try {
    const config = useRuntimeConfig();
    const strapiUrl = config.strapi?.url || 'http://localhost:1337';
    const usage = await getOrCreateInterviewUsage(userId);

    const updatedUsage = {
      count: usage.count + 1,
      lastUsed: new Date(),
      sessions: [...(usage.sessions || []), { id: sessionId, startTime: new Date() }],
    };

    await $fetch(`${strapiUrl}/api/interview-usages/${usage.id}`, {
      method: 'PUT',
      body: { data: updatedUsage },
    });
  } catch (error) {
    console.error('Error incrementing interview usage:', error);
  }
}

/**
 * Update user subscription in Strapi
 */
export async function updateUserSubscription(subscription: Partial<UserSubscription>): Promise<void> {
  try {
    const config = useRuntimeConfig();
    const strapiUrl = config.strapi?.url || 'http://localhost:1337';

    // Always try to find existing subscription first
    const existingResponse = await $fetch<{ data: UserSubscription[] }>(`${strapiUrl}/api/user-subscriptions`, {
      params: {
        'filters[userId][$eq]': subscription.userId,
        'pagination[limit]': 1,
      },
    });

    if (existingResponse.data?.length > 0) {
      // Update existing subscription
      const existingId = existingResponse.data[0].id;
      await $fetch(`${strapiUrl}/api/user-subscriptions/${existingId}`, {
        method: 'PUT',
        body: { data: subscription },
      });
    } else {
      // Create new subscription
      await $fetch(`${strapiUrl}/api/user-subscriptions`, {
        method: 'POST',
        body: { data: subscription },
      });
    }
  } catch (error) {
    console.error('Error updating user subscription:', error);
    // Don't throw error to avoid disrupting the webhook flow
  }
}