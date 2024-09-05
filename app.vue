<template>
  <NuxtLoadingIndicator :height=4 color="#283593"/>

  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>

<script setup lang="ts">

useHead({
  title: `Flutter Gigs - The #1 Flutter job platform - ${useRoute().meta.title ?? "Flutter Gigs"}`,
  meta: [
    {
      name: 'description',
      content: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
    },
    {
      name: "viewport",
      content:
          "width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=yes",
    },
    {
      key: "description",
      name: "description",
      content: "Flutter Gigs is a platform to find Flutter framework related job opportunities and more"
    },
    {
      name: "format-detection",
      content: "telephone=no"
    },
  ],
  script: [
    {src: "https://fluttergigs.com/js/main.js", defer: true,},
  ],
  link: [
    {rel: 'canonical', href: 'https://fluttergigs.com'},
    {rel: "icon", type: "image/x-icon", href: "/favicon.ico"},
    {rel: "preconnect", href: "https://fonts.gstatic.com"},
    {
      rel: "stylesheet",
      prefetch: true,
      href: "https://fonts.cdnfonts.com/css/general-sans?styles=135312,135310,135313,135303",
    },
    {
      rel: "stylesheet",
      prefetch: true,
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
    },
    {property: 'og:title', content: 'Flutter Gigs - The #1 Flutter job platform'},
    {property: 'og:image', content: 'https://fluttergigs.com/fluttergigs-og.png'},
    {
      property: 'og:description',
      content: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more'
    },
    {property: 'og:site_name', content: 'Flutter Gigs - The #1 Flutter job platform'},
    {property: 'twitter:card', content: 'summary_large_image'},
    {property: 'twitter:site', content: '@fluttergigs'},
    {
      property: 'twitter:title',
      content: 'Flutter Gigs - Find the best Flutter opportunities at top remote companies around the world'
    },
    {
      property: 'twitter:description',
      content: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more'
    },
    {property: 'twitter:image', content: 'https://fluttergigs.com/fluttergigs-og.png'},
  ],

})

useSeoMeta({
  title: 'Flutter Gigs - The #1 Flutter job platform',
  ogTitle: 'Flutter Gigs - The #1 Flutter job platform',
  ogImage: 'https://fluttergigs.com/fluttergigs-og.png',
  description: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  ogDescription: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  ogSiteName: 'Flutter Gigs - The #1 Flutter job platform',
  twitterCard: 'summary_large_image',
  twitterSite: '@fluttergigs',
  twitterTitle: () => `Flutter Gigs - Find the best Flutter opportunities at top remote companies around the world`,
  twitterDescription: () => 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  twitterImage: () => 'https://fluttergigs.com/fluttergigs-og.png',
})


</script>
