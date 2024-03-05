<template>
  <section class="flex w-full bg-white">
    <!--    xl:flex xl:flex-col-->
    <div class="navbar-menu max-w-[240px] relative z-50 w-full flex flex-col h-full transition-all ease-in">
      <!--      <div class="navbar-backdrop fixed xl:hidden inset-0 bg-blueGray-50 opacity-10"></div>-->
      <div class="inset-0 max-w-[240px] bg-blueGray-50 border-r fixed transition-all ease-in h-full">
        <div class="flex flex-wrap items-center justify-between px-9 py-6 pb-0">
          <div class="w-auto">
            <NuxtLink :to="AppRoutes.welcome" class="inline-block">
              <img src="@/assets/images/logo.svg" alt="">
            </NuxtLink>
          </div>
          <div class="w-auto">
            <a class="text-neutral-400 hover:text-neutral-500" href="#">
              <ArrowBackIcon/>
            </a>
          </div>
        </div>
        <div class="flex flex-col justify-between mx-4 py-8 overflow-x-hidden overflow-y-auto">
          <div class="flex flex-col flex-wrap px-7 mb-8 -m-2.5">

            <div v-for="(linkItems,section, sectionIndex) in groupedLinks" class="my-3">
              <p v-if="!!section" class="w-auto text-xs text-neutral-400 font-medium uppercase mb-2">
                {{ section }}
              </p>

              <div
                  :class="['w-auto p-2 flex', useRoute().path===link.path ?'text-blueGray-800 bg-gray-200 rounded-md':'']"
                  v-for="(link, index) in linkItems">

                <div class="flex">
                  <NuxtLink :to="link.path"
                            :class="['flex flex-wrap items-center space-x-3']">
                    <component :is="link.icon"
                               :class="['w-5 h-5 text-gray-600']"/>
                    <p class="hover:text-neutral-700 font-medium">{{ link.name }}</p>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="px-6 flex flex-1 grow w-full min-h-screen">
      <NuxtPage/>
    </div>
  </section>
</template>

<script setup>

import {
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  PresentationChartBarIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import {AppRoutes} from "~/core/routes";
import ArrowBackIcon from "~/components/icons/ArrowBackIcon.vue";
import {useCompanyStore} from "~/stores/company";
import {useSettingStore} from "~/stores/setting";
import {useAuthStore} from "~/stores/auth";
import {groupBy} from "lodash"
import {useJobStore} from "~/stores/job";

const links = [
  {
    icon: PresentationChartBarIcon,
    path: '/dashboard',
    name: 'Dashboard'
  },
  {
    icon: BuildingOffice2Icon,
    path: AppRoutes.myCompany,
    section: 'Employer',
    name: 'My Company'
  },
  {
    icon: ClipboardDocumentListIcon,
    path: AppRoutes.myJobs,
    section: 'Employer',
    name: 'My Job offers'
  },
  {
    icon: UserIcon,
    section: "User",
    path: AppRoutes.myAccount,
    name: 'User Settings',
  }
]

const groupedLinks = computed(() => groupBy(links, 'section'))

onBeforeMount(async () => {
  await Promise.all([
    useCompanyStore().fetchCompanies(),
    useJobStore().fetchJobs(),
    useSettingStore().fetchSetting(),
    useAuthStore().fetchUser(),
  ])
})

</script>

<style scoped>

</style>