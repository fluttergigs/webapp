<template>
  <div class="flex flex-col space-y-2">
    <slot name="label">
      <p v-if="hasLabel" class="text-sm">{{ label }}</p>
    </slot>

    <client-only>
      <div class="relative">
        <slot name="insideText">
          <div class="absolute right-4 top-1/2 transform -translate-y-1/2">
            <a @click="$emit('insideTextClicked')" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
               href="#">{{ insideText }}</a>
          </div>
        </slot>

        <input
            class="custom-input"
            :type="type"
            :value="modelValue"
            v-maska
            :data-maska="mask"
            :data-maska-tokens="maskToken"
            @maska="onMaska($event)"
            :placeholder="placeholder"
        />
      </div>
    </client-only>
  </div>
</template>

<script setup>

const props = defineProps({
  insideText: {
    type: String,
    default: "",
  },
  mask: {
    type: String,
    default: "Z",
  },
  placeholder: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    default: "text"
  },
  maskToken: {
    type: String,
    default: "Z:[a-zA-ZÀ-ȕ\- ]:repeated"
  },
  label: {
    type: String,
    default: ""
  },
  modelValue: {
    type: String,
  }
})

const emits = defineEmits(['update:modelValue', 'insideTextClicked'])

const hasLabel = computed(() => !!props.label)
const hasIcon = computed(() => !!props.icon)
const hasMask = computed(() => !!props.mask)
const hasMaskToken = computed(() => !!props.maskToken ? Object.keys(props.maskToken).length >= 1 : false)

const onMaska = ($event) => {
  // emits
  emits('update:modelValue', $event.detail.unmasked)
}

</script>

<style scoped>

</style>