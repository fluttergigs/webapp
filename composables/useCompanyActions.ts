import {useAuthStore} from "~/stores/auth";
import {AppRoutes} from "~/core/routes";

export default function useCompanyActions() {
    const handleJobCreation = () => {
        if (useAuthStore().hasCompanies) {
            //TODO - go to job offer creation
        } else {
           return navigateTo(AppRoutes.createCompany)
        }
    }

    return {handleJobCreation};
}