<script setup lang="ts">


//@ts-ignore
const props = defineProps({
  label: {
    type: String,
  }
})
</script>

<template>
  <client-only>
    <div class="flex flex-col space-y-2">
      <slot name="label">
        <p class="text-sm font-medium">{{ label }}
        </p>
      </slot>

      <slot>

      </slot>
    </div>
  </client-only>
</template>

<style scoped>

</style>