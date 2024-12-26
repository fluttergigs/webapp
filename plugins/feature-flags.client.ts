import {FeatureFlagProvider} from "~/services/feature-flag/feature_flag_provider";

export default defineNuxtPlugin(({vueApp}) => {
    const featureFlagsProvider: FeatureFlagProvider = new FeatureFlagProvider();

    featureFlagsProvider.load().then(() => {
    });

    return {
        provide: {
            featureFlags: featureFlagsProvider
        }
    };
});