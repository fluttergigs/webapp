<template>
  <div class="flex flex-col">
    <LayoutHeader/>
    <div class="flex-grow">
      <NuxtPage/>
    </div>
    <LayoutFooter/>
  </div>
</template>

<script setup>

import {useSettingStore} from "~/stores/setting";
import {useCompanyStore} from "~/stores/company";
import {useAuthStore} from "~/stores/auth";

onBeforeMount(async () => {
  await Promise.all([
    useCompanyStore().fetchCompanies(),
    useSettingStore().fetchSetting(),
    useAuthStore().fetchUser(),
  ])
})

</script>
