<script setup lang="ts">

import LoadingSpinnerIcon from "~/components/icons/LoadingSpinnerIcon.vue";
import CustomInput from "~/components/forms/CustomInput.vue";
import {useAuthStore} from "~/stores/auth";
import {AnalyticsEvent} from "~/services/analytics/events";
import {updateUserFormSchema} from "~/core/validations/auth.validations";
import type {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";

const {$analytics, $toast} = useNuxtApp()
const authStore = useAuthStore()

const formInput = ref({
  email: authStore.authUser.email,
  username: authStore.authUser.username,
  firstName: authStore.authUser.firstName,
  lastName: authStore.authUser.lastName,
  bio: authStore.authUser.bio,
})

const canSubmit = ref(false)

watch(formInput, async (oldVal: any, newVal: any) => {
  canSubmit.value = await updateUserFormSchema.isValid(formInput.value);

}, {deep: true, immediate: true},)

const submit = async () => {
  try {
    (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.userUpdateButtonClicked, formInput.value);
    await authStore.updateUserInfo({data: formInput.value}, () => {
      authStore.fetchUser()
    });
    (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.successfulUserInfoUpdate, formInput.value);

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
      <CustomInput name="username" :is-disabled="true" label="Username"
                   v-model="formInput.username" type="text"/>
    </div>
    <div class="flex space-x-4 mb-5 w-full">
      <CustomInput class="w-1/2" name="firstName" label="First name"
                   v-model="formInput.firstName"/>
      <CustomInput class="w-1/2" name="lastName" label="Last name" v-model="formInput.lastName"/>
    </div>
    <div class="block mb-5">
      <CustomInput name="email" :is-disabled="true" label="Email" v-model="formInput.email"
                   type="email"/>
    </div>
    <div class="block mb-5">
      <CustomInput :is-text-area="true" name="bio" label="Bio" placeholder="Your bio tells about yourself"
                   v-model="formInput.bio"
                   type="text"/>
    </div>

    <button
        :disabled="!canSubmit || authStore.updateUser.isLoading"
        class="primary-button flex items-center justify-center space-x-2 m-auto max-w-xs"
        type="button"
        @click.prevent="submit"
    >
      <LoadingSpinnerIcon v-if="authStore.updateUser.isLoading" class="text-primary animate-spin"/>
      <span v-else> Save changes</span>
    </button>
  </form>


</template>

<style scoped>

</style>