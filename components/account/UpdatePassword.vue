<script setup lang="ts">

import LoadingSpinnerIcon from "~/components/icons/LoadingSpinnerIcon.vue";
import CustomInput from "~/components/forms/CustomInput.vue";
import {useAuthStore} from "~/stores/auth";
import {changePasswordFormSchema} from "~/core/validations/auth.validations";
import {AnalyticsEvent} from "~/services/analytics/events";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";

const {$analytics, $toast} = useNuxtApp()
const authStore = useAuthStore()

const formInput = ref({
  password: '',
  confirmPassword: '',
})

const canSubmit = ref(false)

watch(formInput, async () => {
  canSubmit.value = await changePasswordFormSchema.isValid(formInput.value);

}, {deep: true},)

const submit = async () => {
  try {
    (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.changePasswordButtonClicked, formInput.value);
    await authStore.changeUserPassword({data: formInput.value.password}, () => {
      authStore.fetchUser()
    });
    (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.successfulPasswordChange, formInput.value);

    //@ts-ignore
    $toast.success(<string>authStore.updateUser!.message);
  } catch (e) {
    //@ts-ignore
    $toast.error(<string>authStore.updateUser!.message);
  }
}
</script>

<template>
  <form class="flex flex-col space-y-4 my-12 mr-8">

    <div class="block mb-5">
      <CustomInput name="password" label="Password" v-model="formInput.password"
                   type="password"/>
    </div>
    <div class="block mb-5">
      <CustomInput name="confirmPassword" label="Confirm password"
                   v-model="formInput.confirmPassword" type="password"/>
    </div>

    <button
        :disabled="!canSubmit || authStore.changePassword.isLoading"
        class="primary-button flex items-center justify-center space-x-2 m-auto max-w-xs"
        type="button"
        @click.prevent="submit"
    >
      <LoadingSpinnerIcon v-if="authStore.changePassword.isLoading" class="text-primary animate-spin"/>
      <span v-else> Save changes</span>
    </button>
  </form>

</template>

<style scoped>

</style>