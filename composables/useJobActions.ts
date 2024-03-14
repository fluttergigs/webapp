// @ts-ignore
import {useClipboard} from "@vueuse/core";
import type {JobOffer} from "~/features/jobs/job.types";
import {useAuthStore} from "~/stores/auth";
import {Company} from "~/features/companies/company.types";
import {useJobStore} from "~/stores/job";
import {AppRoutes} from "~/core/routes";
import type {Country} from "~/core/shared/types";


export default function useJobActions() {
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

    return {shareJobOffer, editJobOffer, jobBelongsToCompany, viewDetails, jobWorkingPermits, userFacingWorkingPermits}
}