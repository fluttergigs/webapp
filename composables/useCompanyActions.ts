import {AppRoutes} from "~/core/routes";
import type {Company} from "~/features/companies/company.types";
import {useJobStore} from "~/stores/job";
import {AnalyticsEvent} from "~/services/analytics/events";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import type {JobEditRequest, JobOfferApiResponse} from "~/features/jobs/job.types";
import {JobOffer} from "~/features/jobs/job.types";
import type {CallbackFunction} from "~/core/shared/types";
import {BaseToast} from "~/core/ui/base_toast";
//@ts-ignore
import type {Notification} from "#ui/types";
import {useUserStore} from "~/stores/user";
//@ts-ignore
import {useClipboard} from "@vueuse/core";
import {stringify} from "qs";
import {HttpClient} from "~/core/network/http_client";
import {Endpoint} from "~/core/network/endpoints";

export default function useCompanyActions() {
    const {$analytics, $toast} = useNuxtApp()
    const userStore = useUserStore()
    const jobStore = useJobStore()
    const handleJobCreation = () => userStore.hasCompanies ? navigateTo(AppRoutes.postJob) : navigateTo(AppRoutes.createCompany)

    const checkCompanyExistenceGuard = () => {
        if (!userStore.hasCompanies) {
            return navigateTo(AppRoutes.createCompany)
        }
    }

    const shareCompany = async ({slug}: Company) => {
        const {text, copy, copied,} = useClipboard({
            source: `${location.href}/companies/${slug}`,
            legacy: true
        })

        await copy();
        ($toast as BaseToast<Notification>).info('Company link copied to your clipboard. You can share it :)')
    }

    const postJobOffer = async (onSuccess?: CallbackFunction<JobOfferApiResponse>) => {
        try {
            ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.loginPageEntered);
            await jobStore.postJob();
            if (!!onSuccess) {
                onSuccess();
            }
        } finally {
            //@ts-ignore
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

    const editJobOffer = async (job: JobOffer | JobEditRequest, onDone?: CallbackFunction<any>) => {
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
            //@ts-ignore
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

    const fetchCompaniesJob = async (companyId: number) => {
        const {$http} = useNuxtApp()

        const query = stringify({
            populate: '*',
            filters: {
                company: {
                    id: {
                        $eq: companyId,
                    }
                }
            },
            sort: 'createdAt:desc',
        }, {
            encodeValuesOnly: true,
        })
        return await (<HttpClient>$http).get(`${Endpoint.jobOffers}?${query}`);


    }

    const hasSocialMedia = (company: Company) => !!company.linkedin || !!company.twitter

    return {
        handleJobCreation,
        hasSocialMedia,
        checkCompanyExistenceGuard,
        postJobOffer,
        editJobOffer,
        handleJobEdit,
        shareCompany,
        fetchCompaniesJob,
    };
}