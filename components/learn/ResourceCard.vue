<script setup lang="ts">
import type {LearnResource} from "~/features/learn/learn.types";

defineProps<{
  resource: LearnResource
}>()

const {handleLearnResourceClick} = useLearn()
</script>

<template>
  <div
      class="flex flex-col rounded-md shadow-md
       my-2 transition-all
      duration-300 hover:scale-[1.03] hover:shadow-lg cursor-pointer">
    <NuxtImg
        class="object-cover rounded-tl-md rounded-tr-md"
        src="/fluttergigs-og.png"
        :alt="resource.title"/>

    <div class="flex flex-col gap-2 p-3">
      <p class="text-xs md:text-lg font-semibold text-gray-900 line-clamp-1">
        {{ resource.title }}
      </p>

      <span @click="handleLearnResourceClick(resource)"
            class="text-indigo-500 text-xs md:text-base">View</span>
    </div>
  </div>
</template>

<style scoped>

</style>