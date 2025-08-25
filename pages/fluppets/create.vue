<template>
  <main>
    <section class="w-full overflow-hidden bg-white px-2 py-8 md:py-12 xl:pb-56">
      <div class="my-4 flex flex-col gap-x-16 font-normal md:flex-row">
        <div class="flex w-full flex-col gap-y-8 xl:mx-auto max-w-4xl">
          <div class="flex items-center gap-4 mb-4">
            <UButton 
              @click="navigateTo('/fluppets/explore')"
              variant="outline"
              icon="i-heroicons-arrow-left"
              size="sm"
            >
              Back
            </UButton>
            <h3 class="tracking-px-n text-2xl font-semibold leading-tight md:text-4xl">
              Create New Snippet
            </h3>
          </div>

          <form @submit.prevent="handleSubmit" class="my-12 flex w-full flex-col gap-8">
            <!-- Title Input -->
            <CustomInput
              v-model="snippetData.title"
              label="Snippet Title *"
              name="title"
              placeholder="e.g., Custom Flutter Button Widget"
              :error-message="errors.title"
            />

            <!-- Description Input -->
            <CustomInput
              v-model="snippetData.description"
              label="Description *"
              name="description"
              placeholder="Describe what your snippet does and how to use it"
              :is-text-area="true"
              :error-message="errors.description"
            />

            <!-- Language Selection -->
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium">Programming Language *</label>
              <select
                v-model="snippetData.language"
                class="border border-gray-300 py-2 px-3 rounded-md text-gray-800 w-full"
              >
                <option value="">Select a language</option>
                <option v-for="option in languageOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <p v-if="errors.language" class="text-red-600 text-start text-sm capitalize">
                {{ errors.language }}
              </p>
            </div>

            <!-- Code Input -->
            <CustomInput
              v-model="snippetData.code"
              label="Code *"
              name="code"
              placeholder="Paste your code here..."
              :is-text-area="true"
              :error-message="errors.code"
              class="font-mono text-sm"
            />

            <div class="flex gap-4 pt-6">
              <UButton
                type="submit"
                :loading="isCreating"
                :disabled="isCreating"
                size="lg"
              >
                {{ isCreating ? 'Creating Snippet...' : 'Create Snippet' }}
              </UButton>
              
              <UButton
                type="button"
                @click="navigateTo('/fluppets/explore')"
                :disabled="isCreating"
                variant="outline"
                size="lg"
              >
                Cancel
              </UButton>
            </div>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import CustomInput from '~/components/forms/CustomInput.vue';
import { createSnippetFormSchema } from '~/core/validations/snippet.validations';
import { BaseToast } from '~/core/ui/base_toast';
//@ts-ignore
import type { Notification } from '#ui/types';

definePageMeta({
  layout: "main-layout",
  keepalive: true,
});

const { $toast } = useNuxtApp();
const { 
  handleFluppetCreate, 
  isFluppetCreateLoading, 
  isFluppetCreateError, 
  isFluppetCreateSuccess
} = useFluppets();

// Language options for the select menu
const languageOptions = [
  { label: 'Dart', value: 'dart' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Flutter', value: 'flutter' },
  { label: 'Java', value: 'java' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Swift', value: 'swift' },
  { label: 'Other', value: 'other' },
];

// Form data
const snippetData = ref({
  title: '',
  description: '',
  language: '',
  code: '',
});

const errors = ref<Record<string, string>>({});
const isCreating = computed(() => isFluppetCreateLoading.value);

// Form validation using Yup schema
const validateForm = async () => {
  errors.value = {};
  
  try {
    await createSnippetFormSchema.validate(snippetData.value, { abortEarly: false });
    return true;
  } catch (validationError: any) {
    if (validationError.inner) {
      validationError.inner.forEach((error: any) => {
        if (error.path) {
          errors.value[error.path] = error.message;
        }
      });
    }
    return false;
  }
};

// Form submission
const handleSubmit = async () => {
  const isValid = await validateForm();
  if (!isValid) return;

  const success = await handleFluppetCreate({
    data: snippetData.value
  });
  
  if (success) {
    ($toast as BaseToast<Notification>).success('Snippet created successfully!');
    navigateTo('/fluppets/explore');
  }
  // Error handling is done in the composable
};
</script>

<style scoped>
/* No custom styles needed as we're using Nuxt UI components */
</style>
