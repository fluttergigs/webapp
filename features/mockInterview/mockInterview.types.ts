// Mock Interview Types
export interface MockInterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer?: string;
  hints?: string[];
}

export interface MockInterviewRequest {
  jobPostUrl?: string;
  jobDescription?: string;
  questionCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
}

export interface MockInterviewResponse {
  questions: MockInterviewQuestion[];
  jobTitle?: string;
  company?: string;
  summary?: string;
}

export interface MockInterviewSession {
  id: string;
  questions: MockInterviewQuestion[];
  currentQuestionIndex: number;
  answers: string[];
  startTime: Date;
  endTime?: Date;
  score?: number;
}

// Subscription and Usage Types
export enum SubscriptionTier {
  FREE = 'free',
  PAID = 'paid',
}

export interface SubscriptionLimits {
  monthlyInterviews: number;
  tier: SubscriptionTier;
}

export interface UserSubscription {
  id: string;
  userId: number;
  tier: SubscriptionTier;
  stripeSubscriptionId?: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  limits: SubscriptionLimits;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewUsage {
  id: string;
  userId: number;
  month: string; // Format: 'YYYY-MM'
  count: number;
  lastUsed: Date;
  sessions: MockInterviewSession[];
}

export interface UsageCheckResult {
  canUse: boolean;
  currentCount: number;
  limit: number;
  tier: SubscriptionTier;
  message?: string;
}