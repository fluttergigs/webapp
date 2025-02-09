<script setup>
import {useJobStore} from "~/stores/job";
import {storeToRefs} from "pinia";
import {Endpoint} from "~/core/network/endpoints";
import {extractCompanyFromJob} from "~/features/jobs/transformers";
import {AnalyticsEvent} from "~/services/analytics/events";
import {userFacingCompanySize} from "~/features/companies/transformers";
import {AppRoutes} from "~/core/routes";
import useJobActions from "@/composables/useJobActions";
import {Direction} from "~/core/shared/types";
import CompanyInfoCard from "~/components/company/CompanyInfoCard.vue";
import {stringify} from "qs";
import WorkingPermits from "~/components/job/WorkingPermits.vue";
import SaveJobIconButton from "~/components/job/SaveJobIconButton.vue";
import {marked} from "marked";
import {htmlToText} from "html-to-text";

//TODO handle account/dashboard/consultants

definePageMeta({
  layout: "main-layout",
});

const {$analytics} = useNuxtApp();
const {currentViewedJob} = storeToRefs(useJobStore());
const company = computed(() => ({
  ...extractCompanyFromJob(jobOffer.value),
}));
const jobSlug = ref(useRoute().params.slug);

const {data: countriesData, error: countriesError} = await useCountries();
const {jobWorkingPermits} = useJobActions();

const query = ref(
    stringify(
        {
          populate: "*",
          filters: {
            slug: {
              $eq: jobSlug.value,
            },
          },
        },
        {encodeValuesOnly: true}
    )
);

const {data: jobOffer, error, status} = await useLazyFetch(
    `${useRuntimeConfig().public.apiBaseUrl}${Endpoint.jobOffers}?${query.value}`,
    {
      key: jobSlug.value,
      transform: (results) => {
        const job = results.data[0];
        return {
          ...job[`attributes`],
          id: job["id"],
        };
      },
      pending: false,
    },
);

const pending = computed(() => status.value === "pending");

/*if (!jobOffer.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Job Not Found',
  })
}*/

definePageMeta({
  layout: "main-layout",
  title: `FlutterGis job opportunities`,
});

useHead({title: `Get this opportunity on FlutterGigs: ${jobOffer.value?.title}`});

const ogImageUrl = computed(() =>
    `/api/generate_job_offer_og_image?title=${jobOffer.value?.title}&companyName=${company.value?.name}&companyLogo=${company.value?.logo}`);

// const ogImageUrl = `/api/payment`;

useSeoMeta({
  title: () => `Flutter Gigs - ${jobOffer.value?.title}`,
  ogTitle: () => `Flutter Gigs - ${jobOffer.value?.title}`,

  ogUrl: "https://fluttergigs.com",
  ogLogo: 'https://fluttergigs.com/ico.png',
  // ogImageUrl: () => `/api/generate_job_offer_og_image?title=${jobOffer.value?.title}&companyName=${company.value?.name}&companyLogo=${company.value?.logo}`,
  description: () => htmlToText(jobOffer.value?.description?.substring(0, 100), {wordwrap: 130}),
  ogDescription: () => htmlToText(jobOffer.value?.description?.substring(0, 100), {wordwrap: 130}),
  ogSiteName: "Flutter Gigs - The #1 Flutter job platform",
  twitterCard: "summary",/*
  twitterImage: () =>
      jobOffer.value?.company?.logo ?? "https://fluttergigs.com/fluttergigs-og.png",*/
  twitterSite: "@fluttergigs",
  twitterTitle: () => `Flutter Gigs - ${jobOffer.value?.title}`,
  twitterDescription: () =>
      `Find this opportunity on FlutterGigs: ${htmlToText(jobOffer.value?.title?.substring(0, 100), {wordwrap: 130})}`,
});

defineOgImageComponent('JobOffer', {
  ...jobOffer.value,
},)

onMounted(() => {
  // if (import.meta.client)
  $analytics.capture(AnalyticsEvent.jobOfferDetailEntered, {
    job: jobOffer.value ?? {},
  });
});

onBeforeMount(() => {
  useJobStore().setSelectedJob(jobOffer.value ?? {});
});
</script>

<template>
  <client-only>
    <template v-if="pending">
      <div class="flex items-center justify-center p-52">
        <UButton
            class="border-none bg-transparent text-indigo-700"
            label=""
            loading
            size="xl"
            variant="ghost"
        />
      </div>
    </template>

    <template v-else>
      <section class="relative w-full bg-blueGray-50">
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
            <h2 class="text-xl font-bold md:text-5xl lg:text-7xl">
              {{ jobOffer?.title }}
            </h2>

            <client-only>
              <div class="my-2 flex flex-wrap items-center space-x-2">
                <UButton
                    v-if="useJobActions().jobBelongsToCompany(company)"
                    color="white"
                    icon="i-heroicons-pencil"
                    label="Edit job offer"
                    size="lg"
                    square
                    variant="solid"
                    @click="useCompanyActions().handleJobEdit(jobOffer)"
                />

                <UButton
                    color="white"
                    icon="i-heroicons-share"
                    label="Share job offer"
                    size="lg"
                    square
                    variant="solid"
                    @click="useJobActions().shareJobOffer(jobOffer)"
                />

                <SaveJobIconButton :company="company" :job="jobOffer"/>
              </div>
            </client-only>
          </div>

          <div class="my-4 flex flex-wrap gap-4">
            <a
                :href="AppRoutes.companyPage(company.slug)"
                class="text-lg font-bold text-gray-900"
            >
              {{ company?.name }}
            </a>

            <div class="flex items-center space-x-1">
              <UIcon class="text-gray-600" name="i-heroicons-building-office"/>
              <span class="font-medium text-black">
                {{ userFacingCompanySize(company?.size) }}
              </span>
            </div>

            <div class="flex items-center space-x-1">
              <UIcon class="text-gray-600" name="i-heroicons-link"/>
              <a
                  :href="company?.website"
                  class="font-medium text-black"
                  target="_blank"
              >
                Website
              </a>
            </div>

            <WorkingPermits
                :countries="
                jobWorkingPermits(countriesData?.countries ?? [], jobOffer)
              "
            />
          </div>
        </section>

        <!--      job details-->
        <section class="my-4 flex flex-col gap-x-16 font-normal md:flex-row">
          <div class="flex w-full flex-col space-y-10 md:w-4/6">
            <div class="space-y-10 font-medium text-gray-900">
              <p class="leading-10">{{ company?.description }}</p>
              <p class="leading-10"
                 v-html="jobOffer?.description?.isMarkdown()? marked(jobOffer.description): jobOffer?.description"></p>
            </div>
            <!--          apply section-->
            <LazyJobApplicationCtaCard
                :company="company"
                :job="jobOffer"
                class="hidden md:block"
            />
          </div>

          <div class="flex w-full flex-col space-y-9 md:w-2/6">
            <JobApplicationCtaCard
                :company="company"
                :job="jobOffer"
                :layout-direction="Direction.vertical"
            />

            <JobDetailsCard :job="jobOffer"/>

            <CompanyInfoCard :company="company"/>
          </div>
        </section>
      </div>
    </template>
  </client-only>
</template>

<style scoped></style>
