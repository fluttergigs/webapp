<script lang="ts" setup>
  //@ts-ignore
  import { CheckCircleIcon } from '@heroicons/vue/24/outline';

  const postJob = () => {
    useCompanyActions().handleJobCreation();
  };
</script>

<template>
  <section class="relative py-24 bg-white">
    <div class="relative z-10 container px-4 mx-auto">
      <div class="flex flex-wrap lg:items-center -m-8">
        <div class="w-full md:w-1/2 p-8">
          <div class="md:max-w-lg">
            <p class="mb-6 text-sm text-indigo-600 font-bold uppercase tracking-px">
              For companies
            </p>

            <h2
              class="mb-16 lg:mb-52 text-6xl md:text-5xl xl:text-7xl font-bold font-heading tracking-px-n leading-none"
            >
              Post a job in the #1 Flutter job board
            </h2>
            <h3 class="mb-6 text-lg text-gray-900 font-semibold leading-normal">
              Looking for your next great employee? Use FlutterGigs today!
            </h3>
            <p class="font-medium text-gray-600 leading-relaxed">
              With our easy-to-use platform, you can post your job and sift through candidates with
              ease. So why wait? Get started today!
            </p>
          </div>
        </div>
        <div class="w-full md:w-1/2 p-8">
          <div class="md:max-w-md mx-auto overflow-hidden rounded-3xl shadow-md">
            <div class="p-9">
              <span
                class="mb-7 inline-block text-sm text-gray-500 font-semibold uppercase tracking-px"
                >Features included:</span
              >
              <ul>
                <li class="mb-4 flex items-center space-x-2">
                  <CheckCircleIcon class="w-5 text-indigo-700" />
                  <p class="font-semibold leading-normal">
                    Get in front of 100's of Flutter developers
                  </p>
                </li>
                <li class="mb-4 flex items-center space-x-2">
                  <CheckCircleIcon class="w-5 text-indigo-700" />
                  <p class="font-semibold leading-normal">
                    More than 1k of applications every month
                  </p>
                </li>
                <li class="mb-4 flex items-center space-x-2">
                  <CheckCircleIcon class="w-5 text-indigo-700" />
                  <p class="font-semibold leading-normal">Modern dashboard for your activity</p>
                </li>
              </ul>
            </div>
            <div class="p-9 bg-white">
              <div class="flex flex-wrap -m-8">
                <div class="w-full sm:w-1/2 p-8">
                  <span
                    class="mb-2 inline-block text-sm text-gray-500 font-semibold uppercase tracking-px"
                    >BEST PACKAGE</span
                  >
                  <p class="text-gray-900 font-semibold leading-normal">
                    Best for Startups &amp; Small Businesses
                  </p>
                </div>
                <div class="w-full sm:w-1/2 p-8">
                  <div class="sm:max-w-max ml-auto">
                    <p class="font-bold">
                      <span class="text-5xl leading-tight tracking-px-n">$20</span>
                      <span class="text-lg text-gray-500 leading-snug tracking-px-n"
                        >/Job Offer</span
                      >
                    </p>
                    <p class="font-medium text-gray-600 leading-relaxed">One Time Payment</p>
                  </div>
                </div>
              </div>
              <div class="mt-9">
                <button
                  class="py-4 px-5 w-full text-white font-semibold rounded-xl focus:ring focus:ring-indigo-300 bg-indigo-600 hover:bg-indigo-700 transition ease-in-out duration-200 cursor-pointer"
                  type="button"
                  @click="postJob"
                >
                  Post a job now for only $20
                </button>
              </div>
              <p
                class="my-3 text-sm text-center primary-gradient font-semibold uppercase tracking-p"
              >
                First job post is free!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
