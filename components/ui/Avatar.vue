<script setup>

const props = defineProps({
  url: {
    type: String
  }
})

const source = computed(() => props.url ?? '../assets/images/avatar-circle.png')
</script>

<template>
  <img
      class="w-24 h-24 shadow-sm rounded-full"
      :src=source />
</template>

<style scoped>

</style>