<script lang="ts" setup>
  // Tab items for UTabs
  import { useMockInterviews } from '~/composables/useMockInterviews';

  const tabItems = [
    {
      slot: 'url',
      label: 'Job Post URL',
      description: 'Paste a job posting URL',
    },
    {
      slot: 'description',
      label: 'Job Description',
      description: 'Enter job description directly',
    },
  ];

  const {
    // Form state
    jobPostUrl,
    jobDescription,
    questionCount,
    difficulty,
    activeTab,

    // Computed properties
    isGenerating,
    canGenerate,
    questions,

    // Options
    questionCountOptions,
    difficultyOptions,

    // Methods
    generateQuestions,
  } = useMockInterviews();
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900">Generate Interview Questions</h2>
    </template>

    <!-- Tab Navigation -->
    <UTabs v-model="activeTab" :items="tabItems" class="mb-6">
      <!-- URL Tab -->
      <template #url="{ item }">
        <div class="space-y-4">
          <UFormGroup
            description="Paste the URL of the job posting you want to practice for"
            label="Job Post URL"
            required
          >
            <UInput
              v-model="jobPostUrl"
              class="w-full"
              placeholder="https://example.com/job-posting"
              size="lg"
              type="url"
            />
          </UFormGroup>
        </div>
      </template>

      <!-- Description Tab -->
      <template #description="{ item }">
        <div class="space-y-4">
          <UFormGroup
            description="Copy and paste the job description you want to practice for"
            label="Job Description"
            required
          >
            <UTextarea
              v-model="jobDescription"
              :rows="6"
              class="w-full"
              placeholder="Paste the job description here..."
              size="lg"
            />
          </UFormGroup>
        </div>
      </template>
    </UTabs>

    <!-- Options -->
    <div class="grid md:grid-cols-2 gap-4 mb-6">
      <UFormGroup label="Number of Questions">
        <USelectMenu
          v-model="questionCount"
          :items="questionCountOptions"
          label-key="label"
          searchable
          size="lg"
          value-key="value"
        />
      </UFormGroup>

      <UFormGroup label="Difficulty Level">
        <USelectMenu
          v-model="difficulty"
          :items="difficultyOptions"
          label-key="label"
          searchable
          size="lg"
          value-key="value"
        />
      </UFormGroup>
    </div>

    <!-- Generate Button -->
    <UButton
      :disabled="!canGenerate || questions.length > 0"
      :loading="isGenerating"
      class="w-full"
      size="lg"
      @click="generateQuestions"
    >
      Generate Interview Questions
    </UButton>
  </UCard>
</template>

<style scoped></style>
