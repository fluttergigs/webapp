import { defineStore } from 'pinia';
import type { FeatureId } from '~/features/announcements/announcements.types';

interface FeatureAnnouncement {
  id: FeatureId;
  version: string;
  announced: boolean;
  announcedAt?: string;
}

export const useAppStore = defineStore('app', {
  state: () => ({
    isAppBarShrunk: false,
    featureAnnouncements: {} as Record<FeatureId, FeatureAnnouncement | undefined>,
  }),

  getters: {
    shouldShowFeatureAnnouncement: (state) => (featureId: FeatureId, version: string = '1.0') => {
      const announcement = state.featureAnnouncements[featureId];
      return !announcement || !announcement.announced || announcement.version !== version;
    },
  },

  actions: {
    shrinkAppBar() {
      this.isAppBarShrunk = true;
    },

    unShrinkAppBar() {
      this.isAppBarShrunk = false;
    },

    toggleAppBarShrink() {
      if (this.isAppBarShrunk) {
        this.unShrinkAppBar();
      } else {
        this.shrinkAppBar();
      }
      // this.isAppBarShrunk = !this.isAppBarShrunk
    },

    markFeatureAnnounced(featureId: FeatureId, version: string = '1.0') {
      this.featureAnnouncements[featureId] = {
        id: featureId,
        version,
        announced: true,
        announcedAt: new Date().toISOString(),
      };
    },

    resetFeatureAnnouncement(featureId: FeatureId) {
      if (this.featureAnnouncements[featureId]) {
        delete this.featureAnnouncements[featureId];
      }
    },
  },

  persist: {
    paths: ['featureAnnouncements'],
    storage: persistedState.localStorage,
    debug: import.meta.env.MODE === 'development',
    key: 'app',
  },
});
