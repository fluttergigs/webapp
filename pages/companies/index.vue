<script setup lang="ts">
import {AvailableFlags} from "~/services/feature-flag/available_flags";
import type {BaseToast} from "~/core/ui/base_toast";
//@ts-ignore
import type {Notification} from "#ui/types";
import {AppStrings} from "~/core/strings";

definePageMeta({
  title: 'Companies',
  middleware: [
    function (to: any, from: any) {
      if (!useFeatureFlags().isEnabled(AvailableFlags.companiesList)) {

        const {$toast} = useNuxtApp();
        ($toast as BaseToast<Notification>).info(AppStrings.featureAvailableSoon)
        return navigateTo(from)
      }
    }
  ]
})
</script>

<template>
  <section class="relative bg-blueGray-50">
    <img
        class="absolute left-1/2 bottom-0 transform -translate-x-1/2"
        src="@/assets/images/gradient6.svg"
        alt=""
    />
    <div class="container px-4 py-16 mx-auto">
      <div class="flex flex-col -m-8">
        <h1 class="mb-6 text-5xl md:text-6xl lg:text-6xl font-semibold primary-gradient">
          FlutterGigs
        </h1>

        <p class="mb-11 text-lg text-gray-900 font-medium">
          Discover companies that are hiring Flutter developers and more
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>