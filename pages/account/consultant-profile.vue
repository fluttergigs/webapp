<template>
  <main class="w-full">
    <div class="flex flex-col w-full">
      <client-only>
        <section class="py-8 px-3 sm:px-10 md:py-12 xl:pb-56 bg-white overflow-hidden">
          <h3 class="mb-4 text-xl md:text-3xl font-semibold tracking-px-n leading-tight">
            My Profile - {{ tabLabel }}
          </h3>
          <!--          <p class="text-md md:text-xl">👋, <b class="text-indigo-500">{{ useAuthStore().user.value.username }}</b>!
                      Manage your education history and work experience</p>-->

          <UTabs :items="tabs" class="w-full my-12" @change="onChange">
            <template #overview="{ item }"></template>
            <template #education="{ item }"></template>
            <template #experience="{ item }">
              <ExperienceView />
            </template>
          </UTabs>
        </section>
      </client-only>
    </div>
  </main>
</template>

<script setup>
  import ExperienceView from '~/components/profile/ExperienceView.vue';
  import { AnalyticsEvent } from '~/services/analytics/events';
  import { useAuthStore } from '~/stores/auth';

  definePageMeta({ layout: 'app-layout', middleware: ['auth'] });
  useHead({ title: 'FlutterGigs - My consultant profile' });

  const authStore = useAuthStore();

  const tabs = [
    {
      label: 'Overview',
      description: "Make changes to your account here. Click save when you're done.",
      slot: 'overview',
    },
    {
      label: 'Education',
      description: 'Add your education details',
      slot: 'education',
    },
    {
      label: 'Experience',
      description: 'Add your work experience',
      slot: 'experience',
    },
  ];

  onMounted(() => {
    useAnalytics().capture(AnalyticsEvent.consultantProfilePageEntered);
  });

  let tabLabel = ref('Overview');

  const onChange = (index) => {
    const tab = tabs[index];

    tabLabel.value = tab['label'];

    if (tab['slot'] === 'account') {
    } else if (tab['slot'] === 'password') {
    }
  };
</script>

<style scoped></style>
