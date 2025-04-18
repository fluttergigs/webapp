import type { FeatureFlag } from '~/services/feature-flag/FeatureFlag';
import { FeatureFlagProvider } from '~/services/feature-flag/FeatureFlagProvider';
import type { AvailableFlags } from '~/services/feature-flag/availableFlags';

export function useFeatureFlags() {
  const { $featureFlags } = useNuxtApp();

  const isEnabled = (flag: AvailableFlags, defaultValue: boolean = false): boolean => {
    if (import.meta.client) {
      return ($featureFlags as FeatureFlagProvider)?.isEnabled(flag) ?? defaultValue;
    }
    return false;
  };

  const getFlag = (flag: AvailableFlags): FeatureFlag =>
    ($featureFlags as FeatureFlagProvider).get(flag);

  const loadFlags = async (): Promise<void> => {
    await ($featureFlags as FeatureFlagProvider)?.load();
  };

  return { isEnabled, loadFlags, getFlag };
}
