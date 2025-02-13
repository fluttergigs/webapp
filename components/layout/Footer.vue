<template>
  <section class="relative pt-24 bg-black overflow-hidden">
    <img
        alt=""
        class="absolute left-1/2 bottom-0 h-full transform -translate-x-1/2"
        src="@/assets/images/gradient4.svg"
    />
    <div class="relative z-10 container mx-auto">
      <div class="pb-24 border-b border-gray-900 text-white">
        <div class="flex flex-wrap">
          <div class="w-full sm:w-1/2 lg:w-6/12 p-8">
            <div class="lg:max-w-sm">
              <a class="mb-8 inline-block" href="#">
                <img alt="" class="w-40" src="/logo-white.webp"/>
              </a>
              <p class="mb-20 text-gray-400 font-medium leading-relaxed md:max-w-xs">
                Looking for a job in Flutter development? Check out FlutterGigs - the first Flutter job board! Find your
                dream job or post a gig today!
              </p>
              <div class="flex flex-wrap -m-1.5">
                <div class="w-auto p-1.5">
                  <a href="x.com/fluttergigs" target="_blank">
                    <div
                        class="flex items-center justify-center w-9 h-9 border border-gray-800 hover:border-gray-900 rounded-full"
                    >
                      <AltTwitterIcon/>
                    </div>
                  </a>
                </div>
                <!--
                                <div class="w-auto p-1.5">
                                  <a href="#">
                                    <div
                                        class="flex items-center justify-center w-9 h-9 border border-gray-800 hover:border-gray-900 rounded-full"
                                    >
                                      <FacebookIcon/>
                                    </div>
                                  </a>
                                </div>
                -->
                <!--
                                <div class="w-auto p-1.5">
                                  <a href="#">
                                    <div
                                        class="flex items-center justify-center w-9 h-9 border border-gray-800 hover:border-gray-900 rounded-full"
                                    >
                                      <InstagramIcon/>
                                    </div>
                                  </a>
                                </div>
                -->
              </div>
            </div>
          </div>
          <div class="w-full sm:w-1/2 lg:w-2/12 p-8">
            <h3
                class="mb-8 text-sm text-gray-600 uppercase font-semibold leading-normal tracking-px">
              FIND A JOB
            </h3>
            <ul>
              <li class="mb-5">
                <NuxtLink
                    :to="AppRoutes.jobs"
                    class="text-white hover:text-gray-200 font-medium leading-relaxed">Latest Flutter Jobs
                </NuxtLink>
              </li>
              <li class="mb-5">
                <a
                    class="text-white hover:text-gray-200 font-medium leading-relaxed"
                    href="#">Subscribe to job alerts</a>
              </li>
            </ul>
          </div>
          <div class="w-full sm:w-1/2 lg:w-2/12 p-8">
            <h3
                class="mb-8 text-sm text-gray-600 uppercase font-semibold leading-normal tracking-px">
              HIRE
            </h3>
            <ul>
              <li class="mb-5">
                <a class="text-white hover:text-gray-200 font-medium leading-relaxed"
                   href="#"
                   @click.prevent="useCompanyActions().handleJobCreation()">Post a job</a>
              </li>
              <li v-if="useFeatureFlags().isEnabled(AvailableFlags.hireConsultants)" class="mb-5">
                <a
                    class="text-white hover:text-gray-200 font-medium leading-relaxed"
                    href="#">Hire Flutter Consultants</a>
              </li>
            </ul>
          </div>
          <div class="w-full sm:w-1/2 lg:w-2/12 p-8">
            <h3
                class="mb-8 text-sm text-gray-600 uppercase font-semibold leading-normal tracking-px"
            >
              Discover
            </h3>
            <ul>
              <li class="mb-5">
                <NuxtLink
                    :to="AppRoutes.learn"
                    class="text-white hover:text-gray-200 font-medium leading-relaxed">Learning Flutter Resources
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex gap-5 p-2 justify-center font-medium">
          <NuxtLink :to="AppRoutes.privacy">
            <span>Privacy</span>
          </NuxtLink>
          <NuxtLink :to="AppRoutes.terms">
            <span>Terms</span>
          </NuxtLink>
        </div>
      </div>
      <p class="py-5 text-sm text-gray-300 font-medium text-center leading-normal">
        Copyright © {{ new Date().getFullYear() }} FlutterGigs. All Rights Reserved
      </p>
    </div>
  </section>
</template>

<script setup>
import useCompanyActions from "~/composables/useCompanyActions";
import {AppRoutes} from "~/core/routes";
import {AvailableFlags} from "~/services/feature-flag/available_flags";
import AltTwitterIcon from "~/components/icons/AltTwitterIcon.vue";
</script>
