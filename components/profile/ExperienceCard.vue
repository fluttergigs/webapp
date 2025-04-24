<script lang="ts" setup>
  import type { Experience } from '~/features/users/user.types';

  const props = defineProps({
    experience: {
      type: Object as PropType<Experience>,
      required: true,
    },
  });
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <article class="rounded-xl border border-gray-200 p-4">
      <div class="flex flex-col gap-x-5 gap-y-4 md:flex-row">
        <div class="flex justify-between">
          <UAvatar
            :alt="experience.company"
            class="flex items-center justify-center rounded-full bg-gray-200 font-medium text-primary-700"
            size="2xl"
          />
        </div>
        <div class="flex flex-grow flex-col gap-y-5">
          <div class="flex flex-row justify-between">
            <div>
              <div class="mb-3 flex flex-col flex-wrap gap-x-4 gap-y-2 md:flex-row">
                <div class="flex w-full items-center gap-x-2">
                  <h2 class="text-base font-medium text-gray-900">{{ experience.title }}</h2>
                  <div
                    v-if="experience.isActive"
                    class="items-center border rounded-md font-medium w-max border-gray-200 text-xs px-2 py-0.5 hidden h-max md:block"
                  >
                    Current
                  </div>
                </div>
                <div class="flex flex-row items-center">
                  <span class="text-sm font-medium text-gray-700">{{ experience.company }}</span>
                </div>
                <div class="flex items-center gap-x-2">
                  <UButton
                    class="h-fit"
                    color="neutral"
                    icon="i-heroicons-calendar"
                    size="sm"
                    variant="ghost"
                  />

                  <!--                  use this format Month Day ==> Jan 25-->
                  <p>
                    <span
                      v-date-format="{ date: experience.startDate, format: 'MMM D' }"
                      class="text-md font-medium"
                    >
                    </span>
                    -
                    <span v-if="experience.isActive" class="text-md font-medium">Present</span>

                    <span
                      v-else
                      v-date-format="{ date: experience.endDate, format: 'MMM D' }"
                      class="text-md font-medium"
                    ></span>
                  </p>
                </div>
              </div>
              <p class="text-sm text-gray-600">{{ experience.title }}</p>
            </div>

            <UButton
              class="h-fit"
              color="neutral"
              icon="i-heroicons-pencil"
              label="Edit"
              size="sm"
              variant="outline"
            />
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped></style>
