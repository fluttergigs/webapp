<template>
  <main>
    <LazyLandingHeader />

    <UserSection />

    <section class="bg-blueGray-100 py-20">
      <div class="container mx-auto px-4">
        <div class="-m-8 flex flex-wrap items-center">
          <div class="w-full p-8 md:w-1/3">
            <div class="md:max-w-sm">
              <div class="m-3 flex flex-wrap items-center">
                <div class="w-auto p-3">
                  <div
                    class="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100"
                  >
                    <img alt="" src="@/assets/images/chat.svg" />
                  </div>
                </div>
                <div class="flex-1 p-3">
                  <h3 class="text-xl font-semibold">
                    A platform to find Flutter framework related job
                    opportunities and more
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full p-8 md:w-1/3">
            <div class="md:max-w-sm">
              <div class="m-3 flex flex-wrap items-center">
                <div class="w-auto p-3">
                  <div
                    class="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100"
                  >
                    <img alt="" src="@/assets/images/layers.svg" />
                  </div>
                </div>
                <div class="flex-1 p-3">
                  <h3 class="text-xl font-semibold">
                    Effortlessly find and apply to Flutter framework related job
                    offers
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full p-8 md:w-1/3">
            <div class="md:max-w-sm">
              <div class="m-3 flex flex-wrap items-center">
                <div class="w-auto p-3">
                  <div
                    class="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100"
                  >
                    <img alt="" src="@/assets/images/replace.svg" />
                  </div>
                </div>
                <div class="flex-1 p-3">
                  <h3 class="text-xl font-semibold">
                    Get expert guidance and support to land your dream Flutter
                    job
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <SecondaryUserSection />

    <CompanySection />

    <CompanyCreationSection />
    <!--  <section class="relative pt-32 pb-24 bg-white">
        <img
            class="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            src="@/assets/images/gradient.svg"
            alt=""
        />
        <div class="relative z-10 container px-4 mx-auto">
          <div class="text-center max-w-2xl mx-auto">
            <p class="mb-5 text-sm text-indigo-600 font-semibold uppercase tracking-px">
              JOB ALERTS
            </p>
            <h2
                class="mb-11 text-6xl md:text-7xl text-center font-bold font-heading tracking-px-n leading-tight"
            >
              Subscribe to get the latest Flutter gigs
            </h2>
            <form class="mb-11 md:max-w-md mx-auto">
              <div class="mb-5">
                <input
                    class="px-4 py-4 w-full text-gray-500 font-medium text-center placeholder-gray-500 outline-none border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                    id="newsletterInput4-1"
                    type="text"
                    placeholder="Your email address"
                />
              </div>
              <button
                  class="py-4 px-6 w-full text-white font-semibold rounded-xl shadow-4xl focus:ring focus:ring-indigo-300 bg-indigo-600 hover:bg-indigo-700 transition ease-in-out duration-200"
                  type="button"
              >
                Subscribe
              </button>
            </form>
            <ul class="-m-4">
              <li class="inline-flex flex-wrap items-center p-4">
                <svg
                    class="mr-2.5"
                    width="18"
                    height="18"
                    viewbox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      d="M3.75 9.75L6.75 12.75L14.25 5.25"
                      stroke="#4F46E5"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                  ></path>
                </svg>
                <span class="font-medium leading-relaxed">Get weekly reports</span>
              </li>
              <li class="inline-flex flex-wrap items-center p-4">
                <svg
                    class="mr-2.5"
                    width="18"
                    height="18"
                    viewbox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      d="M3.75 9.75L6.75 12.75L14.25 5.25"
                      stroke="#4F46E5"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                  ></path>
                </svg>
                <span class="font-medium leading-relaxed">Unlimited free resources</span>
              </li>
              <li class="inline-flex flex-wrap items-center p-4">
                <svg
                    class="mr-2.5"
                    width="18"
                    height="18"
                    viewbox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      d="M3.75 9.75L6.75 12.75L14.25 5.25"
                      stroke="#4F46E5"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                  ></path>
                </svg>
                <span class="font-medium leading-relaxed">Premium contents</span>
              </li>
            </ul>
          </div>
        </div>
      </section>-->
  </main>
</template>

<script lang="ts" setup>
  import '@/components/landing/Header.vue';
  import UserSection from '~/components/landing/UserSection.vue';
  import SecondaryUserSection from '~/components/landing/SecondaryUserSection.vue';
  import CompanySection from '~/components/landing/CompanySection.vue';
  import CompanyCreationSection from '~/components/landing/CompanyCreationSection.vue';

  definePageMeta({
    layout: 'main-layout',
    title: 'The #1 Flutter job platform in the world',
  });

  useSeoMeta({
    title: 'FlutterGigs - The #1 Flutter jobs platform',
    ogTitle: 'FlutterGigs - The #1 Flutter jobs platform',
    ogUrl: 'https://fluttergigs.com',
    ogLogo: 'https://fluttergigs.com/ico.png',
    description:
      'FlutterGigs is a platform to find Flutter framework related job opportunities and more',
    ogDescription:
      'FlutterGigs is a platform to find Flutter framework related job opportunities and more',
    ogSiteName: 'FlutterGigs - The #1 Flutter jobs platform',
    twitterCard: 'summary_large_image',
    twitterUrl: 'https://fluttergigs.com',
    twitterDomain: 'https://fluttergigs.com',
    twitterSite: '@fluttergigs',
    twitterTitle: `FlutterGigs - Find the best Flutter opportunities at top remote companies around the world`,
    twitterDescription:
      'FlutterGigs is a platform to find Flutter framework related job opportunities and more',
  });
</script>
