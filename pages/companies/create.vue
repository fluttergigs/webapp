<script setup lang="ts">
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
import {BaseToast} from "~/core/ui/base_toast";
//@ts-ignore
import type {Notification} from "#ui/types";
import type {CreateCompanyRequest} from "~/features/companies/company.types";
import {useUserStore} from "~/stores/user";

useHead({title: "Flutter Gigs - Company creation"});

definePageMeta({
  middleware: ['auth', function () {
    if (useUserStore().hasCompanies) {
      return navigateTo(AppRoutes.myCompany)
    }
  }]
})

const {$toast, $analytics} = useNuxtApp()

const companyStore = useCompanyStore()

const formInput = ref({
  email: useAuthStore().authUser?.email,
  user: useAuthStore().authUser?.id,
  name: '',
  website: '',
  logo: '',
  description: '',
})


const canSubmit = ref(false)

watch(formInput, async () => {
  canSubmit.value = await companyCreationFormSchema.isValid(formInput.value);

  //TODO - remove comment later
  /*if(canSubmit.value){
    await submit()
  }*/

}, {deep: true, immediate: true},)

onMounted(() => {
  (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.companyCreationPageEntered);

})
const submit = async () => {
  try {
    (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.companyCreationButtonClicked, formInput.value);
    await companyStore.createCompany({data: formInput.value} as CreateCompanyRequest);
    (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.successfulCompanyCreation, formInput.value);

    //@ts-ignore
    ($toast as BaseToast<Notification>).success(<string>companyStore.companyCreation.message);

    //TODO replace with post jobs or redirect to dashboard
    await useRouter().push({path: AppRoutes.welcome})
  } catch (e) {
    //@ts-ignore
    ($toast as BaseToast<Notification>).error(<string>companyStore.companyCreation.message);
  }
}
</script>

<template>
  <BasicFormContent title="Create your company"
                    description="Create your company to start posting job offers to attract talented Flutter engineers">

    <template #form>
      <form class="space-y-4">
        <div class="flex space-x-4 mb-5 w-full">
          <CustomInput class="w-1/2" name="name" placeholder="Company name" v-model="formInput.name"/>
          <CustomInput class="w-1/2" name="url"
                       label="Website" :show-label="false" placeholder="Your website"
                       v-model="formInput.website"/>
        </div>
        <div class="block mb-5">
          <CustomInput name="email" placeholder="Company email" v-model="formInput.email" type="email"
          />
        </div>

        <div class="block mb-5">
          <CustomInput name="url"
                       label="Logo"
                       :show-label="false" placeholder="Company's logo"
                       v-model="formInput.logo" type="text"
                       inside-text="Paste your company logo's link"/>
        </div>
        <div class="block mb-5">
          <CustomInput :is-text-area="true" name="description" placeholder="Company's description"
                       v-model="formInput.description"
                       type="text"
                       inside-text="Describe your company"/>
        </div>
        <button
            :disabled="!canSubmit ||companyStore.companyCreation.isLoading"
            class="primary-button flex items-center justify-center space-x-2"
            type="button"
            @click.prevent="submit"
        >
          <LoadingSpinnerIcon v-if="companyStore.companyCreation.isLoading" class="text-primary animate-spin"/>
          <span v-else> Create my company</span>

        </button>
      </Form>

    </template>
  </BasicFormContent>

</template>

<style scoped>

</style>