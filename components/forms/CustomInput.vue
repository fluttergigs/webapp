<template>
  <div class="flex flex-col space-y-2">
    <slot name="label">
      <p v-if="hasLabel && showLabel" class="text-sm font-medium">{{ label }}</p>
    </slot>

    <!--    <client-only>-->
    <div class="relative">
      <slot name="insideText">
        <div class="absolute right-4 bottom-0.5 transform">
          <a class="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
             @click="$emit('insideTextClicked')">{{ insideText }}</a>
        </div>
      </slot>

      <textarea
          v-if="isTextArea"
          v-model="fieldValue"
          :class="['custom-input !text-black',isDisabled? 'disabled:opacity-50 cursor-not-allowed':'']"
          :disabled="isDisabled"
          :name="name"
          :placeholder="placeholder"
          rows="5"
          v-bind="$attrs">

          </textarea>
      <input v-else v-model="fieldValue"
             :class="['custom-input !text-black',isDisabled? 'disabled:opacity-50 cursor-not-allowed':'']"
             :disabled="isDisabled"
             :name="name"
             :placeholder="placeholder"
             :type="type"
             v-bind="$attrs"
      />

    </div>
    <p v-if="true" class="text-red-600 text-start text-sm capitalize">
      {{ errorMessage }}
    </p>
    <!--    </client-only>-->
  </div>
</template>

<script setup>
import {useField} from 'vee-validate';
import * as yup from 'yup';

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
    type: [String, Number]
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
  showLabel: {
    type: Boolean,
    default: true,
  },
  isTextArea: {
    type: Boolean,
    default: false
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:modelValue', 'insideTextClicked'])

const hasLabel = computed(() => !!props.label)
const hasIcon = computed(() => !!props.icon)

const fieldValue = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})

const validators = {
  email: yup.string().email().required().label(hasLabel ? props.label : 'Email'),
  name: yup.string().required().min(2).label(hasLabel ? props.label : 'Name'),
  lastName: yup.string().required().min(2).label(hasLabel ? props.label : 'Last name'),
  firstName: yup.string().required().min(2).label(hasLabel ? props.label : 'First name'),
  username: yup.string().required().min(2).label(hasLabel ? props.label : 'Username'),
  //TODO - change password min length to 8
  password: yup.string().required().min(8).label(hasLabel ? props.label : 'Password'),

  //TODO - check confirm password match
  confirmPassword: yup.string().label(hasLabel ? props.label : 'Confirm password')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),

  description: yup.string().required().min(30).max(5000).label(hasLabel ? props.label : 'Description'),
  bio: yup.string().min(15).max(500).label(hasLabel ? props.label : 'Bio'),
  url: yup.string().url().label(hasLabel ? props.label : 'Url'),
  jobTitle: yup.string().required().min(8).label(hasLabel ? props.label : 'Job title'),
  amount: yup.number().required().min(1).label(hasLabel ? props.label : 'Amount'),
}

const {
  errorMessage,
  meta: {valid, dirty, touched}
} = useField(() => props.name, validators[props.name], {syncVModel: true});
</script>

<style scoped>

</style>