<template>
  <div class="flex flex-col w-full">
    <section class="py-8 px-2 md:py-16 xl:pb-56 bg-white overflow-hidden">
      <h3
          class="mb-4 text-4xl md:text-5xl font-heading font-bold tracking-px-n leading-tight">
        Your company <span class="text-indigo-500">{{ formInput.name }}</span>
      </h3>
      <p class="text-xl ">Set your company information</p>


      <form class="flex flex-col space-y-6 my-12 mr-8">
        <div class="flex space-x-4 mb-5 w-full">
          <CustomInput class="w-1/2" name="name" label="Company name" placeholder="Name"
                       v-model="formInput.name"/>
          <CustomInput class="w-1/2" name="email" label="Email" type="email" :is-disabled="true"
                       v-model="formInput.email"/>
        </div>
        <div class="block mb-5">
          <CustomInput name="url" label="Website" placeholder="Website" v-model="formInput.website" type="email"/>
        </div>
        <div class="block mb-5">
          <CustomInput name="url" label="Company Logo url" placeholder="Logo" v-model="formInput.logo" type="text"/>
        </div>
        <div class="block mb-5">
          <div class="space-y-2">
            <p class="text-sm">Size</p>
            <USelectMenu
                clear-search-on-close
                size="xl"
                searchable
                v-model="formInput.size"
                :options="companySizeOptions"
                placeholder="Select your company size"
                value-attribute="id"
                option-attribute="label"/>
          </div>
        </div>
        <div class="block mb-5">
          <CustomInput :is-text-area="true" name="description" label="Description" placeholder="Description"
                       v-model="formInput.description"
                       type="text"/>
        </div>

        <button
            :disabled="!canSubmit || companyStore.companyUpdate.isLoading"
            class="primary-button flex items-center justify-center space-x-2 m-auto max-w-xs"
            type="button"
            @click.prevent="submit"
        >
          <LoadingSpinnerIcon v-if="companyStore.companyUpdate.isLoading" class="text-primary animate-spin"/>
          <span v-else> Save changes</span>
        </button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">

import LoadingSpinnerIcon from "~/components/icons/LoadingSpinnerIcon.vue";
import CustomInput from "~/components/forms/CustomInput.vue";
import {useAuthStore} from "~/stores/auth";
import {companyUpdateFormSchema} from "~/core/validations/company.validations";
import {AnalyticsEvent} from "~/services/analytics/events";
import {useCompanyStore} from "~/stores/company";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {companySizeOptions} from "~/core/constants";
import {CompanySize} from "~/features/companies/company.types";

useHead({title: "Flutter Gigs - Company information update"});

definePageMeta({layout: 'app-layout', middleware: ['auth', 'no-company']})

const authStore = useAuthStore()
const companyStore = useCompanyStore()

const {$analytics, $toast} = useNuxtApp()

const formInput = ref({
  email: authStore.myCompany.email,
  user: authStore.authUser.id,
  name: authStore.myCompany.name,
  website: authStore.myCompany.website,
  logo: authStore.myCompany.logo,
  description: authStore.myCompany.description,
  size: authStore.myCompany.size ?? CompanySize.small,
})

const canSubmit = ref(false)

watch(formInput, async () => {
  canSubmit.value = await companyUpdateFormSchema.isValid(formInput.value);

}, {deep: true, immediate: true},)

onMounted(() => {
  (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.companyUpdatePageEntered);
})

const submit = async () => {
  try {
    (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.companyUpdateButtonClicked, formInput.value);
    await companyStore.updateCompany({data: formInput.value});
    (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.successfulCompanyUpdate, formInput.value);

    $toast.success(<string>companyStore.companyUpdate!.message);
  } catch (e) {
    $toast.error(<string>companyStore.companyUpdate!.message);
  }
}


</script>

<style scoped>

</style>