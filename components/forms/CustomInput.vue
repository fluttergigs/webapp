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
            v-model="value"
            class="custom-input"
            :type="type"
            :name="name"
            :placeholder="placeholder"
        />
      </div>
      <p class="text-red-600 text-start text-sm capitalize">{{ errorMessage }}
      </p>
    </client-only>
  </div>
</template>

<script setup>

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  insideText: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
  },
  placeholder: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    default: "text"
  },
  label: {
    type: String,
    default: ""
  },
})

const emits = defineEmits(['update:modelValue', 'insideTextClicked'])

const hasLabel = computed(() => !!props.label)
const hasIcon = computed(() => !!props.icon)

import {useField} from 'vee-validate';
import * as yup from 'yup';

const validators = {
  email: yup.string().email().required().label('Email'),
  lastName: yup.string().required().min(2).label('Last name'),
  firstName: yup.string().required().min(2).label('First name'),
  password: yup.string().required().min(5).label('Password'),
  url: yup.string().url(),
  // url: yup.s
}

const {errorMessage, value, meta: {valid, dirty}} = useField(() => props.name, validators[props.name]);
</script>

<style scoped>

</style>