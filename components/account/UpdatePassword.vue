<script lang="ts" setup>
  //@ts-ignore
  import type { Notification } from '#ui/types';
  import CustomInput from '~/components/forms/CustomInput.vue';
  import LoadingSpinnerIcon from '~/components/icons/LoadingSpinnerIcon.vue';
  import { changePasswordFormSchema } from '~/core/validations/auth.validations';
  import { useAuthStore } from '~/stores/auth';

  const authStore = useAuthStore();

  const formInput = ref({
    password: '',
    confirmPassword: '',
  });

  const canSubmit = ref(false);

  watch(
    formInput,
    async () => {
      canSubmit.value = await changePasswordFormSchema.isValid(formInput.value);
    },
    { deep: true },
  );

  const submit = async () => {
    useUser().updatePassword({ data: formInput.value });
  };
</script>

<template>
  <form class="flex flex-col space-y-4 my-12 mr-8">
    <div class="block mb-5">
      <CustomInput v-model="formInput.password" label="Password" name="password" type="password" />
    </div>
    <div class="block mb-5">
      <CustomInput
        v-model="formInput.confirmPassword"
        label="Confirm password"
        name="confirmPassword"
        type="password"
      />
    </div>

    <button
      :disabled="!canSubmit || authStore.changePassword.isLoading"
      class="primary-button flex items-center justify-center space-x-2 m-auto max-w-xs"
      type="button"
      @click.prevent="submit"
    >
      <LoadingSpinnerIcon
        v-if="authStore.changePassword.isLoading"
        class="text-primary animate-spin"
      />
      <span v-else> Save changes</span>
    </button>
  </form>
</template>

<style scoped></style>
