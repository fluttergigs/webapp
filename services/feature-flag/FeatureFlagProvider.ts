import { FeatureFlag } from '~/services/feature-flag/FeatureFlag';
import { PosthogClient } from '~/services/feature-flag/PosthogClient';
import { AvailableFlags } from '~/services/feature-flag/availableFlags';

export class FeatureFlagProvider {
  private client: FeatureFlag;

  constructor() {
    //@ts-ignore
    this.client = new PosthogClient();
  }

  setClient(client: FeatureFlag) {
    this.client = client;
    return this.client;
  }

  setProperties(properties: any) {
    this.client.setProperties(properties);
    return this.client;
  }

  async load() {
    await this.client.load();
  }

  get(flag: AvailableFlags, properties?: Object): any {
    return this.client.get(flag, properties);
  }

  isEnabled(flag: AvailableFlags, defaultValue?: boolean): boolean {
    return this.client.isEnabled(flag) ?? defaultValue;
  }
}
