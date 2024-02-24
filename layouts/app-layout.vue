<template>
  <section class="flex w-full bg-white">
    <!--
          <nav class="flex xl:hidden items-center justify-between py-3.5 px-7 bg-light">
            <div class="w-full xl:w-auto px-2 xl:mr-10">
              <div class="flex items-center justify-between"><a class="inline-flex items-center h-7" href="#"><img
                  src="@/assets/images/logo.svg" alt=""></a>
                <div class="xl:hidden">
                  <button class="navbar-burger text-gray-400 hover:text-gray-300 focus:outline-none">
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                          d="M1 2H19C19.2652 2 19.5196 1.89464 19.7071 1.70711C19.8946 1.51957 20 1.26522 20 1C20 0.734784 19.8946 0.48043 19.7071 0.292893C19.5196 0.105357 19.2652 0 19 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1C0 1.26522 0.105357 1.51957 0.292893 1.70711C0.48043 1.89464 0.734784 2 1 2ZM19 10H1C0.734784 10 0.48043 10.1054 0.292893 10.2929C0.105357 10.4804 0 10.7348 0 11C0 11.2652 0.105357 11.5196 0.292893 11.7071C0.48043 11.8946 0.734784 12 1 12H19C19.2652 12 19.5196 11.8946 19.7071 11.7071C19.8946 11.5196 20 11.2652 20 11C20 10.7348 19.8946 10.4804 19.7071 10.2929C19.5196 10.1054 19.2652 10 19 10ZM19 5H1C0.734784 5 0.48043 5.10536 0.292893 5.29289C0.105357 5.48043 0 5.73478 0 6C0 6.26522 0.105357 6.51957 0.292893 6.70711C0.48043 6.89464 0.734784 7 1 7H19C19.2652 7 19.5196 6.89464 19.7071 6.70711C19.8946 6.51957 20 6.26522 20 6C20 5.73478 19.8946 5.48043 19.7071 5.29289C19.5196 5.10536 19.2652 5 19 5Z"
                          fill="currentColor"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </nav>
    -->
    <div class="navbar-menu max-w-xs relative z-50 w-full xl:flex xl:flex-col transition-all ease-in">
      <div class="navbar-backdrop fixed xl:hidden inset-0 bg-blueGray-50 opacity-10"></div>
      <div class="inset-0 max-w-xs bg-blueGray-50 border-r fixed transition-all ease-in">
        <div class="flex flex-wrap items-center justify-between px-7 py-6 pb-0">
          <div class="w-auto"><a class="inline-block">
            <img src="@/assets/images/logo.svg" alt=""></a>
          </div>
          <div class="w-auto">
            <a class="text-neutral-400 hover:text-neutral-500" href="#">
              <ArrowBackIcon/>
            </a>
          </div>
        </div>
        <div class="flex-1 flex flex-col justify-between py-8 overflow-x-hidden overflow-y-auto">
          <div class="flex flex-col flex-wrap px-7 mb-8 -m-2.5">

            <div v-for="(linkItems,section) in groupedLinks" class="my-2">
              <p v-if="!!section" class="w-auto text-xs text-neutral-400 font-medium uppercase mb-4">
                {{ section }}
              </p>


              <div class="w-auto py-2" v-for="link in linkItems">
                <NuxtLink :to="link.path"
                          :class="['flex flex-wrap items-center space-x-3', useRoute().path===link.path ?'text-indigo-500':'']">
                  <component :is="link.icon"
                             :class="['w-5 h-5',useRoute().path===link.path ?'text-indigo-500':'text-gray-600']"/>
                  <p class="hover:text-neutral-700 font-medium">{{ link.name }}</p>
                </NuxtLink>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="xl:pl-4 flex flex-1 grow w-full min-h-screen">
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
    name: 'Company'
  },
  {
    icon: ClipboardDocumentListIcon,
    path: AppRoutes.myJobs,
    section: 'Employer',
    name: 'Jobs'
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
    useSettingStore().fetchSetting(),
    useAuthStore().fetchUser(),
  ])
})

</script>

<style scoped>

</style>