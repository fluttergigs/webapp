<template>
  <div class="flex flex-col gap-1.5">
    <slot name="label">
      <p v-if="hasLabel && showLabel" class="text-sm font-medium">{{ label }}</p>
    </slot>

    <!--    <client-only>-->
    <div class="relative">
      <slot name="insideText">
        <div class="absolute right-4 bottom-0.5 transform">
          <a
            class="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
            @click="$emit('insideTextClicked')"
            >{{ insideText }}</a
          >
        </div>
      </slot>

      <textarea
        v-if="isTextArea"
        v-model="fieldValue"
        :class="[isDisabled ? 'disabled:opacity-50 cursor-not-allowed' : '']"
        :disabled="isDisabled"
        :name="name"
        :placeholder="placeholder"
        class="border border-gray-300 py-2 px-3 rounded-md text-gray-800 w-full"
        rows="5"
        v-bind="$attrs"
      >
      </textarea>
      <input
        v-else
        v-model="fieldValue"
        :class="[isDisabled ? 'disabled:opacity-50 cursor-not-allowed' : '']"
        :disabled="isDisabled"
        :name="name"
        :placeholder="placeholder"
        :type="type"
        class="border border-gray-300 py-2 px-3 rounded-md text-gray-800 w-full"
        v-bind="$attrs"
      />
    </div>
    <p v-if="errorMessage" class="text-red-600 text-start text-sm capitalize">
      {{ errorMessage }}
    </p>
    <!--    </client-only>-->
  </div>
</template>

<script setup>
import { useField } from "vee-validate";
import * as yup from "yup";

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
    type: [String, Number],
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  label: {
    type: String,
    default: "",
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  isTextArea: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:modelValue", "insideTextClicked"]);

const hasLabel = computed(() => !!props.label);
const hasIcon = computed(() => !!props.icon);

const fieldValue = computed({
  get: () => props.modelValue,
  set: (val) => emits("update:modelValue", val),
});

const validators = computed(() => ({
  email: yup
    .string()
    .email()
    .required()
    .label(hasLabel ? props.label : "Email"),
  name: yup
    .string()
    .required()
    .min(2)
    .label(hasLabel ? props.label : "Name"),
  lastName: yup
    .string()
    .required()
    .min(2)
    .label(hasLabel ? props.label : "Last name"),
  firstName: yup
    .string()
    .required()
    .min(2)
    .label(hasLabel ? props.label : "First name"),
  username: yup
    .string()
    .required()
    .min(5)
    .max(30)
    .label(hasLabel ? props.label : "Username"),
  password: yup
    .string()
    .required()
    .min(8)
    .label(hasLabel ? props.label : "Password"),

  //TODO - check confirm password match
  confirmPassword: yup
    .string()
    .label(hasLabel ? props.label : "Confirm password")
    .oneOf([yup.ref("password")], "Passwords must match"),

  description: yup
    .string()
    .required()
    .min(30)
    .max(5000)
    .label(hasLabel ? props.label : "Description"),

  bio: yup
    .string()
    .min(15)
    .max(500)
    .label(hasLabel ? props.label : "Bio"),

  url: yup
    .string()
    .url()
    .label(hasLabel ? props.label : "Url"),

  title: yup
    .string()
    .required()
    .min(8)
    .max(30)
    .label(hasLabel ? props.label : "Job title"),

  company: yup
    .string()
    .required()
    .min(3)
    .max(30)
    .label(hasLabel ? props.label : "Company"),

  amount: yup
    .number()
    .required()
    .min(1)
    .label(hasLabel ? props.label : "Amount"),

  startDate: yup
    .date()
    .required()
    .label(hasLabel ? props.label : "Start date"),
  endDate: yup
    .date()
    .when("isActive", (isActive, schema) => {
      if (!isActive) {
        return schema
          .required("End date is required")
          .min(yup.ref("startDate"), "End date must be after start date");
      }
      return schema
        .min(yup.ref("startDate"), "End date must be after start date")
        .nullable()
        .optional();
    })
    .label("End date"),

  isActive: yup
    .boolean()
    .required()
    .label(hasLabel ? props.label : "Still working there"),

  startYear: yup
    .number()
    .required()
    .label(hasLabel ? props.label : "Start year"),

  portfolio: yup
    .string()
    .url()
    .notRequired()
    .label(hasLabel ? props.label : "Portfolio"),

  twitter: yup
    .string()
    .url()
    .notRequired()
    .label(hasLabel ? props.label : "Twitter"),

  linkedin: yup
    .string()
    .url()
    .notRequired()
    .notRequired()
    .label(hasLabel ? props.label : "LinkedIn"),

  github: yup
    .string()
    .url()
    .notRequired()
    .notRequired()
    .label(hasLabel ? props.label : "Github"),

  website: yup
    .string()
    .url()
    .notRequired()
    .label(hasLabel ? props.label : "Website"),

  endYear: yup
    .number()
    .when("isActive", (isActive, schema) => {
      if (!isActive) {
        return schema
          .required("End year is required")
          .min(yup.ref("startYear"), "End year must be after start year");
      }
      return schema
        .optional()
        .min(yup.ref("startYear"), "End year must be after start year")
        .nullable();
    })
    .label(hasLabel ? props.label : "End year"),
}));

const { errorMessage, meta } = useField(() => props.name, validators.value[props.name], {
  syncVModel: true,
});
</script>

<style scoped></style>
