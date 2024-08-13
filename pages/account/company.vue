<!--TODO - upload logo for company-->

<template>
  <CompanyDescriptionGenerationModal @on-generate="({result})=> formInput.description = result"/>
  <div class="flex flex-col w-full">
    <section class="py-8 px-2 md:py-12 xl:pb-56 bg-white overflow-hidden">
      <h3
          class="mb-4 text-2xl md:text-4xl font-semibold tracking-px-n leading-tight">
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
          <CustomInput name="url" label="Website" placeholder="Website" v-model="formInput.website"/>
        </div>
        <div class="flex space-x-4 mb-5 w-full">
          <CustomInput class="w-1/2" name="url" label="Linkedin"
                       v-model="formInput.linkedin"/>
          <CustomInput class="w-1/2" name="url" label="Twitter"
                       v-model="formInput.twitter"/>
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
          <!--          TODO generate company description using AI-->
          <CustomInput
              @inside-text-clicked="companyStore.showCompanyDescriptionGenerationModal()"
              inside-text="Generate using AI" :is-text-area="true" name="description" label="Description"
              placeholder="Description"
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
import type {UpdateCompanyRequest} from "~/features/companies/company.types";
import {CompanySize,} from "~/features/companies/company.types";
import {BaseToast} from "~/core/ui/base_toast";
//@ts-ignore
import type {Notification} from "#ui/types";
import {useUserStore} from "~/stores/user";
import CompanyDescriptionGenerationModal from "~/components/company/CompanyDescriptionGenerationModal.vue";

useHead({title: "Flutter Gigs - Company information update"});

definePageMeta({
  layout: 'app-layout',
  middleware: ['auth', 'no-company', function () {
    return useCompanyActions().checkCompanyExistenceGuard()
  }]
})

const userStore = useUserStore()
const authStore = useAuthStore()
const companyStore = useCompanyStore()

const {$analytics, $toast} = useNuxtApp()

const formInput = ref({
  email: userStore.myCompany?.email,
  user: authStore.authUser?.id,
  name: userStore.myCompany?.name,
  website: userStore.myCompany?.website,
  logo: userStore.myCompany?.logo,
  description: userStore.myCompany?.description,
  size: userStore.myCompany?.size ?? CompanySize.small,
  linkedin: userStore.myCompany?.linkedin,
  twitter: userStore.myCompany?.twitter,
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
    await companyStore.updateCompany({data: formInput.value} as UpdateCompanyRequest);
    (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.successfulCompanyUpdate, formInput.value);
    ($toast as BaseToast<Notification>).info(<string>companyStore.companyUpdate!.message);
  } catch (e) {
    ($toast as BaseToast<Notification>).error(<string>companyStore.companyUpdate!.message);
  } finally {
  }
}


</script>

<style scoped>

</style>