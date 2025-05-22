//@ts-ignore
import posthog from 'posthog-js';
import { FeatureFlag } from '~/services/feature-flag/FeatureFlag';
import type { AvailableFlags } from '~/services/feature-flag/availableFlags';

export class PosthogClient implements FeatureFlag {
  constructor() {
    try {
      const {
        public: { posthogKey },
      } = useRuntimeConfig();

      const posthogClient = posthog.init(posthogKey, {
        capture_pageleave: true,
        feature_flag_request_timeout_ms: 24000,
        capture_pageview: true,
        name: 'Flutter Gigs',
        debug: import.meta.env.MODE === 'development',
        advanced_disable_decide: import.meta.env.MODE === 'development',
        person_profiles: 'always',
        api_host: 'https://us.i.posthog.com',
        loaded: (posthog: any) => {
          posthog.debug(import.meta.env.MODE === 'development');
        },
      });
    } catch (e) {
      console.log(`error: ${e}`);
    }
  }

  setProperties(properties: any): this {
    posthog.setPersonPropertiesForFlags(properties, true);
    return this;
  }

  get(flag: AvailableFlags, properties?: any): any {
    return posthog.getFeatureFlag(flag, properties);
  }

  async load() {
    posthog.reloadFeatureFlags();
    posthog.featureFlags.ensureFlagsLoaded();
  }

  isEnabled(flag: AvailableFlags): boolean {
    return !!posthog.isFeatureEnabled(flag.toString());
  }
}
