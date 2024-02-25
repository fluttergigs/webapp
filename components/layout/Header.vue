<template>
  <section class="overflow-hidden">
    <div class="flex items-center justify-between py-5 bg-blueGray-50 px-12">
      <div class="w-auto">
        <div class="flex flex-wrap items-center">
          <div class="w-auto mr-14">
            <NuxtLink :to="AppRoutes.welcome">
              <img src="@/assets/images/logo.svg" alt=""/>
            </NuxtLink>
          </div>
          <div class="w-auto hidden lg:block">
            <ul class="flex items-center mr-16">
              <li class="mr-9 font-medium hover:text-gray-700" v-for="link in links">
                <NuxtLink :to="link.path">{{ link.name }}</NuxtLink>
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
                <NuxtLink v-if="!isAuthenticated"
                          :to="AppRoutes.login"
                          class="primary-button"
                          type="button"
                >
                  Login
                </NuxtLink>
                <NuxtLink v-else
                          :to="AppRoutes.myAccount"
                          class="transparent-button"
                >👋, {{ useAuthStore().userFullName }}
                </NuxtLink>
              </div>
            </ClientOnly>
          </div>
          <div class="w-auto hidden lg:block">
            <div class="inline-block">
              <NuxtLink :to="AppRoutes.postJob"
                        class="transparent-button"
                        type="button"
              >
                Post a job
              </NuxtLink>
            </div>
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
                <NuxtLink class="font-medium hover:text-gray-700" :href="link.path">{{ link.name }}</NuxtLink>
              </li>
            </ul>
          </div>
          <div class="flex flex-col justify-end w-full pb-8">
            <div class="flex flex-wrap">
              <div class="w-full mb-3">

                <ClientOnly>
                  <div class="block">
                    <NuxtLink v-if="!isAuthenticated"
                              :to="AppRoutes.login"
                              class="transparent-button"
                              type="button"
                    >
                      Login
                    </NuxtLink>
                    <NuxtLink v-else
                              :to="AppRoutes.myAccount"
                              class="transparent-button"
                    >
                      👋, {{ useAuthStore().userFullName }}
                    </NuxtLink>
                  </div>
                </ClientOnly>

              </div>
              <div class="w-full">
                <div class="block">
                  <NuxtLink
                      :to="AppRoutes.postJob"
                      class="primary-button"
                  >
                    Post a job
                  </NuxtLink>
                </div>
              </div>
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

const links = ref([{
  path: AppRoutes.jobs,
  name: 'Jobs',
}, {
  path: AppRoutes.hireFlutterDevs,
  name: 'Hire Flutter devs',
}, {
  path: AppRoutes.alerts,
  name: 'Job Alerts',
},
  {
    path: AppRoutes.learn,
    name: 'Learn',
  },
])

const {isAuthenticated} = storeToRefs(useAuthStore())

</script>
