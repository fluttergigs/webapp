<script lang="ts" setup>
import {AvailableFlags} from "~/services/feature-flag/available_flags";
import type {BaseToast} from "~/core/ui/base_toast";
import {AppStrings} from "~/core/strings";

definePageMeta({
  title: 'Flutter snippets',
  middleware: [
    function (to: any, from: any) {
      if (!useFeatureFlags().isEnabled(AvailableFlags.fluppets)) {

        const {$toast} = useNuxtApp();
        ($toast as BaseToast<Notification, number>).info(AppStrings.featureAvailableSoon)
        return navigateTo(from)
      }
    }
  ]
})
</script>

<template>

</template>

<style scoped>

</style>