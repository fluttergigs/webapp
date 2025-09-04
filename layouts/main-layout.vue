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

      <FluppetsCopyGateModal v-model:visible="showModal" />
    </div>
  </NuxtErrorBoundary>
  <!--  </client-only>-->
</template>

<script lang="ts" setup>
  import { useWebSocket } from '@vueuse/core';
  //@ts-ignore
  import LayoutNavBar from '~/components/layout/NavBar.vue';
  import { logDev } from '~/core/helpers/log';
  import type { Snippet } from '~/features/fluppets/fluppets.types';
  import { ApplicationEventEnum } from '~/plugins/eventBus.client';
  import type { ErrorTrackerProvider } from '~/services/error-tracker/ErrorTrackerProvider';

  const { $errorTracker } = useNuxtApp();
  const authStore = useAuthStore();
  const { showModal } = useCopyGate();

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

      authStore.isAuthenticated ? { user: authStore.authUser } : undefined,
    );
  };
  onMounted(async () => {
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/_ws`;
      useWebSocket(wsUrl, {
        autoReconnect: true,
        onMessage: (ws, event: MessageEvent) => {
          logDev('data from websocket', event);
        },

        onConnected: (ws) => {
          logDev('connected to websocket');
        },
      });
    } catch (error) {
      ($errorTracker as ErrorTrackerProvider).captureException(
        error as Error,
        authStore.isAuthenticated ? { user: authStore.authUser } : undefined,
      );
    }

    let cleanCopyAllowedFn: Function | undefined;
    const { $listen } = useNuxtApp();

    onMounted(() => {
      //@ts-ignore
      cleanCopyAllowedFn = $listen(
        ApplicationEventEnum.onCopyAllowed,
        ({ data }: { data: Snippet }) => {
          useFluppets().handleFluppetsCopy(data);
        },
      );
    });

    onUnmounted(() => {
      if (cleanCopyAllowedFn) cleanCopyAllowedFn();
    });
  });
</script>
