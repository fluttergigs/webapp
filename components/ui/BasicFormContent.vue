<script setup lang="ts">


const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  }
})
</script>

<template>

  <client-only>
    <section class="py-8 md:py-16 xl:pb-56 bg-white overflow-hidden">
      <div class="container px-4 mx-auto">
        <div class="text-center max-w-lg mx-auto">
          <slot name="logo">
            <NuxtLink class="mb-36 inline-block" to="/">
              <img src="@/assets/images/logo.svg" alt=""/>
            </NuxtLink>
          </slot>

          <h2 v-if="title"
              class="mb-4 text-6xl md:text-7xl text-center font-bold font-heading tracking-px-n leading-tight"
          >
            {{ title }}
          </h2>
          <slot v-else name="title">

          </slot>


          <p v-if="description" class="mb-12 font-medium text-lg text-gray-600 leading-normal">
            {{ description }}
          </p>
          <slot v-else name="description">

          </slot>

          <slot name="form">

          </slot>
        </div>
      </div>
    </section>
  </client-only>

</template>

<style scoped>

</style>