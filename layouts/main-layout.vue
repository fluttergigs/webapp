<template>
  <!--  <client-only>-->
  <NuxtErrorBoundary @error="onError">
    <div class="flex flex-col h-full">
      <LayoutNavBar/>
      <div class="flex-grow">
        <NuxtPage/>
      </div>
      <LayoutFooter/>

      <client-only>
        <UNotifications/>
      </client-only>
    </div>
  </NuxtErrorBoundary>
  <!--  </client-only>-->
</template>

<script setup lang="ts">
import LayoutNavBar from "~/components/layout/NavBar.vue";
import {logDev} from "~/core/helpers/log";
import type {ErrorTrackerProvider} from "~/services/error-tracker/error_tracker_provider";

const {$socket} = useNuxtApp()
const {$errorTracker} = useNuxtApp()
const authStore = useAuthStore()

const onError = (error: any) => {
  logDev("error", error);

  ($errorTracker as ErrorTrackerProvider).captureException(error, authStore.isAuthenticated ? {...authStore.authUser} : null)
}

onMounted(async () => {
  await Promise.all([
    useAuthStore().fetchUser(),
    useCompanyStore().fetchCompanies(),
    useJobStore().fetchJobs(),
    useSettingStore().fetchSetting(),
    useLearnStore().fetchLearnCategories(),
    useLearnStore().fetchLearnResources(),
  ]);

  if (true) {
    const uid = generateUserName('test');

    ($socket as WebSocket).onopen = () => {
      logDev("connected to websocket");

      localStorage.setItem(`connection`, uid);
      ($socket as WebSocket).send(uid)
    };

    ($socket as WebSocket).onmessage = ({data}: any) => {
      logDev("data from websocket", data);
    };

    ($socket as WebSocket).onclose = function () {
      logDev("disconnected")
    }
  }


})

</script>
