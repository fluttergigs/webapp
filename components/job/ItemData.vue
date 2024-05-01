<script setup>

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
  },
  showLabel: {
    type: Boolean,
    default: true,
  }
})

</script>

<template>

  <div class="space-y-1 flex flex-col items-start">
    <h4 v-if="showLabel" class="text-sm text-gray-600">{{ props.label }}</h4>

    <slot name="content">
      <p class="text-md font-medium">{{ props.value }}
      </p>
    </slot>
  </div>
</template>

<style scoped>

</style>