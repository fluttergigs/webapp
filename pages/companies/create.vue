<script lang="ts" setup>
import BasicFormContent from "~/components/ui/BasicFormContent.vue";
import {AppRoutes} from "~/core/routes";
import {Form} from "vee-validate";
import CustomInput from "~/components/forms/CustomInput.vue";
import LoadingSpinnerIcon from "~/components/icons/LoadingSpinnerIcon.vue";
import {useAuthStore} from "~/stores/auth";
import {useCompanyStore} from "~/stores/company";
import {companyCreationFormSchema} from "~/core/validations/company.validations";
import {AnalyticsEvent} from "~/services/analytics/events";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {useUserStore} from "~/stores/user";
import type {CreateCompanyRequest} from "~/features/companies/company.types";


useSeoMeta({
  title: 'Flutter Gigs - Create your company',
  ogTitle: 'Flutter Gigs - Create your company',
  ogUrl: 'https://fluttergigs.com',
  ogImage: 'https://fluttergigs.com/fluttergigs-og.png',
  description: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  ogDescription: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  ogSiteName: 'Flutter Gigs',
  twitterCard: 'summary_large_image',
  twitterSite: '@fluttergigs',
  twitterTitle: () => `Flutter Gigs - Find the best Flutter opportunities at top remote companies around the world`,
  twitterDescription: () => 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  twitterImage: 'https://fluttergigs.com/fluttergigs-og.png',
})

definePageMeta({
  title: 'Create your company',
  middleware: ['auth', function () {
    if (useUserStore().hasCompanies) {
      return navigateTo(AppRoutes.myCompany)
    }
  }]
})

const {$analytics} = useNuxtApp()

const {onCompanyCreationSuccess, createCompany} = useCompanyActions()

const companyStore = useCompanyStore()

const formInput: Ref<CreateCompanyRequest> = ref({
  email: '',
  user: useAuthStore().authUser?.id,
  name: '',
  website: '',
  logo: '',
  description: '',
})

const canSubmit = ref(false)

watch(formInput, async () => {
  canSubmit.value = await companyCreationFormSchema.isValid(formInput.value);
}, {deep: true, immediate: true},)

onMounted(() => {
  (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.companyCreationPageEntered);
})

const submit = async () => {
  await createCompany(formInput.value, async () => {
    onCompanyCreationSuccess()
  })
}
</script>

<template>

  <main>
    <BasicFormContent :show-close-button="true"
                      description="Create your company to start posting job offers to attract talented Flutter engineers"
                      title="Create your company">

      <template #form>
        <form class="space-y-4">
          <div class="flex space-x-4 mb-5 w-full">
            <CustomInput v-model="formInput.name" class="w-1/2" name="name" placeholder="Company name"/>
            <CustomInput v-model="formInput.website" :show-label="false"
                         class="w-1/2" label="Website" name="url"
                         placeholder="Your website"/>
          </div>
          <div class="block mb-5">
            <CustomInput v-model="formInput.email" name="email" placeholder="Company email" type="email"
            />
          </div>

          <div class="block mb-5">
            <CustomInput v-model="formInput.logo"
                         :show-label="false"
                         inside-text="Paste your company logo's link" label="Logo"
                         name="url" placeholder="Company's logo"
                         type="text"/>
          </div>
          <div class="block mb-5">
            <CustomInput v-model="formInput.description" :is-text-area="true" inside-text="Describe your company"
                         name="description"
                         placeholder="Company's description"
                         type="text"/>
          </div>
          <button
              :disabled="!canSubmit ||companyStore.companyCreation.isLoading"
              class="primary-button flex items-center justify-center space-x-2"
              type="button"
              @click.prevent="submit">
            <LoadingSpinnerIcon v-if="companyStore.companyCreation.isLoading" class="text-primary animate-spin"/>
            <span v-else> Create my company</span>

          </button>
        </Form>

      </template>
    </BasicFormContent>

  </main>

</template>

<style scoped>

</style>