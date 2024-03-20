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


export default function useJobActions() {
    const handleJobBookmark = async (job: JobOffer, onSuccess?: CallbackFunction<any>) => {
        try {
            const userStore = useUserStore()
            const {$toast} = useNuxtApp()
            if (useAuthStore().isAuthenticated) {
                userStore.jobToBookmark = job.id;
                if (isJobBookmarked(job)) {
                    const bookmarkedJob: JobOffer = useUserStore().bookmarkedJobs?.find((savedJob: JobOffer) => savedJob.id === job.id);
                    await userStore.deleteSavedJob({id: bookmarkedJob.bookmarkedJob});
                    // @ts-ignore
                    $toast.info(userStore.bookmarkedJobDelete.message)
                } else {
                    await userStore.saveJob({jobOffer: job.id, user: useAuthStore().user.id})
                    // @ts-ignore
                    $toast.info(userStore.bookmarkedJobCreation.message)
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
        // @ts-ignore
        $toast.info('Job link copied to your clipboard. You can share it :)')
    }

    const editJobOffer = async ({slug}: JobOffer) => {

    }
    const viewDetails = (job: JobOffer) => {
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