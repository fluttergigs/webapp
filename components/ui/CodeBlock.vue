<template>
  <div class="rounded-2xl overflow-hidden shadow-lg bg-[#181C2A] relative group">
    <div
      class="flex items-center justify-between px-4 py-2 bg-[#22273C] border-b border-[#282C40]"
    >
      <span class="text-xs font-semibold text-blue-400 uppercase">{{
        languageLabel
      }}</span>

      <div class="flex gap-3">
        <UTooltip :delay-duration="200" text="Share this code snippet">
          <UButton
            label="Share"
            color="neutral"
            icon="i-heroicons-share"
            size="sm"
            variant="outline"
            @click.stop="handleShare"
          />
        </UTooltip>

        <!--      <button class="hover:text-gray-700"><i class="i-lucide-bookmark"></i></button>-->

        <UTooltip :delay-duration="200" text="Copy to clipboard">
          <UButton
            label="Copy"
            color="neutral"
            icon="i-heroicons-clipboard-document-check"
            size="sm"
            variant="soft"
            @click.stop="handleCopy"
          />
        </UTooltip>
      </div>
    </div>
    <Prism
      language="dart"
      class="text-sm py-4 px-0 overflow-scroll no-copy"
      :style="{ height: getHeight }"
    >
      {{ code?.trim() || "" }}
    </Prism>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import * as Prism from "vue-prism-component";

import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-dart";

const props = defineProps({
  code: { type: String, required: true },
  language: { type: String, default: "dart" },
  height: { type: String, default: "250px" },
});

const getHeight = computed(() => props.height);

const languageLabel = computed(() => props.language.toUpperCase());

const emit = defineEmits(["copy", "share"]);

const handleCopy = () => {
  emit("copy");
};

const handleShare = () => {
  emit("share");
};
</script>

<style scoped>
.no-copy {
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
}

.no-copy * {
  user-select: none !important;
  -webkit-user-select: none !important;
  -ms-user-select: none !important;
  pointer-events: none !important;
}
</style>
