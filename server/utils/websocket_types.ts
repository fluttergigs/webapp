export enum WebSocketMessageType {
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
  MESSAGE = 'message',
  SUBSCRIBED = 'subscribed',
  UNSUBSCRIBED = 'unsubscribed',
}

export enum WebSocketChannel {
  NOTIFICATIONS = 'notifications',
  CHAT = 'chat',
  UPDATES = 'updates',
  PAYMENT = 'payment',
  SUBSCRIPTION = 'subscription',
  INTERVIEW_USAGE = 'interview_usage',
  // Add more channels as needed
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  channel: WebSocketChannel;
  data?: any;
}
