<template>
  <main class="w-full">
    <div class="flex flex-col w-full">
      <client-only>
        <section class="py-8 px-3 sm:px-10 md:py-12 xl:pb-56 bg-white overflow-hidden">
          <h3
              class="mb-4 text-xl md:text-3xl font-semibold tracking-px-n leading-tight">
            Your Settings
          </h3>
          <p class="text-md md:text-xl">👋, <b class="text-indigo-500">{{ useAuthStore().user.value.username }}</b>!
            Make changes to your account here</p>

          <UTabs :items="tabs" class="w-full my-12" @change="onChange">
            <template #item="{ item }">

              <div v-if="item.key === 'account'" class="space-y-3">
                <UpdateUser/>
              </div>
              <div v-else-if="item.key === 'password'" class="space-y-3">
                <UpdatePassword/>
              </div>
              <div v-else-if="item.key === 'preferences'" class="space-y-3">
                <section></section>
              </div>

            </template>
          </UTabs>
        </section>
      </client-only>
    </div>
  </main>
</template>

<script setup>
import {useAuthStore} from "~/stores/auth";
import UpdateUser from "~/components/account/UpdateUser.vue";
import UpdatePassword from "~/components/account/UpdatePassword.vue";
import {AnalyticsEvent} from "~/services/analytics/events";

definePageMeta({layout: 'app-layout', middleware: ['auth']})
useHead({title: "FlutterGigs - My account"});

const authStore = useAuthStore()
const {$analytics} = useNuxtApp()

const tabs = [{
  key: 'account',
  label: 'Account',
  description: 'Make changes to your account here. Click save when you\'re done.'
}, {
  key: 'password',
  label: 'Password',
  description: 'Change your password here. After saving, you\'ll be logged out.'
}, {
  key: 'preferences',
  label: 'Preferences',
  //TODO - implement user preferences
  disabled: true,
  description: 'Set your preferences'
}]

onMounted(() => {
  $analytics.capture(AnalyticsEvent.userAccountPageEntered);
})


const onChange = (index) => {
  const tab = tabs[index]

  if (tab['key'] === 'account') {

  } else if (tab['key'] === 'password') {

  }
}

</script>

<style scoped>

</style>