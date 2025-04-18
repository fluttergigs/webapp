<script lang="ts" setup>
  //@ts-ignore
  const props = defineProps({
    label: {
      type: String,
    },
    insideText: {
      type: String,
      default: '',
    },
  });

  const emits = defineEmits(['insideTextClicked']);
</script>

<template>
  <client-only>
    <div class="relative">
      <div class="flex flex-col space-y-2">
        <slot name="label">
          <p class="text-sm font-medium">{{ label }}</p>
        </slot>

        <slot></slot>

        <slot name="insideText">
          <div class="absolute bottom-0.5 right-4 -translate-y-1/2 transform">
            <a
              class="cursor-pointer text-[12px] font-medium text-indigo-600 hover:text-indigo-700"
              @click="$emit('insideTextClicked')"
            >{{ insideText }}</a
            >
          </div>
        </slot>
      </div>
    </div>
  </client-only>
</template>

<style scoped></style>
