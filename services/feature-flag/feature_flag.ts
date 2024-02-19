import {AvailableFlags} from "~/services/feature-flag/available_flags";

export abstract class FeatureFlag {

    abstract load(): Promise<void>;

    abstract isEnabled(flag: AvailableFlags): boolean;

    abstract get(flag: AvailableFlags, properties?: any): any;

    abstract setProperties(properties: any): this;
}