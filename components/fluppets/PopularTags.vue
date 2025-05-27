<script lang="ts" setup>
//@ts-ignore
import Tag from "~/components/fluppets/Tag.vue";
import type { Tags } from "~/features/fluppets/fluppets.types";

const props = defineProps({
  tags: {
    type: Object as PropType<Tags>,
    default: [],
  },
});
</script>

<template>
  <section class="dark:bg-gray-900">
    <div class="container">
      <h1 class="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl dark:text-white">
        Popular Tags
      </h1>

      <div class="flex flex-wrap gap-4 mt-8 mb-10">
        <Tag :tag="tag" v-for="tag in tags" :key="tag.documentId"
          @tag-click="(tag) => useFluppets().handleTagClick(tag)" />
      </div>
    </div>
  </section>
</template>

<style scoped></style>
