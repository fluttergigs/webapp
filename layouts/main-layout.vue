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

onBeforeMount(() => {

  useSettingStore().fetchSetting()
})

</script>
