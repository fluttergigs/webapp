<template>
  <!--  <client-only>-->
  <NuxtErrorBoundary @error="onError">
    <div class="flex h-full flex-col">
      <LayoutNavBar />
      <div class="flex-grow overflow-hidden">
        <div class="relative">
          <NuxtPage />
        </div>
      </div>
      <LayoutFooter />
    </div>
  </NuxtErrorBoundary>
  <!--  </client-only>-->
</template>

<script lang="ts" setup>
  import { useWebSocket } from '@vueuse/core';
  import LayoutNavBar from '~/components/layout/NavBar.vue';
  import { logDev } from '~/core/helpers/log';
  import type { ErrorTrackerProvider } from '~/services/error-tracker/ErrorTrackerProvider';

  const { $errorTracker } = useNuxtApp();
  const authStore = useAuthStore();

  /* await Promise.all([
     useAuthStore().getUser(),
     useJobStore().fetchJobs(),
     useSettingStore().fetchSetting(),
     useLearnStore().fetchLearnCategories(),
     useLearnStore().fetchLearnResources(),
     useCompanyStore().fetchCompanies(),
   ]);
 */
  const onError = (error: any) => {
    logDev('error', error);

    ($errorTracker as ErrorTrackerProvider).captureException(
      error,
      authStore.isAuthenticated ? { user: authStore.authUser } : null,
    );
  };
  onMounted(async () => {
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/_ws`;
      const { status, data, send, open, close } = useWebSocket(wsUrl, {
        autoReconnect: true,
        onMessage: (ws, event: MessageEvent) => {
          logDev('data from websocket', event);
        },

        onConnected: (ws) => {
          logDev('connected to websocket');
        },
      });
    } catch (e) {
      ($errorTracker as ErrorTrackerProvider).captureException(
        error,
        authStore.isAuthenticated ? { user: authStore.authUser } : null,
      );
    }
  });
</script>
