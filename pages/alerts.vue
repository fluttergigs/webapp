<template>
  <main>
    <section class="relative pt-32 pb-24 bg-white overflow-hidden">
      <img
          alt=""
          class="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          src="@/assets/images/gradient.svg"
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
                  id="newsletterInput4-1"
                  class="px-4 py-4 w-full text-gray-500 font-medium text-center placeholder-gray-500 outline-none border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                  placeholder="Your email address"
                  type="text"
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
                  fill="none"
                  height="18"
                  viewbox="0 0 18 18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M3.75 9.75L6.75 12.75L14.25 5.25"
                    stroke="#4F46E5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                ></path>
              </svg>
              <span class="font-medium leading-relaxed">Get weekly reports</span>
            </li>
            <li class="inline-flex flex-wrap items-center p-4">
              <svg
                  class="mr-2.5"
                  fill="none"
                  height="18"
                  viewbox="0 0 18 18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M3.75 9.75L6.75 12.75L14.25 5.25"
                    stroke="#4F46E5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                ></path>
              </svg>
              <span class="font-medium leading-relaxed">Unlimited free resources</span>
            </li>
            <li class="inline-flex flex-wrap items-center p-4">
              <svg
                  class="mr-2.5"
                  fill="none"
                  height="18"
                  viewbox="0 0 18 18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M3.75 9.75L6.75 12.75L14.25 5.25"
                    stroke="#4F46E5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                ></path>
              </svg>
              <span class="font-medium leading-relaxed">Premium contents</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'main-layout'
})
</script>
