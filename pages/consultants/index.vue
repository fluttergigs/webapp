<script setup lang="ts">

import {AvailableFlags} from "~/services/feature-flag/available_flags";
import type {BaseToast} from "~/core/ui/base_toast";
//@ts-ignore
import type {Notification} from "#ui/types";
import {AppStrings} from "~/core/strings";

definePageMeta({
  title: 'Flutter Consultants',
  middleware: [
    function (to: any, from: any) {
      if (!useFeatureFlags().isEnabled(AvailableFlags.hireConsultants)) {

        const {$toast} = useNuxtApp();
        ($toast as BaseToast<Notification>).info(AppStrings.featureAvailableSoon)
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