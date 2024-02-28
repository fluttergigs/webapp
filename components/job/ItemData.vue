<script setup>

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
  }
})

</script>

<template>

  <div class="space-y-1 flex flex-col">
    <h4 class="text-sm text-gray-600">{{ props.label }}</h4>

    <slot name="content">
      <p class="text-md font-medium">{{ props.value }}
      </p>
    </slot>
  </div>
</template>

<style scoped>

</style>