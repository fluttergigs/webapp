<template>
  <main class="pattern-bg to-slate-50 relative px-4 sm:px-8 md:px-20 py-10">
    <div class="flex h-full w-full justify-center items-center" v-if="pending">
      <UIcon
        name="i-lucide-loader-circle"
        class="w-12 h-12 animate-spin text-indigo-600"
      />
    </div>

    <div class="flex flex-col gap-6" v-else>
      <UBreadcrumb :items="breadcrumbs">
        <template #separator>
          <span class="mx-2 text-muted">/</span>
        </template>
      </UBreadcrumb>

      <h1 class="text-3xl sm:text-4xl font-bold">{{ snippet?.title }}</h1>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3">
          <div class="flex flex-col gap-4">
            <div
              class="flex flex-wrap gap-4 mt-8 mb-10"
              v-if="(snippet?.tags?.length ?? 0) > 0"
            >
              <FluppetsTag
                :show-count="false"
                :show-hashtag="true"
                :tag="tag"
                v-for="tag in snippet?.tags ?? []"
                :key="tag.documentId"
                @tag-click="(tag) => useFluppets().handleTagClick(tag)"
              />
            </div>
            <UiCodeBlock
              :code="snippet?.code"
              height="unset"
              @share="snippet && useFluppets().handleFluppetsShare(snippet)"
              @copy="snippet && useCopyGate().copy(snippet)"
            />
          </div>
        </div>

        <div class="lg:col-span-1 flex flex-col gap-4">
          <FluppetsAuthorCard v-if="snippet" :snippet="snippet" />

          <FluppetsSnippetDescription v-if="snippet" :snippet="snippet" />
          <!-- <SnippetSidebar :snippet="snippet" /> -->
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { Endpoint } from "~/core/network/endpoints";
import type { Snippet, Tag } from "~/features/fluppets/fluppets.types";
import { AnalyticsEvent } from "~/services/analytics/events";
import { useAnalytics } from "~/composables/useAnalytics";
import { AppRoutes } from "~/core/routes";
// @ts-ignore

definePageMeta({
  layout: "main-layout",
  title: "FlutterGigs - Discover & Share & Integrate Flutter Snippets",
});

const route = useRoute();
const snippetId = ref(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
);

const { data: snippet, error, status } = await useFetch<Snippet>(
  `${useRuntimeConfig().public.apiBaseUrl}${Endpoint.fluppetsById(
    snippetId.value as string
  )}`,
  {
    key: snippetId.value as string,
    transform: (result) => result.data,
    watch: [snippetId],
  }
);

if (!snippet.value) {
  throw createError({
    statusCode: 404,
    fatal: true,
    statusMessage: "This snippet does not exist or has been removed",
  });
}

const pending = computed(() => status.value === "pending");

const breadcrumbs = computed(() => [
  {
    label: "Home",
    icon: "i-lucide-home",
    to: AppRoutes.fluppets,
  },
  {
    label: "Fluppets",
    icon: "i-lucide-search",
    to: AppRoutes.exploreFluppets,
  },
  {
    label: snippet.value?.title,
    icon: "i-lucide-code",
    to: AppRoutes.fluppetDetail(snippetId.value as string),
  },
]);

useSeoMeta({
  title: () => `${snippet.value?.title} - FluttterGigs`,
  description: "FlutterGigs - Discover & Share Flutter Snippets",
  ogTitle: () => `${snippet.value?.title} - FluttterGigs`,
  ogDescription: "FlutterGigs - Discover & Share Flutter Snippets",
  ogImageUrl: "https://fluttergigs.com/fluttergigs-og.png",
  twitterImage: "https://fluttergigs.com/fluttergigs-og.png",
  twitterCard: "summary_large_image",
  ogSiteName: "Flutter Gigs - The #1 Flutter job platform",
  twitterSite: "@fluttergigs",
  twitterTitle: `${snippet.value?.title} - Discover & Share Flutter Snippets`,
  twitterDescription: `FlutterGigs - Discover & Share Flutter Snippets`,
});

defineOgImageComponent(
  "Snippet",
  {
    code:
      snippet.value && snippet.value.code && snippet.value?.code.length > 2000
        ? snippet.value?.code.substring(0, 2000)
        : snippet.value?.code,
  },
  {
    fonts: ["Outfit:700"],
  }
);
onMounted(() => {
  useAnalytics().capture(AnalyticsEvent.fluppetsDetailPageEntered, {
    snippetId: snippet.value ?? {},
  });
});
</script>

<style lang="scss" scoped></style>
