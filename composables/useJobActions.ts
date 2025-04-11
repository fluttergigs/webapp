// @ts-ignore
import {useClipboard} from "@vueuse/core";
import type {DeleteSavedJobOfferRequest, JobOffer} from "~/features/jobs/job.types";
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
    const {$toast, $analytics} = useNuxtApp();
    const jobStore = useJobStore()
    const authStore = useAuthStore()

    const handleJobBookmark = async (job: JobOffer, onSuccess?: CallbackFunction<any>) => {
        try {
            const userStore = useUserStore()

            if (authStore.isAuthenticated) {
                userStore.jobToBookmark = job.id;
                if (isJobBookmarked(job)) {
                    ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.unBookmarkJobOfferClicked, {job});
                    const bookmarkedJob: JobOffer | undefined = useUserStore().bookmarkedJobs?.find((savedJob: JobOffer) => savedJob.id === job.id);
                    await userStore.deleteSavedJob(<DeleteSavedJobOfferRequest>{id: bookmarkedJob?.bookmarkedJob});
                    ($toast as BaseToast<Notification>).info(<string>userStore.bookmarkedJobDelete.message)
                } else {
                    ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.bookmarkJobOfferClicked, {job});
                    await userStore.saveJob({jobOffer: job.id, user: authStore.authUser?.id});
                    ($toast as BaseToast<Notification>).info(<string>userStore.bookmarkedJobCreation.message)
                }

                if (onSuccess != null) {
                    onSuccess()
                    return;
                }
            } else {
                authStore.returnUrl = AppRoutes.jobDetail(job.slug);

                ($toast as BaseToast<Notification>).custom({
                    color: 'primary',
                    title: 'You need to be logged-in to bookmark a job offer',
                    timeout: 8000,
                    actions: [{
                        label: 'Login',
                        click: () => navigateTo(AppRoutes.login)
                    }]
                })
            }
        } finally {

        }
    }

    const handleJobDelete = async (job: JobOffer, onDone?: CallbackFunction<any>) => {
        ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.jobOfferDeleteButtonClicked, {job});

        await jobStore.deleteJob({jobOffer: job.id});

        ($toast as BaseToast<Notification>).info(<string>jobStore.jobDelete.message)

        if (onDone != null) {
            onDone()
        }
    }

    const isJobBookmarked = (job: JobOffer): boolean => useUserStore().bookmarkedJobs?.filter((savedJob: JobOffer) => savedJob.id == job.id).length > 0

    const jobBelongsToCompany = (company: Company) =>
        (authStore.isAuthenticated && useUserStore().myCompany?.id === company.id)

    const shareJobOffer = async (job: JobOffer) => {
        ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.jobOfferShareButtonClicked, {job})

        const {copy} = useClipboard({
            source: `${location.href}`,
            legacy: true
        })

        await copy();
        ($toast as BaseToast<Notification>).info('Job link copied to your clipboard. You can share it :)')
    }

    const viewDetails = (job: JobOffer) => {
        ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.jobOfferClicked, {job});
        jobStore.findJobById(job)

        navigateTo(`${AppRoutes.jobDetail(job.slug)}`)
    }

    const jobWorkingPermits = (countries: Country[], job: JobOffer): Country[] => countries.filter(({iso}: Country) => (job.workPermits ?? []).join(' ').includes(iso))

    const userFacingWorkingPermits = (countries: Country[]) => `${countries[0].name} ${countries.length > 1 ? `+ ${countries.length - 1} more` : ' only'}`

    const handleJobApply = async (job: JobOffer) => {
        ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.jobOfferApplyButtonClicked, {job});

        if (authStore.isAuthenticated) {
            window.open(job.howToApply!, '_blank')
        } else {
            authStore.setReturnUrl(AppRoutes.jobDetail(job.slug) as string);

            ($toast as BaseToast<Notification>).custom({
                color: 'primary',
                title: 'You need an account to apply for a job offer',
                timeout: 12000,
                actions: [{
                    label: 'Login',
                    click: () => navigateTo(AppRoutes.login)
                }, {
                    label: 'Register',
                    click: () => navigateTo(AppRoutes.register)
                }]
            })
        }
    }

    return {
        handleJobApply,
        shareJobOffer,
        jobBelongsToCompany,
        viewDetails,
        jobWorkingPermits,
        userFacingWorkingPermits,
        isJobBookmarked,
        handleJobBookmark,
        handleJobDelete,
    }
}