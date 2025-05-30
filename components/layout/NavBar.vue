<template>
  <section class="z-[2500] overflow-hidden" id="navbar">
    <div
      :class="[isHomePage ? 'bg-white' : 'bg-blueGray-50']"
      class="sticky flex items-center justify-between bg-blueGray-50 px-6 py-5 transition-all duration-200 ease-in md:px-18"
    >
      <div class="w-auto">
        <div class="flex flex-wrap items-center">
          <div class="mr-14 w-auto">
            <NuxtLink :to="AppRoutes.welcome">
              <img alt="" class="w-20" src="/logo.webp" />
            </NuxtLink>
          </div>
          <div class="hidden w-auto lg:block">
            <ul class="mr-16 flex items-center">
              <li
                v-for="link in enabledLinks"
                :key="link?.name"
                class="mr-9 font-medium hover:text-indigo-900"
              >
                <UChip
                  :show="link.hasOwnProperty('tag')"
                  :text="link.tag"
                  :ui="{ base: 'p-2' }"
                  color="success"
                  size="3xl"
                >
                  <NuxtLink
                    :class="[
                      'font-bold hover:text-indigo-900',
                      { 'text-indigo-800 text-lg': useRoute().fullPath === link.path },
                    ]"
                    :to="link.path"
                    >{{ link.name }}
                  </NuxtLink>
                </UChip>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="w-auto">
        <div class="flex flex-wrap items-center">
          <div class="mr-5 hidden w-auto lg:block">
            <!--            <ClientOnly>-->
            <div class="inline-block">
              <NuxtLink v-if="!isAuthenticated" :to="AppRoutes.login" class="font-medium">
                Login
              </NuxtLink>
              <UDropdownMenu
                v-else
                :items="accountLinks"
                :popper="{ placement: 'bottom-start' }"
                :ui="{
                  content: 'w-48',
                }"
                size="xl"
              >
                <div class="flex items-center justify-center">
                  <span class="text-lg primary-gradient font-bold">
                    {{ useAuthStore().authUser.username }}
                  </span>
                  <UIcon name="i-heroicons-chevron-down-20-solid" />
                </div>
              </UDropdownMenu>
            </div>
            <!--            </ClientOnly>-->
          </div>
          <div class="hidden w-auto lg:block">
            <UButton
              :to="AppRoutes.postJob"
              block
              class="rounded-xl"
              color="primary"
              icon="i-heroicons-megaphone"
              label="Post a job"
              size="lg"
              variant="solid"
            />
          </div>
          <div class="w-auto lg:hidden">
            <a href="#">
              <svg
                class="navbar-burger text-indigo-600"
                fill="none"
                height="51"
                viewbox="0 0 56 56"
                width="51"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect fill="currentColor" height="56" rx="28" width="56"></rect>
                <path
                  d="M37 32H19M37 24H19"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div
      class="navbar-menu fixed bottom-0 left-0 top-0 z-50 hidden w-4/6 transition-all duration-200 ease-in sm:max-w-xs"
    >
      <div class="navbar-backdrop fixed inset-0 bg-gray-800 opacity-80"></div>

      <nav class="relative z-10 h-full overflow-y-auto bg-white px-9 pt-8">
        <div class="flex h-full flex-wrap justify-between">
          <div class="w-full">
            <div class="-m-2 flex items-center justify-between">
              <div class="w-auto p-2">
                <NuxtLink class="inline-block" to="/">
                  <img alt="" class="w-20" src="/logo.webp" />
                </NuxtLink>
              </div>
              <div class="w-auto p-2">
                <a class="navbar-close" href="#">
                  <CloseIcon />
                </a>
              </div>
            </div>
          </div>
          <div class="flex w-full flex-col justify-center py-16">
            <ul>
              <li v-for="link in enabledLinks" :key="link?.name" class="mb-12">
                <a
                  :href="link.path"
                  class="font-bold text-lg hover:text-indigo-900"
                  @click.prevent="onMenuLinkClick(link)"
                  >{{ link.name }}</a
                >
              </li>
            </ul>
          </div>
          <div class="flex w-full flex-col justify-end pb-8">
            <div class="flex flex-wrap">
              <div class="mb-3 w-full">
                <!--                <ClientOnly>-->
                <div class="block">
                  <NuxtLink
                    v-if="!isAuthenticated"
                    :to="AppRoutes.login"
                    class="font-medium"
                  >
                    Login
                  </NuxtLink>

                  <UDropdownMenu
                    v-else
                    :items="accountLinks"
                    :popper="{ placement: 'bottom-start' }"
                    :ui="{
                      content: 'w-48',
                    }"
                    size="xl"
                  >
                    <div class="flex items-center justify-center">
                      <span class="text-lg primary-gradient font-bold">
                        {{ useAuthStore().authUser.username }}
                      </span>
                      <UIcon name="i-heroicons-chevron-down-20-solid" />
                    </div>
                  </UDropdownMenu>
                </div>
                <!--                </ClientOnly>-->
              </div>
              <UButton
                :to="AppRoutes.postJob"
                class="rounded-xl"
                color="primary"
                icon="i-heroicons-megaphone"
                label="Post a job"
                size="lg"
                square
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import CloseIcon from "~/components/icons/CloseIcon.vue";
import { logDev } from "~/core/helpers/log";
import { AppRoutes } from "~/core/routes";
import type { UiLink } from "~/core/shared/types";
import auth from "~/middleware/auth";
import { ApplicationEventEnum } from "~/plugins/eventBus.client";
import { AvailableFlags } from "~/services/feature-flag/availableFlags";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

