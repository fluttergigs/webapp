<template>
  <client-only>
    <div class="flex flex-col">
      <LayoutHeader/>
      <div class="flex-grow">
        <NuxtPage/>
      </div>
      <LayoutFooter/>
      <UNotifications/>
    </div>
  </client-only>
</template>

<script setup>

import {useSettingStore} from "~/stores/setting";
import {useCompanyStore} from "~/stores/company";
import {useAuthStore} from "~/stores/auth";
import {useJobStore} from "~/stores/job";

onBeforeMount(async () => {
  await Promise.all([
    useAuthStore().fetchUser(),
    useCompanyStore().fetchCompanies(),
    useJobStore().fetchJobs(),
    useSettingStore().fetchSetting(),
  ])
})

</script>
