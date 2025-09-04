<template>
  <UModal v-model:open="visible" title="Unlock unlimited snippet access" size="lg">
    <template #body>
      <div class="p-8 text-center flex flex-col items-center gap-6 max-w-md mx-auto">
        <div class="rounded-full bg-indigo-100 p-4">
          <UIcon name="i-lucide-lock-keyhole" class="w-10 h-10 text-indigo-600" />
        </div>

        <h2 class="text-2xl font-bold leading-tight">Unlock unlimited snippet access 🚀</h2>

        <p class="text-muted text-sm max-w-sm">
          You've reached the copy limit for anonymous users. Create a free account to keep
          exploring, copying, and much more!
        </p>

        <ul class="text-left text-md font-medium space-y-2 w-full text-muted-foreground">
          <li class="flex items-center gap-2">
            <UIcon name="i-lucide-check" class="text-green-500 w-4 h-4" />
            Unlimited snippet copies
          </li>
          <li class="flex items-center gap-2">
            <UIcon name="i-lucide-star" class="text-yellow-500 w-4 h-4" />
            Save and bookmark your favorites
          </li>
          <li class="flex items-center gap-2">
            <UIcon name="i-lucide-flame" class="text-pink-500 w-4 h-4" />
            Discover trending and top-rated snippets
          </li>
        </ul>

        <div class="w-full flex flex-col gap-3 mt-6">
          <UButton
            label="Continue"
            icon="i-lucide-google"
            color="primary"
            variant="solid"
            size="lg"
            class="w-full"
            @click="redirectToRegister"
          />
        </div>

        <div class="text-sm pt-2 text-muted">
          <span>Already have an account?</span>
          <UButton
            label="Log in"
            variant="link"
            color="primary"
            class="ml-1"
            @click="redirectToLogin"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
  import { AppRoutes } from '~/core/routes';
  import { AnalyticsEvent } from '~/services/analytics/events';

  const props = defineProps<{ visible: boolean }>();
  const emit = defineEmits(['update:visible']);

  const visible = computed({
    get: () => props.visible,
    set: (val) => {
      if (val) {
        useAnalytics().capture(AnalyticsEvent.copyGateModalOpened);
      } else {
        useAnalytics().capture(AnalyticsEvent.copyGateModalClosed);
      }

      return emit('update:visible', val);
    },
  });

  function redirectToLogin() {
    visible.value = false;

    useAnalytics().capture(AnalyticsEvent.copyGateLoginButtonClicked);

    useAuthStore().setReturnUrl(AppRoutes.exploreFluppets);
    navigateTo(AppRoutes.login);
  }

  function redirectToRegister() {
    visible.value = false;

    useAnalytics().capture(AnalyticsEvent.copyGateRegisterButtonClicked);

    useAuthStore().setReturnUrl(AppRoutes.exploreFluppets);
    navigateTo(AppRoutes.register);
  }
</script>
