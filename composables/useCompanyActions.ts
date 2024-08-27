import {AppRoutes} from "~/core/routes";
import type {Company, CreateCompanyRequest} from "~/features/companies/company.types";
import {useJobStore} from "~/stores/job";
import {useCompanyStore} from "~/stores/company";
import {AnalyticsEvent} from "~/services/analytics/events";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import type {JobOffer, JobOfferApiResponse, JobOfferEditRequest} from "~/features/jobs/job.types";
import type {CallbackFunction} from "~/core/shared/types";
import {BaseToast} from "~/core/ui/base_toast";
//@ts-ignore
import type {Notification} from "#ui/types";
import {useUserStore} from "~/stores/user";
import {useAuthStore} from "~/stores/auth";

export default function useCompanyActions() {
    const {$analytics, $toast} = useNuxtApp()
    const userStore = useUserStore()
    const jobStore = useJobStore()
    const companyStore = useCompanyStore()
    const handleJobCreation = () => {
        if (userStore.hasCompanies) {
            return navigateTo(AppRoutes.postJob)
        } else {
            return navigateTo(AppRoutes.createCompany)
        }
    }

    const checkCompanyExistenceGuard = () => {
        if (!userStore.hasCompanies) {
            return navigateTo(AppRoutes.createCompany)
        }
    }

    const createCompany = async (data: CreateCompanyRequest, onSuccess?: CallbackFunction<Company>) => {
        try {
            (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.companyCreationButtonClicked, data);
            await companyStore.createCompany({data});
            (<AppAnalyticsProvider>$analytics).capture(AnalyticsEvent.successfulCompanyCreation, data);

            if (!!onSuccess) {
                onSuccess();
            }
        } catch (e) {
            ($toast as BaseToast<Notification>).error(<string>companyStore.companyCreation.message)
        }
    }

    const postJobOffer = async (onSuccess?: CallbackFunction<JobOfferApiResponse>) => {
        try {
            ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.loginPageEntered);
            await jobStore.postJob();
            if (!!onSuccess) {
                onSuccess();
            }
        } finally {
            ($toast as BaseToast<Notification>).custom({
                color: 'primary',
                title: jobStore.jobCreation.message,
                timeout: 8000,
                actions: jobStore.jobCreation.isSuccess ? [{
                    label: 'View job',
                    click: () => navigateTo(AppRoutes.jobDetail(jobStore.jobCreation.value.data.attributes.slug))
                }] : null
            })
        }
    }

    const handleJobEdit = async (job: JobOffer) => {
        jobStore.setJobEditData(job)

        return navigateTo(AppRoutes.editJob(job.slug))
    }

    const handleJobDuplicate = async (job: JobOffer) => {
        let jobCreationData = job
        jobCreationData.applyBefore = new Date(job.applyBefore)
        jobStore.setJobCreationData(jobCreationData)
        handleJobCreation()
    }
    const editJobOffer = async (job: JobOffer | JobOfferEditRequest, onDone?: CallbackFunction<any>) => {
        try {
            ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.jobOfferUpdateButtonClicked, {job: jobStore.jobEditData});

            await jobStore.editJobOffer(jobStore.jobEditData as JobOffer);

            ($toast as BaseToast<Notification>).custom({
                title: jobStore.jobEdit.message, timeout: 8000, actions: [{
                    label: 'View job',

                    click: () => navigateTo(AppRoutes.jobDetail(job.slug!))
                }]
            })

            if (onDone != null) {
                onDone()
            }
        } catch (e) {
        } finally {
            ($toast as BaseToast<Notification>).custom({
                color: 'primary',
                title: jobStore.jobEdit.message,
                timeout: 8000,
                actions: jobStore.jobEdit.isSuccess ? [{
                    label: 'View job',
                    click: () => navigateTo(AppRoutes.jobDetail(job.slug!))
                }] : null
            })
        }
    }

    const hasSocialMedia = (company: Company) => {
        return !!company.linkedin || !!company.twitter
    }

    const onCompanyCreationSuccess: CallbackFunction<Company> = async () => {
        ($toast as BaseToast<Notification>).info(<string>companyStore.companyCreation.message)

        await useAuthStore().fetchUser()
        navigateTo(AppRoutes.myCompany)
    }

    return {
        handleJobEdit,
        editJobOffer,
        handleJobCreation,
        handleJobDuplicate,
        hasSocialMedia,
        checkCompanyExistenceGuard,
        postJobOffer,
        createCompany,
        onCompanyCreationSuccess
    };
}