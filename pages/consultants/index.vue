<script setup lang="ts">

import useFeatureFlags from "~/composables/useFeatureFlags";
import {AvailableFlags} from "~/services/feature-flag/available_flags";
import type {BaseToast} from "~/core/ui/base_toast";
//@ts-ignore
import type {Notification} from "#ui/types";
import {AppStrings} from "~/core/strings";

definePageMeta({
  middleware: [
    function (to: any, from: any) {
      if (!useFeatureFlags().isFeatureEnabled(AvailableFlags.consultants)) {

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