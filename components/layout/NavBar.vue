<template>
  <section class="overflow-hidden z-[2500]">
    <div class="flex items-center justify-between py-5 bg-blueGray-50 px-4 md:px-18 sticky">
      <div class="w-auto">
        <div class="flex flex-wrap items-center">
          <div class="w-auto mr-14">
            <NuxtLink :to="AppRoutes.welcome">
              <img alt="" class="w-20" src="/logo.webp"/>
            </NuxtLink>
          </div>
          <div class="w-auto hidden lg:block">
            <ul class="flex items-center mr-16">
              <li v-for="link in links" :key="link.name" class="mr-9 font-medium hover:text-indigo-900">
                <UChip :show="link.hasOwnProperty('tag')" :text="link['tag']" color="green" size="xl">
                  <NuxtLink
                      :class="['font-medium hover:text-indigo-900', {'text-indigo-800': useRoute().fullPath === link.path}]"
                      :to="link.path">{{ link.name }}
                  </NuxtLink>
                </UChip>
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
                <NuxtLink v-if="!isAuthenticated" :to="AppRoutes.login"
                          class="font-medium">
                  Login
                </NuxtLink>
                <UDropdown v-else :items="accountLinks" :popper="{ placement: 'bottom-start'}">
                  <div class="flex justify-center items-center">
                    <span class="font-medium text-sm">  {{ useAuthStore().userFullName.toUpperCase() }}
                    </span>
                    <UIcon name="i-heroicons-chevron-down-20-solid"/>
                  </div>
                </UDropdown>
              </div>
            </ClientOnly>
          </div>
          <div class="w-auto hidden lg:block">
            <UButton :to="AppRoutes.postJob" block class="bg-indigo-700" color="indigo"
                     icon="i-heroicons-megaphone"
                     label="Post a job" size="lg"
                     square
                     variant="solid"/>
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
    <div class="hidden navbar-menu fixed top-0 left-0 bottom-0 w-4/6 sm:max-w-xs z-50">
      <div class="navbar-backdrop fixed inset-0 bg-gray-800 opacity-80"></div>
      <nav class="relative z-10 px-9 pt-8 bg-white h-full overflow-y-auto">
        <div class="flex flex-wrap justify-between h-full">
          <div class="w-full">
            <div class="flex items-center justify-between -m-2">
              <div class="w-auto p-2">
                <NuxtLink class="inline-block" to="/">
                  <img alt="" class="w-20" src="/logo.webp"/>
                </NuxtLink>
              </div>
              <div class="w-auto p-2">
                <a class="navbar-burger" href="#">
                  <BurgerIcon/>
                </a>
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-center py-16 w-full">
            <ul>
              <li v-for="link in links" class="mb-12">
                <NuxtLink :href="link.path" class="font-medium hover:text-indigo-900">{{ link.name }}</NuxtLink>
              </li>
            </ul>
          </div>
          <div class="flex flex-col justify-end w-full pb-8">
            <div class="flex flex-wrap">
              <div class="w-full mb-3">
                <ClientOnly>
                  <div class="block">
                    <NuxtLink v-if="!isAuthenticated" :to="AppRoutes.login"
                              class="font-medium"
                    >
                      Login
                    </NuxtLink>

                    <UDropdown v-else :items="accountLinks" :popper="{ placement: 'bottom-start'}">
                      <div class="flex justify-center items-center">
                    <span class="font-medium">  {{ useAuthStore().userFullName.toUpperCase() }}
                    </span>
                        <UIcon name="i-heroicons-chevron-down-20-solid"/>
                      </div>
                    </UDropdown>
                  </div>
                </ClientOnly>

              </div>
              <UButton :to="AppRoutes.postJob" class="bg-indigo-700" color="indigo"
                       icon="i-heroicons-megaphone"
                       label="Post a job"
                       size="lg" square
                       variant="solid"/>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </section>
</template>

<script lang="ts" setup>

import {AppRoutes} from "~/core/routes";
import {useAuthStore} from "~/stores/auth";
import {storeToRefs} from "pinia";
import {AnalyticsEvent} from "~/services/analytics/events";
import {AvailableFlags} from "~/services/feature-flag/available_flags";
import BurgerIcon from "~/components/icons/BurgerIcon.vue";

const links = shallowRef([
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
    isEnabled: true,
  },
  {
    path: AppRoutes.hireConsultants,
    name: 'Consultants',
    tag: useFeatureFlags().isFeatureEnabled(AvailableFlags.hireConsultants,) ? 'New' : 'Soon',
    isEnabled: useFeatureFlags().isFeatureEnabled(AvailableFlags.hireConsultants,)
  },
  {
    path: AppRoutes.learn,
    name: 'Learn',
    enabled: true
  },
])

const isActive = (path) => useRoute().path === path

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
