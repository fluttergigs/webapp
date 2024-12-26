<template>
  <!--  <client-only>-->
  <NuxtErrorBoundary @error="onError">
    <div class="flex h-full flex-col">
      <LayoutNavBar />
      <div class="flex-grow overflow-hidden">
        <NuxtPage />
      </div>
      <LayoutFooter />

      <client-only>
        <UNotifications />
      </client-only>
    </div>
  </NuxtErrorBoundary>
  <!--  </client-only>-->
</template>

<script lang="ts" setup>
import LayoutNavBar from "~/components/layout/NavBar.vue";
import { logDev } from "~/core/helpers/log";
import type { ErrorTrackerProvider } from "~/services/error-tracker/error_tracker_provider";

const { $socket, $errorTracker } = useNuxtApp();
const authStore = useAuthStore();

const onError = (error: any) => {
  logDev("error", error);

  ($errorTracker as ErrorTrackerProvider).captureException(
    error,
    authStore.isAuthenticated ? { ...authStore.authUser } : null
  );
};

await Promise.all([
  useAuthStore().fetchUser(),
  useJobStore().fetchJobs(),
  useSettingStore().fetchSetting(),
  useLearnStore().fetchLearnCategories(),
  useLearnStore().fetchLearnResources(),
  useCompanyStore().fetchCompanies(),
]);

onMounted(async () => {
  ($socket as WebSocket).onerror = (error: any) => {
    logDev("error from websocket", error);
  };

  ($socket as WebSocket).onmessage = (message: any) => {
    logDev("data from websocket", message);

    const { type, channel, data } = JSON.parse(message.data);

    logDev("PARSED DATA", { type, channel, data });

    switch (type) {
      case WebSocketMessageType.MESSAGE:
        if (channel === WebSocketChannel.PAYMENT) {
          const { amount, originEmail, paymentEmail, stripeCustomerId } = data;
          logDev("payment data", {
            amount,
            originEmail,
            paymentEmail,
            stripeCustomerId,
          });

          /*if (authStore.isAuthenticated) {
            if(originEmail === authStore.authUser?.email){
              useCompanyActions().onSuccessfulPaymentForJobPosting(()=> navigateTo(AppRoutes.myJobs))
            }
          }*/
        }
        break;
      default:
    }
  };

  ($socket as WebSocket).onclose = function () {
    logDev("disconnected from websocket");
  };
});
</script>
