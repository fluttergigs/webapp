<script setup lang="ts">
import {useLearn} from "~/composables/useLearn";

const {
  getLearnCategories,
  getSelectedCategory,
  isFetchingLearnCategories,
  handleLearnCategoryClick,
} = useLearn()

</script>

<template>
  <client-only>
    <div class="flex flex-wrap gap-3 justify-center items-center">

      <USkeleton v-for="item in 4" :key="item" class="w-[90px] h-6 rounded-sm bg-gray-200"
                 v-if="isFetchingLearnCategories"/>

      <UButton v-for="category in getLearnCategories" v-else
               :key="category.slug"
               :label="category.title"
               :color="category.slug === getSelectedCategory?.slug ? 'primary' : 'gray'"
               class="primary-button px-4 max-w-[90px]"
               @click="handleLearnCategoryClick(category)"/>
    </div>
  </client-only>

</template>

<style scoped>

</style>