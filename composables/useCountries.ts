import {COUNTRIES_API_ENDPOINT} from "~/core/constants";
import {Country} from "~/core/shared/types";

export default async function useCountries() {
    const {
        data,
        error,
        pending
    } = await useFetch(COUNTRIES_API_ENDPOINT, {
        transform: (countries) => {
            const result: [Country] = countries.map((country: any) => ({
                name: country.name.common,
                flag: {src: country.flags.svg, ico: country.flag,},
                iso: country.cca3,
            }));

            return {
                countries: result,
            }
        }
    })

    return { data, error}
}