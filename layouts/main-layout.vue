<template>
  <!--  <client-only>-->
  <NuxtErrorBoundary @error="onError">
    <div class="flex h-full flex-col">
      <LayoutNavBar />
      <div class="flex-grow overflow-hidden">
        <div class="relative">
          <NuxtPage />
        </div>
      </div>
      <LayoutFooter />

      <FluppetsCopyGateModal v-model:visible="showCopyGateModal" />

      <!-- Feature Announcement Modal -->
      <FeatureAnnouncementModal v-if="showFeatureModal && !!featureConfig" v-model:isOpen="showFeatureModal"
        :config="featureConfig" @close="handleModalClose" @action="handleFeatureActionClick" />
    </div>
  </NuxtErrorBoundary>
  <!--  </client-only>-->
</template>

<script lang="ts" setup>
import { useWebSocket } from "@vueuse/core";

//@ts-ignore
import LayoutNavBar from "~/components/layout/NavBar.vue";
import { logDev } from "~/core/helpers/log";
import type { FeatureAnnouncementConfig } from "~/features/announcements/announcements.types";
import { FeatureId } from "~/features/announcements/announcements.types";
import type { Snippet } from "~/features/fluppets/fluppets.types";
import { ApplicationEventEnum } from "~/plugins/eventBus.client";
import type { ErrorTrackerProvider } from "~/services/error-tracker/ErrorTrackerProvider";

//@ts-ignore
import FeatureAnnouncementModal from "~/components/ui/FeatureAnnouncementModal.vue";
const { $errorTracker, $listen } = useNuxtApp();
const authStore = useAuthStore();
const { showModal: showCopyGateModal } = useCopyGate();

/* await Promise.all([
   useAuthStore().getUser(),
   useJobStore().fetchJobs(),
   useSettingStore().fetchSetting(),
   useLearnStore().fetchLearnCategories(),
   useLearnStore().fetchLearnResources(),
   useCompanyStore().fetchCompanies(),
 ]);
*/

let cleanCopyAllowedFn: Function | undefined;

// Feature announcements
const {
  markAsAnnounced,
  handleFeatureAction,
  checkForFeatureAnnouncements,
} = useFeatureAnnouncements();
const showFeatureModal = ref(false);
const featureConfig = ref<FeatureAnnouncementConfig | null>(null);
const currentFeatureId = ref<FeatureId | null>(null);

// Check for new features to announce using the reusable function
const initFeatureAnnouncements = () => {
  // Check for mock interview feature announcement
  const hasAnnouncement = checkForFeatureAnnouncements(
    FeatureId.MOCK_INTERVIEW,
    (config) => {
      featureConfig.value = config;
      currentFeatureId.value = FeatureId.MOCK_INTERVIEW;
      // Show modal after a short delay to ensure app is fully loaded
      setTimeout(() => {
        showFeatureModal.value = true;
      }, 1500);
    }
  );
  console.log("checkForFeatureAnnouncements returned:", hasAnnouncement);
};

const handleModalClose = () => {
  showFeatureModal.value = false;
  if (currentFeatureId.value) {
    markAsAnnounced(currentFeatureId.value);
  }
};

const handleFeatureActionClick = async () => {
  if (featureConfig.value && currentFeatureId.value) {
    await handleFeatureAction(featureConfig.value, currentFeatureId.value);
    showFeatureModal.value = false;
  }
};

const onError = (error: any) => {
  logDev("error", error);

  ($errorTracker as ErrorTrackerProvider).captureException(
    error,

    authStore.isAuthenticated ? { user: authStore.authUser } : undefined
  );
};

onMounted(async () => {
  //@ts-ignore
  cleanCopyAllowedFn = $listen(
    ApplicationEventEnum.onCopyAllowed,
    ({ data }: { data: Snippet }) => {
      useFluppets().handleFluppetsCopy(data);
    }
  );

  try {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}/_ws`;
    useWebSocket(wsUrl, {
      autoReconnect: true,
      onMessage: (ws, event: MessageEvent) => {
        logDev("data from websocket", event);
      },

      onConnected: (ws) => {
        logDev("connected to websocket");
      },
    });
  } catch (error) {
    ($errorTracker as ErrorTrackerProvider).captureException(
      error as Error,
      authStore.isAuthenticated ? { user: authStore.authUser } : undefined
    );
  }

  initFeatureAnnouncements();
});

onUnmounted(() => {
  if (cleanCopyAllowedFn) cleanCopyAllowedFn();
});
</script>
