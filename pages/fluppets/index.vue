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

        if ($toast) {
          ($toast as BaseToast<Notification>)?.info(AppStrings.featureAvailableSoon)
        }
        return navigateTo(AppRoutes.welcome)
      }
    }
  ]
})
</script>

<template>

</template>

<style scoped>

</style>