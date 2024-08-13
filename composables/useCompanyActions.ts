import {AppRoutes} from "~/core/routes";
import type {Company, CreateCompanyRequest} from "~/features/companies/company.types";
import {useJobStore} from "~/stores/job";
import {useCompanyStore} from "~/stores/company";
import {AnalyticsEvent} from "~/services/analytics/events";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import type {JobOfferApiResponse} from "~/features/jobs/job.types";
import type {CallbackFunction} from "~/core/shared/types";
import {BaseToast} from "~/core/ui/base_toast";
//@ts-ignore
import type {Notification} from "#ui/types";
import {useUserStore} from "~/stores/user";
import {useAuthStore} from "~/stores/auth";

export default function useCompanyActions() {
    const {$analytics, $toast} = useNuxtApp()
    const userStore = useUserStore()
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

    const postJobOffer = async (onSuccess?: CallbackFunction<JobOfferApiResponse>) => {
        try {
            ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.loginPageEntered);
            await useJobStore().postJob();
            if (onSuccess != null) {
                onSuccess();
            }
        } finally {
            ($toast as BaseToast<Notification>).info(<string>useJobStore().jobCreation.message)
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

    const hasSocialMedia = (company: Company) => {
        return !!company.linkedin || !!company.twitter
    }

    const onCompanyCreationSuccess: CallbackFunction<Company> = async () => {
        ($toast as BaseToast<Notification>).info(<string>companyStore.companyCreation.message)

        await useAuthStore().fetchUser()
        navigateTo(AppRoutes.myCompany)
    }

    return {
        handleJobCreation,
        hasSocialMedia,
        checkCompanyExistenceGuard,
        postJobOffer,
        createCompany,
        onCompanyCreationSuccess
    };
}