<script lang="ts" setup>

  import { AvailableFlags } from '~/services/feature-flag/available_flags';
  import type { BaseToast } from '~/core/ui/base_toast';
  //@ts-ignore
  import type { Notification } from '#ui/types';
  import { AppStrings } from '~/core/strings';

  definePageMeta({
    title: 'Flutter Consultants',
    middleware: [
      function(from: any, to: any) {
        if (!useFeatureFlags().isEnabled(AvailableFlags.hireConsultants)) {

          const { $toast } = useNuxtApp();
          if ($toast) {
            ($toast as BaseToast<Notification, number>).info(AppStrings.featureAvailableSoon);
          }
          return navigateTo(AppRoutes.welcome);
        }
      },
    ],
  });
</script>

<template>
  <main>

  </main>

</template>

<style scoped>

</style>