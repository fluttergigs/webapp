# Stripe Webhook & Mock Interview Usage Handler

This implementation provides a comprehensive Stripe webhook system and mock interview usage tracking for the FlutterGigs platform.

## Features Implemented

### 1. Subscription Management
- **Free Tier**: 3 mock interviews per month
- **Paid Tier**: 20 mock interviews per month
- Automatic tier detection from Stripe subscription events
- Monthly usage reset with calendar month tracking

### 2. Stripe Webhook Handler (`/api/stripe-webhook`)
Handles the following Stripe events:
- `customer.subscription.created` - New subscription setup
- `customer.subscription.updated` - Subscription modifications
- `customer.subscription.deleted` - Subscription cancellation
- `payment_intent.succeeded` - Successful payments
- `invoice.payment_succeeded` - Successful invoice payments
- `invoice.payment_failed` - Failed invoice payments

### 3. Interview Usage Tracking (`/api/interview-usage`)
- **GET** `?userId=X` - Check current usage status and limits
- **POST** `{userId, sessionId}` - Record new interview session

### 4. Real-time Updates via WebSocket
- Subscription status changes
- Payment confirmations
- Usage limit updates
- Automatic UI synchronization

### 5. Database Integration
- Strapi CMS integration for user subscriptions
- Monthly usage tracking with session history
- Automatic usage reset for new months

## API Endpoints

### Stripe Webhook: `POST /api/stripe-webhook`
```json
{
  "id": "evt_...",
  "type": "customer.subscription.created",
  "data": {
    "object": {
      "id": "sub_...",
      "customer": "cus_...",
      "status": "active",
      "current_period_start": 1640995200,
      "current_period_end": 1643673600,
      "items": {...}
    }
  }
}
```

### Usage Check: `GET /api/interview-usage?userId=1`
```json
{
  "success": true,
  "data": {
    "canUse": true,
    "currentCount": 2,
    "limit": 3,
    "tier": "free",
    "message": "You have 1 interviews remaining this month."
  }
}
```

### Record Usage: `POST /api/interview-usage`
```json
{
  "userId": 1,
  "sessionId": "session_123456789"
}
```

## Frontend Integration

### Updated Mock Interview Store
- Automatic usage checking before generation
- Real-time usage tracking
- Limit enforcement with user-friendly messages

### Enhanced Composables
- `useMockInterviews()` now includes usage information
- Real-time UI updates for usage status
- Graceful handling of limit exceeded scenarios

## WebSocket Channels
- `SUBSCRIPTION` - Subscription status changes
- `INTERVIEW_USAGE` - Usage tracking updates
- `PAYMENT` - Payment confirmations and failures

## Database Schema Requirements

### Strapi Collections Needed:

1. **user-subscriptions**
```json
{
  "userId": "number",
  "tier": "enum[free,paid]",
  "stripeSubscriptionId": "string",
  "status": "enum[active,canceled,past_due,unpaid]",
  "currentPeriodStart": "datetime",
  "currentPeriodEnd": "datetime",
  "limits": "json",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

2. **interview-usages**
```json
{
  "userId": "number",
  "month": "string", // Format: "YYYY-MM"
  "count": "number",
  "lastUsed": "datetime",
  "sessions": "json"
}
```

## Environment Variables

```bash
# Stripe Configuration
STRIPE_FREE_PRICE_ID=price_free_plan_id

# Strapi Configuration
STRAPI_URL=http://localhost:1337
```

## Testing

All endpoints have been tested and are functioning correctly:
- ✅ Stripe webhook processing
- ✅ Usage checking and recording
- ✅ Limit enforcement
- ✅ WebSocket event broadcasting
- ✅ Error handling and fallbacks

## Error Handling

The implementation includes comprehensive error handling:
- Graceful degradation when Strapi is unavailable
- Default limits for unauthenticated users
- Fallback responses for API failures
- Detailed error logging for debugging

## Security Considerations

- User ID validation for all operations
- Proper error messages without sensitive data exposure
- Strapi integration uses standard authentication patterns
- WebSocket events are properly scoped to user sessions