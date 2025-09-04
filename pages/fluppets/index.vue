<script lang="ts" setup>
  import { CodeBracketIcon, LightBulbIcon } from '@heroicons/vue/24/solid';
  //@ts-ignore
  import Perk from '~/components/ui/Perk.vue';
  import { useAnalytics } from '~/composables/useAnalytics';
  import { useFluppets } from '~/composables/useFluppets';
  import { AnalyticsEvent } from '~/services/analytics/events';

  definePageMeta({
    title: 'Fluppets - Discover & Share & Integrate Flutter Snippets',
    layout: 'main-layout',
  });

  defineOgImageScreenshot({
    //@ts-ignore
    delay: 1200,
    selector: '#home-header',
    mask: '#navbar',
  });

  useSeoMeta({
    title: 'FlutterGigs - Discover & Share Flutter Snippets',
    description: 'FlutterGigs - Discover the best resources to hone your skills',
    ogTitle: 'FlutterGigs  - Discover & Share Flutter Snippets',
    ogDescription: 'Discover the best resources to hone your skills',
    ogImageUrl: 'https://fluttergigs.com/fluttergigs-og.png',
    twitterImage: 'https://fluttergigs.com/fluttergigs-og.png',
    twitterCard: 'summary_large_image',
    ogSiteName: 'Flutter Gigs - The #1 Flutter job platform',
    twitterSite: '@fluttergigs',
    twitterTitle: 'FlutterGigs - Discover & Share Flutter Snippets',
    twitterDescription: 'FlutterGigs - Discover & Share Flutter Snippets',
  });

  const { discoverFluppets, handleFluppetsCreate } = useFluppets();

  onMounted(() => {
    useAnalytics().capture(AnalyticsEvent.fluppetsPageEntered);
  });
</script>

<template>
  <main>
    <header class="pattern-bg relative py-36" id="home-header">
      <div class="container mx-auto flex flex-col-reverse items-center gap-12 px-6 lg:flex-row">
        <!-- Text Content -->
        <div class="text-center md:w-7/12 lg:text-left">
          <h1 class="mb-4 text-4xl font-extrabold leading-tight xl:text-5xl">
            Discover & Share & Integrate <br /><span class="text-primary">Professional</span>
            <span class="primary-gradient">Flutter Snippets</span>
          </h1>
          <p class="mb-8 text-xl text-gray-600">
            Access our curated library and integrate code snippets seamlessly into your
            <br />
            Flutter projects. Share your own snippets and contribute to the community.
          </p>
          <div class="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <UButton
              class="flex gap-2 rounded-xl px-9 py-5 font-bold"
              color="primary"
              icon="i-lucide-search"
              label="Discover Snippets"
              @click="discoverFluppets"
            />

            <UButton
              class="flex gap-2 rounded-xl border-2 px-9 py-5 font-bold"
              color="primary"
              label="Contribute"
              icon="i-lucide-git-branch-plus"
              variant="soft"
              @click="handleFluppetsCreate"
            />
          </div>
        </div>
        <!-- Code Snippet Preview -->
        <div class="w-full md:w-5/12">
          <div
            class="custom-code__container transition-all duration-200 hover:shadow-md hover:-translate-y-4"
          >
            <div class="window">
              <span class="block h-3 w-3 rounded-full bg-red-500"></span>
              <span class="block h-3 w-3 rounded-full bg-yellow-500"></span>
              <span class="block h-3 w-3 rounded-full bg-green-500"></span>
            </div>
            <pre
              class="language-dart overflow-x-auto bg-white p-6 font-mono text-sm"
            ><code>Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: [BoxShadow(blurRadius: 10, color: Colors.black12)],
              ),
              child: Text('Hello, FlutterGigs!'),
              );</code></pre>
          </div>
        </div>
      </div>
    </header>

    <section class="pattern-bg py-36">
      <div class="flex flex-col gap-12">
        <div class="flex justify-center items-center">
          <h4 class="flex text-4xl heading-gradient-underline mb-20">
            Elevate your Flutter workflow
          </h4>
        </div>

        <div
          class="container relative z-10 mx-auto flex flex-col space-y-4 px-10 md:flex-row md:space-x-8 md:px-8"
        >
          <div class="w-full md:w-1/3">
            <div class="flex flex-col">
              <p class="mb-6 text-sm font-bold uppercase tracking-px text-indigo-600">
                For Developers
              </p>

              <h2
                class="tracking-px-n mb-16 font-heading text-4xl font-bold leading-none md:text-5xl xl:text-6xl"
              >
                Experience the power of code snippets
              </h2>

              <p class="font-medium leading-relaxed text-gray-600">
                Discover a curated library of Flutter snippets, designed to enhance your development
                process. Share your own snippets and contribute to the community.
              </p>
            </div>
          </div>
          <div class="w-full md:w-1/3">
            <Perk
              :icon="CodeBracketIcon"
              cta-text="Contribute"
              description=" Showcase your skills: Share your code snippets and demonstrate your expertise to potential employers.
                  Collaborate with peers: Engage with the community, upvote, and refine code snippets together."
              title="Showcase"
              @cta-clicked="handleFluppetsCreate"
            />
          </div>
          <div class="w-full md:w-1/3">
            <Perk
              :icon="LightBulbIcon"
              cta-text="Discover Snippets"
              description="
Discover solutions: Find vetted snippets to speed up your development process.
                  Integrate seamlessly: Easily incorporate snippets into your Flutter/Dart projects"
              title="Discover"
              @cta-clicked="discoverFluppets"
            >
            </Perk>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
