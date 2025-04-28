<script lang="ts" setup>
  const props = defineProps({
    confirmLabel: {
      type: String,
      default: 'Delete',
    },
    cancelLabel: {
      type: String,
      default: 'Cancel',
    },
    prompt: {
      type: String,
      default: 'Are you sure?',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  });

  const emits = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <p class="text-base font-medium text-gray-700">{{ prompt }}</p>
    <div class="flex gap-2">
      <UButton
        :label="cancelLabel"
        class="flex gap-2 font-medium"
        color="neutral"
        size="xl"
        variant="outline"
        @click="() => emits('cancel')"
      />

      <UButton
        :disabled="isLoading"
        :label="confirmLabel"
        :loading="isLoading"
        class="flex gap-2 font-medium"
        color="error"
        size="xl"
        @click="() => emits('confirm')"
      />
    </div>
  </div>
</template>

<style scoped></style>
