import type { EventHandlerRequest } from 'h3';
import { updateUserSubscription } from '~/server/utils/subscription';

export default defineEventHandler(async (event: EventHandlerRequest) => {
  try {
    // Get user ID from authentication headers
    const headers = getHeaders(event);
    const authHeader = headers.authorization;
    
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization header required',
      });
    }

    // Extract user ID from JWT token or use a different method
    // For now, we'll get it from query params as a fallback
    const query = getQuery(event);
    const userId = Number(query.userId);

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not authenticated',
      });
    }

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
  } catch (error) {
    console.error('Error updating subscription status:', error);

    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});