import type { EventHandlerRequest } from 'h3';
import { WebsocketClientManager } from '~/server/utils/websocket_manager';
import { WebSocketChannel } from '~/server/utils/websocket_types';
import { 
  updateUserSubscription, 
  SUBSCRIPTION_LIMITS 
} from '~/server/utils/subscription';
import type { 
  UserSubscription, 
  SubscriptionTier 
} from '~/features/mockInterview/mockInterview.types';

interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
}

interface StripeSubscription {
  id: string;
  customer: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'trialing';
  current_period_start: number;
  current_period_end: number;
  items: {
    data: Array<{
      price: {
        id: string;
        nickname?: string;
      };
    }>;
  };
}

interface StripeCustomer {
  id: string;
  email: string;
  metadata: {
    userId?: string;
  };
}

/**
 * Map Stripe subscription status to our subscription tier
 */
function mapStripeStatusToTier(subscription: StripeSubscription): SubscriptionTier {
  // Check if subscription is active and has paid plan
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    // You can customize this logic based on your Stripe price IDs
    const priceId = subscription.items.data[0]?.price?.id;
    if (priceId && priceId !== process.env.STRIPE_FREE_PRICE_ID) {
      return 'paid' as SubscriptionTier;
    }
  }
  return 'free' as SubscriptionTier;
}

/**
 * Get user ID from Stripe customer
 */
async function getUserIdFromCustomer(customerId: string): Promise<number | null> {
  try {
    const config = useRuntimeConfig();
    const strapiUrl = config.strapi?.url || 'http://localhost:1337';
    
    // Find user by stripeCustomerId
    const response = await $fetch<{ data: Array<{ id: number }> }>(`${strapiUrl}/api/users`, {
      params: {
        'filters[stripeCustomerId][$eq]': customerId,
        'pagination[limit]': 1,
      },
    });

    return response.data?.[0]?.id || null;
  } catch (error) {
    console.error('Error finding user by Stripe customer ID:', error);
    return null;
  }
}

/**
 * Handle subscription created/updated events
 */
async function handleSubscriptionChange(subscription: StripeSubscription, eventType: string) {
  const userId = await getUserIdFromCustomer(subscription.customer);
  if (!userId) {
    console.error('User not found for Stripe customer:', subscription.customer);
    return;
  }

  const tier = mapStripeStatusToTier(subscription);
  const limits = SUBSCRIPTION_LIMITS[tier];

  const subscriptionData: Partial<UserSubscription> = {
    userId,
    tier,
    stripeSubscriptionId: subscription.id,
    status: subscription.status as any,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    limits,
    updatedAt: new Date(),
  };

  if (eventType === 'customer.subscription.created') {
    subscriptionData.createdAt = new Date();
  }

  await updateUserSubscription(subscriptionData);

  // Emit WebSocket event for real-time UI updates
  const websocketManager = WebsocketClientManager.getInstance();
  for (const [key, peer] of websocketManager.peersList.entries()) {
    peer.publish(WebSocketChannel.SUBSCRIPTION, {
      type: eventType,
      userId,
      subscription: subscriptionData,
      message: `Subscription ${subscription.status}`,
    });
  }
}

/**
 * Handle payment succeeded events
 */
async function handlePaymentSucceeded(paymentIntent: any) {
  const customerId = paymentIntent.customer;
  const userId = await getUserIdFromCustomer(customerId);
  
  if (!userId) {
    console.error('User not found for payment:', customerId);
    return;
  }

  // Emit payment confirmation via WebSocket
  const websocketManager = WebsocketClientManager.getInstance();
  for (const [key, peer] of websocketManager.peersList.entries()) {
    peer.publish(WebSocketChannel.PAYMENT, {
      type: 'payment_succeeded',
      userId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      message: 'Payment processed successfully',
    });
  }
}

export default defineEventHandler(async (event: EventHandlerRequest) => {
  try {
    const body = await readBody(event);
    const stripeEvent: StripeEvent = body;

    console.log('Received Stripe webhook:', stripeEvent.type);

    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(stripeEvent.data.object as StripeSubscription, stripeEvent.type);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = stripeEvent.data.object as StripeSubscription;
        const userId = await getUserIdFromCustomer(deletedSubscription.customer);
        
        if (userId) {
          // Reset to free tier
          await updateUserSubscription({
            userId,
            tier: 'free',
            status: 'canceled',
            limits: SUBSCRIPTION_LIMITS['free'],
            updatedAt: new Date(),
          });

          // Emit WebSocket event
          const websocketManager = WebsocketClientManager.getInstance();
          for (const [key, peer] of websocketManager.peersList.entries()) {
            peer.publish(WebSocketChannel.SUBSCRIPTION, {
              type: 'subscription_canceled',
              userId,
              message: 'Subscription canceled, reverted to free tier',
            });
          }
        }
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object);
        break;

      case 'invoice.payment_succeeded':
        const invoice = stripeEvent.data.object;
        const invoiceUserId = await getUserIdFromCustomer(invoice.customer);
        
        if (invoiceUserId) {
          const websocketManager = WebsocketClientManager.getInstance();
          for (const [key, peer] of websocketManager.peersList.entries()) {
            peer.publish(WebSocketChannel.PAYMENT, {
              type: 'invoice_paid',
              userId: invoiceUserId,
              amount: invoice.amount_paid,
              message: 'Invoice payment successful',
            });
          }
        }
        break;

      case 'invoice.payment_failed':
        const failedInvoice = stripeEvent.data.object;
        const failedUserId = await getUserIdFromCustomer(failedInvoice.customer);
        
        if (failedUserId) {
          const websocketManager = WebsocketClientManager.getInstance();
          for (const [key, peer] of websocketManager.peersList.entries()) {
            peer.publish(WebSocketChannel.PAYMENT, {
              type: 'invoice_payment_failed',
              userId: failedUserId,
              message: 'Invoice payment failed',
            });
          }
        }
        break;

      default:
        console.log('Unhandled Stripe event type:', stripeEvent.type);
    }

    return { received: true };
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    throw createError({
      statusCode: 400,
      statusMessage: 'Webhook processing failed',
    });
  }
});