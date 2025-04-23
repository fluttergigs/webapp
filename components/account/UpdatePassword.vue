<script lang="ts" setup>
  //@ts-ignore
  import type { Notification } from '#ui/types';
  import CustomInput from '~/components/forms/CustomInput.vue';
  import { useAuthStore } from '~/stores/auth';

  const authStore = useAuthStore();

  const formInput = ref({
    password: '',
    confirmPassword: '',
  });

  const canSubmit = ref(false);

  /*watch(
    formInput,
    async () => {
      canSubmit.value = await changePasswordFormSchema.isValid(formInput.value);
    },
    { deep: true },
  );*/

  const submit = async () => {
    useUser().updatePassword({ data: formInput.value });
  };
</script>

<template>
  <form class="flex flex-col gap-4 my-12 mr-8">
    <CustomInput v-model="formInput.password" label="Password" name="password" type="password" />
    <CustomInput
      v-model="formInput.confirmPassword"
      autocomplete="new-password"
      label="Confirm password"
      name="confirmPassword"
      type="password"
    />

    <UButton
      :disabled="!canSubmit || authStore.$changePassword.isLoading"
      :loading="authStore.$changePassword.isLoading"
      class="primary-button flex items-center justify-center gap-2 m-auto max-w-xs"
      label="Save changes"
      size="xl"
      @click.prevent="submit"
    />
  </form>
</template>

<style scoped></style>
