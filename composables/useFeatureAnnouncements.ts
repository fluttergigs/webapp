import { useAppStore } from '~/stores/app';

interface FeatureAnnouncementConfig {
  title: string;
  description: string;
  featureName: string;
  actionText: string;
  actionRoute: string;
  icon?: string;
  gradient?: string;
}

export function useFeatureAnnouncements() {
  const appStore = useAppStore();
  const router = useRouter();

  const shouldShow = (featureId: string, version: string = '1.0'): boolean => {
    return appStore.shouldShowFeatureAnnouncement(featureId, version);
  };

  const markAsAnnounced = (featureId: string, version: string = '1.0'): void => {
    appStore.markFeatureAnnounced(featureId, version);
  };

  const reset = (featureId: string): void => {
    appStore.resetFeatureAnnouncement(featureId);
  };

  const handleFeatureAction = async (config: FeatureAnnouncementConfig, featureId: string): Promise<void> => {
    markAsAnnounced(featureId);
    await navigateTo(config.actionRoute);
  };

  // Predefined feature announcements
  const getFeatureConfig = (featureId: string): FeatureAnnouncementConfig | null => {
    const configs: Record<string, FeatureAnnouncementConfig> = {
      'mock-interview': {
        title: 'AI-Powered Mock Interviews',
        description: 'Practice for your Flutter job interviews with personalized AI-generated questions based on real job postings. Build confidence and improve your interview skills.',
        featureName: 'Mock Interview Practice',
        actionText: 'Try Mock Interview',
        actionRoute: '/jobs/mock-interview',
        icon: '🎯',
        gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
      },
    };

    return configs[featureId] || null;
  };

  return {
    shouldShow,
    markAsAnnounced,
    reset,
    handleFeatureAction,
    getFeatureConfig,
  };
}