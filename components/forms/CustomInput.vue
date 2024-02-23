<template>
  <div class="flex flex-col space-y-2">
    <slot name="label">
      <p v-if="hasLabel && showLabel" class="text-sm">{{ label }}</p>
    </slot>

    <client-only>
      <div class="relative">
        <slot name="insideText">
          <div class="absolute right-4 bottom-0.5 transform -translate-y-1/2">
            <a @click="$emit('insideTextClicked')" class="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium"
               href="#">{{ insideText }}</a>
          </div>
        </slot>



          <textarea v-if="isTextArea"
                    v-model="value"
                    class="custom-input"
                    :name="name"
                    :placeholder="placeholder">

          </textarea>
          <input v-else
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
  showLabel: {
    type: Boolean,
    default: true,
  },
  isTextArea: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:modelValue', 'insideTextClicked'])

const hasLabel = computed(() => !!props.label)
const hasIcon = computed(() => !!props.icon)

import {useField} from 'vee-validate';
import * as yup from 'yup';

const validators = {
  email: yup.string().email().required().label(hasLabel ? props.label : 'Email'),
  name: yup.string().required().min(2).label(hasLabel ? props.label : 'Name'),
  lastName: yup.string().required().min(2).label(hasLabel ? props.label : 'Last name'),
  firstName: yup.string().required().min(2).label(hasLabel ? props.label : 'First name'),
  //TODO - change password min length to 8
  password: yup.string().required().min(5).label(hasLabel ? props.label : 'Password'),
  description: yup.string().required().min(15).label(hasLabel ? props.label : 'Description'),
  url: yup.string().url().label(hasLabel ? props.label : 'Url'),
}

const {errorMessage, value, meta: {valid, dirty}} = useField(() => props.name, validators[props.name]);
</script>

<style scoped>

</style>