const links: Ref<UiLink[]> = ref([
  {
    path: AppRoutes.welcome,
    name: "Home",
  },

  {
    path: AppRoutes.jobs,
    name: "Jobs",
  },
  {
    path: AppRoutes.fluppets,
    name: "Fluppets",
  },
  {
    path: AppRoutes.learn,
    name: "Learn",
    isEnabled: true,
  },
]);

const accountLinks = ref([
  [
    {
      label: "Profile",
      onClick: () => {
        navigateTo(AppRoutes.consultantProfile);
      },
    },
    {
      label: "Account",
      onClick: () => {
        navigateTo(AppRoutes.myAccount);
      },
    },
  ],
  [
    {
      label: "Saved Jobs",
      onClick: () => {
        navigateTo(AppRoutes.mySavedJobs);
      },
    },
  ],
  [
    {
      label: "My Job postings",
      onClick: () => {
        navigateTo(AppRoutes.myJobs);
      },
    },
  ],
  [
    {
      label: "My company",
      onClick: () => {
        navigateTo(AppRoutes.myCompany);
      },
    },
  ],
  [
    {
      label: "Logout",
      onClick: () => {
        useUser().logout();
      },
    },
  ],
]);

const isHomePage = computed(() => useRoute().path === "/");

const enabledLinks = computed(() => {
  return links.value.filter((link) => link.isEnabled ?? true);
});

//@ts-ignore
const { isAuthenticated } = storeToRefs(authStore);

const onMenuLinkClick = (link: any) => {
  //@ts-ignore
  document.querySelector(".navbar-close")?.click();
  navigateTo(link.path);
};

onMounted(() => {
  const { $listen } = (useNuxtApp() as unknown) as {
    $listen: (event: string, callback: (data: any) => void) => void;
  };

  $listen(ApplicationEventEnum.featureFlagsLoaded, (data: any) => {
    logDev("Feature Flags listener", data);

    links.value = [
      {
        path: AppRoutes.welcome,
        name: "Home",
      },
      {
        path: AppRoutes.jobs,
        name: "Jobs",
      },
      {
        path: AppRoutes.fluppets,
        name: "Fluppets",
        tag: "New",
      },
      {
        path: AppRoutes.companies,
        name: "Companies",
        isEnabled: useFeatureFlags().isEnabled(AvailableFlags.companiesList),
        tag: useFeatureFlags().isEnabled(AvailableFlags.companiesList) ? "New" : "Soon",
      },

      {
        path: AppRoutes.hireConsultants,
        name: "Consultants",
        tag: useFeatureFlags().isEnabled(AvailableFlags.hireConsultants) ? "New" : "Soon",
      },
      {
        path: AppRoutes.learn,
        name: "Learn",
      },
    ];

    if (useFeatureFlags().isEnabled(AvailableFlags.hireConsultants)) {
      accountLinks.value.unshift([
        {
          label: "Profile",
          onClick: () => {
            navigateTo(AppRoutes.consultantProfile);
          },
        },
      ]);
    }
  });
});
</script>
