import type { EventHandlerRequest } from 'h3';
import { getUserSubscription } from '~/server/utils/subscription';

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

    // Get subscription status
    const subscription = await getUserSubscription(userId);

    return {
      data: {
        subscriptionStatus: subscription?.tier || 'free',
        subscriptionId: subscription?.stripeSubscriptionId || null,
        isPaid: subscription?.tier === 'paid' || false,
      },
    };
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