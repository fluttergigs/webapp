// @ts-ignore
import {useClipboard} from "@vueuse/core";
import type {JobOffer} from "~/features/jobs/job.types";
import {useAuthStore} from "~/stores/auth";
import {Company} from "~/features/companies/company.types";
import {useJobStore} from "~/stores/job";
import {AppRoutes} from "~/core/routes";
import type {Country} from "~/core/shared/types";
import {CallbackFunction} from "~/core/shared/types";
import {useUserStore} from "~/stores/user";
import {BaseToast} from "~/core/ui/base_toast";
//@ts-ignore
import type {Notification} from "#ui/types";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";

export default function useJobActions() {
    const handleJobBookmark = async (job: JobOffer, onSuccess?: CallbackFunction<any>) => {
        try {
            const userStore = useUserStore()
            const {$toast, $analytics} = useNuxtApp();

            if (useAuthStore().isAuthenticated) {
                userStore.jobToBookmark = job.id;
                if (isJobBookmarked(job)) {
                    ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.unBookmarkJobOfferClicked, {job});
                    const bookmarkedJob: JobOffer = useUserStore().bookmarkedJobs?.find((savedJob: JobOffer) => savedJob.id === job.id);
                    await userStore.deleteSavedJob({id: bookmarkedJob.bookmarkedJob});
                    ($toast as BaseToast<Notification>).info(userStore.bookmarkedJobDelete.message)
                } else {
                    ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.bookmarkJobOfferClicked, {job});
                    await userStore.saveJob({jobOffer: job.id, user: useAuthStore().user.id});
                    ($toast as BaseToast<Notification>).info(userStore.bookmarkedJobCreation.message)
                }

                if (onSuccess != null) {
                    onSuccess()
                    return;
                }
            } else {
                navigateTo(AppRoutes.login)
            }
        } finally {

        }

    }
    const isJobBookmarked = (job: JobOffer): boolean => useUserStore().bookmarkedJobs?.filter((savedJob: JobOffer) => savedJob.id == job.id).length > 0

    const jobBelongsToCompany = (company: Company) =>
        (company.id === useAuthStore().myCompany.id) && useAuthStore().isAuthenticated

    const shareJobOffer = async ({slug}: JobOffer) => {
        const {$toast} = useNuxtApp()
        const {text, copy, copied,} = useClipboard({
            source: `${location.href}/jobs/${slug}`,
            legacy: true
        })

        await copy();
        ($toast as BaseToast<Notification>).info('Job link copied to your clipboard. You can share it :)')
    }

    const editJobOffer = async ({slug}: JobOffer) => {

    }
    const viewDetails = (job: JobOffer) => {
        (useNuxtApp().$analytics as AppAnalyticsProvider).capture(AnalyticsEvent.jobOfferClicked, {job});
        useJobStore().findJobById(job)
        navigateTo(AppRoutes.jobDetail(job.slug))
    }

    const jobWorkingPermits = (countries: Country[], job: JobOffer): Country[] => countries.filter(({iso}: Country) => (job.workPermits ?? []).join(' ').includes(iso))

    const userFacingWorkingPermits = (countries: Country[]) => `${countries[0].name} ${countries.length > 1 ? `+ ${countries.length - 1} more` : ' only'}`

    return {
        shareJobOffer,
        editJobOffer,
        jobBelongsToCompany,
        viewDetails,
        jobWorkingPermits,
        userFacingWorkingPermits,
        isJobBookmarked,
        handleJobBookmark
    }
}