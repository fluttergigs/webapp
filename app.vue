<template>
  <NuxtLoadingIndicator :height=5 color="#283593"/>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>

<script lang="ts" setup>

useHead({
  title: `Flutter Gigs, The #1 Flutter job platform - ${useRoute().meta.title ?? "Flutter Gigs"}`,
  htmlAttrs: {
    lang: 'en'
  },
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
    {src: "https://fluttergigs.com/main.js", defer: true,},
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
  ],
})

useSeoMeta({
  title: () => 'FlutterGigs - The #1 Flutter jobs platform',
  ogTitle: 'FlutterGigs - The #1 Flutter jobs platform',
  // ogImage: 'https://fluttergigs.com/fluttergigs-og.png',
  ogUrl: 'https://fluttergigs.com',
  ogLogo: 'https://fluttergigs.com/ico.png',
  description: 'FlutterGigs is a platform to find Flutter framework related job opportunities and more',
  ogDescription: 'FlutterGigs is a platform to find Flutter framework related job opportunities and more',
  ogSiteName: 'FlutterGigs - The #1 Flutter jobs platform',
  twitterCard: 'summary_large_image',
  twitterUrl: 'https://fluttergigs.com',
  twitterDomain: 'https://fluttergigs.com',
  twitterSite: '@fluttergigs',
  twitterTitle: `FlutterGigs - Find the best Flutter opportunities at top remote companies around the world`,
  twitterDescription: 'FlutterGigs is a platform to find Flutter framework related job opportunities and more',
  // twitterImage: 'https://fluttergigs.com/fluttergigs-og.png',
})
</script>

<style>

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translate(50px, 0);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translate(-50px, 0);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translate(-50px, 0);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translate(50px, 0);
}

</style>
