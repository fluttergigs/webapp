import type { EventHandlerRequest } from 'h3';
import { checkInterviewUsage, incrementInterviewUsage } from '~/server/utils/subscription';
import { WebsocketClientManager } from '~/server/utils/websocket_manager';
import { WebSocketChannel } from '~/server/utils/websocket_types';

export default defineEventHandler(async (event: EventHandlerRequest) => {
  try {
    const method = getMethod(event);

    if (method === 'GET') {
      // Check usage status
      const query = getQuery(event);
      const userId = Number(query.userId);

      if (!userId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'User ID is required',
        });
      }

      const usageResult = await checkInterviewUsage(userId);

      return {
        success: true,
        data: usageResult,
      };
    }

    if (method === 'POST') {
      // Increment usage count
      const body = await readBody(event);
      const { userId, sessionId } = body;

      if (!userId || !sessionId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'User ID and session ID are required',
        });
      }

      // First check if user can use the feature
      const usageCheck = await checkInterviewUsage(userId);
      if (!usageCheck.canUse) {
        throw createError({
          statusCode: 403,
          statusMessage: usageCheck.message || 'Usage limit exceeded',
        });
      }

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
        success: true,
        data: updatedUsage,
        message: 'Usage recorded successfully',
      };
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    });
  } catch (error) {
    console.error('Error in interview usage endpoint:', error);

    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
