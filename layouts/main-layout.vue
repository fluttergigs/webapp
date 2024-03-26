<template>
  <div class="flex flex-col">
    <LayoutHeader/>
    <div class="flex-grow">
      <NuxtPage/>
    </div>
    <LayoutFooter/>
    <UNotifications/>
    <UModals />
  </div>
</template>

<script setup lang="ts">

import {useSettingStore} from "~/stores/setting";
import {useCompanyStore} from "~/stores/company";
import {useAuthStore} from "~/stores/auth";
import {useJobStore} from "~/stores/job";
import useFeatureFlags from "~/composables/useFeatureFlags";

onBeforeMount(async () => {
  await Promise.all([
    useFeatureFlags().loadFlags(),
    useCompanyStore().fetchCompanies(),
    useJobStore().fetchJobs(),
    useSettingStore().fetchSetting(),
    useAuthStore().fetchUser(),
  ])
})

</script>
