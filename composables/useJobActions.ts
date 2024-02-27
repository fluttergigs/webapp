// @ts-ignore
import {useClipboard} from "@vueuse/core";
import type {JobOffer} from "~/features/jobs/job.types";


export default function useJobActions() {

    const shareJobOffer = async ({slug}: JobOffer) => {
        const {text, copy, copied,} = useClipboard({
            source: `${location.href}/jobs/${slug}`,
            legacy: true
        })

        await copy();
    }

    return {shareJobOffer}
}