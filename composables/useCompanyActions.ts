import {useAuthStore} from "~/stores/auth";
import {AppRoutes} from "~/core/routes";
import type {Company} from "~/features/companies/company.types";

export default function useCompanyActions() {
    const handleJobCreation = () => {
        if (useAuthStore().hasCompanies) {
            //TODO - go to job offer creation
        } else {
           return navigateTo(AppRoutes.createCompany)
        }
    }

    const hasSocialMedia = (company: Company) =>{
        return !!company.linkedin || !!company.twitter
    }

    return {handleJobCreation, hasSocialMedia};
}