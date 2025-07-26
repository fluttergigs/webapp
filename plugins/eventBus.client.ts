import mitt from 'mitt';

export enum ApplicationEventEnum {
  featureFlagsLoaded = 'featureFlags:loaded',
}

export type ApplicationEvents = {
  [ApplicationEventEnum.featureFlagsLoaded]: { data: {} };
};

export default defineNuxtPlugin(() => {
  const emitter = mitt<ApplicationEvents>();

  return {
    provide: {
      event: emitter.emit, // Will emit an event
      listen: emitter.on, // Will register a listener for an event
    },
  };
});
