<template>
  <main class="w-full">
    <div class="flex flex-col w-full">
      <section class="py-8 px-3 sm:px-10 md:py-12 xl:pb-56 bg-white overflow-hidden">
        <h3 class="mb-4 text-xl md:text-3xl font-semibold tracking-px-n leading-tight">
          Your Settings
        </h3>
        <p class="text-md md:text-xl">Make changes to your account here</p>

        <UTabs :items="tabs" class="w-full my-12" v-model="activeTab">
          <template #account="{ item }">
            <UpdateUser />
          </template>
          <template #password="{ item }">
            <UpdatePassword />
          </template>
          <template #preference="{ item }">
            <section></section>
          </template>
        </UTabs>
      </section>
    </div>
  </main>
</template>

<script setup>
import UpdatePassword from "~/components/account/UpdatePassword.vue";
import UpdateUser from "~/components/account/UpdateUser.vue";
import { AnalyticsEvent } from "~/services/analytics/events";

definePageMeta({ layout: "app-layout", middleware: ["auth"] });
useHead({ title: "FlutterGigs - My account" });

//TODO - implement user preferences

const activeTab = ref("account");
const tabs = [
  {
    label: "Account",
    value: "account",
    description: "Make changes to your account here. Click save when you're done.",
    slot: "account",
  },
  {
    label: "Password",
    value: "password",
    description: "Change your password here. After saving, you'll be logged out.",
    slot: "password",
  },
  {
    label: "Preferences",
    value: "preferences",
    disabled: true,
    description: "Set your preferences",
    slot: "preferences",
  },
];

onMounted(() => {
  useAnalytics().capture(AnalyticsEvent.userAccountPageEntered);
});
</script>

<style scoped></style>
