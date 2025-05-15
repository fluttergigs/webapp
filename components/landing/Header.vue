<template>
  <section class="bg-white h-screen items-center justify-center">
    <div class="overflow-hidden">
      <div class="container mx-auto py-6 md:py-8">
        <div class="flex flex-wrap items-center justify-center">
          <div class="flex w-full flex-col gap-8 p-6 md:w-3/5 md:p-8">
            <div
              class="md:mt-[80px] mb-6 inline-block rounded-full bg-green-100 px-2 py-1 font-semibold"
              style="width: fit-content"
            >
              <div class="flex items-center p-2">
                <div>
                  <!--                  add world emoji-->
                  <NuxtLink :to="AppRoutes.jobs" class="text-sm font-bold"
                    >The #1 Flutter jobs platform in the world 🌍!
                  </NuxtLink>
                </div>
                <div class="w-auto p-1">
                  <ArrowBackIcon class="rotate-180" />
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 px-2 sm:px-0 md:gap-4">
              <h1
                class="primary-gradient mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
              >
                <!--                TODO
                  add a changing effect to the text, it should fade from opportunities to talents
                -->
                Bringing the Best Flutter <br />
                <TextSwap
                  :texts="['Opportunities', 'Talents']"
                  classes="!bg-indigo-700 !text-white text-4xl font-bold leading-tight md:text-6xl lg:text-7xl"
                ></TextSwap>
              </h1>

              <p class="mb-11 text-lg font-medium text-gray-900 md:max-w-md">
                Get the best-in-class group mentoring plans and professional benefits for your team
              </p>
              <div
                class="my-5 flex flex-col items-start gap-3 sm:flex-row md:my-20 md:items-center"
                style="width: fit-content"
              >
                <UButton
                  class="flex gap-2 rounded-xl px-9 py-5 font-medium"
                  color="primary"
                  icon="i-heroicons-magnifying-glass-solid"
                  label="Find your next job now"
                  @click="findJobs"
                />
                <UButton
                  class="flex gap-2 rounded-xl px-9 py-5 font-medium"
                  color="neutral"
                  icon="i-heroicons-megaphone-solid"
                  label="Post a new Flutter job"
                  @click="handleJobCreation"
                />
              </div>
            </div>
          </div>
          <div class="w-full p-2 sm:p-0 md:w-2/5">
            <img
              alt=""
              class="transform transition duration-1000 ease-in-out hover:-translate-y-16"
              src="/landing-header.webp"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
  import ArrowBackIcon from '~/components/icons/ArrowBackIcon.vue';
  import TextSwap from '~/components/ui/TextSwap.vue';
  import { AppRoutes } from '~/core/routes';
  import { AppAnalyticsProvider } from '~/services/analytics/AppAnalyticsProvider';
  import { AnalyticsEvent } from '~/services/analytics/events';

  import useCompanyActions from '@/composables/useCompanyActions';

  const { $analytics } = useNuxtApp();

  const handleJobCreation = () => {
    ($analytics as AppAnalyticsProvider).capture(
      AnalyticsEvent.landingPageHeaderPostJobOfferButtonClicked,
    );
    useCompanyActions().handleJobCreation();
  };

  const findJobs = () => {
    ($analytics as AppAnalyticsProvider).capture(
      AnalyticsEvent.landingPageHeaderFindJobsButtonClicked,
    );
    navigateTo(AppRoutes.jobs);
  };
</script>
<style scoped></style>
