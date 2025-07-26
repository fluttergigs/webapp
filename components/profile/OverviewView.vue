<template>
  <div>
    <div class="flex flex-col gap-y-6 py-2">
      <div class="flex flex-col border-b border-gray-200 pb-5">
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div class="flex flex-col gap-1">
            <h3 class="text-lg font-bold text-gray-900">Overview</h3>
            <p class="text-sm text-gray-600">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>
          <div class="flex items-center gap-3"></div>
          <div v-if="hasOverviewDataChanged" class="flex gap-3">
            <UButton
              :disabled="!canUpdateOverviewData"
              :loading="isUpdatingOverviewData"
              class="font-bold h-fit"
              color="neutral"
              variant="outline"
              icon="i-heroicons-x-mark"
              label="Cancel"
              size="xl"
              @click="cancelOverviewDataChanges"
            />
            <UButton
              :disabled="!canUpdateOverviewData"
              :loading="isUpdatingOverviewData"
              class="font-bold h-fit"
              color="primary"
              icon="i-heroicons-check"
              label="Save changes"
              size="xl"
              @click="updateOverviewData"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-y-5">
      <!-- Username -->
      <div class="w-full border-b border-gray-200 py-5 xl:flex xl:gap-x-5">
        <div class="w-full space-y-5 xl:flex xl:gap-x-5 xl:space-y-0">
          <div class="flex flex-col xl:w-72">
            <label
              class="text-sm font-bold text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="«rfv»-form-item"
              >Username*</label
            >
            <p id="«rfv»-form-item-description" class="text-sm text-gray-600">
              This will also act as your profile URL slug
              (flutterigs.com/consultants/username).
            </p>
          </div>
          <div class="flex w-80 flex-col space-y-1.5">
            <CustomInput
              v-model="overviewData.username"
              label="Username"
              name="username"
              placeholder="e.g. @enthusiastDev"
            />

            <p class="text-sm text-gray-600">
              fluttergigs.com/consultants/{{ overviewData.username }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bio -->
      <div
        class="w-full border-b py-5 border-gray-200 space-y-5 xl:flex xl:gap-x-5 xl:space-y-0"
      >
        <div class="flex flex-col xl:w-72">
          <label
            class="text-sm font-bold text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="«r30»-form-item"
            >Your bio*</label
          >
          <p id="«r30»-form-item-description" class="text-sm text-gray-600">
            Tell us about your career and interests. The more detailed you provide about
            yourself and your achievements, the better we can match you with companies
            that are hiring.
          </p>
        </div>
        <div class="flex flex-col space-y-1.5 xl:w-160">
          <CustomInput
            :is-text-area="true"
            v-model="overviewData.bio"
            label="Bio (mandatory) *"
            name="bio"
            placeholder="Tell us about your career and interests. The more detailed you provide about yourself and your achievements, the better we can match you with companies that are hiring."
          />
        </div>
      </div>

      <!-- Social Links -->
      <div class="w-full border-b border-gray-200 py-5 xl:flex xl:gap-x-5">
        <div class="mb-5 flex flex-col xl:mb-0 xl:w-72">
          <label
            class="text-sm font-bold text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >Social links</label
          >
        </div>
        <div class="flex-col space-y-5">
          <div class="flex w-96 flex-col space-y-1.5">
            <CustomInput
              v-model="overviewData.twitter"
              label="X"
              name="twitter"
              placeholder="e.g. x.com/username"
            />
          </div>
          <div class="flex w-96 flex-col space-y-1.5">
            <CustomInput
              v-model="overviewData.linkedin"
              label="LinkedIn"
              name="linkedin"
              placeholder="e.g. linkedin.com/in/username"
            />
          </div>
          <div class="flex w-96 flex-col space-y-1.5">
            <CustomInput
              v-model="overviewData.github"
              label="Github (mandatory) *"
              name="github"
              placeholder="e.g. github.com/username"
            />
          </div>
        </div>
      </div>

      <!-- Portfolio -->
      <div class="w-full border-b border-gray-200 py-5 xl:flex xl:gap-x-5">
        <div class="w-full space-y-5 xl:flex xl:gap-x-5 xl:space-y-0">
          <div class="flex flex-col xl:w-72">
            <label
              class="text-sm font-bold text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="«rgf»-form-item"
              >Your website</label
            >
            <p id="«rgf»-form-item-description" class="text-sm text-gray-600">
              If you have a personal website or online CV, please provide it here.
            </p>
          </div>

          <div class="flex max-w-128 flex-col space-y-1.5 xl:w-128">
            <CustomInput
              v-model="overviewData.portfolio"
              placeholder="e.g. example.com"
              label="Portfolio"
              name="portfolio"
            />
          </div>
        </div>
      </div>

      <!-- Website -->
      <div class="w-full border-b border-gray-200 py-5 xl:flex xl:gap-x-5">
        <div class="w-full space-y-5 xl:flex xl:gap-x-5 xl:space-y-0">
          <div class="flex flex-col xl:w-72">
            <label
              class="text-sm font-bold text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="«rgf»-form-item"
              >Your website</label
            >
            <p id="«rgf»-form-item-description" class="text-sm text-gray-600">
              If you have a personal website or online CV, please provide it here.
            </p>
          </div>
          <div class="flex max-w-128 flex-col space-y-1.5 xl:w-128">
            <CustomInput
              v-model="overviewData.website"
              label="Website"
              name="website"
              placeholder="e.g. example.com"
            />
          </div>
        </div>
      </div>

      <!-- Save Changes Button -->
      <div class="flex w-full justify-between gap-x-3 pt-4" v-if="hasOverviewDataChanged">
        <div></div>
        <div class="flex gap-3">
          <UButton
            :disabled="!canUpdateOverviewData"
            :loading="isUpdatingOverviewData"
            class="font-bold h-fit"
            color="neutral"
            variant="outline"
            icon="i-heroicons-x-mark"
            label="Cancel"
            size="xl"
            @click="cancelOverviewDataChanges"
          />
          <UButton
            :disabled="!canUpdateOverviewData"
            :loading="isUpdatingOverviewData"
            class="font-bold h-fit"
            color="primary"
            icon="i-heroicons-check"
            label="Save changes"
            size="xl"
            @click="updateOverviewData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomInput from "~/components/forms/CustomInput.vue";

const {
  canUpdateOverviewData,
  overviewData,
  hasOverviewDataChanged,
  isUpdatingOverviewData,
  updateOverviewData,
  cancelOverviewDataChanges,
} = useProfile();
</script>

<style></style>
