import mitt from 'mitt';
import type { Snippet } from '~/features/fluppets/fluppets.types';

export enum ApplicationEventEnum {
  featureFlagsLoaded = 'featureFlags:loaded',
  onCopyAllowed = 'onCopyAllowed',
}

export type ApplicationEvents = {
  [ApplicationEventEnum.featureFlagsLoaded]: { data: {} };
  [ApplicationEventEnum.onCopyAllowed]: { data: Snippet };
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
