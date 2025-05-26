<template>
  <div
    class="text-gray-700 flex flex-col gap-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 w-full mx-auto transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:-translate-y-2"
  >
    <div class="flex items-center gap-3 mb-2">
      <span :class="badgeColor" class="px-3 py-1 rounded-lg text-xs font-semibold capitalize">
        {{ snippet.language }}
      </span>

      <div class="flex justify-center gap-1">
        <CalendarIcon class="w-4 h-4 text-gray-400" />
        <span
          v-date-format="{ date: snippet.updatedAt, format: 'YYYY-MMM D' }"
          class="text-xs"
        ></span>
      </div>
    </div>
    <USeparator />
    <h2 class="text-xl text-gray-900 font-bold mb-1">{{ snippet.title }}</h2>
    <p class="text-gray-600 text-md mb-4 text-ellipsis">
      {{
        snippet.description.length > 100
          ? snippet.description.slice(0, 100) + '...'
          : snippet.description
      }}
    </p>
    <div class="flex justify-between">
      <div class="flex justify-center items-center space-x-2 text-xs">
        <UserIcon class="w-5 h-5" />
        <span>{{ snippet.user?.username || 'Admin' }}</span>
      </div>

      <div class="flex gap-3">
        <UButton
          icon="i-heroicons-share"
          size="sm"
          variant="subtle"
          @click="useFluppets().handleFluppetsShare(snippet)"
        />

        <!--      <button class="hover:text-gray-700"><i class="i-lucide-bookmark"></i></button>-->
        <UButton
          icon="i-heroicons-clipboard-document-check"
          size="sm"
          variant="subtle"
          @click="useFluppets().handleFluppetsCopy(snippet)"
        />
      </div>
    </div>

    <pre class="bg-gray-100 rounded-xl p-4 text-xs overflow-x-auto mb-4 h-[200px] overflow-scroll">
      <code>{{ snippet.code }}</code>
    </pre>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="tag in snippet.tags"
        :key="tag"
        class="bg-gray-200 text-gray-600 rounded-full px-3 py-1 text-xs font-medium"
      >
        #{{ tag.slug }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  //import share, copy icons from heroicons
  import { CalendarIcon, UserIcon } from '@heroicons/vue/16/solid';
  import type { Snippet } from '~/features/fluppets/fluppets.types';

  const props = defineProps({
    snippet: {
      type: Object as PropType<Snippet>,
      required: true,
    },
  });
  // Dynamic badge color by language
  const badgeColor = computed(() => {
    switch (props.snippet.language.toLowerCase()) {
      case 'javascript':
        return 'bg-yellow-100 text-yellow-800';
      case 'dart':
        return 'bg-blue-100 text-blue-800';
      case 'python':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  });
</script>
