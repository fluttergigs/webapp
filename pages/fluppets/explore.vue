import { AnalyticsEvent } from "~/services/analytics/events";

<script lang="ts" setup>

  import { AnalyticsEvent } from '~/services/analytics/events';

  onMounted(() => {

    useAnalytics().capture(AnalyticsEvent.browseFluppetsPageEntered);
  });
</script>

<template></template>

<style scoped></style>
