import { ApplicationEventEnum } from '~/plugins/eventBus.client';
import type { FeatureFlag } from '~/services/feature-flag/FeatureFlag';
import { FeatureFlagProvider } from '~/services/feature-flag/FeatureFlagProvider';
import type { AvailableFlags } from '~/services/feature-flag/availableFlags';

export function useFeatureFlags() {
  const { $featureFlags, $event } = useNuxtApp();

  const isEnabled = (flag: AvailableFlags, defaultValue: boolean = false): boolean =>
    ($featureFlags as FeatureFlagProvider)?.isEnabled(flag) ?? defaultValue;

  const getFlag = (flag: AvailableFlags): FeatureFlag =>
    ($featureFlags as FeatureFlagProvider).get(flag);

  const loadFlags = async (): Promise<void> => {
    await ($featureFlags as FeatureFlagProvider)?.load();

    //@ts-ignore
    $event(ApplicationEventEnum.featureFlagsLoaded, { data: {} });
  };

  return { isEnabled, loadFlags, getFlag };
}
