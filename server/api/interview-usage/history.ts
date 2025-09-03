import type { EventHandlerRequest } from 'h3';
import { getCurrentMonth } from '~/server/utils/subscription';

export default defineEventHandler(async (event: EventHandlerRequest) => {
  try {
    const query = getQuery(event);
    const userId = Number(query.userId);
    
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required',
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

    const usageHistory = response.data?.map(usage => ({
      month: usage.month,
      count: usage.count,
      limit: 20, // You might want to get this from subscription data
      sessions: usage.sessions?.length || 0,
    })) || [];

    return {
      success: true,
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