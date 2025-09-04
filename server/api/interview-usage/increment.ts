import type { EventHandlerRequest } from 'h3';
import { checkInterviewUsage, incrementInterviewUsage } from '~/server/utils/subscription';
import { WebsocketClientManager } from '~/server/utils/websocket_manager';
import { WebSocketChannel } from '~/server/utils/websocket_types';

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

    // Get user ID from body or query params as fallback
    const body = await readBody(event);
    const query = getQuery(event);
    const userId = body.userId || Number(query.userId);

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not authenticated',
      });
    }

    // Check if user can use the feature
    const usageCheck = await checkInterviewUsage(userId);
    if (!usageCheck.canUse) {
      throw createError({
        statusCode: 403,
        statusMessage: usageCheck.message || 'Usage limit exceeded',
      });
    }

    // Generate a session ID if not provided
    const sessionId = body.sessionId || `session_${Date.now()}`;

    // Increment usage
    await incrementInterviewUsage(userId, sessionId);

    // Get updated usage status
    const updatedUsage = await checkInterviewUsage(userId);

    // Emit WebSocket event for real-time UI updates
    const websocketManager = WebsocketClientManager.getInstance();
    for (const [key, peer] of websocketManager.peersList.entries()) {
      peer.publish(WebSocketChannel.INTERVIEW_USAGE, {
        type: 'usage_updated',
        userId,
        usage: updatedUsage,
        message: `Interview usage: ${updatedUsage.currentCount}/${updatedUsage.limit}`,
      });
    }

    return {
      data: {
        currentUsage: updatedUsage.currentCount,
        monthlyLimit: updatedUsage.limit,
        subscriptionTier: updatedUsage.tier,
        canUseInterview: updatedUsage.canUse,
        resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
      },
    };
  } catch (error) {
    console.error('Error incrementing usage:', error);

    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
