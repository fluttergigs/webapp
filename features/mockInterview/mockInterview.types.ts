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