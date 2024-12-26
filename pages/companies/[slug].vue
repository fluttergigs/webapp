<script lang="ts" setup>
import { Endpoint } from "~/core/network/endpoints";
import type { Company } from "~/features/companies/company.types";
import { AppAnalyticsProvider } from "~/services/analytics/app_analytics_provider";
import { AnalyticsEvent } from "~/services/analytics/events";
import { stringify } from "qs";
import CompanyJobs from "~/components/company/CompanyJobs.vue";
import { useCompanyStore } from "~/stores/company";
import { storeToRefs } from "pinia";
import { logDev } from "~/core/helpers/log";

definePageMeta({
  layout: "main-layout",
});

const { viewedCompanyJobs } = storeToRefs(useCompanyStore());

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
  { deep: true, immediate: true }
);

const companySlug = ref(useRoute().params.slug);

const { $analytics } = useNuxtApp();

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
    { encodeValuesOnly: true }
  )
);

const { data, error, pending } = await useLazyFetch(
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

watch(
  data,
  async (value: any) => {
    if (value) {
      logDev("fetching viewed company jobs", value.id);
      await useCompanyStore().fetchViewedCompanyJobs(data.value.id);
    }
  },
  { immediate: true, deep: true }
);

useHead({ title: `Flutter Gigs - ${data?.value?.name}` });

onMounted(() => {
  ($analytics as AppAnalyticsProvider).capture(
    AnalyticsEvent.companyPageDetailEntered,
    { company: data }
  );
});

useSeoMeta({
  title: `Find this company ${data.value?.name} on FlutterGigs`,
  ogTitle: () => "FlutterGigs company page  - " + data.value?.name,
  description: () => data.value?.description,
  ogDescription: () => data.value?.description,
  ogImage: () => data.value?.logo,
  twitterCard: "summary_large_image",
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
          <CompanyLogo :company="data as Company" size="3xl" />

          <div class="flex flex-1 flex-col justify-center space-y-2">
            <h3 class="text-6xl font-bold md:text-7xl">
              {{ (data as Company).name }}
            </h3>
            <p
              class="line-clamp-1 overflow-ellipsis font-medium leading-relaxed text-gray-500"
            >
              {{ (data as Company).description }}
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
            @click.prevent="useCompanyActions().shareCompany(<Company>data)"
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
            <template #item="{ item }">
              <div class="w-full bg-white px-10 py-8 md:px-20">
                <div v-if="item.key === 'overview'" class="space-y-3">
                  <CompanyOverview :company="data as Company" />
                </div>
                <div v-else-if="item.key === 'jobs'" class="space-y-3">
                  <CompanyJobs :company="data as Company" />
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
