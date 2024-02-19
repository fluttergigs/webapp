import posthog from "posthog-js";
import {FeatureFlag} from "~/services/feature-flag/feature_flag";

export class PosthogClient implements FeatureFlag {

  constructor() {
    try {
      const { public: { posthogKey } } = useRuntimeConfig();

      const posthogClient = posthog.init(posthogKey, {
        capture_pageleave: false,
        capture_pageview: false,
        name: "Flutter Gigs",
        advanced_disable_feature_flags: false,
        advanced_disable_feature_flags_on_first_load: false,
        // api_host: "https://app.posthog.com",
        loaded: (posthog) => {
          posthog.debug(import.meta.env.MODE === "development");
        }
      });

    } catch (e) {
      console.log(`error: ${e}`);
    }
  }
  setProperties(properties: any): this {
    posthog.setPersonPropertiesForFlags(properties, true)
    return this;
  }

  get(flag: AvailableFlags, properties?: any): any {
    return posthog.getFeatureFlag(flag, properties);
  }

  async load() {
   await posthog.reloadFeatureFlags();
  }

  isEnabled(flag: AvailableFlags): boolean {
    return !!posthog.isFeatureEnabled(flag.toString());
  }
}