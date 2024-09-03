<template>
  <client-only>
    <div class="flex flex-col">
      <LayoutNavBar/>
      <div class="flex-grow">
        <NuxtPage/>
      </div>
      <LayoutFooter/>
      <UNotifications/>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import LayoutNavBar from "~/components/layout/NavBar.vue";

onBeforeMount(async () => {
  await Promise.all([
    useAuthStore().fetchUser(),
    useCompanyStore().fetchCompanies(),
    useJobStore().fetchJobs(),
    useSettingStore().fetchSetting(),
    useLearnStore().fetchLearnCategories(),
    useLearnStore().fetchLearnResources(),
  ])
})

</script>
