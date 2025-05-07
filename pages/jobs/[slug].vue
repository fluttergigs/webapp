<script setup>
  import { htmlToText } from 'html-to-text';
  import { marked } from 'marked';
  import CompanyInfoCard from '~/components/company/CompanyInfoCard.vue';
  import SaveJobIconButton from '~/components/job/SaveJobIconButton.vue';
  import WorkingPermits from '~/components/job/WorkingPermits.vue';
  import { Endpoint } from '~/core/network/endpoints';
  import { AppRoutes } from '~/core/routes';
  import { Direction } from '~/core/shared/types';
  import { userFacingCompanySize } from '~/features/companies/transformers';
  import { AnalyticsEvent } from '~/services/analytics/events';
  import { AvailableFlags } from '~/services/feature-flag/availableFlags';

  import useJobActions from '@/composables/useJobActions';

  //TODO handle account/dashboard/consultants

  definePageMeta({
    layout: 'main-layout',
  });

  const { $analytics } = useNuxtApp();
  const company = computed(() => jobOffer.value.company);
  const jobSlug = ref(useRoute().params.slug);

  const { data: countries, error: countriesError } = await useCountries();
  const { jobWorkingPermits } = useJobActions();

  const {
    data: jobOffer,
    error,
    status,
  } = await useFetch(
    `${useRuntimeConfig().public.apiBaseUrl}${Endpoint.jobOffersBySlug(jobSlug.value)}`,
    {
      key: jobSlug.value,
      transform: (result) => result.data,
    },
  );

  if (!jobOffer.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'This job does not exist or has been removed',
    });
  }

  const pending = computed(() => status.value === 'pending');

  definePageMeta({
    layout: 'main-layout',
    title: `FlutterGis job opportunities`,
  });

  useSeoMeta({
    title: () => `Flutter Gigs - ${jobOffer.value?.title}`,
    ogTitle: () => `Flutter Gigs - ${jobOffer.value?.title}`,
    ogUrl: 'https://fluttergigs.com',
    ogLogo: 'https://fluttergigs.com/ico.png',
    // ogImageUrl: () => `/api/generate_job_offer_og_image?title=${jobOffer.value?.title}&companyName=${company.value?.name}&companyLogo=${company.value?.logo}`,
    description: () =>
      htmlToText(jobOffer.value?.description?.substring(0, 100), { wordwrap: 130 }),
    ogDescription: () =>
      htmlToText(jobOffer.value?.description?.substring(0, 100), { wordwrap: 130 }),
    ogSiteName: 'Flutter Gigs - The #1 Flutter job platform',
    twitterCard: 'summary' /*

  twitterImage: () =>
      jobOffer.value?.company?.logo ?? "https://fluttergigs.com/fluttergigs-og.png",*/,
    twitterSite: '@fluttergigs',
    twitterTitle: () => `Flutter Gigs - ${jobOffer.value?.title}`,
    twitterDescription: () =>
      `Find this opportunity on FlutterGigs: ${htmlToText(jobOffer.value?.title?.substring(0, 100), { wordwrap: 130 })}`,
  });

  defineOgImageComponent(
    'JobOffer',
    {
      ...jobOffer.value,
    },
    {
      fonts: ['Outfit:700'],
    },
  );

  onMounted(() => {
    // if (import.meta.client)
    $analytics.capture(AnalyticsEvent.jobOfferDetailEntered, {
      job: jobOffer.value ?? {},
    });
  });

  onBeforeMount(() => {
    // useJobStore().setSelectedJob(jobOffer.value ?? {});
  });
</script>

<template>
  <main>
    <client-only>
      <div v-if="pending" class="flex items-center justify-center p-52">
        <UButton
          class="border-none bg-transparent text-indigo-700"
          label=""
          loading
          size="xl"
          variant="ghost"
        />
      </div>
      <div v-else class="w-full">
        <section class="relative w-full">
          <div class="md:x-20 container mx-auto px-4 py-6 md:py-14">
            <CompanyLogo
              :company="company"
              class="absolute left-[10px] top-[6px] md:left-16 md:top-18"
              size="3xl"
            />
          </div>
        </section>
        <div class="px-4 py-20 md:px-20">
          <section class="bg-white">
            <div
              class="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <h2 class="text-2xl font-bold md:text-5xl lg:text-7xl">
                {{ jobOffer?.title }}
              </h2>

              <div
                class="my-2 md:my-0 flex flex-wrap justify-center items-center space-x-3 space-y-1 md:space-y-0"
              >
                <UButton
                  v-if="useJobActions().jobBelongsToCompany(company)"
                  color="white"
                  icon="i-heroicons-pencil"
                  label="Edit job offer"
                  size="xl"
                  square
                  variant="solid"
                  @click="useCompanyActions().handleJobEdit(jobOffer)"
                />

                <UButton
                  color="white"
                  icon="i-heroicons-share"
                  label="Share job offer"
                  size="xl"
                  square
                  variant="solid"
                  @click="useJobActions().shareJobOffer(jobOffer)"
                />

                <SaveJobIconButton :company="company" :job="jobOffer" />
              </div>
            </div>

            <div class="my-4 flex flex-wrap gap-4 items-center">
              <a
                :href="AppRoutes.companyPage(company?.slug)"
                class="text-lg font-bold text-gray-900"
              >
                {{ jobOffer.companyName ?? company?.name }}
              </a>

              <div class="flex items-center space-x-1">
                <UIcon class="text-gray-600" name="i-heroicons-building-office" />
                <span class="font-medium text-black">
                  {{ userFacingCompanySize(company?.size) }}
                </span>
              </div>

              <div
                v-if="useFeatureFlags().isEnabled(AvailableFlags.companiesList)"
                class="flex items-center space-x-1"
              >
                <UIcon class="text-gray-600" name="i-heroicons-link" />
                <a :href="company?.website" class="font-medium text-black" target="_blank">
                  Website
                </a>
              </div>

              <WorkingPermits :countries="jobWorkingPermits(countries ?? [], jobOffer)" />
            </div>
          </section>

          <!--      job details-->
          <section class="my-4 flex flex-col gap-2 gap-x-16 font-normal md:flex-row">
            <div class="flex w-full flex-col space-y-10 md:w-4/6">
              <div class="space-y-6 md:space-y-10 font-medium text-gray-900">
                <p
                  v-if="useFeatureFlags().isEnabled(AvailableFlags.companiesList)"
                  class="leading-10"
                >
                  {{ company?.description }}
                </p>

                <USeparator />

                <article
                  class="leading-[48px] md:leading-[40px]"
                  v-html="
                    jobOffer?.description?.isMarkdown()
                      ? marked(jobOffer.description)
                      : jobOffer?.description
                  "
                ></article>
              </div>
              <!--          apply section-->
              <JobApplicationCtaCard :company="company" :job="jobOffer" class="hidden md:block" />
            </div>

            <div class="flex w-full flex-col space-y-9 md:w-2/6">
              <JobApplicationCtaCard
                :company="company"
                :job="jobOffer"
                :layout-direction="Direction.vertical"
              />

              <JobDetailsCard :job="jobOffer" />

              <CompanyInfoCard :company="company" />
            </div>
          </section>
        </div>
      </div>
    </client-only>
  </main>
</template>

<style scoped></style>
