import type {AvailableFlags} from "~/services/feature-flag/available_flags";
import {FeatureFlagProvider} from "~/services/feature-flag/feature_flag_provider";


export default function useFeatureFlags() {
    const {$featureFlags} = useNuxtApp()

    const isFeatureEnabled = (feature: AvailableFlags, defaultValue?: boolean) =>
        ($featureFlags as FeatureFlagProvider).isEnabled(feature, defaultValue ?? false)

    const loadFlags = async (): Promise<void> => {
        await ($featureFlags as FeatureFlagProvider).load()
    }

    return {isFeatureEnabled, loadFlags}
}