import type { EventHandlerRequest } from 'h3';

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

    const config = useRuntimeConfig();
    const strapiUrl = config.strapi?.url || 'http://localhost:1337';

    // Get interview usage records for the user (last 6 months)
    const response = await $fetch<{ data: any[] }>(`${strapiUrl}/api/interview-usages`, {
      params: {
        'filters[userId][$eq]': userId,
        'sort[0]': 'month:desc',
        'pagination[limit]': 6,
      },
    });

    const usageHistory =
      response.data?.map((usage) => ({
        month: usage.month,
        count: usage.count,
        limit: usage.tier === 'paid' ? 20 : 3, // Get limit based on tier
        sessions: usage.sessions?.length || 0,
      })) || [];

    return {
      data: usageHistory,
    };
  } catch (error) {
    console.error('Error fetching usage history:', error);

    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
