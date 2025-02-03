<script lang="ts" setup>
import {Endpoint} from "~/core/network/endpoints";
import type {Company} from "~/features/companies/company.types";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";
import {stringify} from "qs";
import CompanyJobs from "@/components/company/CompanyJobs.vue";
import {useCompanyStore} from "~/stores/company";
import {storeToRefs} from "pinia";
import {logDev} from "~/core/helpers/log";
import {marked} from "marked";
import {htmlToText} from "html-to-text";

definePageMeta({
  layout: "main-layout",
});

const {viewedCompanyJobs} = storeToRefs(useCompanyStore());

const companySlug = ref(useRoute().params.slug);

const {$analytics} = useNuxtApp();

const query = ref(
    stringify(
        {
          populate: "*",
          filters: {
            slug: {
              $eq: companySlug.value,
            },
          },
        },
        {encodeValuesOnly: true,}
    )
);

const {data: company, error, status} = await useLazyFetch(
    `${useRuntimeConfig().public.apiBaseUrl}${Endpoint.companies}?${query.value}`,
    {
      key: companySlug.value,
      transform: (results) => {
        const company = results.data[0];
        return {
          ...company[`attributes`],
          id: company["id"],
        } as Company;
      },
    }
);

const pending = computed(() => status.value === "pending");
const companyJobsCount = computed(() => viewedCompanyJobs.value?.length ?? 0);

const tabs = ref([
  {
    key: "overview",
    label: "Overview",
  },
  {
    key: "jobs",
    label: `Jobs (${companyJobsCount.value ?? 0})`,
  },
]);

watch(
    viewedCompanyJobs,
    (value: string | any[]) => {
      tabs.value = [
        {
          key: "overview",
          label: "Overview",
        },
        {
          key: "jobs",
          label: `Jobs (${value?.length ?? 0})`,
        },
      ];
    },
    {deep: true, immediate: true}
);


watch(
    company,
    async (value: any) => {
      if (value) {
        logDev("fetching viewed company jobs", value.id);
        await useCompanyStore().fetchViewedCompanyJobs(company.value.id);
      }
    },
    {immediate: true, deep: true}
);

useHead({title: `Flutter Gigs - ${company?.value?.name}`});

onMounted(() => {
  ($analytics as AppAnalyticsProvider).capture(
      AnalyticsEvent.companyPageDetailEntered,
      {company: company.value}
  );
});

useServerSeoMeta({
  title: `Find this company ${company.value?.name} on FlutterGigs`,
  ogTitle: () => `FlutterGigs company page - ${company.value?.name}`,
  description: () => htmlToText(company.value?.description, {wordwrap: 100}),
  ogDescription: () => htmlToText(company.value?.description, {wordwrap: 100}),
  ogImage: () => company.value?.logo ?? "https://fluttergigs.com/fluttergigs-og.png",
  twitterImage: "https://fluttergigs.com/fluttergigs-og.png",
  twitterCard: "summary",
  ogSiteName: "Flutter Gigs - The #1 Flutter job platform",
  twitterSite: "@fluttergigs",
  twitterTitle: () => `FlutterGigs company page  - ${company.value?.name}`,
  twitterDescription: () => htmlToText(company.value?.description, {wordwrap: 100}),
});
</script>

<template>
  <!--  <client-only>-->
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
      <div class="container px-10 py-6 md:px-20 md:py-14">
        <div
            class="flex flex-col items-start gap-x-6 md:flex-row md:items-center"
        >
          <CompanyLogo :company="company as Company" size="3xl"/>

          <div class="flex flex-1 flex-col justify-center space-y-2">
            <h3 class="text-6xl font-bold md:text-7xl">
              company </h3>
            <p
                class="line-clamp-1 overflow-ellipsis font-medium leading-relaxed text-gray-500"
                v-html="company?.description?.isMarkdown()? marked(company.description): company?.description"
            >
            </p>
          </div>

          <UButton
              class="invisible md:visible"
              color="white"
              icon="i-heroicons-share"
              label="Share company"
              size="lg"
              square
              style="height: fit-content"
              variant="solid"
              @click.prevent="useCompanyActions().shareCompany(<Company>company)"
          />
        </div>
      </div>
      <div class="w-full">
        <div>
          <UTabs
              :items="tabs"
              :ui="{
              list: {
                width: 'w-fit',
                background: 'bg-transparent',
                tab: {
                  base: 'mr-4 relative left-[40px] md:left-[80px] top-[12px] z-[2000]',
                  size: 'text-lg',
                  padding: 'px-0',
                  active:
                    'text-indigo-800 font-bold border-b-2 border-indigo-800',
                  rounded: 'rounded-none',
                },
                marker: { background: 'bg-transparent', shadow: 'shadow-none' },
              },
            }"
              class="mt-10 w-full"
          >
            <template v-if="!!company" #item="{ item }">
              <div class="w-full bg-white px-10 py-8 md:px-20">
                <div v-if="item.key === 'overview'" class="space-y-3">
                  <CompanyOverview :company="company as Company"/>
                </div>
                <div v-else-if="item.key === 'jobs'" class="space-y-3">
                  <CompanyJobs :company="company as Company"/>
                </div>
              </div>
            </template>
          </UTabs>
        </div>
      </div>
    </section>
  </template>
  <!--  </client-only>-->
</template>

<style>
div[role="tablist"] {
  /* z-index: 2000;
   top: -40px;*/
}

[role="tablist"] button {
  width: fit-content;
}

[role="tablist"] button span {
  padding-bottom: 2rem;
}
</style>
