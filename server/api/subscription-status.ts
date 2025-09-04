import type { EventHandlerRequest } from 'h3';
import { getUserSubscription, updateUserSubscription } from '~/server/utils/subscription';

export default defineEventHandler(async (event: EventHandlerRequest) => {
  try {
    const method = getMethod(event);
    const authStore = useAuthStore();

    // Get user ID from auth token
    const userId = authStore?.authUser?.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not authenticated',
      });
    }

    if (method === 'GET') {
      // Get subscription status
      const subscription = await getUserSubscription(userId);

      return {
        data: {
          subscriptionStatus: subscription?.tier || 'free',
          subscriptionId: subscription?.stripeSubscriptionId || null,
          isPaid: subscription?.tier === 'paid' || false,
        },
      };
    }

    if (method === 'PUT') {
      // Update subscription status
      const body = await readBody(event);
      const { data } = body;

      if (!data || !data.subscriptionStatus) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Subscription status is required',
        });
      }

      // Update subscription
      await updateUserSubscription({
        userId,
        tier: data.subscriptionStatus,
        stripeSubscriptionId: data.subscriptionId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        limits: {
          monthlyInterviews: data.subscriptionStatus === 'paid' ? 20 : 3,
          tier: data.subscriptionStatus,
        },
      });

      return {
        data: {
          subscriptionStatus: data.subscriptionStatus,
          subscriptionId: data.subscriptionId || null,
          isPaid: data.subscriptionStatus === 'paid',
          newLimits: {
            monthlyLimit: data.subscriptionStatus === 'paid' ? 20 : 3,
          },
        },
      };
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    });
  } catch (error) {
    console.error('Error in subscription status endpoint:', error);

    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
