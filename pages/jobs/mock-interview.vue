<script lang="ts" setup>
  import { useMockInterviews } from '~/composables/useMockInterviews';

  import { onMounted } from 'vue';

  // Page metadata
  definePageMeta({
    layout: 'app-layout',
    middleware: 'auth',
    title: 'Mock Interview Practice',
  });

  // SEO and meta
  useHead({
    title: 'Mock Interview Practice - Flutter Gigs',
    meta: [
      {
        name: 'description',
        content:
          'Practice for your Flutter job interview with AI-generated questions based on real job postings.',
      },
    ],
  });

  // Use the mock interviews composable
  const { questions, currentSession, initialize } = useMockInterviews();

  onMounted(() => {
    initialize();
  });
</script>

<template>
  <main class="min-h-screen w-full bg-gray-50">
    <div class="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Mock Interview Practice 💼
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Get ready for your Flutter job interview with <b>AI-generated</b> questions based on real
          job postings. Practice your responses and build confidence.
        </p>
      </div>

      <!-- Interview Session View -->
      <MockInterviewSessionView v-if="currentSession" />

      <!-- Question Generation Form -->

      <MockInterviewQuestionsGenerationForm v-else />
      <!-- Generated Questions Preview -->

      <MockInterviewQuestionsPreview v-if="questions.length > 0 && !currentSession" />
    </div>
  </main>
</template>
