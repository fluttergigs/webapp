import {COUNTRIES_API_ENDPOINT} from "~/core/constants";
import {Country} from "~/core/shared/types";

import {useStorage} from '@vueuse/core'

const countriesKey = "countries"

export default async function useCountries() {
    const countries = useStorage(countriesKey, () => [])
    if (countries.length > 0) {
        return {data: countries, error: null}
    }

    const {
        data,
        error,
    } = await useFetch(COUNTRIES_API_ENDPOINT, {
        key: "countries",
        mode: "cors",
        default: () => ({countries: []}),

        transform: (countries) => {
            const result: [Country] = countries.map((country: any) => ({
                name: country.name.common,
                flag: {src: country.flags.svg, ico: country.flag,},
                iso: country.cca3,
            }));

            useStorage("countries", result)

            return {
                countries: result,
            }
        }
    })

    return {data, error}
}