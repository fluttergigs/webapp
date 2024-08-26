import type {AvailableFlags} from "~/services/feature-flag/available_flags";
import type {FeatureFlag} from "~/services/feature-flag/feature_flag";
import {FeatureFlagProvider} from "~/services/feature-flag/feature_flag_provider";


export function useFeatureFlags() {

    const {$featureFlags} = useNuxtApp();

    const isEnabled = (flag: AvailableFlags, defaultValue: boolean = false): boolean => ($featureFlags as FeatureFlagProvider).isEnabled(flag) ?? defaultValue;

    const getFlag = (flag: AvailableFlags): FeatureFlag => ($featureFlags as FeatureFlagProvider).get(flag);

    const loadFlags = async (): Promise<void> => {
        await ($featureFlags as FeatureFlagProvider).load();
    };

    return {isEnabled, loadFlags, getFlag};

}