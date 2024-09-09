<template>
  <section class="flex w-full bg-white">
    <!--    xl:flex xl:flex-col-->
    <div
        :class="['navbar-menu relative z-50 w-full flex flex-col h-full transition-all ease-in',
        isAppBarShrunk? 'max-w-[70px]': 'max-w-[240px]']">
      <!--      <div class="navbar-backdrop fixed xl:hidden inset-0 bg-blueGray-50 opacity-10"></div>-->
      <div
          :class="['flex flex-col items-center inset-0 bg-blueGray-50 border-r fixed transition-all ease-in duration-200 h-full',
          isAppBarShrunk? 'max-w-[70px]': 'max-w-[240px]']">

        <!--        App Logo and menu toggle-->
        <div class="flex items-center justify-between py-3 my-2 w-full transition-all ease-in duration-200"
             :class="[isAppBarShrunk? 'px-2': 'px-8']">
          <img class="w-10" src="/ico.webp" alt="" v-if="isAppBarShrunk"
               @click="useAppStore().toggleAppBarShrink()">
          <img class="w-16" src="/logo.webp" alt="" v-else>
          <div class="w-auto" @click="useAppStore().toggleAppBarShrink()">
            <a class="text-neutral-400 hover:text-neutral-500" href="#">
              <!--              <ChevronDoubleRightIcon class="w-2" v-if="isAppBarShrunk"/>-->
              <ArrowsPointingInIcon class="w-5" v-if="!isAppBarShrunk"/>
            </a>
          </div>
        </div>

        <!--    App menu-->
        <div class="flex flex-col justify-between flex-grow mx-4 py-8 overflow-x-hidden overflow-y-auto">
          <div class="flex flex-col space-y-3 flex-wrap px-7 mb-8 -m-2.5">
            <div v-for="(linkItems,section, sectionIndex) in groupedLinks" class="my-3">
              <p v-if="!!section && !isAppBarShrunk" class="w-auto text-xs text-neutral-400 font-medium uppercase mb-2">
                {{ section }}
              </p>

              <div class="flex flex-col space-y-4">
                <div
                    :class="['w-auto p-2 flex', useRoute().path===link.path ?'text-indigo-800 bg-indigo-200 rounded-md':'']"
                    v-for="(link, index) in linkItems">

                  <div class="flex">
                    <UTooltip :prevent="!isAppBarShrunk" :open-delay="200" :close-delay="100"
                              :ui="{background: 'bg-gray-900', color: 'text-white'}"
                              :text="link.name">

                      <NuxtLink v-if="link.path" :to="link.path"
                                :class="['flex flex-wrap items-center space-x-3']">
                        <component :is="link.icon"
                                   :class="['w-5 h-5 text-gray-600']"/>
                        <p v-if="!isAppBarShrunk" class="hover:text-neutral-700 font-medium">{{ link.name }}</p>
                      </NuxtLink>
                      <div v-else @click="link.onClick"
                           :class="['flex flex-wrap items-center space-x-3 cursor-pointer']">
                        <component :is="link.icon"
                                   :class="['w-5 h-5 text-gray-600']"/>
                        <p v-if="!isAppBarShrunk" class="hover:text-neutral-700 font-medium">{{ link.name }}</p>
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
    <div class="flex flex-1 flex-grow px-1 md:px-6  w-full min-h-screen">
      <NuxtPage/>
    </div>
    <client-only>
      <UNotifications/>
    </client-only>
  </section>
</template>

<script setup>

import {
  ArrowLeftEndOnRectangleIcon,
  ArrowsPointingInIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  StarIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'
import {AppRoutes} from "~/core/routes";
import {useCompanyStore} from "~/stores/company";
import {useSettingStore} from "~/stores/setting";
import {useAuthStore} from "~/stores/auth";
import {groupBy} from "lodash"
import {useJobStore} from "~/stores/job";
import {useAppStore} from "~/stores/app";
import {storeToRefs} from "pinia";
import {AnalyticsEvent} from "~/services/analytics/events";


const links = [
  /*{
    icon: PresentationChartBarIcon,
    path: '/dashboard',
    name: 'Dashboard'
  },*/
  {
    icon: BuildingOffice2Icon,
    path: AppRoutes.myCompany,
    section: 'employer',
    name: 'My Company'
  },
  {
    icon: BriefcaseIcon,
    path: AppRoutes.myJobs,
    section: 'employer',
    name: 'My Job offers'
  },
  {
    icon: StarIcon,
    section: "user",
    path: AppRoutes.mySavedJobs,
    name: 'Saved Jobs',
  },
  {
    icon: UserIcon,
    section: "user",
    path: AppRoutes.myAccount,
    name: 'User Settings',
  },
  {
    icon: ArrowLeftEndOnRectangleIcon,
    section: "user",
    onClick: () => {
      const {$analytics} = useNuxtApp();
      ($analytics).capture(AnalyticsEvent.logoutButtonClicked);
      useAuthStore().logout()
    },
    // path: AppRoutes.,
    name: 'Logout',
  }
]

const {isAppBarShrunk} = storeToRefs(useAppStore())
const groupedLinks = computed(() => groupBy(links, 'section'))

onBeforeMount(async () => {
  await Promise.all([
    useCompanyStore().fetchCompanies(),
    useJobStore().fetchJobs(),
    useSettingStore().fetchSetting(),
    useAuthStore().fetchUser(),
    useLearnStore().fetchLearnCategories(),
    useLearnStore().fetchLearnResources(),
  ])
})

onMounted(() => {
  if (!useAppStore().isAppBarShrunk) {
    useAppStore().toggleAppBarShrink()
  }
})

</script>

<style scoped>

</style>