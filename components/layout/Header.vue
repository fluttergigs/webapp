<template>
  <section class="overflow-hidden">
    <div class="flex items-center justify-between py-5 bg-blueGray-50 px-2 md:px-18 sticky">
      <div class="w-auto">
        <div class="flex flex-wrap items-center">
          <div class="w-auto mr-14">
            <NuxtLink :to="AppRoutes.welcome">
              <img src="@/assets/images/logo.svg" alt=""/>
            </NuxtLink>
          </div>
          <div class="w-auto hidden lg:block">
            <ul class="flex items-center mr-16">
              <li class="mr-9 font-medium hover:text-indigo-900" v-for="link in links">
                <NuxtLink :to="link.path" v-if="link.enabled">{{ link.name }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="w-auto">
        <div class="flex flex-wrap items-center">
          <div class="w-auto hidden mr-5 lg:block">

            <ClientOnly>
              <div class="inline-block">
                <NuxtLink class="font-medium" v-if="!isAuthenticated"
                          :to="AppRoutes.login">
                  Login
                </NuxtLink>
                <UDropdown v-else :items="accountLinks" :popper="{ placement: 'bottom-start'}">
                  <div class="flex justify-center items-center">
                    <span class="font-medium text-sm capitalize">  {{ useAuthStore().userFullName }}
                    </span>
                    <UIcon name="i-heroicons-chevron-down-20-solid"/>
                  </div>
                </UDropdown>
              </div>
            </ClientOnly>
          </div>
          <div class="w-auto hidden lg:block">
            <UButton color="indigo" block :to="AppRoutes.postJob" size="lg"
                     class="bg-indigo-700"
                     square label="Post a job"
                     icon="i-heroicons-megaphone"
                     variant="solid"/>
          </div>
          <div class="w-auto lg:hidden">
            <a href="#">
              <svg
                  class="navbar-burger text-indigo-600"
                  width="51"
                  height="51"
                  viewbox="0 0 56 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="56" height="56" rx="28" fill="currentColor"></rect>
                <path
                    d="M37 32H19M37 24H19"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden navbar-menu fixed top-0 left-0 bottom-0 w-4/6 sm:max-w-xs z-50">
      <div class="navbar-backdrop fixed inset-0 bg-gray-800 opacity-80"></div>
      <nav class="relative z-10 px-9 pt-8 bg-white h-full overflow-y-auto">
        <div class="flex flex-wrap justify-between h-full">
          <div class="w-full">
            <div class="flex items-center justify-between -m-2">
              <div class="w-auto p-2">
                <NuxtLink class="inline-block" to="/">
                  <img src="@/assets/images/logo.svg" alt=""/>
                </NuxtLink>
              </div>
              <div class="w-auto p-2">
                <a class="navbar-burger" href="#">
                  <svg
                      width="24"
                      height="24"
                      viewbox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        d="M6 18L18 6M6 6L18 18"
                        stroke="#111827"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-center py-16 w-full">
            <ul>
              <li class="mb-12" v-for="link in links">
                <NuxtLink class="font-medium hover:text-indigo-900" :href="link.path">{{ link.name }}</NuxtLink>
              </li>
            </ul>
          </div>
          <div class="flex flex-col justify-end w-full pb-8">
            <div class="flex flex-wrap">
              <div class="w-full mb-3">
                <ClientOnly>
                  <div class="block">
                    <NuxtLink class="font-medium" v-if="!isAuthenticated"
                              :to="AppRoutes.login"
                    >
                      Login
                    </NuxtLink>

                    <UDropdown v-else :items="accountLinks" :popper="{ placement: 'bottom-start'}">
                      <div class="flex justify-center items-center">
                    <span class="font-medium capitalize">  {{ useAuthStore().userFullName }}
                    </span>
                        <UIcon name="i-heroicons-chevron-down-20-solid"/>
                      </div>
                    </UDropdown>
                  </div>
                </ClientOnly>

              </div>
              <UButton color="indigo" :to="AppRoutes.postJob" size="lg"
                       icon="i-heroicons-megaphone"
                       class="bg-indigo-700"
                       square label="Post a job"
                       variant="solid"/>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </section>
</template>

<script setup>

import {AppRoutes} from "~/core/routes";
import {useAuthStore} from "~/stores/auth";
import {storeToRefs} from "pinia";
import {AnalyticsEvent} from "~/services/analytics/events";
import {AvailableFlags} from "~/services/feature-flag/available_flags";

const links = ref([
  {
    path: AppRoutes.welcome,
    name: 'Home',
    enabled: true
  },
  {
    path: AppRoutes.companies,
    name: 'Companies',
    enabled: useFeatureFlags().isEnabled(AvailableFlags.companiesList,)
  },
  {
    path: AppRoutes.jobs,
    name: 'Jobs',
    enabled: true
  }, /*{
  path: AppRoutes.hireFlutterDevs,
  name: 'Hire Flutter devs',
}, {
  path: AppRoutes.alerts,
  name: 'Job Alerts',
},*/
  {
    path: AppRoutes.learn,
    name: 'Learn',
    enabled: true
  },
])

const accountLinks = [
  [{
    label: 'User Profile',
    click: () => {
      navigateTo(AppRoutes.myAccount)
    }
  }],
  [{
    label: 'Saved Jobs',
    click: () => {
      navigateTo(AppRoutes.mySavedJobs)
    }
  }],
  [{
    label: 'My Job postings',
    click: () => {
      navigateTo(AppRoutes.myJobs)
    }
  }],
  [{
    label: 'My company',
    click: () => {
      navigateTo(AppRoutes.myCompany)
    }
  }],

  [{
    label: 'Logout',
    click: () => {
      const {$analytics} = useNuxtApp();
      ($analytics).capture(AnalyticsEvent.logoutButtonClicked);

      useAuthStore().logout();
    }
  },],
]

const {isAuthenticated} = storeToRefs(useAuthStore())

</script>
