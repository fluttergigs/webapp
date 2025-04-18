import { useStorage } from '@vueuse/core';
import { COUNTRIES_API_ENDPOINT } from '~/core/constants';
import { Country } from '~/core/shared/types';

const countriesKey = 'countries';

export default async function useCountries() {
  const countries = useStorage(countriesKey, () => []);

  if (countries.value.length > 0) {
    return { data: countries, error: null };
  }

  const { data, error } = await useFetch(COUNTRIES_API_ENDPOINT, {
    key: 'countries',
    mode: 'cors',

    default: () => ({ countries: [] }),
    transform: (countries: any) => {
      const result: Country[] = countries.map((country: any) => ({
        name: country.name.common,
        flag: { src: country.flags.svg, ico: country.flag },
        iso: country.cca3,
      }));

      localStorage.setItem(countriesKey, JSON.stringify(result));

      return result;
    },
  });

  return { data, error };
}
