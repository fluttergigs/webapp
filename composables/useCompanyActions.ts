import {AppRoutes} from "~/core/routes";
import type {Company} from "~/features/companies/company.types";
import {useJobStore} from "~/stores/job";
import {AnalyticsEvent} from "~/services/analytics/events";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import type {JobOfferApiResponse} from "~/features/jobs/job.types";
import type {CallbackFunction} from "~/core/shared/types";
import {BaseToast} from "~/core/ui/base_toast";
//@ts-ignore
import type {Notification} from "#ui/types";
import {useUserStore} from "~/stores/user";

export default function useCompanyActions() {
    const {$analytics, $toast} = useNuxtApp()
    const userStore = useUserStore()
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
            if (!!onSuccess) {
                onSuccess();
            }
        } finally {
            ($toast as BaseToast<Notification>).info(<string>useJobStore().jobCreation.message)
        }
    }

    const hasSocialMedia = (company: Company) => {
        return !!company.linkedin || !!company.twitter
    }

    return {handleJobCreation, hasSocialMedia, checkCompanyExistenceGuard, postJobOffer,};
}