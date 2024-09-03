<script setup lang="ts">
import {storeToRefs} from "pinia";

const {getLearnCategories, getSelectedCategory} = storeToRefs(useLearnStore())

</script>

<template>
  <div class="flex flex-wrap gap-3 justify-center items-center">
    <UButton v-for="category in getLearnCategories"
             :key="category.slug"
             :label="category.title"
             :color="category.slug === getSelectedCategory?.slug ? 'primary' : 'gray'"
             class="primary-button px-4 max-w-[90px]"
             @click="useLearnStore().setSelectedCategory(category)"/>
  </div>
</template>

<style scoped>

</style>