<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">Interview Usage</h3>
    </template>

    <div class="space-y-4">
      <div v-if="isLoading" class="text-center py-4">
        <USkeleton class="h-4 w-full mb-2" />
        <USkeleton class="h-4 w-3/4" />
      </div>

      <div v-else-if="usage" class="space-y-4">
        <!-- Usage Progress -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="font-medium text-gray-600">This Month</span>
            <span>{{ currentUsage }} / {{ limit }}</span>
          </div>

          <UProgress
            :value="(currentUsage / limit) * 100"
            :color="isNearLimit ? 'red' : 'primary'"
          />

          <div class="text-xs text-gray-500">{{ remaining }} interviews remaining</div>
        </div>

        <!-- Tier Information -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-600">Plan</span>
          <UBadge
            :color="tier === 'paid' ? 'green' : 'gray'"
            :label="tier === 'paid' ? 'Pro' : 'Free'"
          />
        </div>

        <!-- Message -->
        <div v-if="message" class="p-3 rounded-lg bg-blue-50 text-blue-800 text-sm">
          {{ message }}
        </div>

        <!-- Limit Warning -->
        <div v-if="!canUse" class="p-3 rounded-lg bg-red-50 text-red-800 text-sm">
          <p class="font-medium">Usage limit reached</p>
          <p class="text-xs mt-1">Upgrade to Pro for more interviews this month</p>
        </div>
      </div>

      <div v-else class="text-center py-4 text-gray-500">
        <p>No usage data available</p>
      </div>
    </div>

    <template #footer v-if="!isLoading">
      <div class="flex justify-between">
        <UButton v-if="!canUse && tier === 'free'" color="primary" @click="$emit('upgrade')">
          Upgrade to Pro
        </UButton>

        <UButton color="gray" variant="ghost" @click="$emit('refresh')"> Refresh </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
  interface UsageInfo {
    current?: number;
    limit?: number;
    remaining?: number;
    percentage?: number;
    tier?: 'free' | 'paid';
    canUse?: boolean;
    resetDate?: string;
  }

  interface LegacyUsage {
    currentCount?: number;
    limit?: number;
    tier?: 'free' | 'paid';
    canUse?: boolean;
    message?: string;
  }

  interface Props {
    usage?: UsageInfo | LegacyUsage | null;
    isLoading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
  });

  const emit = defineEmits<{
    upgrade: [];
    refresh: [];
  }>();

  // Computed properties to handle both new and legacy formats
  const currentUsage = computed(() => {
    if (!props.usage) return 0;
    return props.usage.current || props.usage.currentCount || 0;
  });

  const limit = computed(() => {
    if (!props.usage) return 3;
    return props.usage.limit || 3;
  });

  const tier = computed(() => {
    if (!props.usage) return 'free';
    return props.usage.tier || 'free';
  });

  const canUse = computed(() => {
    if (!props.usage) return true;
    return props.usage.canUse !== false;
  });

  const message = computed(() => {
    if (!props.usage) return null;
    return (props.usage as LegacyUsage).message || null;
  });

  const remaining = computed(() => {
    return Math.max(0, limit.value - currentUsage.value);
  });

  const isNearLimit = computed(() => {
    const percentage = currentUsage.value / limit.value;
    return percentage >= 0.8; // 80% or more
  });
</script>
