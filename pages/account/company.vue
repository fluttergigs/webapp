<template>
  <div class="flex flex-col">
        <Footer/>
  </div>
</template>

<script setup>
import Footer from "~/components/layout/Footer.vue";

definePageMeta({layout: 'app-layout', middleware: ['auth']})
</script>

<style scoped>

</style>