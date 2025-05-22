<template>
  <NuxtLoadingIndicator :height="5" color="#283593" />
  <UApp>
    <NuxtLayout>
      <div class="pattern-bg">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </UApp>
</template>

<script lang="ts" setup>
  import { useFluppets } from '~/composables/useFluppets';
  import { useAuthStore } from '~/stores/auth';
  import { useCompanyStore } from '~/stores/company';
  import { useJobStore } from '~/stores/job';
  import { useSettingStore } from '~/stores/setting';

  useHead({
    htmlAttrs: {
      lang: 'en',
    },

    meta: [
      {
        name: 'description',
        content:
          'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=yes',
      },
      {
        key: 'description',
        name: 'description',
        content:
          'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
      },
      {
        name: 'format-detection',
        content: 'telephone=no',
      },
    ],
    script: [{ src: 'https://fluttergigs.com/main.js', defer: true }],
    link: [
      { rel: 'canonical', href: 'https://fluttergigs.com' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        prefetch: true,
        href: 'https://fonts.cdnfonts.com/css/general-sans?styles=135312,135310,135313,135303',
      },
      {
        rel: 'stylesheet',
        prefetch: true,
        href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
      },
      {
        rel: 'stylesheet',
        prefetch: true,
        href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap',
      },
    ],
  });

  useSeoMeta({
    title: 'FlutterGigs - The #1 Flutter jobs platform',
    ogTitle: 'FlutterGigs - The #1 Flutter jobs platform',
    ogImage: 'https://fluttergigs.com/fluttergigs-og-1.png',
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
    twitterImage: 'https://fluttergigs.com/fluttergigs-og-1.png',
  });

  defineOgImage({
    url: 'https://fluttergigs.com/fluttergigs-og.png',
  });

  await Promise.all([
    useCompanyStore().fetchCompanies(),
    useJobStore().fetchJobs(),
    useSettingStore().fetchSetting(),
    useAuthStore().getUser(),
    useLearnStore().fetchLearnCategories(),
    useLearnStore().fetchLearnResources(),
    useFluppets().fetchFluppets(),
  ]);

  onMounted(() => {
    useFeatureFlags().loadFlags();
  });
</script>

<style>
  .page-enter-active,
  .page-leave-active {
    transition: all 0.35s;
  }

  .page-enter-active,
  .page-leave-active {
    transform: translate(0px, 0px);
    opacity: 1;
  }

  .page-enter-from,
  .page-leave-to {
    transform: translate(0px, 20px);
    opacity: 0;
  }

  /*.slide-left-enter-active,
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
  }*/

  #sentry-feedback .widget__actor {
    left: 0 !important;
    width: fit-content;
  }
</style>
