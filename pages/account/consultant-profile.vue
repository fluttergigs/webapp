<template>
  <main class="w-full">
    <div class="flex flex-col w-full">
      <client-only>
        <section class="py-8 px-3 sm:px-10 md:py-12 xl:pb-56 bg-white overflow-hidden">
          <h3 class="mb-4 text-xl md:text-3xl font-semibold tracking-px-n leading-tight">
            My Profile
          </h3>
          <!--          <p class="text-md md:text-xl">👋, <b class="text-indigo-500">{{ useAuthStore().user.value.username }}</b>!
                      Manage your education history and work experience</p>-->

          <UTabs :items="tabs" class="w-full my-12" @change="onChange">
            <template #item="{ item }">
              <div v-if="item.key === 'overview'" class="space-y-3">
                <div></div>
              </div>
              <div v-else-if="item.key === 'education'" class="space-y-3">
                <div></div>
              </div>
              <div v-else-if="item.key === 'experience'" class="space-y-3">
                <div></div>
              </div>
            </template>
          </UTabs>
        </section>
      </client-only>
    </div>
  </main>
</template>

<script setup>
import { AnalyticsEvent } from '~/services/analytics/events';
import { useAuthStore } from '~/stores/auth';





definePageMeta({ layout: 'app-layout', middleware: ['auth'] });
  useHead({ title: 'FlutterGigs - My account' });

  const authStore = useAuthStore();
  const { $analytics } = useNuxtApp();

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      description: 'Make changes to your account here. Click save when you\'re done.',
    },
    {
      key: 'education',
      label: 'Education',
      description: 'Add your education details',
    },
    {
      key: 'experience',
      label: 'Experience',
      description: 'Add your work experience',
    },
  ];

  onMounted(() => {
    $analytics.capture(AnalyticsEvent.consultantProfilePageEntered);
  });

  const onChange = (index) => {
    const tab = tabs[index];

    if (tab['key'] === 'account') {
    } else if (tab['key'] === 'password') {
    }
  };
</script>

<style scoped></style>
