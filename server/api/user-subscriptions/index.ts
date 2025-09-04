import type { EventHandlerRequest } from 'h3';
import { getUserSubscription } from '~/server/utils/subscription';

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

    const subscription = await getUserSubscription(userId);

    return {
      success: true,
      data: subscription ? [subscription] : [],
    };
  } catch (error) {
    console.error('Error fetching user subscription:', error);

    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
