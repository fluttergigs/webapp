import {Endpoint} from "~/core/network/endpoints";
import {logDev} from "~/core/helpers/log";

export default defineSitemapEventHandler(async (e) => {
    const {apiBaseUrl} = useRuntimeConfig();
    const {data} = await fetch(apiBaseUrl + Endpoint.jobOffers, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        method: "GET",
    }).then((res) => res.json());

    logDev('JOB OFFERS DATA', data)

    return data.map((job) => {
        return {
            loc: `/jobs/${job.attributes.slug}`,
            lastmod: job.attributes.updatedAt ?? job.attributes.createdAt,
        };
    });
});