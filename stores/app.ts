import { defineStore } from 'pinia';

export let useAppStore = defineStore('app', {
  state: () => ({
    isAppBarShrunk: false,
  }),

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
  },
});
