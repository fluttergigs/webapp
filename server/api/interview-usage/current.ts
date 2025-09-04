import type { EventHandlerRequest } from 'h3';
import { checkInterviewUsage } from '~/server/utils/subscription';

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

    const currentUsage = await checkInterviewUsage(userId);

    return {
      data: {
        currentUsage: currentUsage.currentCount,
        monthlyLimit: currentUsage.limit,
        subscriptionTier: currentUsage.tier,
        canUseInterview: currentUsage.canUse,
        resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
      },
    };
  } catch (error) {
    console.error('Error fetching current usage:', error);

    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
