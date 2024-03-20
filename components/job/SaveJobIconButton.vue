<script setup lang="ts">

//@ts-ignore
import {StarIcon} from "@heroicons/vue/24/solid";
import type {JobOffer} from "~/features/jobs/job.types";
import type {Company} from "~/features/companies/company.types";
import useJobActions from "~/composables/useJobActions";
import {AppStrings} from "~/core/strings";
import {useUserStore} from "~/stores/user";

//@ts-ignore
const props = defineProps({
  job: {
    type: Object as PropType<JobOffer>,
  },
  company: {
    type: Object as PropType<Company>
  }
})

const {handleJobBookmark, isJobBookmarked} = useJobActions()

const isBookmarked = computed(() => isJobBookmarked(props.job))

const onBookmarkClick = () => {
  handleJobBookmark(props.job, async () => {
    if (useUserStore().bookmarkedJobDelete.isSuccess || useUserStore().bookmarkedJobCreation.isSuccess) {
      await useUserStore().fetchBookmarkedJobOffers()
    }
  });
}
</script>

<template>
  <!--  todo change to false-->
  <UTooltip v-if="!useJobActions().jobBelongsToCompany(props.company)" :open-delay="200" :close-delay="100"
            :ui="{background: 'bg-gray-900', color: 'text-white'}"
            :text="isBookmarked? AppStrings.removeJobFromBookmarks:AppStrings.saveJobOffer">

    <div v-if="useUserStore().isHandlingBookmark && useUserStore().jobToBookmark === props.job.id">
      <UButton loading color="indigo" variant="ghost"/>
    </div>
    <div v-else @click.capture.stop="()=> onBookmarkClick()"
         :class="['cursor-pointer w-7 h-7 transition-all duration-300 ease-in-out',
         isBookmarked? 'text-yellow-500 hover:text-yellow-400': 'text-gray-300 hover:text-yellow-500']">

      <slot name="icon">
        <StarIcon/>
      </slot>
    </div>
  </UTooltip>
</template>

<style scoped>

</style>