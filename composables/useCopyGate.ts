// composables/useCopyGate.ts
import { useLocalStorage, useNow } from '@vueuse/core';
import { DAILY_FLUPPET_COPY_FOR_ANONYMOUS } from '~/core/constants';
import { logDev } from '~/core/helpers/log';
import { ApplicationEventEnum } from '~/plugins/eventBus.client';

import { computed, ref, watch } from 'vue';

export const fluttergigs_copy_count = 'fluttergigs_copy_count';
export const fluttergigs_last_reset = 'fluttergigs_last_reset';
export const copyCounter = 'copy-counter';

let useCopyGateStateRef: ReturnType<typeof createCopyGateState> | null = null;

function createCopyGateState(limit: number = DAILY_FLUPPET_COPY_FOR_ANONYMOUS) {
  const { isAuthenticated } = useUser(); // ou useSupabaseUser() / useStrapiUser() etc.

  const isAnonymous = computed(() => !isAuthenticated.value);
  // Clé locale du compteur et date
  const localCopyCount = useLocalStorage(fluttergigs_copy_count, 0);
  const lastResetDate = useLocalStorage(fluttergigs_last_reset, '');

  // État global partagé (utile pour dashboard ou badge UI)
  const globalCopyCount = useState<number>(copyCounter, () => localCopyCount.value);

  // ⏱ Reset automatique à minuit pour anonymes
  const now = useNow();
  watch(now, () => {
    if (isAuthenticated.value) return;

    const today = new Date().toISOString().split('T')[0];
    if (lastResetDate.value !== today) {
      globalCopyCount.value = 0;
      lastResetDate.value = today;
    }
  });

  // Sync local ↔ global
  watch(globalCopyCount, (val) => {
    if (!isAuthenticated.value) localCopyCount.value = val;
  });

  const showModal = ref(false);
  const remainingCopies = computed(() => Math.max(limit - globalCopyCount.value, 0));
  const canCopy = computed(() => remainingCopies.value > 0);

  function copy<T extends {}>(data: T) {
    if (canCopy.value) {
      //@ts-ignore
      useNuxtApp().$event(ApplicationEventEnum.onCopyAllowed, { data });
      globalCopyCount.value++;
      if (!canCopy.value) showModal.value = true;
    } else {
      showModal.value = true;
    }
  }

  function resetManually() {
    if (isAnonymous.value) globalCopyCount.value = 0;
  }

  const toggleModal = () => {
    showModal.value = !showModal.value;
  };

  return {
    canCopy,
    remainingCopies,
    showModal,
    isAnonymous,
    resetManually,
    copy,
    toggleModal,
  };
}

export function useCopyGate(limit = DAILY_FLUPPET_COPY_FOR_ANONYMOUS) {
  // Create the state only once when this composable is first called
  if (!useCopyGateStateRef) {
    useCopyGateStateRef = createCopyGateState(limit);
  }

  return useCopyGateStateRef;
}
