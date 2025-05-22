<script lang="ts" setup>
  //@ts-ignore
  import type { Notification } from '#ui/types';
  import CustomInput from '~/components/forms/CustomInput.vue';
  import { updateUserFormSchema } from '~/core/validations/auth.validations';
  import { useAuthStore } from '~/stores/auth';

  const authStore = useAuthStore();

  const formInput = ref({
    email: authStore.authUser.email,
    username: authStore.authUser.username,
    firstName: authStore.authUser.firstName,
    lastName: authStore.authUser.lastName,
    bio: authStore.authUser.bio,
  });

  const canSubmit = ref(false);

  watch(
    formInput,
    async (oldVal: any, newVal: any) => {
      canSubmit.value = await updateUserFormSchema.isValid(formInput.value);
    },
    { deep: true },
  );

  const submit = async () => {
    useUser().updateUser({ data: formInput.value });
  };
</script>

<template>
  <form class="flex flex-col gap-4 my-12 mr-8">
    <CustomInput
      v-model="formInput.username"
      :is-disabled="true"
      label="Username"
      name="username"
      type="text"
    />
    <div class="flex gap-4 w-full">
      <CustomInput
        v-model="formInput.firstName"
        class="w-full"
        label="First name"
        name="firstName"
      />
      <CustomInput v-model="formInput.lastName" class="w-full" label="Last name" name="lastName" />
    </div>
    <CustomInput
      v-model="formInput.email"
      :is-disabled="true"
      label="Email"
      name="email"
      type="email"
    />
    <CustomInput
      v-model="formInput.bio"
      :is-text-area="true"
      label="Bio"
      name="bio"
      placeholder="Your bio tells about yourself"
      type="text"
    />

    <UButton
      :disabled="!canSubmit || authStore.$updateUser.isLoading"
      :loading="authStore.$updateUser.isLoading"
      class="primary-button flex items-center justify-center gap-2 m-auto max-w-xs"
      label="Save changes"
      size="xl"
      @click.prevent="submit"
    />
  </form>
</template>

<style scoped></style>
