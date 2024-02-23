<template>
  <section class="bg-blueGray-50">
    <div class="overflow-hidden pt-16">
      <div class="container px-4 mx-auto">
        <div class="flex flex-wrap -m-8">
          <div class="w-full md:w-1/2 p-8" contenteditable="false">
            <div
                class="inline-block mb-6 px-2 py-1 font-semibold bg-green-100 rounded-full">
              <div class="flex flex-wrap items-center -m-1 p-2" contenteditable="false">
                <div class="w-auto" contenteditable="false">
                  <NuxtLink class="text-sm" :to="AppRoutes.jobs" contenteditable="false">Find the best Flutter gigs from
                    all around the
                    world!
                  </NuxtLink>
                </div>
                <div class="w-auto p-1">
                  <svg
                      width="15"
                      height="15"
                      viewbox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        d="M8.66667 3.41675L12.75 7.50008M12.75 7.50008L8.66667 11.5834M12.75 7.50008L2.25 7.50008"
                        stroke="black"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <h1
                class="mb-6 text-6xl md:text-8xl lg:text-10xl font-bold
                md:max-w-xl leading-none primary-gradient"
                contenteditable="false">
              The #1 Flutter job board in the ecosystem<br/>
            </h1>
            <p class="mb-11 text-lg text-gray-900 font-medium md:max-w-md">
              Get the best-in-class group mentoring plans and professional benefits for
              your team
            </p>
            <div class="flex flex-wrap -m-2.5 mb-20">
              <div class="w-full md:w-auto p-2.5">
                <div class="block">
                  <button
                      class="py-4 px-6 w-full text-white font-semibold border border-indigo-700 rounded-xl focus:ring focus:ring-indigo-300 bg-indigo-600 hover:bg-indigo-700 transition ease-in-out duration-200"
                      type="button"
                  >
                    View all jobs
                  </button>
                </div>
              </div>
              <div class="w-full md:w-auto p-2.5">
                <div class="block">
                  <button @click="useCompanyActions().handleJobCreation"
                          class="py-4 px-9 w-full font-semibold border border-gray-300 hover:border-gray-400 rounded-xl focus:ring focus:ring-gray-50 bg-transparent hover:bg-gray-100 transition ease-in-out duration-200"
                          type="button"
                  >
                    <div class="flex flex-wrap justify-center items-center -m-1">
                      <div class="w-auto p-1">
                        <PhoneIcon/>
                      </div>
                      <div class="w-auto p-1">
                        <span contenteditable="false">Post a new Flutter job</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full md:w-1/2 p-8">
            <img
                class="transform hover:-translate-y-16 transition ease-in-out duration-1000"
                src="@/assets/images/header.png"
                alt=""
                contenteditable="false"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

import {AppRoutes} from "~/core/routes";
import useCompanyActions from '@/composables/useCompanyActions'
import PhoneIcon from "~/components/icons/PhoneIcon.vue";
</script>
<style scoped>

</style>