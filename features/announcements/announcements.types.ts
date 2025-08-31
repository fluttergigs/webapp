export enum FeatureId {
  MOCK_INTERVIEW = 'mock-interview',
  // Add future feature IDs here
}

export interface FeatureAnnouncementConfig {
  title: string;
  description: string;
  featureName: string;
  actionText: string;
  actionRoute: string;
  icon?: string;
  gradient?: string;
}