<script lang="ts" setup>
  import type { Education } from '~/features/users/user.types';

  const props = defineProps({
    education: {
      type: Object as PropType<Education>,
      required: true,
    },
  });

  const { toggleUpdateEducationModal, setEducation } = useProfile();
  const handleEditButtonClick = () => {
    setEducation(props.education);
    toggleUpdateEducationModal();
  };
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <article class="rounded-xl border border-gray-200 p-4">
      <div class="flex flex-col gap-x-5 gap-y-4 md:flex-row">
        <div class="flex justify-between">
          <UAvatar
            :alt="education.degree"
            class="flex items-center justify-center rounded-full bg-gray-200 font-medium text-primary-700"
            size="2xl"
          />
        </div>
        <div class="flex flex-grow flex-col gap-y-5">
          <div class="flex flex-row justify-between">
            <div>
              <div class="mb-3 flex flex-col flex-wrap gap-x-3 gap-y-2 md:flex-row">
                <div class="flex w-full items-center gap-x-2">
                  <h2 class="text-base font-medium text-gray-900">{{ education.degree }}</h2>
                  <div
                    v-if="!education.isActive"
                    class="items-center border rounded-md font-medium w-max border-gray-200 text-xs px-2 py-0.5 hidden h-max md:block"
                  >
                    Reached
                  </div>
                </div>
                <div class="flex flex-row items-center">
                  <span class="text-md font-medium text-gray-700">{{ education.school }}</span>
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
                    <span class="text-md font-medium">{{ education.startYear }} </span>
                    -
                    <span v-if="education.isActive" class="text-md font-medium">Present</span>

                    <span v-else class="text-md font-medium">{{ education.endYear }}</span>
                  </p>
                </div>
              </div>
              <p class="text-sm text-gray-600">{{ education.field }}</p>
            </div>

            <UButton
              class="h-fit"
              color="neutral"
              icon="i-heroicons-pencil"
              label="Edit"
              size="sm"
              variant="outline"
              @click="handleEditButtonClick"
            />
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped></style>
