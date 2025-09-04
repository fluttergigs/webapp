<template>
  <div class="bg-blueGray-900/90 px-4 py-3 rounded-lg">
    <div class="custom-code__container text-gray-900">
      <div class="window">
        <span class="block h-3 w-3 rounded-full bg-red-500"></span>
        <span class="block h-3 w-3 rounded-full bg-yellow-500"></span>
        <span class="block h-3 w-3 rounded-full bg-green-500"></span>
      </div>
      <pre
        class="language-dart overflow-x-auto bg-blueGray-800/90 text-white font-mono text-sm px-3 py-4 rounded-md"
      ><code>{{ props.code?.trim() || "" }}
        </code>
      </pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Snippet } from '~/features/fluppets/fluppets.types';

  const props = defineProps<{ code: string }>();
</script>

<style></style>
