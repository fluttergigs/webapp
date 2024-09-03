<template>

  <section class="py-20 bg-blueGray-100">
    <div class="flex flex-col gap-4 overflow-hidden">
      <div class="container px-4 mx-auto flex justify-center items-center">
        <div class="flex justify-center max-w-2xl">
          <h3 class="text-3xl md:text-7xl font-semibold primary-gradient">
            Best resources for your skills
          </h3>
        </div>
      </div>
    </div>
  </section>

  <section class="py-20 px-10 bg-white">
    <div class="flex flex-col gap-4 overflow-hidden">

      <div class="flex flex-wrap gap-3 justify-center items-center">
        <UButton v-for="category in getLearnCategories"
                 :key="category.slug"
                 :label="category.title"
                 :color="category.slug === getSelectedCategory?.slug ? 'primary' : 'gray'"
                 class="primary-button px-4 max-w-[80px]"
                 @click="useLearnStore().setSelectedCategory(category)"/>
      </div>
    </div>
  </section>


</template>

<script setup>

import '@/components/landing/Header.vue'
import {storeToRefs} from "pinia";

definePageMeta({
  layout: 'main-layout',
})


useSeoMeta({
  title: 'Flutter Gigs - The #1 Flutter job platform',
  ogTitle: 'Flutter Gigs - The #1 Flutter job platform',
  description: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  ogDescription: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  ogSiteName: 'Flutter Gigs',
  twitterCard: 'summary_large_image',
  twitterSite: '@fluttergigs',
  twitterTitle: () => `Flutter Gigs - Find the best Flutter opportunities at top remote companies around the world`,
  twitterDescription: () => 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  twitterImage: () => 'https://fluttergigs.com/images/og-image.png',
})


</script>
