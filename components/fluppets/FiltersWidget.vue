<script lang="ts" setup>
import { TagIcon } from "@heroicons/vue/24/solid";
import { watchDebounced } from "@vueuse/core";
import { useFluppets } from "~/composables/useFluppets";
import store from "~/plugins/store";

//TODO - FILTER BY TAGS
const { tags, filters } = useFluppets();
const fluppetsStore = useFluppetsStore();

const input = useTemplateRef("input");

defineShortcuts({
  "/": () => {
    //@ts-ignore
    input.value?.inputRef?.focus();
  },
});

const sortOptions = [
  { value: "views", label: "Most popular" },
  { value: "createdAt", label: "Most recent" },
];
</script>

<template>
  <aside
    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 w-full transition-all duration-300 h-fit sticky">
    <div class="flex flex-col gap-3">
      <UInput ref="input" v-model="filters.searchQuery" placeholder='Try "State management"' size="lg"
        variant="outline" />

      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          <h2 class="font-bold text-lg">Tags</h2>
          <TagIcon class="w-5 h-5 text-gray-500" />
        </div>
        <UInputMenu v-model="filters.tags" :items="tags" delete-icon="i-lucide-trash" label-key="name" multiple
          placeholder="Choose your tags" size="lg" value-key="slug">
          <template #item-label="{ item }">
            <span class="px-4 text-md font-bold">
              #{{ item.name }}
              <span class="text-gray-700">({{ item.snippets?.length ?? 0 }})</span>
            </span>
          </template>
        </UInputMenu>
      </div>

      <div class="flex flex-col gap-2">
        <h2 class="font-bold text-lg">Sort by</h2>

        <USelectMenu v-model="filters.sortKey" :items="sortOptions" :required="false" clear-search-on-close
          label-key="label" placeholder="Select a company size option" searchable size="lg" value-key="value" />
      </div>
    </div>
  </aside>
</template>

<style scoped></style>
