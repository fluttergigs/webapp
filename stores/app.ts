import { defineStore } from 'pinia';

interface FeatureAnnouncement {
  id: string;
  version: string;
  announced: boolean;
  announcedAt?: string;
}

export let useAppStore = defineStore('app', {
  state: () => ({
    isAppBarShrunk: false,
    featureAnnouncements: {} as Record<string, FeatureAnnouncement>,
  }),

  getters: {
    shouldShowFeatureAnnouncement: (state) => (featureId: string, version: string = '1.0') => {
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

    markFeatureAnnounced(featureId: string, version: string = '1.0') {
      this.featureAnnouncements[featureId] = {
        id: featureId,
        version,
        announced: true,
        announcedAt: new Date().toISOString(),
      };
    },

    resetFeatureAnnouncement(featureId: string) {
      if (this.featureAnnouncements[featureId]) {
        delete this.featureAnnouncements[featureId];
      }
    },
  },

  persist: {
    key: 'app-store',
    storage: persistedState.localStorage,
  },
});
