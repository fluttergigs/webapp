import { useAppStore } from '~/stores/app';
import type { FeatureAnnouncementConfig } from '~/features/announcements/announcements.types';
import { FeatureId } from '~/features/announcements/announcements.types';
import { logDev } from '~/core/helpers/log';

export function useFeatureAnnouncements() {
  const appStore = useAppStore();
  const router = useRouter();

  const shouldShow = (featureId: FeatureId, version: string = '1.0'): boolean => {
    const result = appStore.shouldShowFeatureAnnouncement(featureId, version);
    logDev(`shouldShow for ${featureId}:`, result);
    logDev('Current announcements state:', appStore.featureAnnouncements);

    return result;
  };

  const markAsAnnounced = (featureId: FeatureId, version: string = '1.0'): void => {
    appStore.markFeatureAnnounced(featureId, version);
  };

  const reset = (featureId: FeatureId): void => {
    appStore.resetFeatureAnnouncement(featureId);
  };

  const handleFeatureAction = async (config: FeatureAnnouncementConfig, featureId: FeatureId): Promise<void> => {
    markAsAnnounced(featureId);
    await navigateTo(config.actionRoute);
  };

  // Predefined feature announcements
  const getFeatureConfig = (featureId: FeatureId): FeatureAnnouncementConfig | null => {
    const configs: Record<FeatureId, FeatureAnnouncementConfig> = {
      [FeatureId.MOCK_INTERVIEW]: {
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

  // Generic function to check for feature announcements
  const checkForFeatureAnnouncements = <T extends FeatureId>(
    featureId: T,
    callback: (config: FeatureAnnouncementConfig) => void
  ): boolean => {
    if (shouldShow(featureId)) {
      const config = getFeatureConfig(featureId);
      if (config) {
        callback(config);
        return true;
      }
    }
    return false;
  };

  return {
    shouldShow,
    markAsAnnounced,
    reset,
    handleFeatureAction,
    getFeatureConfig,
    checkForFeatureAnnouncements,
  };
}