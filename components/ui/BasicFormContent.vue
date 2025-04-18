<script lang="ts" setup>
  import CloseButton from '~/components/ui/CloseButton.vue';

  //@ts-ignore
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    showCloseButton: {
      type: Boolean,
      default: false,
    },
  });
</script>

<template>
  <client-only>
    <section class="flex flex-col py-8 md:py-16 xl:pb-56 bg-white relative overflow-hidden">

      <CloseButton v-if="showCloseButton" />
      <div class="container px-4 mx-auto">
        <div class="text-center max-w-lg mx-auto">
          <slot name="logo">
            <NuxtLink class="mb-36 inline-block" to="/">
              <img alt="" class="w-12" src="@/assets/images/ico.png" />
            </NuxtLink>
          </slot>

          <slot name="title">
            <h2 class="mb-4 text-6xl md:text-7xl text-center font-bold font-heading tracking-px-n leading-tight">
              {{ title }}
            </h2>
          </slot>

          <slot name="description">
            <p class="mb-12 font-medium text-lg text-gray-600 leading-normal">
              {{ description }}
            </p>
          </slot>

          <slot name="form">

          </slot>
        </div>
      </div>
    </section>

    <UNotifications />
  </client-only>

</template>

<style scoped>

</style>