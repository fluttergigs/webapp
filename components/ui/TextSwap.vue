<template>
  <div class="text-swap">
    <span ref="textEl" :class="classes">{{ currentText }}</span>
  </div>
</template>

<script lang="ts" setup>
  import type { GSAP } from 'gsap';

  import type { Ref } from 'vue';
  import { onMounted, ref } from 'vue';

  // Définition des props
  const props = withDefaults(
    defineProps<{
      texts: string[];
      duration?: number;
      repeatDelay?: number;
      offsetY?: number;
      classes?: string;
    }>(),
    {
      duration: 1.6,
      repeatDelay: 0.3,
      offsetY: 25,
    },
  );

  // Instance GSAP injectée par le module Nuxt
  const { $gsap } = useNuxtApp<{ $gsap: GSAP }>();

  // Références et état
  const textEl: Ref<HTMLElement | null> = ref(null);
  const currentText = ref(props.texts[0] || '');
  const offsetY = props.offsetY;

  // Animation au montage
  onMounted(() => {
    if (!props.texts.length || !textEl.value) return;

    const duration = props.duration;
    const delay = props.repeatDelay;
    const tl = $gsap.timeline({
      repeat: -1,
      repeatDelay: delay,
      defaults: { duration, ease: 'power2.inOut' },
    });

    props.texts.forEach((txt) => {
      // 1) fade-out & move up
      tl.to(textEl.value, {
        y: offsetY,
        opacity: 0,
      });
      // 2) swap text instantly
      tl.call(() => {
        currentText.value = txt;
      });
      // 3) position below & invisible
      tl.set(textEl.value, { y: offsetY, opacity: 0 });
      // 4) fade-in & move into place
      tl.to(textEl.value, {
        y: 0,
        opacity: 1,
      });
    });
  });
</script>

<style scoped>
  .text-swap {
    display: inline-block;
    /* add your own typography, color, etc. */
  }

  .text-swap span {
    display: inline-block;
  }
</style>
