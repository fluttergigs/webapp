<script lang="ts" setup>
  import type { LearnResource } from '~/features/learn/learn.types';

  defineProps<{
    resource: LearnResource
  }>();

  const { handleLearnResourceClick } = useLearn();
</script>

<template>
  <div
    class="flex flex-col rounded-md shadow-md
       my-2 transition-all
      duration-300 hover:scale-[1.03] hover:shadow-lg cursor-pointer">
    <NuxtImg
      :alt="resource.title"
      :placeholder="[200,130]"
      class="object-cover rounded-tl-md rounded-tr-md"
      src="/fluttergigs-og.png" />

    <div class="flex flex-col gap-2 p-3">
      <p class="text-xs md:text-lg font-semibold text-gray-900 line-clamp-1">
        {{ resource.title }}
      </p>

      <span class="text-indigo-500 text-xs md:text-base"
            @click="handleLearnResourceClick(resource)">View</span>
    </div>
  </div>
</template>

<style scoped>

</style>