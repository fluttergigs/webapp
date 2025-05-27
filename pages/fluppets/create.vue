<template>
  <div></div>
</template>

<script lang="ts" setup>
import type { BaseToast } from "~/core/ui/base_toast";
import { AvailableFlags } from "~/services/feature-flag/availableFlags";

definePageMeta({
  layout: "main-layout",
  keepalive: true,
  middleware: [
    function (to: any, from: any) {
      if (!useFeatureFlags().isEnabled(AvailableFlags.companiesList)) {
        const { $toast } = useNuxtApp();

        if ($toast) {
          ($toast as BaseToast<Notification>).info(AppStrings.featureAvailableSoon);
        }
        return navigateTo(from.fullPath ?? AppRoutes.welcome);
      }
    },
  ],
});
</script>

<style></style>
