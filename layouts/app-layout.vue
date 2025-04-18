<template>
  <section class="flex w-full bg-white">
    <!--    xl:flex xl:flex-col-->
    <div
      :class="[
        'navbar-menu relative z-50 flex h-full w-full flex-col transition-all ease-in',
        isAppBarShrunk ? 'max-w-[70px]' : 'max-w-[260px]',
      ]"
    >
      <!--      <div class="navbar-backdrop fixed xl:hidden inset-0 bg-blueGray-50 opacity-10"></div>-->
      <div
        :class="[
          'fixed inset-0 flex h-full flex-col items-center border-r bg-blueGray-50 transition-all duration-200 ease-in',
          isAppBarShrunk ? 'max-w-[70px]' : 'max-w-[260px]',
        ]"
      >
        <!--        App Logo and menu toggle-->
        <div
          :class="[isAppBarShrunk ? 'px-2' : 'px-8']"
          class="my-2 flex w-full items-center justify-between py-3 transition-all duration-200 ease-in"
        >
          <img
            v-if="isAppBarShrunk"
            alt=""
            class="w-10"
            src="/ico.webp"
            @click="useAppStore().toggleAppBarShrink()"
          />
          <img v-else alt="" class="w-14" src="/logo.webp" @click="navigateTo(AppRoutes.welcome)" />
          <div class="w-auto" @click="useAppStore().toggleAppBarShrink()">
            <a class="text-neutral-400 hover:text-neutral-500" href="#">
              <!--              <ChevronDoubleRightIcon class="w-2" v-if="isAppBarShrunk"/>-->
              <ArrowsPointingInIcon v-if="!isAppBarShrunk" class="w-5" />
            </a>
          </div>
        </div>

        <!--    App menu-->
        <div
          class="mx-4 flex flex-grow flex-col justify-between overflow-y-auto overflow-x-hidden py-8"
        >
          <div class="-m-2.5 mb-8 flex flex-col flex-wrap space-y-3 px-7">
            <div
              v-for="(linkItems, section, sectionIndex) in groupedLinks"
              class="my-2"
            >
              <p
                v-if="!!section && !isAppBarShrunk"
                class="text-neutral-400 mb-2 w-auto text-xs font-medium uppercase"
              >
                {{ section }}
              </p>

              <div class="flex flex-col space-y-4">
                <div
                  v-for="(link, index) in linkItems"
                  :class="[
                    'flex w-auto p-2',
                    useRoute().path === link.path
                      ? 'rounded-md bg-indigo-200 text-indigo-800'
                      : '',
                  ]"
                >
                  <div class="flex">
                    <UTooltip
                      :close-delay="100"
                      :open-delay="200"
                      :prevent="!isAppBarShrunk"
                      :text="link.name"
                      :ui="{ background: 'bg-gray-900', color: 'text-white' }"
                    >
                      <NuxtLink
                        v-if="link.path"
                        :class="['flex flex-wrap items-center space-x-3']"
                        :to="link.path"
                      >
                        <component
                          :is="link.icon"
                          :class="['h-6 w-6 text-gray-600']"
                        />
                        <p
                          v-if="!isAppBarShrunk"
                          class="hover:text-neutral-700 font-medium"
                        >
                          {{ link.name }}
                        </p>
                      </NuxtLink>
                      <div
                        v-else
                        :class="[
                          'flex cursor-pointer flex-wrap items-center space-x-3',
                        ]"
                        @click="link.onClick"
                      >
                        <component
                          :is="link.icon"
                          :class="['h-5 w-5 text-gray-600']"
                        />
                        <p
                          v-if="!isAppBarShrunk"
                          class="hover:text-neutral-700 font-medium"
                        >
                          {{ link.name }}
                        </p>
                      </div>
                    </UTooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex min-h-screen w-full flex-1 flex-grow px-1 md:px-6">
      <NuxtPage />
    </div>
    <client-only>
      <UNotifications />
    </client-only>
  </section>
</template>

<script lang="ts" setup>
  import {
    ArrowLeftEndOnRectangleIcon,
    ArrowsPointingInIcon,
    BriefcaseIcon,
    BuildingOffice2Icon,
    CogIcon,
    MegaphoneIcon,
    StarIcon,
    UserIcon,
  } from '@heroicons/vue/24/solid';
  import { AppRoutes } from '~/core/routes';
  import { useCompanyStore } from '~/stores/company';
  import { useSettingStore } from '~/stores/setting';
  import { useAuthStore } from '~/stores/auth';
  import { groupBy } from 'lodash';
  import { useJobStore } from '~/stores/job';
  import { useAppStore } from '~/stores/app';
  import { storeToRefs } from 'pinia';
  import { AnalyticsEvent } from '~/services/analytics/events';
  import { useWebSocket } from '@vueuse/core';
  import { logDev } from '~/core/helpers/log';
  import { PaymentContext } from '~/core/shared/types';

  const links = [
    /*{
      icon: PresentationChartBarIcon,
      path: '/dashboard',
      name: 'Dashboard'
    },*/
    {
      icon: UserIcon,
      path: AppRoutes.consultantProfile,
      section: 'user',
      name: 'My Profile',
    },
    {
      icon: BuildingOffice2Icon,
      path: AppRoutes.myCompany,
      section: 'employer',
      name: 'My Company',
    },
    {
      icon: MegaphoneIcon,
      path: AppRoutes.postJob,
      section: 'employer',
      name: 'Post a Job',
    },
    {
      icon: BriefcaseIcon,
      path: AppRoutes.myJobs,
      section: 'employer',
      name: 'My Job offers',
    },
    {
      icon: StarIcon,
      section: 'user',
      path: AppRoutes.mySavedJobs,
      name: 'Saved Jobs',
    },
    {
      icon: CogIcon,
      section: 'user',
      path: AppRoutes.myAccount,
      name: 'User Settings',
    },
    {
      icon: ArrowLeftEndOnRectangleIcon,
      section: 'user',
      onClick: () => {
        const { $analytics } = useNuxtApp();
        $analytics.capture(AnalyticsEvent.logoutButtonClicked);
        useAuthStore().logout();
      },
      // path: AppRoutes.,
      name: 'Logout',
    },
  ];

  const { isAppBarShrunk } = storeToRefs(useAppStore());
  const groupedLinks = computed(() => groupBy(links, 'section'));

  await Promise.all([
    useFeatureFlags().loadFlags(),
    useCompanyStore().fetchCompanies(),
    useJobStore().fetchJobs(),
    useSettingStore().fetchSetting(),
    useAuthStore().getUser(),
    useLearnStore().fetchLearnCategories(),
    useLearnStore().fetchLearnResources(),
  ]);

  onMounted(() => {
    if (!useAppStore().isAppBarShrunk) {
      useAppStore().toggleAppBarShrink();
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/_ws`;

    const { status, data, send, open, close } = useWebSocket(wsUrl, {
      autoReconnect: true,

      onConnected: (ws) => {
        logDev('connected to websocket');
      },

      onMessage: (ws, event: MessageEvent) => {
        const data = JSON.parse(event.data);

        if (!!data.context && data.context === PaymentContext.jobPost) {
          useCompanyActions().handleJobPostedPayment(data);
          useJobStore().fetchJobs();
        }
      },
    });
  });
</script>

<style scoped></style>