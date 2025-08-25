<template>
  <main>
    <section class="w-full overflow-hidden bg-white px-2 py-8 md:py-12 xl:pb-56">
      <div class="my-4 flex flex-col gap-x-16 font-normal md:flex-row">
        <div class="flex w-full flex-col gap-y-8 xl:mx-auto max-w-4xl">
          <div class="flex items-center gap-4 mb-4">
            <button 
              @click="navigateTo('/fluppets/explore')"
              class="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              ← Back
            </button>
            <h3 class="tracking-px-n text-2xl font-semibold leading-tight md:text-4xl">
              Create New Snippet
            </h3>
          </div>

          <form @submit.prevent="handleSubmit" class="my-12 flex w-full flex-col gap-8">
            <!-- Title Input -->
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium">Snippet Title *</label>
              <input
                v-model="snippetData.title"
                type="text"
                placeholder="e.g., Custom Flutter Button Widget"
                class="border border-gray-300 py-2 px-3 rounded-md text-gray-800 w-full"
              />
              <p v-if="errors.title" class="text-red-600 text-start text-sm capitalize">
                {{ errors.title }}
              </p>
            </div>

            <!-- Description Input -->
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium">Description *</label>
              <textarea
                v-model="snippetData.description"
                placeholder="Describe what your snippet does and how to use it"
                rows="3"
                class="border border-gray-300 py-2 px-3 rounded-md text-gray-800 w-full"
              ></textarea>
              <p v-if="errors.description" class="text-red-600 text-start text-sm capitalize">
                {{ errors.description }}
              </p>
            </div>

            <!-- Language Selection -->
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium">Programming Language *</label>
              <select
                v-model="snippetData.language"
                class="border border-gray-300 py-2 px-3 rounded-md text-gray-800 w-full"
              >
                <option value="">Select a language</option>
                <option value="dart">Dart</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
                <option value="flutter">Flutter</option>
                <option value="java">Java</option>
                <option value="kotlin">Kotlin</option>
                <option value="swift">Swift</option>
                <option value="other">Other</option>
              </select>
              <p v-if="errors.language" class="text-red-600 text-start text-sm capitalize">
                {{ errors.language }}
              </p>
            </div>

            <!-- Code Input -->
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium">Code *</label>
              <textarea
                v-model="snippetData.code"
                placeholder="Paste your code here..."
                rows="12"
                class="border border-gray-300 py-2 px-3 rounded-md text-gray-800 w-full font-mono text-sm"
              ></textarea>
              <p v-if="errors.code" class="text-red-600 text-start text-sm capitalize">
                {{ errors.code }}
              </p>
            </div>

            <div class="flex gap-4 pt-6">
              <button
                type="submit"
                :disabled="isLoading"
                class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Creating Snippet...' : 'Create Snippet' }}
              </button>
              
              <button
                type="button"
                @click="navigateTo('/fluppets/explore')"
                :disabled="isLoading"
                class="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "main-layout",
  keepalive: true,
});

// Form data
const snippetData = ref({
  title: '',
  description: '',
  language: '',
  code: '',
});

const errors = ref<Record<string, string>>({});
const isLoading = ref(false);

// Form validation
const validateForm = () => {
  errors.value = {};
  
  if (!snippetData.value.title.trim()) {
    errors.value.title = 'Title is required';
  } else if (snippetData.value.title.length < 5) {
    errors.value.title = 'Title must be at least 5 characters';
  }
  
  if (!snippetData.value.description.trim()) {
    errors.value.description = 'Description is required';
  } else if (snippetData.value.description.length < 10) {
    errors.value.description = 'Description must be at least 10 characters';
  }
  
  if (!snippetData.value.language) {
    errors.value.language = 'Language is required';
  }
  
  if (!snippetData.value.code.trim()) {
    errors.value.code = 'Code is required';
  } else if (snippetData.value.code.length < 10) {
    errors.value.code = 'Code must be at least 10 characters';
  }
  
  return Object.keys(errors.value).length === 0;
};

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  
  try {
    // For now, just simulate the creation process
    console.log('Creating snippet:', snippetData.value);
    
    // TODO: Call the API to create the snippet
    // await fluppetsStore.create({
    //   data: snippetData.value
    // });
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show success message (for now just alert)
    alert('Snippet created successfully! (This is a demo)');
    
    // Navigate back to explore page
    navigateTo('/fluppets/explore');
    
  } catch (error) {
    console.error('Error creating snippet:', error);
    alert('Error creating snippet. Please try again.');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
