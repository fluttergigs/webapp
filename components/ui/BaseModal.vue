<script lang="ts" setup>
  //@ts-ignore
  const props = defineProps({
    headerTitle: {
      type: String,
    },
    body: {
      type: String,
    },
  });
</script>

<template>
  <UModal>
    <template #header>
      <slot name="header">
        <h3 class="font-medium">{{ headerTitle }}</h3>
      </slot>
    </template>
    <template #body>
      <slot name="body">
        <div>
          {{ body }}
        </div>
      </slot>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </UModal>
</template>

<style scoped></style>
