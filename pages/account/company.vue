<!--TODO - upload logo for company-->

<template>

  <main class="w-full">
    <CompanyDescriptionGenerationModal @on-generate="({result})=> formInput.description = result" />
    <div class="flex flex-col w-full">
      <section class="py-8 px-2 md:py-12 xl:pb-56 bg-white overflow-hidden">
        <h3
          class="mb-4 text-xl md:text-3xl font-semibold tracking-px-n leading-tight">
          Your company <span class="text-indigo-500">{{ formInput.name }}</span>
        </h3>
        <p class="text-md md:text-xl">Set your company information</p>


        <form class="flex flex-col gap-6 my-12 mr-8">
          <div class="flex gap-4  w-full">
            <CustomInput v-model="formInput.name" class="w-full" label="Company name" name="name"
                         placeholder="Name" />
            <CustomInput v-model="formInput.email" :is-disabled="true" class="w-full" label="Email" name="email"
                         type="email" />
          </div>
          <CustomInput v-model="formInput.website" label="Website" name="url" placeholder="Website" />
          <div class="flex gap-4 w-full">
            <CustomInput v-model="formInput.linkedin" class="w-full" label="Linkedin"
                         name="url" />
            <CustomInput v-model="formInput.twitter" class="w-full" label="Twitter"
                         name="url" />
          </div>
          <div class="flex gap-4 w-full">
            <LabelledInput label="Size">
              <USelectMenu
                v-model="formInput.size"
                :items="companySizeOptions"
                clear-search-on-close
                label-key="label"
                placeholder="Select your company size"
                searchable
                size="xl"
                value-key="id" />
            </LabelledInput>

            <CustomInput v-model="formInput.logo" label="Company Logo url" name="url" placeholder="Logo"
                         type="text" />

          </div>
          <!--          TODO generate company description using AI-->
          <CustomInput
            v-model="formInput.description"
            :is-text-area="true" inside-text="Generate using AI" label="Description" name="description"
            placeholder="Description"
            type="text"
            @inside-text-clicked="companyStore.showCompanyDescriptionGenerationModal()" />

          <button
            :disabled="!canSubmit || companyStore.companyUpdate.isLoading"
            :loading="companyStore.companyUpdate.isLoading"
            class="primary-button flex items-center justify-center gap-2 m-auto max-w-xs"
            label="Save changes"
            size="3xl"
            @click.prevent="submit"
          />
        </form>
      </section>
    </div>
  </main>
</template>

<script lang="ts" setup>

  import CustomInput from '~/components/forms/CustomInput.vue';
  import { useAuthStore } from '~/stores/auth';
  import { companyUpdateFormSchema } from '~/core/validations/company.validations';
  import { AnalyticsEvent } from '~/services/analytics/events';
  import { useCompanyStore } from '~/stores/company';
  import { AppAnalyticsProvider } from '~/services/analytics/AppAnalyticsProvider';
  import { companySizeOptions } from '~/core/constants';
  import type { UpdateCompanyRequest } from '~/features/companies/company.types';
  import { CompanySize } from '~/features/companies/company.types';
  import { BaseToast } from '~/core/ui/base_toast';
  //@ts-ignore
  import type { Notification } from '#ui/types';
  import { useUserStore } from '~/stores/user';
  import CompanyDescriptionGenerationModal from '~/components/company/CompanyDescriptionGenerationModal.vue';
  import LabelledInput from '~/components/forms/LabelledInput.vue';

  useHead({ title: 'FlutterGigs - Company information update' });

  definePageMeta({
    layout: 'app-layout',
    middleware: ['auth', 'no-company', function() {
      return useCompanyActions().checkCompanyExistenceGuard();
    }],
  });

  const userStore = useUserStore();
  const authStore = useAuthStore();
  const companyStore = useCompanyStore();

  const { $analytics, $toast } = useNuxtApp();

  const formInput = ref({
    email: userStore.myCompany?.email ?? userStore.authUser?.email,
    // user: authStore.authUser?.id,
    name: userStore.myCompany?.name,
    website: userStore.myCompany?.website,
    logo: userStore.myCompany?.logo,
    description: userStore.myCompany?.description,
    size: userStore.myCompany?.size ?? CompanySize.small,
    linkedin: userStore.myCompany?.linkedin,
    twitter: userStore.myCompany?.twitter,
  });

  const canSubmit = ref(false);

  watch(formInput, async () => {
    canSubmit.value = await companyUpdateFormSchema.isValid(formInput.value);

  }, { deep: true, immediate: true });

  onMounted(async () => {
    (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.companyUpdatePageEntered);

    await useUser().getUser();
  });

  const submit = async () => {
    try {
      (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.companyUpdateButtonClicked, formInput.value);
      await companyStore.updateCompany({ data: formInput.value } as UpdateCompanyRequest);
      (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.successfulCompanyUpdate, formInput.value);
      ($toast as BaseToast<Notification>).info(<string>companyStore.companyUpdate!.message);
    } catch (e) {
      ($toast as BaseToast<Notification>).error(<string>companyStore.companyUpdate!.message);
    } finally {
    }
  };


</script>

<style scoped>

</style>