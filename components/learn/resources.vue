<script lang="ts" setup>
  import ResourceCard from '~/components/learn/ResourceCard.vue';

  const { getSelectedCategoryResources, isFetchingLearnResources } = useLearn();
</script>

<template>
  <div class="flex flex-wrap gap-3 md:gap-4 justify-start md:justify-center my-2">
    <div v-if="getSelectedCategoryResources?.length === 0">
      <div class="flex flex-col items-center space-y-2">
        <p>No resources found in the category</p>
        <img
          alt="Empty job results"
          class="w-96 h-96"
          src="@/assets/images/emptyJobFiltersResult.svg"
        />
      </div>
    </div>

    <template v-else-if="isFetchingLearnResources">
      <div v-for="_ in 4" class="flex flex-col items-center space-y-2">
        <USkeleton class="w-56 h-52 rounded-md bg-gray-200" />
      </div>
    </template>

    <template v-else>
      <div
        v-for="resource in getSelectedCategoryResources"
        :key="resource.id"
        class="w-1/3 md:w-1/6 justify-start"
      >
        <ResourceCard :resource="resource" />
      </div>
    </template>
  </div>
</template>

<style scoped></style>
